'use client';

import { useState, useEffect, Suspense } from 'react';
import { Calculator, DollarSign, Clock, Scale, Shuffle } from 'lucide-react';
import { useUrlParams } from '@/hooks/useUrlParams';
import CurrencyConverter from '@/components/CurrencyConverter';
import UnitConverter from '@/components/UnitConverter';
import TimeZoneConverter from '@/components/TimeZoneConverter';
import SimpleCalculator from '@/components/SimpleCalculator';
import WheelOfNames from '@/components/WheelOfNames';

const tools = [
  { id: 'currency', name: 'Currency', icon: DollarSign, component: CurrencyConverter },
  { id: 'units', name: 'Units', icon: Scale, component: UnitConverter },
  { id: 'timezone', name: 'Time Zone', icon: Clock, component: TimeZoneConverter },
  { id: 'calculator', name: 'Calculator', icon: Calculator, component: SimpleCalculator },
  { id: 'wheel', name: 'Wheel of Names', icon: Shuffle, component: WheelOfNames },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('currency');
  const urlParams = useUrlParams();

  // Set active tab based on URL parameter
  useEffect(() => {
    if (urlParams.tool) {
      const toolMap: Record<string, string> = {
        'Currency Converter': 'currency',
        'Unit Converter': 'units',
        'Time Zone Converter': 'timezone',
        'Calculator': 'calculator',
        'Wheel of Names': 'wheel',
      };
      
      const tabId = toolMap[urlParams.tool] || urlParams.tool;
      if (tools.find(tool => tool.id === tabId)) {
        setActiveTab(tabId);
      }
    }
  }, [urlParams]);
  const ActiveComponent = tools.find(tool => tool.id === activeTab)?.component || CurrencyConverter;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">I have Tools</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-8 overflow-x-auto">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  onClick={() => setActiveTab(tool.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tool.id
                      ? 'border-blue-500 text-blue-600 font-bold'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className={activeTab === tool.id ? 'font-bold' : ''}>{tool.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<p>Loading...</p>}>
          <ActiveComponent />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 text-sm">
            <p>&copy; 2025 I have Tools. Free online tools for everyone.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
