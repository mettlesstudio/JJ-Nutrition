import React, { useMemo } from 'react';
import { motion, useReducedMotion, Variants } from 'framer-motion';
import { HANDWRITING_GLYPHS, GlyphData } from './handwritingGlyphs';

// Maps a character to its corresponding glyph key in the dictionary
export function getGlyphKey(char: string): string {
  switch (char) {
    case 'ä': return 'ae';
    case 'ö': return 'oe';
    case 'ü': return 'ue';
    case 'Ä': return 'cap-ae';
    case 'Ö': return 'cap-oe';
    case 'Ü': return 'cap-ue';
    case 'ß': return 'sz';
  }
  if (char >= 'A' && char <= 'Z') return `cap-${char.toLowerCase()}`;
  if (char >= 'a' && char <= 'z') return char;
  if (char >= '0' && char <= '9') return `num-${char}`;
  if (["'", '’', '‘', '`', '´', 'ʼ', 'ʻ'].includes(char)) return 'sign-apostroph';
  if (['"', '”'].includes(char)) return 'sign-quote-close';
  if (char === '„') return 'sign-quote-open';
  if (char === '“') return 'sign-quote-eng-close';
  switch (char) {
    case '.': return 'sign-dot';
    case ',': return 'sign-comma';
    case '!': return 'sign-exclamation';
    case '?': return 'sign-question';
    case '&': return 'sign-and';
    case '@': return 'sign-at';
    case '+': return 'sign-plus';
    case '-': return 'sign-minus';
    case '=': return 'sign-equal';
    case '/': return 'sign-slash';
    case '$': return 'sign-dollar';
    case '§': return 'sign-paragraph';
    case '€': return 'sign-euro';
    default: return char;
  }
}

// Pseudo-random speed variation generator from Framer
function pseudoRandom(index: number): number {
  const t = Math.sin(index * 12.9898) * 43758.5453;
  return (t - Math.floor(t)) * 2 - 1;
}

export interface HandwritingTextProps {
  text: string;
  fontColor?: string;
  strokeWidth?: number;
  speed?: number; // Base duration per letter (s)
  delayBetween?: number; // Pause between letters (s)
  inconsistentSpeed?: number; // Speed variation (0-10)
  className?: string;
  style?: React.CSSProperties;
  isPlaying?: boolean; // Controlled playback trigger (defaults to true / driven by whileInView)
  onAnimationEnd?: (totalDuration: number) => void;
}

interface PathCustomData {
  startTime: number;
  pathIndex: number;
  totalPaths: number;
  charDuration: number;
  shouldReduceMotion: boolean;
}

