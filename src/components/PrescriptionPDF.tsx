import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

interface Medication {
    id: string;
    name: string;
    quantity: string;
}

interface Indication {
    id: string;
    medication: string;
    viaAdmin: string;
    dose: string;
    frequency: string;
    duration: string;
    morning?: boolean;
    noon?: boolean;
    afternoon?: boolean;
    night?: boolean;
}

interface PrescriptionData {
    service: string;
    date: string;
    patientName: string;
    clinicHistory: string;
    diseaseTypeCode: string;
    identification: string;
    years: string;
    months: string;
    gender: 'male' | 'female' | '';
    medications: Medication[];
    prescriberName: string;
    recipeNumber: string;
    patientNameIndications: string;
    dateIndications: string;
    indications: Indication[];
    warnings?: string;
    physicalActivity?: string;
    institution?: string;
    coordination?: string;
    district?: string;
    healthCenter?: string;
}

const styles = StyleSheet.create({
    page: {
        paddingVertical: 20,
        paddingHorizontal: 30,
        fontSize: 12,
        fontFamily: 'Helvetica',
        backgroundColor: '#ffffff',
    },
    container: {
        borderWidth: 1,
        borderColor: '#000000',
        borderRadius: 5,
        padding: 0,
        minHeight: '95%',
    },
    header: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        paddingBottom: 8,
        padding: 20,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    logoPlaceholder: {
        width: 50,
        height: 50,
        marginRight: 20,
    },
    logoImage: {
        width: 50,
        height: 50,
        objectFit: 'contain',
    },
    headerMiddle: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        width: '100%',
    },
    headerText: {
        textAlign: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    institutionName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000000',
        textAlign: 'center',
    },
    institutionDetails: {
        fontSize: 11,
        color: '#000000',
        marginTop: 1,
        textAlign: 'center',
    },
    headerRight: {
        flex: 1,
        alignItems: 'flex-end',
    },
    recipeLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
    },
    recipeNumber: {
        fontSize: 20,
        color: '#dc2626',
        marginTop: 4,
    },
    topSection: {
        backgroundColor: '#ffffffff',
        padding: 8,
        marginBottom: 2,
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
    },
    row: {
        flexDirection: 'row',
        marginBottom: 3,
    },
    label: {
        fontWeight: 'bold',
        fontSize: 10,
        color: '#000000',
    },
    value: {
        fontSize: 10,
        flex: 1,
    },
    sectionTitle: {
        backgroundColor: '#ffffffff',
        padding: 5,
        fontSize: 12,
        fontWeight: 'bold',
        color: '#000000',
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
        marginTop: 2,
        marginBottom: 2,
    },
    patientSection: {
        marginBottom: 2,
    },
    patientRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
        padding: 5,
    },
    patientRowLast: {
        flexDirection: 'row',
        padding: 5,
    },
    patientLabel: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#000000',
        marginRight: 5,
        marginLeft: 10,
    },
    patientValue: {
        fontSize: 9,
        marginRight: 10,
    },
    patientLabelName: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#000000',
        marginRight: 5,
    },
    patientLabelIdentification: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#000000',
        marginRight: 5,
    },
    patientLabelCie: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#000000',
        marginLeft: 20,
    },
    patientLabelFinal: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#000000',
        marginRight: 5,
        marginLeft: 80,
    },
    medicationTable: {
        borderTopWidth: 1,
        borderTopColor: '#000000',
        marginBottom: 2,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#ffffffff',
        minHeight: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
        minHeight: 15,
    },
    tableCellMed: {
        flex: 3,
        fontSize: 10,
        fontWeight: 'bold',
        color: '#000000',
        borderRightWidth: 1,
        borderRightColor: '#000000',
        padding: 3,
    },
    tableCellQty: {
        flex: 1,
        fontSize: 10,
        fontWeight: 'bold',
        color: '#000000',
        textAlign: 'center',
    },
    tableCellMedValue: {
        flex: 3,
        fontSize: 10,
        color: '#000000',
        borderRightWidth: 1,
        borderRightColor: '#000000',
        padding: 3,
    },
    tableCellQtyValue: {
        flex: 1,
        fontSize: 10,
        color: '#000000',
        textAlign: 'center',
    },
    tableCellValue: {
        fontSize: 10,
    },
    prescriberSection: {
        marginBottom: 0,
        flexDirection: 'row',
    },
    prescriberLeft: {
        flex: 1,
        padding: 5,
        borderRightWidth: 1,
        height: 100,
        borderRightColor: '#000000',
    },
    prescriberRight: {
        flex: 1,
        padding: 5,
    },
    indicationsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#ffffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
        padding: 5,
        marginTop: 2,
    },
    indicationsTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#000000',
    },
    indicationsRecipe: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#dc2626',
    },
    indicationsPatient: {
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
        borderTopWidth: 0,
        padding: 5,
    },
    indicationsTable: {
        borderTopWidth: 0,
        marginBottom: 2,
    },
    indicationsTableHeader: {
        flexDirection: 'row',
        backgroundColor: '#ffffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
        minHeight: 25,
    },
    indicationsTableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
        minHeight: 15,
    },
    indColMed: {
        flex: 3,
        fontSize: 10,
        paddingRight: 2,
        paddingLeft: 2,
        paddingVertical: 3,
        borderRightWidth: 1,
        borderRightColor: '#000000',
        fontWeight: 'bold',
        color: '#000000',
        justifyContent: 'center',
    },
    indColMedDesc: {
        flex: 3,
        fontSize: 8,
        paddingRight: 2,
        paddingLeft: 2,
        paddingVertical: 3,
        borderRightWidth: 1,
        borderRightColor: '#000000',
        fontWeight: 'bold',
        color: '#000000',
    },
    indColVia: {
        flex: 1,
        fontSize: 9,
        textAlign: 'center',
        paddingVertical: 3,
        borderRightWidth: 1,
        borderRightColor: '#000000',
        fontWeight: 'bold',
        color: '#000000',
        justifyContent: 'center',
    },
    indColDosis: {
        flex: 1,
        fontSize: 8,
        textAlign: 'center',
        paddingVertical: 3,
        borderRightWidth: 1,
        borderRightColor: '#000000',
        fontWeight: 'bold',
        color: '#000000',
        justifyContent: 'center',
    },
    indColFreq: {
        flex: 1,
        fontSize: 8,
        textAlign: 'center',
        paddingVertical: 3,
        borderRightWidth: 1,
        borderRightColor: '#000000',
        fontWeight: 'bold',
        color: '#000000',
        justifyContent: 'center',
    },
    indColDur: {
        flex: 1,
        fontSize: 8,
        textAlign: 'center',
        paddingVertical: 3,
        borderRightWidth: 1,
        borderRightColor: '#000000',
        fontWeight: 'bold',
        color: '#000000',
        justifyContent: 'center',
    },
    indColTime: {
        flex: 0.6,
        fontSize: 7,
        textAlign: 'center',
        paddingVertical: 3,
        borderRightWidth: 1,
        borderRightColor: '#000000',
        fontWeight: 'bold',
        color: '#000000',
        justifyContent: 'center',
        alignItems: 'center',
    },

    indColTimeEnd: {
        flex: 0.6,
        fontSize: 7,
        textAlign: 'center',
        paddingVertical: 3,
        fontWeight: 'bold',
        color: '#000000',
        justifyContent: 'center',
        alignItems: 'center',
    },

    indColValue: {
        fontSize: 8,
        fontWeight: 'normal',
        color: '#000',
    },
    checkbox: {
        width: 10,
        height: 10,
        borderWidth: 1,
        borderColor: '#000000',
        marginTop: 2,
    },
    checkboxChecked: {
        backgroundColor: '#000000',
    },
    bottomSection: {
        marginTop: 2,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
    },
    prescriberBottom: {
        flex: 1,
        padding: 5,
        borderRightWidth: 1,
        borderRightColor: '#000000',
        height: 75,
    },
    warningsSection: {
        flex: 1,
        padding: 5,
    },
    footer: {
        marginTop: 5,
        padding: 5,
        backgroundColor: '#ffffffff',
        marginBottom: 0,
    },
    footerText: {
        fontSize: 9,
        color: '#000000',
        textAlign: 'left',
        paddingLeft: 0,
        fontWeight: 'bold',
    },
});

