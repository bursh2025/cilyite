'use client';
import { withBasePath } from '../lib/site-path';

import {useRef, useState} from 'react';
import Inquiry from './Inquiry';

import PropertyCarousel from './PropertyCarousel';
import {officePhotos} from '@/lib/property-slides';

const model = withBasePath('/media/concepts/office-3d-cutaway-v4-1536.webp');
const plan = withBasePath('/media/siluet/siluet-floor-03-office-plan.png');
const modes = [['3d', '3D-вид'], ['plan', 'Схема']] as const;

export default function OfficeExplorer({home = false}: {home?: boolean}) {
  const preview = useRef<HTMLDialogElement>(null);
  const [mode, setMode] = useState<'3d' | 'plan'>('3d');
  const isModel = mode === '3d';
  const tabs = (
    <div className="explorer-tabs" role="group" aria-label="Вид офиса">
      {modes.map(([id, label]) => <button key={id} aria-pressed={mode === id} onClick={() => setMode(id)}>{label}</button>)}
    </div>
  );

  return (
    <section className={home ? 'listing-paper listing-office' : 'section office-explorer'} id="plan">
      <div className="section-heading">
        <div>
          {!home && <span className="eyebrow">Офис в ТЦ «Силуэт»</span>}
          <h2>{home ? 'Офис в ТЦ «Силуэт»' : 'План и фотографии'}</h2>
        </div>
        {!home && tabs}
      </div>
      <div className="explorer-grid">
        <div className={'explorer-drawing ' + mode}>
          {home && tabs}
          <img src={isModel ? model : plan} width="1536" height="1024" loading="lazy"
            alt={isModel ? 'Пустой объём офиса без мебели, вид сверху' : 'Исходный план этажа. Привязка к офису уточняется'} />
          {isModel && <button className="explorer-enlarge" onClick={() => preview.current?.showModal()}>Увеличить ↗</button>}
          <span className="explorer-note">{isModel ? 'Объём помещения · 3D-визуализация' : 'Исходный план этажа · привязка к офису уточняется'}</span>
        </div>
        <div className="office-photo-gallery">
          <PropertyCarousel slides={officePhotos} title="Фотографии офиса в ТЦ «Силуэт»"/>
          {home && <Inquiry object="siluet" format="office" purpose="viewing" label="Записаться на просмотр" className="listing-link" />}
        </div>
      </div>
      <div className="explorer-bottom">
        <p>3D-вид показывает объём помещения без мебели. Геометрия условная. Текущее состояние — на фотографиях.</p>
        <a href={plan} target="_blank" rel="noreferrer">Открыть исходный план ↗</a>
        {!home && <Inquiry object="siluet" format="office" purpose="viewing" label="Посмотреть офис" className="text-button" />}
      </div>
      <dialog ref={preview} className="gallery-dialog office-3d-dialog" aria-label="Увеличенный 3D-вид офиса"
        onClick={e => {if (e.target === preview.current) preview.current.close()}}>
        <button className="dialog-close" onClick={() => preview.current?.close()} aria-label="Закрыть 3D-вид">×</button>
        <img src={model} width="1536" height="1024" alt="Пустой объём офисного помещения, вид сверху" />
        <p>Объём помещения · 3D-визуализация</p>
      </dialog>
    </section>
  );
}
