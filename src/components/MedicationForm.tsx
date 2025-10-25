import React, { useState, useEffect } from 'react';
import type { Medication } from '../types/prescription';
import { SearchableSelect } from './SearchableSelect';
import { getProducts } from '../api/api';
import type { Products } from '../api/types/apiTypes';

interface MedicationFormProps {
  onAdd: (medication: Medication) => void;
}

export const MedicationForm: React.FC<MedicationFormProps> = ({ onAdd }) => {
  const [products, setProducts] = useState<Products[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');

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

  const handleAdd = () => {
    if (name && quantity) {
      const newMedication: Medication = {
        id: Date.now().toString(),
        name,
        quantity,
        productId: selectedProductId || undefined,
      };
      onAdd(newMedication);
      setName('');
      setQuantity('');
      setSelectedProductId(null);
    }
  };

  return (
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
      <input
        type="text"
        placeholder="Cantidad"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        className="w-40 border border-gray-300 rounded text-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleAdd();
          }
        }}
      />
      <button
        type="button"
        onClick={handleAdd}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
      >
        Agregar
      </button>
    </div>
  );
};
