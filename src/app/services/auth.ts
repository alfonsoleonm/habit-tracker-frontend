import { Injectable, signal } from '@angular/core';
import { Amplify } from 'aws-amplify';
import { signIn, signUp, confirmSignUp, signOut, fetchAuthSession } from 'aws-amplify/auth';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_UYMT1HC69',
      userPoolClientId: '7rbfc122arlgve75lvd9t3sbbh'
    }
  }
});

@Injectable({ providedIn: 'root' })
export class AuthService {
  isAuthenticated = signal<boolean>(false);
  isLoading = signal<boolean>(true);

  async init() {
    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.accessToken?.toString();
      if (token) {
        this.isAuthenticated.set(true);
        return token;
      }
    } catch { }
    this.isAuthenticated.set(false);
    this.isLoading.set(false);
    return null;
  }

  async getToken(): Promise<string | null> {
    try {
      const session = await fetchAuthSession();
      return session.tokens?.accessToken?.toString() ?? null;
    } catch {
      return null;
    }
  }

  async signIn(email: string, password: string) {
    const result = await signIn({ username: email, password });
    if (result.isSignedIn) {
      this.isAuthenticated.set(true);
    }
    return result;
  }

  async signUp(email: string, password: string) {
    return signUp({ username: email, password, options: { userAttributes: { email } } });
  }

  async confirmSignUp(email: string, code: string) {
    return confirmSignUp({ username: email, confirmationCode: code });
  }

  async signOut() {
    await signOut();
    this.isAuthenticated.set(false);
  }
}
