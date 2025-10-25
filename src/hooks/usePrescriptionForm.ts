import { useState, useEffect } from 'react';
import type { PrescriptionData, Medication, Indication } from '../types/prescription';
import { getNextPrescriptionNumber } from '../api/api';

export const usePrescriptionForm = () => {
  const [formData, setFormData] = useState<PrescriptionData>({
    service: '',
    date: new Date().toISOString().split('T')[0],
    patientName: '',
    clinicHistory: '',
    diseaseTypeCode: '',
    identification: '',
    years: '',
    months: '',
    gender: '',
    medications: [],
    prescriberName: '',
    patientNameIndications: '',
    dateIndications: new Date().toISOString().split('T')[0],
    recipeNumber: '000000', // Valor temporal mientras se carga
    indications: [],
    warnings: '',
    physicalActivity: '',
    institution: 'MINISTERIO DE SALUD PÚBLICA',
    coordination: 'COORDINACIÓN ZONAL 9',
    district: 'DISTRITO 17D06',
    healthCenter: 'CHILIBULO A LLOA SALUD',
  });

  // Obtener el siguiente número de receta al montar el componente
  useEffect(() => {
    const loadNextRecipeNumber = async () => {
      const nextNumber = await getNextPrescriptionNumber();
      setFormData(prev => ({ ...prev, recipeNumber: nextNumber }));
    };
    loadNextRecipeNumber();
  }, []);

  const updateField = (field: keyof PrescriptionData, value: unknown) => {
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
