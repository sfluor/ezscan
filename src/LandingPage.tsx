import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as Scanner } from '@material-design-icons/svg/round/document_scanner.svg';
import colors from './colors';
import routes from './routes';
import Button from './Button';

function LandingPage() {
  const entries = [
    <span>💶 Free: scanning documents is free !</span>,
    <span>📰 No Ads: Easy Scan does not contain any advertisements.</span>,
    <span>🔥 Fast: takes seconds to scan and save documents as PDFs.</span>,
    <span>
      🔒 Privacy friendly: everything stays on your device, nothing is uploaded
      to a server.
    </span>,
    <span>
      🪶 Lightweight: available via your browser directly, no app download
      required.
    </span>,
    <span>
      💻 Auditable: the{' '}
      <a
        href="https://github.com/sfluor/ezscan"
        target="_blank"
        rel="noreferrer"
      >
        project is open source
      </a>{' '}
      so you can check what is really executed on your device.
    </span>,
  ];

  const navigate = useNavigate();

  return (
    <div
      style={{
        color: colors.tertiary,
        padding: '5% 10%',
        overflowY: 'scroll',
        animationName: 'fadeIn',
        animationDuration: '1s',
      }}
    >
      <h1>Welcome on Easy Scan !</h1>
      <span>
        Easy Scan is a tool to scan and edit multiple images and save them as a
        PDF files.
      </span>
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
          name="Start scanning !"
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
          More infos on the tool:
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
    </div>
  );
}

export default LandingPage;
