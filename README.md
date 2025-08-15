# Kampala Buzz

This is a Next.js application for Kampala Buzz, a real-time nightlife discovery app.

## Getting Started

First, you'll need to set up your environment variables. Create a file named `.env.local` in the root of the project by copying the example file:

```bash
cp .env.local.example .env.local
```

Next, open `.env.local` and add your Google Maps API key. You can get one from the [Google Cloud Console](https://console.cloud.google.com/google/maps-apis/overview). Make sure to enable the **Maps JavaScript API**.

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.
