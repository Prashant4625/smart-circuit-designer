import { useState, useCallback, useMemo, useEffect } from 'react';
import { Node, Edge } from 'reactflow';
import { ELECTRICAL_COMPONENTS } from '@/constants/electricalComponents';
import { ValidationError } from '@/types/electrical';
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';
import { generateWiringDiagram } from '@/utils/wiringLogic';

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

  const generateDiagram = useCallback(() => {
    if (hasErrors) return;
    
    const { nodes: newNodes, edges: newEdges } = generateWiringDiagram(selectedComponents);
    setNodes(newNodes);
    setEdges(newEdges);
    setDiagramGenerated(true);
  }, [selectedComponents, hasErrors]);

  const autoArrange = useCallback(() => {
    if (nodes.length === 0) return;
    
    const { nodes: arrangedNodes, edges: arrangedEdges } = generateWiringDiagram(selectedComponents);
    setNodes(arrangedNodes);
    setEdges(arrangedEdges);
  }, [selectedComponents, nodes.length]);

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

  return {
    selectedComponents,
    nodes,
    edges,
    validationErrors,
    diagramGenerated,
    toggleComponent,
    addRequiredComponent,
    generateDiagram,
    autoArrange,
    resetDiagram,
    generateShareableLink,
    setNodes,
    setEdges,
    hasErrors,
    canGenerate,
  };
}
