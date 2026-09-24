import React from 'react';
import { SocialPlatform } from '@/types/social';

interface SocialPlatformIconProps {
  platform: SocialPlatform;
  className?: string;
  size?: number;
}

export function SocialPlatformIcon({ platform, className = '', size = 18 }: SocialPlatformIconProps) {
  switch (platform) {
    case 'facebook':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          className={`shrink-0 ${className}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24V15.563H7.078V12.073H10.125V9.413C10.125 6.388 11.916 4.707 14.657 4.707C15.97 4.707 17.344 4.943 17.344 4.943V7.913H15.83C14.34 7.913 13.875 8.843 13.875 9.799V12.073H17.203L16.671 15.563H13.875V24C19.612 23.094 24 18.1 24 12.073Z"
            fill="currentColor"
          />
        </svg>
      );

    case 'instagram':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          className={`shrink-0 ${className}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069ZM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z"
            fill="currentColor"
          />
        </svg>
      );

    case 'tiktok':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          className={`shrink-0 ${className}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68 6.34 6.34 0 0 0 9.35 22a6.34 6.34 0 0 0 6.34-6.32V8.92a8.28 8.28 0 0 0 4.81 1.54V7.02a4.83 4.83 0 0 1-.91-.33Z"
            fill="currentColor"
          />
        </svg>
      );

    case 'youtube':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          className={`shrink-0 ${className}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
            fill="currentColor"
          />
        </svg>
      );

    default:
      return null;
  }
}
