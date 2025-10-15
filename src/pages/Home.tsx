export default function Home() {
    return (
        <>
                <form className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3x1 space-y-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">SERVICIO/ESPECIALIDAD:
                            </label>
                            <input type="text" id="service" className="input" />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">FECHA:
                            </label>
                            <input type="date" id="date" className="input" />
                        </div>
                    </div>
                    <hr />
                    <div>
                        <h3 className="text-lg font-semibold text-blue-700 mb-4">DATOS DEL PACIENTE</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">NOMBRES Y APELLIDOS:
                                </label>
                                <input type="text" id="name" className="input" />
                            </div>
                            <div>
                                <label htmlFor="clinic_history" className="block text-sm font-medium text-gray-700 mb-1">HISTORIA CLINICA N°
                                </label>
                                <input type="text" id="clinic_history" className="input" />
                            </div>
                            <div>
                                <label htmlFor="identification" className="block text-sm font-medium text-gray-700 mb-1">DOCUMENTO IDENTIDAD:
                                </label>
                                <input type="text" id="identification" className="input" />
                            </div>
                            <div>
                                <label htmlFor="" className="block text-sm font-medium text-gray-700 mb-1">EDAD:
                                    <input type="number" id="years" placeholder="AÑOS: " className="input w-20" />
                                    <input type="number" id="months" placeholder="MESES: " className="input w-20 mt-6" />
                                </label>
                            </div>
                            <div className="col-span-2 flex items-center gap-4  mt-2">
                                <span className="text-sm font-medium text-gray-700">SEXO:</span>
                                <label className="inline-flex items-center">
                                    <input type="radio" id="male" name="gender" value="male" className="radio" />
                                    <span className="ml-1 text-black">M</span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input type="radio" id="female" name="gender" value="female" className="radio" />
                                    <span className="ml-1 text-black">F</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div>
                        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden text-sm">
                            <thead className="bg-blue-400">
                                <tr>
                                    <th className="px-2 py-2 text-left">DATOS DEL MEDICAMENTO(DCI, concentración y forma farmacéutica)/DISPOSITIVO MÉDICO(tamaño, calibre, volumen...)</th>
                                    <th className="px-2 py-2 text-left">CANTIDAD (En números y letras)</th>
                                    <th className="px-2 py-2 text-left">ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="px-2 py-2 border-t"></td>
                                    <td className="px-2 py-2 border-t"></td>
                                    <td className="px-2 py-2 border-t"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <hr />
                    <div>
                        <h3 className="text-lg font-semibold text-blue-700 mb-4">DATOS DEL PRESCRIPTOR</h3>
                        <label htmlFor="prescriber_name" className="block text-sm font-medium text-gray-700 mb-1">NOMBRE Y APELLIDO:</label>
                        <input type="text" id="prescriber_name" className="input" />
                    </div>
                    <hr />
                    <div>
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                            <h3 className="text-lg font-semibold text-blue-700">INDICACIONES</h3>
                            <h3 className="text-lg font-semibold text-gray-700">RECETA <span className="text-red-600">515614541</span></h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label htmlFor="patient_name" className="block text-sm font-medium text-gray-700 mb-1">NOMBRE DEL PACIENTE:
                                </label>
                                <input type="text" id="patient_name" className="input" />
                            </div>
                            <div>
                                <label htmlFor="date_indications" className="block text-sm font-medium text-gray-700 mb-1">FECHA:
                                </label>
                                <input type="date" id="date_indications" className="input" />
                            </div>
                        </div>
                        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden text-sm">
                            <thead className="bg-blue-400">
                                <tr>
                                    <th className="px-2 py-2">MEDICAMENTO</th>
                                    <th className="px-2 py-2">VIA ADMIN.</th>
                                    <th className="px-2 py-2">DOSIS</th>
                                    <th className="px-2 py-2">FRECUENCIA</th>
                                    <th className="px-2 py-2">DURACION</th>
                                    <th className="px-2 py-2">MAÑANA</th>
                                    <th className="px-2 py-2">MEDIO DIA</th>
                                    <th className="px-2 py-2">TARDE</th>
                                    <th className="px-2 py-2">NOCHE</th>
                                    <th className="px-2 py-2">ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="px-2 py-2 border-t"></td>
                                    <td className="px-2 py-2 border-t"></td>
                                    <td className="px-2 py-2 border-t"></td>
                                    <td className="px-2 py-2 border-t"></td>
                                    <td className="px-2 py-2 border-t"></td>
                                    <td className="px-2 py-2 border-t"></td>
                                    <td className="px-2 py-2 border-t"></td>
                                    <td className="px-2 py-2 border-t"></td>
                                    <td className="px-2 py-2 border-t"></td>
                                    <td className="px-2 py-2 border-t">
                                        <button type="button" className="bg-red-500 hover:bg-red-700 font-bold py-2 px-4 rounded">
                                            Borrar
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <label htmlFor="warnings" className="block text-sm font-medium text-gray-700 mb-1">ADVERTENCIAS</label>
                        <textarea name="warnings" id="warnings" className="input h-20 resize-none"></textarea>
                    </div>
                    <div>
                    <span className="block text-sm font-medium text-gray-700 mb-1">
                        Realizar actividad física todos los días al menos:
                    </span>
                    <div className="flex items-center gap-4">
                        <label className="inline-flex items-center">
                            <input type="radio" id="30min" name="minutes" className="checkbox" />
                            <span className="ml-2 text-black">30 minutos</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input type="radio" id="60min" name="minutes" className="checkbox" />
                            <span className="ml-2 text-black">60 minutos</span>
                        </label>
                    </div>
                </div>
                <div className="flex justify-end">
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded">Enviar e imprimir</button>
                </div>
            </form>
        </>
    );
}