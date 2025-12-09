import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, Users, MessageCircle } from 'lucide-react';

export function CTASection() {
  return (
    <section className="section-padding hero-gradient relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display text-primary-foreground mb-6">
            JOIN OUR COMMUNITY
          </h2>
          <p className="text-xl text-primary-foreground/80">
            Whether you're new to faith or have been walking with Christ for years, there's a place for you here.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Give */}
          <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-full gold-gradient mx-auto mb-6 flex items-center justify-center">
              <Heart className="w-8 h-8 text-secondary-foreground" />
            </div>
            <h3 className="text-2xl font-display text-primary-foreground mb-4">GIVE</h3>
            <p className="text-primary-foreground/70 mb-6">
              Support our mission and help us make a difference in our community and beyond.
            </p>
            <Button asChild className="gold-gradient text-secondary-foreground hover:opacity-90 w-full">
              <Link to="/give">Give Now</Link>
            </Button>
          </div>

          {/* Connect */}
          <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-full gold-gradient mx-auto mb-6 flex items-center justify-center">
              <Users className="w-8 h-8 text-secondary-foreground" />
            </div>
            <h3 className="text-2xl font-display text-primary-foreground mb-4">CONNECT</h3>
            <p className="text-primary-foreground/70 mb-6">
              Find your community through small groups, ministries, and volunteer opportunities.
            </p>
            <Button asChild className="gold-gradient text-secondary-foreground hover:opacity-90 w-full">
              <Link to="/about">Get Connected</Link>
            </Button>
          </div>

          {/* Prayer */}
          <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-full gold-gradient mx-auto mb-6 flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-secondary-foreground" />
            </div>
            <h3 className="text-2xl font-display text-primary-foreground mb-4">PRAYER</h3>
            <p className="text-primary-foreground/70 mb-6">
              Submit a prayer request and let our community lift you up in prayer.
            </p>
            <Button asChild className="gold-gradient text-secondary-foreground hover:opacity-90 w-full">
              <Link to="/prayer-request">Request Prayer</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}