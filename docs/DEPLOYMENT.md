# Deployment Guide

## Replit Deployments (Recommended)

1. **Connect Repository**
   - Link your GitHub repository to Replit
   - Replit will automatically detect the Node.js project

2. **Configure Environment Variables**
   ```
   DATABASE_URL=your_postgresql_connection
   COINBASE_API_KEY=your_api_key
   NEBULA_API_KEY=your_nebula_key
   ```

3. **Deploy**
   - Click "Deploy" in Replit
   - Your app will be available at `https://your-app-name.replit.app`

## Vercel Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Configure Environment Variables**
   - Add variables in Vercel dashboard
   - Ensure database is accessible

## Railway Deployment

1. **Connect GitHub Repository**
   - Go to Railway dashboard
   - Connect your repository

2. **Configure Build Settings**
   ```
   Build Command: npm run build
   Start Command: npm start
   ```

3. **Add Environment Variables**
   - Configure all required variables
   - Deploy automatically triggers

## Environment Variables

Required for all deployments:

```env
# Database
DATABASE_URL=postgresql://...

# API Keys
COINBASE_API_KEY=...
NEBULA_API_KEY=...

# Optional
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=...
```

## Database Setup

For production deployments:

1. **PostgreSQL Database**
   - Use Neon, Railway, or Supabase
   - Copy connection string to `DATABASE_URL`

2. **Run Migrations**
   ```bash
   npm run db:push
   ```

## Domain Configuration

- Custom domains supported on all platforms
- Configure DNS records as required
- SSL certificates automatically provisioned

## Monitoring

- Application logs available in deployment dashboard
- Set up error tracking with Sentry
- Monitor performance metrics