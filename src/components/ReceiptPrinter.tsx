import {
  type ComponentPropsWithoutRef,
  createContext,
  type ReactNode,
  useContext,
} from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ReceiptPrinterStage = 'processing' | 'printing' | 'complete';
export type ReceiptFeedMotion = 'smooth' | 'stepped';

export type ReceiptPrinterRootProps = Omit<
  ComponentPropsWithoutRef<'section'>,
  'children'
> & {
  animate?: boolean;
  children: ReactNode;
  feedMotion?: ReceiptFeedMotion;
  stage: ReceiptPrinterStage;
};

export type ReceiptPrinterMachineProps = ComponentPropsWithoutRef<'div'>;
export type ReceiptPrinterHeaderProps = ComponentPropsWithoutRef<'div'>;
export type ReceiptPrinterScreenProps = ComponentPropsWithoutRef<'div'>;
export type ReceiptPrinterOutputProps = ComponentPropsWithoutRef<'div'>;
export type ReceiptPrinterPaperProps = ComponentPropsWithoutRef<'article'>;

export type ReceiptPrinterStatusProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  'children'
> & {
  children?: ReactNode;
};

type ReceiptPrinterContextValue = {
  animate: boolean;
  feedMotion: ReceiptFeedMotion;
  shouldMove: boolean;
  stage: ReceiptPrinterStage;
};

const ReceiptPrinterContext = createContext<ReceiptPrinterContextValue | null>(null);

const easeOut = [0.23, 1, 0.32, 1] as const;
const easeInOut = [0.77, 0, 0.175, 1] as const;

const receiptToothCount = 40;
const receiptToothDepth = 4;
const receiptToothPoints = Array.from(
  { length: receiptToothCount * 2 },
  (_, index) => {
    const x = 100 - ((index + 1) * 100) / (receiptToothCount * 2);
    const y = index % 2 === 0 ? '100%' : `calc(100% - ${receiptToothDepth}px)`;
    return `${x}% ${y}`;
  },
).join(', ');
const receiptClipPath = `polygon(0 0, 100% 0, 100% calc(100% - ${receiptToothDepth}px), ${receiptToothPoints})`;

const printingTransformKeyframes = [
  'translateY(calc(-100% + 2px))',
  'translateY(-91%)',
  'translateY(-91%)',
  'translateY(-81%)',
  'translateY(-81%)',
  'translateY(-70%)',
  'translateY(-70%)',
  'translateY(-58%)',
  'translateY(-58%)',
  'translateY(-45%)',
  'translateY(-45%)',
  'translateY(-32%)',
  'translateY(-32%)',
  'translateY(-20%)',
  'translateY(-20%)',
  'translateY(-10%)',
  'translateY(-10%)',
  'translateY(-3%)',
  'translateY(-3%)',
  'translateY(0%)',
];

const printingKeyframeTimes = [
  0, 0.075, 0.105, 0.18, 0.21, 0.285, 0.315, 0.39, 0.42, 0.495, 0.525, 0.6,
  0.63, 0.705, 0.735, 0.81, 0.84, 0.915, 0.945, 1,
];

const statusLabels: Record<ReceiptPrinterStage, ReactNode> = {
  processing: 'Verifying payment...',
  printing: 'Printing booking receipt...',
  complete: 'Payment confirmed',
};

const machineClassName =
  'relative isolate w-full overflow-hidden rounded-[var(--printer-radius)] border border-neutral-800 bg-neutral-900 p-[var(--printer-inset)] pb-8 shadow-[0_20px_36px_-20px_rgba(0,0,0,0.55),0_6px_14px_-8px_rgba(0,0,0,0.24),inset_0_1px_0_rgba(255,255,255,0.14),inset_0_-1px_0_rgba(0,0,0,0.55)] [--printer-inner-radius:calc(var(--printer-radius)_-_var(--printer-inset))] [--printer-inset:0.75rem] [--printer-radius:1.5rem]';

function useReceiptPrinter(component: string) {
  const context = useContext(ReceiptPrinterContext);
  if (!context) {
    throw new Error(`${component} must be used inside ReceiptPrinter.Root.`);
  }
  return context;
}

function ReceiptPrinterRoot({
  'aria-label': ariaLabel = 'Receipt printer',
  animate = true,
  children,
  className,
  feedMotion = 'stepped',
  stage,
  ...props
}: ReceiptPrinterRootProps) {
  const shouldReduceMotion = useReducedMotion();
  const context = {
    animate,
    feedMotion,
    shouldMove: animate && !shouldReduceMotion,
    stage,
  };

  return (
    <ReceiptPrinterContext.Provider value={context}>
      <section
        aria-label={ariaLabel}
        className={cn(
          'relative isolate flex w-full max-w-sm flex-col items-center',
          className,
        )}
        data-stage={stage}
        {...props}
      >
        {children}
      </section>
    </ReceiptPrinterContext.Provider>
  );
}

function ReceiptPrinterMachine({
  children,
  className,
  ...props
}: ReceiptPrinterMachineProps) {
  return (
    <div className={cn(machineClassName, className)} {...props}>
      {children}
      <div
        aria-hidden="true"
        className="absolute inset-x-6 bottom-[var(--printer-inset)] z-40 h-2 rounded-[0.25rem] border border-neutral-950 bg-neutral-950 shadow-inner"
      />
    </div>
  );
}

