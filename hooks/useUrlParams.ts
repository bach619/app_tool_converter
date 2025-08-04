'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export function useUrlParams() {
  const searchParams = useSearchParams();
  const [params, setParams] = useState<Record<string, string>>({});

  useEffect(() => {
    const paramObj: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      paramObj[key] = value;
    });
    setParams(paramObj);
  }, [searchParams]);

  return params;
}