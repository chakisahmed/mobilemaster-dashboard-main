// src/app/provider.tsx (or _app.tsx if using the pages directory)
"use client";

import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { ReactNode } from 'react';

export default function ReduxProvider({ children }: { children: ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
