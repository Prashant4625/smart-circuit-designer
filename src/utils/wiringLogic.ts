import { Node, Edge } from 'reactflow';
import { ELECTRICAL_COMPONENTS, WIRE_COLORS } from '@/constants/electricalComponents';

interface WiringResult {
  nodes: Node[];
  edges: Edge[];
}

// Define correct connection rules for validation
export interface CorrectConnection {
  source: string;
  sourceHandle: string;
  target: string;
  targetHandle: string;
  wireType: 'live' | 'neutral' | 'earth' | 'dc';
  description: string;
}

// Get all correct connections based on selected components
export function getCorrectConnections(selectedComponentIds: string[]): CorrectConnection[] {
  const connections: CorrectConnection[] = [];
  
  const hasMCB = selectedComponentIds.includes('mcb');
  const hasDB = selectedComponentIds.includes('distribution-board');
  const hasSwitch = selectedComponentIds.includes('switch');
  const hasRegulator = selectedComponentIds.includes('regulator');
  const hasFan = selectedComponentIds.includes('fan');
  const hasInverter = selectedComponentIds.includes('inverter');
  const hasBattery = selectedComponentIds.includes('battery');
  const hasLightBulb = selectedComponentIds.includes('light-bulb');
  const hasLightTube = selectedComponentIds.includes('light-tube');
  const hasSocket5A = selectedComponentIds.includes('socket-5a');
  const hasSocket15A = selectedComponentIds.includes('socket-15a');

  // MCB to Distribution Board
  if (hasMCB && hasDB) {
    connections.push({
      source: 'mcb',
      sourceHandle: 'mcb-out-l',
      target: 'distribution-board',
      targetHandle: 'db-in-l',
      wireType: 'live',
      description: 'MCB output to Distribution Board live input',
    });
  }

  // Distribution Board to Switch
  if (hasDB && hasSwitch) {
    connections.push({
      source: 'distribution-board',
      sourceHandle: 'db-out-l1',
      target: 'switch',
      targetHandle: 'sw-in',
      wireType: 'live',
      description: 'Distribution Board live to Switch input',
    });
  }

  // Switch to Regulator (for fan)
  if (hasSwitch && hasRegulator) {
    connections.push({
      source: 'switch',
      sourceHandle: 'sw-out',
      target: 'regulator',
      targetHandle: 'reg-in',
      wireType: 'live',
      description: 'Switch output to Regulator input',
    });
  }

  // Regulator to Fan - closed circuit
  if (hasRegulator && hasFan) {
    connections.push({
      source: 'regulator',
      sourceHandle: 'reg-out',
      target: 'fan',
      targetHandle: 'fan-l',
      wireType: 'live',
      description: 'Regulator output to Fan live terminal',
    });
    
    if (hasDB) {
      connections.push({
        source: 'distribution-board',
        sourceHandle: 'db-out-n',
        target: 'fan',
        targetHandle: 'fan-n',
        wireType: 'neutral',
        description: 'Distribution Board neutral to Fan neutral (return path)',
      });
      connections.push({
        source: 'distribution-board',
        sourceHandle: 'db-e',
        target: 'fan',
        targetHandle: 'fan-e',
        wireType: 'earth',
        description: 'Distribution Board earth to Fan earth (safety ground)',
      });
    }
  }

  // Light connections - closed circuits
  if (hasLightBulb) {
    if (hasSwitch && !hasRegulator) {
      connections.push({
        source: 'switch',
        sourceHandle: 'sw-out',
        target: 'light-bulb',
        targetHandle: 'bulb-l',
        wireType: 'live',
        description: 'Switch output to Light Bulb live',
      });
    } else if (hasDB && !hasSwitch) {
      connections.push({
        source: 'distribution-board',
        sourceHandle: 'db-out-l2',
        target: 'light-bulb',
        targetHandle: 'bulb-l',
        wireType: 'live',
        description: 'Distribution Board live to Light Bulb',
      });
    }
    if (hasDB) {
      connections.push({
        source: 'distribution-board',
        sourceHandle: 'db-out-n',
        target: 'light-bulb',
        targetHandle: 'bulb-n',
        wireType: 'neutral',
        description: 'Distribution Board neutral to Light Bulb neutral (return path)',
      });
    }
  }

  if (hasLightTube) {
    if (hasSwitch && !hasRegulator) {
      connections.push({
        source: 'switch',
        sourceHandle: 'sw-out',
        target: 'light-tube',
        targetHandle: 'tube-l',
        wireType: 'live',
        description: 'Switch output to Tube Light live',
      });
    } else if (hasDB && !hasSwitch) {
      connections.push({
        source: 'distribution-board',
        sourceHandle: 'db-out-l2',
        target: 'light-tube',
        targetHandle: 'tube-l',
        wireType: 'live',
        description: 'Distribution Board live to Tube Light',
      });
    }
    if (hasDB) {
      connections.push({
        source: 'distribution-board',
        sourceHandle: 'db-out-n',
        target: 'light-tube',
        targetHandle: 'tube-n',
        wireType: 'neutral',
        description: 'Distribution Board neutral to Tube Light neutral (return path)',
      });
      connections.push({
        source: 'distribution-board',
        sourceHandle: 'db-e',
        target: 'light-tube',
        targetHandle: 'tube-e',
        wireType: 'earth',
        description: 'Distribution Board earth to Tube Light earth (safety ground)',
      });
    }
  }

  // Socket connections - closed circuits
  if (hasSocket5A && hasDB) {
    connections.push({
      source: 'distribution-board',
      sourceHandle: 'db-out-l2',
      target: 'socket-5a',
      targetHandle: 'sock5-l',
      wireType: 'live',
      description: 'Distribution Board live to 5A Socket live',
    });
    connections.push({
      source: 'distribution-board',
      sourceHandle: 'db-out-n',
      target: 'socket-5a',
      targetHandle: 'sock5-n',
      wireType: 'neutral',
      description: 'Distribution Board neutral to 5A Socket neutral (return path)',
    });
    connections.push({
      source: 'distribution-board',
      sourceHandle: 'db-e',
      target: 'socket-5a',
      targetHandle: 'sock5-e',
      wireType: 'earth',
      description: 'Distribution Board earth to 5A Socket earth (safety ground)',
    });
  }

  if (hasSocket15A && hasDB) {
    connections.push({
      source: 'distribution-board',
      sourceHandle: 'db-out-l2',
      target: 'socket-15a',
      targetHandle: 'sock15-l',
      wireType: 'live',
      description: 'Distribution Board live to 15A Socket live',
    });
    connections.push({
      source: 'distribution-board',
      sourceHandle: 'db-out-n',
      target: 'socket-15a',
      targetHandle: 'sock15-n',
      wireType: 'neutral',
      description: 'Distribution Board neutral to 15A Socket neutral (return path)',
    });
    connections.push({
      source: 'distribution-board',
      sourceHandle: 'db-e',
      target: 'socket-15a',
      targetHandle: 'sock15-e',
      wireType: 'earth',
      description: 'Distribution Board earth to 15A Socket earth (safety ground)',
    });
  }

  // Battery to Inverter (DC connections)
  if (hasBattery && hasInverter) {
    connections.push({
      source: 'battery',
      sourceHandle: 'bat-pos',
      target: 'inverter',
      targetHandle: 'inv-dc-pos',
      wireType: 'dc',
      description: 'Battery positive to Inverter DC+ (power input)',
    });
    connections.push({
      source: 'battery',
      sourceHandle: 'bat-neg',
      target: 'inverter',
      targetHandle: 'inv-dc-neg',
      wireType: 'dc',
      description: 'Battery negative to Inverter DC- (return path)',
    });
  }

  // Inverter AC connections
  if (hasInverter && hasDB) {
    connections.push({
      source: 'distribution-board',
      sourceHandle: 'db-out-l1',
      target: 'inverter',
      targetHandle: 'inv-ac-in-l',
      wireType: 'live',
      description: 'Distribution Board live to Inverter AC input',
    });
    connections.push({
      source: 'distribution-board',
      sourceHandle: 'db-out-n',
      target: 'inverter',
      targetHandle: 'inv-ac-in-n',
      wireType: 'neutral',
      description: 'Distribution Board neutral to Inverter AC neutral',
    });
  }

  return connections;
}

