// Directory: /src/services/PPTExportService.ts

import pptxgen from 'pptxgenjs';
import * as htmlToImage from 'html-to-image';
import { CompanyRow, HAlign } from '../types';

export const exportToPPTx = async (
  rowRefs: React.MutableRefObject<HTMLTableRowElement[]>,
  data: CompanyRow[],
  maxRowHeight: number
) => {
  const pptx = new pptxgen();

  let slide = pptx.addSlide();
  const headers = [
    { text: 'Company', align: 'center'},
    { text: 'Headquarter', align: 'center'},
    { text: 'Headquarter Detail', align: 'center'},
    { text: 'Year Founded', align: 'center'},
    { text: 'AUM', align: 'center'},
    { text: 'Overview', align: 'left'},
    { text: 'Graphic presence', align: 'center'},
  ];

  const colWeights = [1.5, 1.7, 2.5, 1.5, 1.4, 5.0, 2.7];
  const totalWeight = colWeights.reduce((a, b) => a + b, 0);
  const slideWidth = 10;
  const marginLeft = 1.1;
  const marginRight = 1.1;
  const usableWidth = slideWidth - marginLeft - marginRight;
  const colWidths = colWeights.map(w => (w / totalWeight) * usableWidth);
  let currentY = 0.5;
  const rowHeight = maxRowHeight * 0.007;

  const addHeaders = () => {
    let currentX = marginLeft;
    for (let i = 0; i < headers.length; i++) {
      slide.addText(headers[i].text, {
        x: currentX,
        y: currentY,
        w: colWidths[i],
        h: 0.3,
        fontSize: 8,
        bold: true,
        color: '000000',
        align: headers[i].align as HAlign,
        valign: 'middle',
      });
      currentX += colWidths[i];
    }

    slide.addShape(pptx.ShapeType.line, {
      x: marginLeft,
      y: currentY + 0.3,
      w: usableWidth,
      h: 0,
      line: { color: 'CCCCCC', width: 1, dashType: 'solid' },
    });

    currentY += 0.3;
  };

  const captureCellAsImage = async (td: HTMLElement) => {    
    const element = td.firstChild as HTMLElement;
    const canvas = await htmlToImage.toPng(element);
    
    return {
      data: canvas,
      width: element.offsetWidth,
      height: element.offsetHeight
    }
  };

  const isImageView = (td: HTMLElement): boolean => {
    return !!(td.querySelector('img') || td.querySelector('svg') || td.querySelector('canvas'));
  };

  const isOverview = (td: HTMLElement): boolean => {
    return !!td.querySelector('textarea');
  };

  addHeaders();

  for (let rowIndex = 0; rowIndex < rowRefs.current.length; rowIndex++) {
    const row = rowRefs.current[rowIndex];
    if (!row) continue;

    let currentX = marginLeft;

    for (let colIndex = 0; colIndex < row.cells.length; colIndex++) {
      const cell = row.cells[colIndex];
      const width = colWidths[colIndex];

      if (isImageView(cell)) {
        const base64Image = await captureCellAsImage(cell);
        const imageWidth = Math.min(width, base64Image.width * 0.007 * 0.97);
        const imageHeight = Math.min(maxRowHeight, base64Image.height) * 0.007 * 0.97;
        const imageY = currentY + (rowHeight - imageHeight) / 2;

        slide.addImage({
          data: base64Image.data,
          x: currentX + 0.1,
          y: imageY,
          w: imageWidth,
          h: imageHeight,
        });

      } else if (isOverview(cell)) {
        const textArea = cell.querySelector('textarea');
        const textContent = textArea?.value || '';
        slide.addText(textContent, {
          x: currentX,
          y: currentY,
          w: width,
          h: rowHeight,
          fontSize: 8,
          color: '000000',
          align: 'left',
          valign: 'middle',
        });

      } else {
        const textContent = cell.innerText || '';
        slide.addText(textContent, {
          x: currentX,
          y: currentY,
          w: width,
          h: rowHeight,
          fontSize: 8,
          color: '000000',
          align: 'center',
          valign: 'middle',
        });
      }

      currentX += width;
    }

    slide.addShape(pptx.ShapeType.line, {
      x: marginLeft,
      y: currentY + rowHeight,
      w: usableWidth,
      h: 0,
      line: { color: 'CCCCCC', width: 1, dashType: 'dash' },
    });

    currentY += rowHeight;

    if (currentY > 4) {
      slide = pptx.addSlide();
      currentY = 0.5;
      addHeaders();
    }
  }

  await pptx.writeFile({ fileName: 'TableExport.pptx' });
};
