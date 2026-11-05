# Good Neighbors

Live site: **Not deployed yet.** Replace this line with the client URL after deployment.

Good Neighbors helps people discover and organize local community-service events.

## Features

- Browse upcoming neighborhood events and filter them by category.
- Register and log in using email and password.
- Publish events with a future date, location, image, and description.
- Join events and see your upcoming commitments.
- Edit and delete your own events.
- Update your profile name and profile picture.
- Switch between light and dark themes.
- Responsive layouts, event loading skeletons, and accessible feedback messages.

## Local development

1. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_API_URL`.
2. Install dependencies with `npm install`.
3. Start the Good Neighbors API server (see its repository README).
4. Run `npm run dev`, then open `http://localhost:3000`.

The client uses Next.js App Router, React, and TypeScript.

## Deploy the client and connect the API

The client can be hosted on Vercel while the Express API runs on Render:

1. Deploy the server repository to Render using its `render.yaml` Blueprint. Configure `MONGODB_URI` and, after deployment, set `CLIENT_ORIGIN` to the exact production client origin.
2. Copy the Render service URL, for example `https://good-neighbors-api.onrender.com`.
3. In the Vercel project for this client repository, add `NEXT_PUBLIC_API_URL` with that API URL (no trailing slash). It is a public URL, not a secret.
4. Redeploy the client after setting the variable. `NEXT_PUBLIC_` values are included in the browser bundle at build time.
5. Test `https://good-neighbors-api.onrender.com/api/health`, then try registering and creating an event on the live client.

Do not put the MongoDB URI or JWT secret in the client or any `NEXT_PUBLIC_` variable. If using a different frontend host, configure the same `NEXT_PUBLIC_API_URL` build-time variable there and update the Render `CLIENT_ORIGIN` to that site's exact origin.
