import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  end_date: string | null;
  location: string | null;
  category: string | null;
  image_url: string | null;
  is_featured: boolean | null;
}

export default function AdminEvents() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    end_date: '',
    location: '',
    category: 'general',
    image_url: '',
    is_featured: false,
  });

  const { data: events, isLoading } = useQuery({
    queryKey: ['admin-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: false });
      if (error) throw error;
      return data as Event[];
    },
  });

  const createEvent = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from('events').insert([{
        ...data,
        end_date: data.end_date || null,
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      toast.success('Event created successfully');
      resetForm();
    },
    onError: () => toast.error('Failed to create event'),
  });

  const updateEvent = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase.from('events').update({
        ...data,
        end_date: data.end_date || null,
      }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      toast.success('Event updated successfully');
      resetForm();
    },
    onError: () => toast.error('Failed to update event'),
  });

  const deleteEvent = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      toast.success('Event deleted successfully');
    },
    onError: () => toast.error('Failed to delete event'),
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      event_date: '',
      end_date: '',
      location: '',
      category: 'general',
      image_url: '',
      is_featured: false,
    });
    setEditingEvent(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      event_date: event.event_date.slice(0, 16),
      end_date: event.end_date?.slice(0, 16) || '',
      location: event.location || '',
      category: event.category || 'general',
      image_url: event.image_url || '',
      is_featured: event.is_featured || false,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEvent) {
      updateEvent.mutate({ id: editingEvent.id, data: formData });
    } else {
      createEvent.mutate(formData);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-display">Events</h1>
            <p className="text-muted-foreground">Manage church events</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" /> Add Event</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingEvent ? 'Edit Event' : 'Create New Event'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="event_date">Start Date & Time</Label>
                    <Input id="event_date" type="datetime-local" value={formData.event_date} onChange={(e) => setFormData({ ...formData, event_date: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_date">End Date & Time (Optional)</Label>
                    <Input id="end_date" type="datetime-local" value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input id="image_url" value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} placeholder="https://..." />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="is_featured" checked={formData.is_featured} onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })} />
                  <Label htmlFor="is_featured">Featured Event</Label>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                  <Button type="submit">{editingEvent ? 'Update' : 'Create'} Event</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : events?.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No events yet. Create your first event!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {events?.map((event) => (
              <Card key={event.id}>
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{event.title}</h3>
                      {event.is_featured && <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Featured</span>}
                    </div>
                    <p className="text-sm text-muted-foreground">{format(new Date(event.event_date), 'PPP p')}</p>
                    {event.location && <p className="text-sm text-muted-foreground">{event.location}</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleEdit(event)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => deleteEvent.mutate(event.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
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
