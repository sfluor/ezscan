import React from 'react';
import { jsPDF } from 'jspdf';
import { Link } from 'react-router-dom';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import { ImagePair } from './lib/imgkit';
import colors from './colors';

export type NamedImage = ImagePair & { name: string };

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
            padding: '5px',
            display: 'flex',
            alignItems: 'center',
            border: snapshot.isDragging ? `3px solid ${colors.primary}` : '',
            ...provided.draggableProps.style,
          }}
        >
          <img
            key={image.name}
            src={image.element.src}
            alt={image.name}
            style={{
              maxWidth: '100px',
              maxHeight: '100px',
            }}
          />
          <span
            style={{
              color: colors.primary,
              paddingLeft: '20px',
            }}
          >
            {image.name}
          </span>
          <button
            type="button"
            style={{ marginLeft: 'auto' }}
            onClick={onDelete}
          >
            Remove{' '}
          </button>
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
  const onDragEnd = (result: DropResult) => {
    // Outside the authorized boundaries
    if (!result.destination) {
      return;
    }

    // Swap images
    const newImages = [...images];
    const tmp = newImages[result.destination.index];
    newImages[result.destination.index] = newImages[result.source.index];
    newImages[result.source.index] = tmp;

    setImages(newImages);
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const onSave = () => {
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
  };

  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="images-list">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '5%',
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
      <Link to="/capture"> Add more </Link>
      <button type="button" onClick={onReset}>
        Reset
      </button>
      <button type="button" onClick={onSave}>
        Save as PDF
      </button>
    </div>
  );
}

export default ImagesList;
