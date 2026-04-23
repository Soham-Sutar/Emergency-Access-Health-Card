import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WalletConnect } from '@/components/WalletConnect';
import { PatientForm } from '@/components/PatientForm';
import { QRCodeDisplay } from '@/components/QRCodeDisplay';
import { useWeb3 } from '@/hooks/useWeb3';
import { uploadToIPFS } from '@/utils/ipfs';
import { addPatientToBlockchain, generatePatientId } from '@/utils/blockchain';
import { toast } from '@/hooks/use-toast';
import { Shield } from 'lucide-react';

const AddPatient = () => {
  const navigate = useNavigate();
  const { web3, account, connected } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [generatedPatientId, setGeneratedPatientId] = useState<string | null>(null);
  const [patientName, setPatientName] = useState('');

  const handleSubmit = async (formData: any) => {
    if (!connected || !web3 || !account) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your MetaMask wallet first.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Generate unique patient ID
      const patientId = generatePatientId(formData.name, formData.age);
      
      // Prepare patient data
      const patientData = {
        ...formData,
        timestamp: Date.now(),
        doctorAddress: account,
      };

      // Upload to IPFS
      toast({
        title: 'Uploading to IPFS',
        description: 'Encrypting and storing patient data...',
      });
      const ipfsCid = await uploadToIPFS(patientData);

      // Store on blockchain
      toast({
        title: 'Storing on Blockchain',
        description: 'Creating immutable record...',
      });
      await addPatientToBlockchain(web3, account, patientId, ipfsCid);

      // Success
      setGeneratedPatientId(patientId);
      setPatientName(formData.name);
      
      toast({
        title: 'Patient Record Created',
        description: `Successfully registered ${formData.name}`,
      });
    } catch (error: any) {
      console.error('Error creating patient record:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create patient record. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold">Add New Patient</h1>
                <p className="text-xs text-muted-foreground">Create secure medical record</p>
              </div>
            </div>
          </div>
          <WalletConnect />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {!generatedPatientId ? (
            <PatientForm onSubmit={handleSubmit} loading={loading} />
          ) : (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-trust-green">Record Created Successfully!</h2>
                <p className="text-muted-foreground">
                  Patient record has been encrypted and stored on the blockchain
                </p>
              </div>

              <QRCodeDisplay patientId={generatedPatientId} patientName={patientName} />

              <div className="flex gap-4">
                <Button onClick={() => navigate('/dashboard')} variant="outline" className="flex-1">
                  Back to Dashboard
                </Button>
                <Button
                  onClick={() => {
                    setGeneratedPatientId(null);
                    setPatientName('');
                  }}
                  variant="medical"
                  className="flex-1"
                >
                  Add Another Patient
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AddPatient;
