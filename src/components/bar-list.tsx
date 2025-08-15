"use client";

import type { Bar } from '@/lib/types';
import { BarCard } from './bar-card';
import { useState } from 'react';
import { BarDetailsDialog } from './bar-details-dialog';

export function BarList({ bars }: { bars: Bar[] }) {
  const [selectedBar, setSelectedBar] = useState<Bar | null>(null);

  return (
    <div>
      <h3 className="text-lg font-headline font-semibold mb-4 text-primary-foreground/80">Popular Spots</h3>
      <div className="space-y-3">
        {bars.map((bar) => (
          <div key={bar.id} onClick={() => setSelectedBar(bar)} className="cursor-pointer">
            <BarCard bar={bar} />
          </div>
        ))}
      </div>
      {selectedBar && (
        <BarDetailsDialog
          bar={selectedBar}
          isOpen={!!selectedBar}
          onOpenChange={(open) => !open && setSelectedBar(null)}
        />
      )}
    </div>
  );
}
