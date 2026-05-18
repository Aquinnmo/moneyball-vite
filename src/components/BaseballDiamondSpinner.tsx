import './BaseballDiamondSpinner.css';
import { SpinnerMessage } from './SpinnerMessage';

export interface BaseballDiamondSpinnerProps {
  /** The message to display below the spinner. Default: "Loading..." */
  message?: string;
  /** Whether to cover the parent with a blurred backdrop. Default: true */
  overlay?: boolean;
  /** Extra CSS class added to the root element */
  className?: string;
}

/**
 * BaseballDiamondSpinner Component
 *
 * Displays a baseball diamond loading animation.
 * Follows design principles for minimalism and data-first visualization.
 */
export function BaseballDiamondSpinner({ message = "Loading...", overlay = true, className = "" }: BaseballDiamondSpinnerProps) {
  const containerClasses = [
    "bd-spinner",
    overlay ? "bd-spinner--overlay" : "",
    className
  ].filter(Boolean).join(" ");

  return (
    <div className={containerClasses} role="status" aria-live="polite" aria-label={message}>
      <div className="bd-spinner__stage" aria-hidden="true">
        <div className="bd-spinner__diamond"></div>
        <div className="bd-spinner__infield"></div>
        <span className="bd-spinner__base bd-spinner__base--home"></span>
        <span className="bd-spinner__base bd-spinner__base--first"></span>
        <span className="bd-spinner__base bd-spinner__base--second"></span>
        <span className="bd-spinner__base bd-spinner__base--third"></span>
        <span className="bd-spinner__runner"></span>
      </div>
      {message && <SpinnerMessage key={message} message={message} className="bd-spinner__label" />}
    </div>
  );
}
