import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { ELECTRICAL_COMPONENTS } from '@/constants/electricalComponents';
import { ComponentIcon } from './ComponentIcon';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { X, Plus, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ElectricalNodeData {
  componentId: string;
  label: string;
  onRemove?: (nodeId: string) => void;
  onDuplicate?: (nodeId: string) => void;
  isActive?: boolean;
}

export const ElectricalNode = memo<NodeProps<ElectricalNodeData>>(({ id, data, selected }) => {
  const component = ELECTRICAL_COMPONENTS.find(c => c.id === data.componentId);

  if (!component) return null;

  // Determine if this component should have active effects
  const canBeActive = ['bulb', 'fan', 'tubelight', 'led'].some(type => component.id.includes(type));
  const isActive = data.isActive && canBeActive;

  // Visual styles for active state
  const activeGlowClass = isActive ? 'shadow-[0_0_20px_rgba(250,204,21,0.6)] border-yellow-400 ring-2 ring-yellow-400/50' : '';
  const activeIconClass = isActive && component.id.includes('fan') ? 'animate-spin duration-[2s]' : '';
  const activeTextClass = isActive ? 'text-yellow-500 font-bold' : 'text-foreground';

  // Terminal positioning logic
  const topTerminals = component.terminals.filter(t => t.position === 'top');
  const bottomTerminals = component.terminals.filter(t => t.position === 'bottom');
  const leftTerminals = component.terminals.filter(t => t.position === 'left');
  const rightTerminals = component.terminals.filter(t => t.position === 'right');

  const renderHandle = (
    terminal: typeof component.terminals[0],
    index: number,
    total: number,
    position: Position
  ) => {
    const isHorizontal = position === Position.Top || position === Position.Bottom;
    const offset = ((index + 1) / (total + 1)) * 100;

    return (
      <Handle
        key={terminal.id}
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
        relative bg-card border-2 rounded-xl p-3 shadow-lg transition-all duration-300 cursor-move group
        ${selected ? 'border-primary shadow-xl shadow-primary/20 ring-2 ring-primary/20' : 'border-border hover:border-muted-foreground/50'}
        ${activeGlowClass}
        hover:shadow-xl
      `}
      style={{ minWidth: 110, minHeight: 90 }}
    >
      {/* Active Status Badge */}
      {isActive && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 z-20 animate-bounce">
          <Zap className="w-3 h-3 fill-current" />
          {component.id.includes('fan') ? 'ROTATING' : 'GLOWING'}
        </div>
      )}

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

      {/* Duplicate Button - Only visible when selected */}
      {selected && data.onDuplicate && (
        <Button
          variant="default"
          size="icon"
          className="absolute -top-2 -left-2 w-6 h-6 rounded-full z-10 shadow-md bg-green-600 hover:bg-green-700 text-white"
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

      {/* Component Content */}
      <div className="flex flex-col items-center gap-1.5">
        <div className={`transition-transform duration-500 ${activeIconClass}`}>
          <ComponentIcon type={component.icon} className={`w-14 h-14 ${isActive ? 'drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]' : ''}`} />
        </div>
        <span className={`text-xs font-semibold text-center leading-tight max-w-[100px] transition-colors ${activeTextClass}`}>
          {component.name}
        </span>
      </div>

      {/* Selection Indicator */}
      {selected && !isActive && (
        <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full animate-pulse flex items-center justify-center pointer-events-none">
          <div className="w-2 h-2 bg-white rounded-full" />
        </div>
      )}

      {/* Category Badge */}
      {!isActive && (
        <div
          className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground"
        >
          {component.category}
        </div>
      )}
    </div>
  );
});

ElectricalNode.displayName = 'ElectricalNode';
