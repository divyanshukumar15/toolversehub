import React, { useState, useEffect } from 'react';
import { Ruler, Weight, Thermometer, Zap, ArrowRightLeft } from 'lucide-react';

type Category = 'length' | 'weight' | 'temperature' | 'area';

const units: Record<Category, { name: string; factor: number; symbol: string }[]> = {
  length: [
    { name: 'Meters', factor: 1, symbol: 'm' },
    { name: 'Kilometers', factor: 1000, symbol: 'km' },
    { name: 'Centimeters', factor: 0.01, symbol: 'cm' },
    { name: 'Millimeters', factor: 0.001, symbol: 'mm' },
    { name: 'Inches', factor: 0.0254, symbol: 'in' },
    { name: 'Feet', factor: 0.3048, symbol: 'ft' },
    { name: 'Yards', factor: 0.9144, symbol: 'yd' },
    { name: 'Miles', factor: 1609.34, symbol: 'mi' },
  ],
  weight: [
    { name: 'Kilograms', factor: 1, symbol: 'kg' },
    { name: 'Grams', factor: 0.001, symbol: 'g' },
    { name: 'Milligrams', factor: 0.000001, symbol: 'mg' },
    { name: 'Pounds', factor: 0.453592, symbol: 'lb' },
    { name: 'Ounces', factor: 0.0283495, symbol: 'oz' },
  ],
  temperature: [
    { name: 'Celsius', factor: 1, symbol: '°C' },
    { name: 'Fahrenheit', factor: 1, symbol: '°F' },
    { name: 'Kelvin', factor: 1, symbol: 'K' },
  ],
  area: [
    { name: 'Square Meters', factor: 1, symbol: 'm²' },
    { name: 'Square Kilometers', factor: 1000000, symbol: 'km²' },
    { name: 'Square Feet', factor: 0.092903, symbol: 'ft²' },
    { name: 'Acres', factor: 4046.86, symbol: 'ac' },
    { name: 'Hectares', factor: 10000, symbol: 'ha' },
  ],
};

export default function UnitConverter() {
  const [category, setCategory] = useState<Category>('length');
  const [fromUnit, setFromUnit] = useState(units.length[0].name);
  const [toUnit, setToUnit] = useState(units.length[1].name);
  const [value, setValue] = useState<string>('1');
  const [result, setResult] = useState<number>(0);

  useEffect(() => {
    setFromUnit(units[category][0].name);
    setToUnit(units[category][1].name);
  }, [category]);

  useEffect(() => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setResult(0);
      return;
    }

    if (category === 'temperature') {
      let celsius = numValue;
      if (fromUnit === 'Fahrenheit') celsius = (numValue - 32) * 5 / 9;
      if (fromUnit === 'Kelvin') celsius = numValue - 273.15;

      let final = celsius;
      if (toUnit === 'Fahrenheit') final = (celsius * 9 / 5) + 32;
      if (toUnit === 'Kelvin') final = celsius + 273.15;
      setResult(final);
    } else {
      const from = units[category].find(u => u.name === fromUnit)!;
      const to = units[category].find(u => u.name === toUnit)!;
      const inBase = numValue * from.factor;
      setResult(inBase / to.factor);
    }
  }, [value, fromUnit, toUnit, category]);

  const categories_list: { id: Category; name: string; icon: any }[] = [
    { id: 'length', name: 'Length', icon: Ruler },
    { id: 'weight', name: 'Weight', icon: Weight },
    { id: 'temperature', name: 'Temp', icon: Thermometer },
    { id: 'area', name: 'Area', icon: Zap },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories_list.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-bold transition-all ${
              category === cat.id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
            }`}
          >
            <cat.icon className="w-5 h-5" />
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">From</label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-indigo-500 outline-none font-bold text-lg"
              />
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-indigo-500 outline-none font-bold"
              >
                {units[category].map(u => (
                  <option key={u.name} value={u.name}>{u.name} ({u.symbol})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="p-3 bg-indigo-50 rounded-full text-indigo-600">
              <ArrowRightLeft className="w-6 h-6" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">To</label>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-indigo-50 border-2 border-indigo-100 rounded-2xl font-bold text-lg text-indigo-700">
                {result.toLocaleString(undefined, { maximumFractionDigits: 6 })}
              </div>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-indigo-500 outline-none font-bold"
              >
                {units[category].map(u => (
                  <option key={u.name} value={u.name}>{u.name} ({u.symbol})</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-8 rounded-3xl border-2 border-dashed border-gray-200 space-y-4">
          <h3 className="font-bold text-gray-900">Conversion Summary</h3>
          <div className="text-3xl font-black text-indigo-600">
            {value} {units[category].find(u => u.name === fromUnit)?.symbol} =
          </div>
          <div className="text-4xl font-black text-gray-900">
            {result.toLocaleString(undefined, { maximumFractionDigits: 6 })} {units[category].find(u => u.name === toUnit)?.symbol}
          </div>
          <p className="text-sm text-gray-500 leading-relaxed">
            Quickly convert between different units of measurement. Our tool provides high-precision results for length, weight, temperature, and area.
          </p>
        </div>
      </div>
    </div>
  );
}
