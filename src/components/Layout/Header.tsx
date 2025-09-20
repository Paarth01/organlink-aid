import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Heart, Menu, User, Hospital, Shield, Activity, LogOut } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getRoleRoute = (role: string) => {
    switch (role) {
      case 'donor':
        return '/donor';
      case 'hospital':
      case 'ngo':
      case 'admin':
        return '/hospital';
      default:
        return '/';
    }
  };

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
          {!user && (
            <>
              <a
                href="#features"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                How It Works
              </a>
              <a
                href="#testimonials"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Stories
              </a>
            </>
          )}
          
          {user && profile && (
            <>
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
              {['admin', 'ngo'].includes(profile.role) && (
                <Button variant="ghost" className="text-foreground/80 hover:text-foreground">
                  <Activity className="w-4 h-4 mr-2" />
                  Analytics
                </Button>
              )}
            </>
          )}
        </nav>

        {/* Authentication Section */}
        <div className="hidden md:flex items-center space-x-3">
          {!user && (
            <>
              <Button variant="outline" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
              <Button className="medical-gradient" asChild>
                <Link to="/auth">Get Started</Link>
              </Button>
            </>
          )}
          
          {user && profile && (
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="capitalize">
                {profile.role}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to={getRoleRoute(profile.role)}>
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
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
            {user && profile && (
              <>
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
                {['admin', 'ngo'].includes(profile.role) && (
                  <Button variant="ghost" className="w-full justify-start">
                    <Activity className="w-4 h-4 mr-2" />
                    Analytics
                  </Button>
                )}
                <div className="pt-4 space-y-2">
                  <Button variant="outline" className="w-full" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </>
            )}
            
            {!user && (
              <div className="pt-4 space-y-2">
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button className="w-full medical-gradient" asChild>
                  <Link to="/auth">Get Started</Link>
                </Button>
              </div>
            )}
          </Card>
        </div>
      )}
    </header>
  );
};

export default Header;