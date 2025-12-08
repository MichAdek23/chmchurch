import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Play, User } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

export default function Sermons() {
  const { data: sermons, isLoading } = useQuery({
    queryKey: ['sermons'],
    queryFn: async () => {
      const { data, error } = await supabase.from('sermons').select('*').order('sermon_date', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <Layout>
      <section className="hero-gradient py-24 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-display text-primary-foreground mb-6">SERMONS</h1>
          <p className="text-xl text-primary-foreground/80">Watch and listen to our messages.</p>
        </div>
      </section>
      <section className="section-padding">
        <div className="container mx-auto px-4">
          {isLoading ? <p>Loading...</p> : sermons?.length ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sermons.map((sermon) => (
                <Card key={sermon.id} className="card-hover group cursor-pointer">
                  <div className="relative h-48 bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    {sermon.thumbnail_url ? <img src={sermon.thumbnail_url} alt={sermon.title} className="w-full h-full object-cover" /> : <Play className="w-16 h-16 text-primary-foreground/50" />}
                    <div className="absolute inset-0 flex items-center justify-center bg-foreground/20 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center"><Play className="w-6 h-6 text-secondary-foreground ml-1" /></div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-display mb-2 group-hover:text-primary transition-colors">{sermon.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <span className="flex items-center gap-1"><User className="w-4 h-4" />{sermon.speaker}</span>
                      <span>{format(new Date(sermon.sermon_date), 'MMM d, yyyy')}</span>
                    </div>
                    {sermon.series && <p className="text-sm text-primary">Series: {sermon.series}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : <div className="text-center py-16 bg-muted rounded-2xl"><Play className="w-16 h-16 text-muted-foreground mx-auto mb-4" /><h3 className="text-xl font-medium mb-2">No Sermons Yet</h3><p className="text-muted-foreground">Check back soon!</p></div>}
        </div>
      </section>
    </Layout>
  );
}