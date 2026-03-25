# PropBook Frontend

This app uses Firebase Auth for login, Firestore for property data, and Cloudinary for property image uploads.

## Environment setup

Add these keys to `.env`:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...

VITE_CLOUDINARY_CLOUD_NAME=...
VITE_CLOUDINARY_UPLOAD_PRESET=...
VITE_CLOUDINARY_FOLDER=propbook
```

## Cloudinary free setup

1. Create a free Cloudinary account.
2. Copy your cloud name from the Cloudinary dashboard.
3. Create an unsigned upload preset in Cloudinary Settings > Upload.
4. Put that preset name in `VITE_CLOUDINARY_UPLOAD_PRESET`.

The app uploads images directly from the browser to Cloudinary, so Firebase Storage is no longer needed.
