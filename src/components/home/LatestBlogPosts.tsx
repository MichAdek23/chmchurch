import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowRight, BookOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export function LatestBlogPosts() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['latest-blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-display text-foreground mb-4">
              LATEST NEWS & STORIES
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl">
              Stay updated with what's happening in our church community and be inspired by stories of faith.
            </p>
          </div>
          <Button variant="outline" asChild className="gap-2 self-start md:self-auto">
            <Link to="/blog">
              View All Posts
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link key={post.id} to={`/blog/${post.slug}`}>
                <Card className="overflow-hidden card-hover group h-full">
                  <div className="relative h-48 bg-gradient-to-br from-accent/20 to-primary/20">
                    {post.image_url ? (
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-primary/30" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    {post.category && (
                      <Badge variant="secondary" className="mb-3">
                        {post.category}
                      </Badge>
                    )}
                    <h3 className="text-xl font-display text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    {post.published_at && (
                      <p className="text-sm text-muted-foreground mb-3">
                        {format(new Date(post.published_at), 'MMMM d, yyyy')}
                      </p>
                    )}
                    {post.excerpt && (
                      <p className="text-muted-foreground line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-muted rounded-2xl">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-medium text-foreground mb-2">No Blog Posts Yet</h3>
            <p className="text-muted-foreground">Check back soon for news and stories!</p>
          </div>
        )}
      </div>
    </section>
  );
}