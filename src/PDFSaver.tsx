import React from 'react';
import { jsPDF } from 'jspdf';
import { ReactComponent as Download } from '@material-design-icons/svg/round/download.svg';
import { ReactComponent as Delete } from '@material-design-icons/svg/round/delete.svg';
import { ReactComponent as ArrowBack } from '@material-design-icons/svg/round/arrow_back.svg';
import { useNavigate } from 'react-router-dom';
import { NamedImage } from './ImagesList';
import Footer from './Footer';
import FooterButton from './FooterButton';
import Button from './Button';

function PDFSaver({
  images,
  onReset,
}: {
  images: Array<NamedImage>;
  onReset: () => void;
}) {
  const navigate = useNavigate();

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
    <>
      <div style={{ margin: '20px' }}>
        <Button
          action={onDownload}
          name="Download"
          icon={<Download />}
          horizontal
          filled
        />
      </div>
      <Footer>
        <FooterButton
          name="Back"
          action={() => navigate(-1)}
          icon={<ArrowBack />}
        />
        <FooterButton name="Reset" action={onReset} icon={<Delete />} />
      </Footer>
    </>
  );
}

export default PDFSaver;
