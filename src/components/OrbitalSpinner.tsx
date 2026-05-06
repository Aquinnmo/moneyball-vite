import './spinner.css';

export interface SpinnerProps {
  /** The message to display below the spinner. Default: "Loading…" */
  message?: string;
  /** Whether to cover the parent with a blurred backdrop. Default: true */
  overlay?: boolean;
  /** Extra CSS class added to the root element */
  className?: string;
}

/**
 * Spinner Component
 * 
 * Displays an orbital loading animation.
 * Follows design principles for minimalism and data-first visualization.
 */
export function OrbitalSpinner({ message = "Loading…", overlay = true, className = "" }: SpinnerProps) {
  const containerClasses = [
    "sp-wrapper",
    overlay ? "sp-overlay" : "",
    className
  ].filter(Boolean).join(" ");

  return (
    <div className={containerClasses} role="status" aria-live="polite" aria-label={message}>
      <div className="sp-stage">
        <div className="sp-orbit sp-orbit--1"><div className="sp-dot"></div></div>
        <div className="sp-orbit sp-orbit--2"><div className="sp-dot"></div></div>
        <div className="sp-orbit sp-orbit--3"><div className="sp-dot"></div></div>
        <div className="sp-core"></div>
      </div>
      {message && <p className="sp-label">{message}</p>}
    </div>
  );
}