// Validate user connections against correct connections
export interface ConnectionValidationResult {
  isValid: boolean;
  correctConnections: CorrectConnection[];
  incorrectEdges: { edge: Edge; reason: string; suggestion?: CorrectConnection }[];
  missingConnections: CorrectConnection[];
  correctEdges: Edge[];
  score: number;
  totalExpected: number;
}

export function validateUserConnections(
  edges: Edge[],
  nodes: Node[],
): ConnectionValidationResult {
  const selectedComponentIds = nodes.map(n => n.data.componentId);
  const correctConnections = getCorrectConnections(selectedComponentIds);
  
  const correctEdges: Edge[] = [];
  const incorrectEdges: { edge: Edge; reason: string; suggestion?: CorrectConnection }[] = [];
  const foundConnections = new Set<string>();
  
  // Check each user edge
  edges.forEach(edge => {
    // Find the actual component IDs from node IDs
    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);
    
    if (!sourceNode || !targetNode) return;
    
    const sourceComponentId = sourceNode.data.componentId;
    const targetComponentId = targetNode.data.componentId;
    
    // Check if this matches any correct connection
    const matchingCorrect = correctConnections.find(cc => 
      cc.source === sourceComponentId &&
      cc.target === targetComponentId &&
      cc.sourceHandle === edge.sourceHandle &&
      cc.targetHandle === edge.targetHandle
    );
    
    // Also check reverse direction (some connections can be bidirectional)
    const matchingCorrectReverse = correctConnections.find(cc =>
      cc.source === targetComponentId &&
      cc.target === sourceComponentId &&
      cc.sourceHandle === edge.targetHandle &&
      cc.targetHandle === edge.sourceHandle
    );
    
    if (matchingCorrect) {
      correctEdges.push(edge);
      foundConnections.add(`${matchingCorrect.source}-${matchingCorrect.sourceHandle}-${matchingCorrect.target}-${matchingCorrect.targetHandle}`);
    } else if (matchingCorrectReverse) {
      correctEdges.push(edge);
      foundConnections.add(`${matchingCorrectReverse.source}-${matchingCorrectReverse.sourceHandle}-${matchingCorrectReverse.target}-${matchingCorrectReverse.targetHandle}`);
    } else {
      // Find a suggestion for what should connect to this component
      const suggestionForSource = correctConnections.find(cc => 
        cc.source === sourceComponentId && cc.sourceHandle === edge.sourceHandle
      );
      const suggestionForTarget = correctConnections.find(cc =>
        cc.target === targetComponentId && cc.targetHandle === edge.targetHandle
      );
      
      let reason = `Invalid connection from ${sourceComponentId} to ${targetComponentId}`;
      if (suggestionForSource) {
        reason = `${edge.sourceHandle} should connect to ${suggestionForSource.target} (${suggestionForSource.targetHandle})`;
      } else if (suggestionForTarget) {
        reason = `${edge.targetHandle} should receive connection from ${suggestionForTarget.source} (${suggestionForTarget.sourceHandle})`;
      }
      
      incorrectEdges.push({
        edge,
        reason,
        suggestion: suggestionForSource || suggestionForTarget,
      });
    }
  });
  
  // Find missing connections
  const missingConnections = correctConnections.filter(cc => 
    !foundConnections.has(`${cc.source}-${cc.sourceHandle}-${cc.target}-${cc.targetHandle}`)
  );
  
  const totalExpected = correctConnections.length;
  const score = correctEdges.length;
  const isValid = incorrectEdges.length === 0 && missingConnections.length === 0;
  
  return {
    isValid,
    correctConnections,
    incorrectEdges,
    missingConnections,
    correctEdges,
    score,
    totalExpected,
  };
}

