# BankID Setup Guide (via Signicat)

## Overview

This application uses **Swedish BankID** for authentication through Signicat's OIDC service. When users click "Login with BankID", they are redirected to Signicat which handles the BankID verification.

## What is BankID?

BankID is Sweden's leading electronic identification system, used by millions of Swedes to:
- Sign documents digitally
- Log in to banks and government services
- Verify their identity online

## Prerequisites

1. **Signicat Account** with BankID enabled
2. **Client Credentials** (Client ID and Secret)
3. **BankID Method** enabled in your Signicat client

## Configuration Steps

### 1. Signicat Dashboard Setup

#### A. Access Your OIDC Client

1. Log in to [Signicat Dashboard](https://dashboard.signicat.com/)
2. Navigate to **Products** → **Authentication** → **OIDC Clients**
3. Select your client or create a new one

#### B. Configure Redirect URIs

Add these exact redirect URIs:

**Production:**
```
https://app.kapita.com/api/auth/signicat/callback
```

**Development:**
```
http://localhost:3000/api/auth/signicat/callback
```

#### C. Enable Scopes

Enable these scopes in your OIDC client:
- ✅ `openid` (required)
- ✅ `profile` (recommended - provides name, given_name, family_name)
- ⚠️ `email` (optional - not all BankID users have email)

#### D. Enable BankID Authentication Method

1. In your OIDC client, go to **Authentication Methods**
2. Enable **Swedish BankID** (`sbid`)
3. Configure:
   - **Environment**: Production or Test
   - **BankID Type**: Mobile BankID (recommended) or File-based

### 2. Environment Variables

Add these to your `.env.local` (development) and Vercel (production):

```bash
# Signicat Authority
# Preprod/Test:
SIGNICAT_AUTHORITY=https://preprod.signicat.com/oidc
# Production:
# SIGNICAT_AUTHORITY=https://id.signicat.com/oidc

# Your Signicat Client Credentials
SIGNICAT_CLIENT_ID=your-client-id-here
SIGNICAT_CLIENT_SECRET=your-client-secret-here

# Force BankID authentication
SIGNICAT_ACR_VALUES=urn:signicat:oidc:method:sbid

# Scopes (openid is required, profile recommended)
SIGNICAT_SCOPE=openid profile
```

### 3. Vercel Deployment

1. Go to [Vercel Dashboard](https://vercel.com/)
2. Select project: **app-kapita**
3. Go to **Settings** → **Environment Variables**
4. Add each variable above
5. Select: **Production**, **Preview**, **Development**
6. Click **Save**
7. Redeploy:
   ```bash
   git commit --allow-empty -m "Update env vars"
   git push
   ```

## Authentication Flow

### Step-by-Step Process

1. **User Clicks "Login with BankID"**
   - Button in `LoginOptions.tsx`
   - Redirects to `/api/auth/signicat/start`

2. **App Initiates OAuth Flow**
   - Generates PKCE challenge (security)
   - Creates state and nonce (CSRF protection)
   - Redirects to Signicat with:
     - `acr_values=urn:signicat:oidc:method:sbid` (forces BankID)
     - `scope=openid profile`
     - `ui_locales=sv` (Swedish interface)

3. **User Authenticates with BankID**
   - Opens BankID app on mobile
   - Enters personal number (personnummer)
   - Confirms with security code or biometrics

4. **Signicat Callback**
   - Signicat redirects to `/api/auth/signicat/callback`
   - App exchanges code for access token
   - Fetches user info from Signicat

5. **Firebase User Creation**
   - Creates or updates Firebase user
   - Stores BankID data in custom claims:
     ```json
     {
       "bankid": true,
       "personalNumber": "199001011234",
       "signicatSub": "..."
     }
     ```

6. **User Logged In**
   - Custom Firebase token created
   - User redirected to profile creation
   - Session established

## User Data from BankID

BankID provides this information through Signicat:

```typescript
{
  sub: "unique-identifier",              // Unique user ID
  name: "Jane Smith",                    // Full name
  given_name: "Jane",                    // First name
  family_name: "Smith",                  // Last name
  signicat_national_id: "199001011234", // Swedish personal number
  birthdate: "1990-01-01",              // Date of birth
  email: "jane@example.com",            // Optional
  email_verified: true                   // If email provided
}
```

**Note**: Not all BankID users have email addresses. The app works without email.

## ACR Values (Authentication Methods)

The `acr_values` parameter specifies which authentication method to use:

| Country | Method | ACR Value |
|---------|--------|-----------|
| 🇸🇪 Sweden | BankID | `urn:signicat:oidc:method:sbid` |
| 🇳🇴 Norway | BankID | `urn:signicat:oidc:method:nbid` |
| 🇩🇰 Denmark | MitID | `urn:signicat:oidc:method:mitid` |
| 🇫🇮 Finland | FTN | `urn:signicat:oidc:method:ftn` |

**Current**: Swedish BankID (`sbid`)

## Troubleshooting

### ❌ Error: "Invalid redirect_uri"

**Cause**: Redirect URI not configured in Signicat

**Solution**:
1. Go to Signicat Dashboard → Your Client
2. Add `https://app.kapita.com/api/auth/signicat/callback`
3. Save changes
4. Wait 1-2 minutes for propagation

### ❌ Error: "Invalid scope"

**Cause**: Requested scopes not enabled

**Solution**:
1. Go to Signicat Dashboard → Your Client → Scopes
2. Enable: `openid`, `profile`
3. Save changes

### ❌ Error: "Invalid acr_values"

**Cause**: BankID not enabled in your client

**Solution**:
1. Go to Signicat Dashboard → Your Client → Authentication Methods
2. Enable **Swedish BankID** (`sbid`)
3. Complete BankID configuration
4. Save changes

### ❌ Still Seeing "Continue with Signicat"

**Cause**: Browser cache

**Solution**:
- **Mac**: `Cmd + Shift + R`
- **Windows**: `Ctrl + Shift + R`
- Or use incognito mode
- Or clear browser cache

### ❌ BankID Opens But Fails

**Cause**: Environment mismatch

**Solution**:
1. Verify `SIGNICAT_AUTHORITY` matches your environment:
   - Test: `https://preprod.signicat.com/oidc`
   - Prod: `https://id.signicat.com/oidc`
2. Check BankID environment in Signicat dashboard
3. Review Signicat logs

## Testing

### Test Environment (Preprod)

1. Use: `SIGNICAT_AUTHORITY=https://preprod.signicat.com/oidc`
2. Use test personal numbers from Signicat
3. Use Signicat's test BankID app

### Production Environment

1. Use: `SIGNICAT_AUTHORITY=https://id.signicat.com/oidc`
2. Use real BankID app
3. Use real Swedish personal numbers

### Test Checklist

- [ ] Click "Login with BankID" button
- [ ] Redirected to BankID interface (Swedish)
- [ ] BankID app opens on mobile
- [ ] Can authenticate with test/real credentials
- [ ] Redirected back to app
- [ ] User is logged in
- [ ] Profile data is populated

## Security Features

✅ **PKCE** - Proof Key for Code Exchange prevents authorization code interception

✅ **State Parameter** - Prevents CSRF (Cross-Site Request Forgery) attacks

✅ **Nonce** - Prevents replay attacks

✅ **HTTPS Only** - All production traffic encrypted

✅ **Secure Cookies** - httpOnly, secure, sameSite=lax

✅ **Token Expiry** - Short-lived tokens (10 minutes)

✅ **BankID Verification** - Government-grade identity verification

## Code References

### Frontend
- `app/[locale]/login/components/LoginOptions.tsx` - BankID button
- `app/[locale]/login/components/Section.tsx` - Login flow

### Backend
- `app/api/auth/signicat/start/route.ts` - Initiates OAuth flow
- `app/api/auth/signicat/callback/route.ts` - Handles callback
- `app/api/auth/signicat/firebase-token/route.ts` - Token exchange
- `libs/signicat/oidc.ts` - Helper functions

### Translations
- `i18n/messages/en.json` - English text
- `i18n/messages/sv.json` - Swedish text

## Support

### Signicat Issues
- [Signicat Documentation](https://developer.signicat.com/)
- [Signicat Dashboard](https://dashboard.signicat.com/)
- Create support ticket in dashboard

### App Issues
- Check browser console (F12)
- Check Vercel logs: `vercel logs --follow`
- Verify environment variables
- Review this guide

## Additional Resources

- [Signicat OIDC Documentation](https://developer.signicat.com/docs/authentication/protocols/oidc/)
- [BankID Official Site](https://www.bankid.com/)
- [Swedish BankID Documentation](https://www.bankid.com/utvecklare)
