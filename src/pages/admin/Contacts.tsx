import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MessageSquare, Check, Mail, Phone } from 'lucide-react';
import { format } from 'date-fns';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  is_read: boolean | null;
  created_at: string;
}

export default function AdminContacts() {
  const queryClient = useQueryClient();

  const { data: contacts, isLoading } = useQuery({
    queryKey: ['admin-contacts'],
    queryFn: async () => {
      const { data, error } = await supabase.from('contact_submissions').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data as ContactSubmission[];
    },
  });

  const markAsRead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('contact_submissions').update({ is_read: true }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-contacts'] });
      toast.success('Marked as read');
    },
  });

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-display">Contact Messages</h1>
          <p className="text-muted-foreground">View messages from visitors</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : contacts?.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No contact messages yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {contacts?.map((contact) => (
              <Card key={contact.id} className={contact.is_read ? 'opacity-70' : ''}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{contact.name}</h3>
                        {!contact.is_read && <Badge variant="secondary">New</Badge>}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {contact.email}</span>
                        {contact.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {contact.phone}</span>}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{format(new Date(contact.created_at), 'PPP p')}</p>
                    </div>
                    {!contact.is_read && (
                      <Button variant="outline" size="sm" onClick={() => markAsRead.mutate(contact.id)}>
                        <Check className="w-4 h-4 mr-1" /> Mark Read
                      </Button>
                    )}
                  </div>
                  {contact.subject && <p className="font-medium mb-2">{contact.subject}</p>}
                  <p className="text-muted-foreground whitespace-pre-wrap">{contact.message}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
