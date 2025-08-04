'use client';

import { useState, useEffect } from 'react';
import { Scale, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ShareButton from '@/components/ShareButton';
import { useUrlParams } from '@/hooks/useUrlParams';
import { toast } from 'sonner';

const unitCategories = {
  length: {
    name: 'Length',
    units: {
      meter: { name: 'Meter', factor: 1 },
      kilometer: { name: 'Kilometer', factor: 1000 },
      centimeter: { name: 'Centimeter', factor: 0.01 },
      millimeter: { name: 'Millimeter', factor: 0.001 },
      inch: { name: 'Inch', factor: 0.0254 },
      foot: { name: 'Foot', factor: 0.3048 },
      yard: { name: 'Yard', factor: 0.9144 },
      mile: { name: 'Mile', factor: 1609.344 },
      nauticalMile: { name: 'Nautical Mile', factor: 1852 },
    }
  },
  weight: {
    name: 'Weight',
    units: {
      kilogram: { name: 'Kilogram', factor: 1 },
      gram: { name: 'Gram', factor: 0.001 },
      pound: { name: 'Pound', factor: 0.453592 },
      ounce: { name: 'Ounce', factor: 0.0283495 },
      ton: { name: 'Ton', factor: 1000 },
      stone: { name: 'Stone', factor: 6.35029 },
    }
  },
  temperature: {
    name: 'Temperature',
    units: {
      celsius: { name: 'Celsius', factor: 1 },
      fahrenheit: { name: 'Fahrenheit', factor: 1 },
      kelvin: { name: 'Kelvin', factor: 1 },
    }
  },
  volume: {
    name: 'Volume',
    units: {
      liter: { name: 'Liter', factor: 1 },
      milliliter: { name: 'Milliliter', factor: 0.001 },
      gallon: { name: 'Gallon (US)', factor: 3.78541 },
      quart: { name: 'Quart (US)', factor: 0.946353 },
      pint: { name: 'Pint (US)', factor: 0.473176 },
      cup: { name: 'Cup (US)', factor: 0.236588 },
      fluidOunce: { name: 'Fluid Ounce (US)', factor: 0.0295735 },
      tablespoon: { name: 'Tablespoon (US)', factor: 0.0147868 },
      teaspoon: { name: 'Teaspoon (US)', factor: 0.00492892 },
    }
  },
  area: {
    name: 'Area',
    units: {
      squareMeter: { name: 'Square Meter', factor: 1 },
      squareKilometer: { name: 'Square Kilometer', factor: 1000000 },
      squareCentimeter: { name: 'Square Centimeter', factor: 0.0001 },
      squareInch: { name: 'Square Inch', factor: 0.00064516 },
      squareFoot: { name: 'Square Foot', factor: 0.092903 },
      squareYard: { name: 'Square Yard', factor: 0.836127 },
      acre: { name: 'Acre', factor: 4046.86 },
      hectare: { name: 'Hectare', factor: 10000 },
    }
  },
  speed: {
    name: 'Speed',
    units: {
      meterPerSecond: { name: 'Meter per Second', factor: 1 },
      kilometerPerHour: { name: 'Kilometer per Hour', factor: 0.277778 },
      milePerHour: { name: 'Mile per Hour', factor: 0.44704 },
      knot: { name: 'Knot', factor: 0.514444 },
      footPerSecond: { name: 'Foot per Second', factor: 0.3048 },
    }
  },
  energy: {
    name: 'Energy',
    units: {
      joule: { name: 'Joule', factor: 1 },
      kilojoule: { name: 'Kilojoule', factor: 1000 },
      calorie: { name: 'Calorie', factor: 4.184 },
      kilocalorie: { name: 'Kilocalorie', factor: 4184 },
      wattHour: { name: 'Watt Hour', factor: 3600 },
      kilowattHour: { name: 'Kilowatt Hour', factor: 3600000 },
      btu: { name: 'BTU', factor: 1055.06 },
    }
  },
  pressure: {
    name: 'Pressure',
    units: {
      pascal: { name: 'Pascal', factor: 1 },
      kilopascal: { name: 'Kilopascal', factor: 1000 },
      bar: { name: 'Bar', factor: 100000 },
      atmosphere: { name: 'Atmosphere', factor: 101325 },
      psi: { name: 'PSI', factor: 6894.76 },
      torr: { name: 'Torr', factor: 133.322 },
    }
  }
};

export default function UnitConverter() {
  const [category, setCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState('meter');
  const [toUnit, setToUnit] = useState('foot');
  const [inputValue, setInputValue] = useState('1');
  const [result, setResult] = useState('');
  const urlParams = useUrlParams();

  // Load data from URL params on mount
  useEffect(() => {
    if (urlParams.category) setCategory(urlParams.category);
    if (urlParams.inputValue) setInputValue(urlParams.inputValue);
    if (urlParams.fromUnit) setFromUnit(urlParams.fromUnit);
    if (urlParams.toUnit) setToUnit(urlParams.toUnit);
    
    if (Object.keys(urlParams).length > 1) {
      toast.success('Loaded shared conversion data!');
    }
  }, [urlParams]);
  const convertUnits = () => {
    if (!inputValue) {
      setResult('');
      return;
    }

    const numValue = parseFloat(inputValue);
    if (isNaN(numValue)) {
      setResult('Invalid input');
      return;
    }

    const currentCategory = unitCategories[category as keyof typeof unitCategories];
    
    // Check if fromUnit and toUnit exist in the current category
    if (!currentCategory.units[fromUnit as keyof typeof currentCategory.units] || 
        !currentCategory.units[toUnit as keyof typeof currentCategory.units]) {
      return; // Exit early if units don't exist in current category
    }
    
    if (category === 'temperature') {
      // Special handling for temperature conversions
      let convertedValue = numValue;
      
      // Get unit data with proper typing
      const fromUnitData = currentCategory.units[fromUnit as keyof typeof currentCategory.units] as { name: string; factor: number };
      const toUnitData = currentCategory.units[toUnit as keyof typeof currentCategory.units] as { name: string; factor: number };
      
      // Convert from input unit to Celsius first
      if (fromUnit === 'fahrenheit') {
        convertedValue = (numValue - 32) * 5/9;
      } else if (fromUnit === 'kelvin') {
        convertedValue = numValue - 273.15;
      }
      
      // Convert from Celsius to target unit
      if (toUnit === 'fahrenheit') {
        convertedValue = convertedValue * 9/5 + 32;
      } else if (toUnit === 'kelvin') {
        convertedValue = convertedValue + 273.15;
      }
      
      setResult(`${numValue} ${fromUnitData.name} = ${convertedValue.toFixed(6).replace(/\.?0+$/, '')} ${toUnitData.name}`);
    } else {
      // Standard unit conversions using factors
      const fromUnitData = currentCategory.units[fromUnit as keyof typeof currentCategory.units] as { name: string; factor: number };
      const toUnitData = currentCategory.units[toUnit as keyof typeof currentCategory.units] as { name: string; factor: number };
      
      const fromFactor = fromUnitData.factor;
      const toFactor = toUnitData.factor;
      
      const baseValue = numValue * fromFactor;
      const convertedValue = baseValue / toFactor;
      
      setResult(`${numValue} ${fromUnitData.name} = ${convertedValue.toFixed(6).replace(/\.?0+$/, '')} ${toUnitData.name}`);
    }
  };

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  // Reset units when category changes
  useEffect(() => {
    const currentCategory = unitCategories[category as keyof typeof unitCategories];
    const unitKeys = Object.keys(currentCategory.units);
    setFromUnit(unitKeys[0]);
    setToUnit(unitKeys[1] || unitKeys[0]);
  }, [category]);

  useEffect(() => {
    convertUnits();
  }, [inputValue, fromUnit, toUnit, category]);

  const currentCategory = unitCategories[category as keyof typeof unitCategories];

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Scale className="w-5 h-5" />
            <span>Unit Converter</span>
          </CardTitle>
          <CardDescription>
            Convert between different units of measurement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Share Button */}
          <div className="flex justify-end">
            <ShareButton 
              data={{ category, inputValue, fromUnit, toUnit }}
              toolName="Unit Converter"
            />
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(unitCategories).map(([key, cat]) => (
                  <SelectItem key={key} value={key}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Value Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Value
            </label>
            <Input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value"
              className="text-lg"
            />
          </div>

          {/* Unit Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From
              </label>
              <Select value={fromUnit} onValueChange={setFromUnit}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(currentCategory.units).map(([key, unit]) => (
                    <SelectItem key={key} value={key}>
                      {unit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-center">
              <Button
                variant="outline"
                size="icon"
                onClick={swapUnits}
                className="rounded-full"
              >
                <ArrowUpDown className="w-4 h-4" />
              </Button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To
              </label>
              <Select value={toUnit} onValueChange={setToUnit}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(currentCategory.units).map(([key, unit]) => (
                    <SelectItem key={key} value={key}>
                      {unit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Result */}
          {result && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Conversion Result</h3>
              <p className="text-xl font-bold text-green-600">{result}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}