# LensVault

Full-stack image publishing app with:

- Flask backend with one-time admin setup and JWT authentication
- React + Vite frontend with Tailwind CSS
- SQLite metadata storage
- Cloudinary image hosting
- Public view-only share pages for every uploaded image

## Project structure

```text
backend/
  app.py
  config.py
  .env.example
  requirements.txt
  middleware/
  models/
  routes/
  utils/
frontend/
  .env.example
  index.html
  package.json
  postcss.config.js
  tailwind.config.js
  vite.config.js
  src/
  public/
```

## Features

- One-time admin account creation, followed by login
- JWT-protected upload and gallery endpoints
- Cloudinary uploads with file type and size validation
- Unique public share URL for each image
- Public image page with premium responsive UI
- Drag-and-drop upload interface
- Upload progress feedback, toasts, and loading states
- Admin dashboard with image library and one-click link copy

## Backend setup

1. Create a virtual environment and activate it.
2. Install dependencies:

   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. Copy `.env.example` to `.env`.
4. Fill in:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `JWT_SECRET_KEY`
   - `SECRET_KEY`
5. Start the API:

   ```bash
   python app.py
   ```

The Flask server runs on `http://localhost:5000`.

On first launch, open the frontend and create your admin account from the setup form.

## Frontend setup

1. Install dependencies:

   ```bash
   cd frontend
   npm install
   ```

2. Copy `.env.example` to `.env`.
3. Set `VITE_API_BASE_URL=http://localhost:5000`
4. Start the frontend:

   ```bash
   npm run dev
   ```

The Vite app runs on `http://localhost:5173`.

## Example environment files

Backend:

```env
SECRET_KEY=replace-with-a-strong-random-secret
JWT_SECRET_KEY=replace-with-a-different-strong-random-secret
JWT_EXPIRATION_HOURS=24
DATABASE_URL=sqlite:///private_image_share.db
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
CLOUDINARY_FOLDER=private-image-share-platform
PUBLIC_FRONTEND_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:5173
MAX_UPLOAD_SIZE_MB=10
```

Frontend:

```env
VITE_API_BASE_URL=http://localhost:5000
```

## API routes

- `GET /auth/status`
- `POST /setup-admin`
- `POST /login`
- `POST /upload` (protected)
- `GET /image/<id>`
- `GET /images` (protected)
- `GET /health`

## Production notes

- Set strong secrets for `SECRET_KEY` and `JWT_SECRET_KEY`.
- Point `PUBLIC_FRONTEND_URL` to your deployed frontend domain.
- Update `CORS_ORIGINS` to your deployed frontend origin.
- SQLite is included for simplicity. Swapping to PostgreSQL later only requires changing `DATABASE_URL`.
