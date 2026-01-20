// Terminal types for electrical components
export type TerminalType = 'L' | 'N' | 'E' | 'DC+' | 'DC-' | 'AC_OUT_L' | 'AC_OUT_N' | 'IN' | 'OUT' | 'C' | 'B' | 'EM' | 'ANODE' | 'CATHODE' | 'T1' | 'T2' | 'POS' | 'NEG';

export interface Terminal {
  id: string;
  type: TerminalType;
  label: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  color: string;
}

export interface ElectricalComponent {
  id: string;
  name: string;
  category: 'power' | 'control' | 'load' | 'backup';
  description: string;
  terminals: Terminal[];
  icon: string;
  requiredBy?: string[]; // Components that require this one
  requires?: string[]; // Components this one requires
}

export interface SelectedComponent {
  componentId: string;
  enabled: boolean;
}

export interface DiagramNode {
  id: string;
  componentId: string;
  position: { x: number; y: number };
}

export interface WireConnection {
  id: string;
  sourceNodeId: string;
  sourceTerminal: string;
  targetNodeId: string;
  targetTerminal: string;
  wireType: 'live' | 'neutral' | 'earth' | 'dc';
}

export interface DiagramState {
  nodes: DiagramNode[];
  connections: WireConnection[];
  selectedComponents: string[];
}

export interface ValidationError {
  componentId: string;
  message: string;
  requiredComponents: string[];
}

// Circuit status for validation
export interface CircuitStatus {
  isClosed: boolean;
  message: string;
  isWorking: boolean; // Indicates if devices should be shown as working
}