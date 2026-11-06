import { HashLink } from "@/components/hash-link";
import { HeroGraphic } from "@/components/hero-graphic";

export function Hero() {
  return (
    <section className="hero" id="archi" aria-labelledby="hero-title">
      <div className="hero-grid">
        <div className="hero-copy">
          <h1 id="hero-title">Δημιουργούμε το ψηφιακό μέλλον της επιχείρησής σας.</h1>
          <p className="lede">
            Σχεδιάζουμε και αναπτύσσουμε εξατομικευμένες εφαρμογές, ολοκληρωμένα
            ψηφιακά συστήματα και σύγχρονες διαδικτυακές εμπειρίες.
          </p>
          <div className="hero-actions">
            <HashLink id="epikoinonia" className="btn btn-primary">
              Ξεκινήστε ένα έργο
            </HashLink>
            <HashLink id="ypiresies" className="btn btn-ghost">
              Ανακαλύψτε τις υπηρεσίες μας
            </HashLink>
          </div>
        </div>
        <HeroGraphic />
      </div>
    </section>
  );
}
