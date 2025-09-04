import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white text-center py-4 md:py-6 mt-8 w-full">
      <div className="container mx-auto px-4">
        <p className="text-xs md:text-sm">
          © {new Date().getFullYear()} Weathersphere. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
