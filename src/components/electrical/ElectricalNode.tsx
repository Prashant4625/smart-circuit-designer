import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { ELECTRICAL_COMPONENTS } from '@/constants/electricalComponents';
import { ComponentIcon } from './ComponentIcon';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ElectricalNodeData {
  componentId: string;
  label: string;
}

export const ElectricalNode = memo<NodeProps<ElectricalNodeData>>(({ data, selected }) => {
  const component = ELECTRICAL_COMPONENTS.find(c => c.id === data.componentId);
  
  if (!component) return null;

  // Get terminals by position
  const topTerminals = component.terminals.filter(t => t.position === 'top');
  const bottomTerminals = component.terminals.filter(t => t.position === 'bottom');
  const leftTerminals = component.terminals.filter(t => t.position === 'left');
  const rightTerminals = component.terminals.filter(t => t.position === 'right');

  const renderHandle = (
    terminal: typeof component.terminals[0],
    index: number,
    total: number,
    position: Position,
    type: 'source' | 'target'
  ) => {
    const isHorizontal = position === Position.Top || position === Position.Bottom;
    const offset = ((index + 1) / (total + 1)) * 100;

    return (
      <TooltipProvider key={terminal.id} delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Handle
              type={type}
              position={position}
              id={terminal.id}
              style={{
                ...(isHorizontal ? { left: `${offset}%` } : { top: `${offset}%` }),
                background: terminal.color,
                width: 14,
                height: 14,
                border: '2px solid white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                cursor: 'crosshair',
                transition: 'transform 0.15s ease',
              }}
              className="hover:scale-125"
            />
          </TooltipTrigger>
          <TooltipContent side={position === Position.Top ? 'top' : position === Position.Bottom ? 'bottom' : position === Position.Left ? 'left' : 'right'}>
            <p className="text-xs font-medium">{terminal.label}</p>
            <p className="text-xs text-muted-foreground">{terminal.type}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div
      className={`
        relative bg-card border-2 rounded-xl p-3 shadow-lg transition-all duration-200 cursor-move
        ${selected ? 'border-primary shadow-xl shadow-primary/20 ring-2 ring-primary/20' : 'border-border hover:border-muted-foreground/50'}
        hover:shadow-xl
      `}
      style={{ minWidth: 110, minHeight: 90 }}
    >
      {/* Top Terminals */}
      {topTerminals.map((terminal, index) => 
        renderHandle(terminal, index, topTerminals.length, Position.Top, 'target')
      )}

      {/* Bottom Terminals */}
      {bottomTerminals.map((terminal, index) => 
        renderHandle(terminal, index, bottomTerminals.length, Position.Bottom, 'source')
      )}

      {/* Left Terminals */}
      {leftTerminals.map((terminal, index) => 
        renderHandle(terminal, index, leftTerminals.length, Position.Left, 'target')
      )}

      {/* Right Terminals */}
      {rightTerminals.map((terminal, index) => 
        renderHandle(terminal, index, rightTerminals.length, Position.Right, 'source')
      )}

      {/* Component Content */}
      <div className="flex flex-col items-center gap-1.5">
        <ComponentIcon type={component.icon} className="w-14 h-14" />
        <span className="text-xs font-semibold text-foreground text-center leading-tight max-w-[100px]">
          {component.name}
        </span>
      </div>

      {/* Selection Indicator */}
      {selected && (
        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary rounded-full animate-pulse flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full" />
        </div>
      )}

      {/* Category Badge */}
      <div 
        className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground"
      >
        {component.category}
      </div>
    </div>
  );
});

ElectricalNode.displayName = 'ElectricalNode';
