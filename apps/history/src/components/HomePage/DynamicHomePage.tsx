'use client';

import dynamic from 'next/dynamic';

export const DynamicHomePage = dynamic(() => import('./HomePage').then((mod) => mod.HomePage), {
  ssr: false,
});
