import React from 'react';
import { jsPDF } from 'jspdf';
import { ReactComponent as Download } from '@material-design-icons/svg/round/download.svg';
import { ReactComponent as Clear } from '@material-design-icons/svg/round/clear.svg';
import { NamedImage } from './ImagesList';
import Button from './Button';

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
    images.forEach((image, index) => {
      if (index > 0) {
        doc.addPage();
      }
      doc.addImage(
        image.element,
        'jpeg',
        padding,
        padding,
        doc.internal.pageSize.getWidth() - 2 * padding,
        doc.internal.pageSize.getHeight() - 2 * padding
      );
    });
    doc.save('capture.pdf');
    onReset();
  };
  return (
    <div style={{ margin: '20px' }}>
      <Button
        action={onDownload}
        name="Download"
        icon={<Download />}
        horizontal
        filled
      />
      <br />
      <Button
        action={onReset}
        name="Reset"
        icon={<Clear />}
        horizontal
        filled
      />
    </div>
  );
}

export default PDFSaver;
