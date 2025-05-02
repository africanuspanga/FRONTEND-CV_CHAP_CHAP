import React from 'react';
import { Combobox } from '@/components/ui/combobox';

const tanzanianUniversities = [
  { value: 'UDSM', label: 'University of Dar es Salaam (UDSM)' },
  { value: 'SUA', label: 'Sokoine University of Agriculture (SUA)' },
  { value: 'OUT', label: 'Open University of Tanzania (OUT)' },
  { value: 'SUZA', label: 'State University of Zanzibar (SUZA)' },
  { value: 'MU', label: 'Mzumbe University (MU)' },
  { value: 'NM-AIST', label: 'Nelson Mandela African Institution of Science and Technology (NM-AIST)' },
  { value: 'MUHAS', label: 'Muhimbili University of Health and Allied Sciences (MUHAS)' },
  { value: 'ARU', label: 'Ardhi University (ARU)' },
  { value: 'UDOM', label: 'University of Dodoma (UDOM)' },
  { value: 'MUST', label: 'Mbeya University of Science and Technology (MUST)' },
  { value: 'MoCU', label: 'Moshi Cooperative University (MoCU)' },
  { value: 'MJNUAT', label: 'Mwalimu Julius K. Nyerere University of Agriculture and Technology (MJNUAT)' },
  { value: 'KU', label: 'Kairuki University (KU)' },
  { value: 'SUMAIT', label: 'Abdulrahman Al-Sumait University (SUMAIT)' },
  { value: 'SAUT', label: 'St. Augustine University of Tanzania (SAUT)' },
  { value: 'ZU', label: 'Zanzibar University (ZU)' },
  { value: 'TUMA', label: 'Tumaini University Makumira (TUMA)' },
  { value: 'AKU', label: 'Aga Khan University (AKU)' },
  { value: 'CUHAS', label: 'Catholic University of Health and Allied Sciences (CUHAS)' },
  { value: 'UoA', label: 'University of Arusha (UoA)' },
  { value: 'SJUIT', label: 'St. Joseph University in Tanzania (SJUIT)' },
  { value: 'TEKU', label: 'Teofilo Kisanji University (TEKU)' },
  { value: 'MWECAU', label: 'Mwenge Catholic University (MWECAU)' },
  { value: 'MUM', label: 'Muslim University of Morogoro (MUM)' },
  { value: 'UoI', label: 'University of Iringa (UoI)' },
  { value: 'SJUT', label: 'St. John\'s University of Tanzania (SJUT)' },
  { value: 'KIUT', label: 'Kampala International University in Tanzania (KIUT)' },
  { value: 'UAUT', label: 'United African University of Tanzania (UAUT)' },
  { value: 'RUCU', label: 'Ruaha Catholic University (RUCU)' },
  { value: 'MzU', label: 'Mwanza University (MzU)' },
  { value: 'CUoM', label: 'Catholic University of Mbeya (CUoM)' },
  { value: 'DarTU', label: 'Dar es Salaam Tumaini University (DarTU)' },
  { value: 'RMUHAS', label: 'Rabininsia Memorial University of Health and Allied Sciences (RMUHAS)' },
  { value: 'UMST', label: 'University of Medical Sciences and Technology (UMST)' },
  { value: 'IUEA', label: 'Islamic University of East Africa (IUEA)' },
  { value: 'KCMC', label: 'KCMC University' },
];

interface UniversitySelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const UniversitySelect: React.FC<UniversitySelectProps> = ({
  value,
  onChange,
  placeholder = "University of Dar es Salaam",
  disabled = false,
  className
}) => {
  // Custom filter function that also matches abbreviations
  const customFilter = (query: string, option: { value: string; label: string }) => {
    const searchLower = query.toLowerCase();
    const labelLower = option.label.toLowerCase();
    const valueLower = option.value.toLowerCase();
    
    // Check if the query matches the beginning of any word in the label
    const words = labelLower.split(/\s+/);
    const matchesStart = words.some(word => word.startsWith(searchLower));
    
    // Also check if the abbreviation contains the query
    const matchesAbbreviation = valueLower.includes(searchLower);
    
    // Or if the full label contains the query
    const matchesAnywhere = labelLower.includes(searchLower);
    
    return matchesStart || matchesAbbreviation || matchesAnywhere;
  };

  return (
    <Combobox
      options={tanzanianUniversities}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
      emptyMessage="No university found. Try a different search term."
      filterFunction={customFilter}
    />
  );
};

export default UniversitySelect;