function ReceiptPrinterHeader({
  children,
  className,
  ...props
}: ReceiptPrinterHeaderProps) {
  return (
    <div
      className={cn(
        'relative z-10 flex h-11 items-start justify-between',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function ReceiptPrinterScreen({
  children,
  className,
  ...props
}: ReceiptPrinterScreenProps) {
  return (
    <div
      className={cn(
        "relative z-10 isolate overflow-hidden rounded-[var(--printer-inner-radius)] border border-neutral-950 bg-neutral-950 p-4 text-neutral-100 shadow-inner after:pointer-events-none after:absolute after:inset-0 after:z-20 after:rounded-[inherit] after:shadow-[inset_0_0_24px_4px_rgba(0,0,0,0.52)] after:content-['']",
        className,
      )}
      {...props}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function StatusIndicator({
  animate,
  move,
  stage,
}: {
  animate: boolean;
  move: boolean;
  stage: ReceiptPrinterStage;
}) {
  const isComplete = stage === 'complete';

  return (
    <span
      aria-hidden="true"
      className="relative grid size-5 shrink-0 place-items-center"
    >
      <AnimatePresence initial={false} mode="sync">
        {isComplete ? (
          <motion.span
            animate={{ opacity: 1, transform: 'scale(1)' }}
            className="col-start-1 row-start-1 grid place-items-center text-emerald-400"
            exit={{
              opacity: animate ? 0 : 1,
              transform: move ? 'scale(0.96)' : 'scale(1)',
            }}
            initial={{
              opacity: animate ? 0 : 1,
              transform: move ? 'scale(0.94)' : 'scale(1)',
            }}
            key="complete"
            transition={{ duration: animate ? 0.16 : 0, ease: easeOut }}
          >
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
          </motion.span>
        ) : (
          <motion.span
            animate={{ opacity: 1, transform: 'scale(1)' }}
            className="col-start-1 row-start-1 grid place-items-center text-neutral-400"
            exit={{
              opacity: animate ? 0 : 1,
              transform: move ? 'scale(0.96)' : 'scale(1)',
            }}
            initial={{
              opacity: animate ? 0 : 1,
              transform: move ? 'scale(0.94)' : 'scale(1)',
            }}
            key="working"
            transition={{ duration: animate ? 0.16 : 0, ease: easeOut }}
          >
            <Loader2 className={cn('w-4.5 h-4.5 animate-spin motion-reduce:animate-none text-neutral-400')} />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

function ReceiptPrinterStatus({
  children,
  className,
  ...props
}: ReceiptPrinterStatusProps) {
  const { animate, shouldMove, stage } = useReceiptPrinter(
    'ReceiptPrinter.Status',
  );

  return (
    <div
      className={cn('flex min-w-0 items-center gap-2', className)}
      {...props}
    >
      <StatusIndicator animate={animate} move={shouldMove} stage={stage} />
      <div
        aria-live="polite"
        className="grid min-w-0 flex-1 items-center"
        role="status"
      >
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            animate={{ opacity: 1, transform: 'translateY(0px)' }}
            className="col-start-1 row-start-1 truncate font-medium text-neutral-300 text-xs leading-none"
            exit={{
              opacity: animate ? 0 : 1,
              transform: shouldMove ? 'translateY(-4px)' : 'translateY(0px)',
            }}
            initial={{
              opacity: animate ? 0 : 1,
              transform: shouldMove ? 'translateY(4px)' : 'translateY(0px)',
            }}
            key={stage}
            transition={{ duration: animate ? 0.18 : 0, ease: easeOut }}
          >
            {children ?? statusLabels[stage]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function ReceiptPrinterPaper({
  children,
  className,
  style,
  ...props
}: ReceiptPrinterPaperProps) {
  return (
    <article
      className={cn(
        'relative z-10 min-h-80 bg-[#FAF9F5] px-6 pt-7 pb-8 font-mono text-neutral-900 shadow-md',
        className,
      )}
      style={{ clipPath: receiptClipPath, ...style }}
      {...props}
    >
      {children}
    </article>
  );
}

function ReceiptPrinterOutput({
  children,
  className,
  ...props
}: ReceiptPrinterOutputProps) {
  const { animate, feedMotion, shouldMove, stage } = useReceiptPrinter(
    'ReceiptPrinter.Output',
  );
  const isReceiptVisible = stage !== 'processing';
  const shouldUseSteppedFeed =
    feedMotion === 'stepped' && stage === 'printing' && shouldMove;

  return (
    <div
      className={cn(
        'relative z-50 -mt-4 w-[calc(86%+2rem)] max-w-full overflow-hidden px-4 pb-6',
        className,
      )}
      {...props}
    >
      {isReceiptVisible ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-4 -top-1 z-20 h-2 bg-black/75 blur-[6px]"
        />
      ) : null}

      <motion.div
        animate={{
          opacity: isReceiptVisible ? 1 : 0,
          transform:
            stage === 'printing' && shouldMove
              ? shouldUseSteppedFeed
                ? printingTransformKeyframes
                : 'translateY(0%)'
              : isReceiptVisible || !shouldMove
                ? 'translateY(0%)'
                : 'translateY(calc(-100% + 2px))',
        }}
        aria-hidden={stage !== 'complete'}
        className="relative isolate drop-shadow-[0_10px_20px_rgba(0,0,0,0.16)]"
        initial={false}
        transition={{
          opacity: { duration: animate ? 0.16 : 0, ease: easeOut },
          transform: {
            duration: shouldMove ? 1.75 : 0,
            ease: shouldUseSteppedFeed ? 'linear' : easeInOut,
            times: shouldUseSteppedFeed ? printingKeyframeTimes : undefined,
          },
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export const ReceiptPrinter = {
  Header: ReceiptPrinterHeader,
  Machine: ReceiptPrinterMachine,
  Output: ReceiptPrinterOutput,
  Paper: ReceiptPrinterPaper,
  Root: ReceiptPrinterRoot,
  Screen: ReceiptPrinterScreen,
  Status: ReceiptPrinterStatus,
};
