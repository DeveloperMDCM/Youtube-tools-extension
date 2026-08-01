import { useState } from 'react';
import { Card } from '../components/Card';
import { palette_themes } from '../constants/colors';
import { isExtensionRuntime } from '../storage';

export function AppearancePage() {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const preview = !isExtensionRuntime();

  return (
    <Card
      title="Appearance"
      description="Preview colors for the page shell"
      info={preview ? 'Dev preview mode' : 'Installed extension'}
    >
      {palette_themes.map((color, index) => (
        <div
          key={color + index}
          style={{ backgroundColor: color }}
          className="mt-2 mb-4 flex justify-between rounded-xl border-2 border-gray-500 shadow-xl"
        >
          <input
            className="ml-5 w-7"
            type="radio"
            id={`appearance-${index}`}
            name="appearanceGroup"
            value={color}
            checked={selectedColor === color}
            onChange={() => setSelectedColor(color)}
          />
          <label className="h-16 w-full rounded-md text-center" htmlFor={`appearance-${index}`}>
            <span className="flex h-full w-full cursor-pointer items-center justify-center font-bold text-white">
              {color}
            </span>
          </label>
        </div>
      ))}
    </Card>
  );
}
