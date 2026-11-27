'use client';
import { withBasePath } from '../lib/site-path';

import {useState} from 'react';
import {properties} from '@/lib/content';
import mapLinks from '@/content/map-links.json';
import styles from './ObjectDossier.module.css';

const sections = [
  ['photo', 'Фото и карта'],
  ['facts', 'Характеристики'],
  ['questions', 'Вопросы к просмотру'],
] as const;

export default function ObjectDossier({object}: {object: string}) {
  const property = properties.find(item => item.id === object)!;
  const [included, setIncluded] = useState({photo: true, facts: true, questions: true});
  const [status, setStatus] = useState('');
  const path = withBasePath('/obekty/' + property.slug + '/');
  const kulman = object === 'kulman';

  async function share() {
    const url = new URL(path, location.origin).href;
    try {
      await navigator.clipboard.writeText(url);
      setStatus('Ссылка скопирована');
    } catch {
      setStatus(url);
    }
  }

  return (
    <section id="save-object" className={'dossier-section ' + styles.section} aria-labelledby="dossier-heading">
      <header className={styles.toolbar}>
        <h2 id="dossier-heading">Карточка объекта</h2>
        <div className={styles.actions}>
          <button type="button" onClick={share}>Скопировать ссылку</button>
          <button type="button" onClick={() => window.print()}>Сохранить PDF ↓</button>
        </div>
      </header>
      <article className={styles.card}>
        <header className={styles.identity}>
          <p>{property.name} · Минск</p>
          <h3>{property.address}</h3>
        </header>
        <div className={styles.body}>
          {included.photo && <figure className={styles.photo}>
            <img src={kulman ? withBasePath('/media/kulman/facade-2-960.webp') : withBasePath('/media/siluet/siluet-facade-ai-960.webp')}
              alt={'Фасад · ' + property.name} width="960" height="640" loading="lazy"/>
            <figcaption><span>{kulman ? 'Обработанное фото' : 'Визуализация фасада'}</span>
              <a href={mapLinks[kulman ? 'kulman' : 'siluet']}>На карте ↗</a></figcaption>
          </figure>}
          {(included.facts || included.questions) && <div className={styles.details}>
            {included.facts && <dl>{property.facts.filter(([label]) => label !== 'Адрес').map(([label,value]) =>
              <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>}
            {included.questions && <div><h4>Проверить на просмотре</h4><ul>
              <li>Планировка и доступ к помещению</li>
              <li>Инженерные условия и обслуживание</li>
              <li>Состав предложения и документы</li>
            </ul></div>}
          </div>}
        </div>
        <footer className={styles.printFooter}><a href={path}>Страница объекта</a> · Покупка и аренда по запросу</footer>
      </article>
      <fieldset className={styles.options}><legend>Включить в карточку</legend>
        {sections.map(([key,label]) => <label key={key}><input type="checkbox" checked={included[key]}
          onChange={() => setIncluded(prev => ({...prev, [key]: !prev[key]}))}/>{label}</label>)}
      </fieldset>
      <p className={styles.note} role="status">{status || 'Для PDF выберите «Сохранить как PDF» в окне печати.'}</p>
    </section>
  );
}

