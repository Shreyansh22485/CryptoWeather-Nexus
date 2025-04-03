This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Environment Variables

This project requires the following environment variables:

```env
# CoinGecko API (Future use if rate limiting requires an API key)
COINGECKO_API_KEY=your_coingecko_api_key

# OpenWeatherMap API
OPENWEATHER_API_KEY=your_openweather_api_key

# NewsData.io API
NEWSDATA_API_KEY=your_newsdata_api_key
```

Create a `.env.local` file in the root of your project with these variables.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## GitHub and Vercel Deployment

### Adding to GitHub

1. Create a new repository on GitHub
2. Initialize your local repository and add the GitHub repository as remote:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/crptoweather-nexus.git
git push -u origin main
```

### Deploying on Vercel

1. Sign up or log in to [Vercel](https://vercel.com)
2. Click "New Project" and import your GitHub repository
3. Configure the project settings:
   - Framework preset: Next.js
   - Root directory: `./` (if your project is at the root)
   - Build command: Leave as default (`next build`)
   - Output directory: Leave as default (`.next`)
4. Add the environment variables in the Vercel project settings
5. Click "Deploy"

Vercel will automatically build and deploy your application. Each time you push changes to your GitHub repository, Vercel will automatically redeploy your application.

You can access your deployed application at `https://crptoweather-nexus.vercel.app` (or a custom domain if configured).
