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
        minHeight: '60px',
        height: '5%',
        marginTop: 'auto',
        alignItems: 'center',
      }}
    >
      {children}
    </footer>
  );
}

export default Footer;
