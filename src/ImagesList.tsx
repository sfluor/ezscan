import React from 'react';
import { jsPDF } from 'jspdf';
import { useNavigate } from 'react-router-dom';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import { ReactComponent as AddAPhoto } from '@material-design-icons/svg/round/add_a_photo.svg';
import { ReactComponent as Remove } from '@material-design-icons/svg/round/remove_circle.svg';
import { ReactComponent as Save } from '@material-design-icons/svg/round/save.svg';
import { ReactComponent as Delete } from '@material-design-icons/svg/round/delete.svg';
import { ImagePair } from './lib/imgkit';
import Footer from './Footer';
import FooterButton from './FooterButton';
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
            padding: '15px',
            margin: '10px',
            display: 'flex',
            alignItems: 'center',
            border: `${snapshot.isDragging ? '2px dashed' : '1px solid'} ${
              colors.secondary
            }`,
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
              color: colors.secondary,
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
            <span>Remove</span>
            <Remove color={colors.primary} />
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

  const navigate = useNavigate();

  return (
    <>
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
      <Footer>
        <FooterButton
          // TODO: this should ask for capture directly instead of going back to the capture page
          name="Add"
          action={() => navigate('/capture', { replace: true })}
        >
          <AddAPhoto color={colors.secondary} />
        </FooterButton>
        <FooterButton name="Reset" action={onReset}>
          <Delete color={colors.secondary} />
        </FooterButton>
        <FooterButton name="Save" action={onSave}>
          <Save color={colors.secondary} />
        </FooterButton>
      </Footer>
    </>
  );
}

export default ImagesList;
