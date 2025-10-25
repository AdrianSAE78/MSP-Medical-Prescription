# 📋 Guía del Sistema de Numeración de Recetas

## Funcionamiento

El sistema de numeración de recetas funciona de manera automática e incremental:

### 🔢 Formato
- **Formato**: `000100` (6 dígitos con ceros a la izquierda)
- **Inicio**: `000100` (primera receta)
- **Incremento**: Automático (+1 por cada nueva receta)

### Ejemplos
```
Primera receta:  000100
Segunda receta:  000101
Tercera receta:  000102
...
Receta 999:      000999
Receta 1000:     001000
```

## 🔧 Implementación Técnica

### 1. Función API: `getNextPrescriptionNumber()`
**Ubicación**: `src/api/api.ts`

```typescript
export async function getNextPrescriptionNumber(): Promise<string>
```

**Funcionamiento**:
1. Consulta la base de datos para obtener el último `prescription_number`
2. Convierte el número a entero
3. Incrementa en 1
4. Formatea con `padStart(6, '0')` para mantener 6 dígitos
5. Si no hay recetas previas o hay error, devuelve `'000100'`

### 2. Hook: `usePrescriptionForm()`
**Ubicación**: `src/hooks/usePrescriptionForm.ts`

**Cambios**:
- Inicializa `recipeNumber` con `'000000'` (temporal)
- `useEffect` llama a `getNextPrescriptionNumber()` al montar
- Actualiza el estado con el número correcto

### 3. Base de Datos
**Campo**: `prescription_number` en tabla `Prescription`
- **Tipo**: `text` o `varchar`
- **Almacenamiento**: Como string con formato `000100`

## 📊 Flujo de Datos

```
1. Usuario abre el formulario
   ↓
2. usePrescriptionForm() se monta
   ↓
3. useEffect ejecuta getNextPrescriptionNumber()
   ↓
4. Query a Supabase: SELECT prescription_number ORDER BY DESC LIMIT 1
   ↓
5. Obtiene último número (ej: "000105")
   ↓
6. Convierte a número: 105
   ↓
7. Incrementa: 106
   ↓
8. Formatea: "000106"
   ↓
9. Actualiza formData.recipeNumber
   ↓
10. Se muestra en el formulario y PDF
```

## ⚠️ Consideraciones Importantes

### 1. **Concurrencia**
Si dos usuarios crean recetas simultáneamente, podrían obtener el mismo número. Para evitar esto:

**Solución recomendada**:
- Agregar un constraint `UNIQUE` en `prescription_number`
- Implementar retry logic si hay conflicto
- Usar transacciones con locks

### 2. **Números Saltados**
Si un usuario obtiene un número pero no guarda la receta, ese número se "pierde". Esto es **aceptable** para mantener la simplicidad.

### 3. **Migración de Datos Existentes**
Si ya tienes recetas sin numeración:
```sql
-- Actualizar recetas existentes con numeración secuencial
UPDATE "Prescription"
SET prescription_number = LPAD((ROW_NUMBER() OVER (ORDER BY created_at))::text, 6, '0')
WHERE prescription_number IS NULL;
```

## 🔐 Mejoras Futuras

### Opción 1: Usar Secuencias de PostgreSQL
```sql
CREATE SEQUENCE prescription_number_seq START 100;

-- En el INSERT
prescription_number = LPAD(nextval('prescription_number_seq')::text, 6, '0')
```

### Opción 2: Numeración por Usuario
Si cada médico debe tener su propia secuencia:
```typescript
const lastNumber = await supabase
  .from('Prescription')
  .select('prescription_number')
  .eq('user_id', userId)
  .order('prescription_number', { ascending: false })
  .limit(1);
```

### Opción 3: Numeración por Año
Formato: `YYYY-000100` (ej: `2025-000100`)
```typescript
const year = new Date().getFullYear();
const prefix = `${year}-`;
// Buscar el último número del año actual
```

## 🧪 Testing

### Caso 1: Primera receta (BD vacía)
```
Esperado: "000100"
```

### Caso 2: Receta existente
```
Última en BD: "000150"
Esperado: "000151"
```

### Caso 3: Error de conexión
```
Esperado: "000100" (fallback)
```

## 📝 Notas

- El número se asigna al **abrir el formulario**, no al guardar
- Si el usuario recarga la página, obtendrá un **nuevo número**
- Los números son **consecutivos** pero pueden tener "huecos" por recetas no guardadas
- El formato de 6 dígitos permite hasta **999,999 recetas** antes de necesitar ajuste

## 🐛 Troubleshooting

### Problema: El número no aparece
**Solución**: Verificar que `getNextPrescriptionNumber` está importado correctamente

### Problema: Números duplicados
**Solución**: Agregar constraint UNIQUE en la base de datos

### Problema: El número empieza en 1 en lugar de 100
**Solución**: Verificar que el fallback en `getNextPrescriptionNumber` devuelve `'000100'`
