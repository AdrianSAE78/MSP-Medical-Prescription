import React, { useState, useEffect } from 'react';
import type { Indication } from '../types/prescription';
import { SearchableSelect } from './SearchableSelect';
import { getProducts } from '../api/api';
import type { Products } from '../api/types/apiTypes';

interface IndicationFormProps {
  onAdd: (indication: Indication) => void;
}

export const IndicationForm: React.FC<IndicationFormProps> = ({ onAdd }) => {
  const [products, setProducts] = useState<Products[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [medication, setMedication] = useState('');
  const [viaAdmin, setViaAdmin] = useState('');
  const [dose, setDose] = useState('');
  const [frequency, setFrequency] = useState('');
  const [duration, setDuration] = useState('');
  const [morning, setMorning] = useState(false);
  const [noon, setNoon] = useState(false);
  const [afternoon, setAfternoon] = useState(false);
  const [night, setNight] = useState(false);

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
    if (medication && viaAdmin && dose && frequency && duration) {
      const newIndication: Indication = {
        id: Date.now().toString(),
        medication,
        viaAdmin,
        dose,
        frequency,
        duration,
        morning,
        noon,
        afternoon,
        night,
        productId: selectedProductId || undefined,
      };
      onAdd(newIndication);
      // Reset form
      setMedication('');
      setViaAdmin('');
      setDose('');
      setFrequency('');
      setDuration('');
      setMorning(false);
      setNoon(false);
      setAfternoon(false);
      setNight(false);
      setSelectedProductId(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-3 border-t pt-3">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        <SearchableSelect
          options={products.map(p => ({
            value: p.product_name,
            label: p.product_name,
            data: p
          }))}
          value={medication}
          onChange={(value, data) => {
            setMedication(value);
            const product = data as Products;
            if (product) {
              setSelectedProductId(product.id);
            }
          }}
          placeholder={loadingProducts ? "Cargando..." : "Medicamento"}
          disabled={loadingProducts}
        />
        <input
          type="text"
          placeholder="Vía Admin."
          value={viaAdmin}
          onChange={(e) => setViaAdmin(e.target.value)}
          onKeyDown={handleKeyDown}
          className="border border-gray-300 rounded text-gray-700 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          placeholder="Dosis"
          value={dose}
          onChange={(e) => setDose(e.target.value)}
          onKeyDown={handleKeyDown}
          className="border border-gray-300 rounded text-gray-700 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          placeholder="Frecuencia"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          onKeyDown={handleKeyDown}
          className="border border-gray-300 rounded text-gray-700 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          placeholder="Duración"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          onKeyDown={handleKeyDown}
          className="border border-gray-300 rounded text-gray-700 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div className="flex gap-4 items-center">
        <label className="inline-flex items-center text-sm text-gray-700">
          <input
            type="checkbox"
            checked={morning}
            onChange={(e) => setMorning(e.target.checked)}
            className="mr-1 text-gray-700"
          />
          Mañana
        </label>
        <label className="inline-flex items-center text-sm text-gray-700">
          <input
            type="checkbox"
            checked={noon}
            onChange={(e) => setNoon(e.target.checked)}
            className="mr-1 text-gray-700"
          />
          Mediodía
        </label>
        <label className="inline-flex items-center text-sm text-gray-700">
          <input
            type="checkbox"
            checked={afternoon}
            onChange={(e) => setAfternoon(e.target.checked)}
            className="mr-1 text-gray-700"
          />
          Tarde
        </label>
        <label className="inline-flex items-center text-sm text-gray-700">
          <input
            type="checkbox"
            checked={night}
            onChange={(e) => setNight(e.target.checked)}
            className="mr-1 text-gray-700"
          />
          Noche
        </label>
        <button
          type="button"
          onClick={handleAdd}
          className="ml-auto bg-green-600 text-white px-4 py-1 rounded text-sm hover:bg-green-700 transition"
        >
          Agregar Indicación
        </button>
      </div>
    </div>
  );
};
