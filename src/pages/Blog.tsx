import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { BookOpen } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

export default function Blog() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase.from('blog_posts').select('*').eq('is_published', true).order('published_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <Layout>
      <section className="hero-gradient py-24 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-display text-primary-foreground mb-6">BLOG & NEWS</h1>
          <p className="text-xl text-primary-foreground/80">Stories, updates, and inspiration from our community.</p>
        </div>
      </section>
      <section className="section-padding">
        <div className="container mx-auto px-4">
          {isLoading ? <p>Loading...</p> : posts?.length ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link key={post.id} to={`/blog/${post.slug}`}>
                  <Card className="card-hover group h-full">
                    <div className="h-48 bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                      {post.image_url ? <img src={post.image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <BookOpen className="w-16 h-16 text-primary/30" />}
                    </div>
                    <CardContent className="p-6">
                      {post.category && <Badge variant="secondary" className="mb-3">{post.category}</Badge>}
                      <h3 className="text-xl font-display mb-2 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
                      {post.published_at && <p className="text-sm text-muted-foreground mb-3">{format(new Date(post.published_at), 'MMMM d, yyyy')}</p>}
                      {post.excerpt && <p className="text-muted-foreground line-clamp-2">{post.excerpt}</p>}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : <div className="text-center py-16 bg-muted rounded-2xl"><BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" /><h3 className="text-xl font-medium mb-2">No Blog Posts Yet</h3><p className="text-muted-foreground">Check back soon!</p></div>}
        </div>
      </section>
    </Layout>
  );
}