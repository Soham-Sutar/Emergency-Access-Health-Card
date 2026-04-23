import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  User,
  Calendar,
  Heart,
  Pill,
  FileText,
  Phone,
  Droplet,
  Clock,
  Wallet,
} from 'lucide-react';
import { PatientData } from '@/utils/ipfs';

interface PatientRecordProps {
  data: PatientData;
  patientId?: string;
}

export const PatientRecord = ({ data, patientId }: PatientRecordProps) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Card className="shadow-medical">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <User className="h-6 w-6 text-primary" />
              {data.name}
            </CardTitle>
            <CardDescription>Patient Medical Record</CardDescription>
          </div>
          <Badge variant="outline" className="text-xs">
            {data.gender}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {patientId && (
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Patient ID</p>
            <p className="font-mono text-sm">{patientId}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-medical-blue-light rounded-lg">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Age</p>
              <p className="font-semibold">{data.age} years</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-alert-red/10 rounded-lg">
              <Droplet className="h-5 w-5 text-alert-red" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Blood Group</p>
              <p className="font-semibold">{data.bloodGroup}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-trust-green/10 rounded-lg">
              <Phone className="h-5 w-5 text-trust-green" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Emergency</p>
              <p className="font-semibold text-sm">{data.emergencyContact}</p>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Heart className="h-4 w-4 text-alert-red" />
              <h3 className="font-semibold">Allergies</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {data.allergies || 'No known allergies'}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Pill className="h-4 w-4 text-primary" />
              <h3 className="font-semibold">Current Medications</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {data.medications || 'No current medications'}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-primary" />
              <h3 className="font-semibold">Medical History</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {data.medicalHistory || 'No significant medical history'}
            </p>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3" />
            <span>Last Updated: {formatDate(data.timestamp)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Wallet className="h-3 w-3" />
            <span className="font-mono truncate">
              Doctor: {data.doctorAddress.substring(0, 6)}...{data.doctorAddress.substring(38)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