// Generate closed-loop circuit diagram layout like traditional circuit diagrams
export function generateWiringDiagram(selectedComponentIds: string[]): WiringResult {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Get selected components
  const selectedComponents = selectedComponentIds
    .map(id => ELECTRICAL_COMPONENTS.find(c => c.id === id))
    .filter(Boolean);

  if (selectedComponents.length === 0) {
    return { nodes, edges };
  }

  const hasMCB = selectedComponentIds.includes('mcb');
  const hasDB = selectedComponentIds.includes('distribution-board');
  const hasSwitch = selectedComponentIds.includes('switch');
  const hasRegulator = selectedComponentIds.includes('regulator');
  const hasFan = selectedComponentIds.includes('fan');
  const hasInverter = selectedComponentIds.includes('inverter');
  const hasBattery = selectedComponentIds.includes('battery');

  // Layout for closed circuit visualization
  // Power source at bottom-left, controls in middle-bottom, load at top
  // This creates a visual "loop" like the reference image
  
  const layoutPositions: Record<string, { x: number; y: number }> = {};
  
  // Determine layout based on components
  if (hasFan && hasSwitch && hasRegulator) {
    // Fan circuit layout (like reference image)
    // Fan at top center, Switch and Regulator at bottom, AC Supply implied through DB
    layoutPositions['fan'] = { x: 350, y: 50 };
    layoutPositions['switch'] = { x: 200, y: 350 };
    layoutPositions['regulator'] = { x: 450, y: 350 };
    layoutPositions['distribution-board'] = { x: 50, y: 350 };
    layoutPositions['mcb'] = { x: 50, y: 200 };
  } else {
    // Generic layout - arrange in circuit flow pattern
    let yOffset = 50;
    let xPower = 50;
    let xControl = 300;
    let xLoad = 550;
    let loadY = 50;
    let controlY = 300;
    let powerY = 300;
    
    // Position power components on bottom-left
    if (hasMCB) {
      layoutPositions['mcb'] = { x: xPower, y: powerY - 150 };
    }
    if (hasDB) {
      layoutPositions['distribution-board'] = { x: xPower, y: powerY };
    }
    
    // Position control components at bottom-center
    let controlCount = 0;
    if (hasSwitch) {
      layoutPositions['switch'] = { x: xControl + controlCount * 180, y: controlY };
      controlCount++;
    }
    if (hasRegulator) {
      layoutPositions['regulator'] = { x: xControl + controlCount * 180, y: controlY };
      controlCount++;
    }
    
    // Position load components at top
    let loadCount = 0;
    const loadComponents = ['fan', 'light-bulb', 'light-tube', 'socket-5a', 'socket-15a'];
    loadComponents.forEach(loadId => {
      if (selectedComponentIds.includes(loadId)) {
        layoutPositions[loadId] = { x: xLoad - 200 + loadCount * 180, y: loadY };
        loadCount++;
      }
    });
    
    // Position backup components
    if (hasBattery) {
      layoutPositions['battery'] = { x: 50, y: 500 };
    }
    if (hasInverter) {
      layoutPositions['inverter'] = { x: 250, y: 500 };
    }
  }

  // Create nodes with positions
  selectedComponents.forEach((component) => {
    if (!component) return;
    
    const pos = layoutPositions[component.id] || { x: 100, y: 100 };
    
    nodes.push({
      id: component.id,
      type: 'electrical',
      position: pos,
      data: {
        componentId: component.id,
        label: component.name,
      },
    });
  });

  // Generate proper closed circuit connections
  const correctConnections = getCorrectConnections(selectedComponentIds);
  
  correctConnections.forEach((conn, index) => {
    const wireColor = conn.wireType === 'live' ? WIRE_COLORS.live :
                      conn.wireType === 'neutral' ? WIRE_COLORS.neutral :
                      conn.wireType === 'earth' ? WIRE_COLORS.earth :
                      WIRE_COLORS.dc;
    
    edges.push({
      id: `${conn.source}-${conn.target}-${conn.wireType}-${index}`,
      source: conn.source,
      target: conn.target,
      sourceHandle: conn.sourceHandle,
      targetHandle: conn.targetHandle,
      type: 'smoothstep',
      style: { 
        stroke: wireColor, 
        strokeWidth: conn.wireType === 'live' ? 4 : 3,
      },
      animated: conn.wireType === 'live',
      label: conn.wireType === 'dc' ? (conn.sourceHandle.includes('pos') ? 'DC+' : 'DC-') : 
             conn.wireType === 'live' ? 'L' :
             conn.wireType === 'neutral' ? 'N' :
             conn.wireType === 'earth' ? 'E' : undefined,
      labelStyle: { 
        fill: wireColor, 
        fontWeight: 700,
        fontSize: 12,
      },
      labelBgStyle: {
        fill: 'white',
        fillOpacity: 0.9,
      },
    });
  });

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

  explanations.push("🔌 CLOSED CIRCUIT PRINCIPLE:");
  explanations.push("   A complete circuit requires current to flow from source → through load → back to source.");
  explanations.push("   Live (Red) = Power delivery path | Neutral (Blue) = Return path");
  explanations.push("");

  if (hasFan && hasSwitch && hasRegulator) {
    explanations.push("🌀 CEILING FAN CIRCUIT (as shown in diagram):");
    explanations.push("   ┌──────────────────────────────────────┐");
    explanations.push("   │                CEILING FAN            │");
    explanations.push("   │              (L)     (N)              │");
    explanations.push("   │               │       │               │");
    explanations.push("   │               │       │               │");
    explanations.push("   │     ┌─────────┘       └───────┐       │");
    explanations.push("   │     │                         │       │");
    explanations.push("   │  [REGULATOR]                  │       │");
    explanations.push("   │     │                         │       │");
    explanations.push("   │  [SWITCH]                     │       │");
    explanations.push("   │     │                         │       │");
    explanations.push("   │     └────── AC SUPPLY ────────┘       │");
    explanations.push("   │            (L)    (N)                 │");
    explanations.push("   └──────────────────────────────────────┘");
    explanations.push("");
    explanations.push("   → LIVE PATH: AC Supply(L) → Switch → Regulator → Fan(L)");
    explanations.push("   ← NEUTRAL PATH: Fan(N) → AC Supply(N) [Direct return]");
  }

  if (hasMCB) {
    explanations.push("");
    explanations.push("🔌 MCB (Miniature Circuit Breaker):");
    explanations.push("   Protection device - trips to break circuit on overload/short circuit.");
  }

  if (hasDB) {
    explanations.push("");
    explanations.push("📦 Distribution Board:");
    explanations.push("   Central distribution point with Live, Neutral, and Earth bus bars.");
  }

  if (selectedComponentIds.includes('light-bulb') || selectedComponentIds.includes('light-tube')) {
    explanations.push("");
    explanations.push("💡 LIGHT CIRCUIT:");
    explanations.push("   → LIVE: Supply → Switch → Light(L)");
    explanations.push("   ← NEUTRAL: Light(N) → Supply(N)");
  }

  if (selectedComponentIds.includes('socket-5a') || selectedComponentIds.includes('socket-15a')) {
    explanations.push("");
    explanations.push("🔌 SOCKET CIRCUIT:");
    explanations.push("   → LIVE: DB(L) → Socket(L)");
    explanations.push("   ← NEUTRAL: Socket(N) → DB(N)");
    explanations.push("   ⏚ EARTH: Socket(E) → DB(E) [Safety]");
  }

  if (hasInverter && hasBattery) {
    explanations.push("");
    explanations.push("🔋 INVERTER DC CIRCUIT:");
    explanations.push("   → DC+: Battery(+) → Inverter(DC+)");
    explanations.push("   ← DC-: Inverter(DC-) → Battery(-)");
  }

  explanations.push("");
  explanations.push("⚡ Wire Color Code:");
  explanations.push("   🔴 Red = Live (L) - Carries current FROM source");
  explanations.push("   🔵 Blue = Neutral (N) - Returns current TO source");
  explanations.push("   🟢 Green = Earth (E) - Safety grounding");
  explanations.push("   🟡 Yellow = DC positive/connections");

  return explanations;
}
