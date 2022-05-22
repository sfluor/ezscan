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

  const onPressEnd = () => {
    setPressed(false);
    action();
  };

  const onPress = () => {
    setPressed(true);
  };

  const onCancel = () => {
    setPressed(false);
  };

  const iconColor = pressed ? colors.secondary : colors.tertiary;
  const color = pressed ? colors.lightSecondary : colors.lightTertiary;
  let border;
  let backgroundColor;

  if (filled) {
    backgroundColor = pressed ? colors.lightPrimary : colors.primary;
    border = `${pressed ? 3 : 2}px solid ${
      pressed ? colors.secondary : colors.lightSecondary
    }`;
  } else {
    backgroundColor = 'inherit';
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
    justifyContent: 'space-between',
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
    >
      {React.cloneElement(icon, { color: iconColor })}
      <span style={{ fontSize: '12px' }}>{name}</span>
    </button>
  );
}

Button.defaultProps = {
  horizontal: false,
  style: {},
  filled: false,
};

export default Button;
