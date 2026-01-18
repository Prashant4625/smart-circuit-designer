import { Node, Edge } from 'reactflow';
import { ELECTRICAL_COMPONENTS, WIRE_COLORS } from '@/constants/electricalComponents';
import { CircuitStatus } from '@/types/electrical';

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
  circuitStatus: CircuitStatus;
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
  
  // Calculate circuit status
  const circuitStatus = calculateCircuitStatus(edges, nodes, correctConnections, missingConnections, incorrectEdges.length);
  
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

// Calculate if circuit is closed and working
function calculateCircuitStatus(
  edges: Edge[],
  nodes: Node[],
  correctConnections: CorrectConnection[],
  missingConnections: CorrectConnection[],
  incorrectCount: number
): CircuitStatus {
  const selectedComponentIds = nodes.map(n => n.data.componentId);
  
  // Check for loads (fan, bulb, etc.)
  const loads = ['fan', 'light-bulb', 'light-tube', 'socket-5a', 'socket-15a'];
  const hasLoads = loads.some(load => selectedComponentIds.includes(load));
  
  if (!hasLoads) {
    return {
      isClosed: false,
      message: 'No load components found. Add a fan, bulb, or other load.',
      isWorking: false,
    };
  }
  
  // Check if power supply chain is complete
  const hasSupply = selectedComponentIds.includes('power-supply');
  const hasMCB = selectedComponentIds.includes('mcb');
  const hasDB = selectedComponentIds.includes('distribution-board');
  
  if (!hasSupply || !hasMCB || !hasDB) {
    return {
      isClosed: false,
      message: 'Missing power chain components (Power Supply → MCB → Distribution Board)',
      isWorking: false,
    };
  }
  
  // Check if all required connections are made
  if (missingConnections.length > 0) {
    const missingNeutral = missingConnections.some(c => c.wireType === 'neutral');
    const missingLive = missingConnections.some(c => c.wireType === 'live');
    
    if (missingNeutral && missingLive) {
      return {
        isClosed: false,
        message: 'Circuit is open - missing both Live and Neutral connections',
        isWorking: false,
      };
    } else if (missingNeutral) {
      return {
        isClosed: false,
        message: 'Circuit is open - missing Neutral return path',
        isWorking: false,
      };
    } else if (missingLive) {
      return {
        isClosed: false,
        message: 'Circuit is open - missing Live connection',
        isWorking: false,
      };
    }
    return {
      isClosed: false,
      message: `Missing ${missingConnections.length} connection(s)`,
      isWorking: false,
    };
  }
  
  if (incorrectCount > 0) {
    return {
      isClosed: false,
      message: 'Circuit has incorrect connections that need to be fixed',
      isWorking: false,
    };
  }
  
  return {
    isClosed: true,
    message: 'Circuit is complete and closed! All devices should be working.',
    isWorking: true,
  };
}

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

  const hasSupply = selectedComponentIds.includes('power-supply');
  const hasMCB = selectedComponentIds.includes('mcb');
  const hasDB = selectedComponentIds.includes('distribution-board');
  const hasSwitch = selectedComponentIds.includes('switch');
  const hasRegulator = selectedComponentIds.includes('regulator');
  const hasFan = selectedComponentIds.includes('fan');
  const hasLightTube = selectedComponentIds.includes('light-tube');
  const hasLightBulb = selectedComponentIds.includes('light-bulb');
  const hasInverter = selectedComponentIds.includes('inverter');
  const hasBattery = selectedComponentIds.includes('battery');

  // Layout for closed circuit visualization
  const layoutPositions: Record<string, { x: number; y: number }> = {};
  
  // Determine layout based on components
  if (hasFan && hasSwitch && hasRegulator) {
    layoutPositions['power-supply'] = { x: 0, y: 175 };
    layoutPositions['mcb'] = { x: 100, y: 100 };
    layoutPositions['distribution-board'] = { x: 100, y: 250 };
    layoutPositions['fan'] = { x: 350, y: 50 };
    layoutPositions['switch'] = { x: 200, y: 350 };
    layoutPositions['regulator'] = { x: 450, y: 350 };
  } else if (hasLightTube && hasSwitch) {
    layoutPositions['power-supply'] = { x: 0, y: 100 };
    layoutPositions['mcb'] = { x: 0, y: 200 };
    layoutPositions['switch'] = { x: 200, y: 150 };
    layoutPositions['light-tube'] = { x: 400, y: 100 };
    layoutPositions['distribution-board'] = { x: 200, y: 300 };
  } else if (hasLightBulb && hasSwitch) {
    layoutPositions['power-supply'] = { x: 0, y: 100 };
    layoutPositions['mcb'] = { x: 0, y: 200 };
    layoutPositions['switch'] = { x: 200, y: 150 };
    layoutPositions['light-bulb'] = { x: 400, y: 100 };
    layoutPositions['distribution-board'] = { x: 200, y: 300 };
  } else {
    // Generic layout
    let xSupply = 0;
    let xPower = 80;
    let xControl = 200;
    let xLoad = 350;
    let supplyY = 150;
    let powerY = 150;
    let switchY = 150;
    let loadY = 150;
    
    if (hasSupply) {
      layoutPositions['power-supply'] = { x: xSupply, y: supplyY };
    }
    
    if (hasMCB) {
      layoutPositions['mcb'] = { x: xPower, y: powerY };
    }
    if (hasDB) {
      layoutPositions['distribution-board'] = { x: xPower, y: powerY + 120 };
    }
    
    let controlCount = 0;
    if (hasSwitch) {
      layoutPositions['switch'] = { x: xControl + controlCount * 100, y: switchY };
      controlCount++;
    }
    if (hasRegulator) {
      layoutPositions['regulator'] = { x: xControl + controlCount * 100, y: switchY };
      controlCount++;
    }
    
    let loadCount = 0;
    if (hasFan) {
      layoutPositions['fan'] = { x: xLoad, y: loadY + loadCount * 120 };
      loadCount++;
    }
    if (hasLightBulb) {
      layoutPositions['light-bulb'] = { x: xLoad, y: loadY + loadCount * 120 };
      loadCount++;
    }
    if (hasLightTube) {
      layoutPositions['light-tube'] = { x: xLoad, y: loadY + loadCount * 120 };
      loadCount++;
    }
    
    if (hasBattery) {
      layoutPositions['battery'] = { x: xSupply, y: supplyY + 180 };
    }
    if (hasInverter) {
      layoutPositions['inverter'] = { x: xPower, y: powerY + 240 };
    }
  }

  // Create nodes
  selectedComponents.forEach(component => {
    if (!component) return;
    const position = layoutPositions[component.id] || { x: 100, y: 100 };
    
    nodes.push({
      id: component.id,
      type: 'electrical',
      position,
      data: {
        componentId: component.id,
        label: component.name,
      },
    });
  });

  // Generate edges from correct connections
  const correctConnections = getCorrectConnections(selectedComponentIds);
  
  correctConnections.forEach((conn, index) => {
    const wireColor = conn.wireType === 'live' ? WIRE_COLORS.live :
      conn.wireType === 'neutral' ? WIRE_COLORS.neutral :
      conn.wireType === 'earth' ? WIRE_COLORS.earth :
      WIRE_COLORS.dc;

    edges.push({
      id: `edge-${conn.source}-${conn.target}-${index}`,
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