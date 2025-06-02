// Directory: /src/components/OverviewTextarea.tsx

import React, { ChangeEvent } from 'react';

interface OverviewTextareaProps {
  value: string;
  onChange: (newValue: string) => void;
}

const OverviewTextarea: React.FC<OverviewTextareaProps> = ({ value, onChange }) => {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <textarea
      value={value}
      onChange={handleChange}
      className="w-full resize-none bg-white border-none focus:outline-none text-[12px] overflow-hidden"
      style={{ height: '100px' }}
    />
  );
};

export default OverviewTextarea;