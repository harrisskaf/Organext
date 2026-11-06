import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Η σελίδα δεν βρέθηκε",
  description: "Η σελίδα που ζητήσατε δεν υπάρχει στον ιστότοπο της ORGANEXT.",
};

export default function NotFound() {
  return (
    <div className="not-found">
      <p className="kicker">404</p>
      <h1>Η σελίδα δεν βρέθηκε</h1>
      <p className="lede">Ο σύνδεσμος δεν αντιστοιχεί σε σελίδα του ιστότοπου.</p>
      <Link className="btn btn-primary" href="/">
        Επιστροφή στην αρχική
      </Link>
    </div>
  );
}
