'use client';

import { useState, useEffect } from 'react';
import { Calculator, Delete } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ShareButton from '@/components/ShareButton';
import { useUrlParams } from '@/hooks/useUrlParams';
import { toast } from 'sonner';

export default function SimpleCalculator() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const urlParams = useUrlParams();

  // Load data from URL params on mount
  useEffect(() => {
    if (urlParams.display) {
      setDisplay(urlParams.display);
      toast.success('Loaded shared calculation!');
    }
  }, [urlParams]);
  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return secondValue !== 0 ? firstValue / secondValue : firstValue;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const handleEquals = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    const { key } = event;

    if (key >= '0' && key <= '9') {
      event.preventDefault();
      inputNumber(key);
    } else if (key === '.') {
      event.preventDefault();
      inputDecimal();
    } else if (key === '+' || key === '-') {
      event.preventDefault();
      performOperation(key);
    } else if (key === '*') {
      event.preventDefault();
      performOperation('×');
    } else if (key === '/') {
      event.preventDefault();
      performOperation('÷');
    } else if (key === 'Enter' || key === '=') {
      event.preventDefault();
      handleEquals();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
      event.preventDefault();
      clear();
    } else if (key === 'Backspace') {
      event.preventDefault();
      if (display.length > 1) {
        setDisplay(display.slice(0, -1));
      } else {
        setDisplay('0');
      }
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [display, previousValue, operation, waitingForOperand]);

  const buttonClass = "h-14 text-lg font-semibold";
  const numberButtonClass = `${buttonClass} bg-white hover:bg-gray-50 text-gray-900 border-gray-200`;
  const operatorButtonClass = `${buttonClass} bg-blue-600 hover:bg-blue-700 text-white`;
  const equalsButtonClass = `${buttonClass} bg-green-600 hover:bg-green-700 text-white`;
  const clearButtonClass = `${buttonClass} bg-red-600 hover:bg-red-700 text-white`;

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="w-5 h-5" />
            <span>Simple Calculator</span>
          </CardTitle>
          <CardDescription>
            Basic calculator with keyboard support
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Share Button */}
          <div className="flex justify-end">
            <ShareButton 
              data={{ display, result: display }}
              toolName="Calculator"
            />
          </div>

          {/* Display */}
          <div className="bg-gray-900 text-white p-4 rounded-lg">
            <div className="text-right text-3xl font-mono overflow-hidden">
              {display}
            </div>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {/* Row 1 */}
            <Button
              variant="outline"
              className={clearButtonClass}
              onClick={clear}
            >
              <Delete className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              className={operatorButtonClass}
              onClick={() => performOperation('÷')}
            >
              ÷
            </Button>
            <Button
              variant="outline"
              className={operatorButtonClass}
              onClick={() => performOperation('×')}
            >
              ×
            </Button>
            <Button
              variant="outline"
              className={operatorButtonClass}
              onClick={() => performOperation('-')}
            >
              -
            </Button>

            {/* Row 2 */}
            <Button
              variant="outline"
              className={numberButtonClass}
              onClick={() => inputNumber('7')}
            >
              7
            </Button>
            <Button
              variant="outline"
              className={numberButtonClass}
              onClick={() => inputNumber('8')}
            >
              8
            </Button>
            <Button
              variant="outline"
              className={numberButtonClass}
              onClick={() => inputNumber('9')}
            >
              9
            </Button>
            <Button
              variant="outline"
              className={operatorButtonClass}
              onClick={() => performOperation('+')}
            >
              +
            </Button>

            {/* Row 3 */}
            <Button
              variant="outline"
              className={numberButtonClass}
              onClick={() => inputNumber('4')}
            >
              4
            </Button>
            <Button
              variant="outline"
              className={numberButtonClass}
              onClick={() => inputNumber('5')}
            >
              5
            </Button>
            <Button
              variant="outline"
              className={numberButtonClass}
              onClick={() => inputNumber('6')}
            >
              6
            </Button>
            <Button
              variant="outline"
              className={`${equalsButtonClass} row-span-2`}
              onClick={handleEquals}
            >
              =
            </Button>

            {/* Row 4 */}
            <Button
              variant="outline"
              className={numberButtonClass}
              onClick={() => inputNumber('1')}
            >
              1
            </Button>
            <Button
              variant="outline"
              className={numberButtonClass}
              onClick={() => inputNumber('2')}
            >
              2
            </Button>
            <Button
              variant="outline"
              className={numberButtonClass}
              onClick={() => inputNumber('3')}
            >
              3
            </Button>

            {/* Row 5 */}
            <Button
              variant="outline"
              className={`${numberButtonClass} col-span-2`}
              onClick={() => inputNumber('0')}
            >
              0
            </Button>
            <Button
              variant="outline"
              className={numberButtonClass}
              onClick={inputDecimal}
            >
              .
            </Button>
          </div>

          <div className="text-center text-sm text-gray-500">
            <p>Use your keyboard for input</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}