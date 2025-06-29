import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface ErrorPayload {
  timestamp: string;
  level: 'error' | 'warning' | 'info' | 'critical';
  message: string;
  file: string;
  line: number;
  trace: string;
  user_id?: string;
  ip_address: string;
  user_agent: string;
  request_url: string;
  request_method: string;
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
    const errorData: ErrorPayload = await req.json()

    // Insert error data
    const { error: insertError } = await supabaseClient
      .from('error_logs')
      .insert({
        project_id: project.id,
        timestamp: errorData.timestamp,
        level: errorData.level,
        message: errorData.message,
        file: errorData.file,
        line: errorData.line,
        trace: errorData.trace,
        user_id: errorData.user_id || null,
        ip_address: errorData.ip_address,
        user_agent: errorData.user_agent,
        request_url: errorData.request_url,
        request_method: errorData.request_method,
      })

    if (insertError) {
      console.error('Error inserting error log:', insertError)
      return new Response(
        JSON.stringify({ error: 'Failed to store error log' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error processing error log:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})