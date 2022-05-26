import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as Scanner } from '@material-design-icons/svg/round/document_scanner.svg';
import colors from './colors';
import routes from './routes';
import {
  typography as typo,
  Language,
  languages,
  changeLanguage,
} from './language';
import Button from './Button';

function LanguagePicker({
  language,
  index,
}: {
  language: Language;
  index: number;
}) {
  const [hovered, setHovered] = useState<boolean>(false);

  const onHover = (event: React.SyntheticEvent) => {
    event.preventDefault();
    setHovered(true);
  };

  const onHoverEnd = (event: React.SyntheticEvent) => {
    event.preventDefault();
    setHovered(false);
  };

  const onClick = () => changeLanguage(language);

  return (
    <span
      role="button"
      tabIndex={index}
      // Hover events
      onMouseEnter={onHover}
      onMouseLeave={onHoverEnd}
      onFocus={onHover}
      onClick={onClick}
      onKeyDown={onClick}
      style={{
        cursor: 'pointer',
        margin: '5px',
        color: hovered ? colors.secondary : colors.tertiary,
      }}
    >
      {language.name} {language.flag}
    </span>
  );
}

function LanguagePickers() {
  return (
    <div
      style={{
        marginTop: 'auto',
        display: 'flex',
        justifyContent: 'right',
        alignItems: 'center',
        animationName: 'slideDown',
        animationDuration: '1s',
      }}
    >
      {languages.map((language, idx, arr) => (
        <React.Fragment key={language.key}>
          <LanguagePicker language={language} index={idx} />
          {idx < arr.length - 1 && <span>/</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

function LandingPage() {
  const entries = [
    <span>{typo.infos.free}</span>,
    <span>{typo.infos.noAds}</span>,
    <span>{typo.infos.fast}</span>,
    <span>{typo.infos.privacy}</span>,
    <span>{typo.infos.lightweight}</span>,
    <span>
      {typo.infos.auditable.header}{' '}
      <a
        href="https://github.com/sfluor/ezscan"
        target="_blank"
        style={{ color: colors.secondary }}
        rel="noreferrer"
      >
        {typo.infos.auditable.openSource}
      </a>{' '}
      {typo.infos.auditable.end}
    </span>,
  ];

  const navigate = useNavigate();

  return (
    <div
      style={{
        color: colors.tertiary,
        height: '100%',
        padding: '5% 10%',
        overflowY: 'scroll',
        display: 'flex',
        flexDirection: 'column',
        animationName: 'fadeIn',
        animationDuration: '1s',
      }}
    >
      <h1>{typo.welcome}</h1>
      <span>{typo.shortDescription}</span>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          margin: '20px',
        }}
      >
        <Button
          action={() => navigate(routes.editor)}
          name={typo.startScanning}
          style={{
            maxWidth: '250px',
            fontSize: '20px',
            padding: '20px',
          }}
          horizontal
          filled
          icon={<Scanner />}
        />
        <span style={{ marginRight: 'auto', marginTop: '20px' }}>
          {`${typo.moreInfos}:`}
        </span>
        <ul>
          {entries.map((entry, index) => (
            <li
              // This is a static list so it's ok to use the index as the key
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              style={{
                marginBottom: '15px',
                animationName: 'fadeIn,slideLeft',
                animationDuration: `${1000 + 250 * index}ms`,
              }}
            >
              {entry}
            </li>
          ))}
        </ul>
      </div>
      <LanguagePickers />
    </div>
  );
}

export default LandingPage;
