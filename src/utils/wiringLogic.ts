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
export function getCorrectConnections(
  selectedComponentIds: string[],
  config: { isSeries: boolean; bulbCount?: number } = { isSeries: false }
): CorrectConnection[] {
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

  const bulbCount = config.bulbCount || 0;

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
  } else if (hasMCB && hasSwitch && !hasDB) {
    // No DB: MCB -> Switch
    connections.push({
      source: 'mcb',
      sourceHandle: 'mcb-out-l',
      target: 'switch',
      targetHandle: 'sw-in',
      wireType: 'live',
      description: 'MCB output to Switch input',
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
  } else if (hasSwitch && hasFan && !hasRegulator) {
    // Direct Switch -> Fan (No Regulator)
    connections.push({
      source: 'switch',
      sourceHandle: 'sw-out',
      target: 'fan',
      targetHandle: 'fan-l',
      wireType: 'live',
      description: 'Switch output to Fan live terminal',
    });
  }

  if (hasFan) {
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
    } else if (hasMCB && !hasDB) {
      connections.push({
        source: 'mcb',
        sourceHandle: 'mcb-out-n',
        target: 'fan',
        targetHandle: 'fan-n',
        wireType: 'neutral',
        description: 'MCB neutral to Fan neutral (return path)',
      });
      if (hasSupply) {
        connections.push({
          source: 'power-supply',
          sourceHandle: 'supply-e',
          target: 'fan',
          targetHandle: 'fan-e',
          wireType: 'earth',
          description: 'Supply earth to Fan earth (safety ground)',
        });
      }
    }
  }

  // Light connections - closed circuits
  if (hasLightBulb) {
    if (config.isSeries) {
      // SERIES VALIDATION
      // 1. Switch -> Bulb (Live)
      if (hasSwitch) {
        connections.push({
          source: 'switch',
          sourceHandle: 'sw-out',
          target: 'light-bulb',
          targetHandle: 'bulb-l',
          wireType: 'live',
          description: 'Switch output to First Bulb',
        });
      }

      // 2. Bulb -> Bulb (Series Chain) - ONLY if there are 2+ bulbs
      if (bulbCount >= 2) {
        connections.push({
          source: 'light-bulb',
          sourceHandle: 'bulb-n',
          target: 'light-bulb',
          targetHandle: 'bulb-l',
          wireType: 'live',
          description: 'Bulb Neutral to Next Bulb Live (Series Connection)',
        });
      }

      // 3. Last Bulb -> Neutral (Return)
      if (hasDB) {
        connections.push({
          source: 'distribution-board',
          sourceHandle: 'db-out-n',
          target: 'light-bulb',
          targetHandle: 'bulb-n',
          wireType: 'neutral',
          description: 'Last Bulb Neutral to DB Neutral',
        });
      } else if (hasMCB) {
        connections.push({
          source: 'mcb',
          sourceHandle: 'mcb-out-n',
          target: 'light-bulb',
          targetHandle: 'bulb-n',
          wireType: 'neutral',
          description: 'Last Bulb Neutral to MCB Neutral',
        });
      }

    } else {
      // PARALLEL VALIDATION (Standard)
      // If we have a fan, assume the regulator is for the fan, so connect bulb to switch.
      const useRegulatorForBulb = hasRegulator && !hasFan;

      if (useRegulatorForBulb && hasSwitch) {
        connections.push({
          source: 'switch',
          sourceHandle: 'sw-out',
          target: 'regulator',
          targetHandle: 'reg-in',
          wireType: 'live',
          description: 'Switch output to Regulator input',
        });
        connections.push({
          source: 'regulator',
          sourceHandle: 'reg-out',
          target: 'light-bulb',
          targetHandle: 'bulb-l',
          wireType: 'live',
          description: 'Regulator output to Light Bulb live',
        });
      } else if (hasSwitch) {
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
      } else if (hasMCB && !hasDB) {
        connections.push({
          source: 'mcb',
          sourceHandle: 'mcb-out-n',
          target: 'light-bulb',
          targetHandle: 'bulb-n',
          wireType: 'neutral',
          description: 'MCB neutral to Light Bulb neutral (return path)',
        });
      }
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
    } else if (hasMCB && !hasDB) {
      connections.push({
        source: 'mcb',
        sourceHandle: 'mcb-out-n',
        target: 'light-tube',
        targetHandle: 'tube-n',
        wireType: 'neutral',
        description: 'MCB neutral to Tube Light neutral (return path)',
      });
      if (hasSupply) {
        connections.push({
          source: 'power-supply',
          sourceHandle: 'supply-e',
          target: 'light-tube',
          targetHandle: 'tube-e',
          wireType: 'earth',
          description: 'Supply earth to Tube Light earth (safety ground)',
        });
      }
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

  // FIRE ALARM CIRCUIT VALIDATION (IR Sensor + BC547 + Buzzer + LED)
  const hasBat9V = selectedComponentIds.includes('battery-9v');
  const hasTransistor = selectedComponentIds.includes('transistor-bc547');
  const hasBuzzer = selectedComponentIds.includes('buzzer');
  const hasResistor = selectedComponentIds.includes('resistor');
  const hasIR = selectedComponentIds.includes('ir-sensor');
  const hasLED = selectedComponentIds.includes('led');

  if (hasBat9V && hasTransistor && hasBuzzer && hasResistor && hasIR && hasLED) {
    // 1. Battery(+) -> Buzzer(+)
    connections.push({
      source: 'battery-9v', sourceHandle: 'bat9-pos',
      target: 'buzzer', targetHandle: 'buz-pos',
      wireType: 'dc', description: 'Battery Positive to Buzzer Positive'
    });

    // 2. Buzzer(-) -> Transistor(Collector)
    connections.push({
      source: 'buzzer', sourceHandle: 'buz-neg',
      target: 'transistor-bc547', targetHandle: 'q-c',
      wireType: 'dc', description: 'Buzzer Negative to Transistor Collector'
    });

    // 3. Emitter -> GND (Battery-)
    connections.push({
      source: 'transistor-bc547', sourceHandle: 'q-e',
      target: 'battery-9v', targetHandle: 'bat9-neg',
      wireType: 'dc', description: 'Transistor Emitter to Battery Negative'
    });

    // 4. Battery+ -> Resistor T1
    connections.push({
      source: 'battery-9v', sourceHandle: 'bat9-pos',
      target: 'resistor', targetHandle: 'r-t1',
      wireType: 'dc', description: 'Battery Positive to Resistor'
    });

    // 5. Resistor T2 -> IR Sensor Anode
    connections.push({
      source: 'resistor', sourceHandle: 'r-t2',
      target: 'ir-sensor', targetHandle: 'ir-a',
      wireType: 'dc', description: 'Resistor to IR Sensor Anode'
    });

    // 6. IR Sensor Cathode -> Transistor Base
    connections.push({
      source: 'ir-sensor', sourceHandle: 'ir-c',
      target: 'transistor-bc547', targetHandle: 'q-b',
      wireType: 'dc', description: 'IR Sensor Cathode to Transistor Base'
    });

    // 7. LED Anode -> Battery Positive (Parallel)
    connections.push({
      source: 'battery-9v', sourceHandle: 'bat9-pos',
      target: 'led', targetHandle: 'led-a',
      wireType: 'dc', description: 'Battery Positive to LED Anode'
    });

    // 8. LED Cathode -> Transistor Collector (Parallel with Buzzer)
    connections.push({
      source: 'led', sourceHandle: 'led-c',
      target: 'transistor-bc547', targetHandle: 'q-c',
      wireType: 'dc', description: 'LED Cathode to Transistor Collector'
    });
  }

  // DC MOTOR SPEED CONTROL CIRCUIT (Battery 12V + MOSFET + Potentiometer + DC Motor)
  const hasBat12V = selectedComponentIds.includes('battery');
  const hasMosfet = selectedComponentIds.includes('mosfet-irf');
  const hasPotentiometer = selectedComponentIds.includes('potentiometer');
  const hasDCMotor = selectedComponentIds.includes('dc-motor');

  if (hasBat12V && hasMosfet && hasPotentiometer && hasDCMotor) {
    // 1. Battery(+) -> DC Motor(+)
    connections.push({
      source: 'battery', sourceHandle: 'bat-pos',
      target: 'dc-motor', targetHandle: 'dcm-pos',
      wireType: 'dc', description: 'Battery Positive to DC Motor Positive'
    });

    // 2. DC Motor(-) -> MOSFET Drain
    connections.push({
      source: 'dc-motor', sourceHandle: 'dcm-neg',
      target: 'mosfet-irf', targetHandle: 'mos-d',
      wireType: 'dc', description: 'DC Motor Negative to MOSFET Drain'
    });

    // 3. MOSFET Source -> Battery(-)
    connections.push({
      source: 'mosfet-irf', sourceHandle: 'mos-s',
      target: 'battery', targetHandle: 'bat-neg',
      wireType: 'dc', description: 'MOSFET Source to Battery Negative'
    });

    // 4. Potentiometer T2 -> Battery(+)
    connections.push({
      source: 'battery', sourceHandle: 'bat-pos',
      target: 'potentiometer', targetHandle: 'pot-t2',
      wireType: 'dc', description: 'Battery Positive to Potentiometer T2'
    });

    // 5. Potentiometer Wiper -> MOSFET Gate
    connections.push({
      source: 'potentiometer', sourceHandle: 'pot-wiper',
      target: 'mosfet-irf', targetHandle: 'mos-g',
      wireType: 'dc', description: 'Potentiometer Wiper to MOSFET Gate'
    });

    // 6. Potentiometer T1 -> Battery(-)
    connections.push({
      source: 'potentiometer', sourceHandle: 'pot-t1',
      target: 'battery', targetHandle: 'bat-neg',
      wireType: 'dc', description: 'Potentiometer T1 to Battery Negative'
    });
  }

  // VOLTAGE PROTECTOR CIRCUIT (DP MCB + Voltage Protector + Switch + Single Phase Motor)
  const hasDPMCB = selectedComponentIds.includes('dp-mcb');
  const hasVoltageProtector = selectedComponentIds.includes('voltage-protector');
  const hasSinglePhaseMotor = selectedComponentIds.includes('single-phase-motor');

  if (hasSupply && hasDPMCB && hasVoltageProtector && hasSwitch && hasSinglePhaseMotor) {
    // 1. Supply Live -> DP MCB Phase In
    connections.push({
      source: 'power-supply', sourceHandle: 'supply-l',
      target: 'dp-mcb', targetHandle: 'dpmcb-in-l',
      wireType: 'live', description: 'Supply Live to DP MCB Phase Input'
    });

    // 2. Supply Neutral -> DP MCB Neutral In
    connections.push({
      source: 'power-supply', sourceHandle: 'supply-n',
      target: 'dp-mcb', targetHandle: 'dpmcb-in-n',
      wireType: 'neutral', description: 'Supply Neutral to DP MCB Neutral Input'
    });

    // 3. DP MCB Phase Out -> Voltage Protector In Live
    connections.push({
      source: 'dp-mcb', sourceHandle: 'dpmcb-out-l',
      target: 'voltage-protector', targetHandle: 'vp-in-l',
      wireType: 'live', description: 'DP MCB Output to Voltage Protector Input'
    });

    // 4. DP MCB Neutral Out -> Voltage Protector In Neutral
    connections.push({
      source: 'dp-mcb', sourceHandle: 'dpmcb-out-n',
      target: 'voltage-protector', targetHandle: 'vp-in-n',
      wireType: 'neutral', description: 'DP MCB Neutral to Voltage Protector Neutral'
    });

    // 5. Voltage Protector Out -> Switch In
    connections.push({
      source: 'voltage-protector', sourceHandle: 'vp-out-l',
      target: 'switch', targetHandle: 'sw-in',
      wireType: 'live', description: 'Voltage Protector Output to Switch'
    });

    // 6. Switch Out -> Single Phase Motor Live
    connections.push({
      source: 'switch', sourceHandle: 'sw-out',
      target: 'single-phase-motor', targetHandle: 'spm-l',
      wireType: 'live', description: 'Switch Output to Motor Live'
    });

    // 7. Voltage Protector Out Neutral -> Motor Neutral
    connections.push({
      source: 'voltage-protector', sourceHandle: 'vp-out-n',
      target: 'single-phase-motor', targetHandle: 'spm-n',
      wireType: 'neutral', description: 'Voltage Protector Neutral to Motor Neutral'
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
  config: { isSeries: boolean } = { isSeries: false }
): ConnectionValidationResult {
  const selectedComponentIds = nodes.map(n => n.data.componentId);

  // Count actual number of bulbs
  const bulbCount = nodes.filter(n => n.data.componentId === 'light-bulb').length;

  const correctConnections = getCorrectConnections(selectedComponentIds, { ...config, bulbCount });

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

// Helper to generate smart edges based on actual nodes on canvas
export function getSmartEdges(nodes: Node[], config: { isSeries: boolean } = { isSeries: false }): Edge[] {
  const edges: Edge[] = [];

  const supply = nodes.find(n => n.data.componentId === 'power-supply');
  const mcb = nodes.find(n => n.data.componentId === 'mcb');
  const db = nodes.find(n => n.data.componentId === 'distribution-board');
  const switches = nodes.filter(n => n.data.componentId === 'switch').sort((a, b) => a.position.y - b.position.y);
  const regulators = nodes.filter(n => n.data.componentId === 'regulator').sort((a, b) => a.position.y - b.position.y);
  const fans = nodes.filter(n => n.data.componentId === 'fan').sort((a, b) => a.position.y - b.position.y);
  const bulbs = nodes.filter(n => n.data.componentId === 'light-bulb').sort((a, b) => a.position.x - b.position.x); // Sort by X for series chain
  const tubes = nodes.filter(n => n.data.componentId === 'light-tube');
  const sockets = nodes.filter(n => n.data.componentId.includes('socket'));
  const battery = nodes.find(n => n.data.componentId === 'battery');
  const inverter = nodes.find(n => n.data.componentId === 'inverter');

  const createEdge = (source: Node, sHandle: string, target: Node, tHandle: string, type: 'live' | 'neutral' | 'earth' | 'dc', label?: string) => {
    const wireColor = type === 'live' ? WIRE_COLORS.live : type === 'neutral' ? WIRE_COLORS.neutral : type === 'earth' ? WIRE_COLORS.earth : WIRE_COLORS.dc;
    edges.push({
      id: `wire-${source.id}-${target.id}-${sHandle}-${tHandle}`,
      source: source.id,
      target: target.id,
      sourceHandle: sHandle,
      targetHandle: tHandle,
      type: 'deletable',
      style: { stroke: wireColor, strokeWidth: type === 'live' ? 4 : 3 },
      animated: type === 'live',
      label: label
    });
  };

  if (supply && mcb) {
    createEdge(supply, 'supply-l', mcb, 'mcb-in-l', 'live', 'L');
    createEdge(supply, 'supply-n', mcb, 'mcb-in-n', 'neutral', 'N');
  }

  if (mcb && db) {
    createEdge(mcb, 'mcb-out-l', db, 'db-in-l', 'live');
    createEdge(mcb, 'mcb-out-n', db, 'db-in-n', 'neutral');
  }

  if (supply && db) {
    createEdge(supply, 'supply-e', db, 'db-e', 'earth', 'E');
  }

  if (db) {
    // DB to Switches
    switches.forEach((sw, i) => {
      createEdge(db, i % 2 === 0 ? 'db-out-l1' : 'db-out-l2', sw, 'sw-in', 'live');
    });

    // DB to Sockets
    sockets.forEach(sock => {
      const is15 = sock.data.componentId.includes('15');
      createEdge(db, 'db-out-l2', sock, is15 ? 'sock15-l' : 'sock5-l', 'live');
      createEdge(db, 'db-out-n', sock, is15 ? 'sock15-n' : 'sock5-n', 'neutral');
      createEdge(db, 'db-e', sock, is15 ? 'sock15-e' : 'sock5-e', 'earth');
    });
  } else if (mcb) {
    // NO DB: Connect MCB directly to Switches and Sockets
    switches.forEach((sw) => {
      createEdge(mcb, 'mcb-out-l', sw, 'sw-in', 'live');
    });

    sockets.forEach(sock => {
      const is15 = sock.data.componentId.includes('15');
      createEdge(mcb, 'mcb-out-l', sock, is15 ? 'sock15-l' : 'sock5-l', 'live');
      createEdge(mcb, 'mcb-out-n', sock, is15 ? 'sock15-n' : 'sock5-n', 'neutral');
      if (supply) {
        createEdge(supply, 'supply-e', sock, is15 ? 'sock15-e' : 'sock5-e', 'earth');
      }
    });
  }

  // Switch -> Load Logic
  let swIdx = 0;

  // Fans
  fans.forEach((fan, i) => {
    if (swIdx < switches.length) {
      const sw = switches[swIdx];
      if (i < regulators.length) {
        const reg = regulators[i];
        createEdge(sw, 'sw-out', reg, 'reg-in', 'live');
        createEdge(reg, 'reg-out', fan, 'fan-l', 'live');
      } else {
        createEdge(sw, 'sw-out', fan, 'fan-l', 'live');
      }
      swIdx++;
    }
    if (db) {
      createEdge(db, 'db-out-n', fan, 'fan-n', 'neutral');
      createEdge(db, 'db-e', fan, 'fan-e', 'earth');
    } else {
      if (mcb) createEdge(mcb, 'mcb-out-n', fan, 'fan-n', 'neutral');
      if (supply) createEdge(supply, 'supply-e', fan, 'fan-e', 'earth');
    }
  });

  // Lights
  if (config.isSeries && bulbs.length > 1 && switches.length > 0) {
    // SERIES WIRING: Switch -> Bulb 1 -> Bulb 2 -> ... -> Neutral
    const sw = switches[swIdx]; // Use the next available switch

    // 1. Switch -> First Bulb (Live)
    createEdge(sw, 'sw-out', bulbs[0], 'bulb-l', 'live');

    // 2. Bulb i (Neutral) -> Bulb i+1 (Live)
    for (let i = 0; i < bulbs.length - 1; i++) {
      createEdge(bulbs[i], 'bulb-n', bulbs[i + 1], 'bulb-l', 'live'); // Using live color to indicate current flow
    }

    // 3. Last Bulb (Neutral) -> Return Path
    const lastBulb = bulbs[bulbs.length - 1];
    if (db) {
      createEdge(db, 'db-out-n', lastBulb, 'bulb-n', 'neutral');
    } else if (mcb) {
      createEdge(mcb, 'mcb-out-n', lastBulb, 'bulb-n', 'neutral');
    }

    swIdx++; // Consumed one switch for the whole series
  } else {
    // PARALLEL WIRING (Standard)
    // For parallel bulbs, use ONE switch for all bulbs
    const bulbSwitch = (bulbs.length > 0 && swIdx < switches.length) ? switches[swIdx] : null;

    // Wire all bulbs in parallel
    bulbs.forEach((bulb) => {
      if (bulbSwitch) {
        // All bulbs connect to the SAME switch (parallel)
        createEdge(bulbSwitch, 'sw-out', bulb, 'bulb-l', 'live');
      } else if (db) {
        // No switch available, connect directly to DB
        createEdge(db, 'db-out-l2', bulb, 'bulb-l', 'live');
      }

      // Each bulb's neutral connects back to the neutral source
      if (db) {
        createEdge(db, 'db-out-n', bulb, 'bulb-n', 'neutral');
      } else if (mcb) {
        createEdge(mcb, 'mcb-out-n', bulb, 'bulb-n', 'neutral');
      }
    });

    // Increment switch index only once for all parallel bulbs
    if (bulbs.length > 0 && bulbSwitch) {
      swIdx++;
    }

    // Wire tubes separately (they can have their own switches)
    tubes.forEach((tube) => {
      if (swIdx < switches.length) {
        const sw = switches[swIdx];
        createEdge(sw, 'sw-out', tube, 'tube-l', 'live');
        swIdx++;
      } else if (db) {
        createEdge(db, 'db-out-l2', tube, 'tube-l', 'live');
      }

      if (db) {
        createEdge(db, 'db-out-n', tube, 'tube-n', 'neutral');
        createEdge(db, 'db-e', tube, 'tube-e', 'earth');
      } else {
        if (mcb) createEdge(mcb, 'mcb-out-n', tube, 'tube-n', 'neutral');
        if (supply) createEdge(supply, 'supply-e', tube, 'tube-e', 'earth');
      }
    });
  }

  // Inverter
  if (battery && inverter) {
    createEdge(battery, 'bat-pos', inverter, 'inv-dc-pos', 'dc', '+');
    createEdge(battery, 'bat-neg', inverter, 'inv-dc-neg', 'dc', '-');
    if (db) {
      createEdge(db, 'db-out-l1', inverter, 'inv-ac-in-l', 'live');
      createEdge(db, 'db-out-n', inverter, 'inv-ac-in-n', 'neutral');
    }
  }

  // DC MOTOR SPEED CONTROL CIRCUIT
  const mosfet = nodes.find(n => n.data.componentId === 'mosfet-irf');
  const potentiometer = nodes.find(n => n.data.componentId === 'potentiometer');
  const dcMotor = nodes.find(n => n.data.componentId === 'dc-motor');

  if (battery && mosfet && potentiometer && dcMotor) {
    createEdge(battery, 'bat-pos', dcMotor, 'dcm-pos', 'dc', '+');
    createEdge(dcMotor, 'dcm-neg', mosfet, 'mos-d', 'dc');
    createEdge(mosfet, 'mos-s', battery, 'bat-neg', 'dc', '-');
    createEdge(battery, 'bat-pos', potentiometer, 'pot-t2', 'dc');
    createEdge(potentiometer, 'pot-wiper', mosfet, 'mos-g', 'dc');
    createEdge(potentiometer, 'pot-t1', battery, 'bat-neg', 'dc');
  }

  // VOLTAGE PROTECTOR CIRCUIT
  const dpMcb = nodes.find(n => n.data.componentId === 'dp-mcb');
  const voltageProtector = nodes.find(n => n.data.componentId === 'voltage-protector');
  const singlePhaseMotor = nodes.find(n => n.data.componentId === 'single-phase-motor');
  const vpSwitch = switches.find(s => !fans.some(f => f) || switches.length > fans.length) || switches[0];

  if (supply && dpMcb && voltageProtector && vpSwitch && singlePhaseMotor) {
    createEdge(supply, 'supply-l', dpMcb, 'dpmcb-in-l', 'live', 'P');
    createEdge(supply, 'supply-n', dpMcb, 'dpmcb-in-n', 'neutral', 'N');
    createEdge(dpMcb, 'dpmcb-out-l', voltageProtector, 'vp-in-l', 'live');
    createEdge(dpMcb, 'dpmcb-out-n', voltageProtector, 'vp-in-n', 'neutral');
    createEdge(voltageProtector, 'vp-out-l', vpSwitch, 'sw-in', 'live');
    createEdge(vpSwitch, 'sw-out', singlePhaseMotor, 'spm-l', 'live');
    createEdge(voltageProtector, 'vp-out-n', singlePhaseMotor, 'spm-n', 'neutral');
  }

  // FIRE ALARM / IR SENSOR CIRCUIT
  const bat9v = nodes.find(n => n.data.componentId === 'battery-9v');
  const transistor = nodes.find(n => n.data.componentId === 'transistor-bc547');
  const buzzer = nodes.find(n => n.data.componentId === 'buzzer');
  const resistors = nodes.filter(n => n.data.componentId === 'resistor');
  const irSensor = nodes.find(n => n.data.componentId === 'ir-sensor');
  const led = nodes.find(n => n.data.componentId === 'led');

  if (bat9v && transistor && buzzer && resistors.length > 0 && irSensor && led) {
    const resistor = resistors[0];
    createEdge(bat9v, 'bat9-pos', buzzer, 'buz-pos', 'dc', '+');
    createEdge(buzzer, 'buz-neg', transistor, 'q-c', 'dc');
    createEdge(transistor, 'q-e', bat9v, 'bat9-neg', 'dc', '-');
    createEdge(bat9v, 'bat9-pos', resistor, 'r-t1', 'dc');
    createEdge(resistor, 'r-t2', irSensor, 'ir-a', 'dc');
    createEdge(irSensor, 'ir-c', transistor, 'q-b', 'dc');
    createEdge(bat9v, 'bat9-pos', led, 'led-a', 'dc');
    createEdge(led, 'led-c', transistor, 'q-c', 'dc');
  }

  return edges;
}

export function generateWiringDiagram(selectedComponentIds: string[], existingNodes?: Node[]): WiringResult {
  const nodes: Node[] = [];

  // 1. Node Generation / Preservation
  let componentsToLayout: { id: string; componentId: string; name: string }[] = [];

  if (existingNodes && existingNodes.length > 0) {
    // Use existing nodes
    componentsToLayout = existingNodes.map(n => ({
      id: n.id,
      componentId: n.data.componentId,
      name: n.data.label
    }));
    nodes.push(...existingNodes);
  } else {
    // Create new nodes from selection
    const selectedComponents = selectedComponentIds
      .map(id => ELECTRICAL_COMPONENTS.find(c => c.id === id))
      .filter(Boolean);

    if (selectedComponents.length === 0) return { nodes, edges: [] };

    // Basic Layout Logic (Simplified for new nodes)
    // ... (Keep existing layout logic or simplify it)
    // For now, we'll just place them in a grid or use the existing logic if possible
    // But since we are replacing the function, let's reuse the existing layout logic block
    // RE-IMPLEMENTING LAYOUT LOGIC FROM PREVIOUS VERSION TO KEEP IT WORKING FOR NEW DIAGRAMS

    const hasFan = selectedComponents.some(c => c?.id === 'fan');
    const hasSwitch = selectedComponents.some(c => c?.id === 'switch');
    const hasRegulator = selectedComponents.some(c => c?.id === 'regulator');

    const layoutPositions: Record<string, { x: number; y: number }> = {};

    // ... (Standard positions)
    layoutPositions['power-supply'] = { x: 0, y: 150 };
    layoutPositions['mcb'] = { x: 200, y: 150 };
    layoutPositions['distribution-board'] = { x: 200, y: 270 };

    let xControl = 400;
    let xLoad = 600;

    selectedComponents.forEach((c, i) => {
      if (!c) return;
      if (layoutPositions[c.id]) return; // Already set

      if (c.category === 'control') {
        layoutPositions[c.id] = { x: xControl, y: 150 + (i % 3) * 100 };
        xControl += 100;
      } else if (c.category === 'load') {
        layoutPositions[c.id] = { x: xLoad, y: 100 + (i % 3) * 120 };
        xLoad += 100;
      } else if (c.category === 'backup') {
        layoutPositions[c.id] = { x: 100 + (i * 120), y: 450 };
      }
    });

    selectedComponents.forEach(c => {
      if (!c) return;
      nodes.push({
        id: c.id, // Initial ID
        type: 'electrical',
        position: layoutPositions[c.id] || { x: 100, y: 100 },
        data: { componentId: c.id, label: c.name }
      });
    });
  }

  // 2. Edge Generation (Smart Wiring)
  // Use the new smart connections logic which works on specific nodes
  const edges = getSmartEdges(nodes);

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
