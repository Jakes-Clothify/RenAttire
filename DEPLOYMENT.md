# Deployment Guide

This project is set up to deploy with:

- `frontend` on Vercel
- `backend` on Render
- MongoDB hosted separately, typically MongoDB Atlas

## 1. Deploy the backend to Render

You already have a root-level [`render.yaml`](C:/Users/ACER/Documents/version%202/desktop-tutorial/render.yaml), so Render can create the service from that file.

### Render setup

1. Push this repo to GitHub.
2. In Render, click `New +` -> `Blueprint`.
3. Select your GitHub repo.
4. Render should detect [`render.yaml`](C:/Users/ACER/Documents/version%202/desktop-tutorial/render.yaml) and create the backend service.

### Backend environment variables

Set these in Render for the backend service:

- `MONGODB_URI` = your MongoDB connection string
- `JWT_SECRET` = a long random secret
- `FRONTEND_URL` = `https://renattire.vercel.app`
- `CORS_ORIGINS` = optional extra allowed origins, comma-separated
- `PORT` is provided by Render automatically

### Health check

Render is already configured to use:

- `/api/health`

After deploy, your backend URL will look like:

- `https://renattire.onrender.com`

Test these:

- `https://renattire.onrender.com/`
- `https://renattire.onrender.com/api/health`

## 2. Deploy the frontend to Vercel

This repo already includes a root-level [`vercel.json`](C:/Users/ACER/Documents/version%202/desktop-tutorial/vercel.json) that builds the React app from the `frontend` folder.

### Vercel setup

1. In Vercel, click `Add New...` -> `Project`
2. Import the same GitHub repo
3. Keep the project root as the repository root
4. Vercel should use the root [`vercel.json`](C:/Users/ACER/Documents/version%202/desktop-tutorial/vercel.json)

### Frontend environment variable

Add this in Vercel:

- `REACT_APP_API_URL` = `https://renattire.onrender.com`

Do not add `/api` at the end. The frontend already appends it automatically.

## 3. Connect both deployments

The safest order is:

1. Deploy backend on Render
2. Copy the Render backend URL into Vercel as `REACT_APP_API_URL`
3. Deploy frontend on Vercel
4. Copy the final Vercel frontend URL into Render as `FRONTEND_URL`
5. Redeploy the backend once after updating `FRONTEND_URL`

## 4. Important production note

The backend currently stores uploaded images in:

- [`backend/uploads`](C:/Users/ACER/Documents/version%202/desktop-tutorial/backend/uploads)

On Render, local disk for a normal web service is not reliable long-term for user uploads. Files can disappear after restart or redeploy.

That means:

- image uploads may work at first
- uploaded files may not persist permanently in production

For a real production setup, move uploads to external storage such as Cloudinary, AWS S3, or Uploadcare.

## 5. Quick checklist

- MongoDB Atlas database is reachable from Render
- Render backend has `MONGODB_URI`
- Render backend has `JWT_SECRET`
- Render backend has `FRONTEND_URL`
- Vercel frontend has `REACT_APP_API_URL`
- Frontend points to the Render backend, not localhost
- Backend health endpoint returns `{ "status": "ok" }`

## 6. Local config examples

Use these example files as references:

- [`backend/.env.example`](C:/Users/ACER/Documents/version%202/desktop-tutorial/backend/.env.example)
- [`frontend/.env.example`](C:/Users/ACER/Documents/version%202/desktop-tutorial/frontend/.env.example)
