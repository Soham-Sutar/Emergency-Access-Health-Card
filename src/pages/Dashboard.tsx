import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WalletConnect } from '@/components/WalletConnect';
import {
  UserPlus,
  ScanLine,
  Shield,
  Database,
  FileText,
  Activity,
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Add New Patient',
      description: 'Register a new patient with encrypted medical records',
      icon: UserPlus,
      path: '/add-patient',
      color: 'text-primary',
      bgColor: 'bg-medical-blue-light',
    },
    {
      title: 'Scan QR Code',
      description: 'Quick emergency access to patient records',
      icon: ScanLine,
      path: '/scan',
      color: 'text-trust-green',
      bgColor: 'bg-trust-green/10',
    },
  ];

  const stats = [
    {
      label: 'Blockchain Network',
      value: 'Ethereum',
      icon: Database,
      color: 'text-primary',
    },
    {
      label: 'Storage',
      value: 'IPFS',
      icon: FileText,
      color: 'text-trust-green',
    },
    {
      label: 'Security',
      value: 'AES Encrypted',
      icon: Shield,
      color: 'text-alert-red',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Emergency Health Card</h1>
              <p className="text-xs text-muted-foreground">Blockchain Healthcare System</p>
            </div>
          </div>
          <WalletConnect />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Doctor Dashboard</h2>
            <p className="text-muted-foreground">
              Manage patient records securely on the blockchain
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <Card key={index} className="shadow-card-medical">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-lg font-semibold">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="shadow-medical hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => navigate(feature.path)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <div className={`p-3 rounded-lg ${feature.bgColor}`}>
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                  </div>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Go to {feature.title}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-gradient-card shadow-card-medical">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                System Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>Immutable blockchain record storage</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>AES-256 encrypted patient data on IPFS</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>QR code for instant emergency access</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>MetaMask wallet authentication</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>Update records with automatic version tracking</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
