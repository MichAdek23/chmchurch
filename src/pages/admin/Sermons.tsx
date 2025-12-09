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
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, BookOpen } from 'lucide-react';
import { format } from 'date-fns';

interface Sermon {
  id: string;
  title: string;
  speaker: string;
  description: string | null;
  sermon_date: string;
  video_url: string | null;
  audio_url: string | null;
  thumbnail_url: string | null;
  series: string | null;
  duration: string | null;
  is_featured: boolean | null;
}

export default function AdminSermons() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSermon, setEditingSermon] = useState<Sermon | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    speaker: 'Pastor',
    description: '',
    sermon_date: '',
    video_url: '',
    audio_url: '',
    thumbnail_url: '',
    series: '',
    duration: '',
    is_featured: false,
  });

  const { data: sermons, isLoading } = useQuery({
    queryKey: ['admin-sermons'],
    queryFn: async () => {
      const { data, error } = await supabase.from('sermons').select('*').order('sermon_date', { ascending: false });
      if (error) throw error;
      return data as Sermon[];
    },
  });

  const createSermon = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from('sermons').insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-sermons'] });
      toast.success('Sermon created successfully');
      resetForm();
    },
    onError: () => toast.error('Failed to create sermon'),
  });

  const updateSermon = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase.from('sermons').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-sermons'] });
      toast.success('Sermon updated successfully');
      resetForm();
    },
    onError: () => toast.error('Failed to update sermon'),
  });

  const deleteSermon = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('sermons').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-sermons'] });
      toast.success('Sermon deleted successfully');
    },
    onError: () => toast.error('Failed to delete sermon'),
  });

  const resetForm = () => {
    setFormData({ title: '', speaker: 'Pastor', description: '', sermon_date: '', video_url: '', audio_url: '', thumbnail_url: '', series: '', duration: '', is_featured: false });
    setEditingSermon(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (sermon: Sermon) => {
    setEditingSermon(sermon);
    setFormData({
      title: sermon.title,
      speaker: sermon.speaker,
      description: sermon.description || '',
      sermon_date: sermon.sermon_date,
      video_url: sermon.video_url || '',
      audio_url: sermon.audio_url || '',
      thumbnail_url: sermon.thumbnail_url || '',
      series: sermon.series || '',
      duration: sermon.duration || '',
      is_featured: sermon.is_featured || false,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSermon) {
      updateSermon.mutate({ id: editingSermon.id, data: formData });
    } else {
      createSermon.mutate(formData);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-display">Sermons</h1>
            <p className="text-muted-foreground">Manage sermon archive</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" /> Add Sermon</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingSermon ? 'Edit Sermon' : 'Upload New Sermon'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="speaker">Speaker</Label>
                    <Input id="speaker" value={formData.speaker} onChange={(e) => setFormData({ ...formData, speaker: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sermon_date">Date</Label>
                    <Input id="sermon_date" type="date" value={formData.sermon_date} onChange={(e) => setFormData({ ...formData, sermon_date: e.target.value })} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="video_url">Video URL (YouTube/Vimeo)</Label>
                    <Input id="video_url" value={formData.video_url} onChange={(e) => setFormData({ ...formData, video_url: e.target.value })} placeholder="https://youtube.com/..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="audio_url">Audio URL</Label>
                    <Input id="audio_url" value={formData.audio_url} onChange={(e) => setFormData({ ...formData, audio_url: e.target.value })} placeholder="https://..." />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="series">Series (Optional)</Label>
                    <Input id="series" value={formData.series} onChange={(e) => setFormData({ ...formData, series: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (e.g., "45:30")</Label>
                    <Input id="duration" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="thumbnail_url">Thumbnail URL</Label>
                  <Input id="thumbnail_url" value={formData.thumbnail_url} onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })} />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="is_featured" checked={formData.is_featured} onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })} />
                  <Label htmlFor="is_featured">Featured Sermon</Label>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                  <Button type="submit">{editingSermon ? 'Update' : 'Create'} Sermon</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : sermons?.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No sermons yet. Upload your first sermon!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {sermons?.map((sermon) => (
              <Card key={sermon.id}>
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{sermon.title}</h3>
                      {sermon.is_featured && <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Featured</span>}
                    </div>
                    <p className="text-sm text-muted-foreground">{sermon.speaker} • {format(new Date(sermon.sermon_date), 'PPP')}</p>
                    {sermon.series && <p className="text-sm text-muted-foreground">Series: {sermon.series}</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleEdit(sermon)}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="outline" size="icon" onClick={() => deleteSermon.mutate(sermon.id)}><Trash2 className="w-4 h-4" /></Button>
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
