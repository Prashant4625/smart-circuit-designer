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
export function getCorrectConnections(nodes: Node[], wiringMode: 'series' | 'parallel' | 'all' = 'all'): CorrectConnection[] {
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
      { source: supply.id, sourceHandle: 'supply-l', target: mcb.id, targetHandle: 'mcb-in-l', wireType: 'live', description: 'Main Supply Live to MCB Input' }
      // Removed MCB Neutral Return to Supply (Neutral bypasses MCB)
    );
  }

  if (mcb && db) {
    connections.push(
      { source: mcb.id, sourceHandle: 'mcb-out-l', target: db.id, targetHandle: 'db-in-l', wireType: 'live', description: 'MCB Output Live to DB Input' }
      // Removed DB Neutral Return to MCB (Neutral bypasses MCB)
    );
  } else if (supply && db && !mcb) {
    connections.push(
      { source: supply.id, sourceHandle: 'supply-l', target: db.id, targetHandle: 'db-in-l', wireType: 'live', description: 'Supply Live to DB Input' }
    );
  }

  // Direct Neutral Path: Supply -> DB
  if (supply && db) {
    connections.push(
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
    // Neutral bypasses MCB, so if MCB is present but no DB, Neutral comes from Supply
    if (supply) {
      neutralReturnId = supply.id; neutralReturnHandle = 'supply-n';
      earthReturnId = supply.id; earthReturnHandle = 'supply-e';
    }
  } else if (supply) {
    liveSourceId = supply.id; liveSourceHandle = 'supply-l';
    neutralReturnId = supply.id; neutralReturnHandle = 'supply-n';
    earthReturnId = supply.id; earthReturnHandle = 'supply-e';
  }

  // --- 3. Control Circuits ---
  // Connect all switches to power
  // --- 3. Control Circuits & Load Connections ---
  // Connect all switches to power
  switches.forEach(sw => {
    if (liveSourceId) {
      connections.push(
        { source: liveSourceId, sourceHandle: liveSourceHandle, target: sw.id, targetHandle: 'sw-in', wireType: 'live', description: 'Power to Switch Input' }
      );
    }
  });

  const mainSwitch = switches[0];
  const activeLiveSourceId = mainSwitch ? mainSwitch.id : liveSourceId;
  const activeLiveSourceHandle = mainSwitch ? 'sw-out' : (liveSourceHandle === 'db-out-l1' ? 'db-out-l2' : liveSourceHandle);

  // Collect all loads
  const allLoads: { id: string, type: string, prefix: string }[] = [];

  const addLoad = (nodes: Node[], prefix: string) => {
    nodes.forEach(n => allLoads.push({ id: n.id, type: n.data.componentId, prefix }));
  };

  addLoad(fans, 'fan');
  addLoad(bulbs, 'bulb');
  addLoad(tubes, 'tube');
  addLoad(sockets5A, 'sock5');
  addLoad(sockets15A, 'sock15');

  // --- WIRING LOGIC BASED ON MODE ---

  // 1. Parallel Wiring (Default for 'parallel' or 'all')
  // In Parallel, EVERY load gets direct Live and Neutral
  if (wiringMode === 'parallel' || wiringMode === 'all') {
    allLoads.forEach(load => {
      // Live Connection
      if (activeLiveSourceId) {
        // Special case for Fan with Regulator
        if (load.type === 'fan' && regulators.length > 0) {
          // Logic handled below for regulator, or assume direct if complex
          // For simplicity in this refactor, we'll keep the regulator logic separate or integrate it.
          // Let's integrate: Find a regulator for this fan
          const fanIndex = fans.findIndex(f => f.id === load.id);
          const regulator = regulators[fanIndex];

          if (regulator && mainSwitch) {
            connections.push(
              { source: mainSwitch.id, sourceHandle: 'sw-out', target: regulator.id, targetHandle: 'reg-in', wireType: 'live', description: 'Switch to Regulator' },
              { source: regulator.id, sourceHandle: 'reg-out', target: load.id, targetHandle: 'fan-l', wireType: 'live', description: 'Regulator to Fan' }
            );
          } else {
            connections.push(
              { source: activeLiveSourceId, sourceHandle: activeLiveSourceHandle, target: load.id, targetHandle: `${load.prefix}-l`, wireType: 'live', description: 'Power to Load' }
            );
          }
        } else {
          connections.push(
            { source: activeLiveSourceId, sourceHandle: activeLiveSourceHandle, target: load.id, targetHandle: `${load.prefix}-l`, wireType: 'live', description: 'Power to Load' }
          );
        }
      }

      // Neutral Return
      if (neutralReturnId) {
        connections.push(
          { source: load.id, sourceHandle: `${load.prefix}-n`, target: neutralReturnId, targetHandle: neutralReturnHandle, wireType: 'neutral', description: 'Neutral Return' }
        );
      }

      // Earth Return
      if (earthReturnId && load.prefix !== 'bulb') {
        connections.push(
          { source: load.id, sourceHandle: `${load.prefix}-e`, target: earthReturnId, targetHandle: earthReturnHandle, wireType: 'earth', description: 'Earth Connection' }
        );
      }
    });
  }

  // 2. Series Wiring
  // In Series, devices are daisy-chained.
  // Source Live -> Load 1 Live
  // Load 1 Neutral -> Load 2 Live
  // ...
  // Load N Neutral -> Source Neutral
  if (wiringMode === 'series') {
    if (allLoads.length > 0) {
      // Sort loads to ensure consistent order (e.g. by Y position or just ID)
      // For now, we use the order they were added (Fans -> Bulbs -> Tubes -> Sockets)

      // 1. Connect First Load to Source Live
      const firstLoad = allLoads[0];
      if (activeLiveSourceId) {
        // Fan/Regulator check for first load
        if (firstLoad.type === 'fan' && regulators.length > 0) {
          const regulator = regulators[0]; // Assume first regulator for first fan
          if (regulator && mainSwitch) {
            connections.push(
              { source: mainSwitch.id, sourceHandle: 'sw-out', target: regulator.id, targetHandle: 'reg-in', wireType: 'live', description: 'Switch to Regulator' },
              { source: regulator.id, sourceHandle: 'reg-out', target: firstLoad.id, targetHandle: 'fan-l', wireType: 'live', description: 'Regulator to First Fan' }
            );
          } else {
            connections.push(
              { source: activeLiveSourceId, sourceHandle: activeLiveSourceHandle, target: firstLoad.id, targetHandle: `${firstLoad.prefix}-l`, wireType: 'live', description: 'Power to First Load' }
            );
          }
        } else {
          connections.push(
            { source: activeLiveSourceId, sourceHandle: activeLiveSourceHandle, target: firstLoad.id, targetHandle: `${firstLoad.prefix}-l`, wireType: 'live', description: 'Power to First Load' }
          );
        }
      }

      // 2. Daisy Chain (Load i Neutral -> Load i+1 Live)
      for (let i = 0; i < allLoads.length - 1; i++) {
        const current = allLoads[i];
        const next = allLoads[i + 1];
        connections.push(
          { source: current.id, sourceHandle: `${current.prefix}-n`, target: next.id, targetHandle: `${next.prefix}-l`, wireType: 'live', description: 'Series Connection (Daisy Chain)' }
        );
      }

      // 3. Connect Last Load to Source Neutral
      const lastLoad = allLoads[allLoads.length - 1];
      if (neutralReturnId) {
        connections.push(
          { source: lastLoad.id, sourceHandle: `${lastLoad.prefix}-n`, target: neutralReturnId, targetHandle: neutralReturnHandle, wireType: 'neutral', description: 'Series Return to Neutral' }
        );
      }

      // 4. Earth Connections (Always Parallel/Direct)
      allLoads.forEach(load => {
        if (earthReturnId && load.prefix !== 'bulb') {
          connections.push(
            { source: load.id, sourceHandle: `${load.prefix}-e`, target: earthReturnId, targetHandle: earthReturnHandle, wireType: 'earth', description: 'Earth Connection' }
          );
        }
      });
    }
  }

  // Backup Power (Inverter/Battery) - Keep existing logic
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
  wiringMode: 'series' | 'parallel' | 'all' = 'all'
): ConnectionValidationResult {
  const correctConnections = getCorrectConnections(nodes, wiringMode);

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

export function generateWiringDiagram(selectedComponentIds: string[], existingNodes?: Node[]): WiringResult {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // 1. Determine which components to layout
  // If existingNodes is provided, use them (preserving IDs and data)
  // Otherwise, create new nodes from selectedComponentIds
  let componentsToLayout: { id: string, type: string, label: string, originalNode?: Node }[] = [];

  if (existingNodes && existingNodes.length > 0) {
    componentsToLayout = existingNodes.map(n => ({
      id: n.id,
      type: n.data.componentId,
      label: n.data.label,
      originalNode: n
    }));
  } else {
    selectedComponentIds.forEach((id, index) => {
      const component = ELECTRICAL_COMPONENTS.find(c => c.id === id);
      if (!component) return;
      componentsToLayout.push({
        id: `${id}-${Date.now()}-${index}`,
        type: id,
        label: component.name
      });
    });
  }

  // 2. Define Layout Columns
  const columns: Record<string, number> = {
    'power-supply': 0,
    'battery': 0,
    'mcb': 1,
    'inverter': 1,
    'distribution-board': 2,
    'switch': 3,
    'regulator': 3,
    'light-bulb': 4,
    'light-tube': 4,
    'fan': 4,
    'socket-5a': 4,
    'socket-15a': 4
  };

  const columnXStart = 100;
  const columnGap = 250;
  const rowYStart = 100;
  const rowGap = 200;

  // Track current Y position for each column
  const columnY: Record<number, number> = { 0: rowYStart, 1: rowYStart, 2: rowYStart, 3: rowYStart, 4: rowYStart };

  // 3. Position Nodes
  componentsToLayout.forEach(comp => {
    const colIndex = columns[comp.type] ?? 4; // Default to last column
    const x = columnXStart + (colIndex * columnGap);
    const y = columnY[colIndex];

    // Update Y for next item in this column
    columnY[colIndex] += rowGap;

    if (comp.originalNode) {
      nodes.push({
        ...comp.originalNode,
        position: { x, y }
      });
    } else {
      nodes.push({
        id: comp.id,
        type: 'electrical',
        position: { x, y },
        data: {
          componentId: comp.type,
          label: comp.label,
        },
      });
    }
  });

  // 4. Generate Edges
  const correctConnections = getCorrectConnections(nodes, 'series'); // Default to Series for Auto-Layout

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
