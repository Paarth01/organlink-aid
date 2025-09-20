import { Heart, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary/50 border-t border-border/40 mt-16">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 medical-gradient rounded-lg">
                <Heart className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                LifeLink
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Connecting lives through community-driven blood and organ donation. 
              Every donation saves lives.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary medical-transition">Become a Donor</a></li>
              <li><a href="#" className="hover:text-primary medical-transition">Find Donors</a></li>
              <li><a href="#" className="hover:text-primary medical-transition">Emergency Requests</a></li>
              <li><a href="#" className="hover:text-primary medical-transition">Success Stories</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary medical-transition">Donation Guidelines</a></li>
              <li><a href="#" className="hover:text-primary medical-transition">Health Requirements</a></li>
              <li><a href="#" className="hover:text-primary medical-transition">FAQs</a></li>
              <li><a href="#" className="hover:text-primary medical-transition">Support</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Contact</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>help@lifelink.org</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Healthcare District, City</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border/40 mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 LifeLink. All rights reserved. Saving lives through community connection.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;