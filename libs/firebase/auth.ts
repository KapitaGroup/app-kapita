import {
  OAuthProvider,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPhoneNumber,
  linkWithPhoneNumber,
  RecaptchaVerifier,
  type ConfirmationResult
} from 'firebase/auth'
import {auth} from './config-client'
import {FirebaseError} from '@firebase/util'

const getPhoneAuthErrorCode = (error: unknown) => {
  const firebaseError = error as FirebaseError
  const rawMessage = firebaseError?.message ?? (typeof error === 'string' ? error : '')
  const message = rawMessage.toLowerCase()
  const codeFromMessage = rawMessage.match(/auth\/[a-z0-9-]+/)?.[0]
  const code = firebaseError?.code ?? codeFromMessage

  if (
    code === 'auth/operation-not-allowed' &&
    (message.includes('sms') || message.includes('region'))
  ) {
    return 'auth/sms-region-not-allowed'
  }

  if (message.includes('authorized domain') || message.includes('unauthorized domain')) {
    return 'auth/unauthorized-domain'
  }

  if (message.includes('app verification') || message.includes('app credential')) {
    return 'auth/app-verification-failed'
  }

  return code ?? 'auth/unknown'
}

export const signInWithApple = async () => {
  try {
    const userCredentials = await signInWithPopup(auth, new OAuthProvider('apple.com'))

    const idToken = await userCredentials.user.getIdToken()

    await fetch('/api/auth/sign-in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({idToken})
    })

    return {user: userCredentials.user}
  } catch (error) {
    const firebaseError = error as FirebaseError

    console.error('Error signing in with Apple', firebaseError)
    return {error: firebaseError}
  }
}

export const signInWithMicrosoft = async () => {
  try {
    const userCredentials = await signInWithPopup(auth, new OAuthProvider('microsoft.com'))

    const idToken = await userCredentials.user.getIdToken()

    await fetch('/api/auth/sign-in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({idToken})
    })

    return {user: userCredentials.user}
  } catch (error) {
    const firebaseError = error as FirebaseError

    console.error('Error signing in with Microsoft', firebaseError)
    return {error: firebaseError}
  }
}

export const signInWithFacebook = async () => {
  try {
    const userCredentials = await signInWithPopup(auth, new FacebookAuthProvider())

    const idToken = await userCredentials.user.getIdToken()

    await fetch('/api/auth/sign-in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({idToken})
    })

    return {user: userCredentials.user}
  } catch (error) {
    const firebaseError = error as FirebaseError

    console.error('Error signing in with Facebook', firebaseError)
    return {error: firebaseError}
  }
}

export const signInWithGoogle = async () => {
  try {
    const userCredentials = await signInWithPopup(auth, new GoogleAuthProvider())

    const idToken = await userCredentials.user.getIdToken()

    await fetch('/api/auth/sign-in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({idToken})
    })

    return {user: userCredentials.user}
  } catch (error) {
    const firebaseError = error as FirebaseError

    console.error('Error signing in with Google', firebaseError)
    return {error: firebaseError}
  }
}

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredentials = await signInWithEmailAndPassword(auth, email, password)

    const idToken = await userCredentials.user.getIdToken()
    await fetch('/api/auth/sign-in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({idToken})
    })

    return {user: userCredentials.user}
  } catch (error) {
    console.error('Error logging in to Google with Email', error)
    return {error: error as FirebaseError}
  }
}

export const createAccountWithEmail = async (email: string, password: string) => {
  try {
    const userCredentials = await createUserWithEmailAndPassword(auth, email, password)

    const idToken = await userCredentials.user.getIdToken()

    await fetch('/api/auth/sign-in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({idToken})
    })

    return {user: userCredentials.user}
  } catch (error) {
    console.error('Error creating account with Email on Google', error)
    return {error: error as FirebaseError}
  }
}

export const sendPhoneOtp = async (phoneNumber: string): Promise<{confirmationResult?: ConfirmationResult; error?: FirebaseError}> => {
  try {
    const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {size: 'invisible'})
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
    return {confirmationResult}
  } catch (error) {
    console.error('Error sending phone OTP', error)
    return {error: error as FirebaseError}
  }
}

export const verifyPhoneOtp = async (confirmationResult: ConfirmationResult, otp: string) => {
  try {
    const userCredential = await confirmationResult.confirm(otp)
    const idToken = await userCredential.user.getIdToken()
    await fetch('/api/auth/sign-in', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({idToken})
    })
    return {user: userCredential.user}
  } catch (error) {
    console.error('Error verifying phone OTP', error)
    return {error: error as FirebaseError}
  }
}

/**
 * Step-2 phone verification: sends OTP linked to the currently signed-in user
 * (does NOT create a new Firebase user / change the session cookie).
 */
export const sendPhoneLink = async (phoneNumber: string): Promise<{confirmationResult?: ConfirmationResult; error?: FirebaseError}> => {
  let recaptchaVerifier: RecaptchaVerifier | null = null
  try {
    if (!auth.currentUser) {
      return {error: {code: 'auth/no-current-user'} as FirebaseError}
    }

    await auth.currentUser.reload()

    // Clear any existing reCAPTCHA widget container content (from previous attempts)
    const container = document.getElementById('recaptcha-container')
    if (container) container.innerHTML = ''

    recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {size: 'invisible'})
    const confirmationResult = await linkWithPhoneNumber(auth.currentUser, phoneNumber, recaptchaVerifier)
    return {confirmationResult}
  } catch (error) {
    console.error('Error sending phone verification', error)
    // Clean up the reCAPTCHA on error so the next attempt works
    try {
      recaptchaVerifier?.clear()
    } catch {}
    const firebaseError = error as FirebaseError
    return {error: {...firebaseError, code: getPhoneAuthErrorCode(error)} as FirebaseError}
  }
}

export const verifyAndLinkPhone = async (confirmationResult: ConfirmationResult, otp: string): Promise<{success: boolean; error?: FirebaseError}> => {
  try {
    await confirmationResult.confirm(otp)
    return {success: true}
  } catch (error: any) {
    // Already linked is fine — still counts as verified
    if (error.code === 'auth/provider-already-linked') return {success: true}
    console.error('Error verifying phone OTP', error)
    return {success: false, error: error as FirebaseError}
  }
}

export async function signOut() {
  try {
    await auth.signOut()

    const response = await fetch('/api/auth/sign-out', {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const resBody = await response.json()
    if (response.ok && resBody.success) {
      return true
    } else return false
  } catch (error) {
    console.error('Error signing out with Google', error)
    return false
  }
}
