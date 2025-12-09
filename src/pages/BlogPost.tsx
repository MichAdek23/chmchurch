import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import { format } from 'date-fns';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <Layout>
        <article className="section-padding">
          <div className="container mx-auto px-4 max-w-4xl">
            <Skeleton className="h-8 w-32 mb-8" />
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-8" />
            <Skeleton className="h-64 w-full mb-8" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </article>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <section className="section-padding">
          <div className="container mx-auto px-4 max-w-4xl text-center py-20">
            <h1 className="text-4xl font-display mb-4">Post Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The blog post you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      {post.image_url && (
        <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
      )}

      <article className="section-padding">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back Button */}
          <Link 
            to="/blog" 
            className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>

          {/* Post Header */}
          <header className="mb-12">
            {post.category && (
              <div className="flex items-center gap-2 text-primary mb-4">
                <Tag className="w-4 h-4" />
                <span className="text-sm font-medium uppercase tracking-wide">{post.category}</span>
              </div>
            )}
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display mb-6">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-xl text-muted-foreground mb-6">
                {post.excerpt}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Church Staff</span>
              </div>
              {post.published_at && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <time dateTime={post.published_at}>
                    {format(new Date(post.published_at), 'MMMM d, yyyy')}
                  </time>
                </div>
              )}
            </div>
          </header>

          {/* Post Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            {post.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-6 text-foreground/90 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-border">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-muted-foreground">
                Thank you for reading! Share this post with others.
              </p>
              <Button asChild variant="outline">
                <Link to="/blog">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  More Articles
                </Link>
              </Button>
            </div>
          </footer>
        </div>
      </article>
    </Layout>
  );
}
