import type { DiseaseType, Products, Prescription, PrescriptionWithProducts, CreatePrescriptionInput } from "./types/apiTypes";
import { supabase } from "../lib/supabase";

export default async function getDiseaseType(): Promise<DiseaseType[] | null> {
    const batchSize = 1000;
    let from = 0;
    let allData: DiseaseType[] = [];

    while (true) {
        const { data, error } = await supabase
            .from('DiseaseType')
            .select('id, code, description')
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
      ),
      PrescriptionDisease (
        *,
        DiseaseType (*)
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
      ),
      PrescriptionDisease (
        *,
        DiseaseType (*)
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
    // 1. Crear la prescripción
    const { data: prescriptionData, error: prescriptionError } = await supabase
        .from('Prescription')
        .insert(input.prescription)
        .select()
        .single();

    if (prescriptionError || !prescriptionData) {
        console.error('Error creating prescription:', prescriptionError);
        return null;
    }

    // 2. Crear los productos de la prescripción con el prescription_id
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

    // 3. Crear las relaciones con tipos de enfermedad en la tabla intermedia
    const diseasesToInsert = input.disease_ids.map(diseaseTypeId => ({
        prescription_id: prescriptionData.id,
        disease_id: diseaseTypeId
    }));

    const { data: diseasesData, error: diseasesError } = await supabase
        .from('PrescriptionDisease')
        .insert(diseasesToInsert)
        .select(`
      *,
      DiseaseType (*)
    `);

    if (diseasesError) {
        console.error('Error creating prescription diseases:', diseasesError);
        return null;
    }

    return {
        ...prescriptionData,
        PrescriptionProducts: productsData,
        PrescriptionDisease: diseasesData
    } as PrescriptionWithProducts;
}

/**
 * Obtiene el siguiente número de receta disponible
 * Rango permitido: 1797304 - 1797504
 * @returns El siguiente número de receta formateado como string
 * @throws Error si se alcanzó el límite máximo de recetas
 */
export async function getNextPrescriptionNumber(): Promise<string> {
    const MIN_NUMBER = 1797304;
    const MAX_NUMBER = 1797504;
    
    try {
        // Obtener todos los números de receta de la base de datos
        const { data, error } = await supabase
            .from('Prescription')
            .select('prescription_number');

        if (error) {
            console.error('Error fetching last prescription number:', error);
            // Si hay error, devolver el número inicial
            return MIN_NUMBER.toString();
        }

        if (!data || data.length === 0) {
            // Si no hay recetas, empezar con el número mínimo
            return MIN_NUMBER.toString();
        }

        // Convertir todos los números a enteros y ordenarlos
        const numbers = data
            .map(item => parseInt(item.prescription_number, 10))
            .filter(num => !isNaN(num)) // Filtrar valores inválidos
            .sort((a, b) => b - a); // Ordenar descendente

        if (numbers.length === 0) {
            return MIN_NUMBER.toString();
        }

        // Obtener el último número (el mayor)
        const lastNumber = numbers[0];

        // Incrementar en 1
        const nextNumber = lastNumber + 1;

        // Validar que no exceda el límite máximo
        if (nextNumber > MAX_NUMBER) {
            throw new Error(`Se ha alcanzado el límite máximo de recetas (${MAX_NUMBER}). No se pueden crear más recetas.`);
        }

        return nextNumber.toString();
    } catch (error) {
        console.error('Error in getNextPrescriptionNumber:', error);
        // Si el error es por límite alcanzado, re-lanzarlo
        if (error instanceof Error && error.message.includes('límite máximo')) {
            throw error;
        }
        return MIN_NUMBER.toString();
    }
}