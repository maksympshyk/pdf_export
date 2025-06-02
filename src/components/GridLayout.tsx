import React, { useEffect, useRef, useState } from 'react';
import CheckboxPanel from './CheckboxPanel';
import CompanyTable from './CompanyTable';
import { useFetchCompanyData } from '../hooks/useFetchCompanyData';
import { exportToPPTx } from '../services/PPTExportService';
import { CheckboxItem, CompanyRow } from '../types';

const GridLayout: React.FC = () => {
  const [checkboxes, setCheckboxes] = useState<CheckboxItem[]>([
    {
      id: '1',
      label: 'Company name',
      checkedColumns: true,
      checkedBullets: false,
      inColumns: true,
      inBullets: false
    },
    {
      id: '2',
      label: 'Map',
      checkedColumns: true,
      checkedBullets: false,
      inColumns: true,
      inBullets: false
    },
    {
      id: '3',
      label: 'HQ country',
      checkedColumns: true,
      checkedBullets: false,
      inColumns: true,
      inBullets: false
    },
    {
      id: '4',
      label: 'HQ detail',
      checkedColumns: true,
      checkedBullets: true,
      inColumns: true,
      inBullets: true
    },
    {
      id: '5',
      label: 'Founding year',
      checkedColumns: true,
      checkedBullets: true,
      inColumns: true,
      inBullets: true
    },
    {
      id: '6',
      label: 'AUM/AUM detail',
      checkedColumns: true,
      checkedBullets: true,
      inColumns: true,
      inBullets: true
    },
    {
      id: '7',
      label: 'Products/solutions',
      checkedColumns: false,
      checkedBullets: true,
      inColumns: false,
      inBullets: true
    },
    {
      id: '8',
      label: 'Client detail',
      checkedColumns: false,
      checkedBullets: true,
      inColumns: false,
      inBullets: true
    },
    {
      id: '9',
      label: 'Location detail',
      checkedColumns: false,
      checkedBullets: true,
      inColumns: false,
      inBullets: true
    },
    {
      id: '10',
      label: 'Key management',
      checkedColumns: false,
      checkedBullets: true,
      inColumns: false,
      inBullets: true
    },
    {
      id: '11',
      label: 'Blank field for entry',
      checkedColumns: false,
      checkedBullets: true,
      inColumns: false,
      inBullets: true
    },
  ]);
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
        <CompanyTable checkboxes={checkboxes} data={data} rowRefs={rowRefs} maxRowHeight={maxRowHeight} />
      </div>
    </div>
  );
};

export default GridLayout;
