import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Heart, Check, Mail, Lock } from 'lucide-react';
import { format } from 'date-fns';

interface PrayerRequest {
  id: string;
  name: string | null;
  email: string | null;
  request: string;
  is_private: boolean | null;
  is_read: boolean | null;
  created_at: string;
}

export default function AdminPrayerRequests() {
  const queryClient = useQueryClient();

  const { data: prayers, isLoading } = useQuery({
    queryKey: ['admin-prayers'],
    queryFn: async () => {
      const { data, error } = await supabase.from('prayer_requests').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data as PrayerRequest[];
    },
  });

  const markAsRead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('prayer_requests').update({ is_read: true }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-prayers'] });
      toast.success('Marked as read');
    },
  });

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-display">Prayer Requests</h1>
          <p className="text-muted-foreground">View prayer requests from the community</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : prayers?.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Heart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No prayer requests yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {prayers?.map((prayer) => (
              <Card key={prayer.id} className={prayer.is_read ? 'opacity-70' : ''}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{prayer.name || 'Anonymous'}</h3>
                        {!prayer.is_read && <Badge variant="secondary">New</Badge>}
                        {prayer.is_private && <Badge variant="outline" className="flex items-center gap-1"><Lock className="w-3 h-3" /> Private</Badge>}
                      </div>
                      {prayer.email && (
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Mail className="w-3 h-3" /> {prayer.email}
                        </span>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">{format(new Date(prayer.created_at), 'PPP p')}</p>
                    </div>
                    {!prayer.is_read && (
                      <Button variant="outline" size="sm" onClick={() => markAsRead.mutate(prayer.id)}>
                        <Check className="w-4 h-4 mr-1" /> Mark Read
                      </Button>
                    )}
                  </div>
                  <p className="text-muted-foreground whitespace-pre-wrap">{prayer.request}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
