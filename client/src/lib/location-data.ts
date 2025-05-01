export const tanzanianRegions = [
  "Arusha, Tanzania",
  "Dar es Salaam, Tanzania",
  "Dodoma, Tanzania",
  "Geita, Tanzania",
  "Iringa, Tanzania",
  "Kagera, Tanzania",
  "Katavi, Tanzania",
  "Kigoma, Tanzania",
  "Kilimanjaro, Tanzania",
  "Lindi, Tanzania",
  "Manyara, Tanzania",
  "Mara, Tanzania",
  "Mbeya, Tanzania",
  "Morogoro, Tanzania",
  "Mtwara, Tanzania",
  "Mwanza, Tanzania",
  "Njombe, Tanzania",
  "Pemba North, Tanzania",
  "Pemba South, Tanzania",
  "Pwani, Tanzania",
  "Rukwa, Tanzania",
  "Ruvuma, Tanzania",
  "Shinyanga, Tanzania",
  "Simiyu, Tanzania",
  "Singida, Tanzania",
  "Songwe, Tanzania",
  "Tabora, Tanzania",
  "Tanga, Tanzania",
  "Zanzibar Central/South, Tanzania",
  "Zanzibar North, Tanzania",
  "Zanzibar Urban/West, Tanzania"
];

// Transform regions into options format for the Autocomplete component
export const tanzanianRegionsOptions = tanzanianRegions.map(region => ({
  value: region.toLowerCase().replace(/\s/g, '-'),
  label: region
}));
