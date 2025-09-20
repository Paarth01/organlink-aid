import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Menu, User, Hospital, Shield, Activity } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-10 h-10 medical-gradient rounded-lg">
            <Heart className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            LifeLink
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/donor">
            <Button variant="ghost" className="text-foreground/80 hover:text-foreground">
              <User className="w-4 h-4 mr-2" />
              Donor Portal
            </Button>
          </Link>
          <Link to="/hospital">
            <Button variant="ghost" className="text-foreground/80 hover:text-foreground">
              <Hospital className="w-4 h-4 mr-2" />
              Hospital Portal
            </Button>
          </Link>
          <Button variant="ghost" className="text-foreground/80 hover:text-foreground">
            <Shield className="w-4 h-4 mr-2" />
            Admin
          </Button>
          <Button variant="ghost" className="text-foreground/80 hover:text-foreground">
            <Activity className="w-4 h-4 mr-2" />
            Analytics
          </Button>
        </nav>

        {/* Authentication Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          <Button variant="outline">Sign In</Button>
          <Button className="medical-gradient">Get Started</Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border/40">
          <Card className="m-4 p-4 space-y-2">
            <Link to="/donor">
              <Button variant="ghost" className="w-full justify-start">
                <User className="w-4 h-4 mr-2" />
                Donor Portal
              </Button>
            </Link>
            <Link to="/hospital">
              <Button variant="ghost" className="w-full justify-start">
                <Hospital className="w-4 h-4 mr-2" />
                Hospital Portal
              </Button>
            </Link>
            <Button variant="ghost" className="w-full justify-start">
              <Shield className="w-4 h-4 mr-2" />
              Admin
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Activity className="w-4 h-4 mr-2" />
              Analytics
            </Button>
            <div className="pt-4 space-y-2">
              <Button variant="outline" className="w-full">
                Sign In
              </Button>
              <Button className="w-full medical-gradient">
                Get Started
              </Button>
            </div>
          </Card>
        </div>
      )}
    </header>
  );
};

export default Header;