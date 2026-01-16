import { ElectricalComponent } from '@/types/electrical';

export const ELECTRICAL_COMPONENTS: ElectricalComponent[] = [
  // Main Power Supply
  {
    id: 'power-supply',
    name: 'AC Supply',
    category: 'power',
    description: 'Main AC power supply source (230V/50Hz)',
    icon: 'supply',
    terminals: [
      { id: 'supply-l', type: 'L', label: 'Live', position: 'right', color: '#ef4444' },
      { id: 'supply-n', type: 'N', label: 'Neutral', position: 'right', color: '#3b82f6' },
      { id: 'supply-e', type: 'E', label: 'Earth', position: 'bottom', color: '#22c55e' },
    ],
    requiredBy: ['mcb'],
  },
  // Power Source Components
  {
    id: 'mcb',
    name: 'MCB',
    category: 'power',
    description: 'Miniature Circuit Breaker - Main protection device',
    icon: 'mcb',
    terminals: [
      { id: 'mcb-in-l', type: 'L', label: 'Line In', position: 'top', color: '#ef4444' },
      { id: 'mcb-in-n', type: 'N', label: 'Neutral In', position: 'top', color: '#3b82f6' },
      { id: 'mcb-out-l', type: 'OUT', label: 'Line Out', position: 'bottom', color: '#ef4444' },
      { id: 'mcb-out-n', type: 'N', label: 'Neutral Out', position: 'bottom', color: '#3b82f6' },
    ],
    requires: ['power-supply'],
  },
  {
    id: 'distribution-board',
    name: 'Distribution Board',
    category: 'power',
    description: 'Main distribution panel for circuit connections',
    icon: 'db',
    terminals: [
      { id: 'db-in-l', type: 'L', label: 'Live In', position: 'left', color: '#ef4444' },
      { id: 'db-in-n', type: 'N', label: 'Neutral In', position: 'left', color: '#3b82f6' },
      { id: 'db-out-l1', type: 'OUT', label: 'Live Out 1', position: 'right', color: '#ef4444' },
      { id: 'db-out-l2', type: 'OUT', label: 'Live Out 2', position: 'right', color: '#ef4444' },
      { id: 'db-out-n', type: 'N', label: 'Neutral Out', position: 'right', color: '#3b82f6' },
      { id: 'db-e', type: 'E', label: 'Earth', position: 'bottom', color: '#22c55e' },
    ],
  },
  // Control Components
  {
    id: 'switch',
    name: 'Switch',
    category: 'control',
    description: 'Single pole switch for load control',
    icon: 'switch',
    terminals: [
      { id: 'sw-in', type: 'IN', label: 'Input', position: 'left', color: '#ef4444' },
      { id: 'sw-out', type: 'OUT', label: 'Output', position: 'right', color: '#ef4444' },
    ],
  },
  {
    id: 'regulator',
    name: 'Fan Regulator',
    category: 'control',
    description: 'Speed control regulator for ceiling fans',
    icon: 'regulator',
    terminals: [
      { id: 'reg-in', type: 'IN', label: 'Input', position: 'left', color: '#ef4444' },
      { id: 'reg-out', type: 'OUT', label: 'Output', position: 'right', color: '#ef4444' },
    ],
    requiredBy: ['fan'],
  },
  // Load Components
  {
    id: 'fan',
    name: 'Ceiling Fan',
    category: 'load',
    description: 'Standard ceiling fan with capacitor',
    icon: 'fan',
    terminals: [
      { id: 'fan-l', type: 'L', label: 'Live', position: 'bottom', color: '#ef4444' },
      { id: 'fan-n', type: 'N', label: 'Neutral', position: 'bottom', color: '#3b82f6' },
      { id: 'fan-e', type: 'E', label: 'Earth', position: 'left', color: '#22c55e' },
    ],
    requires: ['switch', 'regulator'],
  },
  {
    id: 'light-bulb',
    name: 'Light Bulb',
    category: 'load',
    description: 'Standard incandescent or LED bulb',
    icon: 'bulb',
    terminals: [
      { id: 'bulb-l', type: 'L', label: 'Live', position: 'bottom', color: '#ef4444' },
      { id: 'bulb-n', type: 'N', label: 'Neutral', position: 'bottom', color: '#3b82f6' },
    ],
    requires: ['switch'],
  },
  {
    id: 'light-tube',
    name: 'Tube Light',
    category: 'load',
    description: 'Fluorescent tube light with choke',
    icon: 'tube',
    terminals: [
      { id: 'tube-l', type: 'L', label: 'Live', position: 'bottom', color: '#ef4444' },
      { id: 'tube-n', type: 'N', label: 'Neutral', position: 'bottom', color: '#3b82f6' },
      { id: 'tube-e', type: 'E', label: 'Earth', position: 'left', color: '#22c55e' },
    ],
    requires: ['switch'],
  },
  {
    id: 'socket-5a',
    name: 'Socket 5A',
    category: 'load',
    description: '5 Amp socket for light appliances',
    icon: 'socket5a',
    terminals: [
      { id: 'sock5-l', type: 'L', label: 'Live', position: 'bottom', color: '#ef4444' },
      { id: 'sock5-n', type: 'N', label: 'Neutral', position: 'bottom', color: '#3b82f6' },
      { id: 'sock5-e', type: 'E', label: 'Earth', position: 'left', color: '#22c55e' },
    ],
  },
  {
    id: 'socket-15a',
    name: 'Socket 15A',
    category: 'load',
    description: '15 Amp socket for heavy appliances',
    icon: 'socket15a',
    terminals: [
      { id: 'sock15-l', type: 'L', label: 'Live', position: 'bottom', color: '#ef4444' },
      { id: 'sock15-n', type: 'N', label: 'Neutral', position: 'bottom', color: '#3b82f6' },
      { id: 'sock15-e', type: 'E', label: 'Earth', position: 'left', color: '#22c55e' },
    ],
  },
  // Backup Power Components
  {
    id: 'inverter',
    name: 'Inverter',
    category: 'backup',
    description: 'Power inverter for backup supply',
    icon: 'inverter',
    terminals: [
      { id: 'inv-dc-pos', type: 'DC+', label: 'DC+', position: 'left', color: '#eab308' },
      { id: 'inv-dc-neg', type: 'DC-', label: 'DC-', position: 'left', color: '#000000' },
      { id: 'inv-ac-in-l', type: 'L', label: 'AC In L', position: 'top', color: '#ef4444' },
      { id: 'inv-ac-in-n', type: 'N', label: 'AC In N', position: 'top', color: '#3b82f6' },
      { id: 'inv-ac-out-l', type: 'AC_OUT_L', label: 'AC Out L', position: 'right', color: '#ef4444' },
      { id: 'inv-ac-out-n', type: 'AC_OUT_N', label: 'AC Out N', position: 'right', color: '#3b82f6' },
    ],
    requires: ['battery'],
  },
  {
    id: 'battery',
    name: 'Battery',
    category: 'backup',
    description: '12V Lead-acid or Lithium battery',
    icon: 'battery',
    terminals: [
      { id: 'bat-pos', type: 'DC+', label: 'Positive (+)', position: 'right', color: '#eab308' },
      { id: 'bat-neg', type: 'DC-', label: 'Negative (-)', position: 'right', color: '#000000' },
    ],
    requiredBy: ['inverter'],
  },
];

export const WIRE_COLORS = {
  live: '#ef4444',    // Red
  neutral: '#3b82f6', // Blue
  earth: '#22c55e',   // Green
  dc: '#eab308',      // Yellow
} as const;

export const COMPONENT_CATEGORIES = {
  power: { label: 'Power Source', order: 1 },
  control: { label: 'Control Devices', order: 2 },
  load: { label: 'Electrical Loads', order: 3 },
  backup: { label: 'Backup Power', order: 4 },
} as const;
