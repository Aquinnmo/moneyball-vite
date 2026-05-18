import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import './PitchZoneSpinner.css';
import { SpinnerMessage } from './SpinnerMessage';

const pitchFlashIntervalMs = 760;

interface PitchFlashPosition {
  xPercent: number;
  yPercent: number;
}

interface PitchFlashState extends PitchFlashPosition {
  sequence: number;
}

type PitchFlashStyle = CSSProperties & {
  '--pz-flash-x': string;
  '--pz-flash-y': string;
};

export interface PitchZoneSpinnerProps {
  /** The message to display below the spinner. Default: "Loading..." */
  message?: string;
  /** Whether to cover the parent with a blurred backdrop. Default: true */
  overlay?: boolean;
  /** Extra CSS class added to the root element */
  className?: string;
}

function getRandomPercent(): number {
  return Math.random() * 100;
}

function selectRandomPitchFlashPosition(): PitchFlashPosition {
  return {
    xPercent: getRandomPercent(),
    yPercent: getRandomPercent(),
  };
}

/**
 * PitchZoneSpinner Component
 *
 * Displays a strike-zone loading animation with randomized pitch flashes.
 * Follows design principles for minimalism and data-first visualization.
 */
export function PitchZoneSpinner({ message = "Loading...", overlay = true, className = "" }: PitchZoneSpinnerProps) {
  const [activePitchFlash, setActivePitchFlash] = useState<PitchFlashState>(() => ({
    ...selectRandomPitchFlashPosition(),
    sequence: 0,
  }));
  const containerClasses = [
    "pz-wrapper",
    overlay ? "pz-overlay" : "",
    className
  ].filter(Boolean).join(" ");
  const pitchFlashStyle: PitchFlashStyle = {
    '--pz-flash-x': `${activePitchFlash.xPercent}%`,
    '--pz-flash-y': `${activePitchFlash.yPercent}%`,
  };

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActivePitchFlash((currentPitchFlash) => ({
        ...selectRandomPitchFlashPosition(),
        sequence: currentPitchFlash.sequence + 1,
      }));
    }, pitchFlashIntervalMs);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className={containerClasses} role="status" aria-live="polite" aria-label={message}>
      <div className="pz-stage" aria-hidden="true">
        <div className="pz-zone">
          <span className="pz-flash" key={activePitchFlash.sequence} style={pitchFlashStyle}></span>
        </div>
      </div>
      {message && <SpinnerMessage key={message} message={message} className="pz-label" />}
    </div>
  );
}
