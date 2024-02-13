import React from 'react';
import { ThemeButton } from './theme-button';

export default function Header() {
  return (
    <header className='sticky py-3 w-full border-b-2'>
      <div className='flex justify-between items-center container'>
        <ThemeButton />
        <div></div>
        <div className='flex gap-2'>
        </div>
      </div>
    </header >
  );
}
