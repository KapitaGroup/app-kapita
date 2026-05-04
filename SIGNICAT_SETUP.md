# Signicat Integration Setup

## Overview
This application uses Signicat for authentication via OpenID Connect (OIDC) with PKCE flow.

## Required Environment Variables

Add these to your `.env.local` (local) and Vercel environment variables (production):

```bash
SIGNICAT_AUTHORITY=https://preprod.signicat.com/oidc
# or for production: https://id.signicat.com/oidc

SIGNICAT_CLIENT_ID=your_client_id_here
SIGNICAT_CLIENT_SECRET=your_client_secret_here

# Optional
SIGNICAT_SCOPE=openid profile email phone
SIGNICAT_ACR_VALUES=urn:signicat:oidc:method:sbid-oidc
```

## Redirect URI Configuration

### Production
You **MUST** add this exact redirect URI to your Signicat application configuration:

```
https://app.kapita.com/api/auth/signicat/callback
```

### Local Development
For local testing, also add:

```
http://localhost:3000/api/auth/signicat/callback
```

### Preview Deployments (Optional)
If you want to test on Vercel preview deployments:

```
https://*.vercel.app/api/auth/signicat/callback
```

## How to Configure in Signicat Dashboard

1. Log in to your Signicat dashboard:
   - Preprod: https://preprod.signicat.com
   - Production: https://id.signicat.com

2. Navigate to your application/client settings

3. Find the "Redirect URIs" or "Callback URLs" section

4. Add the redirect URI(s) listed above

5. Make sure the following settings are enabled:
   - **Grant Types**: Authorization Code
   - **Response Types**: code
   - **Token Endpoint Auth Method**: client_secret_basic
   - **PKCE**: Required or Enabled

6. Save the configuration

## Common Errors

### "Invalid redirect_uri"
- **Cause**: The redirect URI in your app doesn't match what's configured in Signicat
- **Solution**: Ensure `https://app.kapita.com/api/auth/signicat/callback` is added to allowed redirect URIs
- **Check**: The URL must be exact (no trailing slash, correct protocol, correct domain)

### "Invalid client"
- **Cause**: Wrong `SIGNICAT_CLIENT_ID` or `SIGNICAT_CLIENT_SECRET`
- **Solution**: Verify the credentials in your environment variables

### "Invalid scope"
- **Cause**: Requesting scopes not allowed for your client
- **Solution**: Check which scopes are enabled in your Signicat application settings

## Testing

1. Start the application locally:
   ```bash
   npm run dev
   ```

2. Navigate to `/login`

3. Click "Continue with Signicat"

4. You should be redirected to Signicat's authentication page

5. After successful authentication, you'll be redirected back to the app

## Flow Diagram

```
User clicks "Continue with Signicat"
    ↓
/api/auth/signicat/start
    ↓
Redirect to Signicat (with PKCE challenge)
    ↓
User authenticates with Signicat
    ↓
Signicat redirects to /api/auth/signicat/callback
    ↓
Exchange code for tokens
    ↓
Get user info from Signicat
    ↓
Create/update Firebase user
    ↓
Create Firebase custom token
    ↓
Redirect to /login?signicat=complete
    ↓
Frontend exchanges token and signs in
    ↓
User is logged in
```

## Debugging

Check the server logs for detailed information about the OAuth flow:

```bash
vercel logs --follow
```

Or locally, check your terminal output for console.log statements showing:
- Origin
- Redirect URI
- Authority
- Client ID (partial)

## Security Notes

- The integration uses PKCE (Proof Key for Code Exchange) for enhanced security
- All sensitive data is stored in httpOnly cookies
- State parameter is validated to prevent CSRF attacks
- Nonce is used for replay attack prevention
