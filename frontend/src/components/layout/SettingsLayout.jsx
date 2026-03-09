import React from "react";

export default function SettingsLayout({ active, children }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] w-full bg-[#f3f4f6]">
      <main className="min-w-0 w-full py-4 sm:py-6 md:py-8 px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="w-full max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
