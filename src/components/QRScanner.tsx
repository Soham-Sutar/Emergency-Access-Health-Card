import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScanLine, Camera, CameraOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface QRScannerProps {
  onScanSuccess: (patientId: string) => void;
}

export const QRScanner = ({ onScanSuccess }: QRScannerProps) => {
  const [scanning, setScanning] = useState(false);
  const [manualId, setManualId] = useState("");
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const startScanning = async () => {
    try {
      // Stop any previous instance
      if (scannerRef.current) {
        try {
          await scannerRef.current.stop();
          scannerRef.current.clear();
        } catch {
          /* ignore */
        }
        scannerRef.current = null;
      }

      const html5QrCode = new Html5Qrcode("qr-reader");
      scannerRef.current = html5QrCode;

      // Prefer a physical camera if available
      let cameraIdOrConfig: string | { facingMode: "environment" } = { facingMode: "environment" };
      try {
        const cams = await Html5Qrcode.getCameras();
        if (cams && cams.length > 0) {
          // prefer a back-facing camera if label suggests it, otherwise pick the last camera
          const back = cams.find((c) => /back|rear|environment/i.test(c.label));
          cameraIdOrConfig = (back ? back.id : cams[cams.length - 1].id) as string;
        }
      } catch {
        // fall back to facingMode config
      }

      await html5QrCode.start(
        cameraIdOrConfig,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          onScanSuccess(decodedText);
          stopScanning();
          toast({
            title: "QR Code Scanned",
            description: "Retrieving patient information...",
          });
        },
        (error) => {
          // ignore decode errors
        }
      );

      setScanning(true);
    } catch (err: any) {
      console.error("Error starting scanner:", err);
      toast({
        title: "Camera Error",
        description: err?.message || "Unable to access camera. Check permissions and try again.",
        variant: "destructive",
      });
      // ensure state consistent
      setScanning(false);
      if (scannerRef.current) {
        try {
          scannerRef.current.clear();
        } catch {}
        scannerRef.current = null;
      }
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (err) {
        console.error("Error stopping scanner:", err);
      } finally {
        scannerRef.current = null;
      }
    }
    setScanning(false);
  };

  const handleManualSubmit = () => {
    if (manualId.trim()) {
      onScanSuccess(manualId.trim());
      setManualId("");
    }
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .catch(() => {
            /* ignore */
          })
          .finally(() => {
            try {
              scannerRef.current?.clear();
            } catch {}
            scannerRef.current = null;
          });
      }
    };
  }, []);

  return (
    <Card className="shadow-card-medical">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ScanLine className="h-5 w-5 text-primary" />
          Scan Patient QR Code
        </CardTitle>
        <CardDescription>Scan the QR code or enter patient ID manually</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {/* keep the reader visible so html5-qrcode injects the video element */}
          <div
            id="qr-reader"
            className="w-full rounded-lg overflow-hidden"
            style={{ minHeight: 320, background: "#000" }}
            aria-hidden={!scanning}
          ></div>

          {!scanning ? (
            <Button onClick={startScanning} variant="medical" className="w-full">
              <Camera className="mr-2 h-4 w-4" />
              Start Camera Scanner
            </Button>
          ) : (
            <Button onClick={stopScanning} variant="destructive" className="w-full">
              <CameraOff className="mr-2 h-4 w-4" />
              Stop Scanner
            </Button>
          )}
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Enter Patient ID manually"
            value={manualId}
            onChange={(e) => setManualId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleManualSubmit()}
          />
          <Button onClick={handleManualSubmit} variant="outline">
            Submit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};