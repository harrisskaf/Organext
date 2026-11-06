import { steps } from "@/lib/content";

export function Process() {
  return (
    <section className="section" id="diadikasia" aria-labelledby="diadikasia-title">
      <div className="wrap">
        <div className="section-head reveal">
          <h2 id="diadikasia-title">Διαδικασία</h2>
        </div>
        <ol className="process-list reveal">
          {steps.map((step) => (
            <li key={step.n} className="process-step">
              <span className="process-num">{step.n}</span>
              <h3>{step.title}</h3>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
