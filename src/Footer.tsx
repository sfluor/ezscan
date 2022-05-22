import React from 'react';
import colors from './colors';

function Footer({ children }: { children: React.ReactNode }) {
  return (
    <footer
      style={{
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        backgroundColor: colors.primary,
        height: '10%',
        alignItems: 'center',
      }}
    >
      {children}
    </footer>
  );
}

export default Footer;
