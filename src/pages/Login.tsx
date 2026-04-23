import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { WalletConnect } from '@/components/WalletConnect';
import { useWeb3 } from '@/hooks/useWeb3';
import { Shield, Stethoscope } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { authenticateUser } from '@/services/database';
import heroImage from '@/assets/medical-hero.jpg';

const Login = () => {
  const navigate = useNavigate();
  const { connected } = useWeb3();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!connected) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your MetaMask wallet first.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await authenticateUser(credentials.username, credentials.password);
      
      toast({
        title: 'Login Successful',
        description: 'Welcome to Emergency Health Card System',
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Invalid Credentials',
        description: 'Please enter valid username and password.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side - Hero Image */}
      <div className="hidden lg:block relative overflow-hidden">
        <img
          src={heroImage}
          alt="Secure healthcare technology with blockchain"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/50 flex items-center justify-center p-12">
          <div className="max-w-md text-primary-foreground space-y-6">
            <Shield className="h-16 w-16 mb-4" />
            <h2 className="text-4xl font-bold">Secure Healthcare Records</h2>
            <p className="text-lg opacity-90">
              Blockchain-powered emergency access health card system with encrypted IPFS storage and instant QR code retrieval.
            </p>
            <div className="space-y-3 pt-4">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                <span>Immutable blockchain records</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                <span>AES-256 encrypted storage</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                <span>Instant QR code access</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex items-center justify-center p-4 bg-background">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2 lg:hidden">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Shield className="h-10 w-10 text-primary" />
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Emergency Health Card
              </h1>
            </div>
            <p className="text-muted-foreground">
              Secure blockchain-based patient record management
            </p>
          </div>

          <Card className="shadow-medical">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-primary" />
                Doctor Login
              </CardTitle>
              <CardDescription>Connect your wallet and login to access the system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter your username"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  disabled={loading}
                />
              </div>

              <div className="space-y-3 pt-2">
                <WalletConnect />
                
                <Button onClick={handleLogin} className="w-full" variant="medical" disabled={!connected || loading}>
                  {loading ? 'Logging in...' : 'Login to Dashboard'}
                </Button>
              </div>

              <div className="text-xs text-center text-muted-foreground">
                <p></p>
              </div>
            </CardContent>
          </Card>

          <div className="text-center text-xs text-muted-foreground space-y-1">
            <p>Powered by Ethereum Blockchain & IPFS</p>
            <p>Your data is encrypted and decentralized</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
