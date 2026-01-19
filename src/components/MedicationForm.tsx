import React, { useState, useEffect } from 'react';
import type { Medication } from '../types/prescription';
import { SearchableSelect } from './SearchableSelect';
import { getProducts } from '../api/api';
import type { Products } from '../api/types/apiTypes';
import { extractAndConvertNumber } from '../lib/numberToWords';

interface MedicationFormProps {
  onAdd: (medication: Medication) => void;
}

export const MedicationForm: React.FC<MedicationFormProps> = ({ onAdd }) => {
  const [products, setProducts] = useState<Products[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [quantityWrite, setQuantityWrite] = useState('');

  // Cargar productos al montar el componente
  useEffect(() => {
    const loadProducts = async () => {
      const data = await getProducts();
      if (data) {
        setProducts(data);
      }
      setLoadingProducts(false);
    };
    loadProducts();
  }, []);

  const autoFillQuantityWrite = () => {
    if (quantity) {
      const quantityWords = extractAndConvertNumber(quantity);
      setQuantityWrite(quantityWords);
    }
  };

  const handleAdd = () => {
    if (name && quantity) {
      const newMedication: Medication = {
        id: Date.now().toString(),
        name,
        quantity,
        quantity_write: quantityWrite || '', // Asegurar que siempre tenga un valor
        productId: selectedProductId || undefined,
      };
      console.log('Medicamento agregado:', newMedication); // Debug
      onAdd(newMedication);
      setName('');
      setQuantity('');
      setQuantityWrite('');
      setSelectedProductId(null);
    }
  };

  return (
    <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex gap-2">
        <SearchableSelect
          options={products.map(p => ({
            value: p.product_name,
            label: p.product_name,
            data: p
          }))}
          value={name}
          onChange={(value, data) => {
            setName(value);
            const product = data as Products;
            if (product) {
              setSelectedProductId(product.id);
            }
          }}
          placeholder={loadingProducts ? "Cargando productos..." : "Buscar producto"}
          className="flex-1"
          disabled={loadingProducts}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
            Cantidad (número)
          </label>
          <input
            type="text"
            id="quantity"
            placeholder="Ej: 30"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full border border-gray-300 rounded text-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAdd();
              }
            }}
          />
        </div>
        
        <div>
          <label htmlFor="quantityWrite" className="block text-sm font-medium text-gray-700 mb-1">
            Cantidad (escrito)
          </label>
          <div className="flex gap-1">
            <input
              type="text"
              id="quantityWrite"
              placeholder="Ej: treinta"
              value={quantityWrite}
              onChange={(e) => setQuantityWrite(e.target.value)}
              className="flex-1 border border-gray-300 rounded text-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAdd();
                }
              }}
            />
            <button
              type="button"
              onClick={autoFillQuantityWrite}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded whitespace-nowrap"
              title="Convertir cantidad a palabras"
            >
              🔄
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleAdd}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition font-medium"
        >
          Agregar Medicamento
        </button>
      </div>
    </div>
  );
};
