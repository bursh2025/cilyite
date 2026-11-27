import { withBasePath } from './site-path';
export type Slide = {src: string; alt: string; caption: string; original?: string; aerial?: 'siluet'};

const siluetAerial:Slide={src:withBasePath('/media/district/district-aerial-v1-1200.webp'),alt:'Расположение ТЦ Силуэт на схематичном виде района сверху',caption:'Схема пеших маршрутов · расстояния ориентировочные',aerial:'siluet'};

export const officePhotos: Slide[] = [
  {src:withBasePath('/media/siluet/siluet-office-view-01-1280.webp'),alt:'Офис Open Space с лёгкими перегородками',caption:'Предоставленный снимок офиса'},
  {src:withBasePath('/media/siluet/siluet-office-view-02-1280.webp'),alt:'Офис Open Space со стороны окон',caption:'Предоставленный снимок офиса'},
];

export const facadePhotos: Slide[] = [
  {src:withBasePath('/media/kulman/facade-2-1536.webp'),original:withBasePath('/media/kulman/original-2.webp'),alt:'Фасад корпуса на Кульман 1к4',caption:'Обработанное фото'},
  {src:withBasePath('/media/kulman/facade-1-1536.webp'),original:withBasePath('/media/kulman/original-1.webp'),alt:'Вход и проезд корпуса Кульман 1к4',caption:'Обработанное фото'},
  {src:withBasePath('/media/kulman/facade-3-1536.webp'),original:withBasePath('/media/kulman/original-3.webp'),alt:'Двор перед корпусом Кульман 1к4',caption:'Обработанное фото'},
];

export const propertySlides: Record<'siluet' | 'kulman', Slide[]> = {
  siluet: [
      {src:withBasePath('/media/editorial/siluet-collage-v1-1200.webp'),alt:'Фасад и офис ТЦ «Силуэт» на фоне квартала',caption:'Коллаж · визуализация'},
      {src:withBasePath('/media/siluet/siluet-facade-ai-1280.webp'),alt:'Фасад ТЦ Силуэт',caption:'Визуализация фасада'},
      siluetAerial,
      ...officePhotos,
      {src:withBasePath('/media/concepts/office-3d-cutaway-v4-1536.webp'),alt:'Пустой офис, 3D-вид сверху',caption:'Объём помещения · 3D-визуализация'},
    ],
  kulman: [
      {src:withBasePath('/media/editorial/kulman-collage-v2-1200.webp'),alt:'Вид сверху с выделенным золотом корпусом и его фасад',caption:'Визуализация · контур условный'},
      {src:withBasePath('/media/hero/kulman-highlight-v4-1448.webp'),alt:'Вид сверху с условно выделенным корпусом Кульман 1к4',caption:'Визуализация · контур условный'},
      ...facadePhotos,
    ],
};
