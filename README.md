# Laravel Production Monitor - SaaS Dashboard

A comprehensive SaaS solution for monitoring multiple Laravel applications from a centralized dashboard.

## Features

- 🔐 **Multi-tenant Authentication** - Secure user accounts
- 📊 **Real-time Monitoring** - Live performance metrics
- 🚨 **Error Tracking** - Comprehensive error logging
- 📈 **Performance Analytics** - Memory, CPU, response time tracking
- 🎯 **Multi-project Support** - Monitor unlimited Laravel apps
- 📱 **Responsive Design** - Works on all devices

## Quick Setup

### 1. Supabase Setup

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project or select existing one
3. Go to **Settings** → **API** and copy:
   - Project URL
   - Anon public key

4. Create `.env` file:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Database Migration

The migration file is already created. In Supabase:

1. Go to **SQL Editor**
2. Click **New Query**
3. Copy content from `supabase/migrations/20250629044738_spring_fog.sql`
4. Run the query

This will create:
- `projects` table
- `system_metrics` table  
- `error_logs` table
- All necessary indexes and RLS policies

### 3. Edge Functions Deployment

The edge functions are already created in `supabase/functions/`. These handle:
- `/api/metrics` - Receive performance data
- `/api/errors` - Receive error logs
- `/api/ping` - Health checks

Functions will be automatically deployed when you connect to Supabase.

### 4. Laravel Package Installation

Follow the complete guide in `LARAVEL_PACKAGE.md` to:
1. Create the monitoring package
2. Install in your Laravel applications
3. Configure API keys

## Usage

1. **Sign Up/Login** to the dashboard
2. **Add Projects** - Create entries for each Laravel app
3. **Install Package** in Laravel apps using the provided API key
4. **Monitor** - View real-time data in the dashboard

## Architecture

```
Laravel App 1 ──┐
Laravel App 2 ──┼──► SaaS Dashboard ──► Supabase
Laravel App 3 ──┘    (This System)
```

## Development

```bash
npm install
npm run dev
```

## Production Deployment

```bash
npm run build
```

Deploy the `dist` folder to your hosting provider.

## Support

For issues or questions, please check the documentation or create an issue.