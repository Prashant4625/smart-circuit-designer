import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { ELECTRICAL_COMPONENTS } from '@/constants/electricalComponents';
import { ComponentIcon } from './ComponentIcon';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ElectricalNodeData {
  componentId: string;
  label: string;
  onRemove?: (nodeId: string) => void;
  onDuplicate?: (nodeId: string) => void;
  isWorking?: boolean;
}

export const ElectricalNode = memo<NodeProps<ElectricalNodeData>>(({ id, data, selected }) => {
  const component = ELECTRICAL_COMPONENTS.find(c => c.id === data.componentId);

  if (!component) return null;

  const topTerminals = component.terminals.filter(t => t.position === 'top');
  const bottomTerminals = component.terminals.filter(t => t.position === 'bottom');
  const leftTerminals = component.terminals.filter(t => t.position === 'left');
  const rightTerminals = component.terminals.filter(t => t.position === 'right');

  const isFan = data.componentId === 'fan';
  const isBulb = data.componentId === 'light-bulb';
  const isTube = data.componentId === 'light-tube';
  const isWorking = data.isWorking;

  const renderHandle = (
    terminal: typeof component.terminals[0],
    index: number,
    total: number,
    position: Position
  ) => {
    const isHorizontal = position === Position.Top || position === Position.Bottom;
    const offset = ((index + 1) / (total + 1)) * 100;

    return (
      <TooltipProvider key={terminal.id} delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Handle
                type="source"
                position={position}
                id={terminal.id}
                style={{
                  ...(isHorizontal ? { left: `${offset}%` } : { top: `${offset}%` }),
                  background: terminal.color,
                  width: 14,
                  height: 14,
                  border: '3px solid white',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                  cursor: 'crosshair',
                  transition: 'transform 0.15s ease',
                  zIndex: 10,
                }}
                className="hover:scale-125"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent side={position === Position.Top ? 'top' : position === Position.Bottom ? 'bottom' : position === Position.Left ? 'left' : 'right'}>
            <p className="text-xs font-medium">{terminal.label}</p>
            <p className="text-xs text-muted-foreground">{terminal.type}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (data.onRemove) {
      data.onRemove(id);
    }
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (data.onDuplicate) {
      data.onDuplicate(id);
    }
  };

  return (
    <div
      className={`
        relative bg-card border-2 rounded-xl p-3 shadow-lg transition-all duration-200 cursor-move group
        ${selected ? 'border-primary shadow-xl shadow-primary/20 ring-2 ring-primary/20' : 'border-border hover:border-muted-foreground/50'}
        hover:shadow-xl
        ${isWorking && isBulb ? 'bg-yellow-50' : ''}
        ${isWorking && isTube ? 'bg-blue-50' : ''}
      `}
      style={{ minWidth: 110, minHeight: 90 }}
    >
      {/* Remove Button */}
      <Button
        variant="destructive"
        size="icon"
        className="absolute -top-2 -right-2 w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-md"
        onClick={handleRemove}
        title="Remove Component"
      >
        <X className="w-3 h-3" />
      </Button>

      {/* Duplicate Button */}
      {selected && data.onDuplicate && (
        <Button
          variant="default"
          size="icon"
          className="absolute -top-2 -left-2 w-6 h-6 rounded-full z-10 shadow-md bg-emerald-600 hover:bg-emerald-700 text-primary-foreground"
          onClick={handleDuplicate}
          title="Duplicate Component"
        >
          <Plus className="w-3 h-3" />
        </Button>
      )}

      {/* Top Terminals */}
      {topTerminals.map((terminal, index) =>
        renderHandle(terminal, index, topTerminals.length, Position.Top)
      )}

      {/* Bottom Terminals */}
      {bottomTerminals.map((terminal, index) =>
        renderHandle(terminal, index, bottomTerminals.length, Position.Bottom)
      )}

      {/* Left Terminals */}
      {leftTerminals.map((terminal, index) =>
        renderHandle(terminal, index, leftTerminals.length, Position.Left)
      )}

      {/* Right Terminals */}
      {rightTerminals.map((terminal, index) =>
        renderHandle(terminal, index, rightTerminals.length, Position.Right)
      )}

      {/* Component Content with Working State Indicators */}
      <div className="flex flex-col items-center gap-1.5">
        <div className={`relative ${isWorking && isFan ? 'animate-fan-spin' : ''}`}>
          <ComponentIcon 
            type={component.icon} 
            className={`w-14 h-14 ${isWorking && (isBulb || isTube) ? 'bulb-glow' : ''}`}
          />
          {/* Glowing effect for bulb */}
          {isWorking && isBulb && (
            <div className="absolute inset-0 bg-yellow-400/40 rounded-full blur-xl animate-pulse" />
          )}
          {/* Glowing effect for tube */}
          {isWorking && isTube && (
            <div className="absolute inset-0 bg-blue-300/40 rounded-full blur-xl animate-pulse" />
          )}
        </div>
        <span className="text-xs font-semibold text-foreground text-center leading-tight max-w-[100px]">
          {component.name}
        </span>
        {/* Working status badge */}
        {isWorking && (isFan || isBulb || isTube) && (
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full animate-pulse">
            ⚡ WORKING
          </span>
        )}
      </div>

      {/* Selection Indicator */}
      {selected && (
        <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full animate-pulse flex items-center justify-center pointer-events-none">
          <div className="w-2 h-2 bg-primary-foreground rounded-full" />
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