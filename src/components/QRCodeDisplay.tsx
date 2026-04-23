import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, QrCode } from 'lucide-react';

interface QRCodeDisplayProps {
  patientId: string;
  patientName: string;
}

export const QRCodeDisplay = ({ patientId, patientName }: QRCodeDisplayProps) => {
  const downloadQRCode = () => {
    const svg = document.getElementById('patient-qr-code');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');

      const downloadLink = document.createElement('a');
      downloadLink.download = `${patientName}-health-card-qr.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <Card className="shadow-medical">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <QrCode className="h-5 w-5 text-primary" />
          Emergency Access QR Code
        </CardTitle>
        <CardDescription>Scan this code for instant patient record access</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <div className="p-4 bg-background rounded-lg shadow-card-medical">
          <QRCodeSVG
            id="patient-qr-code"
            value={patientId}
            size={256}
            level="H"
            includeMargin={true}
            fgColor="hsl(211 100% 43%)"
          />
        </div>
        <div className="text-center space-y-2">
          <p className="text-sm font-medium">Patient ID</p>
          <p className="text-xs font-mono bg-muted px-3 py-1 rounded">{patientId}</p>
        </div>
        <Button onClick={downloadQRCode} variant="success" className="w-full">
          <Download className="mr-2 h-4 w-4" />
          Download QR Code
        </Button>
      </CardContent>
    </Card>
  );
};
