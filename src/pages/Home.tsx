import { pdf } from '@react-pdf/renderer';
import { usePrescriptionForm } from '../hooks/usePrescriptionForm';
import { MedicationForm } from '../components/MedicationForm';
import { IndicationForm } from '../components/IndicationForm';
import { PrescriptionPDF } from '../components/PrescriptionPDF';

export default function Home() {
    const {
        formData,
        updateField,
        addMedication,
        removeMedication,
        addIndication,
        removeIndication,
    } = usePrescriptionForm();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const blob = await pdf(<PrescriptionPDF data={formData} />).toBlob();
        
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
    };

    return (
        <>
                <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3x1 space-y-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">SERVICIO/ESPECIALIDAD:
                            </label>
                            <input 
                                type="text" 
                                id="service" 
                                value={formData.service}
                                onChange={(e) => updateField('service', e.target.value)}
                                className="w-full border border-gray-300 text-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" 
                            />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">FECHA:
                            </label>
                            <input 
                                type="date" 
                                id="date" 
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
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">NOMBRES Y APELLIDOS:
                                </label>
                                <input 
                                    type="text" 
                                    id="name" 
                                    value={formData.patientName}
                                    onChange={(e) => updateField('patientName', e.target.value)}
                                    className="w-full border border-gray-300 rounded text-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" 
                                />
                            </div>
                            <div>
                                <label htmlFor="clinic_history" className="block text-sm font-medium text-gray-700 mb-1">HISTORIA CLINICA N°
                                </label>
                                <input 
                                    type="text" 
                                    id="clinic_history" 
                                    value={formData.clinicHistory}
                                    onChange={(e) => updateField('clinicHistory', e.target.value)}
                                    className="w-full border border-gray-300 rounded text-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" 
                                />
                            </div>
                            <div>
                                <label htmlFor="identification" className="block text-sm font-medium text-gray-700 mb-1">DOCUMENTO IDENTIDAD:
                                </label>
                                <input 
                                    type="text" 
                                    id="identification" 
                                    value={formData.identification}
                                    onChange={(e) => updateField('identification', e.target.value)}
                                    className="w-full border border-gray-300 rounded text-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" 
                                />
                            </div>
                            <div>
                                <label htmlFor="" className="block text-sm font-medium text-gray-700 mb-1">EDAD:
                                    <input 
                                        type="number" 
                                        id="years" 
                                        placeholder="AÑOS: " 
                                        value={formData.years}
                                        onChange={(e) => updateField('years', e.target.value)}
                                        className="w-full border border-gray-300 rounded text-gray-400 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-20" 
                                    />
                                    <input 
                                        type="number" 
                                        id="months" 
                                        placeholder="MESES: " 
                                        value={formData.months}
                                        onChange={(e) => updateField('months', e.target.value)}
                                        className="w-full border border-gray-300 rounded text-gray-400 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-20 mt-6" 
                                    />
                                </label>
                            </div>
                            <div className="col-span-2 flex items-center gap-4  mt-2">
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
                                        <th className="px-2 py-2 text-left">DATOS DEL MEDICAMENTO(DCI, concentración y forma farmacéutica)/DISPOSITIVO MÉDICO(tamaño, calibre, volumen...)</th>
                                        <th className="px-2 py-2 text-left">CANTIDAD (En números y letras)</th>
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
                        <label htmlFor="prescriber_name" className="block text-sm font-medium text-gray-700 mb-1">NOMBRE Y APELLIDO:</label>
                        <input 
                            type="text" 
                            id="prescriber_name" 
                            value={formData.prescriberName}
                            onChange={(e) => updateField('prescriberName', e.target.value)}
                            className="w-full border border-gray-300 rounded text-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" 
                        />
                    </div>
                    <hr />
                    <div>
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                            <h3 className="text-lg font-semibold text-blue-700">
                                INDICACIONES
                                <span className="text-sm text-gray-500 ml-2">
                                    ({formData.indications.length} indicación{formData.indications.length !== 1 ? 'es' : ''})
                                </span>
                            </h3>
                            <h3 className="text-lg font-semibold text-gray-700">RECETA <span className="text-red-600">{formData.recipeNumber}</span></h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label htmlFor="patient_name_indications" className="block text-sm font-medium text-gray-700 mb-1">NOMBRE DEL PACIENTE:
                                </label>
                                <input 
                                    type="text" 
                                    id="patient_name_indications" 
                                    value={formData.patientNameIndications}
                                    onChange={(e) => updateField('patientNameIndications', e.target.value)}
                                    className="w-full border border-gray-300 rounded text-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" 
                                />
                            </div>
                            <div>
                                <label htmlFor="date_indications" className="block text-sm font-medium text-gray-700 mb-1">FECHA:
                                </label>
                                <input 
                                    type="date" 
                                    id="date_indications" 
                                    value={formData.dateIndications}
                                    onChange={(e) => updateField('dateIndications', e.target.value)}
                                    className="w-full border border-gray-300 rounded text-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" 
                                />
                            </div>
                        </div>
                        
                        <IndicationForm onAdd={addIndication} />
                        
                        {formData.indications.length > 0 && (
                            <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden text-sm mt-4">
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
                                        <th className="px-2 py-2 text-gray-700">ACCIONES</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {formData.indications.map((ind) => (
                                        <tr key={ind.id}>
                                            <td className="px-2 py-2 border-t text-gray-700">{ind.medication}</td>
                                            <td className="px-2 py-2 border-t text-gray-700">{ind.viaAdmin}</td>
                                            <td className="px-2 py-2 border-t text-gray-700">{ind.dose}</td>
                                            <td className="px-2 py-2 border-t text-gray-700">{ind.frequency}</td>
                                            <td className="px-2 py-2 border-t text-gray-700">{ind.duration}</td>
                                            <td className="px-2 py-2 border-t text-gray-700">{ind.morning ? '✓' : ''}</td>
                                            <td className="px-2 py-2 border-t text-gray-700">{ind.noon ? '✓' : ''}</td>
                                            <td className="px-2 py-2 border-t text-gray-700">{ind.afternoon ? '✓' : ''}</td>
                                            <td className="px-2 py-2 border-t text-gray-700">{ind.night ? '✓' : ''}</td>
                                            <td className="px-2 py-2 border-t text-gray-700">
                                                <button
                                                    type="button"
                                                    onClick={() => removeIndication(ind.id)}
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
                    <div>
                        <label htmlFor="warnings" className="block text-sm font-medium text-gray-700 mb-1">ADVERTENCIAS</label>
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
                                onChange={(e) => updateField('physicalActivity', e.target.value)}
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
                                onChange={(e) => updateField('physicalActivity', e.target.value)}
                                className="mr-2 text-gray-700" 
                            />
                            <span className="ml-2 text-black">60 minutos</span>
                        </label>
                    </div>
                </div>
                <div className="flex justify-end">
                    <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition font-bold">
                        Enviar e imprimir
                    </button>
                </div>
            </form>
        </>
    );
}