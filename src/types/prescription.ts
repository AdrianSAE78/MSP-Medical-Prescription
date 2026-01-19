export interface Medication {
  id: string;
  name: string;
  quantity: string;
  quantity_write: string; // Cantidad escrita en palabras
  productId?: number; // ID del producto en la base de datos
}

export interface Indication {
  id: string;
  medication: string;
  viaAdmin: string;
  dose: string;
  dose_write: string;
  frequency: string;
  duration: string;
  morning: boolean;
  noon: boolean;
  afternoon: boolean;
  night: boolean;
  productId?: number; // ID del producto en la base de datos
}

export interface PrescriptionData {
  service: string;
  date: string;
  patientName: string;
  clinicHistory: string;
  diseaseTypes: Array<{ id: number; code: string; description: string }>; // Array de tipos de enfermedad seleccionados
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
  userId?: string; // ID del usuario que crea la prescripción
}
