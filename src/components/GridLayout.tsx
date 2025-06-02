import React, { useEffect, useRef, useState } from 'react';
import CheckboxPanel from './CheckboxPanel';
import CompanyTable from './CompanyTable';
import { useFetchCompanyData } from '../hooks/useFetchCompanyData';
import { exportToPPTx } from '../services/PPTExportService';
import { CheckboxItem, CompanyRow } from '../types';

const GridLayout: React.FC = () => {
  const [checkboxes, setCheckboxes] = useState<CheckboxItem[]>([ /* same items */ ]);
  const [data, setData] = useState<CompanyRow[]>([]);
  const [loading, setLoading] = useState(false);
  const rowRefs = useRef<HTMLTableRowElement[]>([]);
  const [maxRowHeight, setMaxRowHeight] = useState<number>(0);
  const { fetchData } = useFetchCompanyData();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const rows = await fetchData();
      setData(rows);
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        const max = Math.max(...rowRefs.current.map(ref => ref?.offsetHeight || 0));
        setMaxRowHeight(max);
      }, 50);
    }
  }, [data, loading]);

  const handleCheckboxChange = (id: string, type: 'columns' | 'bullets') => {
    setCheckboxes(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          [type === 'columns' ? 'checkedColumns' : 'checkedBullets']: !item[type === 'columns' ? 'checkedColumns' : 'checkedBullets']
        };
      }
      return item;
    }));
  };

  const handleExport = async () => {
    setLoading(true);
    await exportToPPTx(rowRefs, data, maxRowHeight);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 mb-5">
      {loading ? <h1>Loading</h1> : <button onClick={handleExport}>Export to PPTX</button>}
      <div className="max-w-[2000px] mx-auto grid grid-cols-5 gap-2">
        <CheckboxPanel checkboxes={checkboxes} onChange={handleCheckboxChange} />
        <CompanyTable data={data} rowRefs={rowRefs} maxRowHeight={maxRowHeight} />
      </div>
    </div>
  );
};

export default GridLayout;
