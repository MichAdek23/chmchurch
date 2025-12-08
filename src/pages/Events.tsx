import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Calendar, MapPin } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

export default function Events() {
  const { data: events, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase.from('events').select('*').gte('event_date', new Date().toISOString()).order('event_date');
      if (error) throw error;
      return data;
    },
  });

  return (
    <Layout>
      <section className="hero-gradient py-24 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-display text-primary-foreground mb-6">EVENTS</h1>
          <p className="text-xl text-primary-foreground/80">Join us for worship, fellowship, and community.</p>
        </div>
      </section>
      <section className="section-padding">
        <div className="container mx-auto px-4">
          {isLoading ? <p>Loading...</p> : events?.length ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Card key={event.id} className="card-hover">
                  <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    {event.image_url ? <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" /> : <Calendar className="w-16 h-16 text-primary/30" />}
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-display mb-2">{event.title}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-2 mb-2"><Calendar className="w-4 h-4" />{format(new Date(event.event_date), 'EEEE, MMM d • h:mm a')}</p>
                    {event.location && <p className="text-sm text-muted-foreground flex items-center gap-2"><MapPin className="w-4 h-4" />{event.location}</p>}
                    {event.description && <p className="mt-4 text-muted-foreground line-clamp-2">{event.description}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : <div className="text-center py-16 bg-muted rounded-2xl"><Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" /><h3 className="text-xl font-medium mb-2">No Upcoming Events</h3><p className="text-muted-foreground">Check back soon!</p></div>}
        </div>
      </section>
    </Layout>
  );
}