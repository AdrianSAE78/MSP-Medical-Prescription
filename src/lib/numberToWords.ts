/**
 * Convierte números a palabras en español
 * Soporta números del 0 al 999,999
 */

const unidades = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
const decenas = ['', '', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
const especiales = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];
const centenas = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];

function convertirMenorCien(num: number): string {
    if (num === 0) return '';
    if (num < 10) return unidades[num];
    if (num >= 10 && num < 20) return especiales[num - 10];
    if (num >= 20 && num < 30) {
        return num === 20 ? 'veinte' : `veinti${unidades[num - 20]}`;
    }
    if (num < 100) {
        const dec = Math.floor(num / 10);
        const uni = num % 10;
        return uni === 0 ? decenas[dec] : `${decenas[dec]} y ${unidades[uni]}`;
    }
    return '';
}

function convertirMenorMil(num: number): string {
    if (num === 0) return 'cero';
    if (num < 100) return convertirMenorCien(num);
    
    const cent = Math.floor(num / 100);
    const resto = num % 100;
    
    let resultado = num === 100 ? 'cien' : centenas[cent];
    
    if (resto > 0) {
        resultado += ` ${convertirMenorCien(resto)}`;
    }
    
    return resultado.trim();
}

/**
 * Convierte un número entero a su representación en palabras en español
 * @param num - Número a convertir (0-999,999)
 * @returns Representación en palabras del número
 */
export function numberToWords(num: number): string {
    if (num === 0) return 'cero';
    if (num < 0) return `menos ${numberToWords(Math.abs(num))}`;
    if (num >= 1000000) return num.toString(); // Fuera de rango soportado
    
    const miles = Math.floor(num / 1000);
    const resto = num % 1000;
    
    let resultado = '';
    
    if (miles > 0) {
        if (miles === 1) {
            resultado = 'mil';
        } else {
            resultado = `${convertirMenorMil(miles)} mil`;
        }
    }
    
    if (resto > 0) {
        resultado = resultado ? `${resultado} ${convertirMenorMil(resto)}` : convertirMenorMil(resto);
    }
    
    return resultado.trim();
}

/**
 * Extrae el primer número encontrado en un string y lo convierte a palabras
 * Útil para convertir dosis como "500mg" a "quinientos"
 * @param text - Texto que contiene un número
 * @returns Número convertido a palabras, o string vacío si no se encuentra número
 */
export function extractAndConvertNumber(text: string): string {
    const match = text.match(/\d+/);
    if (!match) return '';
    
    const num = parseInt(match[0], 10);
    return numberToWords(num);
}

/**
 * Convierte una dosis completa preservando las unidades
 * Ejemplo: "500mg" -> "quinientos miligramos"
 * @param dose - Dosis a convertir
 * @returns Dosis en palabras
 */
export function convertDoseToWords(dose: string): string {
    if (!dose.trim()) return '';
    
    // Extraer número y unidad
    const match = dose.match(/^(\d+(?:\.\d+)?)\s*([a-zA-Z]+)?/);
    if (!match) return '';
    
    const number = parseFloat(match[1]);
    const unit = match[2] || '';
    
    // Convertir el número a palabras
    const numberWords = numberToWords(Math.floor(number));
    
    // Convertir unidades comunes
    const unitMap: { [key: string]: string } = {
        'mg': 'miligramos',
        'g': 'gramos',
        'ml': 'mililitros',
        'l': 'litros',
        'mcg': 'microgramos',
        'µg': 'microgramos',
        'UI': 'unidades internacionales',
        'tab': 'tabletas',
        'cap': 'cápsulas',
        'comp': 'comprimidos',
        'gota': 'gotas',
        'gotas': 'gotas',
        'cuch': 'cucharadas',
        'cucharada': 'cucharadas',
        'cucharadas': 'cucharadas'
    };
    
    const unitWords = unitMap[unit.toLowerCase()] || unit;
    
    return unitWords ? `${numberWords} ${unitWords}` : numberWords;
}
