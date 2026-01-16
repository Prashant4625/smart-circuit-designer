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
  isOptional?: boolean;
}

// Get all correct connections based on current nodes (supports multiple instances)
export function getCorrectConnections(nodes: Node[]): CorrectConnection[] {
  const connections: CorrectConnection[] = [];

  // Helper to find nodes by type
  const getNodes = (id: string) => nodes.filter(n => n.data.componentId === id);

  const supplies = getNodes('power-supply');
  const mcbs = getNodes('mcb');
  const dbs = getNodes('distribution-board');
  const switches = getNodes('switch');
  const regulators = getNodes('regulator');
  const fans = getNodes('fan');
  const inverters = getNodes('inverter');
  const batteries = getNodes('battery');
  const bulbs = getNodes('light-bulb');
  const tubes = getNodes('light-tube');
  const sockets5A = getNodes('socket-5a');
  const sockets15A = getNodes('socket-15a');

  const hasSupply = supplies.length > 0;
  const hasMCB = mcbs.length > 0;
  const hasDB = dbs.length > 0;
  const hasSwitch = switches.length > 0;

  // --- 1. Establish Power Backbone ---
  // We assume single backbone for now, connecting first instances found
  const supply = supplies[0];
  const mcb = mcbs[0];
  const db = dbs[0];

  if (supply && mcb) {
    connections.push(
      { source: supply.id, sourceHandle: 'supply-l', target: mcb.id, targetHandle: 'mcb-in-l', wireType: 'live', description: 'Main Supply Live to MCB Input' },
      { source: mcb.id, sourceHandle: 'mcb-in-n', target: supply.id, targetHandle: 'supply-n', wireType: 'neutral', description: 'MCB Neutral Return to Supply' }
    );
  }

  if (mcb && db) {
    connections.push(
      { source: mcb.id, sourceHandle: 'mcb-out-l', target: db.id, targetHandle: 'db-in-l', wireType: 'live', description: 'MCB Output Live to DB Input' },
      { source: db.id, sourceHandle: 'db-in-n', target: mcb.id, targetHandle: 'mcb-out-n', wireType: 'neutral', description: 'DB Neutral Return to MCB' }
    );
  } else if (supply && db && !mcb) {
    connections.push(
      { source: supply.id, sourceHandle: 'supply-l', target: db.id, targetHandle: 'db-in-l', wireType: 'live', description: 'Supply Live to DB Input' },
      { source: db.id, sourceHandle: 'db-in-n', target: supply.id, targetHandle: 'supply-n', wireType: 'neutral', description: 'DB Neutral Return to Supply' }
    );
  }

  if (supply && db) {
    connections.push(
      { source: db.id, sourceHandle: 'db-e', target: supply.id, targetHandle: 'supply-e', wireType: 'earth', description: 'DB Earth Return to Supply' }
    );
  }

  // --- 2. Determine Active Power Source ---
  let liveSourceId = '';
  let liveSourceHandle = '';
  let neutralReturnId = '';
  let neutralReturnHandle = '';
  let earthReturnId = '';
  let earthReturnHandle = '';

  if (db) {
    liveSourceId = db.id; liveSourceHandle = 'db-out-l1';
    neutralReturnId = db.id; neutralReturnHandle = 'db-out-n';
    earthReturnId = db.id; earthReturnHandle = 'db-e';
  } else if (mcb) {
    liveSourceId = mcb.id; liveSourceHandle = 'mcb-out-l';
    neutralReturnId = mcb.id; neutralReturnHandle = 'mcb-out-n';
    if (supply) { earthReturnId = supply.id; earthReturnHandle = 'supply-e'; }
  } else if (supply) {
    liveSourceId = supply.id; liveSourceHandle = 'supply-l';
    neutralReturnId = supply.id; neutralReturnHandle = 'supply-n';
    earthReturnId = supply.id; earthReturnHandle = 'supply-e';
  }

  // --- 3. Control Circuits ---
  // Connect all switches to power
  switches.forEach(sw => {
    if (liveSourceId) {
      connections.push(
        { source: liveSourceId, sourceHandle: liveSourceHandle, target: sw.id, targetHandle: 'sw-in', wireType: 'live', description: 'Power to Switch Input' }
      );
    }
  });

  // Helper to get a switch for a device (simple logic: use first switch available)
  // In a real app, we might assign specific switches to specific devices
  const mainSwitch = switches[0];

  // Fan Circuits
  fans.forEach((fan, index) => {
    // Try to find a regulator for this fan (1-to-1 mapping if possible)
    const regulator = regulators[index];

    if (mainSwitch && regulator) {
      connections.push(
        { source: mainSwitch.id, sourceHandle: 'sw-out', target: regulator.id, targetHandle: 'reg-in', wireType: 'live', description: 'Switch to Regulator' },
        { source: regulator.id, sourceHandle: 'reg-out', target: fan.id, targetHandle: 'fan-l', wireType: 'live', description: 'Regulator to Fan' }
      );
    } else if (mainSwitch) {
      connections.push(
        { source: mainSwitch.id, sourceHandle: 'sw-out', target: fan.id, targetHandle: 'fan-l', wireType: 'live', description: 'Switch to Fan' }
      );
    } else if (liveSourceId) {
      connections.push(
        { source: liveSourceId, sourceHandle: liveSourceHandle, target: fan.id, targetHandle: 'fan-l', wireType: 'live', description: 'Direct Power to Fan' }
      );
    }

    if (neutralReturnId) {
      connections.push(
        { source: fan.id, sourceHandle: 'fan-n', target: neutralReturnId, targetHandle: neutralReturnHandle, wireType: 'neutral', description: 'Fan Neutral Return' }
      );
    }
    if (earthReturnId) {
      connections.push(
        { source: fan.id, sourceHandle: 'fan-e', target: earthReturnId, targetHandle: earthReturnHandle, wireType: 'earth', description: 'Fan Earth Return' }
      );
    }
  });

  // Light Bulbs
  bulbs.forEach(bulb => {
    if (mainSwitch) {
      connections.push(
        { source: mainSwitch.id, sourceHandle: 'sw-out', target: bulb.id, targetHandle: 'bulb-l', wireType: 'live', description: 'Switch to Bulb' }
      );
    } else if (liveSourceId) {
      connections.push(
        { source: liveSourceId, sourceHandle: liveSourceHandle === 'db-out-l1' ? 'db-out-l2' : liveSourceHandle, target: bulb.id, targetHandle: 'bulb-l', wireType: 'live', description: 'Direct Power to Bulb' }
      );
    }

    if (neutralReturnId) {
      connections.push(
        { source: bulb.id, sourceHandle: 'bulb-n', target: neutralReturnId, targetHandle: neutralReturnHandle, wireType: 'neutral', description: 'Bulb Neutral Return' }
      );
    }
  });

  // Tube Lights
  tubes.forEach(tube => {
    if (mainSwitch) {
      connections.push(
        { source: mainSwitch.id, sourceHandle: 'sw-out', target: tube.id, targetHandle: 'tube-l', wireType: 'live', description: 'Switch to Tube Light' }
      );
    } else if (liveSourceId) {
      connections.push(
        { source: liveSourceId, sourceHandle: liveSourceHandle === 'db-out-l1' ? 'db-out-l2' : liveSourceHandle, target: tube.id, targetHandle: 'tube-l', wireType: 'live', description: 'Direct Power to Tube Light' }
      );
    }

    if (neutralReturnId) {
      connections.push(
        { source: tube.id, sourceHandle: 'tube-n', target: neutralReturnId, targetHandle: neutralReturnHandle, wireType: 'neutral', description: 'Tube Light Neutral Return' }
      );
    }
    if (earthReturnId) {
      connections.push(
        { source: tube.id, sourceHandle: 'tube-e', target: earthReturnId, targetHandle: earthReturnHandle, wireType: 'earth', description: 'Tube Light Earth Return' }
      );
    }
  });

  // Sockets 5A
  sockets5A.forEach(sock => {
    if (mainSwitch) {
      connections.push(
        { source: mainSwitch.id, sourceHandle: 'sw-out', target: sock.id, targetHandle: 'sock5-l', wireType: 'live', description: 'Switch to 5A Socket' }
      );
    } else if (liveSourceId) {
      connections.push(
        { source: liveSourceId, sourceHandle: liveSourceHandle === 'db-out-l1' ? 'db-out-l2' : liveSourceHandle, target: sock.id, targetHandle: 'sock5-l', wireType: 'live', description: 'Direct Power to 5A Socket' }
      );
    }

    if (neutralReturnId) {
      connections.push(
        { source: sock.id, sourceHandle: 'sock5-n', target: neutralReturnId, targetHandle: neutralReturnHandle, wireType: 'neutral', description: '5A Socket Neutral Return' }
      );
    }
    if (earthReturnId) {
      connections.push(
        { source: sock.id, sourceHandle: 'sock5-e', target: earthReturnId, targetHandle: earthReturnHandle, wireType: 'earth', description: '5A Socket Earth Return' }
      );
    }
  });

  // Sockets 15A
  sockets15A.forEach(sock => {
    if (mainSwitch) {
      connections.push(
        { source: mainSwitch.id, sourceHandle: 'sw-out', target: sock.id, targetHandle: 'sock15-l', wireType: 'live', description: 'Switch to 15A Socket' }
      );
    } else if (liveSourceId) {
      connections.push(
        { source: liveSourceId, sourceHandle: liveSourceHandle === 'db-out-l1' ? 'db-out-l2' : liveSourceId, target: sock.id, targetHandle: 'sock15-l', wireType: 'live', description: 'Direct Power to 15A Socket' }
      );
    }

    if (neutralReturnId) {
      connections.push(
        { source: sock.id, sourceHandle: 'sock15-n', target: neutralReturnId, targetHandle: neutralReturnHandle, wireType: 'neutral', description: '15A Socket Neutral to ${neutralReturn}' }
      );
    }
    if (earthReturnId) {
      connections.push(
        { source: sock.id, sourceHandle: 'sock15-e', target: earthReturnId, targetHandle: earthReturnHandle, wireType: 'earth', description: '15A Socket Earth to ${earthReturn}' }
      );
    }
  });

  // Backup Power
  const battery = batteries[0];
  const inverter = inverters[0];
  if (battery && inverter) {
    connections.push(
      { source: battery.id, sourceHandle: 'bat-pos', target: inverter.id, targetHandle: 'inv-dc-pos', wireType: 'dc', description: 'Battery Positive to Inverter DC+' },
      { source: inverter.id, sourceHandle: 'inv-dc-neg', target: 'battery', targetHandle: 'bat-neg', wireType: 'dc', description: 'Inverter DC- Return to Battery' }
    );
  }

  if (inverter && liveSourceId) {
    connections.push(
      { source: liveSourceId, sourceHandle: liveSourceHandle, target: 'inverter', targetHandle: 'inv-ac-in-l', wireType: 'live', description: 'Power to Inverter AC Input' }
    );
    if (neutralReturnId) {
      connections.push(
        { source: 'inverter', sourceHandle: 'inv-ac-in-n', target: neutralReturnId, targetHandle: neutralReturnHandle, wireType: 'neutral', description: 'Inverter Neutral Return' }
      );
    }
  }

  return connections;
}

