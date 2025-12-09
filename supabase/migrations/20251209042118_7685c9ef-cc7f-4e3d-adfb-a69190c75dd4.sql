-- Create storage buckets for media uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('sermons', 'sermons', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('events', 'events', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('blog', 'blog', true);

-- Storage policies for sermons bucket
CREATE POLICY "Sermon media is publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'sermons');

CREATE POLICY "Admins can upload sermon media"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'sermons' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update sermon media"
ON storage.objects FOR UPDATE
USING (bucket_id = 'sermons' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete sermon media"
ON storage.objects FOR DELETE
USING (bucket_id = 'sermons' AND public.has_role(auth.uid(), 'admin'::app_role));

-- Storage policies for events bucket
CREATE POLICY "Event images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'events');

CREATE POLICY "Admins can upload event images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'events' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update event images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'events' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete event images"
ON storage.objects FOR DELETE
USING (bucket_id = 'events' AND public.has_role(auth.uid(), 'admin'::app_role));

-- Storage policies for blog bucket
CREATE POLICY "Blog images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog');

CREATE POLICY "Admins can upload blog images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'blog' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update blog images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'blog' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete blog images"
ON storage.objects FOR DELETE
USING (bucket_id = 'blog' AND public.has_role(auth.uid(), 'admin'::app_role));