import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Play, MapPin, ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center hero-gradient overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-secondary rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 text-secondary mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="text-sm font-medium">Join us this Sunday</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display text-primary-foreground mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            BECOME A<br />
            <span className="text-gradient">CHRISTIAN HERO</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-primary-foreground/80 mb-10 max-w-2xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Experience the transforming power of God's love. Join a community where faith comes alive and heroes are made.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Button size="lg" className="gold-gradient text-secondary-foreground hover:opacity-90 gap-2 text-lg px-8">
              <Link to="/services" className="flex items-center gap-2">
                Plan Your Visit
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 gap-2 text-lg px-8">
              <Link to="/sermons" className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                Watch Latest Sermon
              </Link>
            </Button>
          </div>

          {/* Service Times */}
          <div className="mt-16 flex flex-wrap gap-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-3 text-primary-foreground/80">
              <MapPin className="w-5 h-5 text-secondary" />
              <span>123 Faith Avenue, Springfield</span>
            </div>
            <div className="text-primary-foreground/80">
              <span className="text-secondary font-semibold">Sundays</span> at 9:00 AM & 11:00 AM
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
}