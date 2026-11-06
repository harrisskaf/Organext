import Link from "next/link";
import { HashLink } from "@/components/hash-link";
import { Logo } from "@/components/logo";
import { services } from "@/lib/content";
import { nav } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <nav aria-label="Σελίδες">
          <p className="footer-label">Πλοήγηση</p>
          <div className="footer-links">
            {nav.map((item) => (
              <HashLink key={item.id} id={item.id}>
                {item.label}
              </HashLink>
            ))}
            <HashLink id="diadikasia">Διαδικασία</HashLink>
          </div>
        </nav>
        <nav aria-label="Υπηρεσίες">
          <p className="footer-label">Υπηρεσίες</p>
          <div className="footer-links">
            {services.map((service) => (
              <HashLink key={service.id} id={service.id}>
                {service.title}
              </HashLink>
            ))}
          </div>
        </nav>
        <div className="footer-contact">
          <p className="footer-label">Επικοινωνία</p>
          <p className="footer-note">
            Στοιχεία άμεσης επικοινωνίας δεν έχουν δημοσιευτεί ακόμη. Τα αιτήματα
            γίνονται από τη φόρμα.
          </p>
          <HashLink id="epikoinonia" className="text-link">
            Μετάβαση στη φόρμα
          </HashLink>
          <a className="text-link" href="https://instagram.com/organext" rel="noreferrer">
            Instagram
          </a>
          <HashLink id="archi" className="logo-link footer-logo" label="ORGANEXT, αρχική σελίδα">
            <Logo />
          </HashLink>
        </div>
      </div>
      <div className="wrap legal">
        <p>© {year} ORGANEXT</p>
        <nav className="legal-links" aria-label="Νομικά">
          <Link href="/politiki-aporritou">Πολιτική απορρήτου</Link>
          <Link href="/oroi-chrisis">Όροι χρήσης</Link>
        </nav>
      </div>
    </footer>
  );
}
