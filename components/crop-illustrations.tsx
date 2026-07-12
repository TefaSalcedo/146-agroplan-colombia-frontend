export function OrganicRingsIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 180 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M90 15C134.18 15 170 50.82 170 95C170 139.18 134.18 175 90 175C45.82 175 10 139.18 10 95C10 50.82 45.82 15 90 15Z"
        stroke="currentColor"
        strokeWidth="2"
        className="text-emerald-100"
      />
      <path
        d="M90 35C123.14 35 150 61.86 150 95C150 128.14 123.14 155 90 155C56.86 155 30 128.14 30 95C30 61.86 56.86 35 90 35Z"
        stroke="currentColor"
        strokeWidth="2"
        className="text-emerald-200"
      />
      <path
        d="M90 55C111.54 55 129 72.46 129 94C129 115.54 111.54 133 90 133C68.46 133 51 115.54 51 94C51 72.46 68.46 55 90 55Z"
        stroke="currentColor"
        strokeWidth="2"
        className="text-emerald-300"
      />
      <circle cx="90" cy="95" r="14" className="fill-emerald-400/30" />
    </svg>
  )
}

export function AIBotIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Ground hill */}
      <path
        d="M0 140C40 120 80 130 120 125C160 120 190 135 200 140V160H0V140Z"
        className="fill-primary/20"
      />

      {/* Plant stem and leaves */}
      <path
        d="M55 138C55 138 58 110 70 100"
        stroke="currentColor"
        strokeWidth="3"
        className="text-emerald-600"
      />
      <ellipse cx="70" cy="95" rx="10" ry="6" className="fill-emerald-500" />
      <ellipse cx="62" cy="102" rx="8" ry="5" className="fill-emerald-400" transform="rotate(-25 62 102)" />

      <path
        d="M95 138C95 138 92 105 80 95"
        stroke="currentColor"
        strokeWidth="3"
        className="text-emerald-600"
      />
      <ellipse cx="80" cy="90" rx="10" ry="6" className="fill-emerald-500" />
      <ellipse cx="88" cy="98" rx="8" ry="5" className="fill-emerald-400" transform="rotate(25 88 98)" />

      {/* Robot body */}
      <rect x="110" y="70" width="70" height="60" rx="16" className="fill-white stroke-slate-300" strokeWidth="2" />

      {/* Robot screen face */}
      <rect x="120" y="82" width="50" height="30" rx="8" className="fill-slate-800" />
      <circle cx="135" cy="97" r="5" className="fill-emerald-400" />
      <circle cx="155" cy="97" r="5" className="fill-emerald-400" />

      {/* Robot antenna */}
      <line x1="145" y1="70" x2="145" y2="55" stroke="currentColor" strokeWidth="2" className="text-slate-400" />
      <circle cx="145" cy="52" r="5" className="fill-primary" />

      {/* Robot ears */}
      <rect x="102" y="88" width="10" height="20" rx="4" className="fill-slate-300" />
      <rect x="178" y="88" width="10" height="20" rx="4" className="fill-slate-300" />

      {/* Robot wheels/legs */}
      <circle cx="128" cy="138" r="10" className="fill-slate-400" />
      <circle cx="162" cy="138" r="10" className="fill-slate-400" />

      {/* Robot arm */}
      <path
        d="M180 95C190 95 195 105 192 115C189 125 180 128 175 125"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        className="text-slate-300"
      />
      <circle cx="174" cy="126" r="5" className="fill-slate-300" />
    </svg>
  )
}

