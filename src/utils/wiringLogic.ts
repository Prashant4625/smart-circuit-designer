import { Node, Edge } from 'reactflow';
import { ELECTRICAL_COMPONENTS, WIRE_COLORS } from '@/constants/electricalComponents';

interface WiringResult {
  nodes: Node[];
  edges: Edge[];
}

// Generate wiring for a new node added at a specific position
export function generateAutoWiringForNewNode(
  existingNodes: Node[],
  existingEdges: Edge[],
  newComponentId: string
): Edge[] {
  const newEdges: Edge[] = [...existingEdges];
  const existingComponentIds = existingNodes.map(n => n.data.componentId);
  
  // Add automatic connections based on the new component
  const hasDB = existingComponentIds.includes('distribution-board');
  const hasSwitch = existingComponentIds.includes('switch');
  const hasRegulator = existingComponentIds.includes('regulator');
  
  if (newComponentId === 'fan' && hasRegulator) {
    // Connect regulator to fan
    newEdges.push({
      id: `reg-to-fan-${Date.now()}`,
      source: 'regulator',
      target: newComponentId,
      sourceHandle: 'reg-out',
      targetHandle: 'fan-l',
      style: { stroke: WIRE_COLORS.live, strokeWidth: 3 },
      animated: true,
    });
  }
  
  return newEdges;
}