interface PrescriptionPDFProps {
    data: PrescriptionData;
}

export const PrescriptionPDF: React.FC<PrescriptionPDFProps> = ({ data }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <View style={styles.logoPlaceholder}>
                            <Image
                                src="/MSP_logo.png"
                                style={styles.logoImage}
                            />
                        </View>
                    </View>
                    <View style={styles.headerMiddle}>
                        <View style={styles.headerText}>
                            <Text style={styles.institutionName}>
                                MINISTERIO DE SALUD PÚBLICA
                            </Text>
                            <Text style={styles.institutionDetails}>
                                COORDINACIÓN ZONAL 9
                            </Text>
                            <Text style={styles.institutionDetails}>
                                DISTRITO 17D06
                            </Text>
                            <Text style={styles.institutionDetails}>
                                CHILIBULO A LLOA SALUD
                            </Text>
                        </View>
                    </View>
                    <View style={styles.headerRight}>
                        <Text style={styles.recipeLabel}>RECETA</Text>
                        <Text style={styles.recipeNumber}>{data.recipeNumber}</Text>
                    </View>
                </View>

                {/* Service and Date */}
                <View style={styles.topSection}>
                    <View style={styles.row}>
                        <Text style={styles.label}>SERVICIO/ESPECIALIDAD: </Text>
                        <Text style={styles.value}>{data.service}</Text>
                        <Text style={styles.label}>FECHA: </Text>
                        <Text style={styles.value}>{data.date}</Text>
                    </View>
                </View>

                {/* Patient Data */}
                <Text style={styles.sectionTitle}>DATOS DEL PACIENTE</Text>
                <View style={styles.patientSection}>
                    <View style={styles.patientRow}>
                        <Text style={styles.patientLabelName}>NOMBRES Y APELLIDOS: </Text>
                        <Text style={styles.patientValue}>{data.patientName}</Text>
                        <Text style={styles.patientLabel}>HISTORIA CLÍNICA N°: </Text>
                        <Text style={styles.patientValue}>{data.clinicHistory}</Text>
                        <Text style={styles.patientLabelCie}>CIE 10 </Text>
                        <Text style={styles.patientValue}>{data.diseaseTypeCode}</Text>
                    </View>
                    <View style={styles.patientRowLast}>
                        <Text style={styles.patientLabelIdentification}>DOCUMENTO IDENTIDAD: </Text>
                        <Text style={styles.patientValue}>{data.identification}</Text>
                        <Text style={styles.patientLabel}>EDAD: AÑOS: </Text>
                        <Text style={styles.patientValue}>{data.years}</Text>
                        <Text style={styles.patientLabel}>MESES: </Text>
                        <Text style={styles.patientValue}>{data.months}</Text>
                        <Text style={styles.patientLabelFinal}>SEXO: M </Text>
                        <Text style={styles.patientValue}>{data.gender === 'male' ? '☑' : '☐'}</Text>
                        <Text style={styles.patientLabel}>F </Text>
                        <Text style={styles.patientValue}>{data.gender === 'female' ? '☑' : '☐'}</Text>
                    </View>
                </View>

                {/* Medications */}
                <View style={styles.medicationTable}>
                    <View style={styles.tableHeader}>
                        <Text style={styles.tableCellMed}>DATOS DEL MEDICAMENTO (DCI, concentración y forma farmacéutica) / DISPOSITIVO MÉDICO (tamaño, calibre, volumen....)</Text>
                        <Text style={styles.tableCellQty}>CANTIDAD{'\n'}(en números y letras)</Text>
                    </View>
                    {data.medications.map((med) => (
                        <View key={med.id} style={styles.tableRow}>
                            <Text style={[styles.tableCellMedValue, styles.tableCellValue]}>{med.name}</Text>
                            <Text style={[styles.tableCellQtyValue, styles.tableCellValue]}>{med.quantity}</Text>
                        </View>
                    ))}
                    {/* Empty rows */}
                    {Array.from({ length: Math.max(0, 4 - data.medications.length) }).map((_, i) => (
                        <View key={`empty-${i}`} style={styles.tableRow}>
                            <Text style={styles.tableCellMed}> </Text>
                            <Text style={styles.tableCellQty}> </Text>
                        </View>
                    ))}
                </View>

                {/* Prescriber */}
                <Text style={styles.sectionTitle}>DATOS DEL PRESCRIPTOR</Text>
                <View style={styles.prescriberSection}>
                    <View style={styles.prescriberLeft}>
                        <Text style={styles.label}>Nombre y apellido</Text>
                        <Text style={styles.value}>{data.prescriberName}</Text>
                    </View>
                    <View style={styles.prescriberRight}>
                        <Text style={styles.label}>Firma y sello del prescriptor (especialidad, libro, folio y número)</Text>
                    </View>
                </View>

                {/* Indications */}
                <View style={styles.indicationsHeader}>
                    <Text style={styles.indicationsTitle}>INDICACIONES</Text>
                    <Text style={styles.indicationsRecipe}>RECETA {data.recipeNumber}</Text>
                </View>
                <View style={styles.indicationsPatient}>
                    <View style={styles.row}>
                        <Text style={styles.label}>NOMBRE DEL PACIENTE: </Text>
                        <Text style={styles.value}>{data.patientNameIndications}</Text>
                        <Text style={styles.label}>FECHA: </Text>
                        <Text style={styles.value}>{data.dateIndications}</Text>
                    </View>
                </View>

                <View style={styles.indicationsTable}>
                    <View style={styles.indicationsTableHeader}>
                        <Text style={styles.indColMed}>MEDICAMENTO{'\n'}<Text style={styles.indColMedDesc}>(DCI, concentración y forma farmacéutica)</Text></Text>
                        <Text style={styles.indColVia}>VÍA{'\n'}ADMIN.</Text>
                        <Text style={styles.indColDosis}>DOSIS</Text>
                        <Text style={styles.indColFreq}>FRECUENCIA</Text>
                        <Text style={styles.indColDur}>DURACIÓN</Text>
                        <Text style={styles.indColTime}>MAÑANA</Text>
                        <Text style={styles.indColTime}>MEDIO DÍA</Text>
                        <Text style={styles.indColTime}>TARDE</Text>
                        <Text style={styles.indColTimeEnd}>NOCHE</Text>
                    </View>
                    {data.indications.map((ind) => (
                        <View key={ind.id} style={styles.indicationsTableRow}>
                            <Text style={[styles.indColMed, styles.indColValue]}>{ind.medication}</Text>
                            <Text style={[styles.indColVia, styles.indColValue]}>{ind.viaAdmin}</Text>
                            <Text style={[styles.indColDosis, styles.indColValue]}>{ind.dose}</Text>
                            <Text style={[styles.indColFreq, styles.indColValue]}>{ind.frequency}</Text>
                            <Text style={[styles.indColDur, styles.indColValue]}>{ind.duration}</Text>
                            <View style={styles.indColTime}>
                                <View style={[styles.checkbox, ind.morning ? styles.checkboxChecked : {}]} />
                            </View>
                            <View style={styles.indColTime}>
                                <View style={[styles.checkbox, ind.noon ? styles.checkboxChecked : {}]} />
                            </View>
                            <View style={styles.indColTime}>
                                <View style={[styles.checkbox, ind.afternoon ? styles.checkboxChecked : {}]} />
                            </View>
                            <View style={styles.indColTimeEnd}>
                                <View style={[styles.checkbox, ind.night ? styles.checkboxChecked : {}]} />
                            </View>
                        </View>
                    ))}
                    {/* Empty rows */}
                    {Array.from({ length: Math.max(0, 5 - data.indications.length) }).map((_, i) => (
                        <View key={`empty-ind-${i}`} style={styles.indicationsTableRow}>
                            <Text style={styles.indColMed}> </Text>
                            <Text style={styles.indColVia}> </Text>
                            <Text style={styles.indColDosis}> </Text>
                            <Text style={styles.indColFreq}> </Text>
                            <Text style={styles.indColDur}> </Text>
                            <View style={styles.indColTime}><View style={styles.checkbox} /></View>
                            <View style={styles.indColTime}><View style={styles.checkbox} /></View>
                            <View style={styles.indColTime}><View style={styles.checkbox} /></View>
                            <View style={styles.indColTimeEnd}><View style={styles.checkbox} /></View>
                        </View>
                    ))}
                </View>

                {/* Bottom Section */}
                <View style={styles.bottomSection}>
                    <View style={styles.prescriberBottom}>
                        <Text style={styles.label}>PRESCRIPTOR</Text>
                        <Text>{data.prescriberName}</Text>
                        <Text>{'\n'}</Text>
                        <Text>{'\n'}</Text>
                        <Text>{'\n'}</Text>
                        <Text>{'\n'}</Text>
                        <Text style={styles.label}>FIRMA Y SELLO</Text>
                    </View>
                    <View style={styles.warningsSection}>
                        <Text style={styles.label}>ADVERTENCIAS</Text>
                        <Text style={styles.value}>{data.warnings || ''}</Text>
                    </View>
                </View>

                {/* Physical Activity Footer */}
                <View style={styles.footer}>
                    <View style={styles.row}>
                        <Text style={styles.footerText}>
                            REALIZAR ACTIVIDAD FÍSICA TODOS LOS DÍAS AL MENOS
                            {data.physicalActivity === '30' ? ' 30 min ☑  ' : ' 30 min ☐  '}
                            {data.physicalActivity === '60' ? ' 60 min ☑' : ' 60 min ☐'}
                        </Text>
                    </View>
                </View>
            </View>
            <Text style={styles.footerText}>
                Esta receta tiene validez para la entrega de medicamentos, de 5 días para casos crónicos y 2 días para los casos agudos
            </Text>
        </Page>
    </Document>
);