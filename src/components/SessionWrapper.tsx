'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { RecoilRoot } from 'recoil';

const SessionWrapper = ({ children }: {children: ReactNode}) => {
  return (
    <SessionProvider>
      <RecoilRoot>{children}</RecoilRoot>
    </SessionProvider>
  );
};

export default SessionWrapper;