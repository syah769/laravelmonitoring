import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface MetricsPayload {
  timestamp: string;
  memory_usage: number;
  cpu_usage: number;
  disk_usage: number;
  active_users: number;
  response_time: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get API key from Authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid authorization header' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const apiKey = authHeader.replace('Bearer ', '')

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Find project by API key
    const { data: project, error: projectError } = await supabaseClient
      .from('projects')
      .select('id')
      .eq('api_key', apiKey)
      .eq('status', 'active')
      .single()

    if (projectError || !project) {
      return new Response(
        JSON.stringify({ error: 'Invalid API key or inactive project' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Parse request body
    const metrics: MetricsPayload = await req.json()

    // Insert metrics data
    const { error: insertError } = await supabaseClient
      .from('system_metrics')
      .insert({
        project_id: project.id,
        timestamp: metrics.timestamp,
        memory_usage: metrics.memory_usage,
        cpu_usage: metrics.cpu_usage,
        disk_usage: metrics.disk_usage,
        active_users: metrics.active_users,
        response_time: metrics.response_time,
      })

    if (insertError) {
      console.error('Error inserting metrics:', insertError)
      return new Response(
        JSON.stringify({ error: 'Failed to store metrics' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Update project last_ping
    await supabaseClient
      .from('projects')
      .update({ last_ping: new Date().toISOString() })
      .eq('id', project.id)

    return new Response(
      JSON.stringify({ success: true }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error processing metrics:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})