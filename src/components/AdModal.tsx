'use client';

import { useState } from 'react';

export default function AdModal() {
  const [showModal, setShowModal] = useState(true);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="relative max-w-md max-h-full p-4">
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-2 right-2 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg text-gray-700 hover:bg-gray-100"
        >
          ✕
        </button>
        <img src="/add/add.jpeg" alt="Advertisement" className="max-w-full max-h-full rounded-lg" />
      </div>
    </div>
  );
}