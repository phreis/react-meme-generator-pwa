// /** @jsxImportSource @emotion/react */
// import { css } from '@emotion/react';
import { saveAs } from 'file-saver';
import { useState } from 'react';

const _historyEntries = [
  {
    id: 1,
    memeTopText: 'memes',
    memeBottomText: 'memes_everywhere',
    memeTemplate: 'buzz',
    memeURL: 'https://api.memegen.link/images/buzz/memes/memes_everywhere.gif',
  },
  {
    id: 2,
    memeTopText: '_',
    memeBottomText: "it's_a_trap!",
    memeTemplate: 'ackbar',
    memeURL: "https://api.memegen.link/images/ackbar/_/it's_a_trap!.png",
  },
  {
    id: 3,
    memeTopText: "i_don't_know_what_this_meme_is_for",
    memeBottomText: "and_at_this_point_i'm_too_afraid_to_ask",
    memeTemplate: 'afraid',
    memeURL:
      "https://api.memegen.link/images/afraid/i_don't_know_what_this_meme_is_for/and_at_this_point_i'm_too_afraid_to_ask.png",
  },
];

function getMemeURL(meme) {
  let memeURL;
  let memeTemplate = meme.template;

  if (!meme.template) {
    memeTemplate = 'buzz';
  }
  memeURL = `https://api.memegen.link/images/${memeTemplate}`;
  if (meme.topText) {
    memeURL += `/${encodeURIComponent(meme.topText)}`;
  } else {
    memeURL += `/_`;
  }

  if (meme.bottomText) {
    memeURL += `/${encodeURIComponent(meme.bottomText)}`;
  }

  return `${memeURL}.png`;
}

function ControlPanel(props) {
  return (
    <div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <label htmlFor="topText">Top text</label>
        <input
          onInput={(event) => {
            props.setTopText(event.target.value);
          }}
          value={props.topText}
          id="topText"
        />
        <br />
        <label htmlFor="bottomText">Bottom text</label>
        <input
          onInput={(event) => {
            props.setBottomText(event.target.value);
          }}
          value={props.bottomText}
          id="bottomText"
        />
        <br />
        <label htmlFor="template">Meme template</label>
        <input
          onInput={(event) => {
            props.setTemplate(event.target.value);
          }}
          value={props.template}
          id="template"
        />

        <br />
        <br />
        <br />
        <br />
        <button
          data-test-id="generate-meme"
          onClick={() => props.generateMeme()}
        >
          Generate
        </button>
      </form>
      <br />
      <br />
      <br />
      <button onClick={() => props.downloadMeme()}>Download</button>
    </div>
  );
}

function Meme(props) {
  return <img data-test-id="meme-image" src={props.memeURL} alt="Meme" />;
}

function History(props) {
  return (
    <section>
      {props.historyEntries.map((entry) => {
        return (
          <div key={`history-id-${entry.id}`}>
            <div>
              {`id: ${entry.id} topText: ${entry.memeTopText} bottomText: ${entry.memeBottomText}
              memeTemplate: ${entry.memeTemplate}`}
            </div>
          </div>
        );
      })}
    </section>
  );
}

export default function App() {
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [template, setTemplate] = useState('');
  const [memeURL, setMemeURL] = useState(
    'https://api.memegen.link/images/buzz.png',
  );

  let historyEntries = [];
  const historyEntriesTmp = JSON.parse(localStorage.getItem('memeHistory'));
  if (historyEntriesTmp) historyEntries = historyEntriesTmp;

  function generateMeme() {
    setMemeURL(
      getMemeURL({
        template: template,
        topText: topText,
        bottomText: bottomText,
      }),
    );
    historyEntries.push({
      id: historyEntries.length + 1,
      memeTopText: topText,
      memeBottomText: bottomText,
      memeTemplate: template,
    });
    localStorage.setItem('memeHistory', JSON.stringify(historyEntries));
  }

  function downloadMeme() {
    saveAs(memeURL, `meme-${template}-${topText}-${bottomText}`);
  }

  return (
    <>
      <ControlPanel
        topText={topText}
        setTopText={setTopText}
        bottomText={bottomText}
        setBottomText={setBottomText}
        template={template}
        setTemplate={setTemplate}
        generateMeme={generateMeme}
        downloadMeme={downloadMeme}
      />
      <Meme memeURL={memeURL} />
      <History historyEntries={historyEntries} />
    </>
  );
}
