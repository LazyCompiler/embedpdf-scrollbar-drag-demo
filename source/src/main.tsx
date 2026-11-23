import { localEngine } from '@embedpdf/engine';
import { RenderLayer, renderPlugin } from '@embedpdf/react/render';
import { DocumentGate, Viewer } from '@embedpdf/react/runtime';
import { Scrollbar, Stage, stagePlugin, useScrollMetrics, ZoomMode } from '@embedpdf/react/stage';
import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';

import './styles.css';

const PLUGINS = [stagePlugin({ zoom: { mode: ZoomMode.FitWidth } }), renderPlugin()];
const INITIAL_DOCUMENTS = [
  { source: { kind: 'url' as const, url: `${import.meta.env.BASE_URL}sample.pdf` } },
];

function createEngine() {
  return localEngine();
}

function renderPage() {
  return <RenderLayer />;
}

/**
 * The view's scroll position, and whether it last moved up or down. While the thumb is dragged
 * down, the view should only ever move down.
 */
function ScrollReadout() {
  const { scrollTop, scrollHeight, clientHeight } = useScrollMetrics();
  const previous = useRef(scrollTop);
  const [direction, setDirection] = useState<'down' | 'up' | 'still'>('still');

  useEffect(() => {
    if (scrollTop !== previous.current) {
      setDirection(scrollTop > previous.current ? 'down' : 'up');
      previous.current = scrollTop;
    }
  }, [scrollTop]);

  return (
    <output className="readout" data-direction={direction}>
      scrollTop <strong>{Math.round(scrollTop)}</strong> of{' '}
      {Math.max(0, Math.round(scrollHeight - clientHeight))} px, last moved{' '}
      <strong>{direction}</strong>
    </output>
  );
}

/** The same page is built twice: on the published packages, and on the packages built from the fix. */
const IS_FIXED = import.meta.env.VITE_DEMO_VARIANT === 'fixed';
const PULL_REQUEST_URL = 'https://github.com/embedpdf/embed-pdf-viewer/pull/1137';

const COPY = IS_FIXED
  ? {
      title: 'EmbedPDF with the fix: a Scrollbar thumb drag only scrolls',
      outcome: (
        <>
          The thumb stops at the end of its track and the page stays at the end of the document. The
          readout below never turns red.
        </>
      ),
      packages: (
        <>
          <code>@embedpdf/react</code> and <code>@embedpdf/web</code> built from{' '}
          <a href={PULL_REQUEST_URL}>the pull request</a>, with <code>@embedpdf/engine</code> and
          the plugins at 3.3.0 from npm. Source in <code>source-fixed/</code> of this repository.
        </>
      ),
      otherHref: '../',
      otherLabel: 'See the bug on the published 3.3.0',
    }
  : {
      title: 'EmbedPDF 3.3.0: a Scrollbar thumb drag also pans the Stage',
      outcome: (
        <>
          Once the thumb stops at the end of its track, the page scrolls <em>back up</em>, following
          the pointer. The readout below turns red.
        </>
      ),
      packages: (
        <>
          <code>@embedpdf/react</code> and <code>@embedpdf/engine</code> 3.3.0 from npm, with only
          the stage and render plugins. Source in <code>source/</code> of this repository.
        </>
      ),
      otherHref: './fixed/',
      otherLabel: 'See the same page with the fix',
    };

document.title = COPY.title;

function App() {
  return (
    <main>
      <h1>{COPY.title}</h1>
      <p className="variant">
        <a href={COPY.otherHref}>{COPY.otherLabel} →</a>
      </p>
      <ol>
        <li>Press the scrollbar thumb on the right edge of the viewer.</li>
        <li>Drag it down, past the bottom of the viewer, and keep going.</li>
        <li>{COPY.outcome}</li>
      </ol>
      <Viewer engine={createEngine} plugins={PLUGINS} initialDocuments={INITIAL_DOCUMENTS}>
        <DocumentGate fallback={<p className="loading">Opening the document…</p>}>
          <ScrollReadout />
          <Stage
            className="stage"
            overlay={<Scrollbar axis="y" autoHide={false} thumbClassName="thumb" />}
          >
            {renderPage}
          </Stage>
        </DocumentGate>
      </Viewer>
      <p className="note">{COPY.packages}</p>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
