'use client';

import { useState, useEffect } from 'react';
import { Clock, Globe } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ShareButton from '@/components/ShareButton';
import { useUrlParams } from '@/hooks/useUrlParams';
import { toast } from 'sonner';

const timeZones = [
  { value: 'America/New_York', label: 'New York (EST/EDT)', offset: -5 },
  { value: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)', offset: -8 },
  { value: 'America/Chicago', label: 'Chicago (CST/CDT)', offset: -6 },
  { value: 'America/Denver', label: 'Denver (MST/MDT)', offset: -7 },
  { value: 'Europe/London', label: 'London (GMT/BST)', offset: 0 },
  { value: 'Europe/Paris', label: 'Paris (CET/CEST)', offset: 1 },
  { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)', offset: 1 },
  { value: 'Europe/Rome', label: 'Rome (CET/CEST)', offset: 1 },
  { value: 'Europe/Madrid', label: 'Madrid (CET/CEST)', offset: 1 },
  { value: 'Europe/Amsterdam', label: 'Amsterdam (CET/CEST)', offset: 1 },
  { value: 'Europe/Moscow', label: 'Moscow (MSK)', offset: 3 },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)', offset: 9 },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)', offset: 8 },
  { value: 'Asia/Hong_Kong', label: 'Hong Kong (HKT)', offset: 8 },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)', offset: 8 },
  { value: 'Asia/Seoul', label: 'Seoul (KST)', offset: 9 },
  { value: 'Asia/Kolkata', label: 'Mumbai (IST)', offset: 5.5 },
  { value: 'Asia/Dubai', label: 'Dubai (GST)', offset: 4 },
  { value: 'Asia/Jakarta', label: 'Jakarta (WIB)', offset: 7 },
  { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)', offset: 10 },
  { value: 'Australia/Melbourne', label: 'Melbourne (AEST/AEDT)', offset: 10 },
  { value: 'Pacific/Auckland', label: 'Auckland (NZST/NZDT)', offset: 12 },
  { value: 'America/Toronto', label: 'Toronto (EST/EDT)', offset: -5 },
  { value: 'America/Vancouver', label: 'Vancouver (PST/PDT)', offset: -8 },
  { value: 'America/Mexico_City', label: 'Mexico City (CST/CDT)', offset: -6 },
  { value: 'America/Sao_Paulo', label: 'São Paulo (BRT)', offset: -3 },
  { value: 'America/Buenos_Aires', label: 'Buenos Aires (ART)', offset: -3 },
  { value: 'America/Lima', label: 'Lima (PET)', offset: -5 },
  { value: 'America/Bogota', label: 'Bogotá (COT)', offset: -5 },
  { value: 'America/Caracas', label: 'Caracas (VET)', offset: -4 },
  { value: 'Africa/Cairo', label: 'Cairo (EET)', offset: 2 },
  { value: 'Africa/Lagos', label: 'Lagos (WAT)', offset: 1 },
  { value: 'Africa/Johannesburg', label: 'Johannesburg (SAST)', offset: 2 },
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)', offset: 0 },
];

export default function TimeZoneConverter() {
  const [fromTimeZone, setFromTimeZone] = useState('America/New_York');
  const [toTimeZone, setToTimeZone] = useState('Europe/London');
  const [currentTime, setCurrentTime] = useState(new Date());
  const urlParams = useUrlParams();

  // Load data from URL params on mount
  useEffect(() => {
    if (urlParams.fromTimeZone) setFromTimeZone(urlParams.fromTimeZone);
    if (urlParams.toTimeZone) setToTimeZone(urlParams.toTimeZone);
    
    if (Object.keys(urlParams).length > 1) {
      toast.success('Loaded shared time zone comparison!');
    }
  }, [urlParams]);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getTimeInZone = (timeZone: string) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        timeZone,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }).format(currentTime);
    } catch (error) {
      return 'Invalid timezone';
    }
  };

  const getShortTimeInZone = (timeZone: string) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }).format(currentTime);
    } catch (error) {
      return 'Invalid timezone';
    }
  };

  const getTimeDifference = () => {
    const fromTime = new Date().toLocaleString('en-US', { timeZone: fromTimeZone });
    const toTime = new Date().toLocaleString('en-US', { timeZone: toTimeZone });
    
    const fromDate = new Date(fromTime);
    const toDate = new Date(toTime);
    
    const diffMs = toDate.getTime() - fromDate.getTime();
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    
    if (diffHours === 0) {
      return 'Same time';
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ahead`;
    } else {
      return `${Math.abs(diffHours)} hour${Math.abs(diffHours) !== 1 ? 's' : ''} behind`;
    }
  };

  const fromTimeZoneLabel = timeZones.find(tz => tz.value === fromTimeZone)?.label || fromTimeZone;
  const toTimeZoneLabel = timeZones.find(tz => tz.value === toTimeZone)?.label || toTimeZone;

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Time Zone Converter</span>
          </CardTitle>
          <CardDescription>
            Compare times across different time zones around the world
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Share Button */}
          <div className="flex justify-end">
            <ShareButton 
              data={{ fromTimeZone, toTimeZone }}
              toolName="Time Zone Converter"
            />
          </div>

          {/* Time Zone Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Time Zone
              </label>
              <Select value={fromTimeZone} onValueChange={setFromTimeZone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {timeZones.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To Time Zone
              </label>
              <Select value={toTimeZone} onValueChange={setToTimeZone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {timeZones.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Time Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Globe className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">
                  {fromTimeZoneLabel.split(' (')[0]}
                </h3>
              </div>
              <div className="text-2xl font-bold text-blue-700 mb-2">
                {getShortTimeInZone(fromTimeZone)}
              </div>
              <div className="text-sm text-blue-600">
                {getTimeInZone(fromTimeZone).split(', ').slice(0, -1).join(', ')}
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Globe className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-green-900">
                  {toTimeZoneLabel.split(' (')[0]}
                </h3>
              </div>
              <div className="text-2xl font-bold text-green-700 mb-2">
                {getShortTimeInZone(toTimeZone)}
              </div>
              <div className="text-sm text-green-600">
                {getTimeInZone(toTimeZone).split(', ').slice(0, -1).join(', ')}
              </div>
            </div>
          </div>

          {/* Time Difference */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
            <h3 className="font-semibold text-gray-900 mb-2">Time Difference</h3>
            <p className="text-lg font-medium text-gray-700">
              {toTimeZoneLabel.split(' (')[0]} is {getTimeDifference()} of {fromTimeZoneLabel.split(' (')[0]}
            </p>
          </div>

          {/* Current UTC Time */}
          <div className="text-center text-sm text-gray-500">
            <p>Current UTC Time: {getTimeInZone('UTC')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}