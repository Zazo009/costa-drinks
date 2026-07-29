'use client';

import { Toaster } from 'react-hot-toast';

export default function ToasterProvider() {
  return (
    <Toaster
      position="bottom-center"
      toastOptions={{
        style: {
          background: '#111827',
          color: '#fff',
          fontSize: '14px',
        },
      }}
    />
  );
}
