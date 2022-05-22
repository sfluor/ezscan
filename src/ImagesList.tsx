import React, { useEffect } from 'react';
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
import { ReactComponent as DragIndicatorIcon } from '@material-design-icons/svg/round/drag_indicator.svg';
import { ImagePair } from './lib/imgkit';
import Footer from './Footer';
import FooterButton from './FooterButton';
import Button from './Button';
import colors from './colors';
import routes from './routes';
import reorder from './lib/arrayhelpers';

export type NamedImage = ImagePair & { name: string };

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
            name="Remove"
            style={{ marginLeft: 'auto', fontSize: '18px', maxHeight: '50px' }}
            action={onDelete}
            icon={<Remove />}
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
    <>
      <h4> You can drag and drop images to re-arrange them</h4>
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
                overflowY: 'scroll',
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
          action={() => navigate(routes.editor)}
          icon={<AddAPhoto />}
        />
        <FooterButton name="Reset" action={onReset} icon={<Delete />} />
        <FooterButton
          name="Save"
          action={() => navigate(routes.save)}
          icon={<Save />}
        />
      </Footer>
    </>
  );
}

export default ImagesList;
