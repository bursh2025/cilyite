import EditorialImage from '@/components/EditorialImage';
import StructuredData from '@/components/StructuredData';
import Hero from '@/components/Hero';
import QuickMatch from '@/components/QuickMatch';
import DistrictMap from '@/components/DistrictMap';
import AreaInsights from '@/components/AreaInsights';
import {metadata} from '@/lib/seo';
export const generateMetadata=()=>metadata('Коммерческая недвижимость в центре Минска','Торговые помещения и офис в ТЦ Силуэт, административный корпус на Кульман, 1к4. Фото, площади, окружение и условия покупки или аренды.');
export default function Home(){return <><StructuredData name="Коммерческая недвижимость в центре Минска" path="/"/><Hero/><QuickMatch/><DistrictMap/>
  <figure className="office-scroll">
    <div className="office-scroll-window">
      <EditorialImage name="office-panorama" sizes="(max-aspect-ratio: 3/1) 300vh, 100vw" alt="Солнечный свет в офисе ТЦ «Силуэт»" />
    </div>
    <figcaption>Офис в ТЦ «Силуэт» · Визуализация</figcaption>
  </figure>
  <AreaInsights/></>}
