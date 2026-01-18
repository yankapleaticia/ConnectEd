import { Suspense } from 'react';
import { AuthCallbackClient } from './auth-callback-client';

export const dynamic = 'force-dynamic';

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-[60vh]">
          <p className="text-[color:var(--color-text-secondary)]">Loading...</p>
        </div>
      }
    >
      <AuthCallbackClient />
    </Suspense>
  );
}

