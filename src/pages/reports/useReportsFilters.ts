import { useMemo, useState } from 'react';
import { DEMO_CALCULATIONS, WageCalculation } from '../../lib/reportsData';

export function useReportsFilters() {
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

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

  const allProducts = useMemo(() => {
    const set = new Set(DEMO_CALCULATIONS.map(c => c.product));
    return Array.from(set).sort();
  }, []);

  const filtered: WageCalculation[] = useMemo(() => {
    return DEMO_CALCULATIONS.filter(c => {
      if (selectedCountries.length > 0 && !selectedCountries.includes(c.country)) return false;
      if (selectedRegions.length > 0 && !selectedRegions.includes(c.region)) return false;
      if (selectedYears.length > 0 && !selectedYears.includes(c.year)) return false;
      if (selectedProducts.length > 0 && !selectedProducts.includes(c.product)) return false;
      return true;
    });
  }, [selectedCountries, selectedRegions, selectedYears, selectedProducts]);

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

  function toggleProduct(p: string) {
    setSelectedProducts(prev =>
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    );
  }

  function clearFilters() {
    setSelectedCountries([]);
    setSelectedRegions([]);
    setSelectedYears([]);
    setSelectedProducts([]);
  }

  const hasFilters =
    selectedCountries.length > 0 ||
    selectedRegions.length > 0 ||
    selectedYears.length > 0 ||
    selectedProducts.length > 0;

  return {
    filtered,
    allCountries,
    allRegions,
    allYears,
    allProducts,
    selectedCountries,
    selectedRegions,
    selectedYears,
    selectedProducts,
    toggleCountry,
    toggleRegion,
    toggleYear,
    toggleProduct,
    clearFilters,
    hasFilters,
  };
}
