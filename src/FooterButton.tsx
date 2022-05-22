import React from 'react';

export const footerButtonStyle: React.CSSProperties = {
  alignItems: 'center',
  background: 'none',
  border: 'none',
  color: 'inherit',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  font: 'inherit',
  justifyContent: 'center',
  lineHeight: '3vh',
  outline: 'inherit',
  padding: '1vh 2vh',
  textAlign: 'center',
  animationName: 'slideLeft,fadeIn',
  animationDuration: '500ms',
};

// Footer button
function FooterButton({
  name,
  action,
  children,
}: {
  name: string;
  children: React.ReactNode;
  action: () => void;
}) {
  const lowerName = name.toLowerCase().replace(' ', '_');

  return (
    <button
      id={`${lowerName}-btn`}
      type="button"
      style={footerButtonStyle}
      onClick={action}
      onKeyDown={action}
    >
      {children}
      <span>{name}</span>
    </button>
  );
}

export default FooterButton;
