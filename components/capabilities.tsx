import { qualities } from "@/lib/content";

export function Capabilities() {
  return (
    <section className="section" id="lyseis" aria-labelledby="lyseis-title">
      <div className="wrap solutions">
        <div className="section-head solutions-lead reveal">
          <h2 id="lyseis-title">Λύσεις</h2>
          <p className="lede">Κάθε έργο είναι εξατομικευμένο.</p>
        </div>
        <div className="solutions-stage reveal">
          <svg className="solutions-arc" viewBox="0 0 1000 340" aria-hidden="true">
            <path d="M100 248 C 260 78, 740 78, 900 248" />
            <circle cx="100" cy="248" r="5" />
            <circle cx="292" cy="132" r="5" />
            <circle cx="500" cy="86" r="5" />
            <circle cx="708" cy="132" r="5" />
            <circle cx="900" cy="248" r="5" />
          </svg>
          <ol className="solutions-row">
            {qualities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
