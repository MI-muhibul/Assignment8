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
