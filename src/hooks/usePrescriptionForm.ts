import { useState } from 'react';
import type { PrescriptionData, Medication, Indication } from '../types/prescription';

export const usePrescriptionForm = () => {
  const [formData, setFormData] = useState<PrescriptionData>({
    service: '',
    date: new Date().toISOString().split('T')[0],
    patientName: '',
    clinicHistory: '',
    identification: '',
    years: '',
    months: '',
    gender: '',
    medications: [],
    prescriberName: '',
    patientNameIndications: '',
    dateIndications: new Date().toISOString().split('T')[0],
    recipeNumber: Math.floor(Math.random() * 1000000000).toString(),
    indications: [],
    warnings: '',
    physicalActivity: '',
    institution: 'MINISTERIO DE SALUD PÚBLICA',
    coordination: 'COORDINACIÓN ZONAL 9',
    district: 'DISTRITO 17D06',
    healthCenter: 'CHILIBULO A LLOA SALUD',
  });

  const updateField = (field: keyof PrescriptionData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addMedication = (medication: Medication) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        medications: [...prev.medications, medication],
      };
      return newData;
    });
  };

  const removeMedication = (id: string) => {
    setFormData(prev => ({
      ...prev,
      medications: prev.medications.filter(med => med.id !== id),
    }));
  };

  const addIndication = (indication: Indication) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        indications: [...prev.indications, indication],
      };
      return newData;
    });
  };

  const removeIndication = (id: string) => {
    setFormData(prev => ({
      ...prev,
      indications: prev.indications.filter(ind => ind.id !== id),
    }));
  };

  return {
    formData,
    updateField,
    addMedication,
    removeMedication,
    addIndication,
    removeIndication,
  };
};
