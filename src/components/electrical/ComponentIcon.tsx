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
