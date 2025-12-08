import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Play, ArrowRight, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export function LatestSermon() {
  const { data: sermon, isLoading } = useQuery({
    queryKey: ['latest-sermon'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sermons')
        .select('*')
        .order('sermon_date', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <section className="section-padding bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <Skeleton className="aspect-video rounded-2xl" />
            <div>
              <Skeleton className="h-8 w-40 mb-4" />
              <Skeleton className="h-12 w-full mb-4" />
              <Skeleton className="h-24 w-full mb-6" />
              <Skeleton className="h-12 w-48" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-muted">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Video Thumbnail */}
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-primary to-accent group cursor-pointer">
            {sermon?.thumbnail_url ? (
              <img
                src={sermon.thumbnail_url}
                alt={sermon.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-primary-foreground">
                  <Play className="w-16 h-16 mx-auto mb-2" />
                  <span className="font-display text-2xl">WATCH NOW</span>
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl">
                <Play className="w-8 h-8 text-secondary-foreground ml-1" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <span className="text-sm font-medium">Latest Message</span>
            </div>
            
            {sermon ? (
              <>
                <h2 className="text-4xl md:text-5xl font-display text-foreground mb-4">
                  {sermon.title}
                </h2>
                <div className="flex items-center gap-4 text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{sermon.speaker}</span>
                  </div>
                  <span>•</span>
                  <span>{format(new Date(sermon.sermon_date), 'MMMM d, yyyy')}</span>
                  {sermon.duration && (
                    <>
                      <span>•</span>
                      <span>{sermon.duration}</span>
                    </>
                  )}
                </div>
                {sermon.description && (
                  <p className="text-lg text-muted-foreground mb-8 line-clamp-3">
                    {sermon.description}
                  </p>
                )}
                {sermon.series && (
                  <p className="text-sm text-primary font-medium mb-6">
                    Series: {sermon.series}
                  </p>
                )}
              </>
            ) : (
              <>
                <h2 className="text-4xl md:text-5xl font-display text-foreground mb-4">
                  EXPERIENCE POWERFUL TEACHING
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Watch our latest sermons and be inspired by God's Word. New messages every Sunday.
                </p>
              </>
            )}

            <div className="flex flex-wrap gap-4">
              {sermon?.video_url && (
                <Button size="lg" className="gap-2">
                  <Play className="w-5 h-5" />
                  Watch Now
                </Button>
              )}
              <Button size="lg" variant="outline" asChild className="gap-2">
                <Link to="/sermons">
                  All Sermons
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}