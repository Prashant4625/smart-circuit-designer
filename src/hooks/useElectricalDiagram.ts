import { useState, useCallback, useMemo, useEffect } from 'react';
import { Node, Edge } from 'reactflow';
import { ELECTRICAL_COMPONENTS } from '@/constants/electricalComponents';
import { ValidationError } from '@/types/electrical';
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';

interface DiagramState {
  selectedComponents: string[];
  nodes: Node[];
  edges: Edge[];
}

const INITIAL_STATE: DiagramState = {
  selectedComponents: [],
  nodes: [],
  edges: [],
};

export function useElectricalDiagram() {
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [diagramGenerated, setDiagramGenerated] = useState(false);

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

  const toggleComponent = useCallback((componentId: string) => {
    setSelectedComponents(prev => {
      if (prev.includes(componentId)) {
        return prev.filter(id => id !== componentId);
      }
      return [...prev, componentId];
    });
    setDiagramGenerated(false);
  }, []);

  const addRequiredComponent = useCallback((componentId: string) => {
    setSelectedComponents(prev => {
      if (!prev.includes(componentId)) {
        return [...prev, componentId];
      }
      return prev;
    });
  }, []);

  const resetDiagram = useCallback(() => {
    setSelectedComponents([]);
    setNodes([]);
    setEdges([]);
    setDiagramGenerated(false);
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

  const updateNodes = useCallback((newNodes: Node[] | ((nodes: Node[]) => Node[])) => {
    setNodes(newNodes);
  }, []);

  const updateEdges = useCallback((newEdges: Edge[] | ((edges: Edge[]) => Edge[])) => {
    setEdges(newEdges);
  }, []);

  const setGenerated = useCallback((generated: boolean) => {
    setDiagramGenerated(generated);
  }, []);

  return {
    selectedComponents,
    nodes,
    edges,
    validationErrors,
    diagramGenerated,
    toggleComponent,
    addRequiredComponent,
    resetDiagram,
    generateShareableLink,
    updateNodes,
    updateEdges,
    setGenerated,
  };
}
