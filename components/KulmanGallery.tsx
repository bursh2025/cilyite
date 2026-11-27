import PropertyCarousel from './PropertyCarousel';
import {facadePhotos} from '@/lib/property-slides';

export default function KulmanGallery() {
  return <section className="listing-paper kulman-photo-gallery" id="photos">
    <div className="section-heading"><h2>Фото фасада</h2></div>
    <PropertyCarousel slides={facadePhotos} title="Фото фасада корпуса на Кульман"/>
  </section>;
}
