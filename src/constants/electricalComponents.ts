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
    id: 'dp-mcb',
    name: 'DP MCB',
    category: 'power',
    description: 'Double Pole MCB - Disconnects both Live and Neutral',
    icon: 'dp-mcb',
    terminals: [
      { id: 'dpmcb-in-l', type: 'L', label: 'Phase In', position: 'top', color: '#ef4444' },
      { id: 'dpmcb-in-n', type: 'N', label: 'Neutral In', position: 'top', color: '#3b82f6' },
      { id: 'dpmcb-out-l', type: 'OUT', label: 'Phase Out', position: 'bottom', color: '#ef4444' },
      { id: 'dpmcb-out-n', type: 'N', label: 'Neutral Out', position: 'bottom', color: '#3b82f6' },
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
  {
    id: 'potentiometer',
    name: 'Potentiometer 10K',
    category: 'control',
    description: '10K Ohm Variable Resistor for speed/voltage control',
    icon: 'potentiometer',
    terminals: [
      { id: 'pot-t1', type: 'T1', label: 'Terminal 1', position: 'left', color: '#3b82f6' },
      { id: 'pot-wiper', type: 'OUT', label: 'Wiper', position: 'bottom', color: '#f97316' },
      { id: 'pot-t2', type: 'T2', label: 'Terminal 2', position: 'right', color: '#ef4444' },
    ],
  },
  {
    id: 'voltage-protector',
    name: 'Voltage Protector',
    category: 'control',
    description: 'Adjustable Voltage Protector with display',
    icon: 'voltage-protector',
    terminals: [
      { id: 'vp-in-l', type: 'L', label: 'Input Live', position: 'top', color: '#ef4444' },
      { id: 'vp-in-n', type: 'N', label: 'Input Neutral', position: 'top', color: '#3b82f6' },
      { id: 'vp-out-l', type: 'OUT', label: 'Output Live', position: 'bottom', color: '#ef4444' },
      { id: 'vp-out-n', type: 'N', label: 'Output Neutral', position: 'bottom', color: '#3b82f6' },
    ],
  },
  {
    id: 'mosfet-irf',
    name: 'MOSFET IRF Z44N',
    category: 'control',
    description: 'N-Channel Power MOSFET for DC motor control',
    icon: 'mosfet',
    terminals: [
      { id: 'mos-g', type: 'B', label: 'Gate', position: 'left', color: '#3b82f6' },
      { id: 'mos-d', type: 'C', label: 'Drain', position: 'top', color: '#ef4444' },
      { id: 'mos-s', type: 'EM', label: 'Source', position: 'bottom', color: '#22c55e' },
    ],
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
    id: 'dc-motor',
    name: '12V DC Motor',
    category: 'load',
    description: '12V DC Motor for speed control circuits',
    icon: 'dc-motor',
    terminals: [
      { id: 'dcm-pos', type: 'DC+', label: 'Positive', position: 'top', color: '#ef4444' },
      { id: 'dcm-neg', type: 'DC-', label: 'Negative', position: 'bottom', color: '#000000' },
    ],
  },
  {
    id: 'single-phase-motor',
    name: 'Single Phase Motor',
    category: 'load',
    description: 'AC Single Phase Induction Motor',
    icon: 'single-phase-motor',
    terminals: [
      { id: 'spm-l', type: 'L', label: 'Live', position: 'top', color: '#ef4444' },
      { id: 'spm-n', type: 'N', label: 'Neutral', position: 'bottom', color: '#3b82f6' },
    ],
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
    name: 'Battery 12V',
    category: 'backup',
    description: '12V Lead-acid or Lithium battery',
    icon: 'battery',
    terminals: [
      { id: 'bat-pos', type: 'DC+', label: 'Positive (+)', position: 'right', color: '#eab308' },
      { id: 'bat-neg', type: 'DC-', label: 'Negative (-)', position: 'right', color: '#000000' },
    ],
    requiredBy: ['inverter'],
  },

  // Electronics / Fire Alarm Components
  {
    id: 'battery-9v',
    name: '9V Battery',
    category: 'power',
    description: '9V DC Battery source',
    icon: 'battery-9v',
    terminals: [
      { id: 'bat9-pos', type: 'POS', label: 'Positive', position: 'top', color: '#ef4444' },
      { id: 'bat9-neg', type: 'NEG', label: 'Negative', position: 'top', color: '#000000' },
    ],
  },
  {
    id: 'transistor-bc547',
    name: 'BC547 NPN',
    category: 'control',
    description: 'NPN Transistor for switching',
    icon: 'transistor',
    terminals: [
      { id: 'q-c', type: 'C', label: 'Collector', position: 'top', color: '#ef4444' },
      { id: 'q-b', type: 'B', label: 'Base', position: 'left', color: '#3b82f6' },
      { id: 'q-e', type: 'EM', label: 'Emitter', position: 'bottom', color: '#22c55e' },
    ],
  },
  {
    id: 'resistor',
    name: 'Resistor',
    category: 'load',
    description: 'Current limiting resistor',
    icon: 'resistor',
    terminals: [
      { id: 'r-t1', type: 'T1', label: 'T1', position: 'left', color: '#fbbf24' },
      { id: 'r-t2', type: 'T2', label: 'T2', position: 'right', color: '#fbbf24' },
    ],
  },
  {
    id: 'buzzer',
    name: 'Buzzer',
    category: 'load',
    description: 'Piezo electric buzzer',
    icon: 'buzzer',
    terminals: [
      { id: 'buz-pos', type: 'POS', label: 'Positive', position: 'left', color: '#ef4444' },
      { id: 'buz-neg', type: 'NEG', label: 'Negative', position: 'right', color: '#000000' },
    ],
  },
  {
    id: 'led',
    name: 'Red LED',
    category: 'load',
    description: 'Light Emitting Diode',
    icon: 'led',
    terminals: [
      { id: 'led-a', type: 'ANODE', label: 'Anode (+)', position: 'bottom', color: '#ef4444' },
      { id: 'led-c', type: 'CATHODE', label: 'Cathode (-)', position: 'bottom', color: '#000000' },
    ],
  },
  {
    id: 'ir-sensor',
    name: 'IR Sensor',
    category: 'control',
    description: 'IR Receiver Diode',
    icon: 'ir-sensor',
    terminals: [
      { id: 'ir-a', type: 'ANODE', label: 'Anode', position: 'bottom', color: '#ef4444' },
      { id: 'ir-c', type: 'CATHODE', label: 'Cathode', position: 'bottom', color: '#000000' },
    ],
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
