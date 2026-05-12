'use client';

import { useState, useEffect } from 'react';

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasVisited = localStorage.getItem('hasVisitedHomepage');
      if (!hasVisited) {
        setShouldShow(true);
        localStorage.setItem('hasVisitedHomepage', 'true');
      }
    }
  }, []);

  useEffect(() => {
    if (shouldShow) {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            setTimeout(() => setIsLoading(false), 500);
            return 100;
          }
          return prev + 2;
        });
      }, 50);

      return () => clearInterval(timer);
    }
  }, [shouldShow]);

  if (!shouldShow || !isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-beige">
      {/* Loading Image */}
      <div className="mb-8">
        <img
          src="/loading/load.png"
          alt="Loading JP Tech"
          className="w-64 h-64 mx-auto"
        />
      </div>

      {/* Loading Text */}
      <div className="text-center">
        <p className="text-2xl text-black mb-4"
           style={{ fontFamily: 'var(--font-share-tech-mono)' }}>
          Loading... {progress}%
        </p>
      </div>
    </div>
  );
}
