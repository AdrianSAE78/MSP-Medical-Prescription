import { usePrescriptionForm } from '../hooks/usePrescriptionForm';
import { PrescriptionForm } from '../components/PrescriptionForm';
import { IndicationsForm } from '../components/IndicationsForm';
import getDiseaseType from '../api/api';
import { useEffect, useState } from 'react';
import type { DiseaseType } from '../api/types/apiTypes';

export default function Home() {
    const [diseaseTypes, setDiseaseTypes] = useState<DiseaseType[]>([]);
    const [loadingDiseaseTypes, setLoadingDiseaseTypes] = useState(true);
    const [currentStep, setCurrentStep] = useState<'prescription' | 'indications'>('prescription');
    
    const {
        formData,
        updateField,
        addMedication,
        removeMedication,
    } = usePrescriptionForm();

    // Cargar tipos de enfermedad al montar el componente
    useEffect(() => {
        const loadDiseaseTypes = async () => {
            const data = await getDiseaseType();
            if (data) {
                setDiseaseTypes(data);
            }
            setLoadingDiseaseTypes(false);
        };
        loadDiseaseTypes();
    }, []);

    // Auto-llenar campos de indicaciones con datos de prescripción
    useEffect(() => {
        if (currentStep === 'indications' && !formData.patientNameIndications) {
            updateField('patientNameIndications', formData.patientName);
        }
        if (currentStep === 'indications' && !formData.dateIndications) {
            updateField('dateIndications', formData.date);
        }
    }, [currentStep, formData.patientName, formData.date, formData.patientNameIndications, formData.dateIndications, updateField]);

    return (
        <>
            {currentStep === 'prescription' ? (
                <PrescriptionForm
                    formData={formData}
                    updateField={updateField}
                    addMedication={addMedication}
                    removeMedication={removeMedication}
                    diseaseTypes={diseaseTypes}
                    loadingDiseaseTypes={loadingDiseaseTypes}
                    onContinue={() => setCurrentStep('indications')}
                />
            ) : (
                <IndicationsForm
                    formData={formData}
                    updateField={updateField}
                    onBack={() => setCurrentStep('prescription')}
                />
            )}
        </>
    );
}