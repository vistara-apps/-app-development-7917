# ScholarSift Deployment Guide

This document provides instructions for deploying ScholarSift to various environments.

## Prerequisites

- Node.js 18.x or later
- npm 9.x or later
- Supabase account
- OpenAI API key

## Environment Setup

1. Clone the repository:

```bash
git clone https://github.com/your-org/scholarsift.git
cd scholarsift
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

4. Update the `.env` file with your API keys and configuration:

```
# OpenAI API Configuration
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## Supabase Setup

1. Create a new Supabase project
2. Run the database setup SQL script:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  email TEXT NOT NULL,
  subscription_tier TEXT NOT NULL DEFAULT 'free',
  summaries_used INTEGER NOT NULL DEFAULT 0,
  summaries_limit INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create summaries table
CREATE TABLE summaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  summary_text TEXT NOT NULL,
  key_findings JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  tier TEXT NOT NULL DEFAULT 'free',
  status TEXT NOT NULL DEFAULT 'active',
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  payment_provider TEXT,
  payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own profile"
ON profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own summaries"
ON summaries FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own summaries"
ON summaries FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own summaries"
ON summaries FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own summaries"
ON summaries FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own subscriptions"
ON subscriptions FOR SELECT
USING (auth.uid() = user_id);

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, subscription_tier, summaries_used, summaries_limit)
  VALUES (new.id, new.email, 'free', 0, 5);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

3. Set up authentication providers in the Supabase dashboard

## Local Development

1. Start the development server:

```bash
npm run dev
```

2. Open your browser and navigate to `http://localhost:5173`

## Production Build

1. Build the production version:

```bash
npm run build
```

2. Preview the production build locally:

```bash
npm run preview
```

## Deployment Options

### Vercel

1. Install the Vercel CLI:

```bash
npm install -g vercel
```

2. Deploy to Vercel:

```bash
vercel
```

3. For production deployment:

```bash
vercel --prod
```

### Netlify

1. Install the Netlify CLI:

```bash
npm install -g netlify-cli
```

2. Deploy to Netlify:

```bash
netlify deploy
```

3. For production deployment:

```bash
netlify deploy --prod
```

### Docker

1. Build the Docker image:

```bash
docker build -t scholarsift .
```

2. Run the Docker container:

```bash
docker run -p 8080:80 scholarsift
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| VITE_OPENAI_API_KEY | OpenAI API key | Yes |
| VITE_SUPABASE_URL | Supabase project URL | Yes |
| VITE_SUPABASE_ANON_KEY | Supabase anonymous key | Yes |

## Monitoring and Logging

For production deployments, consider setting up:

1. Error tracking with Sentry
2. Performance monitoring with New Relic or Datadog
3. Log aggregation with Loggly or Papertrail

## Security Considerations

1. Always use environment variables for API keys
2. Enable HTTPS for all production deployments
3. Implement rate limiting for API endpoints
4. Regularly update dependencies for security patches

## Continuous Integration/Continuous Deployment (CI/CD)

Sample GitHub Actions workflow (`.github/workflows/deploy.yml`):

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        env:
          VITE_OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          VITE_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## Troubleshooting

### Common Issues

1. **API Key Issues**: Ensure your API keys are correctly set in the environment variables
2. **CORS Errors**: Check Supabase project settings for correct CORS configuration
3. **Build Failures**: Verify Node.js and npm versions match requirements

### Support

For additional support, contact the development team at support@scholarsift.com

