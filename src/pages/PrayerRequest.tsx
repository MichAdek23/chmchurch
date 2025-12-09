import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Heart, Send, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { z } from 'zod';

const prayerRequestSchema = z.object({
  name: z.string().max(100, 'Name must be less than 100 characters').optional(),
  email: z.string().email('Please enter a valid email').max(255).optional().or(z.literal('')),
  request: z.string().min(10, 'Please provide more detail about your prayer request').max(2000, 'Prayer request must be less than 2000 characters'),
  is_private: z.boolean(),
});

export default function PrayerRequest() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    request: '',
    is_private: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = prayerRequestSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('prayer_requests').insert([{
        name: formData.name || null,
        email: formData.email || null,
        request: formData.request,
        is_private: formData.is_private,
      }]);

      if (error) throw error;
      setSubmitted(true);
      toast.success('Prayer request submitted');
    } catch (error) {
      console.error('Error submitting prayer request:', error);
      toast.error('Failed to submit prayer request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Layout>
        <section className="hero-gradient py-24 text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl md:text-7xl font-display text-primary-foreground mb-6">THANK YOU</h1>
          </div>
        </section>
        <section className="section-padding">
          <div className="container mx-auto px-4 max-w-xl text-center">
            <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
            <h2 className="text-3xl font-display mb-4">Your Prayer Request Has Been Received</h2>
            <p className="text-muted-foreground mb-8">
              Our prayer team will lift up your request to the Lord. Remember, God hears every prayer and He cares deeply for you.
            </p>
            <p className="text-muted-foreground italic mb-8">
              "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God." - Philippians 4:6
            </p>
            <Button asChild>
              <a href="/">Return Home</a>
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="hero-gradient py-24 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-display text-primary-foreground mb-6">PRAYER REQUEST</h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Share your prayer needs with us. Our prayer team is here to support you.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-12">
            <Heart className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-display mb-4">WE'RE HERE FOR YOU</h2>
            <p className="text-muted-foreground">
              Whether you're facing a difficult situation, celebrating a victory, or simply need spiritual support, we want to pray with you and for you.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Submit Your Prayer Request</CardTitle>
              <CardDescription>
                All prayer requests are treated with confidentiality and care.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name (Optional)</Label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email (Optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">We'll use this to follow up with you</p>
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="request">Your Prayer Request *</Label>
                  <Textarea
                    id="request"
                    placeholder="Share what's on your heart..."
                    rows={6}
                    value={formData.request}
                    onChange={(e) => setFormData({ ...formData, request: e.target.value })}
                    required
                  />
                  <p className="text-xs text-muted-foreground">{formData.request.length}/2000 characters</p>
                  {errors.request && <p className="text-sm text-destructive">{errors.request}</p>}
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="is_private"
                    checked={formData.is_private}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_private: checked as boolean })}
                  />
                  <div className="space-y-1">
                    <Label htmlFor="is_private" className="font-medium">Keep my request private</Label>
                    <p className="text-xs text-muted-foreground">
                      Private requests are only shared with the prayer team. Uncheck if you'd like to share with the congregation.
                    </p>
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Prayer Request
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="text-center mt-8 text-muted-foreground">
            <p>
              Need immediate prayer support?{' '}
              <a href="/contact" className="text-primary hover:underline">Contact us directly</a>
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
