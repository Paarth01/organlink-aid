import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatsCard from "@/components/ui/stats-card";
import { 
  Hospital, 
  Plus, 
  Search, 
  Users, 
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Phone,
  MapPin
} from "lucide-react";

const HospitalPortal = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Hospital Portal</h1>
            <p className="text-muted-foreground">Manage patient requests and find compatible donors</p>
          </div>
          <Button className="medical-gradient">
            <Plus className="w-4 h-4 mr-2" />
            New Request
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard
            title="Active Requests"
            value="15"
            icon={Clock}
            trend={{ value: 12, label: "this week" }}
            variant="warning"
          />
          <StatsCard
            title="Matched Donors"
            value="8"
            icon={Users}
            trend={{ value: 25, label: "this month" }}
            variant="success"
          />
          <StatsCard
            title="Completed Donations"
            value="23"
            icon={CheckCircle}
            trend={{ value: 18, label: "this month" }}
          />
          <StatsCard
            title="Emergency Cases"
            value="3"
            icon={AlertTriangle}
            variant="emergency"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Request Form */}
          <div className="lg:col-span-1">
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="h-5 w-5 text-primary" />
                  <span>Quick Request</span>
                </CardTitle>
                <CardDescription>Submit a new donation request</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-foreground">Patient Name</label>
                    <Input placeholder="Enter patient name" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Donation Type</label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blood">Blood Donation</SelectItem>
                        <SelectItem value="kidney">Kidney</SelectItem>
                        <SelectItem value="liver">Liver</SelectItem>
                        <SelectItem value="heart">Heart</SelectItem>
                        <SelectItem value="lung">Lung</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Blood Type</label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select blood type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="a+">A+</SelectItem>
                        <SelectItem value="a-">A-</SelectItem>
                        <SelectItem value="b+">B+</SelectItem>
                        <SelectItem value="b-">B-</SelectItem>
                        <SelectItem value="ab+">AB+</SelectItem>
                        <SelectItem value="ab-">AB-</SelectItem>
                        <SelectItem value="o+">O+</SelectItem>
                        <SelectItem value="o-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Urgency Level</label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select urgency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Additional Notes</label>
                    <Textarea 
                      placeholder="Patient condition, special requirements..." 
                      className="mt-1 min-h-[80px]"
                    />
                  </div>
                </div>
                <Button className="w-full medical-gradient">
                  Submit Request
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Active Requests */}
          <div className="lg:col-span-2">
            <Card className="card-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Hospital className="h-5 w-5 text-primary" />
                      <span>Active Requests</span>
                    </CardTitle>
                    <CardDescription>Current patient donation requests and their status</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search requests..." className="pl-9 w-64" />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Critical Request */}
                  <Card className="border-emergency/20 bg-emergency/5 urgent-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Badge variant="destructive" className="bg-emergency">CRITICAL</Badge>
                            <span className="text-sm text-muted-foreground">Submitted 1 hour ago</span>
                          </div>
                          <h3 className="font-semibold text-foreground">Sarah Johnson - Blood Transfusion</h3>
                          <p className="text-sm text-muted-foreground">Emergency surgery requires O- blood transfusion immediately</p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>Blood Type: O-</span>
                            <span>•</span>
                            <span>Room: ER-204</span>
                          </div>
                          <div className="flex items-center space-x-2 mt-2">
                            <CheckCircle className="h-4 w-4 text-success" />
                            <span className="text-sm text-success font-medium">2 compatible donors found</span>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Button size="sm" className="medical-gradient">
                            View Matches
                          </Button>
                          <Button size="sm" variant="outline">
                            Edit Request
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* High Priority Request */}
                  <Card className="border-warning/20 bg-warning-light/10">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="bg-warning text-warning-foreground">HIGH</Badge>
                            <span className="text-sm text-muted-foreground">Submitted 6 hours ago</span>
                          </div>
                          <h3 className="font-semibold text-foreground">Michael Chen - Kidney Transplant</h3>
                          <p className="text-sm text-muted-foreground">End-stage renal disease, requires kidney transplant within 48 hours</p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>Blood Type: A+</span>
                            <span>•</span>
                            <span>Room: ICU-12</span>
                          </div>
                          <div className="flex items-center space-x-2 mt-2">
                            <Clock className="h-4 w-4 text-warning" />
                            <span className="text-sm text-warning font-medium">Searching for matches...</span>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                          <Button size="sm" variant="outline">
                            Edit Request
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Medium Priority Request */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">MEDIUM</Badge>
                            <span className="text-sm text-muted-foreground">Submitted 2 days ago</span>
                          </div>
                          <h3 className="font-semibold text-foreground">Emma Rodriguez - Liver Transplant</h3>
                          <p className="text-sm text-muted-foreground">Chronic liver disease, scheduled for transplant next week</p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>Blood Type: B+</span>
                            <span>•</span>
                            <span>Room: Ward-3A</span>
                          </div>
                          <div className="flex items-center space-x-2 mt-2">
                            <CheckCircle className="h-4 w-4 text-success" />
                            <span className="text-sm text-success font-medium">1 compatible donor matched</span>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Button size="sm" className="medical-gradient">
                            Contact Donor
                          </Button>
                          <Button size="sm" variant="outline">
                            View Details
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

export default HospitalPortal;