import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, BookOpen, FileText, MessageSquare, Heart, Users } from 'lucide-react';

export default function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [events, sermons, blogPosts, contacts, prayers] = await Promise.all([
        supabase.from('events').select('id', { count: 'exact', head: true }),
        supabase.from('sermons').select('id', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
        supabase.from('contact_submissions').select('id', { count: 'exact', head: true }).eq('is_read', false),
        supabase.from('prayer_requests').select('id', { count: 'exact', head: true }).eq('is_read', false),
      ]);
      return {
        events: events.count || 0,
        sermons: sermons.count || 0,
        blogPosts: blogPosts.count || 0,
        unreadContacts: contacts.count || 0,
        unreadPrayers: prayers.count || 0,
      };
    },
  });

  const statCards = [
    { title: 'Total Events', value: stats?.events || 0, icon: Calendar, color: 'text-blue-500' },
    { title: 'Total Sermons', value: stats?.sermons || 0, icon: BookOpen, color: 'text-green-500' },
    { title: 'Blog Posts', value: stats?.blogPosts || 0, icon: FileText, color: 'text-purple-500' },
    { title: 'Unread Messages', value: stats?.unreadContacts || 0, icon: MessageSquare, color: 'text-orange-500' },
    { title: 'Prayer Requests', value: stats?.unreadPrayers || 0, icon: Heart, color: 'text-red-500' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-display">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to the Christian Heroes admin panel</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {statCards.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <a href="/admin/events" className="block p-3 rounded-lg hover:bg-muted transition-colors">
                <span className="font-medium">Create New Event</span>
                <p className="text-sm text-muted-foreground">Add upcoming church events</p>
              </a>
              <a href="/admin/sermons" className="block p-3 rounded-lg hover:bg-muted transition-colors">
                <span className="font-medium">Upload Sermon</span>
                <p className="text-sm text-muted-foreground">Share recent sermons with the congregation</p>
              </a>
              <a href="/admin/blog" className="block p-3 rounded-lg hover:bg-muted transition-colors">
                <span className="font-medium">Write Blog Post</span>
                <p className="text-sm text-muted-foreground">Share news and updates</p>
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                View and manage recent submissions, prayer requests, and contact messages from the community.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
