import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Save, Video, Globe } from 'lucide-react';

export default function AdminSettings() {
  const queryClient = useQueryClient();
  const [heroVideoUrl, setHeroVideoUrl] = useState('');

  const { data: settings, isLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (settings) {
      const videoSetting = settings.find(s => s.key === 'hero_video_url');
      if (videoSetting) setHeroVideoUrl(videoSetting.value || '');
    }
  }, [settings]);

  const updateSetting = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const { error } = await supabase
        .from('site_settings')
        .update({ value })
        .eq('key', key);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      queryClient.invalidateQueries({ queryKey: ['hero-video'] });
      toast.success('Settings saved successfully');
    },
    onError: (error) => {
      toast.error('Failed to save settings');
      console.error(error);
    },
  });

  const handleSaveHeroVideo = () => {
    updateSetting.mutate({ key: 'hero_video_url', value: heroVideoUrl });
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-display">Site Settings</h1>
          <p className="text-muted-foreground">Manage your website configuration</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-primary" />
                <CardTitle>Hero Video Background</CardTitle>
              </div>
              <CardDescription>
                Set the background video URL for the homepage hero section. Use a direct video URL (MP4 format recommended).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hero-video">Video URL</Label>
                <Input
                  id="hero-video"
                  placeholder="https://example.com/video.mp4"
                  value={heroVideoUrl}
                  onChange={(e) => setHeroVideoUrl(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty to show the default gradient background. Recommended video sources: YouTube (use direct MP4 link), Vimeo, or your own hosted video.
                </p>
              </div>
              {heroVideoUrl && (
                <div className="rounded-lg overflow-hidden bg-muted aspect-video">
                  <video
                    src={heroVideoUrl}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    playsInline
                    controls
                  />
                </div>
              )}
              <Button onClick={handleSaveHeroVideo} disabled={updateSetting.isPending}>
                <Save className="w-4 h-4 mr-2" />
                {updateSetting.isPending ? 'Saving...' : 'Save Video Setting'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                <CardTitle>General Settings</CardTitle>
              </div>
              <CardDescription>
                More site configuration options will be available here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Additional settings for church contact information, social media links, and more coming soon.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
