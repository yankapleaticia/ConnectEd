'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useTranslations } from '@/client/lib/i18n';

interface SearchBarProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
  const t = useTranslations('listings.filters');
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue, onChange]);

  return (
    <div className="relative">
      <Search
        size={20}
        className="absolute left-3 top-1/2 transform -translate-y-1/2"
        style={{ color: 'var(--color-text-muted)' }}
      />
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder || t('search')}
        className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none transition-colors"
        style={{
          border: `1px solid var(--color-border)`,
          backgroundColor: 'var(--color-background)',
          color: 'var(--color-text-primary)',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-primary)';
          e.currentTarget.style.boxShadow = `0 0 0 2px var(--color-primary)`;
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-border)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      />
    </div>
  );
}
