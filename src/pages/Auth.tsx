import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, Building, Users, Shield, AlertCircle } from 'lucide-react';
import { signInSchema, signUpSchema, type SignInFormData, type SignUpFormData } from '@/lib/validations';
import { useToast } from '@/hooks/use-toast';

type UserRole = 'donor' | 'hospital' | 'ngo' | 'admin';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('donor');
  const [hospitalName, setHospitalName] = useState('');
  const [hospitalAddress, setHospitalAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Validate form data
    const formData: SignInFormData = { email, password };
    const validation = signInSchema.safeParse(formData);
    
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((error) => {
        if (error.path[0]) {
          fieldErrors[error.path[0] as string] = error.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    
    if (error) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      navigate('/');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Validate form data
    const formData: SignUpFormData = { 
      email, 
      password, 
      fullName, 
      role,
      hospitalName: role === 'hospital' ? hospitalName : undefined,
      hospitalAddress: role === 'hospital' ? hospitalAddress : undefined
    };
    
    const validation = signUpSchema.safeParse(formData);
    
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((error) => {
        if (error.path[0]) {
          fieldErrors[error.path[0] as string] = error.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    const userData = { 
      full_name: fullName, 
      role,
      ...(role === 'hospital' && {
        hospital_name: hospitalName,
        hospital_address: hospitalAddress
      })
    };
    const { error } = await signUp(email, password, userData);
    setLoading(false);
    
    if (error) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Account created successfully",
        description: "Please check your email to verify your account.",
        variant: "default",
      });
      setEmail('');
      setPassword('');
      setFullName('');
      setHospitalName('');
      setHospitalAddress('');
    }
  };

  const roleIcons = {
    donor: Heart,
    hospital: Building,
    ngo: Users,
    admin: Shield
  };

  const getRoleDescription = (role: UserRole) => {
    switch (role) {
      case 'donor':
        return 'Individual donors who can donate blood and organs';
      case 'hospital':
        return 'Medical institutions that manage patient requests';
      case 'ngo':
        return 'Non-profit organizations coordinating donations';
      case 'admin':
        return 'System administrators with full access';
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md card-shadow">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-emergency mr-2" />
            <CardTitle className="text-2xl font-bold medical-gradient bg-clip-text text-transparent">
              LifeLink
            </CardTitle>
          </div>
          <CardDescription>
            Join our community to save lives through donations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className={errors.email ? "border-destructive" : ""}
                    required
                  />
                  {errors.email && (
                    <div className="flex items-center text-sm text-destructive">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.email}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className={errors.password ? "border-destructive" : ""}
                    required
                  />
                  {errors.password && (
                    <div className="flex items-center text-sm text-destructive">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.password}
                    </div>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full medical-gradient"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className={errors.fullName ? "border-destructive" : ""}
                    required
                  />
                  {errors.fullName && (
                    <div className="flex items-center text-sm text-destructive">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.fullName}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className={errors.email ? "border-destructive" : ""}
                    required
                  />
                  {errors.email && (
                    <div className="flex items-center text-sm text-destructive">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.email}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password (8+ chars, uppercase, lowercase, number)"
                    className={errors.password ? "border-destructive" : ""}
                    required
                  />
                  {errors.password && (
                    <div className="flex items-center text-sm text-destructive">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.password}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Account Type</Label>
                  <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your account type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(roleIcons).map(([roleKey, Icon]) => (
                        <SelectItem key={roleKey} value={roleKey}>
                          <div className="flex items-center space-x-2">
                            <Icon className="h-4 w-4" />
                            <div className="flex flex-col">
                              <span className="capitalize font-medium">{roleKey}</span>
                              <span className="text-xs text-muted-foreground">
                                {getRoleDescription(roleKey as UserRole)}
                              </span>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {role === 'hospital' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="hospital-name">Hospital Name</Label>
                      <Input
                        id="hospital-name"
                        type="text"
                        value={hospitalName}
                        onChange={(e) => setHospitalName(e.target.value)}
                        placeholder="Enter hospital name"
                        className={errors.hospitalName ? "border-destructive" : ""}
                        required
                      />
                      {errors.hospitalName && (
                        <div className="flex items-center text-sm text-destructive">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.hospitalName}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hospital-address">Hospital Address</Label>
                      <Input
                        id="hospital-address"
                        type="text"
                        value={hospitalAddress}
                        onChange={(e) => setHospitalAddress(e.target.value)}
                        placeholder="Enter hospital address"
                        className={errors.hospitalAddress ? "border-destructive" : ""}
                        required
                      />
                      {errors.hospitalAddress && (
                        <div className="flex items-center text-sm text-destructive">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.hospitalAddress}
                        </div>
                      )}
                    </div>
                  </>
                )}
                <Button
                  type="submit"
                  className="w-full medical-gradient"
                  disabled={loading}
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;