export function LandscapeIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {/* Sky */}
      <rect width="320" height="120" className="fill-primary/5" />

      {/* Far mountains */}
      <path
        d="M0 120L60 60L120 120Z"
        className="fill-emerald-100"
      />
      <path
        d="M80 120L160 40L240 120Z"
        className="fill-emerald-200"
      />
      <path
        d="M200 120L260 70L320 120Z"
        className="fill-emerald-100"
      />

      {/* Near hill */}
      <path
        d="M0 120C60 100 140 95 220 105C260 110 300 120 320 120V120H0Z"
        className="fill-emerald-500"
      />

      {/* Trees */}
      <g className="fill-emerald-700">
        <rect x="28" y="92" width="4" height="18" rx="1" />
        <circle cx="30" cy="88" r="10" />
        <circle cx="24" cy="92" r="7" />
        <circle cx="36" cy="92" r="7" />
      </g>

      <g className="fill-emerald-600">
        <rect x="68" y="94" width="4" height="16" rx="1" />
        <circle cx="70" cy="90" r="9" />
        <circle cx="65" cy="94" r="6" />
        <circle cx="75" cy="94" r="6" />
      </g>

      <g className="fill-emerald-700">
        <rect x="258" y="90" width="5" height="20" rx="1" />
        <circle cx="260.5" cy="85" r="12" />
        <circle cx="254" cy="90" r="8" />
        <circle cx="267" cy="90" r="8" />
      </g>

      <g className="fill-emerald-600">
        <rect x="288" y="96" width="4" height="16" rx="1" />
        <circle cx="290" cy="92" r="9" />
        <circle cx="285" cy="96" r="6" />
        <circle cx="295" cy="96" r="6" />
      </g>
    </svg>
  )
}
export function SproutPotIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {/* Soil */}
      <ellipse cx="100" cy="100" rx="70" ry="18" className="fill-amber-800/30" />

      {/* Pot */}
      <path
        d="M60 80L70 110H130L140 80H60Z"
        className="fill-amber-700"
      />
      <ellipse cx="100" cy="80" rx="40" ry="10" className="fill-amber-800" />

      {/* Sprout stems */}
      <path
        d="M90 80C90 60 80 45 70 35"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        className="text-emerald-500"
      />
      <path
        d="M110 80C110 60 120 45 130 35"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        className="text-emerald-500"
      />

      {/* Leaves */}
      <ellipse cx="70" cy="32" rx="10" ry="6" className="fill-emerald-400" transform="rotate(-35 70 32)" />
      <ellipse cx="130" cy="32" rx="10" ry="6" className="fill-emerald-400" transform="rotate(35 130 32)" />
      <ellipse cx="78" cy="42" rx="8" ry="5" className="fill-emerald-500" transform="rotate(-20 78 42)" />
      <ellipse cx="122" cy="42" rx="8" ry="5" className="fill-emerald-500" transform="rotate(20 122 42)" />

      {/* Decorative dots */}
      <circle cx="30" cy="30" r="4" className="fill-primary/20" />
      <circle cx="160" cy="40" r="6" className="fill-primary/15" />
      <circle cx="175" cy="75" r="3" className="fill-emerald-300/50" />
    </svg>
  )
}

export function AnalysisPlantBadge({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="40" cy="40" r="38" className="fill-emerald-50" />
      <circle cx="40" cy="40" r="30" className="fill-emerald-100/70" />
      <path
        d="M40 58V28"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        className="text-emerald-600"
      />
      <ellipse cx="30" cy="38" rx="10" ry="6" className="fill-emerald-500" transform="rotate(-40 30 38)" />
      <ellipse cx="50" cy="44" rx="10" ry="6" className="fill-emerald-400" transform="rotate(40 50 44)" />
      <ellipse cx="34" cy="50" rx="8" ry="5" className="fill-emerald-400" transform="rotate(-25 34 50)" />
      <ellipse cx="46" cy="54" rx="8" ry="5" className="fill-emerald-500" transform="rotate(25 46 54)" />
    </svg>
  )
}

export function YieldFruitIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {/* Background glow */}
      <ellipse cx="100" cy="130" rx="90" ry="25" className="fill-emerald-900/10" />

      {/* Leaves */}
      <path
        d="M70 130C60 110 50 90 70 75C85 65 110 70 120 90C130 110 115 130 100 135"
        className="fill-emerald-600"
      />
      <path
        d="M140 125C150 105 160 85 140 70C125 60 100 65 90 85C80 105 95 125 110 130"
        className="fill-emerald-500"
      />

      {/* Fruit body */}
      <ellipse cx="100" cy="110" rx="42" ry="50" className="fill-emerald-700" />
      <ellipse cx="100" cy="115" rx="30" ry="35" className="fill-emerald-500" />
      <ellipse cx="90" cy="105" rx="12" ry="18" className="fill-emerald-300/40" transform="rotate(-20 90 105)" />

      {/* Stem */}
      <path
        d="M100 62C100 55 102 50 108 45"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        className="text-emerald-800"
      />

      {/* Highlights */}
      <ellipse cx="85" cy="95" rx="6" ry="10" className="fill-white/20" transform="rotate(-20 85 95)" />
    </svg>
  )
}
