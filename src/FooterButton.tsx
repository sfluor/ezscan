import React from 'react';
import Button from './Button';

const footerButtonAnimation: React.CSSProperties = {
  animationName: 'slideLeft,fadeIn',
  animationDuration: '500ms',
};

// Footer button
function FooterButton({
  name,
  action,
  icon,
}: {
  name: string;
  icon: React.ReactElement;
  action: () => void;
}) {
  return (
    <Button
      icon={icon}
      name={name}
      action={action}
      style={footerButtonAnimation}
    />
  );
}

export default FooterButton;
