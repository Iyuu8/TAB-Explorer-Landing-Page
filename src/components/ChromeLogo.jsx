import React from 'react';

export default function ChromeLogo({ size = 22, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    >
      <circle cx="24" cy="24" r="10" fill="#FFFFFF" />
      <circle cx="24" cy="24" r="8" fill="#1A73E8" />
      <path
        d="M24 14H42.7C39.5 8.5 33.7 4.7 27 4.1L18.6 18.6C20.2 15.8 21.9 14 24 14Z"
        fill="#EA4335"
      />
      <path
        d="M42.7 14C44.2 16.9 45 20.3 45 24C45 32.8 39.4 40.3 31.6 43.1L23.2 28.6C23.5 28.6 23.7 28.6 24 28.6C26.5 28.6 28.8 27.3 30.1 25.1L42.7 14Z"
        fill="#4285F4"
      />
      <path
        d="M24 34C21.9 34 20.2 32.2 18.6 29.4L10.2 14.9C6.4 19.3 4 25.1 4 31.5C4 38.3 7.8 44.2 13.4 47.3L26 25.5C24.7 27.7 22.4 29 19.9 29C21.4 32.1 22.6 34 24 34Z"
        fill="#FBBC05"
      />
      <path
        d="M10.2 14.9L18.6 29.4C19.9 27.2 22.2 25.9 24.7 25.9L37.3 4C33.2 4 29.2 5 25.7 6.9C19.3 10.4 14.5 16.3 12.3 23.4L10.2 14.9Z"
        fill="#34A853"
      />
      <circle cx="24" cy="24" r="9" fill="#FFFFFF" />
      <circle cx="24" cy="24" r="7.5" fill="#1A73E8" />
    </svg>
  );
}
