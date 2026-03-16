import { useMemo, useState } from 'react';
import { DEMO_CALCULATIONS, WageCalculation } from '../../lib/reportsData';

export function useReportsFilters() {
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [selectedFacilityNames, setSelectedFacilityNames] = useState<string[]>([]);
  const [selectedFacilityIds, setSelectedFacilityIds] = useState<string[]>([]);

  const allCountries = useMemo(() => {
    const set = new Set(DEMO_CALCULATIONS.map(c => c.country));
    return Array.from(set).sort();
  }, []);

  const allRegions = useMemo(() => {
    const base = selectedCountries.length > 0
      ? DEMO_CALCULATIONS.filter(c => selectedCountries.includes(c.country))
      : DEMO_CALCULATIONS;
    const set = new Set(base.map(c => c.region));
    return Array.from(set).sort();
  }, [selectedCountries]);

  const allYears = useMemo(() => {
    const set = new Set(DEMO_CALCULATIONS.map(c => c.year));
    return Array.from(set).sort((a, b) => b - a);
  }, []);

  const allFacilityNames = useMemo(() => {
    const set = new Set(DEMO_CALCULATIONS.map(c => c.facility_name));
    return Array.from(set).sort();
  }, []);

  const allFacilityIds = useMemo(() => {
    const set = new Set(DEMO_CALCULATIONS.map(c => c.facility_id));
    return Array.from(set).sort();
  }, []);

  const filtered: WageCalculation[] = useMemo(() => {
    return DEMO_CALCULATIONS.filter(c => {
      if (selectedCountries.length > 0 && !selectedCountries.includes(c.country)) return false;
      if (selectedRegions.length > 0 && !selectedRegions.includes(c.region)) return false;
      if (selectedYears.length > 0 && !selectedYears.includes(c.year)) return false;
      if (selectedFacilityNames.length > 0 && !selectedFacilityNames.includes(c.facility_name)) return false;
      if (selectedFacilityIds.length > 0 && !selectedFacilityIds.includes(c.facility_id)) return false;
      return true;
    });
  }, [selectedCountries, selectedRegions, selectedYears, selectedFacilityNames, selectedFacilityIds]);

  function toggleCountry(c: string) {
    setSelectedCountries(prev =>
      prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]
    );
    setSelectedRegions([]);
  }

  function toggleRegion(r: string) {
    setSelectedRegions(prev =>
      prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]
    );
  }

  function toggleYear(y: number) {
    setSelectedYears(prev =>
      prev.includes(y) ? prev.filter(x => x !== y) : [...prev, y]
    );
  }

  function toggleFacilityName(n: string) {
    setSelectedFacilityNames(prev =>
      prev.includes(n) ? prev.filter(x => x !== n) : [...prev, n]
    );
  }

  function toggleFacilityId(id: string) {
    setSelectedFacilityIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }

  function clearFilters() {
    setSelectedCountries([]);
    setSelectedRegions([]);
    setSelectedYears([]);
    setSelectedFacilityNames([]);
    setSelectedFacilityIds([]);
  }

  const hasFilters =
    selectedCountries.length > 0 ||
    selectedRegions.length > 0 ||
    selectedYears.length > 0 ||
    selectedFacilityNames.length > 0 ||
    selectedFacilityIds.length > 0;

  return {
    filtered,
    allCountries,
    allRegions,
    allYears,
    allFacilityNames,
    allFacilityIds,
    selectedCountries,
    selectedRegions,
    selectedYears,
    selectedFacilityNames,
    selectedFacilityIds,
    toggleCountry,
    toggleRegion,
    toggleYear,
    toggleFacilityName,
    toggleFacilityId,
    clearFilters,
    hasFilters,
  };
}
