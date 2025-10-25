import { pdf } from '@react-pdf/renderer';
import { PrescriptionPDF } from './PrescriptionPDF';
import type { PrescriptionData, Indication, Medication } from '../types/prescription';
import type { CreatePrescriptionInput } from '../api/types/apiTypes';
import { createPrescriptionWithProducts } from '../api/api';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';

interface IndicationsFormProps {
    formData: PrescriptionData;
    updateField: (field: keyof PrescriptionData, value: unknown) => void;
    onBack: () => void;
}

interface MedicationIndication {
    medication: Medication;
    indication?: Indication;
}

export const IndicationsForm: React.FC<IndicationsFormProps> = ({
    formData,
    updateField,
    onBack,
}) => {
    const { user } = useAuth();
    const [medicationIndications, setMedicationIndications] = useState<MedicationIndication[]>(() =>
        formData.medications.map(med => ({
            medication: med,
            indication: formData.indications.find(ind => ind.medication === med.name)
        }))
    );

    const updateMedicationIndication = (medId: string, field: keyof Indication, value: unknown) => {
        setMedicationIndications(prev => prev.map(mi => {
            if (mi.medication.id === medId) {
                const currentIndication = mi.indication || {
                    id: medId,
                    medication: mi.medication.name,
                    productId: mi.medication.productId,
                    viaAdmin: '',
                    dose: '',
                    frequency: '',
                    duration: '',
                    morning: false,
                    noon: false,
                    afternoon: false,
                    night: false,
                };
                return {
                    ...mi,
                    indication: {
                        ...currentIndication,
                        [field]: value
                    }
                };
            }
            return mi;
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            // 1. Validar que haya medicamentos con indicaciones completas
            const validMedications = medicationIndications.filter(mi => 
                mi.medication.productId &&
                mi.indication && 
                mi.indication.viaAdmin && 
                mi.indication.dose && 
                mi.indication.frequency && 
                mi.indication.duration
            );
            
            if (validMedications.length === 0) {
                alert('Debes completar al menos un medicamento con todas sus indicaciones (Vía Admin., Dosis, Frecuencia y Duración)');
                return;
            }

            // 2. Preparar los datos para Supabase
            const prescriptionInput: CreatePrescriptionInput = {
                prescription: {
                    prescription_number: formData.recipeNumber,
                    speciality: formData.service,
                    date: new Date(formData.date),
                    patient_name: formData.patientName,
                    medical_record_number: formData.clinicHistory,
                    disease_type_id: formData.diseaseTypeId?.toString() || '',
                    identification: formData.identification,
                    years_old: formData.years,
                    months_old: formData.months,
                    gender: formData.gender === 'male' ? 'M' : formData.gender === 'female' ? 'F' : '',
                    prescriber_name: formData.prescriberName,
                    warnings: formData.warnings,
                    fisic_activity_30: formData.physicalActivity === '30',
                    fisic_activity_60: formData.physicalActivity === '60',
                    user_id: user?.id || '',
                },
                products: validMedications.map(mi => ({
                    product_id: mi.medication.productId!,
                    quantity: 1,
                    administration_route: mi.indication!.viaAdmin,
                    dose: mi.indication!.dose,
                    frequency: mi.indication!.frequency,
                    duration: mi.indication!.duration,
                    morning: mi.indication!.morning,
                    midday: mi.indication!.noon,
                    afternoon: mi.indication!.afternoon,
                    evening: mi.indication!.night,
                }))
            };

            // 3. Guardar en Supabase
            const savedPrescription = await createPrescriptionWithProducts(prescriptionInput);
            
            if (!savedPrescription) {
                alert('Error al guardar la prescripción. Por favor, intenta de nuevo.');
                return;
            }

            console.log('Prescripción guardada exitosamente:', savedPrescription);

            // 4. Actualizar formData.indications con los datos completos para el PDF
            const updatedIndications = validMedications.map(mi => ({
                ...mi.indication!,
                medication: mi.medication.name
            }));
            
            // 5. Generar e imprimir el PDF con los datos actualizados
            const pdfData = {
                ...formData,
                indications: updatedIndications
            };
            
            console.log('Datos para PDF - physicalActivity:', pdfData.physicalActivity);
            
            const blob = await pdf(<PrescriptionPDF data={pdfData} />).toBlob();
            const url = URL.createObjectURL(blob);
            const printWindow = window.open(url, '_blank');
            
            if (printWindow) {
                printWindow.onload = () => {
                    printWindow.print();
                };
            }
            
            setTimeout(() => {
                URL.revokeObjectURL(url);
            }, 1000);

            // Mostrar mensaje de éxito
            alert('✅ Prescripción guardada e impresa exitosamente');

        } catch (error) {
            console.error('Error en el proceso de guardado e impresión:', error);
            alert('Ocurrió un error. Por favor, revisa la consola para más detalles.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl space-y-8">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-blue-700">Paso 2: Indicaciones</h2>
                <p className="text-gray-600 mt-2">Complete las indicaciones para el paciente</p>
            </div>

            {/* Resumen de datos previos */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-semibold text-blue-800 mb-2">📋 Resumen de la Prescripción</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="font-medium">Paciente:</span> {formData.patientName}</div>
                    <div><span className="font-medium">Fecha:</span> {formData.date}</div>
                    <div><span className="font-medium">Prescriptor:</span> {formData.prescriberName}</div>
                    <div><span className="font-medium">Medicamentos:</span> {formData.medications.length}</div>
                </div>
            </div>

            <div>
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                    <h3 className="text-lg font-semibold text-blue-700">
                        INDICACIONES
                        <span className="text-sm text-gray-500 ml-2">
                            ({formData.indications.length} indicación{formData.indications.length !== 1 ? 'es' : ''})
                        </span>
                    </h3>
                    <h3 className="text-lg font-semibold text-gray-700">
                        RECETA <span className="text-red-600">{formData.recipeNumber}</span>
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label htmlFor="patient_name_indications" className="block text-sm font-medium text-gray-700 mb-1">
                            NOMBRE DEL PACIENTE:
                        </label>
                        <input 
                            type="text" 
                            id="patient_name_indications" 
                            value={formData.patientName}
                            readOnly
                            className="w-full border border-gray-300 rounded text-gray-700 px-3 py-2 bg-gray-100 cursor-not-allowed" 
                        />
                    </div>
                    <div>
                        <label htmlFor="date_indications" className="block text-sm font-medium text-gray-700 mb-1">
                            FECHA:
                        </label>
                        <input 
                            type="date" 
                            id="date_indications" 
                            value={formData.date}
                            readOnly
                            className="w-full border border-gray-300 rounded text-gray-700 px-3 py-2 bg-gray-100 cursor-not-allowed" 
                        />
                    </div>
                </div>
                
                {/* Tabla de medicamentos con detalles editables */}
                {medicationIndications.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden text-xs">
                            <thead className="bg-blue-400">
                                <tr>
                                    <th className="px-2 py-2 text-gray-700">MEDICAMENTO</th>
                                    <th className="px-2 py-2 text-gray-700">VIA ADMIN.</th>
                                    <th className="px-2 py-2 text-gray-700">DOSIS</th>
                                    <th className="px-2 py-2 text-gray-700">FRECUENCIA</th>
                                    <th className="px-2 py-2 text-gray-700">DURACION</th>
                                    <th className="px-2 py-2 text-gray-700">MAÑANA</th>
                                    <th className="px-2 py-2 text-gray-700">MEDIO DIA</th>
                                    <th className="px-2 py-2 text-gray-700">TARDE</th>
                                    <th className="px-2 py-2 text-gray-700">NOCHE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {medicationIndications.map((mi) => (
                                    <tr key={mi.medication.id}>
                                        <td className="px-2 py-2 border-t text-gray-700 font-medium bg-gray-50">
                                            {mi.medication.name}
                                        </td>
                                        <td className="px-2 py-2 border-t">
                                            <input 
                                                type="text" 
                                                value={mi.indication?.viaAdmin || ''}
                                                onChange={(e) => updateMedicationIndication(mi.medication.id, 'viaAdmin', e.target.value)}
                                                className="w-full border border-gray-300 text-gray-700 rounded px-2 py-1 text-xs"
                                                placeholder="Ej: Oral"
                                            />
                                        </td>
                                        <td className="px-2 py-2 border-t">
                                            <input 
                                                type="text" 
                                                value={mi.indication?.dose || ''}
                                                onChange={(e) => updateMedicationIndication(mi.medication.id, 'dose', e.target.value)}
                                                className="w-full border border-gray-300 text-gray-700 rounded px-2 py-1 text-xs"
                                                placeholder="Ej: 500mg"
                                            />
                                        </td>
                                        <td className="px-2 py-2 border-t">
                                            <input 
                                                type="text" 
                                                value={mi.indication?.frequency || ''}
                                                onChange={(e) => updateMedicationIndication(mi.medication.id, 'frequency', e.target.value)}
                                                className="w-full border border-gray-300 text-gray-700 rounded px-2 py-1 text-xs"
                                                placeholder="Ej: c/8h"
                                            />
                                        </td>
                                        <td className="px-2 py-2 border-t">
                                            <input 
                                                type="text" 
                                                value={mi.indication?.duration || ''}
                                                onChange={(e) => updateMedicationIndication(mi.medication.id, 'duration', e.target.value)}
                                                className="w-full border border-gray-300 text-gray-700 rounded px-2 py-1 text-xs"
                                                placeholder="Ej: 7 días"
                                            />
                                        </td>
                                        <td className="px-2 py-2 border-t text-center">
                                            <input 
                                                type="checkbox" 
                                                checked={mi.indication?.morning || false}
                                                onChange={(e) => updateMedicationIndication(mi.medication.id, 'morning', e.target.checked)}
                                                className="w-4 h-4"
                                            />
                                        </td>
                                        <td className="px-2 py-2 border-t text-center">
                                            <input 
                                                type="checkbox" 
                                                checked={mi.indication?.noon || false}
                                                onChange={(e) => updateMedicationIndication(mi.medication.id, 'noon', e.target.checked)}
                                                className="w-4 h-4"
                                            />
                                        </td>
                                        <td className="px-2 py-2 border-t text-center">
                                            <input 
                                                type="checkbox" 
                                                checked={mi.indication?.afternoon || false}
                                                onChange={(e) => updateMedicationIndication(mi.medication.id, 'afternoon', e.target.checked)}
                                                className="w-4 h-4"
                                            />
                                        </td>
                                        <td className="px-2 py-2 border-t text-center">
                                            <input 
                                                type="checkbox" 
                                                checked={mi.indication?.night || false}
                                                onChange={(e) => updateMedicationIndication(mi.medication.id, 'night', e.target.checked)}
                                                className="w-4 h-4"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div>
                <label htmlFor="warnings" className="block text-sm font-medium text-gray-700 mb-1">
                    ADVERTENCIAS
                </label>
                <textarea 
                    name="warnings" 
                    id="warnings" 
                    value={formData.warnings}
                    onChange={(e) => updateField('warnings', e.target.value)}
                    className="w-full border border-gray-300 rounded text-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 h-20 resize-none"
                />
            </div>

            <div>
                <span className="block text-sm font-medium text-gray-700 mb-1">
                    Realizar actividad física todos los días al menos:
                </span>
                <div className="flex items-center gap-4">
                    <label className="inline-flex items-center">
                        <input 
                            type="radio" 
                            id="30min" 
                            name="minutes" 
                            value="30"
                            checked={formData.physicalActivity === '30'}
                            onChange={() => updateField('physicalActivity', '30')}
                            className="mr-2 text-gray-700" 
                        />
                        <span className="ml-2 text-black">30 minutos</span>
                    </label>
                    <label className="inline-flex items-center">
                        <input 
                            type="radio" 
                            id="60min" 
                            name="minutes" 
                            value="60"
                            checked={formData.physicalActivity === '60'}
                            onChange={() => updateField('physicalActivity', '60')}
                            className="mr-2 text-gray-700" 
                        />
                        <span className="ml-2 text-black">60 minutos</span>
                    </label>
                </div>
            </div>

            <div className="flex justify-between pt-4 border-t">
                <button 
                    type="button"
                    onClick={onBack}
                    className="bg-gray-500 text-white px-6 py-2 rounded-lg shadow hover:bg-gray-600 transition font-bold"
                >
                    ← Volver
                </button>
                <button 
                    type="submit" 
                    className="bg-green-600 text-white px-8 py-3 rounded-lg shadow hover:bg-green-700 transition font-bold text-lg"
                >
                    💾 Guardar e Imprimir
                </button>
            </div>
        </form>
    );
};
