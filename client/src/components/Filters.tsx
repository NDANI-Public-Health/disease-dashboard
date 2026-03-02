interface FiltersProps {
  countries: string[];
  diseases: string[];
  selectedCountry: string;
  selectedDisease: string;
  onCountryChange: (country: string) => void;
  onDiseaseChange: (disease: string) => void;
}

export default function Filters({
  countries,
  diseases,
  selectedCountry,
  selectedDisease,
  onCountryChange,
  onDiseaseChange,
}: FiltersProps) {
  return (
    <div className="filters">
      <div className="filter-group">
        <label>Country</label>
        <select
          value={selectedCountry}
          onChange={e => onCountryChange(e.target.value)}
        >
          <option value="">All Countries</option>
          {countries.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className="filter-group">
        <label>Disease</label>
        <select
          value={selectedDisease}
          onChange={e => onDiseaseChange(e.target.value)}
        >
          <option value="">All Diseases</option>
          {diseases.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
