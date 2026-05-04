# Browser Cache Issue - Login Page

## Problem
Users visiting app.kapita.com are still seeing the old "Continue with Signicat" button instead of the new "Login with BankID" button due to browser caching.

## Solution Implemented

### 1. Cache Control Headers (next.config.mjs)
Added HTTP headers to prevent browser caching of the login page:
- `Cache-Control: no-store, no-cache, must-revalidate`
- `Pragma: no-cache`
- `Expires: 0`

These headers tell browsers not to cache the login page.

### 2. Version Constant (LoginOptions.tsx)
Added a version constant `APP_VERSION = '20260504-001'` that can be updated to force cache invalidation when needed.

## How Users Can See the New Design Immediately

### Option 1: Hard Refresh (Recommended)
- **Windows/Linux**: Press `Ctrl + Shift + R` or `Ctrl + F5`
- **Mac**: Press `Cmd + Shift + R`

### Option 2: Clear Browser Cache
1. Open browser settings
2. Clear browsing data/cache
3. Reload the page

### Option 3: Incognito/Private Mode
- Open the site in an incognito/private browsing window
- This bypasses the cache entirely

### Option 4: Wait for Automatic Update
- The new cache headers will prevent future caching
- After the next deployment, users will automatically see the new design
- Existing cached versions will expire based on browser behavior

## Verification
After deployment, verify the new design is live:
1. Open https://app.kapita.com in incognito mode
2. You should see "Login with BankID" button with the blue (#1E3A5F) color
3. The button should have a BankID icon (ID card with lines)
4. Headers should read "Sign in to your account" and "Choose how you want to sign in to your account"

## Technical Details
- **Commit**: 2ec2d4e
- **Files Modified**:
  - `next.config.mjs` - Added cache control headers
  - `app/[locale]/login/components/LoginOptions.tsx` - Added version constant
- **Deployment**: Vercel will automatically deploy these changes
- **Cache Headers**: Applied to `/:locale/login` route pattern
