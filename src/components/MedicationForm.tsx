import React, { useState } from 'react';
import type { Medication } from '../types/prescription';

interface MedicationFormProps {
  onAdd: (medication: Medication) => void;
}

export const MedicationForm: React.FC<MedicationFormProps> = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleAdd = () => {
    if (name && quantity) {
      const newMedication = {
        id: Date.now().toString(),
        name,
        quantity,
      };
      onAdd(newMedication);
      setName('');
      setQuantity('');
    } else {
    }
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        placeholder="Nombre del medicamento"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="flex-1 border border-gray-300 rounded text-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleAdd();
          }
        }}
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
