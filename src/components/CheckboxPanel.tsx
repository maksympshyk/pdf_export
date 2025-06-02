import React from 'react';
import { CheckboxItem } from '../types';

interface CheckboxPanelProps {
  checkboxes: CheckboxItem[];
  onChange: (id: string, type: 'columns' | 'bullets') => void;
}

const CheckboxPanel: React.FC<CheckboxPanelProps> = ({ checkboxes, onChange }) => {
  return (
    <div className="col-span-1 bg-white rounded-lg shadow p-4">
      <div className="mb-4">
        <div className="grid grid-cols-3 mb-4">
          <div className="text-sm font-semibold text-gray-700"></div>
          <div className="text-sm font-semibold text-gray-700 text-center">Columns</div>
          <div className="text-sm font-semibold text-gray-700 text-center">
            Bullet in<br />overview
          </div>
        </div>

        <div className="space-y-2">
          {checkboxes.map((checkbox) => (
            <div key={checkbox.id} className="grid grid-cols-3 items-center">
              <div className="text-sm text-gray-700 pr-2">{checkbox.label}</div>
              <div className="flex justify-center">
                {checkbox.inColumns && (
                  <input
                    type="checkbox"
                    checked={checkbox.checkedColumns}
                    onChange={() => onChange(checkbox.id, 'columns')}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                )}
              </div>
              <div className="flex justify-center">
                {checkbox.inBullets && (
                  <input
                    type="checkbox"
                    checked={checkbox.checkedBullets}
                    onChange={() => onChange(checkbox.id, 'bullets')}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CheckboxPanel;