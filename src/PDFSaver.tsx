import React from 'react';
import { jsPDF } from 'jspdf';
import { ReactComponent as Download } from '@material-design-icons/svg/round/download.svg';
import { ReactComponent as Clear } from '@material-design-icons/svg/round/clear.svg';
import { NamedImage } from './ImagesList';
import colors from './colors';

function PDFSaver({
  images,
  onReset,
}: {
  images: Array<NamedImage>;
  onReset: () => void;
}) {
  const onDownload = () => {
    // eslint-disable-next-line new-cap
    const doc = new jsPDF();
    const padding = 10;
    // TODO: properly pick maxdimension
    images.forEach((image) => {
      doc.addImage(
        image.element,
        'jpeg',
        padding,
        padding,
        doc.internal.pageSize.getWidth() - 2 * padding,
        doc.internal.pageSize.getHeight() - 2 * padding
      );
      doc.addPage();
    });
    doc.save('capture.pdf');
    onReset();
  };
  return (
    <div>
      <button type="button" onClick={onDownload}>
        Download <Download colors={colors.secondary} />
      </button>
      <button type="button" onClick={onReset}>
        Reset <Clear colors={colors.secondary} />
      </button>
    </div>
  );
}

export default PDFSaver;
