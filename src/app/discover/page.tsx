import { Header } from '@/components/header';
import { AiSuggestion } from '@/components/ai-suggestion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { allBars } from '@/lib/data';
import { BarList } from '@/components/bar-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { List, Locate, Search } from 'lucide-react';
import { RadarView } from '@/components/radar-view';

export default function DiscoverPage() {
  return (
    <div className="flex h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 grid md:grid-cols-[400px_1fr] lg:grid-cols-[450px_1fr] overflow-hidden">
        <aside className="flex flex-col border-r border-border/40 overflow-hidden">
          <Tabs defaultValue="discover" className="flex flex-col h-full">
            <div className="p-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="discover"><List />Discover</TabsTrigger>
                <TabsTrigger value="radar"><Locate />Live Radar</TabsTrigger>
                <TabsTrigger value="ai"><Search />AI Helper</TabsTrigger>
              </TabsList>
            </div>
            <Separator />
            <ScrollArea className="flex-1">
              <div className="p-4">
                  <TabsContent value="discover">
                    <BarList bars={allBars} />
                  </TabsContent>
                  <TabsContent value="radar">
                    <RadarView bars={allBars} />
                  </TabsContent>
                  <TabsContent value="ai">
                    <AiSuggestion />
                  </TabsContent>
              </div>
            </ScrollArea>
          </Tabs>
        </aside>

        <section className="relative flex items-center justify-center p-8 animated-gradient">
          <div className="relative z-10 text-center text-primary-foreground">
            <h3 className="text-4xl font-headline font-bold drop-shadow-lg">Welcome to Buzz App Uganda</h3>
            <p className="mt-4 max-w-lg mx-auto text-lg text-white/90 drop-shadow-md">
              Select a bar to see details, or use our AI assistant to find the perfect spot for your night out.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
