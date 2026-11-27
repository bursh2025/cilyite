'use client';

import {useEffect, useRef, useState} from 'react';
import Link from 'next/link';
import {useReducedMotion} from 'motion/react';
import {districtRoofs, districtViewBox} from '@/lib/district-geometry';
import mapLinks from '@/content/map-links.json';
import context from '@/content/neighborhood.json';

const objects = [
  {id: 'siluet', name: 'ТЦ «Силуэт»', address: 'Веры Хоружей, 1А', href: '/obekty/siluet/', number: '01', x: 525, y: 745},
  {id: 'kulman', name: 'Административный корпус', address: 'Кульман, 1к4', href: '/obekty/kulman-1-4/', number: '02', x: 703, y: 654},
] as const;

export default function DistrictMap() {
  const [current, setCurrent] = useState<(typeof objects)[number]>(objects[0]);
  const viewport = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const el = viewport.current;
    if (!el) return;
    function center(behavior: ScrollBehavior) {
      if (el) el.scrollTo({left: el.scrollWidth * current.x / 1588 - el.clientWidth / 2, behavior});
    }
    center(reduced ? 'instant' : 'smooth');
    const observer = new ResizeObserver(() => center('instant'));
    observer.observe(el);
    return () => observer.disconnect();
  }, [current, reduced]);

  return (
    <section className="listing-paper listing-district" id="location" aria-labelledby="location-heading">
      <h2 id="location-heading">Расположение объектов</h2>
      <div className="location-layout">
        <div className="location-options" role="group" aria-label="Выбрать объект на схеме">
          {objects.map(o => (
            <button key={o.id} aria-pressed={current === o} onClick={() => setCurrent(o)}>
              <span>{o.number}</span><span>{o.name}<small>{o.address}</small></span>
            </button>
          ))}
        </div>
        <div className="location-map" ref={viewport} tabIndex={0} role="region" aria-label="Схема района, доступна горизонтальная прокрутка">
          <div className="district-canvas">
            <img src="/media/district/district-aerial-v1-1588.webp"
              srcSet="/media/district/district-aerial-v1-800.webp 800w, /media/district/district-aerial-v1-1200.webp 1200w, /media/district/district-aerial-v1-1588.webp 1588w"
              sizes="(max-width:760px) 660px, 67vw" width="1588" height="990" loading="lazy"
              alt="Квартал у Комаровского рынка, улиц Веры Хоружей и Кульман" />
            <svg className="district-buildings" viewBox={districtViewBox} aria-label="Здания на схеме">
              {objects.map(o => (
                <a key={o.id} href={o.href} onMouseEnter={() => setCurrent(o)} onFocus={() => setCurrent(o)}
                  aria-label={'Открыть объект: ' + o.name + ', ' + o.address}
                  className={'district-building' + (current === o ? ' active' : '')}>
                  <polygon points={districtRoofs[o.id]} />
                </a>
              ))}
            </svg>
            {objects.map(o => (
              <Link key={o.id} href={o.href} className="location-pin" data-active={current === o}
                style={{left: o.x / 1588 * 100 + '%', top: o.y / 990 * 100 + '%'}}
                onMouseEnter={() => setCurrent(o)} onFocus={() => setCurrent(o)} aria-label={o.number + ' · ' + o.name}>
                {o.number}
              </Link>
            ))}
            <a className="location-landmark market-landmark" href={context.sources.market.url} target="_blank" rel="noreferrer">Комаровский рынок ↗</a>
            <span className="location-landmark impulse-landmark">Импульс</span>
            <a className="location-landmark metro-landmark" href={context.sources.metro.url} target="_blank" rel="noreferrer">Ⓜ Площадь Якуба Коласа ↗</a>
          </div>
        </div>
        <div className="location-links" aria-live="polite">
          <Link href={current.href} className="listing-link">Фото и характеристики ↗</Link>
          <a href={mapLinks[current.id]} className="listing-link" target="_blank" rel="noreferrer">Открыть в Яндекс Картах ↗</a>
          <p>Схема района · контуры и метки условны</p>
        </div>
      </div>
    </section>
  );
}
