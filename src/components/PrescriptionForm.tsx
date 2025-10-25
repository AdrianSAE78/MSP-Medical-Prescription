import { SearchableSelect } from './SearchableSelect';
import { MedicationForm } from './MedicationForm';
import type { PrescriptionData, Medication } from '../types/prescription';
import type { DiseaseType } from '../api/types/apiTypes';

interface PrescriptionFormProps {
    formData: PrescriptionData;
    updateField: (field: keyof PrescriptionData, value: unknown) => void;
    addMedication: (medication: Medication) => void;
    removeMedication: (id: string) => void;
    diseaseTypes: DiseaseType[];
    loadingDiseaseTypes: boolean;
    onContinue: () => void;
}

export const PrescriptionForm: React.FC<PrescriptionFormProps> = ({
    formData,
    updateField,
    addMedication,
    removeMedication,
    diseaseTypes,
    loadingDiseaseTypes,
    onContinue,
}) => {
    const handleContinue = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validaciones básicas
        if (!formData.service || !formData.date || !formData.patientName || 
            !formData.clinicHistory || !formData.identification || !formData.prescriberName) {
            alert('Por favor completa todos los campos obligatorios');
            return;
        }

        if (formData.medications.length === 0) {
            alert('Debes agregar al menos un medicamento');
            return;
        }

        onContinue();
    };

    return (
        <form onSubmit={handleContinue} className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl space-y-8">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-blue-700">Paso 1: Datos de la Prescripción</h2>
                <p className="text-gray-600 mt-2">Complete la información del paciente y medicamentos</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
                        SERVICIO/ESPECIALIDAD: <span className="text-red-500">*</span>
                    </label>
                    <input 
                        type="text" 
                        id="service" 
                        required
                        value={formData.service}
                        onChange={(e) => updateField('service', e.target.value)}
                        className="w-full border border-gray-300 text-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" 
                    />
                </div>
                <div className="flex-1">
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                        FECHA: <span className="text-red-500">*</span>
                    </label>
                    <input 
                        type="date" 
                        id="date"
                        required
                        value={formData.date}
                        onChange={(e) => updateField('date', e.target.value)}
                        className="w-full border border-gray-300 text-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" 
                    />
                </div>
            </div>

            <hr />

            <div>
                <h3 className="text-lg font-semibold text-blue-700 mb-4">DATOS DEL PACIENTE</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            NOMBRES Y APELLIDOS: <span className="text-red-500">*</span>
                        </label>
                        <input 
                            type="text" 
                            id="name"
                            required
                            value={formData.patientName}
                            onChange={(e) => updateField('patientName', e.target.value)}
                            className="w-full border border-gray-300 rounded text-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" 
                        />
                    </div>
                    <div>
                        <label htmlFor="clinic_history" className="block text-sm font-medium text-gray-700 mb-1">
                            HISTORIA CLINICA N° <span className="text-red-500">*</span>
                        </label>
                        <input 
                            type="text" 
                            id="clinic_history"
                            required
                            value={formData.clinicHistory}
                            onChange={(e) => updateField('clinicHistory', e.target.value)}
                            className="w-full border border-gray-300 rounded text-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" 
                        />
                    </div>
                    <div>
                        <label htmlFor="disease_type" className="block text-sm font-medium text-gray-700 mb-1">
                            TIPO DE ENFERMEDAD:
                        </label>
                        <SearchableSelect
                            options={diseaseTypes.map(dt => ({
                                value: dt.code,
                                label: `${dt.code} - ${dt.description}`,
                                data: dt
                            }))}
                            value={formData.diseaseTypeCode}
                            onChange={(value, data) => {
                                updateField('diseaseTypeCode', value);
                                const diseaseType = data as DiseaseType;
                                if (diseaseType) {
                                    updateField('diseaseTypeId', diseaseType.id);
                                }
                            }}
                            placeholder={loadingDiseaseTypes ? "Cargando..." : "Buscar por código o descripción"}
                            filterBy="both"
                            disabled={loadingDiseaseTypes}
                        />
                    </div>
                    <div>
                        <label htmlFor="identification" className="block text-sm font-medium text-gray-700 mb-1">
                            DOCUMENTO IDENTIDAD: <span className="text-red-500">*</span>
                        </label>
                        <input 
                            type="text" 
                            id="identification"
                            required
                            value={formData.identification}
                            onChange={(e) => updateField('identification', e.target.value)}
                            className="w-full border border-gray-300 rounded text-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" 
                        />
                    </div>
                    <div>
                        <label htmlFor="" className="block text-sm font-medium text-gray-700 mb-1">EDAD:</label>
                        <input 
                            type="number" 
                            id="years" 
                            placeholder="AÑOS" 
                            value={formData.years}
                            onChange={(e) => updateField('years', e.target.value)}
                            className="w-full border border-gray-300 rounded text-gray-400 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-20" 
                        />
                        <input 
                            type="number" 
                            id="months" 
                            placeholder="MESES" 
                            value={formData.months}
                            onChange={(e) => updateField('months', e.target.value)}
                            className="w-full border border-gray-300 rounded text-gray-400 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-20 mt-2" 
                        />
                    </div>
                    <div className="col-span-2 flex items-center gap-4 mt-2">
                        <span className="text-sm font-medium text-gray-700">SEXO:</span>
                        <label className="inline-flex items-center">
                            <input 
                                type="radio" 
                                id="male" 
                                name="gender" 
                                value="male" 
                                checked={formData.gender === 'male'}
                                onChange={(e) => updateField('gender', e.target.value)}
                                className="mr-2 text-gray-700" 
                            />
                            <span className="ml-1 text-black">M</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input 
                                type="radio" 
                                id="female" 
                                name="gender" 
                                value="female" 
                                checked={formData.gender === 'female'}
                                onChange={(e) => updateField('gender', e.target.value)}
                                className="mr-2 text-gray-700" 
                            />
                            <span className="ml-1 text-black">F</span>
                        </label>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-blue-700 mb-4">
                    MEDICAMENTOS 
                    <span className="text-sm text-gray-500 ml-2">
                        ({formData.medications.length} medicamento{formData.medications.length !== 1 ? 's' : ''})
                    </span>
                </h3>
                <MedicationForm onAdd={addMedication} />
                
                {formData.medications.length > 0 && (
                    <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden text-sm mt-4">
                        <thead className="bg-blue-400">
                            <tr>
                                <th className="px-2 py-2 text-left">DATOS DEL MEDICAMENTO</th>
                                <th className="px-2 py-2 text-left">CANTIDAD</th>
                                <th className="px-2 py-2 text-left">ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {formData.medications.map((med) => (
                                <tr key={med.id}>
                                    <td className="px-2 py-2 border-t text-gray-700">{med.name}</td>
                                    <td className="px-2 py-2 border-t text-gray-700">{med.quantity}</td>
                                    <td className="px-2 py-2 border-t text-gray-700">
                                        <button
                                            type="button"
                                            onClick={() => removeMedication(med.id)}
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                                        >
                                            Borrar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <hr />

            <div>
                <h3 className="text-lg font-semibold text-blue-700 mb-4">DATOS DEL PRESCRIPTOR</h3>
                <label htmlFor="prescriber_name" className="block text-sm font-medium text-gray-700 mb-1">
                    NOMBRE Y APELLIDO: <span className="text-red-500">*</span>
                </label>
                <input 
                    type="text" 
                    id="prescriber_name"
                    required
                    value={formData.prescriberName}
                    onChange={(e) => updateField('prescriberName', e.target.value)}
                    className="w-full border border-gray-300 rounded text-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" 
                />
            </div>

            <div className="flex justify-end">
                <button 
                    type="submit" 
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg shadow hover:bg-blue-700 transition font-bold text-lg"
                >
                    Continuar a Indicaciones →
                </button>
            </div>
        </form>
    );
};
