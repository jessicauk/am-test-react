import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { Suspense } from 'react';
import Card from './Card';
import type { CharacterItem } from '../../lib/types';

/* vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    return <img {...props} />
  },
})); */

/* vi.mock('../Icons/Heart/Heart', () => ({
  default: ({ className }: { className?: string }) => (
    <svg data-testid="heart-icon" className={className} />
  ),
})); */

const baseCharacter: CharacterItem = {
  id: 1,
  name: 'Rick Sanchez',
  image: 'https://rick.com/rick.png',
  gender: 'Male',
  species: 'Human',
  origin: { name: 'Earth', url: '' },
  location: { name: 'Citadel', url: '' },
  type: '',
  status: 'Alive',
  episode: [],
  url: '',
  created: '',
  isFavorite: false,
};

describe('Card component', () => {
  it('should render name, image and Like text', () => {
    render(
      <Suspense fallback={<div>loading...</div>}>
        <Card {...baseCharacter} />
      </Suspense>
    );

    expect(screen.getByText(/rick s/i)).toBeInTheDocument();
    expect(screen.getByText(/like/i)).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', baseCharacter.image);
    expect(screen.getByTestId('heart-icon')).toBeInTheDocument();
  });

  it('should trigger onClick and onClickSelect', () => {
    const onClick = vi.fn();
    const onClickSelect = vi.fn();

    render(
      <Suspense fallback={<div>loading...</div>}>
        <Card {...baseCharacter} onClick={onClick} onClickSelect={onClickSelect} />
      </Suspense>
    );

    fireEvent.click(screen.getByRole('img')); // click on image
    fireEvent.click(screen.getByText(/like/i)); // click on like wrapper

    expect(onClick).toHaveBeenCalled();
    expect(onClickSelect).toHaveBeenCalled();
  });
});