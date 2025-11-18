"use client";

export const GlobalLoader = ({ message = "Processing..." }: { message?: string }) => (
  <div className="fixed inset-0 w-full min-h-screen flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-700 font-medium">{message}</p>
    </div>
  </div>
);