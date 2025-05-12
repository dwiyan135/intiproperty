// src/components/AddressAutocomplete.tsx
'use client';

import React, { useState, useEffect, useRef, ChangeEvent } from 'react';

interface Suggestion {
  display_name: string;
  lat: string;
  lon: string;
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (v: string) => void;
  /**
   * dipanggil saat user memilih satu alamat.
   * lat & lon sudah di‐parse ke number.
   */
  onSelect: (display_name: string, lat: number, lon: number) => void;
}

export default function AddressAutocomplete({
  value,
  onChange,
  onSelect,
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Fetch suggestions dengan debounce
  useEffect(() => {
    if (!value) {
      setSuggestions([]);
      return;
    }
    const id = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(
            value
          )}`,
          { headers: { 'User-Agent': 'IntiProperty-App/1.0' } }
        );
        const data: Suggestion[] = await res.json();
        setSuggestions(data);
        setOpen(true);
      } catch {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(id);
  }, [value]);

  // Tutup dropdown jika klik di luar
  useEffect(() => {
    function handleClickOutside(event: Event) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      <input
        type="text"
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        onFocus={() => value && setOpen(true)}
        placeholder="Ketik alamat..."
        className="w-full p-2 border border-blue-900 rounded-md"
      />
      {open && suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white border border-gray-300 w-full max-h-48 overflow-auto rounded-md mt-1 shadow-sm">
          {suggestions.map((s, idx) => (
            <li
              key={idx}
              onClick={() => {
                const latNum = parseFloat(s.lat);
                const lonNum = parseFloat(s.lon);
                onSelect(s.display_name, latNum, lonNum);
                setOpen(false);
              }}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
            >
              {s.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
