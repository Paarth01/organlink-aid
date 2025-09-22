import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatsCard from "@/components/ui/stats-card";
import { useRequests } from "@/hooks/useRequests";
import { useState } from "react";
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
  const { requests, loading, createRequest } = useRequests();
  const [formData, setFormData] = useState({
    patient_name: '',
    organ_needed: '',
    blood_type_needed: '',
    urgency: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    description: '',
    patient_age: '',
    city: '',
    required_by: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patient_name || !formData.organ_needed || !formData.blood_type_needed || !formData.city) {
      return;
    }

    setSubmitting(true);
    const requestData = {
      ...formData,
      patient_age: formData.patient_age ? parseInt(formData.patient_age) : undefined,
      required_by: formData.required_by || undefined,
    };

    const { error } = await createRequest(requestData);
    if (!error) {
      setFormData({
        patient_name: '',
        organ_needed: '',
        blood_type_needed: '',
        urgency: 'medium',
        description: '',
        patient_age: '',
        city: '',
        required_by: ''
      });
    }
    setSubmitting(false);
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'critical':
        return <Badge variant="destructive" className="bg-emergency">CRITICAL</Badge>;
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
            value={requests.filter(r => r.status === 'pending').length.toString()}
            icon={Clock}
            trend={{ value: 12, label: "this week" }}
            variant="warning"
          />
          <StatsCard
            title="Matched Requests"
            value={requests.filter(r => r.status === 'matched').length.toString()}
            icon={Users}
            trend={{ value: 25, label: "this month" }}
            variant="success"
          />
          <StatsCard
            title="Completed Donations"
            value={requests.filter(r => r.status === 'completed').length.toString()}
            icon={CheckCircle}
            trend={{ value: 18, label: "this month" }}
          />
          <StatsCard
            title="Critical Cases"
            value={requests.filter(r => r.urgency === 'critical').length.toString()}
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
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-foreground">Patient Name *</label>
                      <Input 
                        placeholder="Enter patient name" 
                        className="mt-1"
                        value={formData.patient_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, patient_name: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Organ/Donation Type *</label>
                      <Select value={formData.organ_needed} onValueChange={(value) => setFormData(prev => ({ ...prev, organ_needed: value }))}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blood">Blood</SelectItem>
                          <SelectItem value="kidney">Kidney</SelectItem>
                          <SelectItem value="liver">Liver</SelectItem>
                          <SelectItem value="heart">Heart</SelectItem>
                          <SelectItem value="lung">Lung</SelectItem>
                          <SelectItem value="bone_marrow">Bone Marrow</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Blood Type *</label>
                      <Select value={formData.blood_type_needed} onValueChange={(value) => setFormData(prev => ({ ...prev, blood_type_needed: value }))}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select blood type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="a_positive">A+</SelectItem>
                          <SelectItem value="a_negative">A-</SelectItem>
                          <SelectItem value="b_positive">B+</SelectItem>
                          <SelectItem value="b_negative">B-</SelectItem>
                          <SelectItem value="ab_positive">AB+</SelectItem>
                          <SelectItem value="ab_negative">AB-</SelectItem>
                          <SelectItem value="o_positive">O+</SelectItem>
                          <SelectItem value="o_negative">O-</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">City *</label>
                      <Input 
                        placeholder="Enter city" 
                        className="mt-1"
                        value={formData.city}
                        onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Patient Age</label>
                      <Input 
                        placeholder="Enter patient age" 
                        type="number"
                        className="mt-1"
                        value={formData.patient_age}
                        onChange={(e) => setFormData(prev => ({ ...prev, patient_age: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Urgency Level</label>
                      <Select value={formData.urgency} onValueChange={(value: any) => setFormData(prev => ({ ...prev, urgency: value }))}>
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
                      <label className="text-sm font-medium text-foreground">Required By</label>
                      <Input 
                        type="date"
                        className="mt-1"
                        value={formData.required_by}
                        onChange={(e) => setFormData(prev => ({ ...prev, required_by: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Additional Notes</label>
                      <Textarea 
                        placeholder="Patient condition, special requirements..." 
                        className="mt-1 min-h-[80px]"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full medical-gradient"
                    disabled={submitting}
                  >
                    {submitting ? 'Submitting...' : 'Submit Request'}
                  </Button>
                </CardContent>
              </form>
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
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                    <p className="text-muted-foreground mt-2">Loading requests...</p>
                  </div>
                ) : requests.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No requests yet. Create your first request to get started.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {requests.map((request) => (
                      <Card 
                        key={request.id} 
                        className={`${
                          request.urgency === 'critical' ? 'border-emergency/20 bg-emergency/5 urgent-shadow' :
                          request.urgency === 'high' ? 'border-warning/20 bg-warning-light/10' :
                          ''
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                {getUrgencyBadge(request.urgency)}
                                <span className="text-sm text-muted-foreground">
                                  Submitted {getTimeAgo(request.created_at)}
                                </span>
                              </div>
                              <h3 className="font-semibold text-foreground">
                                {request.patient_name} - {request.organ_needed}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {request.description || `${request.organ_needed} needed for patient`}
                              </p>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <span>Blood Type: {request.blood_type_needed.replace('_', '')}</span>
                                <span>•</span>
                                <span>City: {request.city}</span>
                                {request.patient_age && (
                                  <>
                                    <span>•</span>
                                    <span>Age: {request.patient_age}</span>
                                  </>
                                )}
                              </div>
                              <div className="flex items-center space-x-2 mt-2">
                                {request.status === 'pending' ? (
                                  <>
                                    <Clock className="h-4 w-4 text-warning" />
                                    <span className="text-sm text-warning font-medium">Searching for matches...</span>
                                  </>
                                ) : request.status === 'matched' ? (
                                  <>
                                    <CheckCircle className="h-4 w-4 text-success" />
                                    <span className="text-sm text-success font-medium">Compatible donors found</span>
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="h-4 w-4 text-success" />
                                    <span className="text-sm text-success font-medium">Completed</span>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col space-y-2">
                              <Button size="sm" className="medical-gradient">
                                View Details
                              </Button>
                              <Button size="sm" variant="outline">
                                Edit Request
                              </Button>
                            </div>
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

export default HospitalPortal;