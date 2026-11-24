import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export interface FloatingDecorItemProps {
  src: string;
  alt?: string;
  className?: string; // Positioning & width (e.g. "absolute top-12 left-4 w-20 sm:w-28")
  initialRotate?: number;
  duration?: number;
  delay?: number;
  yOffset?: number;
  opacity?: number;
  hideOnMobile?: boolean;
  filterDropShadow?: string;
}

export const FloatingDecorItem: React.FC<FloatingDecorItemProps> = ({
  src,
  alt = '',
  className = '',
  initialRotate = 0,
  duration = 4.2,
  delay = 0,
  yOffset = 8,
  opacity = 0.9,
  hideOnMobile = false,
  filterDropShadow = 'drop-shadow-[0_8px_20px_rgba(16,36,61,0.11)]',
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none z-[2] ${hideOnMobile ? 'hidden sm:block' : 'block'} ${className}`}
    >
      <motion.div
        animate={
          shouldReduceMotion
            ? { rotate: initialRotate }
            : {
              y: [-yOffset, yOffset, -yOffset],
              rotate: [initialRotate - 2, initialRotate + 2, initialRotate - 2],
            }
        }
        transition={{
          repeat: Infinity,
          duration,
          delay,
          ease: 'easeInOut',
        }}
        style={{
          opacity,
          transformOrigin: 'center center',
        }}
        className="will-change-transform"
      >
        <img
          src={src}
          alt={alt}
          className={`w-full h-auto object-contain filter ${filterDropShadow}`}
          loading="lazy"
          draggable={false}
        />
      </motion.div>
    </div>
  );
};

export interface EdgeDecorItemProps {
  src: string;
  alt?: string;
  side: 'left' | 'right';
  top?: string; // e.g. "top-10", "top-1/4", "top-1/3", "top-1/2", "bottom-16"
  className?: string;
  initialRotate?: number;
  duration?: number;
  delay?: number;
  yOffset?: number;
  opacity?: number;
  sizeClass?: string;
  filterDropShadow?: string;
  zIndexClass?: string;
}

/**
 * EdgeDecorItem:
 * Strict 25% (1/4) horizontal cutoff outside the screen edge
 * (left-0 -translate-x-1/4 for left side, right-0 translate-x-1/4 for right side).
 * Varied subtle rotations, soft drop shadows, pointer-events-none select-none.
 */
export const EdgeDecorItem: React.FC<EdgeDecorItemProps> = ({
  src,
  alt = '',
  side,
  top = 'top-1/4',
  className = '',
  initialRotate = 0,
  duration = 4.8,
  delay = 0,
  yOffset = 8,
  opacity = 0.95,
  sizeClass = 'w-24 sm:w-32 md:w-44 lg:w-56',
  filterDropShadow = 'drop-shadow-[0_12px_28px_rgba(16,36,61,0.14)]',
  zIndexClass = 'z-[2]',
}) => {
  const shouldReduceMotion = useReducedMotion();
  const sidePlacementClass = side === 'left' ? 'left-0 -translate-x-1/4' : 'right-0 translate-x-1/4';

  return (
    <div
      aria-hidden="true"
      className={`absolute ${top} ${sidePlacementClass} ${zIndexClass} pointer-events-none select-none ${className}`}
    >
      <motion.div
        animate={
          shouldReduceMotion
            ? { rotate: initialRotate }
            : {
              y: [-yOffset, yOffset, -yOffset],
              rotate: [initialRotate - 1.5, initialRotate + 1.5, initialRotate - 1.5],
            }
        }
        transition={{
          repeat: Infinity,
          duration,
          delay,
          ease: 'easeInOut',
        }}
        style={{
          opacity,
          transformOrigin: 'center center',
        }}
        className="will-change-transform"
      >
        <img
          src={src}
          alt={alt}
          className={`${sizeClass} h-auto object-contain filter ${filterDropShadow}`}
          loading="lazy"
          draggable={false}
        />
      </motion.div>
    </div>
  );
};

export interface FloatingScienceNodeProps {
  type?: 'dna' | 'molecule' | 'hexagon';
  className?: string;
  initialRotate?: number;
  duration?: number;
  delay?: number;
  yOffset?: number;
  opacity?: number;
  size?: number;
  hideOnMobile?: boolean;
  color?: string;
}

export const FloatingScienceNode: React.FC<FloatingScienceNodeProps> = ({
  type = 'molecule',
  className = '',
  initialRotate = 15,
  duration = 5.0,
  delay = 0,
  yOffset = 6,
  opacity = 0.16,
  size = 40,
  hideOnMobile = false,
  color = '#044AA3',
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none z-[2] ${hideOnMobile ? 'hidden sm:block' : 'block'} ${className}`}
    >
      <motion.div
        animate={
          shouldReduceMotion
            ? { rotate: initialRotate }
            : {
              y: [-yOffset, yOffset, -yOffset],
              rotate: [initialRotate - 3, initialRotate + 3, initialRotate - 3],
            }
        }
        transition={{
          repeat: Infinity,
          duration,
          delay,
          ease: 'easeInOut',
        }}
        style={{
          opacity,
          transformOrigin: 'center center',
        }}
        className="will-change-transform"
      >
        {type === 'dna' ? (
          <img
            src="/DNAicon-blue.png"
            alt=""
            style={{ width: size, height: size }}
            className="object-contain filter drop-shadow-xs"
            loading="lazy"
            draggable={false}
          />
        ) : type === 'hexagon' ? (
          <svg
            width={size}
            height={size}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polygon
              points="20,4 35,12 35,28 20,36 5,28 5,12"
              stroke={color}
              strokeWidth="1.4"
              strokeDasharray="3 3"
              fill="none"
            />
            <circle cx="20" cy="20" r="4" fill={color} opacity="0.75" />
          </svg>
        ) : (
          <svg
            width={size}
            height={size}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line x1="12" y1="20" x2="28" y2="12" stroke={color} strokeWidth="1.2" strokeOpacity="0.85" />
            <line x1="28" y1="12" x2="32" y2="28" stroke={color} strokeWidth="1.2" strokeOpacity="0.85" />
            <line x1="12" y1="20" x2="20" y2="32" stroke={color} strokeWidth="1.2" strokeOpacity="0.85" />
            <line x1="20" y1="32" x2="32" y2="28" stroke={color} strokeWidth="1.2" strokeOpacity="0.85" />
            <circle cx="12" cy="20" r="3.2" fill={color} />
            <circle cx="28" cy="12" r="2.8" fill="#033B85" />
            <circle cx="32" cy="28" r="3.2" fill={color} />
            <circle cx="20" cy="32" r="2.5" fill="#10243D" />
            <circle cx="20" cy="22" r="4.5" stroke={color} strokeWidth="0.8" strokeDasharray="2 2" strokeOpacity="0.7" />
          </svg>
        )}
      </motion.div>
    </div>
  );
};

