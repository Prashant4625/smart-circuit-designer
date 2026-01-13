import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { ELECTRICAL_COMPONENTS } from '@/constants/electricalComponents';
import { ComponentIcon } from './ComponentIcon';

interface ElectricalNodeData {
  componentId: string;
  label: string;
}

export const ElectricalNode: React.FC<NodeProps<ElectricalNodeData>> = memo(({ data, selected }) => {
  const component = ELECTRICAL_COMPONENTS.find(c => c.id === data.componentId);
  
  if (!component) return null;

  // Get terminals by position
  const topTerminals = component.terminals.filter(t => t.position === 'top');
  const bottomTerminals = component.terminals.filter(t => t.position === 'bottom');
  const leftTerminals = component.terminals.filter(t => t.position === 'left');
  const rightTerminals = component.terminals.filter(t => t.position === 'right');

  return (
    <div
      className={`
        relative bg-card border-2 rounded-lg p-2 shadow-lg transition-all
        ${selected ? 'border-primary shadow-primary/20' : 'border-border'}
        hover:shadow-xl
      `}
      style={{ minWidth: 100, minHeight: 80 }}
    >
      {/* Top Terminals */}
      {topTerminals.map((terminal, index) => (
        <Handle
          key={terminal.id}
          type="target"
          position={Position.Top}
          id={terminal.id}
          style={{
            left: `${((index + 1) / (topTerminals.length + 1)) * 100}%`,
            background: terminal.color,
            width: 12,
            height: 12,
            border: '2px solid white',
          }}
          title={terminal.label}
        />
      ))}

      {/* Bottom Terminals */}
      {bottomTerminals.map((terminal, index) => (
        <Handle
          key={terminal.id}
          type="source"
          position={Position.Bottom}
          id={terminal.id}
          style={{
            left: `${((index + 1) / (bottomTerminals.length + 1)) * 100}%`,
            background: terminal.color,
            width: 12,
            height: 12,
            border: '2px solid white',
          }}
          title={terminal.label}
        />
      ))}

      {/* Left Terminals */}
      {leftTerminals.map((terminal, index) => (
        <Handle
          key={terminal.id}
          type="target"
          position={Position.Left}
          id={terminal.id}
          style={{
            top: `${((index + 1) / (leftTerminals.length + 1)) * 100}%`,
            background: terminal.color,
            width: 12,
            height: 12,
            border: '2px solid white',
          }}
          title={terminal.label}
        />
      ))}

      {/* Right Terminals */}
      {rightTerminals.map((terminal, index) => (
        <Handle
          key={terminal.id}
          type="source"
          position={Position.Right}
          id={terminal.id}
          style={{
            top: `${((index + 1) / (rightTerminals.length + 1)) * 100}%`,
            background: terminal.color,
            width: 12,
            height: 12,
            border: '2px solid white',
          }}
          title={terminal.label}
        />
      ))}

      {/* Component Content */}
      <div className="flex flex-col items-center gap-1">
        <ComponentIcon type={component.icon} className="w-12 h-12" />
        <span className="text-xs font-medium text-foreground text-center leading-tight">
          {component.name}
        </span>
      </div>

      {/* Selection Indicator */}
      {selected && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse" />
      )}
    </div>
  );
});

ElectricalNode.displayName = 'ElectricalNode';
