import { Layout } from '@/components/layout/Layout';
import { MapPin, Clock, Car } from 'lucide-react';

export default function Services() {
  return (
    <Layout>
      <section className="hero-gradient py-24 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-display text-primary-foreground mb-6">SERVICES & LOCATION</h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">Join us for worship. Everyone is welcome!</p>
        </div>
      </section>
      <section className="section-padding">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div>
              <h2 className="text-3xl font-display mb-8 flex items-center gap-3"><Clock className="text-primary" /> SERVICE TIMES</h2>
              <div className="space-y-6">
                <div className="p-6 bg-muted rounded-xl"><h3 className="font-display text-xl mb-2">SUNDAY WORSHIP</h3><p className="text-muted-foreground">9:00 AM & 11:00 AM</p></div>
                <div className="p-6 bg-muted rounded-xl"><h3 className="font-display text-xl mb-2">WEDNESDAY BIBLE STUDY</h3><p className="text-muted-foreground">7:00 PM</p></div>
                <div className="p-6 bg-muted rounded-xl"><h3 className="font-display text-xl mb-2">FRIDAY YOUTH NIGHT</h3><p className="text-muted-foreground">6:30 PM</p></div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-display mb-8 flex items-center gap-3"><MapPin className="text-primary" /> LOCATION</h2>
              <div className="p-6 bg-muted rounded-xl mb-6">
                <p className="text-lg font-medium mb-2">Christian Heroes Church</p>
                <p className="text-muted-foreground">123 Faith Avenue<br/>Springfield, ST 12345</p>
              </div>
              <div className="aspect-video bg-muted rounded-xl flex items-center justify-center">
                <p className="text-muted-foreground">Map placeholder</p>
              </div>
              <div className="mt-6 p-6 bg-muted rounded-xl flex items-start gap-3">
                <Car className="text-primary mt-1" />
                <div><h3 className="font-medium mb-1">Parking</h3><p className="text-muted-foreground text-sm">Free parking available in our main lot and overflow lot across the street.</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}