export function generateWiringDiagram(selectedComponentIds: string[]): WiringResult {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Get selected components
  const selectedComponents = selectedComponentIds
    .map(id => ELECTRICAL_COMPONENTS.find(c => c.id === id))
    .filter(Boolean);

  // Position components by category
  const categoryPositions = {
    power: { x: 50, baseY: 100 },
    backup: { x: 50, baseY: 350 },
    control: { x: 300, baseY: 100 },
    load: { x: 550, baseY: 100 },
  };

  const categoryCounters: Record<string, number> = {
    power: 0,
    backup: 0,
    control: 0,
    load: 0,
  };

  // Create nodes for each selected component
  selectedComponents.forEach((component) => {
    if (!component) return;
    
    const pos = categoryPositions[component.category];
    const count = categoryCounters[component.category];
    
    nodes.push({
      id: component.id,
      type: 'electrical',
      position: {
        x: pos.x,
        y: pos.baseY + count * 150,
      },
      data: {
        componentId: component.id,
        label: component.name,
      },
    });

    categoryCounters[component.category]++;
  });

  // Generate automatic wiring connections based on electrical rules
  const hasMCB = selectedComponentIds.includes('mcb');
  const hasDB = selectedComponentIds.includes('distribution-board');
  const hasSwitch = selectedComponentIds.includes('switch');
  const hasRegulator = selectedComponentIds.includes('regulator');
  const hasInverter = selectedComponentIds.includes('inverter');
  const hasBattery = selectedComponentIds.includes('battery');

  // MCB to Distribution Board
  if (hasMCB && hasDB) {
    edges.push({
      id: 'mcb-to-db',
      source: 'mcb',
      target: 'distribution-board',
      sourceHandle: 'mcb-out-l',
      targetHandle: 'db-in-l',
      style: { stroke: WIRE_COLORS.live, strokeWidth: 3 },
      animated: true,
      label: 'Live',
      labelStyle: { fill: WIRE_COLORS.live, fontWeight: 600 },
    });
  }

  // Distribution Board to Switch (for controlled loads)
  if (hasDB && hasSwitch) {
    edges.push({
      id: 'db-to-switch',
      source: 'distribution-board',
      target: 'switch',
      sourceHandle: 'db-out-l1',
      targetHandle: 'sw-in',
      style: { stroke: WIRE_COLORS.live, strokeWidth: 3 },
      animated: true,
    });
  }

  // Switch to Regulator (for fan)
  if (hasSwitch && hasRegulator) {
    edges.push({
      id: 'switch-to-reg',
      source: 'switch',
      target: 'regulator',
      sourceHandle: 'sw-out',
      targetHandle: 'reg-in',
      style: { stroke: WIRE_COLORS.live, strokeWidth: 3 },
      animated: true,
    });
  }

  // Regulator to Fan
  if (hasRegulator && selectedComponentIds.includes('fan')) {
    edges.push({
      id: 'reg-to-fan',
      source: 'regulator',
      target: 'fan',
      sourceHandle: 'reg-out',
      targetHandle: 'fan-l',
      style: { stroke: WIRE_COLORS.live, strokeWidth: 3 },
      animated: true,
    });

    // Neutral connection for fan
    if (hasDB) {
      edges.push({
        id: 'db-to-fan-n',
        source: 'distribution-board',
        target: 'fan',
        sourceHandle: 'db-out-n',
        targetHandle: 'fan-n',
        style: { stroke: WIRE_COLORS.neutral, strokeWidth: 3 },
      });

      // Earth connection for fan
      edges.push({
        id: 'db-to-fan-e',
        source: 'distribution-board',
        target: 'fan',
        sourceHandle: 'db-e',
        targetHandle: 'fan-e',
        style: { stroke: WIRE_COLORS.earth, strokeWidth: 3 },
      });
    }
  }

  // Light connections
  const lightTypes = ['light-bulb', 'light-tube'];
  lightTypes.forEach((lightId) => {
    if (selectedComponentIds.includes(lightId)) {
      // Switch to Light
      if (hasSwitch && !hasRegulator) {
        edges.push({
          id: `switch-to-${lightId}`,
          source: 'switch',
          target: lightId,
          sourceHandle: 'sw-out',
          targetHandle: lightId === 'light-bulb' ? 'bulb-l' : 'tube-l',
          style: { stroke: WIRE_COLORS.live, strokeWidth: 3 },
          animated: true,
        });
      } else if (hasDB && !hasSwitch) {
        // Direct from DB if no switch
        edges.push({
          id: `db-to-${lightId}`,
          source: 'distribution-board',
          target: lightId,
          sourceHandle: 'db-out-l2',
          targetHandle: lightId === 'light-bulb' ? 'bulb-l' : 'tube-l',
          style: { stroke: WIRE_COLORS.live, strokeWidth: 3 },
          animated: true,
        });
      }

      // Neutral for lights
      if (hasDB) {
        edges.push({
          id: `db-to-${lightId}-n`,
          source: 'distribution-board',
          target: lightId,
          sourceHandle: 'db-out-n',
          targetHandle: lightId === 'light-bulb' ? 'bulb-n' : 'tube-n',
          style: { stroke: WIRE_COLORS.neutral, strokeWidth: 3 },
        });

        // Earth for tube light
        if (lightId === 'light-tube') {
          edges.push({
            id: `db-to-${lightId}-e`,
            source: 'distribution-board',
            target: lightId,
            sourceHandle: 'db-e',
            targetHandle: 'tube-e',
            style: { stroke: WIRE_COLORS.earth, strokeWidth: 3 },
          });
        }
      }
    }
  });

  // Socket connections
  const socketTypes = ['socket-5a', 'socket-15a'];
  socketTypes.forEach((socketId) => {
    if (selectedComponentIds.includes(socketId)) {
      if (hasDB) {
        // Direct from DB
        edges.push({
          id: `db-to-${socketId}`,
          source: 'distribution-board',
          target: socketId,
          sourceHandle: 'db-out-l2',
          targetHandle: socketId === 'socket-5a' ? 'sock5-l' : 'sock15-l',
          style: { stroke: WIRE_COLORS.live, strokeWidth: 3 },
          animated: true,
        });

        edges.push({
          id: `db-to-${socketId}-n`,
          source: 'distribution-board',
          target: socketId,
          sourceHandle: 'db-out-n',
          targetHandle: socketId === 'socket-5a' ? 'sock5-n' : 'sock15-n',
          style: { stroke: WIRE_COLORS.neutral, strokeWidth: 3 },
        });

        edges.push({
          id: `db-to-${socketId}-e`,
          source: 'distribution-board',
          target: socketId,
          sourceHandle: 'db-e',
          targetHandle: socketId === 'socket-5a' ? 'sock5-e' : 'sock15-e',
          style: { stroke: WIRE_COLORS.earth, strokeWidth: 3 },
        });
      }
    }
  });

  // Battery to Inverter (DC connections)
  if (hasBattery && hasInverter) {
    edges.push({
      id: 'battery-to-inv-pos',
      source: 'battery',
      target: 'inverter',
      sourceHandle: 'bat-pos',
      targetHandle: 'inv-dc-pos',
      style: { stroke: WIRE_COLORS.dc, strokeWidth: 4 },
      animated: true,
      label: 'DC+',
      labelStyle: { fill: WIRE_COLORS.dc, fontWeight: 600 },
    });

    edges.push({
      id: 'battery-to-inv-neg',
      source: 'battery',
      target: 'inverter',
      sourceHandle: 'bat-neg',
      targetHandle: 'inv-dc-neg',
      style: { stroke: '#1f2937', strokeWidth: 4 },
      label: 'DC-',
      labelStyle: { fill: '#1f2937', fontWeight: 600 },
    });
  }

  // Inverter AC connections
  if (hasInverter && hasDB) {
    edges.push({
      id: 'db-to-inv-ac-in-l',
      source: 'distribution-board',
      target: 'inverter',
      sourceHandle: 'db-out-l1',
      targetHandle: 'inv-ac-in-l',
      style: { stroke: WIRE_COLORS.live, strokeWidth: 3 },
    });

    edges.push({
      id: 'db-to-inv-ac-in-n',
      source: 'distribution-board',
      target: 'inverter',
      sourceHandle: 'db-out-n',
      targetHandle: 'inv-ac-in-n',
      style: { stroke: WIRE_COLORS.neutral, strokeWidth: 3 },
    });
  }

  return { nodes, edges };
}

