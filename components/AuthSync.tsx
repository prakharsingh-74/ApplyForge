'use client';

import { useEffect } from 'react';
import { insforge } from '@/lib/insforge';

export default function AuthSync() {
  useEffect(() => {
    // Initial check on page load to see if a session exists (or to process OAuth redirects)
    insforge.auth.getCurrentUser().then(async ({ data }) => {
      if (data?.user) {
        const token = await insforge.getHttpClient().getValidAccessToken();
        if (token) {
          document.cookie = `insforge-token=${token}; path=/; max-age=604800; SameSite=Lax`;
        }
      }
    });

    // Listen for authentication changes (sign in, token refresh, sign out)
    const unsubscribe = insforge.auth.onAuthStateChange(async (event) => {
      if (event === 'signedIn' || event === 'tokenRefreshed') {
        const token = await insforge.getHttpClient().getValidAccessToken();
        if (token) {
          document.cookie = `insforge-token=${token}; path=/; max-age=604800; SameSite=Lax`;
        }
      } else if (event === 'signedOut') {
        // Clear cookie
        document.cookie = 'insforge-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
      }
    });

    return () => unsubscribe();
  }, []);

  return null;
}
