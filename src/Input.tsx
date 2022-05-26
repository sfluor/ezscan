import React, { useState } from 'react';
import colors from './colors';

function Input({
  value,
  onChange,
  label,
  icon,
}: {
  value: string;
  label?: string | null;
  icon: React.ReactElement;
  onChange: (value: string) => void;
}) {
  const [selected, setSelected] = useState<boolean>(false);
  const color = selected ? colors.secondary : colors.tertiary;

  const border = `1px solid ${color}`;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'left',
        justifyContent: 'space-around',
        flexDirection: 'column',
      }}
    >
      {label && <span>{label}</span>}
      <div
        style={{
          border,
          display: 'flex',
          marginTop: '5px',
          alignItems: 'center',
          width: '250px',
          height: '40px',
          backgroundColor: colors.primary,
          color: colors.tertiary,
        }}
      >
        <input
          type="text"
          value={value}
          onFocus={() => setSelected(true)}
          onBlur={() => setSelected(false)}
          onChange={(event) => onChange(event.target.value)}
          style={{
            all: 'unset',
            paddingLeft: '10px',
            backgroundColor: colors.primary,
            color: colors.tertiary,
            width: '200px',
            height: '100%',
            borderRight: border,
            fontStyle: 'italic',
          }}
        />
        {React.cloneElement(icon, {
          style: { marginLeft: '10px', fontSize: '20px', color },
        })}
      </div>
    </div>
  );
}

Input.defaultProps = {
  label: null,
};

export default Input;
