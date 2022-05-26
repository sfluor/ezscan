import React, { useState } from 'react';
import colors from './colors';
import { useFullSize } from './FullScreenDiv';

function Button({
  name,
  action,
  icon,
  style,
  horizontal,
  filled,
  hideLabelWidthThreshold,
}: {
  name: string;
  action: () => void;
  icon: React.ReactElement;
  style?: React.CSSProperties;
  horizontal?: boolean;
  filled?: boolean;
  hideLabelWidthThreshold?: number;
}) {
  const [pressed, setPressed] = useState<boolean>(false);
  const [hovered, setHovered] = useState<boolean>(false);

  const onPressEnd = (event: React.SyntheticEvent) => {
    event.preventDefault();
    setPressed(false);
    action();
  };

  const onHover = (event: React.SyntheticEvent) => {
    event.preventDefault();
    setHovered(true);
  };

  const onHoverEnd = (event: React.SyntheticEvent) => {
    event.preventDefault();
    setHovered(false);
  };

  const onPress = (event: React.SyntheticEvent) => {
    event.preventDefault();
    setPressed(true);
  };

  const onCancel = (event: React.SyntheticEvent) => {
    event.preventDefault();
    setPressed(false);
    onHoverEnd(event);
  };

  const iconColor = pressed ? colors.secondary : colors.tertiary;
  const color = pressed ? colors.lightSecondary : colors.lightTertiary;
  let border;
  let backgroundColor;

  if (filled) {
    backgroundColor = hovered || pressed ? colors.lightPrimary : colors.primary;
    border = `3px solid ${pressed ? colors.secondary : colors.lightSecondary}`;
  } else {
    backgroundColor = hovered ? colors.lightPrimary : 'inherit';
    border = 'none';
  }

  const buttonStyle: React.CSSProperties = {
    alignItems: 'center',
    background: 'none',
    backgroundColor,
    border,
    color,
    cursor: 'pointer',
    display: 'flex',
    flexDirection: horizontal ? 'row' : 'column',
    font: 'inherit',
    justifyContent: 'space-around',
    height: '100%',
    outline: 'inherit',
    textAlign: 'center',
    ...style,
  };

  const { width } = useFullSize() || { width: 0 };
  let displayLabel;
  if (hideLabelWidthThreshold !== null) {
    displayLabel = width > hideLabelWidthThreshold;
  } else {
    displayLabel = true;
  }

  return (
    <button
      type="button"
      style={buttonStyle}
      // Press events
      onMouseDown={onPress}
      onTouchStart={onPress}
      onKeyDown={onPress}
      // Press end events
      onMouseUp={onPressEnd}
      onTouchEnd={onPressEnd}
      onKeyUp={onPressEnd}
      // Cancel events
      onMouseOut={onCancel}
      onTouchCancel={onCancel}
      onBlur={onCancel}
      // Hover events
      onMouseOver={onHover}
      onFocus={onHover}
    >
      {React.cloneElement(icon, {
        color: iconColor,
        fontSize: style?.fontSize,
      })}
      {displayLabel && (
        <span
          style={{
            fontSize: style?.fontSize || '12px',
            margin: horizontal ? '5px' : '0px',
          }}
        >
          {name}
        </span>
      )}
    </button>
  );
}

Button.defaultProps = {
  horizontal: false,
  style: {},
  filled: false,
  hideLabelWidthThreshold: null,
};

export default Button;