export function generateWiringExplanation(selectedComponentIds: string[]): string[] {
  const explanations: string[] = [];

  const hasMCB = selectedComponentIds.includes('mcb');
  const hasDB = selectedComponentIds.includes('distribution-board');
  const hasSwitch = selectedComponentIds.includes('switch');
  const hasRegulator = selectedComponentIds.includes('regulator');
  const hasFan = selectedComponentIds.includes('fan');
  const hasInverter = selectedComponentIds.includes('inverter');
  const hasBattery = selectedComponentIds.includes('battery');

  if (hasMCB) {
    explanations.push("🔌 MCB (Miniature Circuit Breaker) is the main protection device. All power flows through it first.");
  }

  if (hasDB) {
    explanations.push("📦 Distribution Board receives power from MCB and distributes it to various circuits. It has separate bus bars for Live (Red), Neutral (Blue), and Earth (Green).");
  }

  if (hasFan && hasSwitch && hasRegulator) {
    explanations.push("🌀 Ceiling Fan wiring: Live wire → Switch → Regulator → Fan. The regulator controls speed by varying voltage.");
  }

  if (selectedComponentIds.includes('light-bulb') || selectedComponentIds.includes('light-tube')) {
    explanations.push("💡 Light fixtures: Live wire → Switch → Light. Neutral connects directly from DB to the light.");
  }

  if (selectedComponentIds.includes('socket-5a') || selectedComponentIds.includes('socket-15a')) {
    explanations.push("🔌 Sockets: Directly connected to DB with Live, Neutral, and Earth. No switch needed for continuous power availability.");
  }

  if (hasInverter && hasBattery) {
    explanations.push("🔋 Inverter System: Battery connects to Inverter via DC+ (Yellow) and DC- (Black) cables. Inverter converts DC to AC for backup power.");
  }

  explanations.push("");
  explanations.push("⚡ Wire Color Code:");
  explanations.push("   🔴 Red = Live (L) - Carries current from source");
  explanations.push("   🔵 Blue = Neutral (N) - Return path for current");
  explanations.push("   🟢 Green = Earth (E) - Safety grounding");
  explanations.push("   🟡 Yellow = DC connections");

  return explanations;
}
