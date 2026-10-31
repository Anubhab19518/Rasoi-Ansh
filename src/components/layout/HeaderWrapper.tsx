'use client';

import React, { useState } from 'react';
import Header from './Header';
import NavbarSearch from './NavbarSearch';

export default function HeaderWrapper() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <Header onOpenSearch={() => setIsSearchOpen(true)} />
      <NavbarSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
