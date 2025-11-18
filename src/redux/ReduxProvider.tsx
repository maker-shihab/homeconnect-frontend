"use client";

import React, { useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import { hydrateAuth } from './features/auth/authSlice';
import { store } from './store';

interface ReduxProviderProps {
  children: React.ReactNode;
}

export function ReduxProvider({ children }: ReduxProviderProps) {
  const hydrationCalled = useRef(false);

  useEffect(() => {
    if (!hydrationCalled.current) {
      store.dispatch(hydrateAuth());
      hydrationCalled.current = true;
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
