'use client';
import {useState} from 'react';
import Link from 'next/link';
import Inquiry from './Inquiry';
import FeatureIcon, {type IconName} from './FeatureIcon';
import PropertyCarousel from './PropertyCarousel';

import {propertySlides, type Slide} from '@/lib/property-slides';
type Choice = {
  id: string; label: string; icon: IconName; title: string; address: string;
  facts: [string,string][]; slides: Slide[]; href: string;
};
const choices: Choice[] = [
  {
    id: 'siluet', label: 'Силуэт', icon: 'shop', title: 'ТЦ «Силуэт»',
    address: 'Веры Хоружей, 1А', href: '/obekty/siluet/',
    facts: [
      ['4,4–90,2 м²', 'Площадь торговых помещений'],
      ['1-й и 2-й этажи', 'Расположение торговых помещений'],
      ['Офис Open Space', 'Площадь офиса и условия — по запросу'],
    ],
    slides: propertySlides.siluet,
  },
  {
    id: 'kulman', label: 'Кульман 1,к4', icon: 'building', title: 'Административный корпус',
    address: 'Кульман, 1к4', href: '/obekty/kulman-1-4/',
    facts: [['6 204,6 м²','Общая площадь корпуса'],['5 этажей','Этажность'],['3–4 м','Высота потолков']],
    slides: propertySlides.kulman,
  },
];
export default function QuickMatch() {
  const [selected, setSelected] = useState('siluet');
  const choice = choices.find(item => item.id === selected)!;
  return (
    <section className="listing-picker listing-paper" id="choose" aria-labelledby="choose-title">
      <h2 id="choose-title">Выберите помещение</h2>
      <div className="listing-tabs" role="group" aria-label="Выбор объекта">
        {choices.map(item => (
          <button key={item.id} aria-pressed={selected === item.id} onClick={() => setSelected(item.id)}>
            <FeatureIcon name={item.icon}/>{item.label}
          </button>
        ))}
      </div>
      <div className="listing-result">
        <PropertyCarousel key={choice.id} slides={choice.slides} title={choice.title + ' — фотографии'} />
        <div className="listing-details">
          <h3>{choice.title}</h3>
          <p className="listing-address">{choice.address}</p>
          <dl className="listing-specs">
            {choice.facts.map(([value, label]) => (
              <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
            ))}
          </dl>
          <div className="listing-actions">
            <Link className="listing-primary object-entry" href={choice.href}>
              {choice.id === 'siluet' ? 'Посмотреть «Силуэт»' : 'Посмотреть корпус на Кульман'} <span aria-hidden="true">→</span>
            </Link>
            <Inquiry key={choice.id} object={choice.id} className="listing-link" />
          </div>
        </div>
      </div>
      <nav className="listing-resources" aria-label="Дополнительные материалы">
        <Link href={choice.href + '#save-object'}>Сохранить карточку</Link>
        <Link href="/prodazha/">Покупка</Link>
        <Link href="/arenda/">Аренда</Link>
        <Link href="/pomeshcheniya/">Все предложения ↗</Link>
      </nav>
    </section>
  );
}
