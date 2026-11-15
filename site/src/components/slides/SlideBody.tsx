import type { DemoRecord, Slide } from '../../lib/presentations';
import { siteUrl } from '../../lib/urls';
import SourceSelection from './SourceSelection';
import RelationshipDiagram from './RelationshipDiagram';

export default function SlideBody({ slide, records }: { slide: Slide; records: DemoRecord[] }) {
  if (slide.type === 'title') return <div className="slide-body title-slide">
    {slide.context && <p className="slide-context">{slide.context}</p>}
    <h1>{slide.title}</h1><p className="slide-subtitle">{slide.subtitle}</p>
  </div>;
  if (slide.type === 'comparison') return <div className="slide-body">
    <h2>{slide.title}</h2><div className="comparison-columns">
      {[slide.left, slide.right].map((column) => <div className="comparison-column" key={column.title}>
        <h3>{column.title}</h3><ul>{column.items.map((item) => <li key={item}>{item}</li>)}</ul>
      </div>)}
    </div>
  </div>;
  if (slide.type === 'diagram') return <div className="slide-body">
    <h2>{slide.title}</h2><p className="slide-message">{slide.message}</p>
    <ol className="workflow-diagram">{slide.steps.map((step, index) => <li key={step.label}>
      <span className="step-number">{String(index + 1).padStart(2, '0')}</span>
      <h3>{step.label}</h3><p>{step.detail}</p>
      {index < slide.steps.length - 1 && <span className="step-arrow" aria-hidden="true">→</span>}
    </li>)}</ol>
    {slide.outputs && <div className="diagram-outputs"><span aria-hidden="true">↓</span>
      <ul>{slide.outputs.map((output) => <li key={output}>{output}</li>)}</ul>
    </div>}
    {slide.caption && <p className="diagram-caption">{slide.caption}</p>}
  </div>;
  return <div className={`slide-body${slide.image ? ' with-image' : ''}${slide.image?.interactive ? ' with-relationships' : ''}${slide.demo ? ' with-demo' : ''}`}>
    <h2>{slide.title}</h2><div className="content-body"><div>
      <p className="slide-message">{slide.message}</p>
      {slide.bullets.length > 0 && <ul>{slide.bullets.map((item) => <li key={item}>{item}</li>)}</ul>}
    </div>
      {slide.image && <figure>{slide.image.interactive === 'relationships'
        ? <RelationshipDiagram />
        : <img src={siteUrl(`files/${slide.image.path}`)} alt={slide.image.alt} />}
        {slide.image.caption && <figcaption>{slide.image.caption}</figcaption>}
      </figure>}
    </div>
    {slide.demo === 'source-selection' && <SourceSelection records={records} />}
  </div>;
}
