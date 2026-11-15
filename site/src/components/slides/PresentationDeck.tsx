import { useEffect, useRef, useState } from 'react';
import { Deck, Slide } from '@revealjs/react';
import type { RevealApi } from 'reveal.js';
import type { DemoRecord, Presentation } from '../../lib/presentations';
import { siteUrl } from '../../lib/urls';
import SlideBody from './SlideBody';

const keyboardCondition = (event: KeyboardEvent) => event.key === 'Escape' || !(event.target instanceof Element
  && event.target.closest('button, a, input, select, textarea, [contenteditable="true"]'));

export default function PresentationDeck({ presentation, records }: { presentation: Presentation; records: DemoRecord[] }) {
  const [deck, setDeck] = useState<RevealApi | null>(null);
  const [view, setView] = useState<'slide' | 'scroll'>(presentation.view);
  const [narrow, setNarrow] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [canFullscreen, setCanFullscreen] = useState(false);
  const [fullscreenError, setFullscreenError] = useState('');
  const alignedInitialHash = useRef(false);
  useEffect(() => {
    if (!deck || alignedInitialHash.current) return;
    // The first mobile layout changes the scroll-page heights after hydration.
    // Apply a named deep link after that layout so it lands on the chosen slide.
    const frame = requestAnimationFrame(() => {
      const id = window.location.hash.slice(2);
      const index = presentation.slides.findIndex((slide) => slide.id === id);
      if (index >= 0 && deck.getConfig().view === 'scroll') {
        deck.getRevealElement()?.querySelector<HTMLElement>(`section#${presentation.slides[index].id}`)
          ?.scrollIntoView({ block: 'start', behavior: 'instant' });
      }
      alignedInitialHash.current = true;
    });
    return () => cancelAnimationFrame(frame);
  }, [deck, narrow, presentation.slides]);
  useEffect(() => {
    const mobile = matchMedia('(max-width: 600px)');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => { setNarrow(mobile.matches); setReducedMotion(reduced.matches); };
    const updateFullscreen = () => setFullscreen(Boolean(document.fullscreenElement));
    update();
    setCanFullscreen(document.fullscreenEnabled);
    mobile.addEventListener('change', update);
    reduced.addEventListener('change', update);
    document.addEventListener('fullscreenchange', updateFullscreen);
    return () => {
      mobile.removeEventListener('change', update);
      reduced.removeEventListener('change', update);
      document.removeEventListener('fullscreenchange', updateFullscreen);
    };
  }, []);
  function ready(api: RevealApi) {
    setDeck(api);
    setView(api.getConfig().view === 'scroll' ? 'scroll' : 'slide');
  }
  function changeView() {
    if (!deck) return;
    const nextView = view === 'scroll' ? 'slide' : 'scroll';
    const url = new URL(window.location.href);
    url.searchParams.set('view', nextView);
    const currentId = deck.getCurrentSlide()?.id;
    if (currentId) url.hash = `/${currentId}`;
    // Scroll deactivation restores innerHTML in reveal.js 6.0.2. Navigate to
    // the selected mode so React owns fresh nodes and all event handlers work.
    window.location.assign(url.href);
  }
  async function toggleFullscreen() {
    try {
      setFullscreenError('');
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch { setFullscreenError('Fullscreen is unavailable in this browser window.'); }
  }
  const notesUrl = siteUrl(`presentations/${presentation.slug}/notes/`);
  return <>
    <nav className="presentation-toolbar" aria-label="Presentation tools">
      <a href={siteUrl('presentations/')}>← Presentations</a>
      <div>
        <a href={notesUrl}>Notes</a>
        <button type="button" disabled={!deck} onClick={changeView} aria-label={view === 'scroll' ? 'Switch to slide view' : 'Switch to scroll view'}>{view === 'scroll' ? 'Slide view' : 'Scroll view'}</button>
        <button type="button" disabled={!deck || view === 'scroll'} onClick={() => deck?.toggleOverview()} aria-label="Slide overview">Overview</button>
        <button type="button" disabled={!deck || !canFullscreen} onClick={toggleFullscreen} aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}>Fullscreen</button>
      </div>
    </nav>
    {fullscreenError && <p className="presentation-fallback" role="status">{fullscreenError}</p>}
    <main aria-label={presentation.title}>
      <Deck onReady={ready} config={{
        width: narrow ? 720 : 1280, height: narrow ? 1400 : 720, margin: 0.04,
        view: view === 'scroll' ? 'scroll' : null, scrollProgress: true, scrollSnap: 'proximity', scrollActivationWidth: 0,
        controls: true, progress: true, slideNumber: 'c/t', hash: true, hashOneBasedIndex: true,
        overview: true, keyboard: true, keyboardCondition, touch: true,
        center: false, transition: reducedMotion ? 'none' : 'fade', transitionSpeed: 'fast',
      }}>
        {presentation.slides.map((slide) => <Slide key={slide.id} id={slide.id} className={`slide-${slide.type} course-slide`} aria-label={slide.title}>
          <SlideBody slide={slide} records={records} />
          <footer className="slide-sources"><span>Source</span>{slide.references.map((source) => <a key={source.url} href={source.url} title={source.title}>Chapter {source.number}</a>)}</footer>
          {slide.notes && <aside className="notes">{slide.notes}</aside>}
        </Slide>)}
      </Deck>
    </main>
  </>;
}
