import React, { useState, useEffect, useRef } from 'react';

interface Option {
  value: string;
  label: string;
  data?: unknown;
}

interface SearchableSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string, data?: unknown) => void;
  placeholder?: string;
  className?: string;
  filterBy?: 'label' | 'value' | 'both';
  disabled?: boolean;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Buscar...',
  className = '',
  filterBy = 'both',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);
  const containerRef = useRef<HTMLDivElement>(null);

  // Actualizar opciones filtradas cuando cambia el término de búsqueda
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredOptions(options);
    } else {
      const filtered = options.filter(option => {
        const searchLower = searchTerm.toLowerCase();
        
        if (filterBy === 'label') {
          return option.label.toLowerCase().includes(searchLower);
        } else if (filterBy === 'value') {
          return option.value.toLowerCase().includes(searchLower);
        } else {
          return (
            option.label.toLowerCase().includes(searchLower) ||
            option.value.toLowerCase().includes(searchLower)
          );
        }
      });
      setFilteredOptions(filtered);
    }
  }, [searchTerm, options, filterBy]);

  // Cerrar el dropdown cuando se hace click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: Option) => {
    onChange(option.value, option.data);
    setSearchTerm(option.label);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  // Encontrar la opción seleccionada actual
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <input
        type="text"
        value={searchTerm || selectedOption?.label || ''}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full border border-gray-300 rounded text-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      
      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto">
          {filteredOptions.map((option, index) => (
            <div
              key={`${option.value}-${index}`}
              onClick={() => handleSelect(option)}
              className={`px-3 py-2 cursor-pointer hover:bg-blue-100 ${
                option.value === value ? 'bg-blue-50' : ''
              }`}
            >
              <div className="font-medium text-gray-900">{option.label}</div>
              {option.value !== option.label && (
                <div className="text-sm text-gray-500">{option.value}</div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {isOpen && searchTerm && filteredOptions.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg">
          <div className="px-3 py-2 text-gray-500 text-sm">
            No se encontraron resultados
          </div>
        </div>
      )}
    </div>
  );
};
