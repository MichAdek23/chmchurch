import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  image_url: string | null;
  category: string | null;
  is_published: boolean | null;
  published_at: string | null;
  created_at: string;
}

export default function AdminBlogPosts() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    image_url: '',
    category: 'news',
    is_published: false,
  });

  const { data: posts, isLoading } = useQuery({
    queryKey: ['admin-blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data as BlogPost[];
    },
  });

  const createPost = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from('blog_posts').insert([{
        ...data,
        author_id: user?.id,
        published_at: data.is_published ? new Date().toISOString() : null,
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      toast.success('Blog post created successfully');
      resetForm();
    },
    onError: () => toast.error('Failed to create blog post'),
  });

  const updatePost = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase.from('blog_posts').update({
        ...data,
        published_at: data.is_published ? new Date().toISOString() : null,
      }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      toast.success('Blog post updated successfully');
      resetForm();
    },
    onError: () => toast.error('Failed to update blog post'),
  });

  const deletePost = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      toast.success('Blog post deleted successfully');
    },
    onError: () => toast.error('Failed to delete blog post'),
  });

  const resetForm = () => {
    setFormData({ title: '', slug: '', content: '', excerpt: '', image_url: '', category: 'news', is_published: false });
    setEditingPost(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt || '',
      image_url: post.image_url || '',
      category: post.category || 'news',
      is_published: post.is_published || false,
    });
    setIsDialogOpen(true);
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-display">Blog Posts</h1>
            <p className="text-muted-foreground">Manage blog content</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" /> New Post</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingPost ? 'Edit Post' : 'Create New Post'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={(e) => { e.preventDefault(); editingPost ? updatePost.mutate({ id: editingPost.id, data: formData }) : createPost.mutate(formData); }} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: generateSlug(e.target.value) })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input id="slug" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea id="excerpt" value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} rows={2} placeholder="Brief summary..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea id="content" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} rows={10} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image_url">Featured Image URL</Label>
                  <Input id="image_url" value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="is_published" checked={formData.is_published} onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })} />
                  <Label htmlFor="is_published">Publish immediately</Label>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                  <Button type="submit">{editingPost ? 'Update' : 'Create'} Post</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : posts?.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No blog posts yet. Write your first post!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {posts?.map((post) => (
              <Card key={post.id}>
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{post.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded ${post.is_published ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                        {post.is_published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{format(new Date(post.created_at), 'PPP')}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleEdit(post)}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="outline" size="icon" onClick={() => deletePost.mutate(post.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
