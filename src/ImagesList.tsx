import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import { ReactComponent as AddAPhoto } from '@material-design-icons/svg/round/add_a_photo.svg';
import { ReactComponent as Save } from '@material-design-icons/svg/round/save.svg';
import { ReactComponent as Delete } from '@material-design-icons/svg/round/delete.svg';
import { ReactComponent as Edit } from '@material-design-icons/svg/round/edit.svg';
import { ReactComponent as DragIndicatorIcon } from '@material-design-icons/svg/round/drag_indicator.svg';
import { NamedImage } from './lib/imgkit';
import Footer from './Footer';
import FooterButton from './FooterButton';
import Button from './Button';
import Input from './Input';
import colors from './colors';
import routes from './routes';
import reorder from './lib/arrayhelpers';
import { typography as typo } from './language';

const saveAsPDF = (images: Array<NamedImage>, file: string) => {
  // eslint-disable-next-line new-cap
  const doc = new jsPDF('p', 'pt', 'a4', true);
  const padding = 10;

  const docWidth = doc.internal.pageSize.getWidth() - 2 * padding;
  const docHeight = doc.internal.pageSize.getHeight() - 2 * padding;

  images.forEach((image, index) => {
    if (index > 0) {
      doc.addPage();
    }

    // Scale image to PDF size
    const ratio: number = Math.min(
      docWidth / image.data.width,
      docHeight / image.data.height
    );

    doc.addImage(
      image.element,
      'jpeg',
      padding,
      padding,
      ratio * image.data.width,
      ratio * image.data.height,
      '',
      'FAST'
    );
  });
  doc.save(file);
};

function DragIndicator({ style }: { style: React.CSSProperties }) {
  const fontSize = '22px';
  return (
    <div
      style={{
        ...style,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <DragIndicatorIcon color={colors.tertiary} style={{ fontSize }} />
      <DragIndicatorIcon
        color={colors.tertiary}
        // Negative margin to pack the 3 indicator icons together
        style={{ margin: '-5px', fontSize }}
      />
      <DragIndicatorIcon color={colors.tertiary} style={{ fontSize }} />
    </div>
  );
}

function DraggableImageItem({
  image,
  index,
  onDelete,
}: {
  image: NamedImage;
  index: number;
  onDelete: () => void;
}) {
  return (
    <Draggable key={image.name} draggableId={image.name} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            padding: '15px',
            margin: '10px',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: colors.primary,
            border: `2px ${snapshot.isDragging ? 'dashed' : 'solid'} ${
              snapshot.isDragging ? colors.lightSecondary : colors.tertiary
            }`,
            ...provided.draggableProps.style,
          }}
        >
          <DragIndicator style={{ paddingRight: '15px' }} />
          <img
            key={image.name}
            src={image.element.src}
            alt={image.name}
            style={{
              maxWidth: '100px',
              maxHeight: '100px',
              border: `1px solid ${colors.tertiary}`,
            }}
          />
          <span
            style={{
              color: colors.tertiary,
              paddingLeft: '20px',
            }}
          >
            {image.name}
          </span>
          <Button
            name={typo.actions.remove}
            style={{ marginLeft: 'auto', fontSize: '18px', maxHeight: '50px' }}
            action={onDelete}
            icon={<Delete />}
            hideLabelWidthThreshold={500}
            horizontal
          />
        </div>
      )}
    </Draggable>
  );
}

function ImagesList({
  images,
  onReset,
  setImages,
}: {
  images: Array<NamedImage>;
  onReset: () => void;
  setImages: (images: Array<NamedImage>) => void;
}) {
  const dateString = new Date()
    .toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .replace(/\//g, '-');
  const [filename, setFilename] = useState<string>(
    `scan-${dateString}-${Math.round(Math.random() * 1_000)}`
  );

  const onDragEnd = (result: DropResult) => {
    // Outside the authorized boundaries
    if (!result.destination) {
      return;
    }

    const from = result.source.index;
    const to = result.destination.index;
    setImages(reorder(images, from, to));
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const navigate = useNavigate();

  // Redirect to home page if we have no images
  useEffect(() => {
    if (!images || images.length === 0) {
      navigate(routes.home);
    }
  }, []);

  return (
    <div
      style={{
        overflowY: 'scroll',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          padding: '5% 5% 1% 5%',
        }}
      >
        <h2>
          📸 {typo.scannedPages} ({images.length} {typo.page(images.length > 1)}
          )
        </h2>
        <span>{typo.scanPageDescription}</span>
        <form style={{ marginTop: '20px' }}>
          <Input
            value={filename}
            onChange={setFilename}
            label={`${typo.editFilename}:`}
            icon={<Edit />}
          />
        </form>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="images-list">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{
                display: 'flex',
                flexDirection: 'column',
                margin: '5%',
                justifyContent: 'space-between',
              }}
            >
              {images.map((image, index) => (
                <DraggableImageItem
                  key={image.name}
                  image={image}
                  index={index}
                  onDelete={() => removeImage(index)}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <Footer>
        <FooterButton
          // TODO: this should ask for capture directly instead of going back to the capture page
          name={typo.actions.add}
          action={() => navigate(routes.editor)}
          icon={<AddAPhoto />}
        />
        <FooterButton
          name={typo.actions.reset}
          action={onReset}
          icon={<Delete />}
        />
        <FooterButton
          name={typo.actions.save}
          action={() => saveAsPDF(images, filename)}
          icon={<Save />}
        />
      </Footer>
    </div>
  );
}

export default ImagesList;
