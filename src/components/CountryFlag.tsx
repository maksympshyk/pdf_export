import React from 'react';
import Flag from 'react-world-flags';

interface CountryFlagProps {
  countryCode: string; // ISO 3166-1 alpha-2 (e.g., 'US', 'FR')
  size?: number; // Optional size in pixels
}

const CountryFlag: React.FC<CountryFlagProps> = ({ countryCode }) => {
  return (
    <Flag
      code={countryCode.toUpperCase()}
      style={{ 
        marginLeft: '10px',
        width: '65px', 
        height: '25px'
      }}
    />
  );
};

export default CountryFlag;
