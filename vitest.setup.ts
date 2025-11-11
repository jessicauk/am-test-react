import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// Mock de next/image
vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    return React.createElement('img', props);
  },
}));

// Mock de lazy components si los usas
vi.mock('../components/Icons/Heart/Heart', () => ({
  __esModule: true,
  default: (props: React.SVGProps<SVGSVGElement>) => React.createElement('svg', { 'data-testid': 'mock-heart', ...props }),
}));