import Inquiry from './Inquiry';
import EditorialImage from './EditorialImage';

export default function Hero() {
  return (
    <section className="listing-hero listing-paper collage-hero" aria-labelledby="listing-title">
      <div className="listing-intro">
          <p className="listing-kicker">Минск · Покупка и аренда</p>
          <h1 id="listing-title">Коммерческая недвижимость в центре Минска</h1>
          <p className="listing-lead">Торговые помещения и офис в ТЦ «Силуэт», административный корпус на Кульман, 1к4.</p>
          <div className="listing-actions">
            <a className="listing-primary" href="#choose">Выбрать помещение</a>
            <Inquiry label="Записаться на просмотр" purpose="viewing" className="listing-link" />
          </div>
      </div>
      <div className="hero-collage">
        <EditorialImage name="building-collage" sizes="(max-width:760px) 100vw, 55vw" priority
          alt="Коллаж ТЦ «Силуэт» и корпуса на Кульман на фоне вида квартала сверху" />
      </div>
    </section>
  );
}
