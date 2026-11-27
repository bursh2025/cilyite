'use client';
import {useRef, useState} from 'react';
import {districtRoofs, districtViewBox} from '@/lib/district-geometry';
import './property-carousel.css';

import type {Slide} from '@/lib/property-slides';

const routes = [
  {name: 'Метро «Площадь Якуба Коласа»', distance: '120 м', color: '#0066bb', path: 'M572 697 L594 674 L602 674 L785 828', x:785, y:828},
  {name: 'Комаровский рынок', distance: '400 м', color: '#a23181', path: 'M572 697 L602 665 L571 637 L323 418 L145 250 L159 224', x:159, y:224},
];

function RouteOverlay() {
  return <svg className="carousel-footprint" viewBox={districtViewBox} aria-hidden="true">
    {routes.map((route, i) => <g key={route.name} strokeLinejoin="round" strokeLinecap="round">
      <path d={route.path} stroke="white" strokeWidth="14" fill="none"/>
      <path d={route.path} stroke={route.color} strokeWidth="8" fill="none" strokeDasharray={i ? '12 10' : undefined}/>
      <circle cx={route.x} cy={route.y} r="18" fill={route.color} stroke="white" strokeWidth="4"/>
      <text x={route.x} y={route.y+8} textAnchor="middle" fontSize="23" fontWeight="bold" fill="white">{i+1}</text>
    </g>)}
    <polygon points={districtRoofs.siluet} style={{fill:'#ffb600cf',stroke:'#352704',strokeWidth:10}}/>
    <polygon points={districtRoofs.siluet} style={{fill:'none',stroke:'#fff3a0',strokeWidth:5}}/>
  </svg>;
}

export default function PropertyCarousel({slides,title,priority=false}:{slides:Slide[];title:string;priority?:boolean}) {
  const [index,setIndex] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const drag = useRef<{id:number; x:number; moved:boolean} | null>(null);
  const suppressClick = useRef(false);
  const [offset,setOffset] = useState(0);
  const [original,setOriginal] = useState(false);
  const slide = slides[index];
  const move = (step:number) => setIndex(i => (i+step+slides.length)%slides.length);

  function frame(expanded = false) {
    return <div className="carousel-frame">
      <div className="photo-track" style={{
        transform: `translateX(calc(${-index*100}% + ${offset}px))`,
        transitionDuration: offset ? '0s' : undefined,
      }}
        onPointerDown={e=>{
          if(e.button!==0 || !e.isPrimary) return;
          drag.current={id:e.pointerId,x:e.clientX,moved:false};
          suppressClick.current=false;
        }}
        onPointerMove={e=>{
          const gesture=drag.current;
          if(!gesture || gesture.id!==e.pointerId) return;
          const dx=e.clientX-gesture.x;
          if(Math.abs(dx)>6 && !gesture.moved){
            gesture.moved=true;
            e.currentTarget.setPointerCapture(e.pointerId);
          }
          if(gesture.moved) {
            const width=e.currentTarget.clientWidth;
            setOffset(Math.max(index===slides.length-1?0:-width,Math.min(index===0?0:width,dx)));
          }
        }}
        onPointerUp={e=>{
          const gesture=drag.current;
          if(!gesture || gesture.id!==e.pointerId) return;
          const dx=e.clientX-gesture.x;
          suppressClick.current=gesture.moved;
          if(gesture.moved && Math.abs(dx)>Math.min(60,e.currentTarget.clientWidth*.12))
            setIndex(i=>Math.max(0,Math.min(slides.length-1,i+(dx<0?1:-1))));
          drag.current=null;
          setOffset(0);
        }}
        onPointerLeave={()=>{if(!drag.current?.moved) drag.current=null;}}
        onPointerCancel={()=>{drag.current=null;setOffset(0);}}
      >
        {slides.map((photo,i)=><button type="button" key={photo.src}
          className="photo-cell" tabIndex={i===index?0:-1} aria-hidden={i!==index}
          aria-label={(expanded?'Следующее фото. ':'Открыть на весь экран. ')+photo.alt}
          onClick={e=>{
            if(e.detail && suppressClick.current) return;
            if(expanded) move(1); else dialog.current?.showModal();
          }}>
          <img draggable={false} src={expanded && original && photo.original ? photo.original : photo.src} width="1200" height="800" alt={photo.alt} loading={priority && i===0 && !expanded ? 'eager' : 'lazy'} fetchPriority={priority && i===0 && !expanded ? 'high' : undefined}/>
          {photo.aerial && <RouteOverlay/>}
        </button>)}
      </div>
      <div className="carousel-arrows">
        <button onClick={()=>move(-1)} aria-label="Предыдущее фото">←</button>
        <button onClick={()=>move(1)} aria-label="Следующее фото">→</button>
      </div>
    </div>;
  }
  function caption() {
    return <div className="property-caption">
      {slide.aerial && <ul>{routes.map((r,i)=><li key={r.name}><b style={{background:r.color}}>{i+1}</b> {r.name} · <strong>≈ {r.distance}</strong></li>)}</ul>}
      {slide.original ? slide.alt : slide.caption}
    </div>;
  }
  return <div className="property-carousel" role="region" aria-roledescription="карусель" aria-label={title}
    onKeyDown={e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();move(e.key==='ArrowRight'?1:-1);}}}>
    {frame()}
    <div className="carousel-bottom">
      <span aria-live="polite">{index+1} / {slides.length}</span>
      <div className="carousel-dots">{slides.map((s,i)=><button key={s.src} onClick={()=>setIndex(i)} aria-label={'Фото '+(i+1)+': '+s.alt} aria-current={index===i?'true':undefined}><span/></button>)}</div>
      <button className="carousel-expand" onClick={()=>dialog.current?.showModal()}>На весь экран</button>
    </div>
    {caption()}
    <dialog ref={dialog} className="property-viewer" aria-label={title} onClose={()=>setOriginal(false)}>
      <header>
        <span aria-live="polite" className={slide.original ? 'sr-only' : undefined}>{index+1} / {slides.length}</span>
        {slide.original && <button className="original-toggle" type="button" aria-pressed={original}
          aria-label="Оригинал снимка" title={original ? 'Вернуться к обработке' : 'Посмотреть оригинал'} onClick={()=>setOriginal(v=>!v)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <rect x="3" y="4" width="18" height="16" rx="2"/><path d="M12 4v16M4 16l4-5 4 4 4-5 5 6"/>
          </svg>
        </button>}
        <button autoFocus onClick={()=>dialog.current?.close()}>Закрыть ×</button></header>
      {frame(true)}{!slide.original && caption()}
    </dialog>
  </div>;
}
