import { services } from "@/lib/content";

export function Services() {
  return (
    <section className="section section-tint" id="ypiresies" aria-labelledby="ypiresies-title">
      <div className="wrap">
        <div className="section-head reveal">
          <h2 id="ypiresies-title">Υπηρεσίες</h2>
        </div>
        <div className="service-list">
          {services.map((service, index) => (
            <article key={service.id} id={service.id} className="service reveal">
              <span className="service-index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
