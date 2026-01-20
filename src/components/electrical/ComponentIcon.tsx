import React from 'react';

interface ComponentIconProps {
  type: string;
  className?: string;
}

export const ComponentIcon: React.FC<ComponentIconProps> = ({ type, className = "w-16 h-16" }) => {
  const renderIcon = () => {
    switch (type) {
      case 'mcb':
        return (
          <svg viewBox="0 0 64 64" className={className}>
            {/* MCB Body */}
            <rect x="12" y="8" width="40" height="48" rx="3" fill="#374151" stroke="#1f2937" strokeWidth="2"/>
            {/* Toggle Switch */}
            <rect x="22" y="16" width="20" height="24" rx="2" fill="#6b7280"/>
            <rect x="24" y="18" width="16" height="10" rx="1" fill="#ef4444"/>
            {/* Terminals */}
            <circle cx="32" cy="12" r="4" fill="#ef4444" stroke="#b91c1c" strokeWidth="1"/>
            <text x="32" y="14" textAnchor="middle" fontSize="6" fill="white" fontWeight="bold">L</text>
            <circle cx="32" cy="52" r="4" fill="#ef4444" stroke="#b91c1c" strokeWidth="1"/>
            <text x="32" y="54" textAnchor="middle" fontSize="6" fill="white" fontWeight="bold">O</text>
            {/* Labels */}
            <text x="32" y="46" textAnchor="middle" fontSize="6" fill="#d1d5db">MCB</text>
          </svg>
        );

      case 'db':
        return (
          <svg viewBox="0 0 80 64" className={className}>
            {/* DB Body */}
            <rect x="4" y="4" width="72" height="56" rx="4" fill="#4b5563" stroke="#374151" strokeWidth="2"/>
            {/* Inner Panel */}
            <rect x="10" y="10" width="60" height="44" rx="2" fill="#6b7280"/>
            {/* Bus Bars */}
            <rect x="14" y="18" width="52" height="4" fill="#ef4444"/>
            <rect x="14" y="28" width="52" height="4" fill="#3b82f6"/>
            <rect x="14" y="38" width="52" height="4" fill="#22c55e"/>
            {/* Terminal Labels */}
            <circle cx="8" cy="22" r="4" fill="#ef4444"/>
            <text x="8" y="24" textAnchor="middle" fontSize="5" fill="white" fontWeight="bold">L</text>
            <circle cx="8" cy="34" r="4" fill="#3b82f6"/>
            <text x="8" y="36" textAnchor="middle" fontSize="5" fill="white" fontWeight="bold">N</text>
            <circle cx="72" cy="22" r="4" fill="#ef4444"/>
            <circle cx="72" cy="34" r="4" fill="#3b82f6"/>
            <circle cx="40" cy="56" r="4" fill="#22c55e"/>
            <text x="40" y="58" textAnchor="middle" fontSize="5" fill="white" fontWeight="bold">E</text>
          </svg>
        );

      case 'switch':
        return (
          <svg viewBox="0 0 64 48" className={className}>
            {/* Switch Plate */}
            <rect x="8" y="4" width="48" height="40" rx="4" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="2"/>
            {/* Switch Toggle */}
            <rect x="20" y="12" width="24" height="24" rx="3" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1"/>
            <rect x="22" y="14" width="20" height="10" rx="2" fill="#3b82f6"/>
            {/* Terminals */}
            <circle cx="12" cy="24" r="4" fill="#ef4444"/>
            <text x="12" y="26" textAnchor="middle" fontSize="5" fill="white" fontWeight="bold">I</text>
            <circle cx="52" cy="24" r="4" fill="#ef4444"/>
            <text x="52" y="26" textAnchor="middle" fontSize="5" fill="white" fontWeight="bold">O</text>
          </svg>
        );

      case 'regulator':
        return (
          <svg viewBox="0 0 64 48" className={className}>
            {/* Regulator Body */}
            <rect x="8" y="4" width="48" height="40" rx="4" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="2"/>
            {/* Dial */}
            <circle cx="32" cy="24" r="14" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2"/>
            <circle cx="32" cy="24" r="10" fill="#fff"/>
            {/* Dial Markers */}
            {[0, 1, 2, 3, 4].map((i) => (
              <circle
                key={i}
                cx={32 + 8 * Math.cos((i * 45 - 90) * Math.PI / 180)}
                cy={24 + 8 * Math.sin((i * 45 - 90) * Math.PI / 180)}
                r="2"
                fill={i === 2 ? '#3b82f6' : '#9ca3af'}
              />
            ))}
            {/* Knob */}
            <circle cx="32" cy="24" r="4" fill="#374151"/>
            {/* Terminals */}
            <circle cx="12" cy="24" r="4" fill="#ef4444"/>
            <text x="12" y="26" textAnchor="middle" fontSize="5" fill="white" fontWeight="bold">I</text>
            <circle cx="52" cy="24" r="4" fill="#ef4444"/>
            <text x="52" y="26" textAnchor="middle" fontSize="5" fill="white" fontWeight="bold">O</text>
          </svg>
        );

      case 'fan':
        return (
          <svg viewBox="0 0 64 64" className={className}>
            {/* Motor Body */}
            <circle cx="32" cy="32" r="24" fill="#6b7280" stroke="#4b5563" strokeWidth="2"/>
            <circle cx="32" cy="32" r="16" fill="#9ca3af"/>
            {/* Blades */}
            {[0, 120, 240].map((angle, i) => (
              <ellipse
                key={i}
                cx={32 + 14 * Math.cos((angle - 90) * Math.PI / 180)}
                cy={32 + 14 * Math.sin((angle - 90) * Math.PI / 180)}
                rx="8"
                ry="4"
                fill="#374151"
                transform={`rotate(${angle}, 32, 32)`}
              />
            ))}
            {/* Center Cap */}
            <circle cx="32" cy="32" r="6" fill="#1f2937"/>
            {/* Terminals */}
            <circle cx="12" cy="22" r="4" fill="#ef4444"/>
            <text x="12" y="24" textAnchor="middle" fontSize="5" fill="white" fontWeight="bold">L</text>
            <circle cx="12" cy="34" r="4" fill="#3b82f6"/>
            <text x="12" y="36" textAnchor="middle" fontSize="5" fill="white" fontWeight="bold">N</text>
            <circle cx="32" cy="58" r="4" fill="#22c55e"/>
            <text x="32" y="60" textAnchor="middle" fontSize="5" fill="white" fontWeight="bold">E</text>
          </svg>
        );

      case 'bulb':
        return (
          <svg viewBox="0 0 64 64" className={className}>
            {/* Bulb Glass */}
            <ellipse cx="32" cy="24" rx="16" ry="18" fill="#fef3c7" stroke="#fbbf24" strokeWidth="2"/>
            {/* Filament */}
            <path d="M26 24 Q32 18 38 24 Q32 30 26 24" stroke="#f59e0b" strokeWidth="2" fill="none"/>
            {/* Base */}
            <rect x="24" y="40" width="16" height="8" fill="#6b7280"/>
            <rect x="26" y="48" width="12" height="4" fill="#4b5563"/>
            <rect x="28" y="52" width="8" height="4" fill="#374151"/>
            {/* Terminals */}
            <circle cx="12" cy="24" r="4" fill="#ef4444"/>
            <text x="12" y="26" textAnchor="middle" fontSize="5" fill="white" fontWeight="bold">L</text>
            <circle cx="12" cy="36" r="4" fill="#3b82f6"/>
            <text x="12" y="38" textAnchor="middle" fontSize="5" fill="white" fontWeight="bold">N</text>
          </svg>
        );

      case 'tube':
        return (
          <svg viewBox="0 0 80 48" className={className}>
            {/* Tube Body */}
            <rect x="8" y="16" width="64" height="16" rx="8" fill="#f0fdf4" stroke="#86efac" strokeWidth="2"/>
            {/* End Caps */}
            <rect x="4" y="14" width="8" height="20" rx="2" fill="#6b7280"/>
            <rect x="68" y="14" width="8" height="20" rx="2" fill="#6b7280"/>
            {/* Glow Effect */}
            <rect x="12" y="20" width="56" height="8" rx="4" fill="#bbf7d0"/>
            {/* Terminals */}
            <circle cx="8" cy="10" r="4" fill="#ef4444"/>
            <text x="8" y="12" textAnchor="middle" fontSize="5" fill="white" fontWeight="bold">L</text>
            <circle cx="8" cy="38" r="4" fill="#3b82f6"/>
            <text x="8" y="40" textAnchor="middle" fontSize="5" fill="white" fontWeight="bold">N</text>
            <circle cx="40" cy="42" r="4" fill="#22c55e"/>
            <text x="40" y="44" textAnchor="middle" fontSize="5" fill="white" fontWeight="bold">E</text>
          </svg>
        );

      case 'socket5a':
      case 'socket15a':
        const is15A = type === 'socket15a';
        return (
          <svg viewBox="0 0 64 64" className={className}>
            {/* Socket Plate */}
            <rect x="8" y="8" width="48" height="48" rx="4" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="2"/>
            {/* Socket Face */}
            <rect x="14" y="14" width="36" height="36" rx="3" fill="#fff" stroke="#e5e7eb" strokeWidth="1"/>
            {/* Pin Holes */}
            <circle cx="26" cy="28" r={is15A ? 4 : 3} fill="#374151"/>
            <circle cx="38" cy="28" r={is15A ? 4 : 3} fill="#374151"/>
            <circle cx="32" cy="40" r={is15A ? 4 : 3} fill="#22c55e"/>
            {/* Terminals */}
            <circle cx="12" cy="28" r="4" fill="#ef4444"/>
            <text x="12" y="30" textAnchor="middle" fontSize="5" fill="white" fontWeight="bold">L</text>
            <circle cx="12" cy="40" r="4" fill="#3b82f6"/>
            <text x="12" y="42" textAnchor="middle" fontSize="5" fill="white" fontWeight="bold">N</text>
            <circle cx="32" cy="58" r="4" fill="#22c55e"/>
            <text x="32" y="60" textAnchor="middle" fontSize="5" fill="white" fontWeight="bold">E</text>
            {/* Label */}
            <text x="32" y="22" textAnchor="middle" fontSize="6" fill="#6b7280">{is15A ? '15A' : '5A'}</text>
          </svg>
        );

      case 'inverter':
        return (
          <svg viewBox="0 0 80 64" className={className}>
            {/* Inverter Body */}
            <rect x="4" y="8" width="72" height="48" rx="4" fill="#1f2937" stroke="#111827" strokeWidth="2"/>
            {/* Display */}
            <rect x="12" y="14" width="32" height="16" rx="2" fill="#064e3b"/>
            <text x="28" y="26" textAnchor="middle" fontSize="8" fill="#10b981">INV</text>
            {/* LED Indicators */}
            <circle cx="52" cy="18" r="3" fill="#22c55e"/>
            <circle cx="62" cy="18" r="3" fill="#3b82f6"/>
            <circle cx="52" cy="28" r="3" fill="#eab308"/>
            <circle cx="62" cy="28" r="3" fill="#ef4444"/>
            {/* Vents */}
            <rect x="12" y="36" width="56" height="2" fill="#374151"/>
            <rect x="12" y="42" width="56" height="2" fill="#374151"/>
            <rect x="12" y="48" width="56" height="2" fill="#374151"/>
            {/* DC Terminals */}
            <circle cx="8" cy="24" r="4" fill="#eab308"/>
            <text x="8" y="26" textAnchor="middle" fontSize="5" fill="#1f2937" fontWeight="bold">+</text>
            <circle cx="8" cy="40" r="4" fill="#1f2937" stroke="#6b7280" strokeWidth="1"/>
            <text x="8" y="42" textAnchor="middle" fontSize="5" fill="white" fontWeight="bold">-</text>
            {/* AC In Terminals */}
            <circle cx="28" cy="8" r="4" fill="#ef4444"/>
            <text x="28" y="10" textAnchor="middle" fontSize="5" fill="white" fontWeight="bold">L</text>
            <circle cx="42" cy="8" r="4" fill="#3b82f6"/>
            <text x="42" y="10" textAnchor="middle" fontSize="5" fill="white" fontWeight="bold">N</text>
            {/* AC Out Terminals */}
            <circle cx="72" cy="24" r="4" fill="#ef4444"/>
            <text x="72" y="26" textAnchor="middle" fontSize="5" fill="white" fontWeight="bold">L</text>
            <circle cx="72" cy="40" r="4" fill="#3b82f6"/>
            <text x="72" y="42" textAnchor="middle" fontSize="5" fill="white" fontWeight="bold">N</text>
          </svg>
        );

      case 'battery':
        return (
          <svg viewBox="0 0 80 48" className={className}>
            {/* Battery Body */}
            <rect x="4" y="12" width="64" height="24" rx="2" fill="#1f2937" stroke="#111827" strokeWidth="2"/>
            {/* Battery Terminal Posts */}
            <rect x="68" y="16" width="8" height="6" fill="#ef4444"/>
            <rect x="68" y="26" width="8" height="6" fill="#1f2937" stroke="#6b7280" strokeWidth="1"/>
            {/* Plus/Minus Labels */}
            <text x="72" y="22" textAnchor="middle" fontSize="6" fill="white" fontWeight="bold">+</text>
            <text x="72" y="32" textAnchor="middle" fontSize="6" fill="white" fontWeight="bold">-</text>
            {/* Battery Cells */}
            <rect x="10" y="16" width="10" height="16" fill="#374151"/>
            <rect x="24" y="16" width="10" height="16" fill="#374151"/>
            <rect x="38" y="16" width="10" height="16" fill="#374151"/>
            <rect x="52" y="16" width="10" height="16" fill="#374151"/>
            {/* Voltage Label */}
            <text x="36" y="42" textAnchor="middle" fontSize="8" fill="#6b7280">12V</text>
            {/* Terminal Markers */}
            <circle cx="72" cy="19" r="4" fill="#eab308"/>
            <circle cx="72" cy="29" r="4" fill="#1f2937" stroke="#6b7280" strokeWidth="1"/>
          </svg>
        );

      case 'supply':
        return (
          <svg viewBox="0 0 80 64" className={className}>
            {/* Supply Box Body */}
            <rect x="4" y="8" width="72" height="48" rx="4" fill="#1f2937" stroke="#111827" strokeWidth="2"/>
            {/* Inner Panel */}
            <rect x="10" y="14" width="60" height="36" rx="2" fill="#374151"/>
            {/* AC Symbol */}
            <path d="M 24 32 L 28 20 L 32 44 L 36 20 L 40 32" stroke="#ef4444" strokeWidth="2" fill="none"/>
            <text x="24" y="38" textAnchor="middle" fontSize="8" fill="#ef4444" fontWeight="bold">~</text>
            {/* 230V Label */}
            <text x="32" y="48" textAnchor="middle" fontSize="10" fill="#d1d5db" fontWeight="bold">230V</text>
            {/* Output Terminals */}
            {/* Live terminal */}
            <circle cx="60" cy="20" r="5" fill="#ef4444" stroke="#b91c1c" strokeWidth="2"/>
            <text x="60" y="22" textAnchor="middle" fontSize="6" fill="white" fontWeight="bold">L</text>
            {/* Neutral terminal */}
            <circle cx="60" cy="32" r="5" fill="#3b82f6" stroke="#1e40af" strokeWidth="2"/>
            <text x="60" y="34" textAnchor="middle" fontSize="6" fill="white" fontWeight="bold">N</text>
            {/* Earth terminal */}
            <circle cx="60" cy="44" r="5" fill="#22c55e" stroke="#16a34a" strokeWidth="2"/>
            <text x="60" y="46" textAnchor="middle" fontSize="6" fill="white" fontWeight="bold">E</text>
          </svg>
        );

      case 'dp-mcb':
        return (
          <svg viewBox="0 0 64 64" className={className}>
            {/* DP MCB Body */}
            <rect x="8" y="4" width="48" height="56" rx="3" fill="#374151" stroke="#1f2937" strokeWidth="2"/>
            {/* Two Poles */}
            <rect x="12" y="12" width="18" height="32" rx="2" fill="#6b7280"/>
            <rect x="34" y="12" width="18" height="32" rx="2" fill="#6b7280"/>
            {/* Toggle Switches */}
            <rect x="14" y="14" width="14" height="8" rx="1" fill="#ef4444"/>
            <rect x="36" y="14" width="14" height="8" rx="1" fill="#3b82f6"/>
            {/* Terminals */}
            <circle cx="21" cy="8" r="4" fill="#ef4444" stroke="#b91c1c" strokeWidth="1"/>
            <text x="21" y="10" textAnchor="middle" fontSize="5" fill="white" fontWeight="bold">P</text>
            <circle cx="43" cy="8" r="4" fill="#3b82f6" stroke="#1e40af" strokeWidth="1"/>
            <text x="43" y="10" textAnchor="middle" fontSize="5" fill="white" fontWeight="bold">N</text>
            <circle cx="21" cy="56" r="4" fill="#ef4444"/>
            <circle cx="43" cy="56" r="4" fill="#3b82f6"/>
            {/* Label */}
            <text x="32" y="50" textAnchor="middle" fontSize="6" fill="#d1d5db">DP MCB</text>
          </svg>
        );

      case 'potentiometer':
        return (
          <svg viewBox="0 0 64 64" className={className}>
            {/* Body */}
            <circle cx="32" cy="32" r="24" fill="#8b5a2b" stroke="#6b4423" strokeWidth="2"/>
            <circle cx="32" cy="32" r="18" fill="#a0522d"/>
            {/* Center shaft */}
            <circle cx="32" cy="32" r="8" fill="#c0c0c0" stroke="#999" strokeWidth="1"/>
            <line x1="32" y1="24" x2="32" y2="18" stroke="#666" strokeWidth="3"/>
            {/* 10K label */}
            <rect x="6" y="40" width="16" height="10" fill="#22c55e" rx="2"/>
            <text x="14" y="48" textAnchor="middle" fontSize="6" fill="white" fontWeight="bold">10K</text>
            {/* Terminals */}
            <circle cx="8" cy="32" r="4" fill="#3b82f6"/>
            <text x="8" y="34" textAnchor="middle" fontSize="4" fill="white">T1</text>
            <circle cx="32" cy="58" r="4" fill="#f97316"/>
            <text x="32" y="60" textAnchor="middle" fontSize="4" fill="white">W</text>
            <circle cx="56" cy="32" r="4" fill="#ef4444"/>
            <text x="56" y="34" textAnchor="middle" fontSize="4" fill="white">T2</text>
          </svg>
        );

      case 'mosfet':
        return (
          <svg viewBox="0 0 64 64" className={className}>
            {/* MOSFET Body */}
            <rect x="16" y="8" width="32" height="48" rx="2" fill="#1f2937" stroke="#111827" strokeWidth="2"/>
            {/* Heat sink pattern */}
            <rect x="18" y="10" width="28" height="6" fill="#374151"/>
            <circle cx="32" cy="13" r="3" fill="#111827"/>
            {/* Label */}
            <text x="32" y="28" textAnchor="middle" fontSize="5" fill="#10b981" fontWeight="bold">IRFZ44N</text>
            <text x="32" y="38" textAnchor="middle" fontSize="6" fill="#9ca3af">N-CH</text>
            {/* Pins */}
            <rect x="20" y="48" width="4" height="12" fill="#c0c0c0"/>
            <rect x="30" y="48" width="4" height="12" fill="#c0c0c0"/>
            <rect x="40" y="48" width="4" height="12" fill="#c0c0c0"/>
            {/* Pin labels */}
            <text x="22" y="46" textAnchor="middle" fontSize="5" fill="#9ca3af">G</text>
            <text x="32" y="46" textAnchor="middle" fontSize="5" fill="#9ca3af">D</text>
            <text x="42" y="46" textAnchor="middle" fontSize="5" fill="#9ca3af">S</text>
            {/* Terminal markers */}
            <circle cx="8" cy="32" r="4" fill="#3b82f6"/>
            <text x="8" y="34" textAnchor="middle" fontSize="4" fill="white">G</text>
            <circle cx="32" cy="4" r="4" fill="#ef4444"/>
            <text x="32" y="6" textAnchor="middle" fontSize="4" fill="white">D</text>
            <circle cx="32" cy="60" r="4" fill="#22c55e"/>
            <text x="32" y="62" textAnchor="middle" fontSize="4" fill="white">S</text>
          </svg>
        );

      case 'dc-motor':
        return (
          <svg viewBox="0 0 64 64" className={className}>
            {/* Motor body */}
            <rect x="12" y="16" width="40" height="32" rx="4" fill="#9ca3af" stroke="#6b7280" strokeWidth="2"/>
            {/* Front face */}
            <circle cx="32" cy="32" r="12" fill="#6b7280" stroke="#4b5563" strokeWidth="2"/>
            {/* Shaft */}
            <rect x="44" y="28" width="16" height="8" fill="#4b5563"/>
            <circle cx="58" cy="32" r="4" fill="#374151"/>
            {/* Vent lines */}
            <line x1="16" y1="22" x2="28" y2="22" stroke="#4b5563" strokeWidth="1"/>
            <line x1="16" y1="26" x2="28" y2="26" stroke="#4b5563" strokeWidth="1"/>
            <line x1="16" y1="38" x2="28" y2="38" stroke="#4b5563" strokeWidth="1"/>
            <line x1="16" y1="42" x2="28" y2="42" stroke="#4b5563" strokeWidth="1"/>
            {/* Label */}
            <text x="32" y="56" textAnchor="middle" fontSize="6" fill="#374151" fontWeight="bold">12V DC</text>
            {/* Terminals */}
            <circle cx="32" cy="8" r="4" fill="#ef4444"/>
            <text x="32" y="10" textAnchor="middle" fontSize="5" fill="white">+</text>
            <circle cx="32" cy="56" r="4" fill="#1f2937" stroke="#6b7280" strokeWidth="1"/>
            <text x="32" y="58" textAnchor="middle" fontSize="5" fill="white">-</text>
          </svg>
        );

      case 'single-phase-motor':
        return (
          <svg viewBox="0 0 64 64" className={className}>
            {/* Motor body - blue industrial motor */}
            <ellipse cx="32" cy="40" rx="24" ry="16" fill="#1e40af" stroke="#1e3a8a" strokeWidth="2"/>
            <rect x="10" y="24" width="44" height="20" fill="#2563eb"/>
            <ellipse cx="32" cy="24" rx="22" ry="12" fill="#3b82f6" stroke="#2563eb" strokeWidth="2"/>
            {/* Shaft */}
            <rect x="48" y="30" width="12" height="8" fill="#6b7280"/>
            <ellipse cx="58" cy="34" rx="4" ry="6" fill="#4b5563"/>
            {/* Mounting feet */}
            <rect x="12" y="52" width="8" height="8" fill="#374151"/>
            <rect x="44" y="52" width="8" height="8" fill="#374151"/>
            {/* Terminals on top */}
            <circle cx="24" cy="12" r="4" fill="#ef4444"/>
            <text x="24" y="14" textAnchor="middle" fontSize="5" fill="white">L</text>
            <circle cx="40" cy="12" r="4" fill="#3b82f6"/>
            <text x="40" y="14" textAnchor="middle" fontSize="5" fill="white">N</text>
          </svg>
        );

      case 'voltage-protector':
        return (
          <svg viewBox="0 0 64 72" className={className}>
            {/* Body */}
            <rect x="8" y="4" width="48" height="64" rx="3" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="2"/>
            {/* Display */}
            <rect x="14" y="10" width="36" height="20" rx="2" fill="#064e3b"/>
            <text x="32" y="22" textAnchor="middle" fontSize="8" fill="#10b981" fontWeight="bold">220V</text>
            <text x="32" y="28" textAnchor="middle" fontSize="5" fill="#22c55e">08.6A</text>
            {/* Buttons */}
            <circle cx="20" cy="38" r="4" fill="#374151"/>
            <circle cx="32" cy="38" r="4" fill="#374151"/>
            <circle cx="44" cy="38" r="4" fill="#374151"/>
            {/* LED indicators */}
            <circle cx="24" cy="48" r="2" fill="#22c55e"/>
            <circle cx="40" cy="48" r="2" fill="#ef4444"/>
            {/* Input terminals (top) */}
            <circle cx="20" cy="4" r="4" fill="#ef4444"/>
            <text x="20" y="6" textAnchor="middle" fontSize="4" fill="white">IN</text>
            <circle cx="44" cy="4" r="4" fill="#3b82f6"/>
            {/* Output terminals (bottom) */}
            <circle cx="20" cy="68" r="4" fill="#ef4444"/>
            <text x="20" y="70" textAnchor="middle" fontSize="3" fill="white">OUT</text>
            <circle cx="44" cy="68" r="4" fill="#3b82f6"/>
            {/* Label */}
            <text x="32" y="60" textAnchor="middle" fontSize="5" fill="#6b7280">AVP</text>
          </svg>
        );

      case 'transistor':
        return (
          <svg viewBox="0 0 64 64" className={className}>
            {/* Transistor Body */}
            <rect x="20" y="16" width="24" height="32" rx="4" fill="#1f2937" stroke="#111827" strokeWidth="2"/>
            {/* Label */}
            <text x="32" y="30" textAnchor="middle" fontSize="5" fill="#9ca3af">BC</text>
            <text x="32" y="40" textAnchor="middle" fontSize="6" fill="#10b981" fontWeight="bold">547</text>
            {/* Pins */}
            <rect x="24" y="48" width="4" height="12" fill="#c0c0c0"/>
            <rect x="30" y="48" width="4" height="12" fill="#c0c0c0"/>
            <rect x="36" y="48" width="4" height="12" fill="#c0c0c0"/>
            {/* Terminal markers */}
            <circle cx="32" cy="8" r="4" fill="#ef4444"/>
            <text x="32" y="10" textAnchor="middle" fontSize="5" fill="white">C</text>
            <circle cx="8" cy="32" r="4" fill="#3b82f6"/>
            <text x="8" y="34" textAnchor="middle" fontSize="5" fill="white">B</text>
            <circle cx="32" cy="60" r="4" fill="#22c55e"/>
            <text x="32" y="62" textAnchor="middle" fontSize="5" fill="white">E</text>
          </svg>
        );

      case 'resistor':
        return (
          <svg viewBox="0 0 80 32" className={className}>
            {/* Leads */}
            <line x1="4" y1="16" x2="16" y2="16" stroke="#c0c0c0" strokeWidth="3"/>
            <line x1="64" y1="16" x2="76" y2="16" stroke="#c0c0c0" strokeWidth="3"/>
            {/* Body */}
            <rect x="16" y="6" width="48" height="20" rx="2" fill="#d4b896" stroke="#8b7355" strokeWidth="1"/>
            {/* Color bands */}
            <rect x="20" y="6" width="4" height="20" fill="#a52a2a"/>
            <rect x="28" y="6" width="4" height="20" fill="#000"/>
            <rect x="36" y="6" width="4" height="20" fill="#ff8c00"/>
            <rect x="44" y="6" width="4" height="20" fill="#ffd700"/>
            {/* Terminals */}
            <circle cx="8" cy="16" r="4" fill="#fbbf24"/>
            <text x="8" y="18" textAnchor="middle" fontSize="5" fill="#1f2937">1</text>
            <circle cx="72" cy="16" r="4" fill="#fbbf24"/>
            <text x="72" y="18" textAnchor="middle" fontSize="5" fill="#1f2937">2</text>
          </svg>
        );

      case 'buzzer':
        return (
          <svg viewBox="0 0 64 64" className={className}>
            {/* Body */}
            <circle cx="32" cy="32" r="20" fill="#1f2937" stroke="#111827" strokeWidth="2"/>
            {/* Top */}
            <circle cx="32" cy="32" r="14" fill="#374151"/>
            {/* Sound hole */}
            <circle cx="32" cy="32" r="6" fill="#111827"/>
            {/* Sound waves */}
            <path d="M 38 26 Q 44 32 38 38" stroke="#9ca3af" strokeWidth="2" fill="none"/>
            <path d="M 42 22 Q 52 32 42 42" stroke="#6b7280" strokeWidth="2" fill="none"/>
            {/* Terminals */}
            <circle cx="8" cy="32" r="4" fill="#ef4444"/>
            <text x="8" y="34" textAnchor="middle" fontSize="5" fill="white">+</text>
            <circle cx="56" cy="32" r="4" fill="#1f2937" stroke="#6b7280" strokeWidth="1"/>
            <text x="56" y="34" textAnchor="middle" fontSize="5" fill="white">-</text>
          </svg>
        );

      case 'led':
        return (
          <svg viewBox="0 0 64 64" className={className}>
            {/* LED Body */}
            <ellipse cx="32" cy="28" rx="12" ry="16" fill="#ef4444" stroke="#b91c1c" strokeWidth="2"/>
            {/* Dome highlight */}
            <ellipse cx="28" cy="20" rx="4" ry="6" fill="#fca5a5" opacity="0.5"/>
            {/* Flat bottom */}
            <rect x="22" y="40" width="20" height="4" fill="#dc2626"/>
            {/* Legs */}
            <rect x="26" y="44" width="3" height="16" fill="#c0c0c0"/>
            <rect x="35" y="44" width="3" height="16" fill="#c0c0c0"/>
            {/* Anode longer leg indicator */}
            <rect x="26" y="56" width="3" height="4" fill="#c0c0c0"/>
            {/* Terminals */}
            <circle cx="27" cy="60" r="4" fill="#ef4444"/>
            <text x="27" y="62" textAnchor="middle" fontSize="5" fill="white">+</text>
            <circle cx="37" cy="56" r="4" fill="#1f2937" stroke="#6b7280" strokeWidth="1"/>
            <text x="37" y="58" textAnchor="middle" fontSize="5" fill="white">-</text>
          </svg>
        );

      case 'ir-sensor':
        return (
          <svg viewBox="0 0 64 64" className={className}>
            {/* Sensor body */}
            <ellipse cx="32" cy="20" rx="14" ry="12" fill="#1a1a1a" stroke="#333" strokeWidth="2"/>
            {/* IR window */}
            <ellipse cx="32" cy="18" rx="8" ry="6" fill="#2d1f3d" opacity="0.8"/>
            {/* Dome highlight */}
            <ellipse cx="28" cy="14" rx="3" ry="4" fill="#444" opacity="0.5"/>
            {/* Legs */}
            <rect x="24" y="30" width="4" height="20" fill="#c0c0c0"/>
            <rect x="36" y="30" width="4" height="20" fill="#c0c0c0"/>
            {/* Terminals */}
            <circle cx="26" cy="56" r="4" fill="#ef4444"/>
            <text x="26" y="58" textAnchor="middle" fontSize="5" fill="white">A</text>
            <circle cx="38" cy="56" r="4" fill="#1f2937" stroke="#6b7280" strokeWidth="1"/>
            <text x="38" y="58" textAnchor="middle" fontSize="5" fill="white">C</text>
            {/* IR label */}
            <text x="32" y="62" textAnchor="middle" fontSize="6" fill="#9ca3af">IR</text>
          </svg>
        );

      case 'battery-9v':
        return (
          <svg viewBox="0 0 48 64" className={className}>
            {/* Battery body */}
            <rect x="8" y="16" width="32" height="44" rx="3" fill="#2563eb" stroke="#1e40af" strokeWidth="2"/>
            {/* Top connector */}
            <rect x="12" y="4" width="24" height="14" rx="2" fill="#1f2937"/>
            {/* Snap terminals */}
            <circle cx="18" cy="8" r="4" fill="#ef4444" stroke="#b91c1c" strokeWidth="1"/>
            <text x="18" y="10" textAnchor="middle" fontSize="5" fill="white">+</text>
            <circle cx="30" cy="8" r="4" fill="#1f2937" stroke="#6b7280" strokeWidth="1"/>
            <text x="30" y="10" textAnchor="middle" fontSize="5" fill="white">-</text>
            {/* Label */}
            <rect x="12" y="28" width="24" height="16" fill="#ef4444"/>
            <text x="24" y="38" textAnchor="middle" fontSize="7" fill="white" fontWeight="bold">HW</text>
            <text x="24" y="50" textAnchor="middle" fontSize="6" fill="white">9V</text>
          </svg>
        );

      default:
        return (
          <svg viewBox="0 0 64 64" className={className}>
            <rect x="8" y="8" width="48" height="48" rx="4" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2"/>
            <text x="32" y="36" textAnchor="middle" fontSize="10" fill="#6b7280">?</text>
          </svg>
        );
    }
  };

  return <div className="flex items-center justify-center">{renderIcon()}</div>;
};
