"use client";

/**
 * IKEA-style measurement guide illustrations.
 * Minimal line-art figures with a dashed measurement indicator
 * showing exactly where to wrap the tape for each body part.
 */

const FIGURE_STROKE = "#94a3b8"; // slate-400
const GUIDE_STROKE = "#8B5CF6"; // primary purple
const GUIDE_FILL = "#8B5CF6";

function DashedRing({
  cx,
  cy,
  rx,
  ry,
}: {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}) {
  return (
    <ellipse
      cx={cx}
      cy={cy}
      rx={rx}
      ry={ry}
      fill="none"
      stroke={GUIDE_STROKE}
      strokeWidth={2}
      strokeDasharray="4 3"
    />
  );
}

function Arrow({ x, y, direction }: { x: number; y: number; direction: "left" | "right" }) {
  const dx = direction === "right" ? 5 : -5;
  return (
    <polygon
      points={`${x},${y - 3} ${x + dx},${y} ${x},${y + 3}`}
      fill={GUIDE_FILL}
    />
  );
}

function ArrowLine({
  x1,
  y1,
  x2,
  y2,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}) {
  return (
    <>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={GUIDE_STROKE} strokeWidth={1.5} />
      <Arrow x={x1} y={y1} direction="left" />
      <Arrow x={x2} y={y2} direction="right" />
    </>
  );
}

/** Simplified upper-body figure (head, torso, arms) */
function BaseFigure() {
  return (
    <g stroke={FIGURE_STROKE} strokeWidth={1.8} fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Head */}
      <circle cx={50} cy={16} r={8} />
      {/* Neck */}
      <line x1={50} y1={24} x2={50} y2={30} />
      {/* Shoulders */}
      <line x1={30} y1={34} x2={70} y2={34} />
      {/* Torso left */}
      <path d="M30,34 Q28,52 32,75 L38,90" />
      {/* Torso right */}
      <path d="M70,34 Q72,52 68,75 L62,90" />
      {/* Left arm */}
      <path d="M30,34 Q22,50 24,68" />
      {/* Right arm */}
      <path d="M70,34 Q78,50 76,68" />
      {/* Hips / waist base */}
      <path d="M38,90 Q50,94 62,90" />
      {/* Left leg */}
      <path d="M38,90 Q36,108 35,130" />
      {/* Right leg */}
      <path d="M62,90 Q64,108 65,130" />
    </g>
  );
}

function GuideWrapper({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox="0 0 100 140"
        className="w-full h-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        {children}
      </svg>
      <span className="text-xs text-slate-500 mt-1">{label}</span>
    </div>
  );
}

export function ChestGuide() {
  return (
    <GuideWrapper label="Fullest part of chest">
      <BaseFigure />
      <DashedRing cx={50} cy={44} rx={22} ry={5} />
      <ArrowLine x1={23} y1={44} x2={77} y2={44} />
    </GuideWrapper>
  );
}

export function WaistGuide() {
  return (
    <GuideWrapper label="Narrowest point of torso">
      <BaseFigure />
      <DashedRing cx={50} cy={62} rx={19} ry={4.5} />
      <ArrowLine x1={26} y1={62} x2={74} y2={62} />
    </GuideWrapper>
  );
}

export function HipsGuide() {
  return (
    <GuideWrapper label="Widest part of hips">
      <BaseFigure />
      <DashedRing cx={50} cy={86} rx={17} ry={4.5} />
      <ArrowLine x1={28} y1={86} x2={72} y2={86} />
    </GuideWrapper>
  );
}

export function ArmGuide() {
  return (
    <GuideWrapper label="Widest part of upper arm">
      <BaseFigure />
      {/* Ring around the right upper arm */}
      <DashedRing cx={74} cy={48} rx={7} ry={3.5} />
      {/* Small arrows */}
      <line x1={81} y1={48} x2={88} y2={48} stroke={GUIDE_STROKE} strokeWidth={1.5} />
      <Arrow x={88} y={48} direction="right" />
    </GuideWrapper>
  );
}

export function ThighGuide() {
  return (
    <GuideWrapper label="Widest part of upper thigh">
      <BaseFigure />
      {/* Ring around the right upper thigh */}
      <DashedRing cx={64} cy={98} rx={7} ry={3.5} />
      {/* Small arrow */}
      <line x1={71} y1={98} x2={80} y2={98} stroke={GUIDE_STROKE} strokeWidth={1.5} />
      <Arrow x={80} y={98} direction="right" />
    </GuideWrapper>
  );
}

const guideMap: Record<string, React.FC> = {
  chestCm: ChestGuide,
  waistCm: WaistGuide,
  hipsCm: HipsGuide,
  armCm: ArmGuide,
  thighCm: ThighGuide,
};

export function MeasurementGuide({ field }: { field: string }) {
  const Guide = guideMap[field];
  if (!Guide) return null;
  return <Guide />;
}
