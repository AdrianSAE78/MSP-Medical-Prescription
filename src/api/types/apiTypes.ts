export interface DiseaseType {
    id: number;
    code: string;
    description: string;
    gender: string;
    created_at: string;
}

export interface Products {
    id: number;
    original_id: string;
    product_code: string;
    product_name: string;
    created_at: string;
}

export interface Prescription {
    id: number;
    prescription_number: string;
    speciality: string;
    date: Date;
    patient_name: string;
    medical_record_number: string;
    disease_type_id: string;
    identification: string;
    years_old: string;
    months_old: string;
    gender: string;
    prescriber_name: string;
    warnings: string;
    fisic_activity_30: boolean;
    fisic_activity_60: boolean;
    created_at: string;
    user_id: string;
}

export interface PrescriptionProducts {
    id: number;
    prescription_id: number;
    product_id: number;
    quantity: number;
    administration_route: string;
    dose: string;
    frequency: string;
    duration: string;
    morning: boolean;
    midday: boolean;
    afternoon: boolean;
    evening: boolean;
}

// Tipo extendido para cuando traemos PrescriptionProducts con información del Product
export interface PrescriptionProductWithDetails extends PrescriptionProducts {
    Products: Products;
}

// Tipo completo de Prescription con sus productos relacionados
export interface PrescriptionWithProducts extends Prescription {
    PrescriptionProducts: PrescriptionProductWithDetails[];
}

// Tipo para crear una nueva prescripción con sus productos
export interface CreatePrescriptionInput {
    prescription: Omit<Prescription, 'id' | 'created_at'>;
    products: Omit<PrescriptionProducts, 'id' | 'prescription_id'>[];
}