import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <Layout>
      <section className="hero-gradient py-24 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-display text-primary-foreground mb-6">ABOUT US</h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">Discover our mission, vision, and the heart behind Christian Heroes Church.</p>
        </div>
      </section>
      <section className="section-padding">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-display mb-6">OUR MISSION</h2>
          <p className="text-muted-foreground text-lg mb-8">To inspire and equip everyday believers to become heroes of faith, transforming lives and communities through the love of Jesus Christ.</p>
          <h2 className="text-3xl font-display mb-6">OUR VISION</h2>
          <p className="text-muted-foreground text-lg mb-8">A world where every person knows their identity in Christ and lives out their God-given purpose with courage and conviction.</p>
          <h2 className="text-3xl font-display mb-6">OUR BELIEFS</h2>
          <ul className="space-y-4 text-muted-foreground text-lg mb-8">
            <li>• We believe in one God, eternally existing in three persons: Father, Son, and Holy Spirit.</li>
            <li>• We believe the Bible is the inspired, authoritative Word of God.</li>
            <li>• We believe in salvation by grace through faith in Jesus Christ.</li>
            <li>• We believe in the resurrection of Jesus and His return.</li>
          </ul>
          <Button asChild size="lg"><Link to="/contact">Get In Touch</Link></Button>
        </div>
      </section>
    </Layout>
  );
}