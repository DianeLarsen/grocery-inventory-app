'use client';

import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export function LandingImage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !resolvedTheme) return null;

  const src =
    resolvedTheme === 'dark'
      ? '/images/dark-groceries-recipes-inventory.png'
      : '/images/groceries-recipes-inventory.png';

  return (
    <div className="relative w-[600px] h-[400px]">
      <Image
        src={src}
        alt="Inventory, recipes, and groceries"
        fill
        className="rounded-2xl shadow-lg object-cover"
        priority
      />
    </div>
  );
}
