import React from 'react';
import CountryFlag from './CountryFlag';
import WorldMap from './WorldMap';
import { CompanyRow, CheckboxItem } from '../types';
import { formatNumber } from '../util';

interface CompanyTableProps {
  checkboxes: CheckboxItem[];
  data: CompanyRow[];
  rowRefs: React.MutableRefObject<HTMLTableRowElement[]>;
  maxRowHeight: number;
}

const CompanyTable: React.FC<CompanyTableProps> = ({ checkboxes, data, rowRefs, maxRowHeight }) => {
  return (
    <div className="col-span-4 bg-white rounded-lg shadow overflow-x-auto p-4">
      <table className="min-w-full border-separate border-spacing-2">
        <thead className="bg-gray-50">
          <tr>
            {
              checkboxes[0].checkedColumns && (
                <th className="px-3 text-left text-xs font-bold text-gray-500 tracking-wider w-[70px]">Company</th>
              )
            }
            {
              checkboxes[2].checkedColumns && (
                <th className="px-3 text-left text-xs font-bold text-gray-500 tracking-wider w-[70px]">Headquarter</th>
              )
            }
            {
              checkboxes[3].checkedColumns && (
                <th className="px-3 text-left text-xs font-bold text-gray-500 tracking-wider w-[70px]">Headquarter Detail</th>
              )
            }
            {
              checkboxes[4].checkedColumns && (
                <th className="px-3 text-left text-xs font-bold text-gray-500 tracking-wider w-[70px]">Year founded</th>
              )
            }
            {
              checkboxes[5].checkedColumns && (
                <th className="px-3 text-left text-xs font-bold text-gray-500 tracking-wider w-[70px]">AUM</th>
              )
            }
            <th className="px-3 text-left text-xs font-bold text-gray-500 tracking-wider w-[350px]">Overview</th>
            {
              checkboxes[1].checkedColumns && (
                <th className="px-3 text-left text-xs font-bold text-gray-500 tracking-wider w-[200px]">Geographic presence</th>
              )
            }
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
              {
                checkboxes[0].checkedColumns && (
                  <td className="px-3 text-sm text-gray-500 text-[12px] border border-black rounded-lg bg-white">{row.company}</td>
                )
              }
              {
                checkboxes[2].checkedColumns && (
                  <td className="px-6 text-sm text-gray-500 text-[12px] border border-black rounded-lg bg-white px-10">
                    <CountryFlag countryCode='us' />
                  </td>
                )
              }
              {
                checkboxes[3].checkedColumns && (
                  <td className="px-3 text-sm text-gray-500 text-[12px] border border-black rounded-lg bg-white">{row.headquarter_detail || 'No data available'}</td>
                )
              }
              {
                checkboxes[4].checkedColumns && (
                  <td className="px-3 text-sm text-gray-500 text-[12px] border border-black rounded-lg bg-white">{row.year_founded || 'No data available'}</td>
                )
              }
              {
                checkboxes[5].checkedColumns && (
                  <td className="px-3 text-sm text-gray-500 text-[12px] border border-black rounded-lg bg-white">${formatNumber(parseFloat(row.aum))}bn</td>
                )
              }
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
              {
                checkboxes[1].checkedColumns && (
                  <td className="text-sm text-gray-500 font-[10px] border border-black rounded-lg bg-white">
                    {row.locations.length > 0 ? <WorldMap locations={row.locations} midLat={row.midLat} midLng={row.midLng} scale={row.zoom}  /> : <span>No location data</span>}
                  </td>
                )
              }
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompanyTable;