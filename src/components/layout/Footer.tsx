import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube } from 'lucide-react';

const quickLinks = [
  { name: 'About Us', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Events', path: '/events' },
  { name: 'Sermons', path: '/sermons' },
  { name: 'Blog', path: '/blog' },
  { name: 'Give', path: '/give' },
  { name: 'Contact', path: '/contact' },
];

const socialLinks = [
  { name: 'Facebook', icon: Facebook, url: '#' },
  { name: 'Instagram', icon: Instagram, url: '#' },
  { name: 'YouTube', icon: Youtube, url: '#' },
];

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Church Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center">
                <span className="text-xl font-display text-secondary-foreground">CH</span>
              </div>
              <span className="text-xl font-display tracking-wide">CHRISTIAN HEROES</span>
            </div>
            <p className="text-background/70 mb-6">
              A community of believers committed to spreading the love of Christ and making disciples of all nations.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-display tracking-wide mb-6">QUICK LINKS</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-background/70 hover:text-secondary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Times */}
          <div>
            <h3 className="text-lg font-display tracking-wide mb-6">SERVICE TIMES</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-secondary mt-0.5" />
                <div>
                  <p className="font-medium">Sunday Service</p>
                  <p className="text-background/70 text-sm">9:00 AM & 11:00 AM</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-secondary mt-0.5" />
                <div>
                  <p className="font-medium">Wednesday Bible Study</p>
                  <p className="text-background/70 text-sm">7:00 PM</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-secondary mt-0.5" />
                <div>
                  <p className="font-medium">Friday Youth Night</p>
                  <p className="text-background/70 text-sm">6:30 PM</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-display tracking-wide mb-6">CONTACT US</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-secondary mt-0.5" />
                <div>
                  <p className="text-background/70 text-sm">
                    123 Faith Avenue<br />
                    Springfield, ST 12345
                  </p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-secondary" />
                <a href="tel:+15551234567" className="text-background/70 hover:text-secondary transition-colors text-sm">
                  (555) 123-4567
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-secondary" />
                <a href="mailto:info@christianheroes.church" className="text-background/70 hover:text-secondary transition-colors text-sm">
                  info@christianheroes.church
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 text-center text-background/50 text-sm">
          <p>© {new Date().getFullYear()} Christian Heroes Church. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}