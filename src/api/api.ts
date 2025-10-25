import type { DiseaseType, Products, Prescription, PrescriptionWithProducts, CreatePrescriptionInput } from "./types/apiTypes";
import { supabase } from "../lib/supabase";

export default async function getDiseaseType(): Promise<DiseaseType[] | null> {
    const batchSize = 1000;
    let from = 0;
    let allData: DiseaseType[] = [];

    while (true) {
        const { data, error } = await supabase
            .from('DiseaseType')
            .select('code, description')
            .range(from, from + batchSize - 1);

        if (error) {
            console.error('Error fetching disease types:', error);
            return null;
        }

        if (!data || data.length === 0) {
            break;
        }

        allData = allData.concat(data as DiseaseType[]);
        from += batchSize;
    }

    return allData;
}

export async function getProducts(): Promise<Products[] | null> {

    const batchSize = 1000;
    let from = 0;
    let allData: Products[] = [];

    while (true) {
        const { data, error } = await supabase
            .from('Products')
            .select('*')
            .range(from, from + batchSize - 1);

        if (error) {
            console.error('Error fetching products:', error);
            return null;
        }

        if (!data || data.length === 0) {
            break;
        }

        allData = allData.concat(data as Products[]);
        from += batchSize;
    }

    return allData;
}

export async function getPrescription(): Promise<Prescription[] | null> {
    const { data, error } = await supabase.from('Prescription').select('*');

    if (error) {
        console.error('Error fetching prescriptions:', error);
        return null;
    }

    return data as Prescription[];
}

export async function getPrescriptionsWithProducts(): Promise<PrescriptionWithProducts[] | null> {
    const { data, error } = await supabase
        .from('Prescription')
        .select(`
      *,
      PrescriptionProducts (
        *,
        Products (*)
      )
    `);

    if (error) {
        console.error('Error fetching prescriptions with products:', error);
        return null;
    }

    return data as PrescriptionWithProducts[];
}

export async function getPrescriptionById(id: number): Promise<PrescriptionWithProducts | null> {
    const { data, error } = await supabase
        .from('Prescription')
        .select(`
      *,
      PrescriptionProducts (
        *,
        Products (*)
      )
    `)
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching prescription by id:', error);
        return null;
    }

    return data as PrescriptionWithProducts;
}

export async function createPrescriptionWithProducts(
    input: CreatePrescriptionInput
): Promise<PrescriptionWithProducts | null> {
    // Crear la prescripción
    const { data: prescriptionData, error: prescriptionError } = await supabase
        .from('Prescription')
        .insert(input.prescription)
        .select()
        .single();

    if (prescriptionError || !prescriptionData) {
        console.error('Error creating prescription:', prescriptionError);
        return null;
    }

    // Crear los productos de la prescripción con el prescription_id
    const productsToInsert = input.products.map(product => ({
        ...product,
        prescription_id: prescriptionData.id
    }));

    const { data: productsData, error: productsError } = await supabase
        .from('PrescriptionProducts')
        .insert(productsToInsert)
        .select(`
      *,
      Products (*)
    `);

    if (productsError) {
        console.error('Error creating prescription products:', productsError);
        return null;
    }

    return {
        ...prescriptionData,
        PrescriptionProducts: productsData
    } as PrescriptionWithProducts;
}

/**
 * Obtiene el siguiente número de receta disponible
 * Formato: 000100, 000101, 000102, etc.
 * @returns El siguiente número de receta formateado como string
 */
export async function getNextPrescriptionNumber(): Promise<string> {
    try {
        // Obtener el último número de receta de la base de datos
        const { data, error } = await supabase
            .from('Prescription')
            .select('prescription_number')
            .order('prescription_number', { ascending: false })
            .limit(1);

        if (error) {
            console.error('Error fetching last prescription number:', error);
            // Si hay error, devolver el número inicial
            return '000100';
        }

        if (!data || data.length === 0) {
            // Si no hay recetas, empezar con 000100
            return '000100';
        }

        // Obtener el último número y convertirlo a entero
        const lastNumber = parseInt(data[0].prescription_number, 10);

        // Incrementar en 1
        const nextNumber = lastNumber + 1;

        // Formatear con ceros a la izquierda (6 dígitos)
        return nextNumber.toString().padStart(6, '0');
    } catch (error) {
        console.error('Error in getNextPrescriptionNumber:', error);
        return '000100';
    }
}