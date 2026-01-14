import React from 'react';
import { ElectricalComponent } from '@/types/electrical';
import { ComponentIcon } from './ComponentIcon';
import { cn } from '@/lib/utils';
import { GripVertical } from 'lucide-react';

interface DraggableComponentProps {
  component: ElectricalComponent;
  onDragStart: (event: React.DragEvent, component: ElectricalComponent) => void;
}

export const DraggableComponent: React.FC<DraggableComponentProps> = ({
  component,
  onDragStart,
}) => {
  const handleDragStart = (event: React.DragEvent) => {
    onDragStart(event, component);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className={cn(
        "flex items-center gap-2 p-2 rounded-lg border border-dashed border-muted-foreground/30",
        "bg-muted/30 cursor-grab active:cursor-grabbing",
        "hover:border-primary/50 hover:bg-primary/5 transition-all duration-200",
        "select-none"
      )}
    >
      <GripVertical className="w-4 h-4 text-muted-foreground/50 flex-shrink-0" />
      <ComponentIcon type={component.icon} className="w-8 h-8 flex-shrink-0" />
      <span className="text-xs font-medium text-foreground truncate">{component.name}</span>
    </div>
  );
};
