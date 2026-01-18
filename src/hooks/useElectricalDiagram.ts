import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Node,
  Edge,
  applyNodeChanges,
  applyEdgeChanges,
  OnNodesChange,
  OnEdgesChange,
  NodeChange,
  EdgeChange
} from 'reactflow';
import { ELECTRICAL_COMPONENTS } from '@/constants/electricalComponents';
import { ValidationError } from '@/types/electrical';
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';
import { generateWiringDiagram, validateUserConnections, ConnectionValidationResult, getCorrectConnections } from '@/utils/wiringLogic';
import { WIRE_COLORS } from '@/constants/electricalComponents';
import { toast } from 'sonner';

interface DiagramState {
  selectedComponents: string[];
  nodes: Node[];
  edges: Edge[];
}

export function useElectricalDiagram() {
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [diagramGenerated, setDiagramGenerated] = useState(false);
  const [isManualMode, setIsManualMode] = useState(false);
  const [connectionValidation, setConnectionValidation] = useState<ConnectionValidationResult | null>(null);

  // Load state from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('d');
    if (encoded) {
      try {
        const decoded = decompressFromEncodedURIComponent(encoded);
        if (decoded) {
          const state = JSON.parse(decoded) as DiagramState;
          setSelectedComponents(state.selectedComponents);
          setNodes(state.nodes);
          setEdges(state.edges);
          if (state.nodes.length > 0) {
            setDiagramGenerated(true);
          }
        }
      } catch (e) {
        console.error('Failed to decode diagram state:', e);
      }
    }
  }, []);

  // Validation errors based on component dependencies
  const validationErrors = useMemo<ValidationError[]>(() => {
    const errors: ValidationError[] = [];

    selectedComponents.forEach(compId => {
      const component = ELECTRICAL_COMPONENTS.find(c => c.id === compId);
      if (component?.requires) {
        const missing = component.requires.filter(reqId => !selectedComponents.includes(reqId));
        if (missing.length > 0) {
          errors.push({
            componentId: compId,
            message: `${component.name} requires: ${missing.map(id =>
              ELECTRICAL_COMPONENTS.find(c => c.id === id)?.name
            ).join(', ')}`,
            requiredComponents: missing,
          });
        }
      }
    });

    return errors;
  }, [selectedComponents]);

  const hasErrors = validationErrors.length > 0;
  const canGenerate = selectedComponents.length > 0;

  // Remove component from canvas
  const removeComponent = useCallback((nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    const componentId = node.data.componentId;

    // Remove node
    setNodes(currentNodes => currentNodes.filter(n => n.id !== nodeId));

    // Clear ALL edges to allow manual rewiring
    setEdges([]);

    // Enable manual mode
    setIsManualMode(true);
    setConnectionValidation(null);

    // Remove from selected components if no other nodes have this component
    setSelectedComponents(prev => {
      const otherNodesWithSameComponent = nodes.filter(
        n => n.id !== nodeId && n.data.componentId === componentId
      );
      if (otherNodesWithSameComponent.length === 0) {
        return prev.filter(id => id !== componentId);
      }
      return prev;
    });

    toast.info(`Removed ${componentId.replace('-', ' ')}. Diagram cleared for manual editing.`);
  }, [nodes]);
  const toggleComponent = useCallback((componentId: string) => {
    setSelectedComponents(prev => {
      const isSelected = prev.includes(componentId);

      if (isSelected) {
        // Remove component
        setNodes(currentNodes => currentNodes.filter(n => n.data.componentId !== componentId));
        setEdges([]); // Clear edges on removal
        setIsManualMode(true);
        setConnectionValidation(null);
        toast.info(`Removed ${componentId.replace('-', ' ')}`);
        return prev.filter(id => id !== componentId);
      } else {
        // Add component
        const component = ELECTRICAL_COMPONENTS.find(c => c.id === componentId);
        if (component) {
          const newNode: Node = {
            id: `${componentId}-${Date.now()}`,
            type: 'electrical',
            position: { x: 100 + Math.random() * 400, y: 100 + Math.random() * 300 },
            data: {
              componentId: component.id,
              label: component.name,
            },
          };
          setNodes(prevNodes => [...prevNodes, newNode]);
          setDiagramGenerated(true);
          setIsManualMode(true);
        }
        return [...prev, componentId];
      }
    });
  }, []);

  const addRequiredComponent = useCallback((componentId: string) => {
    setSelectedComponents(prev => {
      if (!prev.includes(componentId)) {
        return [...prev, componentId];
      }
      return prev;
    });
  }, []);

  const addComponentAtPosition = useCallback((componentId: string, position: { x: number; y: number }) => {
    // Check if component already exists (for singletons)
    const singletons = ['power-supply', 'mcb', 'distribution-board', 'battery', 'inverter'];
    if (singletons.includes(componentId)) {
      const existingNode = nodes.find(n => n.data.componentId === componentId);
      if (existingNode) {
        toast.warning(`${componentId.replace('-', ' ')} is already added. Only one instance allowed.`);
        return;
      }
    }

    const component = ELECTRICAL_COMPONENTS.find(c => c.id === componentId);
    if (!component) return;

    // Create new node with remove handler
    const newNode: Node = {
      id: `${componentId}-${Date.now()}`,
      type: 'electrical',
      position,
      data: {
        componentId: component.id,
        label: component.name,
      },
    };

    setNodes(prev => [...prev, newNode]);

    // Add to selected components if not already
    setSelectedComponents(prev => {
      if (!prev.includes(componentId)) {
        return [...prev, componentId];
      }
      return prev;
    });

    setDiagramGenerated(true);
    setIsManualMode(true); // Enable manual mode when dragging components
  }, [nodes]);

  const duplicateComponent = useCallback((nodeId: string) => {
    const sourceNode = nodes.find(n => n.id === nodeId);
    if (!sourceNode) return;

    const componentId = sourceNode.data.componentId;

    // Check for singletons (prevent duplication)
    const singletons = ['power-supply', 'mcb', 'distribution-board', 'battery', 'inverter'];
    if (singletons.includes(componentId)) {
      toast.warning(`${componentId.replace('-', ' ')} cannot be duplicated. Only one instance allowed.`);
      return;
    }

    const component = ELECTRICAL_COMPONENTS.find(c => c.id === componentId);
    if (!component) return;

    // Create new node with offset position
    const newNode: Node = {
      id: `${componentId}-${Date.now()}`,
      type: 'electrical',
      position: {
        x: sourceNode.position.x + 50,
        y: sourceNode.position.y + 50
      },
      data: {
        componentId: component.id,
        label: component.name,
      },
    };

    setNodes(prev => [...prev, newNode]);

    // Select the new node
    setSelectedComponents(prev => {
      if (!prev.includes(componentId)) {
        return [...prev, componentId];
      }
      return prev;
    });

    toast.success(`Duplicated ${component.name}`);
  }, [nodes]);

  const generateDiagram = useCallback(() => {
    if (hasErrors) return;

    const { nodes: newNodes, edges: newEdges } = generateWiringDiagram(selectedComponents);
    setNodes(newNodes);
    setEdges(newEdges);
    setDiagramGenerated(true);
    setIsManualMode(false);
    setConnectionValidation(null);
  }, [selectedComponents, hasErrors]);

  // Generate nodes only (for manual wiring practice)
  const generateNodesOnly = useCallback(() => {
    if (hasErrors) return;

    const { nodes: newNodes } = generateWiringDiagram(selectedComponents);
    setNodes(newNodes);
    setEdges([]); // No edges - user will connect manually
    setDiagramGenerated(true);
    setIsManualMode(true);
    setConnectionValidation(null);
    toast.info('Manual mode: Connect the wires yourself!');
  }, [selectedComponents, hasErrors]);

  const autoArrange = useCallback(() => {
    if (nodes.length === 0) return;

    // Pass existing nodes to preserve duplicates and data
    const { nodes: arrangedNodes, edges: arrangedEdges } = generateWiringDiagram(selectedComponents, nodes);
    setNodes(arrangedNodes);
    setEdges(arrangedEdges);
    setIsManualMode(false);
    setConnectionValidation(null);
    toast.success('Diagram arranged and wired!');
  }, [selectedComponents, nodes]);

  const resetDiagram = useCallback(() => {
    setSelectedComponents([]);
    setNodes([]);
    setEdges([]);
    setDiagramGenerated(false);
    setIsManualMode(false);
    setConnectionValidation(null);
    window.history.replaceState({}, '', window.location.pathname);
  }, []);

  const generateShareableLink = useCallback(() => {
    const state: DiagramState = {
      selectedComponents,
      nodes,
      edges,
    };
    const encoded = compressToEncodedURIComponent(JSON.stringify(state));
    const url = `${window.location.origin}${window.location.pathname}?d=${encoded}`;
    return url;
  }, [selectedComponents, nodes, edges]);

  // Auto-connect wires for existing components
  const autoConnectWires = useCallback((wiringMode: 'series' | 'parallel' | 'all' = 'all') => {
    if (nodes.length === 0) {
      toast.error('No components to wire!');
      return;
    }

    // Generate edges based on correct connections
    const componentIds = nodes.map(n => n.data.componentId);
    const correctConnections = getCorrectConnections(componentIds);
    const newEdges: Edge[] = [];

    console.log('Auto-Wire Debug:', { nodes, componentIds, correctConnections });

    correctConnections.forEach((conn, index) => {
      // Find actual nodes for source and target
      // We find the first matching node for the component type
      const sourceNode = nodes.find(n => n.data.componentId === conn.source);
      const targetNode = nodes.find(n => n.data.componentId === conn.target);

      if (sourceNode && targetNode) {
        const wireColor = conn.wireType === 'live' ? WIRE_COLORS.live :
          conn.wireType === 'neutral' ? WIRE_COLORS.neutral :
            conn.wireType === 'earth' ? WIRE_COLORS.earth :
              WIRE_COLORS.dc;

        newEdges.push({
          id: `auto-${sourceNode.id}-${targetNode.id}-${index}`,
          source: sourceNode.id,
          target: targetNode.id,
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
      } else {
        console.warn('Could not find nodes for connection:', conn);
      }
    });

    if (newEdges.length === 0) {
      toast.warning(`Found ${correctConnections.length} connections but could not create edges. Check console.`);
    } else {
      setEdges(newEdges);
      setConnectionValidation(null);
      toast.success(`Auto-connected ${newEdges.length} wires!`);
    }
  }, [nodes]);

  // Validate user connections (Enforcing Series Mode)
  const validateConnections = useCallback(() => {
    if (nodes.length === 0) return;

    // Enforce Series Mode for validation as per user request
    const result = validateUserConnections(edges, nodes);
    setConnectionValidation(result);

    // Visually mark edges based on validation result
    const newEdges = edges.map(edge => {
      const isIncorrect = result.incorrectEdges.some(ie => ie.edge.id === edge.id);
      const isCorrect = result.correctEdges.some(ce => ce.id === edge.id);

      if (isIncorrect) {
        return {
          ...edge,
          animated: true,
          style: { ...edge.style, stroke: '#ef4444', strokeWidth: 3, strokeDasharray: '5,5' }, // Red dashed
          label: '❌',
          labelStyle: { fill: '#ef4444', fontWeight: 700, fontSize: 16 },
          labelBgStyle: { fill: 'white', fillOpacity: 0.9 },
        };
      } else if (isCorrect) {
        return {
          ...edge,
          animated: false,
          // Keep original color (don't override stroke)
          style: { ...edge.style, strokeWidth: 3 },
          label: '✓',
          labelStyle: { fill: '#22c55e', fontWeight: 700, fontSize: 16 }, // Green Tick
          labelBgStyle: { fill: 'white', fillOpacity: 0.9 },
        };
      }
      return edge;
    });

    setEdges(newEdges);

    // Update nodes to show active state if validation passes
    const newNodes = nodes.map(node => {
      // Only activate loads (bulb, fan, tubelight, led)
      const isLoad = ['bulb', 'fan', 'tubelight', 'led'].some(type => node.data.componentId.includes(type));

      if (result.isValid && isLoad) {
        return {
          ...node,
          data: { ...node.data, isActive: true }
        };
      } else {
        return {
          ...node,
          data: { ...node.data, isActive: false }
        };
      }
    });
    setNodes(newNodes);

    if (result.isValid) {
      toast.success('🎉 Perfect! All connections are correct!');
    } else {
      toast.error(`Incorrect Connections! Score: ${result.score}/${result.totalExpected}`);
      toast.info('Check the panel for hints on how to fix the errors.');
    }
  }, [edges, nodes]);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  // History for Undo (Nodes + Edges)
  const [history, setHistory] = useState<{ nodes: Node[], edges: Edge[] }[]>([]);

  const saveHistory = useCallback(() => {
    setHistory(prev => [...prev, { nodes: [...nodes], edges: [...edges] }]);
  }, [nodes, edges]);

  const undo = useCallback(() => {
    setHistory(prev => {
      if (prev.length === 0) return prev;
      const newHistory = [...prev];
      const previousState = newHistory.pop();
      if (previousState) {
        setNodes(previousState.nodes);
        setEdges(previousState.edges);
      }
      return newHistory;
    });
  }, []);

  const canUndo = history.length > 0;

  // Wrapper to save history before changing edges (for manual connections)
  const setEdgesWithHistory = useCallback((newEdges: Edge[] | ((prev: Edge[]) => Edge[])) => {
    setEdges(prev => {
      // Save current state (nodes + edges) before modifying edges
      setHistory(h => [...h, { nodes: [...nodes], edges: [...prev] }]);

      if (typeof newEdges === 'function') {
        return newEdges(prev);
      }
      return newEdges;
    });
  }, [nodes]); // Depend on nodes to save correct state

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      setEdgesWithHistory((eds) => applyEdgeChanges(changes, eds));
    },
    [setEdgesWithHistory]
  );

  return {
    selectedComponents,
    nodes,
    edges,
    validationErrors,
    diagramGenerated,
    isManualMode,
    connectionValidation,
    toggleComponent,
    addRequiredComponent,
    addComponentAtPosition,
    removeComponent,
    generateDiagram,
    generateNodesOnly,
    autoArrange,
    autoConnectWires,
    resetDiagram,
    generateShareableLink,
    validateConnections,
    setNodes,
    setEdges: setEdgesWithHistory,
    onNodesChange,
    onEdgesChange,
    hasErrors,
    canGenerate,
    undo,
    canUndo,
    duplicateComponent,
  };
}
