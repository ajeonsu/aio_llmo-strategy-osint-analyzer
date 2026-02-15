# Backend Firebase Admin Setup for Vercel

## Step 1: Generate Firebase Admin Service Account

1. Go to **Firebase Console**: https://console.firebase.google.com/
2. Select your project: **aio-llmo-analyzer**
3. Click the **⚙️ gear icon** → **Project settings**
4. Go to **Service accounts** tab
5. Click **Generate new private key**
6. Save the JSON file (DO NOT SHARE THIS FILE!)

## Step 2: Extract Values from Service Account JSON

Open the downloaded JSON file and find these values:

```json
{
  "project_id": "aio-llmo-analyzer",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@aio-llmo-analyzer.iam.gserviceaccount.com",
  ...
}
```

## Step 3: Add to Vercel Environment Variables

### For the BACKEND project on Vercel:

Go to: https://vercel.com/adrian-james-magisas-projects/aio_llmo-strategy-osint-analyzer/settings/environment-variables

Add these variables (select **Production**, **Preview**, and **Development**):

1. **FIREBASE_ADMIN_PROJECT_ID**
   ```
   aio-llmo-analyzer
   ```

2. **FIREBASE_ADMIN_CLIENT_EMAIL**
   ```
   firebase-adminsdk-xxxxx@aio-llmo-analyzer.iam.gserviceaccount.com
   ```
   (Copy from the JSON file's `client_email` field)

3. **FIREBASE_ADMIN_PRIVATE_KEY**
   ```
   -----BEGIN PRIVATE KEY-----
   MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...
   ...
   -----END PRIVATE KEY-----
   ```
   (Copy the ENTIRE `private_key` value from the JSON, including the BEGIN and END lines)
   
   ⚠️ **IMPORTANT**: Paste the entire multi-line private key as-is. Vercel will handle it correctly.

## Step 4: Redeploy

After adding the environment variables, redeploy the backend:

```bash
cd api
vercel --prod
```

Or just trigger a redeploy from the Vercel dashboard.

## ✅ How to verify it works

1. Go to your site: https://aio-llmo.fshp.jp
2. Sign in
3. Try to run an analysis
4. If it works, you'll see the analysis results!
5. If it fails, check Vercel logs for errors

## 🔒 Security Notes

- **NEVER** commit the service account JSON file to Git
- **NEVER** share the private key
- The private key is encrypted and secure in Vercel's environment variables
- You can revoke and regenerate service accounts anytime from Firebase Console
