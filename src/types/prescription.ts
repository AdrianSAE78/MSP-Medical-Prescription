export interface Medication {
  id: string;
  name: string;
  quantity: string;
}

export interface Indication {
  id: string;
  medication: string;
  viaAdmin: string;
  dose: string;
  frequency: string;
  duration: string;
  morning: boolean;
  noon: boolean;
  afternoon: boolean;
  night: boolean;
}

export interface PrescriptionData {
  service: string;
  date: string;
  patientName: string;
  clinicHistory: string;
  identification: string;
  years: string;
  months: string;
  gender: 'male' | 'female' | '';
  medications: Medication[];
  prescriberName: string;
  patientNameIndications: string;
  dateIndications: string;
  recipeNumber: string;
  indications: Indication[];
  warnings: string;
  physicalActivity: '30' | '60' | '';
  institution?: string;
  coordination?: string;
  district?: string;
  healthCenter?: string;
}