export const HandwritingText: React.FC<HandwritingTextProps> = ({
  text,
  fontColor = '#044AA3',
  strokeWidth = 6,
  speed = 0.075,
  delayBetween = 0.015,
  inconsistentSpeed = 4,
  className = '',
  style = {},
  isPlaying = true,
  onAnimationEnd,
}) => {
  const shouldReduceMotion = useReducedMotion();

  // Parse words and compute exact stroke timings
  const { words, totalDuration } = useMemo(() => {
    const rawWords = (text || '').trim().split(/\s+/);
    let cumulativeTime = 0;
    let charIndexCounter = 0;

    const parsedWords = rawWords.map((word, wIdx) => {
      const chars = Array.from(word).map((char, cIdx) => {
        const charIdx = charIndexCounter++;
        const glyphKey = getGlyphKey(char);
        const glyph: GlyphData | undefined = HANDWRITING_GLYPHS[glyphKey];

        // Apply subtle organic human speed variation
        let charDuration = speed;
        let charPause = delayBetween;
        if (inconsistentSpeed > 0) {
          const r1 = pseudoRandom(charIdx * 2);
          const r2 = pseudoRandom(charIdx * 2 + 1);
          const factor = (inconsistentSpeed / 10) * 0.4;
          charDuration = speed * (1 + r1 * factor);
          charPause = delayBetween * (1 + r2 * factor);
          if (charDuration < 0.02) charDuration = 0.02;
          if (charPause < 0) charPause = 0;
        }

        const startTime = cumulativeTime;
        cumulativeTime += charDuration + charPause;

        return {
          id: `w${wIdx}-c${cIdx}`,
          char,
          glyph,
          startTime,
          charDuration,
        };
      });

      return {
        id: `w${wIdx}`,
        word,
        chars,
      };
    });

    return { words: parsedWords, totalDuration: cumulativeTime };
  }, [text, speed, delayBetween, inconsistentSpeed]);

  React.useEffect(() => {
    if (isPlaying && onAnimationEnd) {
      if (shouldReduceMotion) {
        onAnimationEnd(0);
        return;
      }
      const timer = setTimeout(() => {
        onAnimationEnd(totalDuration);
      }, totalDuration * 1000);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, onAnimationEnd, totalDuration, shouldReduceMotion]);

  // Framer path drawing variants
  const pathVariants: Variants = {
    hidden: {
      pathLength: 0,
      opacity: 0,
    },
    visible: (custom: PathCustomData) => {
      if (custom?.shouldReduceMotion) {
        return {
          pathLength: 1,
          opacity: 1,
          transition: { duration: 0 },
        };
      }
      const startTime = custom?.startTime ?? 0;
      const pathIndex = custom?.pathIndex ?? 0;
      const totalPaths = custom?.totalPaths ?? 1;
      const pathDuration = (custom?.charDuration ?? speed) / totalPaths;
      const delay = startTime + pathIndex * pathDuration;

      return {
        pathLength: 1,
        opacity: 1,
        transition: {
          pathLength: {
            delay,
            duration: pathDuration,
            ease: [0.42, 0, 0.58, 1], // Exact handwriting cubic bezier
          },
          opacity: {
            delay,
            duration: 0.001,
          },
        },
      };
    },
  };

  return (
    <div
      aria-label={text}
      className={`inline-flex flex-row items-baseline justify-center flex-wrap ${className}`}
      style={{
        gap: '0.45em 0.32em',
        color: fontColor,
        ...style,
      }}
    >
      {words.map((wordObj) => (
        <span
          key={wordObj.id}
          className="inline-flex flex-row items-baseline flex-nowrap"
          style={{ gap: '0.035em' }}
        >
          {wordObj.chars.map((charObj) => {
            const { glyph, startTime, charDuration, id, char } = charObj;

            // Fallback for missing glyphs
            if (!glyph) {
              return (
                <span
                  key={id}
                  style={{
                    fontSize: '0.85em',
                    lineHeight: '1em',
                    color: fontColor,
                    display: 'inline-block',
                  }}
                >
                  {char}
                </span>
              );
            }

            const widthEm = glyph.width / 100;
            const totalPaths = glyph.paths.length;

            return (
              <svg
                key={id}
                viewBox={`${glyph.minX} 0 ${glyph.width} 100`}
                preserveAspectRatio="xMidYMid meet"
                aria-hidden="true"
                style={{
                  width: `${widthEm}em`,
                  height: '1em',
                  overflow: 'visible',
                  flexShrink: 0,
                  display: 'inline-block',
                  verticalAlign: 'baseline',
                }}
              >
                <motion.g
                  fill="none"
                  stroke={fontColor}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial="hidden"
                  animate={isPlaying ? 'visible' : 'hidden'}
                >
                  {glyph.paths.map((d, pathIdx) => (
                    <motion.path
                      key={pathIdx}
                      d={d}
                      variants={pathVariants}
                      custom={{
                        startTime,
                        pathIndex: pathIdx,
                        totalPaths,
                        charDuration,
                        shouldReduceMotion,
                      }}
                    />
                  ))}
                </motion.g>
              </svg>
            );
          })}
        </span>
      ))}
    </div>
  );
};
