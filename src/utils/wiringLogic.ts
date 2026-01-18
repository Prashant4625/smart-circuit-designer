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

  const hasSupply = selectedComponentIds.includes('power-supply');
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

  // Power Supply to MCB - Main circuit
  if (hasSupply && hasMCB) {
    connections.push({
      source: 'power-supply',
      sourceHandle: 'supply-l',
      target: 'mcb',
      targetHandle: 'mcb-in-l',
      wireType: 'live',
      description: 'AC Supply live to MCB input',
    });
    connections.push({
      source: 'power-supply',
      sourceHandle: 'supply-n',
      target: 'mcb',
      targetHandle: 'mcb-in-n',
      wireType: 'neutral',
      description: 'AC Supply neutral to MCB neutral input',
    });
  }

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
    connections.push({
      source: 'mcb',
      sourceHandle: 'mcb-out-n',
      target: 'distribution-board',
      targetHandle: 'db-in-n',
      wireType: 'neutral',
      description: 'MCB neutral output to Distribution Board neutral input',
    });
  }

  // Power Supply Earth to Distribution Board
  if (hasSupply && hasDB) {
    connections.push({
      source: 'power-supply',
      sourceHandle: 'supply-e',
      target: 'distribution-board',
      targetHandle: 'db-e',
      wireType: 'earth',
      description: 'AC Supply earth to Distribution Board earth',
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
  circuitStatus: {
    isClosed: boolean;
    message: string;
  };
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

  // Determine circuit status
  let circuitStatus = {
    isClosed: false,
    message: 'Circuit is incomplete or has errors.',
  };

  if (isValid) {
    circuitStatus = {
      isClosed: true,
      message: 'Circuit is properly closed and functional.',
    };
  } else if (incorrectEdges.length > 0) {
    circuitStatus = {
      isClosed: false,
      message: 'Circuit has incorrect connections preventing proper flow.',
    };
  } else if (missingConnections.length > 0) {
    circuitStatus = {
      isClosed: false,
      message: 'Circuit is open (missing connections).',
    };
  }

  return {
    isValid,
    correctConnections,
    incorrectEdges,
    missingConnections,
    correctEdges,
    score,
    totalExpected,
    circuitStatus,
  };
}

export function generateWiringDiagram(selectedComponentIds: string[], existingNodes?: Node[]): WiringResult {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Get components to layout
  // If existingNodes provided, use them (to preserve duplicates/ids)
  // Otherwise create from selectedComponentIds
  let componentsToLayout: { id: string; componentId: string; name: string }[] = [];

  if (existingNodes && existingNodes.length > 0) {
    componentsToLayout = existingNodes.map(n => ({
      id: n.id,
      componentId: n.data.componentId,
      name: n.data.label
    }));
  } else {
    // Get selected components
    const selectedComponents = selectedComponentIds
      .map(id => ELECTRICAL_COMPONENTS.find(c => c.id === id))
      .filter(Boolean);

    if (selectedComponents.length === 0) {
      return { nodes, edges };
    }

    componentsToLayout = selectedComponents.map(c => ({
      id: c!.id, // Initial ID same as component ID for singletons
      componentId: c!.id,
      name: c!.name
    }));
  }

  const hasSupply = componentsToLayout.some(c => c.componentId === 'power-supply');
  const hasMCB = componentsToLayout.some(c => c.componentId === 'mcb');
  const hasDB = componentsToLayout.some(c => c.componentId === 'distribution-board');
  const hasSwitch = componentsToLayout.some(c => c.componentId === 'switch');
  const hasRegulator = componentsToLayout.some(c => c.componentId === 'regulator');
  const hasFan = componentsToLayout.some(c => c.componentId === 'fan');
  const hasLightTube = componentsToLayout.some(c => c.componentId === 'light-tube');
  const hasLightBulb = componentsToLayout.some(c => c.componentId === 'light-bulb');
  const hasInverter = componentsToLayout.some(c => c.componentId === 'inverter');
  const hasBattery = componentsToLayout.some(c => c.componentId === 'battery');

  // Layout for closed circuit visualization
  // Power source at far left, MCB, DB, controls in middle, load at top
  // This creates a visual "loop" like traditional circuit diagrams

  const layoutPositions: Record<string, { x: number; y: number }> = {};

  // Determine layout based on components
  if (hasFan && hasSwitch && hasRegulator) {
    // Fan circuit layout with power supply
    // Power supply at left, MCB and DB flow right, Fan at top, controls at bottom
    layoutPositions['power-supply'] = { x: 0, y: 175 };
    layoutPositions['mcb'] = { x: 100, y: 100 };
    layoutPositions['distribution-board'] = { x: 100, y: 250 };
    layoutPositions['fan'] = { x: 350, y: 50 };
    layoutPositions['switch'] = { x: 200, y: 350 };
    layoutPositions['regulator'] = { x: 450, y: 350 };
  } else if (hasLightTube && hasSwitch) {
    // Tube light circuit layout (like reference image)
    // Power supply on left, MCB below it, Switch in middle, Tube light on right
    layoutPositions['power-supply'] = { x: 0, y: 100 };
    layoutPositions['mcb'] = { x: 0, y: 200 };
    layoutPositions['switch'] = { x: 200, y: 150 };
    layoutPositions['light-tube'] = { x: 400, y: 100 };
    layoutPositions['distribution-board'] = { x: 200, y: 300 };
  } else if (hasLightBulb && hasSwitch) {
    // Light bulb circuit layout
    // Power supply on left, MCB below it, Switch in middle, Light bulb on right
    layoutPositions['power-supply'] = { x: 0, y: 100 };
    layoutPositions['mcb'] = { x: 0, y: 200 };
    layoutPositions['switch'] = { x: 200, y: 150 };
    layoutPositions['light-bulb'] = { x: 400, y: 100 };
    layoutPositions['distribution-board'] = { x: 200, y: 300 };
  } else {
    // Generic layout - arrange in circuit flow pattern (left to right)
    // Power supply → MCB → DB → Controls → Loads

    let xSupply = 0;
    let xPower = 80;
    let xControl = 200;
    let xLoad = 350;
    let supplyY = 150;
    let powerY = 150;
    let switchY = 150;
    let loadY = 150;

    // Position power supply at far left
    if (hasSupply) {
      layoutPositions['power-supply'] = { x: xSupply, y: supplyY };
    }

    // Position power components after supply
    if (hasMCB) {
      layoutPositions['mcb'] = { x: xPower, y: powerY };
    }
    if (hasDB) {
      layoutPositions['distribution-board'] = { x: xPower, y: powerY + 120 };
    }

    // Position control components in middle
    let controlCount = 0;
    // Handle multiple switches/regulators
    componentsToLayout.filter(c => c.componentId === 'switch').forEach((c, i) => {
      layoutPositions[c.id] = { x: xControl + controlCount * 100, y: switchY };
      controlCount++;
    });
    componentsToLayout.filter(c => c.componentId === 'regulator').forEach((c, i) => {
      layoutPositions[c.id] = { x: xControl + controlCount * 100, y: switchY };
      controlCount++;
    });

    // Position load components to the right
    let loadCount = 0;
    const loadTypes = ['fan', 'light-bulb', 'light-tube', 'socket-5a', 'socket-15a'];

    componentsToLayout.filter(c => loadTypes.includes(c.componentId)).forEach((c, i) => {
      layoutPositions[c.id] = { x: xLoad + loadCount * 100, y: loadY };
      loadCount++;
    });

    // Position backup components at bottom
    if (hasBattery) {
      layoutPositions['battery'] = { x: 80, y: 400 };
    }
    if (hasInverter) {
      layoutPositions['inverter'] = { x: 200, y: 400 };
    }
  }

  // Create nodes with positions
  componentsToLayout.forEach((component) => {
    // Use specific ID position if available (for duplicates), otherwise fallback to component type position
    // For generic layout, we assigned positions by ID above.
    // For specific layouts (fan/tube), we only defined by component type.

    let pos = layoutPositions[component.id];

    if (!pos) {
      // Fallback to component type position (for specific layouts like Fan/Tube where we didn't iterate duplicates)
      pos = layoutPositions[component.componentId] || { x: 100, y: 100 };

      // If multiple of same type in specific layout, offset them slightly
      // (Though specific layouts usually imply single instances)
      if (existingNodes) {
        const index = componentsToLayout.filter(c => c.componentId === component.componentId).findIndex(c => c.id === component.id);
        if (index > 0) {
          pos = { x: pos.x + index * 20, y: pos.y + index * 20 };
        }
      }
    }

    nodes.push({
      id: component.id,
      type: 'electrical',
      position: pos,
      data: {
        componentId: component.componentId,
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
      type: 'smoothstep', // Temporary: Use standard edge to debug visibility
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

  const hasSupply = selectedComponentIds.includes('power-supply');
  const hasMCB = selectedComponentIds.includes('mcb');
  const hasDB = selectedComponentIds.includes('distribution-board');
  const hasSwitch = selectedComponentIds.includes('switch');
  const hasRegulator = selectedComponentIds.includes('regulator');
  const hasFan = selectedComponentIds.includes('fan');
  const hasInverter = selectedComponentIds.includes('inverter');
  const hasBattery = selectedComponentIds.includes('battery');

  explanations.push("🔌 PRACTICAL ELECTRICAL CIRCUIT:");
  explanations.push("   A complete circuit requires current to flow from source → through protection → through load → back to source.");
  explanations.push("   This is the basic principle of real household electrical systems.");
  explanations.push("");

  if (hasSupply) {
    explanations.push("⚡ AC POWER SUPPLY (Main Source):");
    explanations.push("   The 230V AC supply is the main power source from the utility.");
    explanations.push("   Live (L) carries current, Neutral (N) returns it, Earth (E) provides safety grounding.");
    explanations.push("");
  }

  if (hasMCB) {
    explanations.push("🔌 MCB (Miniature Circuit Breaker):");
    explanations.push("   Protects the circuit from overcurrent and short circuits.");
    explanations.push("   Automatically trips (opens) if current exceeds safe limits.");
    explanations.push("");
  }

  if (hasDB) {
    explanations.push("📦 DISTRIBUTION BOARD:");
    explanations.push("   Central hub that distributes power to multiple circuits.");
    explanations.push("   Contains separate buses for Live, Neutral, and Earth connections.");
    explanations.push("");
  }

  if (hasFan && hasSwitch && hasRegulator) {
    explanations.push("🌀 CEILING FAN CIRCUIT FLOW:");
    explanations.push("   ┌─────────────────────────────────────────┐");
    explanations.push("   │          AC Supply (230V)                │");
    explanations.push("   │        (L)      (N)      (E)             │");
    explanations.push("   │        │        │        │               │");
    explanations.push("   │      [MCB]    [MCB]     [DB]             │");
    explanations.push("   │        │        │        │               │");
    explanations.push("   │      [DB]     [DB]     [DB]              │");
    explanations.push("   │        │        │        │               │");
    explanations.push("   │    [SWITCH]    └────────[FAN-N]         │");
    explanations.push("   │        │                 │ (Neutral)    │");
    explanations.push("   │   [REGULATOR]            │              │");
    explanations.push("   │        │                 │              │");
    explanations.push("   │        └────[FAN-L]──────┘              │");
    explanations.push("   │             (Live)                      │");
    explanations.push("   └─────────────────────────────────────────┘");
    explanations.push("");
    explanations.push("   → POWER PATH: AC Supply(L) → MCB → DB → Switch → Regulator → Fan(L)");
    explanations.push("   ← RETURN PATH: Fan(N) → DB Neutral → MCB Neutral → AC Supply(N)");
    explanations.push("   ⏚ SAFETY: AC Supply(E) → DB Earth → Fan Earth");
  }

  if (selectedComponentIds.includes('light-bulb') || selectedComponentIds.includes('light-tube')) {
    explanations.push("");
    explanations.push("💡 LIGHT CIRCUIT:");
    explanations.push("   → LIVE: Supply → MCB → DB → Switch → Light(L)");
    explanations.push("   ← NEUTRAL: Light(N) → DB Neutral → MCB Neutral → Supply(N)");
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
