import React from 'react';

// Ultra-light root loading UI shown by Next.js during route transitions / streaming
export default function RootLoading() {
  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-beige/80 backdrop-blur-[1px]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-gold border-t-black rounded-full animate-spin" />
        <div className="text-xs tracking-[2px] text-black/60 font-medium" style={{ fontFamily: 'var(--font-share-tech-mono)' }}>
          LOADING
        </div>
      </div>
    </div>
  );
}
