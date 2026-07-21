'use client';

import { useState } from 'react';

interface ShareButtonProps {
  url: string;
}

export default function ShareButton({ url }: Readonly<ShareButtonProps>) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* clipboard unavailable, silently ignore */
    }
  };

  return (
    <button type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl border border-purple-200 text-purple-700 hover:bg-purple-50 transition-all"
    >
      {copied ? 'Link copiado!' : 'Compartilhar resultado'}
    </button>
  );
}
