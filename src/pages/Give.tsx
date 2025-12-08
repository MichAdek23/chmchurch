import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Heart, CreditCard, RefreshCw } from 'lucide-react';

export default function Give() {
  return (
    <Layout>
      <section className="hero-gradient py-24 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-display text-primary-foreground mb-6">GIVE</h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">Your generosity helps us make a difference in our community and beyond.</p>
        </div>
      </section>
      <section className="section-padding">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <Heart className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-display mb-4">WHY WE GIVE</h2>
            <p className="text-muted-foreground text-lg">"Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver." - 2 Corinthians 9:7</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="p-8 bg-muted rounded-2xl text-center">
              <CreditCard className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-display mb-3">ONE-TIME GIFT</h3>
              <p className="text-muted-foreground mb-6">Make a single donation to support our ministry.</p>
              <Button size="lg" className="w-full">Give Now</Button>
            </div>
            <div className="p-8 bg-muted rounded-2xl text-center">
              <RefreshCw className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-display mb-3">RECURRING GIVING</h3>
              <p className="text-muted-foreground mb-6">Set up automatic recurring donations.</p>
              <Button size="lg" variant="outline" className="w-full">Set Up Recurring</Button>
            </div>
          </div>
          <div className="text-center text-muted-foreground">
            <p className="mb-2">Questions about giving? Contact us at <a href="mailto:giving@christianheroes.church" className="text-primary hover:underline">giving@christianheroes.church</a></p>
            <p className="text-sm">Christian Heroes Church is a 501(c)(3) organization. All donations are tax-deductible.</p>
          </div>
        </div>
      </section>
    </Layout>
  );
}