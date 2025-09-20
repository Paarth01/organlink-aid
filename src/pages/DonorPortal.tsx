import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import StatsCard from "@/components/ui/stats-card";
import { 
  Heart, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Hospital
} from "lucide-react";

const DonorPortal = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Donor Portal</h1>
            <p className="text-muted-foreground">Manage your donation profile and view match requests</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Available for donation</span>
            <Switch defaultChecked />
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard
            title="Lives Impacted"
            value="12"
            icon={Heart}
            trend={{ value: 20, label: "this month" }}
            variant="success"
          />
          <StatsCard
            title="Total Donations"
            value="8"
            icon={CheckCircle}
            trend={{ value: 14, label: "this year" }}
          />
          <StatsCard
            title="Pending Matches"
            value="3"
            icon={Clock}
            variant="warning"
          />
          <StatsCard
            title="Emergency Requests"
            value="1"
            icon={AlertCircle}
            variant="emergency"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-1">
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-primary" />
                  <span>Donor Profile</span>
                </CardTitle>
                <CardDescription>Your donation information and contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    <p className="text-foreground font-medium">John Doe</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Blood Type</label>
                    <Badge variant="outline" className="ml-2 border-emergency text-emergency">O+</Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Organ Types</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Badge variant="secondary">Kidney</Badge>
                      <Badge variant="secondary">Liver</Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>San Francisco, CA</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4 text-primary" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4 text-primary" />
                    <span>john.doe@email.com</span>
                  </div>
                </div>
                <Button className="w-full medical-gradient">
                  Update Profile
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Match Requests */}
          <div className="lg:col-span-2">
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-emergency" />
                  <span>Active Match Requests</span>
                </CardTitle>
                <CardDescription>Patients who could benefit from your donation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Emergency Request */}
                  <Card className="border-emergency/20 bg-emergency/5 urgent-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Badge variant="destructive" className="bg-emergency">URGENT</Badge>
                            <span className="text-sm text-muted-foreground">Posted 2 hours ago</span>
                          </div>
                          <h3 className="font-semibold text-foreground">Blood Donation - O+ Needed</h3>
                          <p className="text-sm text-muted-foreground">Patient requires immediate blood transfusion for emergency surgery</p>
                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center space-x-1">
                              <Hospital className="h-4 w-4 text-primary" />
                              <span>St. Mary's Hospital</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4 text-primary" />
                              <span>2.3 miles away</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Button size="sm" className="medical-gradient">
                            Accept Match
                          </Button>
                          <Button size="sm" variant="outline">
                            More Info
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Regular Requests */}
                  <Card className="border-warning/20 bg-warning-light/10">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="bg-warning text-warning-foreground">HIGH</Badge>
                            <span className="text-sm text-muted-foreground">Posted 1 day ago</span>
                          </div>
                          <h3 className="font-semibold text-foreground">Kidney Donation Match</h3>
                          <p className="text-sm text-muted-foreground">Compatible kidney recipient found through organ matching program</p>
                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center space-x-1">
                              <Hospital className="h-4 w-4 text-primary" />
                              <span>UCSF Medical Center</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4 text-primary" />
                              <span>8.1 miles away</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Button size="sm" className="medical-gradient">
                            Accept Match
                          </Button>
                          <Button size="sm" variant="outline">
                            More Info
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">MEDIUM</Badge>
                            <span className="text-sm text-muted-foreground">Posted 3 days ago</span>
                          </div>
                          <h3 className="font-semibold text-foreground">Liver Tissue Donation</h3>
                          <p className="text-sm text-muted-foreground">Partial liver donation for scheduled transplant procedure</p>
                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center space-x-1">
                              <Hospital className="h-4 w-4 text-primary" />
                              <span>Stanford Health Care</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4 text-primary" />
                              <span>15.7 miles away</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Button size="sm" className="medical-gradient">
                            Accept Match
                          </Button>
                          <Button size="sm" variant="outline">
                            More Info
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorPortal;