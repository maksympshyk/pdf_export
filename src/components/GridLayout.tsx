import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { getCountryCode } from 'countries-list';

import pptxgen from 'pptxgenjs';
import html2canvas from 'html2canvas';

import CountryFlag from './CountryFlag';
import { getCountryISO3, renderOverviewAsText } from '../util';
import WorldMap from './WorldMap';

interface CheckboxItem {
  id: string;
  label: string;
  checkedColumns: boolean;
  checkedBullets: boolean;
  inColumns: boolean;
  inBullets: boolean;
}


const GridLayout: React.FC = () => {
  const [checkboxes, setCheckboxes] = useState<CheckboxItem[]>([
    { id: 'company_name', label: 'Company name', checkedColumns: true, checkedBullets: false, inColumns: true, inBullets: false },
    { id: 'map', label: 'Map', checkedColumns: true, checkedBullets: false, inColumns: true, inBullets: false },
    { id: 'hq_country', label: 'HQ country', checkedColumns: true, checkedBullets: false, inColumns: true, inBullets: false },
    { id: 'hq_detail', label: 'HQ detail', checkedColumns: true, checkedBullets: false, inColumns: true, inBullets: true },
    { id: 'founding_year', label: 'Founding year', checkedColumns: true, checkedBullets: false, inColumns: true, inBullets: true },
    { id: 'aum_detail', label: 'AUM/AUM detail', checkedColumns: true, checkedBullets: false, inColumns: true, inBullets: true },
    { id: 'products', label: 'Products/solutions', checkedColumns: false, checkedBullets: false, inColumns: false, inBullets: true },
    { id: 'client_detail', label: 'Client detail', checkedColumns: false, checkedBullets: false, inColumns: false, inBullets: true },
    { id: 'location_detail', label: 'Location Detail', checkedColumns: false, checkedBullets: false, inColumns: false, inBullets: true },
    { id: 'key_management', label: 'Key management', checkedColumns: false, checkedBullets: false, inColumns: false, inBullets: true },
    { id: 'blank_field', label: 'Blank field for entry', checkedColumns: false, checkedBullets: false, inColumns: false, inBullets: true },
  ]);

  const [data, setData] = useState<any[]>([]);
  const rowRefs = useRef<HTMLTableRowElement[]>([]);
  const [maxRowHeight, setMaxRowHeight] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const flagRef = useRef(null);

  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        const max = Math.max(...rowRefs.current.map(ref => ref?.offsetHeight || 0));
        setMaxRowHeight(max);
      }, 50);
    }
  }, [data]);

  const fetchData = async () => {
    let url = 'https://dataplatform.synergy-impact.de/company_specific_info/get_strip_profile_data';
    const headers = {
      'Authorization': 'Bearer cloud-ib-pptx-8084',
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    let data = {
      "data_type": [
        "company_name",
        "product_summary",
        "product_summary_source_complete",
        "client_summary",
        "client_summary_source_complete",
        "firm_years_summary",
        "firm_years_summary_source_complete",
        "locations_text",
        "locations_text_source_complete",
        "hq",
        "hq_source_complete",
        "AUM",
        "aum_source_complete",
        "AUM_detail",
        "aum_detail_source_complete",
        "foundingyear_HQ_combined",
        "foundingyear_HQ_combined_source_complete"
      ],
      "cib_ids": [
        "25financial.com",
        "acadviser.com",
        "almanackip.com"
      ],
      "orient": "records"
    }

    setLoading(true)
    try {
      const response = await axios.post(url, data, { headers });

      const rows = await Promise.all(
        response.data.map(async (row: any) => {
          const locationResponse = await axios.get(
            `https://dataplatform.synergy-impact.de/companies/get_company_locations?cib_id=${row.cib_id}&orient=records`,
            { headers }
          );

          const overview = {
            hq_detail: row.hq_source_complete || null,
            founding_year: row.foundingyear_HQ_combined_source_complete || null,
            AUM_detail: row.AUM_detail || null,
            client_detail: row.client_summary_source_complete || null,
            location_detail: row.locations_text || null,
          };

          return {
            company: row.company_name,
            headquarter: row.hq,
            headquarter_detail: row.hq,
            year_founded: 'Founded in 1997', // You can replace this with actual year if needed
            aum: parseFloat(row.AUM.replace(',', '.')).toFixed(2) + 'bn',
            customOverview: renderOverviewAsText(overview),
            locations: locationResponse.data.map((loc: any) => ({
              lat: loc.lat,
              long: loc.long,
              country: getCountryISO3(loc.country_id)
            })),
          };
        })
      );
      setData(rows);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCheckboxChange = (id: string, type: 'columns' | 'bullets') => {
    setCheckboxes(checkboxes.map(checkbox => {
      if (checkbox.id === id) {
        return {
          ...checkbox,
          [type === 'columns' ? 'checkedColumns' : 'checkedBullets']: !checkbox[type === 'columns' ? 'checkedColumns' : 'checkedBullets']
        };
      }
      return checkbox;
    }));
  };

  const captureCellAsImage = async (td: HTMLElement): Promise<string> => {
    const canvas = await html2canvas(td, { scale: 2 });
    return canvas.toDataURL('image.png');
  }

  const isVisualCell = (td: HTMLElement): boolean => {
    const image = td.querySelector('img');
    const worldMap = td.querySelector('div');

    return !!(image || worldMap);
  }

  const isOverview = (td: HTMLElement): boolean => {
    const textArea = td.querySelector('textarea');
    return !!(textArea);
  }

  const addHeaders = (slide: any, colWidths: number[], marginLeft: number, startY: number, headers: any[]) => {
    let currentX = marginLeft;
    for (let i = 0; i < headers.length; i++) {
      slide.addText(headers[i].text, {
        x: currentX,
        y: startY,
        w: colWidths[i],
        h: 0.3,
        fontSize: 8,
        bold: true,
        color: '000000',
        align: 'left',
        valign: 'middle',
        fill: { color: 'F1F1F1' }, // light gray background
        line: { color: 'CCCCCC' }, // optional border
      });
      currentX += colWidths[i];
    }
  }

  const exportToPPTx = async () => {
      const pptx = new pptxgen();

      // Create slide
      let slide = pptx.addSlide();

      // Table-like data structure
      const headers = [
        { text: 'Company', options: { fontSize: 8, bold: true } },
        { text: 'Headquarter', options: { fontSize: 8, bold: true } },
        { text: 'Headquarter Detail', options: { fontSize: 8, bold: true } },
        { text: 'Year Founded', options: { fontSize: 8, bold: true } },
        { text: 'AUM', options: { fontSize: 8, bold: true } },
        { text: 'Overview', options: { fontSize: 8, bold: true } },
        { text: 'Graphic presence', options: { fontSize: 8, bold: true } },
      ];

      // Slide and margin config
      const slideWidth = 10; // inches
      const marginTop = 1.5;
      const marginBottom = 1.5;
      const marginLeft = 1.1;
      const marginRight = 1.1;
      const usableWidth = slideWidth - marginLeft - marginRight;

      // Column width weights
      const colWeights = [1.5, 1.7, 2.5, 1.7, 1.5, 5.0, 2.3];
      const totalWeight = colWeights.reduce((a, b) => a + b, 0);
      const colWidths = colWeights.map(w => (w / totalWeight) * usableWidth);

      const rowHeight = 0.8;

      let currentY = 0.5;

      addHeaders(slide, colWidths, marginLeft, currentY, headers)
      currentY += 0.4;

      for (let rowIndex = 0; rowIndex < rowRefs.current.length; rowIndex ++) {
        const row = rowRefs.current[rowIndex];
        if (!row) continue;

        let currentX = marginLeft;

        for (let colIndex = 0; colIndex < row.cells.length; colIndex++)  {
          const cell = row.cells[colIndex];
          const width = colWidths[colIndex];

          if (isVisualCell(cell)) {
            const base64Image = await captureCellAsImage(cell);
            slide.addImage({
              data: base64Image,
              x: currentX,
              y: currentY,
              w: width,
              h: rowHeight,
            });
          } else if (isOverview(cell)) {
            const textArea = cell.querySelector('textarea');
            const textContent = textArea?.value || '';

            slide.addText(textContent, {
              x: currentX,
              y: currentY + 0.1,
              w: width,
              h: rowHeight + 0.1,
              fontSize: 8,
              color: '000000',
              align: 'left',
              valign: 'middle',
              autoFit: true,
              shrinkText: true
            });
          }else {
            const textContent = cell.innerText || '';
            slide.addText(textContent, {
              x: currentX,
              y: currentY + 0.1,
              w: width,
              h: rowHeight - 0.1,
              fontSize: 8,
              color: '000000',
              align: 'left',
              valign: 'middle',
            });
          }
          currentX += width;
        }
        currentY += rowHeight + 0.5;

        // Add new slide if needed
        if (currentY > 6.5) {
          slide = pptx.addSlide();
          currentY = 0.5;
          addHeaders(slide, colWidths, marginLeft, currentY, headers);
          currentY += 0.4;
        }
      }

      // Save the PPTX file
      pptx.writeFile({ fileName: 'TableExport.pptx' });
  };


  return (
    <div>
      {loading ? (
        <h1>Loading</h1>
      ) : (
        <div className="min-h-screen bg-gray-100 p-6 mb-5">
          <button
            onClick={exportToPPTx}
          >Export to PPTX</button>
          <div className="max-w-[2000px] mx-auto">
            <div className="grid grid-cols-5 gap-2">
              {/* Left side - Checkboxes */}
              <div className="col-span-1 bg-white rounded-lg shadow p-4">
                <div className="mb-4">
                  {/* Headers */}
                  <div className="grid grid-cols-3 mb-4">
                    <div className="text-sm font-semibold text-gray-700"></div>
                    <div className="text-sm font-semibold text-gray-700 text-center">Columns</div>
                    <div className="text-sm font-semibold text-gray-700 text-center">
                      Bullet in<br />overview
                    </div>
                  </div>

                  {/* Checkbox rows */}
                  <div className="space-y-2">
                    {checkboxes.map((checkbox) => (
                      <div key={checkbox.id} className="grid grid-cols-3 items-center">
                        <div className="text-sm text-gray-700 pr-2">{checkbox.label}</div>
                        <div className="flex justify-center">
                          {checkbox.inColumns && (
                            <input
                              type="checkbox"
                              id={`checkbox-columns-${checkbox.id}`}
                              checked={checkbox.checkedColumns}
                              onChange={() => handleCheckboxChange(checkbox.id, 'columns')}
                              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            />
                          )}
                        </div>
                        <div className="flex justify-center">
                          {checkbox.inBullets && (
                            <input
                              type="checkbox"
                              id={`checkbox-bullets-${checkbox.id}`}
                              checked={checkbox.checkedBullets}
                              onChange={() => handleCheckboxChange(checkbox.id, 'bullets')}
                              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right side - Table */}
              <div className="col-span-4 bg-white rounded-lg shadow overflow-x-auto p-4">
                <table className="min-w-full border-separate border-spacing-2">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-3 text-left text-xs font-[14px] font-bold text-gray-500 tracking-wider w-[70px]">
                        Company
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-[14px] font-bold text-gray-500 tracking-wider w-[70px]">
                        Headquarter
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-[14px] font-bold text-gray-500 tracking-wider w-[70px]">
                        Headquarter Detail
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-[14px] font-bold text-gray-500 tracking-wider w-[70px]">
                        Year founded
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-[14px] font-bold text-gray-500 tracking-wider w-[70px]">
                        AUM
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-[14px] font-bold text-gray-500 tracking-wider w-[350px]">
                        Overview
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-[14px] font-bold text-gray-500 tracking-wider w-[200px]">
                        Geographic presence
                      </th>
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
                        <td className="px-3 py-2 text-sm text-gray-500 text-[12px] border border-black rounded-lg bg-white">
                          {row.company}
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-500 text-[12px] border border-black rounded-lg bg-white px-10">
                          <CountryFlag countryCode='us' />
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-500 text-[12px] border border-black rounded-lg bg-white">
                          {row.headquarter_detail || 'No data available'}
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-500 text-[12px] border border-black rounded-lg bg-white">
                          {row.year_founded || 'No data available'}
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-500 text-[12px] border border-black rounded-lg bg-white">
                          ${row.aum}
                        </td>
                        <td
                          className="px-3 py-2 text-sm text-gray-500 border border-black rounded-lg bg-white"
                          style={{ height: maxRowHeight }}
                        >
                          <textarea
                            value={row.customOverview}
                            onChange={(e) => {
                              const updated = [...data];
                              updated[index].customOverview = e.target.value;
                              setData(updated);

                              // Auto-resize logic
                              e.target.style.height = 'auto';
                              e.target.style.height = `${e.target.scrollHeight}px`;
                            }}
                            className="w-full resize-none bg-white border-none focus:outline-none text-[12px] overflow-hidden"
                            style={{ height: '100px' }} // or any base height
                          />
                        </td>
                        <td className="text-sm text-gray-500 font-[10px] border border-black rounded-lg bg-white">
                        {
                          row.locations.length > 0 ? (
                            <WorldMap locations={row.locations} />
                          ) : (
                            <span>No location data</span>
                          )
                        }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GridLayout; 