const floors = [
  {number: 1, width: 1280, height: 542},
  {number: 2, width: 1153, height: 462},
];

export default function RetailFloorPlans() {
  return (
    <section className="section" id="retail-plans" aria-labelledby="retail-plans-title">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Торговые помещения</span>
          <h2 id="retail-plans-title">Планы этажей</h2>
        </div>
      </div>
      <div className="retail-floor-plans">
        {floors.map(({number, width, height}) => {
          const src = `/media/siluet/retail-floor-${number}.png`;
          return (
            <a key={number} href={src} target="_blank" rel="noreferrer">
              <img src={src} width={width} height={height} loading="lazy"
                alt={`План торговых помещений ТЦ «Силуэт», ${number}-й этаж`}/>
              <span><strong>{number}-й этаж</strong>Открыть крупнее ↗</span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
