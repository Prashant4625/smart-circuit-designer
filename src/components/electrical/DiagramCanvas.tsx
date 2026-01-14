import React, { useCallback, useRef, useState, DragEvent } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  NodeTypes,
  Panel,
  ReactFlowInstance,
  Node,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { ElectricalNode } from './ElectricalNode';
import { WIRE_COLORS } from '@/constants/electricalComponents';

interface DiagramCanvasProps {
  nodes: Node[];
  edges: any[];
  onNodesChange: (nodes: Node[]) => void;
  onEdgesChange: (edges: any[]) => void;
  reactFlowRef: React.MutableRefObject<ReactFlowInstance | null>;
  onDropComponent?: (componentId: string, position: { x: number; y: number }) => void;
}

const nodeTypes: NodeTypes = {
  electrical: ElectricalNode,
};

const minimapStyle = {
  height: 120,
  backgroundColor: '#f3f4f6',
};

export const DiagramCanvas: React.FC<DiagramCanvasProps> = ({
  nodes: initialNodes,
  edges: initialEdges,
  onNodesChange: onNodesUpdate,
  onEdgesChange: onEdgesUpdate,
  reactFlowRef,
  onDropComponent,
}) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isDragOver, setIsDragOver] = useState(false);

  // Sync with parent when nodes/edges change externally
  React.useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);

  React.useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  // Update parent when nodes change
  React.useEffect(() => {
    onNodesUpdate(nodes);
  }, [nodes, onNodesUpdate]);

  // Update parent when edges change
  React.useEffect(() => {
    onEdgesUpdate(edges);
  }, [edges, onEdgesUpdate]);

  const onConnect = useCallback(
    (params: Connection) => {
      // Determine wire color based on terminal types
      let strokeColor: string = WIRE_COLORS.live;
      if (params.sourceHandle?.includes('-n') || params.targetHandle?.includes('-n')) {
        strokeColor = WIRE_COLORS.neutral;
      } else if (params.sourceHandle?.includes('-e') || params.targetHandle?.includes('-e')) {
        strokeColor = WIRE_COLORS.earth;
      } else if (params.sourceHandle?.includes('dc') || params.targetHandle?.includes('dc') ||
                 params.sourceHandle?.includes('bat') || params.targetHandle?.includes('bat')) {
        strokeColor = WIRE_COLORS.dc;
      }

      setEdges((eds) =>
        addEdge(
          {
            ...params,
            style: { stroke: strokeColor, strokeWidth: 3 },
            animated: strokeColor === WIRE_COLORS.live,
          },
          eds
        )
      );
    },
    [setEdges]
  );

  const onInit = useCallback((instance: ReactFlowInstance) => {
    reactFlowRef.current = instance;
    instance.fitView({ padding: 0.2 });
  }, [reactFlowRef]);

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  }, []);

  const onDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      setIsDragOver(false);

      const componentId = event.dataTransfer.getData('application/electrical-component');
      if (!componentId || !reactFlowRef.current || !reactFlowWrapper.current) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowRef.current.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      if (onDropComponent) {
        onDropComponent(componentId, position);
      }
    },
    [onDropComponent, reactFlowRef]
  );

  return (
    <div 
      ref={reactFlowWrapper}
      className={`w-full h-full bg-background transition-all duration-200 ${
        isDragOver ? 'ring-2 ring-primary ring-inset bg-primary/5' : ''
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={onInit}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
        className="bg-background"
        defaultEdgeOptions={{
          type: 'smoothstep',
        }}
        snapToGrid
        snapGrid={[15, 15]}
        deleteKeyCode={['Backspace', 'Delete']}
        multiSelectionKeyCode={['Control', 'Meta']}
      >
        <Background color="#e5e7eb" gap={20} />
        <Controls className="bg-card border border-border rounded-lg" />
        <MiniMap
          style={minimapStyle}
          nodeColor={(node) => {
            const category = node.data?.componentId;
            if (category?.includes('mcb') || category?.includes('distribution')) return '#3b82f6';
            if (category?.includes('switch') || category?.includes('regulator')) return '#8b5cf6';
            if (category?.includes('fan') || category?.includes('light') || category?.includes('socket')) return '#10b981';
            if (category?.includes('inverter') || category?.includes('battery')) return '#f59e0b';
            return '#6b7280';
          }}
        />
        
        {/* Legend Panel */}
        <Panel position="top-left" className="bg-card/90 backdrop-blur-sm p-3 rounded-lg border border-border shadow-lg">
          <h4 className="text-xs font-semibold text-foreground mb-2">Wire Colors</h4>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 rounded" style={{ backgroundColor: WIRE_COLORS.live }} />
              <span className="text-xs text-muted-foreground">Live (L)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 rounded" style={{ backgroundColor: WIRE_COLORS.neutral }} />
              <span className="text-xs text-muted-foreground">Neutral (N)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 rounded" style={{ backgroundColor: WIRE_COLORS.earth }} />
              <span className="text-xs text-muted-foreground">Earth (E)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 rounded" style={{ backgroundColor: WIRE_COLORS.dc }} />
              <span className="text-xs text-muted-foreground">DC (+/-)</span>
            </div>
          </div>
        </Panel>

        {/* Instructions Panel */}
        <Panel position="top-right" className="bg-card/90 backdrop-blur-sm p-3 rounded-lg border border-border shadow-lg max-w-xs">
          <h4 className="text-xs font-semibold text-foreground mb-2">Quick Tips</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Drag components to reposition</li>
            <li>• Connect terminals by clicking & dragging</li>
            <li>• Press Delete to remove selected items</li>
            <li>• Use scroll to zoom in/out</li>
          </ul>
        </Panel>

        {/* Drop Zone Indicator */}
        {isDragOver && (
          <Panel position="bottom-right" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg">
            <span className="text-sm font-medium">Drop to add component</span>
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
};
