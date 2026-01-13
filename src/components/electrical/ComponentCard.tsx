import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { ElectricalComponent, ValidationError } from '@/types/electrical';
import { ComponentIcon } from './ComponentIcon';
import { cn } from '@/lib/utils';

interface ComponentCardProps {
  component: ElectricalComponent;
  isSelected: boolean;
  onToggle: () => void;
  error?: ValidationError;
  onAddRequired?: (componentId: string) => void;
}

export const ComponentCard: React.FC<ComponentCardProps> = ({
  component,
  isSelected,
  onToggle,
  error,
  onAddRequired,
}) => {
  return (
    <div
      className={cn(
        "relative p-3 rounded-lg border-2 transition-all duration-200",
        isSelected 
          ? "border-primary bg-primary/5 shadow-md" 
          : "border-border bg-card hover:border-muted-foreground/30",
        error && "border-destructive bg-destructive/5"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Component Icon */}
        <div className="flex-shrink-0">
          <ComponentIcon type={component.icon} className="w-14 h-14" />
        </div>

        {/* Component Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-sm text-foreground truncate">
              {component.name}
            </h4>
            <Switch
              checked={isSelected}
              onCheckedChange={onToggle}
              className="ml-2"
            />
          </div>
          
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
            {component.description}
          </p>

          {/* Terminal Indicators */}
          <div className="flex flex-wrap gap-1">
            {component.terminals.slice(0, 4).map((terminal) => (
              <Badge
                key={terminal.id}
                variant="outline"
                className="text-[10px] px-1.5 py-0"
                style={{ 
                  borderColor: terminal.color,
                  color: terminal.color,
                }}
              >
                {terminal.label.split(' ')[0]}
              </Badge>
            ))}
            {component.terminals.length > 4 && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                +{component.terminals.length - 4}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Status Indicator */}
      {isSelected && !error && (
        <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-primary" />
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-2 p-2 bg-destructive/10 rounded-md">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-destructive font-medium">
                {error.message}
              </p>
              <div className="flex flex-wrap gap-1 mt-1">
                {error.requiredComponents.map((reqId) => (
                  <button
                    key={reqId}
                    onClick={() => onAddRequired?.(reqId)}
                    className="text-xs bg-destructive text-destructive-foreground px-2 py-0.5 rounded hover:bg-destructive/90 transition-colors"
                  >
                    + Add
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Required By Indicator */}
      {component.requiredBy && component.requiredBy.length > 0 && !isSelected && (
        <div className="mt-2">
          <p className="text-[10px] text-muted-foreground italic">
            Required by: {component.requiredBy.join(', ')}
          </p>
        </div>
      )}
    </div>
  );
};
