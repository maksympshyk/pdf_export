import React from 'react';
import CountryFlag from './CountryFlag';
import WorldMap from './WorldMap';
import { CompanyRow } from '../types';
import { formatNumber } from '../util';

interface CompanyTableProps {
  data: CompanyRow[];
  rowRefs: React.MutableRefObject<HTMLTableRowElement[]>;
  maxRowHeight: number;
}

const CompanyTable: React.FC<CompanyTableProps> = ({ data, rowRefs, maxRowHeight }) => {
  return (
    <div className="col-span-4 bg-white rounded-lg shadow overflow-x-auto p-4">
      <table className="min-w-full border-separate border-spacing-2">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 text-left text-xs font-bold text-gray-500 tracking-wider w-[70px]">Company</th>
            <th className="px-3 text-left text-xs font-bold text-gray-500 tracking-wider w-[70px]">Headquarter</th>
            <th className="px-3 text-left text-xs font-bold text-gray-500 tracking-wider w-[70px]">Headquarter Detail</th>
            <th className="px-3 text-left text-xs font-bold text-gray-500 tracking-wider w-[70px]">Year founded</th>
            <th className="px-3 text-left text-xs font-bold text-gray-500 tracking-wider w-[70px]">AUM</th>
            <th className="px-3 text-left text-xs font-bold text-gray-500 tracking-wider w-[350px]">Overview</th>
            <th className="px-3 text-left text-xs font-bold text-gray-500 tracking-wider w-[200px]">Geographic presence</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              ref={(el) => {
                if (el) rowRefs.current[index] = el;
              }}
            >
              <td className="px-3 text-sm text-gray-500 text-[12px] border border-black rounded-lg bg-white">{row.company}</td>
              <td className="px-6 text-sm text-gray-500 text-[12px] border border-black rounded-lg bg-white px-10">
                <CountryFlag countryCode='us' />
                {/* <img src={mapImage} /> */}
              </td>
              <td className="px-3 text-sm text-gray-500 text-[12px] border border-black rounded-lg bg-white">{row.headquarter_detail || 'No data available'}</td>
              <td className="px-3 text-sm text-gray-500 text-[12px] border border-black rounded-lg bg-white">{row.year_founded || 'No data available'}</td>
              <td className="px-3 text-sm text-gray-500 text-[12px] border border-black rounded-lg bg-white">{formatNumber(parseFloat(row.aum))}bn</td>
              <td className="px-3 text-sm text-gray-500 border border-black rounded-lg bg-white" style={{ height: maxRowHeight }}>
                <textarea
                  value={row.customOverview}
                  onChange={(e) => {
                    row.customOverview = e.target.value;
                    e.target.style.height = 'auto';
                    e.target.style.height = `${e.target.scrollHeight}px`;
                  }}
                  className="w-full resize-none bg-white border-none focus:outline-none text-[12px] overflow-hidden"
                  style={{ height: '100px' }}
                />
              </td>
              <td className="text-sm text-gray-500 font-[10px] border border-black rounded-lg bg-white">
                {row.locations.length > 0 ? <WorldMap locations={row.locations} /> : <span>No location data</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompanyTable;