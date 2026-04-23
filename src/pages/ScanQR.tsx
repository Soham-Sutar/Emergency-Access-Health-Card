import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WalletConnect } from '@/components/WalletConnect';
import { QRScanner } from '@/components/QRScanner';
import { PatientRecord } from '@/components/PatientRecord';
import { PatientForm } from '@/components/PatientForm';
import { useWeb3 } from '@/hooks/useWeb3';
import { getPatientFromBlockchain, updatePatientOnBlockchain } from '@/utils/blockchain';
import { retrieveFromIPFS, uploadToIPFS, PatientData } from '@/utils/ipfs';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const ScanQR = () => {
  const navigate = useNavigate();
  const { web3, account, connected } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [currentPatientId, setCurrentPatientId] = useState<string | null>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  // 🧠 Handle QR scan result
  const handleScan = async (scannedData: string) => {
    if (!web3) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your MetaMask wallet.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    let patientId = scannedData.trim();

    try {
      // 🩺 Handle case where QR contains JSON with IpfsHash or patient ID
      try {
        const parsed = JSON.parse(scannedData);
        if (parsed.patientId) patientId = parsed.patientId;
        else if (parsed.IpfsHash) patientId = parsed.IpfsHash;
      } catch {
        // not JSON — keep as-is
      }

      toast({
        title: 'Retrieving Record',
        description: 'Fetching patient data from blockchain...',
      });

      const record = await getPatientFromBlockchain(web3, patientId);
      console.log("📦 Cleaned record:", record);

      if (!record.ipfsCid) {
        throw new Error("Patient record not found");
      }

      const data = await retrieveFromIPFS(record.ipfsCid);


      // 🧩 Retrieve and decrypt IPFS data
      toast({
        title: 'Decrypting Data',
        description: 'Fetching from IPFS network...',
      });

      

      setPatientData(data);
      setCurrentPatientId(patientId);

      toast({
        title: 'Record Loaded',
        description: `Successfully loaded record for ${data.name}`,
      });
    } catch (error: any) {
      console.error('❌ Error retrieving patient record:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to retrieve patient record',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // 🩺 Update record flow
  const handleUpdate = async (formData: any) => {
    if (!connected || !web3 || !account || !currentPatientId) {
      toast({
        title: 'Error',
        description: 'Please connect your wallet before updating the record.',
        variant: 'destructive',
      });
      return;
    }

    setUpdating(true);

    try {
      const updatedData = {
        ...formData,
        timestamp: Date.now(),
        doctorAddress: account,
      };

      // Upload to IPFS
      toast({
        title: 'Uploading Updated Record',
        description: 'Encrypting and storing on IPFS...',
      });
      const newIpfsCid = await uploadToIPFS(updatedData);

      // Update blockchain record
      toast({
        title: 'Updating Blockchain',
        description: 'Saving new record hash on blockchain...',
      });
      await updatePatientOnBlockchain(web3, account, currentPatientId, newIpfsCid);

      // Update state
      setPatientData(updatedData);
      setUpdateDialogOpen(false);

      toast({
        title: 'Record Updated',
        description: 'Patient record successfully updated on blockchain',
      });
    } catch (error: any) {
      console.error('❌ Error updating record:', error);
      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update patient record',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  // Reset state to scan another
  const handleReset = () => {
    setPatientData(null);
    setCurrentPatientId(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold">Emergency Access</h1>
                <p className="text-xs text-muted-foreground">Scan QR for patient records</p>
              </div>
            </div>
          </div>
          <WalletConnect />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {!patientData ? (
            <>
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading patient record...</p>
                </div>
              ) : (
                <QRScanner onScanSuccess={handleScan} />
              )}
            </>
          ) : (
            <>
              <PatientRecord data={patientData} patientId={currentPatientId || undefined} />

              <div className="flex gap-4">
                <Button onClick={handleReset} variant="outline" className="flex-1">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Scan Another
                </Button>
                <Button
                  onClick={() => setUpdateDialogOpen(true)}
                  variant="medical"
                  className="flex-1"
                >
                  Update Record
                </Button>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Update Record Dialog */}
      <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update Patient Record</DialogTitle>
            <DialogDescription>
              Modify patient information. A new encrypted version will be created and stored on
              blockchain.
            </DialogDescription>
          </DialogHeader>
          {patientData && (
            <PatientForm
              onSubmit={handleUpdate}
              loading={updating}
              initialData={{
                name: patientData.name,
                age: patientData.age,
                gender: patientData.gender,
                bloodGroup: patientData.bloodGroup,
                allergies: patientData.allergies,
                medications: patientData.medications,
                medicalHistory: patientData.medicalHistory,
                emergencyContact: patientData.emergencyContact,
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScanQR;