// Check if the circuit is a closed loop (Source -> Load -> Source)
export function validateCircuitClosure(edges: Edge[], nodes: Node[]): { isClosed: boolean; message: string } {
  const supplyNode = nodes.find(n => n.data.componentId === 'power-supply');
  if (!supplyNode) return { isClosed: false, message: "No Power Supply found." };

  // Identify Load Nodes (components that consume power)
  const loadTypes = ['fan', 'light-bulb', 'light-tube', 'socket-5a', 'socket-15a', 'inverter'];
  const loadNodes = nodes.filter(n => loadTypes.includes(n.data.componentId));

  if (loadNodes.length === 0) {
    return { isClosed: true, message: "No loads to power." };
  }

  // Build Directed Adjacency List
  const adj = new Map<string, string[]>();
  edges.forEach(edge => {
    // Ignore Earth connections for power flow check
    const isEarth = edge.sourceHandle?.includes('-e') || edge.targetHandle?.includes('-e') ||
      edge.sourceHandle?.includes('earth') || edge.targetHandle?.includes('earth');

    if (isEarth) return;

    if (!adj.has(edge.source)) adj.set(edge.source, []);
    adj.get(edge.source)?.push(edge.target);
  });

  // Helper for BFS
  const getReachable = (startId: string) => {
    const visited = new Set<string>();
    const queue = [startId];
    visited.add(startId);
    while (queue.length > 0) {
      const current = queue.shift()!;
      const neighbors = adj.get(current) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
    return visited;
  };

  // 1. Forward Check: Supply -> Loads
  const reachableFromSupply = getReachable(supplyNode.id);
  const unpoweredLoads = loadNodes.filter(n => !reachableFromSupply.has(n.id));

  if (unpoweredLoads.length > 0) {
    return {
      isClosed: false,
      message: `Open Circuit! Power does not reach: ${unpoweredLoads.map(n => n.data.label).join(', ')}`
    };
  }

  // 2. Return Check: Loads -> Supply
  const unreturnedLoads = loadNodes.filter(n => {
    const reachableFromLoad = getReachable(n.id);
    return !reachableFromLoad.has(supplyNode.id);
  });

  if (unreturnedLoads.length > 0) {
    return {
      isClosed: false,
      message: `Open Circuit! Return path missing for: ${unreturnedLoads.map(n => n.data.label).join(', ')}`
    };
  }

  return { isClosed: true, message: "Circuit is Closed and Complete." };
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
  circuitStatus: { isClosed: boolean; message: string };
}

export function validateUserConnections(
  edges: Edge[],
  nodes: Node[],
): ConnectionValidationResult {
  const correctConnections = getCorrectConnections(nodes);

  const correctEdges: Edge[] = [];
  const incorrectEdges: { edge: Edge; reason: string; suggestion?: CorrectConnection }[] = [];
  const foundConnections = new Set<string>();

  // Helper to check if two handles are compatible (e.g. L to L, N to N)
  // or if they form a valid circuit path (e.g. Switch Out to Load L)

  edges.forEach(edge => {
    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);

    if (!sourceNode || !targetNode) return;

    const sourceComponentId = sourceNode.data.componentId;
    const targetComponentId = targetNode.data.componentId;

    // Direct match check
    const matchingCorrect = correctConnections.find(cc =>
      cc.source === edge.source &&
      cc.target === edge.target &&
      cc.sourceHandle === edge.sourceHandle &&
      cc.targetHandle === edge.targetHandle
    );

    // Reverse match check (if user drew line backwards but electrically valid)
    const matchingCorrectReverse = correctConnections.find(cc =>
      cc.source === edge.target &&
      cc.target === edge.source &&
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
      // Analyze why it's wrong
      let reason = "Invalid Connection";
      let suggestion: CorrectConnection | undefined;

      // Check for Polarity Mismatch (e.g. Live to Neutral)
      const isSourceLive = edge.sourceHandle?.includes('l') || edge.sourceHandle?.includes('pos');
      const isTargetNeutral = edge.targetHandle?.includes('n') || edge.targetHandle?.includes('neg');
      const isSourceNeutral = edge.sourceHandle?.includes('n') || edge.sourceHandle?.includes('neg');
      const isTargetLive = edge.targetHandle?.includes('l') || edge.targetHandle?.includes('pos');

      if ((isSourceLive && isTargetNeutral) || (isSourceNeutral && isTargetLive)) {
        reason = "Short Circuit! You connected Live/Positive to Neutral/Negative.";
      } else {
        // Find what SHOULD be connected to these handles
        const suggestionForSource = correctConnections.find(cc =>
          cc.source === edge.source && cc.sourceHandle === edge.sourceHandle
        );
        const suggestionForTarget = correctConnections.find(cc =>
          cc.target === edge.target && cc.targetHandle === edge.targetHandle
        );

        if (suggestionForSource) {
          // Find the node to get its label for the message
          const suggestedTargetNode = nodes.find(n => n.id === suggestionForSource.target);
          const targetName = suggestedTargetNode?.data.label || suggestionForSource.target;
          reason = `This terminal should connect to ${targetName} (${suggestionForSource.targetHandle})`;
          suggestion = suggestionForSource;
        } else if (suggestionForTarget) {
          // Find the node to get its label for the message
          const suggestedSourceNode = nodes.find(n => n.id === suggestionForTarget.source);
          const sourceName = suggestedSourceNode?.data.label || suggestionForTarget.source;
          reason = `This terminal should receive connection from ${sourceName} (${suggestionForTarget.sourceHandle})`;
          suggestion = suggestionForTarget;
        } else {
          reason = "This connection doesn't make sense in this circuit.";
        }
      }

      incorrectEdges.push({
        edge,
        reason,
        suggestion,
      });
    }
  });

  const missingConnections = correctConnections.filter(cc =>
    !foundConnections.has(`${cc.source}-${cc.sourceHandle}-${cc.target}-${cc.targetHandle}`)
  );

  const circuitStatus = validateCircuitClosure(edges, nodes);

  const totalExpected = correctConnections.length;
  const score = correctEdges.length;
  const isValid = incorrectEdges.length === 0 && missingConnections.length === 0 && circuitStatus.isClosed;

  return {
    isValid,
    correctConnections,
    incorrectEdges,
    missingConnections,
    correctEdges,
    score,
    totalExpected,
    circuitStatus
  };
}

