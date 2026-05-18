import { useEffect, useState } from 'react';
import './SpinnerMessage.css';

const slowLoadDelayMs = 5000;
const messageFadeMs = 260;
const slowLoadMessage = 'Hang tight, our servers are spinning back up. Do not refresh the page.';

export interface SpinnerMessageProps {
  /** The initial message to show while the spinner is loading. */
  message: string;
  /** Existing spinner-specific label class name. */
  className: string;
}

/**
 * SpinnerMessage Component
 *
 * Displays spinner status text and swaps to a slow-load message after a short delay.
 */
export function SpinnerMessage({ message, className }: SpinnerMessageProps) {
  const [showSlowLoadMessage, setShowSlowLoadMessage] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const displayMessage = showSlowLoadMessage ? slowLoadMessage : message;

  useEffect(() => {
    let fadeTimerId: number | undefined;

    const slowLoadTimerId = window.setTimeout(() => {
      setIsFading(true);

      fadeTimerId = window.setTimeout(() => {
        setShowSlowLoadMessage(true);
        setIsFading(false);
      }, messageFadeMs);
    }, slowLoadDelayMs);

    return () => {
      window.clearTimeout(slowLoadTimerId);

      if (fadeTimerId) {
        window.clearTimeout(fadeTimerId);
      }
    };
  }, [message]);

  return (
    <p className={`${className} spinner-message${isFading ? ' spinner-message--fading' : ''}`}>
      {displayMessage}
    </p>
  );
}
