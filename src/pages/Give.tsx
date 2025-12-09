import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, CreditCard, RefreshCw, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router-dom';

export default function Give() {
  const [searchParams] = useSearchParams();
  const paymentStatus = searchParams.get('status');
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    amount: '',
    name: '',
    purpose: 'tithe',
  });

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount < 100) {
      toast.error('Minimum donation is ₦100');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('paystack-initialize', {
        body: {
          email: formData.email,
          amount: amount,
          metadata: {
            name: formData.name,
            purpose: formData.purpose,
          },
        },
      });

      if (error) throw error;

      if (data?.data?.authorization_url) {
        window.location.href = data.data.authorization_url;
      } else {
        throw new Error('Failed to get payment URL');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to initialize payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (paymentStatus === 'success') {
    return (
      <Layout>
        <section className="hero-gradient py-24 text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl md:text-7xl font-display text-primary-foreground mb-6">THANK YOU!</h1>
          </div>
        </section>
        <section className="section-padding">
          <div className="container mx-auto px-4 max-w-xl text-center">
            <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
            <h2 className="text-3xl font-display mb-4">Your Gift Has Been Received</h2>
            <p className="text-muted-foreground mb-8">
              Thank you for your generous donation to Christian Heroes Church. Your gift helps us continue our mission to serve the community.
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
          <h1 className="text-5xl md:text-7xl font-display text-primary-foreground mb-6">GIVE</h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Your generosity helps us make a difference in our community and beyond.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <Heart className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-display mb-4">WHY WE GIVE</h2>
            <p className="text-muted-foreground text-lg">
              "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver." - 2 Corinthians 9:7
            </p>
          </div>

          <Card className="max-w-xl mx-auto">
            <CardHeader className="text-center">
              <CreditCard className="w-12 h-12 text-primary mx-auto mb-4" />
              <CardTitle className="text-2xl font-display">Make a Donation</CardTitle>
              <p className="text-muted-foreground">Secure payment powered by Paystack</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePayment} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (₦) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="5000"
                    min="100"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                  />
                  <p className="text-xs text-muted-foreground">Minimum amount: ₦100</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purpose">Purpose</Label>
                  <select
                    id="purpose"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  >
                    <option value="tithe">Tithe</option>
                    <option value="offering">Offering</option>
                    <option value="building_fund">Building Fund</option>
                    <option value="missions">Missions</option>
                    <option value="welfare">Welfare</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Give Now
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="text-center mt-12 text-muted-foreground">
            <p className="mb-2">
              Questions about giving? Contact us at{' '}
              <a href="mailto:giving@christianheroes.church" className="text-primary hover:underline">
                giving@christianheroes.church
              </a>
            </p>
            <p className="text-sm">
              Christian Heroes Church is a registered organization. All donations are used for church ministry and community outreach.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
