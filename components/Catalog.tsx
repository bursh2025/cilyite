'use client';

import {Suspense} from 'react';
import {useSearchParams} from 'next/navigation';
import Link from 'next/link';
import {track} from '@/lib/analytics';
import {properties} from '@/lib/content';
import Photo from './Photo';
import EditorialImage from './EditorialImage';
import KulmanImage from './KulmanImage';

const sections = [
  {id: 'all', label: 'Все предложения', href: '/pomeshcheniya/'},
  {id: 'sale', label: 'Покупка', href: '/prodazha/'},
  {id: 'rent', label: 'Аренда', href: '/arenda/'},
] as const;

type Deal = (typeof sections)[number]['id'];

function selectFormat(format: string) {
  const url = new URL(window.location.href);
  if (format === 'all') url.searchParams.delete('format');
  else url.searchParams.set('format', format);
  window.history.replaceState(null, '', url);
  track('filter_change');
}

export default function Catalog({initial = 'all'}: {initial?: Deal}) {
  return (
    <Suspense fallback={<CatalogView initial={initial} format="all"/>}>
      <FilteredCatalog initial={initial}/>
    </Suspense>
  );
}

function FilteredCatalog({initial}: {initial: Deal}) {
  const requested = useSearchParams().get('format') ?? 'all';
  const format = properties.some(p => p.formats.includes(requested)) ? requested : 'all';
  return <CatalogView initial={initial} format={format}/>;
}

function CatalogView({initial, format}: {initial: Deal; format: string}) {
  const section = sections.find(item => item.id === initial)!;
  const filtered = properties.filter(p => format === 'all' || p.formats.includes(format));

  return (
    <section className="offers-page listing-paper" aria-labelledby="offers-heading">
      <nav className="object-crumbs" aria-label="Хлебные крошки">
        <Link href="/">Главная</Link><span aria-hidden="true">/</span><span>{section.label}</span>
      </nav>
      <div className={initial === 'all' ? 'catalog-cover' : undefined}>
        <div>
          <h1 id="offers-heading">{section.label}</h1>
          <p className="offers-lead">{initial === 'sale' ? 'Торговые помещения, офис и отдельный корпус для покупки в центре Минска.' :
            initial === 'rent' ? 'Торговые помещения, офис и отдельный корпус для аренды в центре Минска.' :
            'Торговые помещения, офис и отдельный корпус в центре Минска.'}</p>
        </div>
        {initial === 'all' && (
          <figure>
            <EditorialImage name="building-collage" sizes="(max-width: 760px) 90vw, 48vw" priority
              alt="Архитектурный коллаж: стеклянный фасад ТЦ «Силуэт» и светлый корпус на Кульман на фоне квартала" />
          </figure>
        )}
      </div>
      <div className="catalog-toolbar">
        <nav className="offers-tabs" aria-label="Тип сделки">
          {sections.map(item => <Link key={item.id} href={format === 'all' ? item.href : item.href + '?format=' + format} aria-current={initial === item.id ? 'page' : undefined}
            onClick={() => track('deal_change', {dealType: item.id})}>{item.label}</Link>)}
        </nav>
        <label className="type-filter">Тип помещения
          <select value={format} onChange={e => selectFormat(e.target.value)}>
            <option value="all">Все форматы</option><option value="retail">Торговые</option>
            <option value="office">Офис</option><option value="building">Здание целиком</option>
          </select>
        </label>
      </div>
      <div className="catalog-count">
        <span aria-live="polite">{filtered.length} {filtered.length === 1 ? 'объект' : 'объекта'}</span>
        {format !== 'all' && <button onClick={() => selectFormat('all')}>Сбросить фильтр</button>}
      </div>
      <div className="property-grid">
        {filtered.map(p => {
          const siluet = p.id === 'siluet';
          const office = siluet && format === 'office';
          const anchor = office ? '#office' : siluet && format === 'retail' ? '#retail' : '';
          return (
            <Link className="property-card" key={p.id} href={'/obekty/' + p.slug + '/' + anchor}>
              <figure>
                <div className="card-visual">{siluet ? <Photo kind={office ? 'office' : 'facade'}/> : <KulmanImage facade/>}</div>
                <figcaption>{office ? 'Фото офиса' : siluet ? 'Визуализация фасада' : 'Фасад корпуса · обработанное фото'}</figcaption>
              </figure>
              <div className="card-title">
                <div><p>{p.address}</p><h2>{p.name}</h2></div><span className="circle-arrow" aria-hidden="true">↗</span>
              </div>
              <p className="offers-facts">{siluet ? office ? 'Офис Open Space' : 'Торговые помещения ' + p.area + ' м²' + (format === 'all' ? ' · офис Open Space' : '') :
                p.area + ' м² · 5 этажей'}</p>
            </Link>
          );
        })}
      </div>
      <p className="catalog-note">Доступность и условия — по запросу</p>
    </section>
  );
}
