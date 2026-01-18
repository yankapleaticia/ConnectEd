'use client';

import type { ReactNode } from 'react';

interface AuthCardProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly children: ReactNode;
}

export function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="rounded-xl border bg-[color:var(--color-background)] p-6 shadow-sm border-[color:var(--color-border)]">
      <h1 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">{title}</h1>
      {subtitle ? (
        <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">{subtitle}</p>
      ) : null}
      <div className="mt-6">{children}</div>
    </div>
  );
}

