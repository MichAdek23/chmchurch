import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const { error } = await supabase.from('contact_submissions').insert({
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
    });

    setLoading(false);
    if (error) {
      toast({ title: 'Error', description: 'Failed to send message. Please try again.', variant: 'destructive' });
    } else {
      toast({ title: 'Message Sent!', description: 'We\'ll get back to you soon.' });
      form.reset();
    }
  };

  return (
    <Layout>
      <section className="hero-gradient py-24 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-display text-primary-foreground mb-6">CONTACT US</h1>
          <p className="text-xl text-primary-foreground/80">We'd love to hear from you!</p>
        </div>
      </section>
      <section className="section-padding">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div>
              <h2 className="text-3xl font-display mb-8">GET IN TOUCH</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div><Label htmlFor="name">Name *</Label><Input id="name" name="name" required /></div>
                  <div><Label htmlFor="email">Email *</Label><Input id="email" name="email" type="email" required /></div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><Label htmlFor="phone">Phone</Label><Input id="phone" name="phone" /></div>
                  <div><Label htmlFor="subject">Subject</Label><Input id="subject" name="subject" /></div>
                </div>
                <div><Label htmlFor="message">Message *</Label><Textarea id="message" name="message" rows={5} required /></div>
                <Button type="submit" size="lg" disabled={loading}>{loading ? 'Sending...' : 'Send Message'}</Button>
              </form>
            </div>
            <div>
              <h2 className="text-3xl font-display mb-8">CONTACT INFO</h2>
              <div className="space-y-6">
                <div className="flex gap-4 p-6 bg-muted rounded-xl"><MapPin className="text-primary" /><div><h3 className="font-medium">Address</h3><p className="text-muted-foreground">123 Faith Avenue, Springfield, ST 12345</p></div></div>
                <div className="flex gap-4 p-6 bg-muted rounded-xl"><Phone className="text-primary" /><div><h3 className="font-medium">Phone</h3><p className="text-muted-foreground">(555) 123-4567</p></div></div>
                <div className="flex gap-4 p-6 bg-muted rounded-xl"><Mail className="text-primary" /><div><h3 className="font-medium">Email</h3><p className="text-muted-foreground">info@christianheroes.church</p></div></div>
                <div className="flex gap-4 p-6 bg-muted rounded-xl"><Clock className="text-primary" /><div><h3 className="font-medium">Office Hours</h3><p className="text-muted-foreground">Mon-Fri: 9AM - 5PM</p></div></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}