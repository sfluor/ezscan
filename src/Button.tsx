import React, { useState } from 'react';
import colors from './colors';

function Button({
  name,
  action,
  icon,
  style,
  horizontal,
  filled,
}: {
  name: string;
  action: () => void;
  icon: React.ReactElement;
  style?: React.CSSProperties;
  horizontal?: boolean;
  filled?: boolean;
}) {
  const [pressed, setPressed] = useState<boolean>(false);
  const [hovered, setHovered] = useState<boolean>(false);

  const onPressEnd = () => {
    setPressed(false);
    action();
  };

  const onHover = () => {
    setHovered(true);
  };

  const onHoverEnd = () => {
    setHovered(false);
  };

  const onPress = () => {
    setPressed(true);
  };

  const onCancel = () => {
    setPressed(false);
    onHoverEnd();
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
    padding: '1vh 2vh',
    textAlign: 'center',
    ...style,
  };

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
      <span
        style={{
          fontSize: style?.fontSize || '12px',
          margin: horizontal ? '5px' : '0px',
        }}
      >
        {name}
      </span>
    </button>
  );
}

Button.defaultProps = {
  horizontal: false,
  style: {},
  filled: false,
};

export default Button;
