import Link from 'next/link';
import Inquiry from '@/components/Inquiry';
import {properties} from '@/lib/content';
import mapLinks from '@/content/map-links.json';
import {metadata} from '@/lib/seo';

export const generateMetadata = () => metadata(
  'Контакты и просмотр объектов',
  'Адреса ТЦ «Силуэт» и корпуса на Кульман, 1к4 в Минске, карты и форма записи на просмотр.',
  '/kontakty/'
);

export default function Page() {
  return (
    <section className="contacts-page listing-paper" aria-labelledby="contact-title">
      <nav className="object-crumbs" aria-label="Хлебные крошки">
        <Link href="/">Главная</Link><span aria-hidden="true">/</span><span>Контакты</span>
      </nav>
      <h1 id="contact-title">Контакты</h1>
      <p className="contact-intro">Адреса объектов в Минске. Вход и место встречи уточняются перед просмотром.</p>
      <div className="contact-addresses">
        {properties.map(property => {
          const id = property.id;
          if (id !== 'siluet' && id !== 'kulman') return null;
          return (
            <article key={id} aria-labelledby={'contact-' + id}>
              <h2 id={'contact-' + id}>{property.name}</h2>
              <address>Минск, {property.address}</address>
              <a className="listing-link" href={mapLinks[id]} target="_blank" rel="noreferrer"
                aria-label={'Открыть в Яндекс Картах: ' + property.address}>Открыть в Яндекс Картах ↗</a>
              <div><Inquiry object={id} purpose="viewing" label="Записаться на просмотр" className="listing-primary"/></div>
            </article>
          );
        })}
      </div>
      <div className="contact-followup">
        <p>Приём заявок пока не подключён.</p>
        <Inquiry label="Запросить условия" className="listing-link"/>
      </div>
    </section>
  );
}
