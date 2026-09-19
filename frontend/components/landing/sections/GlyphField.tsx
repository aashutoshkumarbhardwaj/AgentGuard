'use client';

import { glyphs } from './constants';


export function GlyphField() {
  return (
    <div className="landing-glyph-field" aria-hidden="true">
      {Array.from({ length: 300 }, (_, index) => (
        <span key={index} data-glyph={index % 17 === 0 ? 'bright' : undefined}>
          {glyphs[(index * 13 + index * index) % glyphs.length]}
        </span>
      ))}
    </div>
  );
}
