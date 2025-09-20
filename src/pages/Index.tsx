import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StatsCard from "@/components/ui/stats-card";
import { 
  Heart, 
  Users, 
  Hospital, 
  Shield, 
  ArrowRight, 
  CheckCircle,
  Activity,
  Phone,
  MapPin,
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/medical-hero.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-95"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        ></div>
        <div className="relative container py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center text-white space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                Save Lives with
              </h1>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                LifeLink
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Connect donors with patients in need. Our community-driven platform makes blood and organ donation simple, secure, and life-saving.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/donor">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6">
                  <Heart className="w-5 h-5 mr-2" />
                  Become a Donor
                </Button>
              </Link>
              <Link to="/hospital">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-6">
                  <Hospital className="w-5 h-5 mr-2" />
                  Find Donors
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Making an Impact Together
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Every donation counts. See how our community is saving lives across the nation.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatsCard
              title="Lives Saved"
              value="2,847"
              icon={Heart}
              trend={{ value: 23, label: "this month" }}
              variant="success"
            />
            <StatsCard
              title="Active Donors"
              value="12,456"
              icon={Users}
              trend={{ value: 15, label: "this week" }}
            />
            <StatsCard
              title="Partner Hospitals"
              value="89"
              icon={Hospital}
              trend={{ value: 8, label: "this quarter" }}
            />
            <StatsCard
              title="Emergency Responses"
              value="156"
              icon={Activity}
              trend={{ value: 31, label: "this month" }}
              variant="emergency"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How LifeLink Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple, secure, and efficient donation matching process
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="card-shadow medical-transition hover:shadow-lg">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 medical-gradient rounded-full flex items-center justify-center mx-auto">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Register as Donor</h3>
                <p className="text-muted-foreground">
                  Create your profile with medical information and donation preferences. 
                  Set your availability and location.
                </p>
              </CardContent>
            </Card>

            <Card className="card-shadow medical-transition hover:shadow-lg">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 medical-gradient rounded-full flex items-center justify-center mx-auto">
                  <Activity className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Smart Matching</h3>
                <p className="text-muted-foreground">
                  Our AI-powered system matches compatible donors with patients based on 
                  medical requirements and proximity.
                </p>
              </CardContent>
            </Card>

            <Card className="card-shadow medical-transition hover:shadow-lg">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 medical-gradient rounded-full flex items-center justify-center mx-auto">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Save Lives</h3>
                <p className="text-muted-foreground">
                  Connect directly with hospitals and patients. Receive real-time 
                  notifications for emergency cases.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Emergency Alert */}
      <section className="py-12 bg-emergency/5 border-y border-emergency/20">
        <div className="container">
          <Card className="border-emergency/20 bg-emergency/10 urgent-shadow">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-emergency rounded-full flex items-center justify-center">
                    <Activity className="w-6 h-6 text-white animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">
                      Critical Blood Shortage Alert
                    </h3>
                    <p className="text-muted-foreground">
                      O- blood type critically low in Bay Area hospitals. Immediate donations needed.
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="destructive" className="bg-emergency">URGENT</Badge>
                  <Button className="medical-gradient">
                    Donate Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="py-16 bg-secondary/30">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Recent Success Stories</h2>
              <p className="text-muted-foreground">Lives saved through our community</p>
            </div>
            <Button variant="outline">
              View All Stories
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="card-shadow">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <Badge variant="secondary" className="bg-success-light text-success">Completed</Badge>
                  <span className="text-sm text-muted-foreground">2 hours ago</span>
                </div>
                <h3 className="font-semibold text-foreground">Emergency Blood Donation</h3>
                <p className="text-sm text-muted-foreground">
                  Maria S. donated O+ blood for emergency surgery patient at UCSF Medical Center.
                </p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-1" />
                  San Francisco, CA
                </div>
              </CardContent>
            </Card>

            <Card className="card-shadow">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <Badge variant="secondary" className="bg-success-light text-success">Completed</Badge>
                  <span className="text-sm text-muted-foreground">1 day ago</span>
                </div>
                <h3 className="font-semibold text-foreground">Kidney Transplant Match</h3>
                <p className="text-sm text-muted-foreground">
                  Anonymous donor provided life-saving kidney transplant to patient at Stanford Health.
                </p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-1" />
                  Palo Alto, CA
                </div>
              </CardContent>
            </Card>

            <Card className="card-shadow">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-warning" />
                  <Badge variant="secondary" className="bg-warning-light text-warning">In Progress</Badge>
                  <span className="text-sm text-muted-foreground">3 hours ago</span>
                </div>
                <h3 className="font-semibold text-foreground">Liver Donation Procedure</h3>
                <p className="text-sm text-muted-foreground">
                  David L. is currently donating partial liver tissue for critical patient at SF General.
                </p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-1" />
                  San Francisco, CA
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container">
          <Card className="medical-gradient text-white">
            <CardContent className="p-12 text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to Save Lives?
              </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Join thousands of heroes making a difference. Register today and become part of our life-saving community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/donor">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6">
                    <Heart className="w-5 h-5 mr-2" />
                    Register as Donor
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-6">
                  <Phone className="w-5 h-5 mr-2" />
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;