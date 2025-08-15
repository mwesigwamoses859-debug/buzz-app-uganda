import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Bar } from '@/lib/types';
import { Flame, Star } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

function getBuzzColor(buzz: number) {
  if (buzz > 85) return 'bg-red-500/20 text-red-400 border-red-500/30';
  if (buzz > 60) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
  return 'bg-green-500/20 text-green-400 border-green-500/30';
}

export function BarCard({ bar }: { bar: Bar }) {
  return (
    <Card className="hover:bg-card/80 transition-colors duration-200 group overflow-hidden">
      <CardContent className="p-0">
        <div className="flex gap-4">
          <div className="relative w-28 h-28 flex-shrink-0">
             <Image 
                src={bar.imageUrl}
                data-ai-hint="bar interior"
                alt={bar.name} 
                className="object-cover" 
                fill
              />
               <div className="absolute top-2 left-2">
                <Image 
                  src={bar.logoUrl}
                  alt={`${bar.name} logo`}
                  width={40}
                  height={40}
                  className="rounded-md border-2 border-background/50 shadow-lg"
                />
              </div>
          </div>
          <div className="flex-grow p-3 space-y-1.5">
            <div className="flex justify-between items-start">
              <h3 className="font-headline font-semibold text-lg text-primary-foreground leading-tight pr-2">{bar.name}</h3>
              <Badge variant="outline" className={cn("flex items-center gap-1.5", getBuzzColor(bar.buzz))}>
                <Flame className="w-3.5 h-3.5" />
                <span>{bar.buzz}%</span>
              </Badge>
            </div>
            <div className="flex items-center gap-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-accent" />
                    <span className="text-accent font-bold">{bar.rating.toFixed(1)}</span>
                </Badge>
                <p className="text-sm text-muted-foreground truncate">{bar.address}</p>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {bar.vibes.slice(0, 3).map((vibe) => (
                <Badge key={vibe} variant="outline" className="text-xs">
                  {vibe}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