export function generateWiringDiagram(selectedComponentIds: string[]): WiringResult {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Create nodes for ALL selected components (allowing duplicates)
  selectedComponentIds.forEach((id, index) => {
    const component = ELECTRICAL_COMPONENTS.find(c => c.id === id);
    if (!component) return;

    // Generate unique ID for this instance
    const nodeId = `${id}-${Date.now()}-${index}`;

    // Position Logic
    let x = 0;
    let y = 0;

    // Base positions
    const fixedPositions: Record<string, { x: number, y: number }> = {
      'power-supply': { x: 100, y: 100 },
      'mcb': { x: 100, y: 300 },
      'distribution-board': { x: 300, y: 200 },
      'switch': { x: 300, y: 500 },
      'regulator': { x: 500, y: 500 },
      'fan': { x: 600, y: 300 },
      'light-bulb': { x: 600, y: 100 },
      'light-tube': { x: 600, y: 100 },
      'socket-5a': { x: 600, y: 400 },
      'socket-15a': { x: 600, y: 400 },
      'battery': { x: 100, y: 600 },
      'inverter': { x: 300, y: 600 },
    };

    if (fixedPositions[id]) {
      const pos = fixedPositions[id];
      x = pos.x;
      y = pos.y;

      // Offset multiple instances of same type
      const existingSameType = nodes.filter(n => n.data.componentId === id).length;
      if (existingSameType > 0) {
        x += existingSameType * 150; // Shift right
      }
    } else {
      x = 100 + (nodes.length * 50);
      y = 100;
    }

    nodes.push({
      id: nodeId,
      type: 'electrical',
      position: { x, y },
      data: {
        componentId: id,
        label: component.name,
      },
    });
  });

  // --- Generate Edges ---
  // Use the new node-based connection logic
  const correctConnections = getCorrectConnections(nodes);

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
      type: 'deletable',
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

  explanations.push("🔌 CIRCUIT EXPLANATION:");
  explanations.push("   This diagram represents a standard residential electrical circuit.");
  explanations.push("");

  if (hasSupply) {
    explanations.push("1. POWER SOURCE:");
    explanations.push("   - 230V AC Supply enters the system.");
    explanations.push("   - Red wire is Live (Phase), Blue is Neutral, Green is Earth.");
  }

  if (hasMCB) {
    explanations.push("2. PROTECTION:");
    explanations.push("   - The MCB (Miniature Circuit Breaker) is the first line of defense.");
    explanations.push("   - It cuts off power automatically if there's an overload or short circuit.");
  }

  if (hasDB) {
    explanations.push("3. DISTRIBUTION:");
    explanations.push("   - The Distribution Board splits power to different circuits.");
    explanations.push("   - It ensures organized and safe power delivery to all rooms/devices.");
  }

  return explanations;
}
