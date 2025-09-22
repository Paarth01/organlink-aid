import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import StatsCard from "@/components/ui/stats-card";
import { useMatches } from "@/hooks/useMatches";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
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
  const { matches, loading, updateMatchStatus } = useMatches();
  const { profile } = useAuth();
  const [updatingMatch, setUpdatingMatch] = useState<string | null>(null);

  const handleMatchAction = async (matchId: string, action: 'accepted' | 'declined') => {
    setUpdatingMatch(matchId);
    await updateMatchStatus(matchId, action);
    setUpdatingMatch(null);
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'critical':
        return <Badge variant="destructive" className="bg-emergency">URGENT</Badge>;
      case 'high':
        return <Badge variant="secondary" className="bg-warning text-warning-foreground">HIGH</Badge>;
      case 'medium':
        return <Badge variant="outline">MEDIUM</Badge>;
      case 'low':
        return <Badge variant="secondary">LOW</Badge>;
      default:
        return <Badge variant="outline">{urgency}</Badge>;
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Less than 1 hour ago';
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

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
            title="Total Matches"
            value={matches.length.toString()}
            icon={Heart}
            trend={{ value: 20, label: "this month" }}
            variant="success"
          />
          <StatsCard
            title="Accepted"
            value={matches.filter(m => m.status === 'accepted').length.toString()}
            icon={CheckCircle}
            trend={{ value: 14, label: "this year" }}
          />
          <StatsCard
            title="Pending Matches"
            value={matches.filter(m => m.status === 'pending').length.toString()}
            icon={Clock}
            variant="warning"
          />
          <StatsCard
            title="Critical Cases"
            value={matches.filter(m => m.requests.urgency === 'critical').length.toString()}
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
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                    <p className="text-muted-foreground mt-2">Loading matches...</p>
                  </div>
                ) : matches.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No matches yet. We'll notify you when compatible requests are found.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {matches.map((match) => (
                      <Card 
                        key={match.id} 
                        className={`${
                          match.requests.urgency === 'critical' ? 'border-emergency/20 bg-emergency/5 urgent-shadow' :
                          match.requests.urgency === 'high' ? 'border-warning/20 bg-warning-light/10' :
                          ''
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                {getUrgencyBadge(match.requests.urgency)}
                                <span className="text-sm text-muted-foreground">
                                  Matched {getTimeAgo(match.matched_at)}
                                </span>
                                {match.status !== 'pending' && (
                                  <Badge variant={match.status === 'accepted' ? 'default' : 'secondary'}>
                                    {match.status.toUpperCase()}
                                  </Badge>
                                )}
                              </div>
                              <h3 className="font-semibold text-foreground">
                                {match.requests.organ_needed} Donation - {match.requests.blood_type_needed.replace('_', '')} Needed
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {match.requests.description || `${match.requests.organ_needed} needed for ${match.requests.patient_name}`}
                              </p>
                              <div className="flex items-center space-x-4 text-sm">
                                <div className="flex items-center space-x-1">
                                  <Hospital className="h-4 w-4 text-primary" />
                                  <span>{match.requests.hospitals.name}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <MapPin className="h-4 w-4 text-primary" />
                                  <span>{match.requests.city}</span>
                                </div>
                              </div>
                              {match.notes && (
                                <p className="text-xs text-muted-foreground">
                                  {match.notes}
                                </p>
                              )}
                            </div>
                            {match.status === 'pending' ? (
                              <div className="flex flex-col space-y-2">
                                <Button 
                                  size="sm" 
                                  className="medical-gradient"
                                  onClick={() => handleMatchAction(match.id, 'accepted')}
                                  disabled={updatingMatch === match.id}
                                >
                                  {updatingMatch === match.id ? 'Processing...' : 'Accept Match'}
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleMatchAction(match.id, 'declined')}
                                  disabled={updatingMatch === match.id}
                                >
                                  Decline
                                </Button>
                              </div>
                            ) : (
                              <div className="flex flex-col space-y-2">
                                <Button size="sm" variant="outline">
                                  View Details
                                </Button>
                                {match.status === 'accepted' && (
                                  <Button size="sm" className="medical-gradient">
                                    Contact Hospital
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorPortal;