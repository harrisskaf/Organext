type LogoProps = {
  className?: string;
};

/**
 * LOGO SWAP POINT
 * The only mark is /brand/organext-logo.png: the supplied ON monogram with
 * the black square removed. Do not redraw, recolor, or stretch it.
 * The word ORGANEXT sits beside it as type, not as a second drawn logo.
 */
export function Logo({ className }: LogoProps) {
  return (
    <span className={className ? `brand ${className}` : "brand"}>
      <img src="/brand/organext-logo.png" alt="" width={628} height={554} />
      <span className="brand-name">ORGANEXT</span>
    </span>
  );
}
