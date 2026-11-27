import links from '@/content/map-links.json';
import KulmanImage from './KulmanImage';
import Photo from './Photo';

export default function ObjectMap({object}: {object: 'siluet' | 'kulman'}) {
  const isSiluet = object === 'siluet';
  const address = isSiluet ? 'Веры Хоружей, 1А' : 'Кульман, 1к4';
  const point = isSiluet ? '27.579717,53.916387' : '27.581567,53.916785';

  return (
    <section className="section object-yandex-map" id="map" aria-labelledby="map-address">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Расположение</span>
          <h2 id="map-address">{address}</h2>
        </div>
        <a href={links[object]} target="_blank" rel="noreferrer" className="text-button">
          Открыть объект в Яндекс Картах ↗
        </a>
      </div>
      <div className="object-location-grid">
        <figure>
          {isSiluet ? <Photo kind="facade"/> : <KulmanImage/>}
          <figcaption>{isSiluet
            ? 'Фасад ТЦ «Силуэт» · визуализация'
            : 'Корпус 1к4 выделен схематично · визуализация по картографическим референсам'}
          </figcaption>
        </figure>
        <figure>
          <iframe title={address + ' на Яндекс Картах'}
            src={`https://yandex.by/map-widget/v1/?ll=${point}&z=17&pt=${point},pm2rdm`}
            width="100%" height="440" loading="lazy"
            referrerPolicy="no-referrer-when-downgrade" allowFullScreen/>
          <figcaption>Карточка объекта и построение маршрута доступны по ссылке выше</figcaption>
        </figure>
      </div>
    </section>
  );
}
