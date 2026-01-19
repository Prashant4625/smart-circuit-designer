import React, { useCallback } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ELECTRICAL_COMPONENTS, COMPONENT_CATEGORIES } from '@/constants/electricalComponents';
import { ComponentCard } from './ComponentCard';
import { ValidationError, ElectricalComponent } from '@/types/electrical';
import { Anchor, Zap, ToggleLeft, Lightbulb } from 'lucide-react';

interface ComponentSelectionPanelProps {
  selectedComponents: string[];
  validationErrors: ValidationError[];
  onToggleComponent: (componentId: string) => void;
  onAddRequired: (componentId: string) => void;
  onDragStart?: (event: React.DragEvent, component: ElectricalComponent) => void;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'power':
      return <Zap className="w-3.5 h-3.5" />;
    case 'control':
      return <ToggleLeft className="w-3.5 h-3.5" />;
    case 'load':
      return <Lightbulb className="w-3.5 h-3.5" />;
    default:
      return <Zap className="w-3.5 h-3.5" />;
  }
};

export const ComponentSelectionPanel: React.FC<ComponentSelectionPanelProps> = ({
  selectedComponents,
  validationErrors,
  onToggleComponent,
  onAddRequired,
  onDragStart,
}) => {
  // Group components by category
  const groupedComponents = React.useMemo(() => {
    const groups: Record<string, typeof ELECTRICAL_COMPONENTS> = {};

    Object.keys(COMPONENT_CATEGORIES).forEach((category) => {
      groups[category] = ELECTRICAL_COMPONENTS.filter(
        (comp) => comp.category === category
      );
    });

    return groups;
  }, []);

  // Sort categories by order
  const sortedCategories = Object.entries(COMPONENT_CATEGORIES)
    .sort((a, b) => a[1].order - b[1].order);

  const handleDragStart = useCallback((event: React.DragEvent, component: ElectricalComponent) => {
    if (onDragStart) {
      onDragStart(event, component);
    }
  }, [onDragStart]);

  return (
    <div className="h-full flex flex-col navy-panel">
      {/* Header */}
      <div className="navy-panel-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Anchor className="w-4 h-4 text-[#FFD700]" />
          <span>Components</span>
        </div>
        {selectedComponents.length > 0 && (
          <span className="navy-badge-gold text-[10px]">
            {selectedComponents.length} Selected
          </span>
        )}
      </div>
      
      <div className="px-4 py-2 bg-gradient-to-b from-[#003366]/5 to-transparent border-b border-[#003366]/10">
        <p className="text-xs text-[#003366]/60">
          Click to add components to canvas
        </p>
      </div>

      <ScrollArea className="flex-1 navy-scrollbar">
        <div className="p-4 space-y-5">
          {sortedCategories.map(([category, { label }]) => (
            <div key={category}>
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded bg-gradient-to-b from-[#003366] to-[#001a33] text-[#FFD700]">
                  {getCategoryIcon(category)}
                </div>
                <h3 className="text-xs font-bold text-[#003366] uppercase tracking-wider">
                  {label}
                </h3>
                <div className="flex-1 h-px bg-gradient-to-r from-[#003366]/20 to-transparent" />
              </div>
              <div className="space-y-3 pl-1">
                {groupedComponents[category]?.map((component) => {
                  const isSelected = selectedComponents.includes(component.id);
                  const error = validationErrors.find(
                    (e) => e.componentId === component.id
                  );

                  return (
                    <div key={component.id} className="space-y-1">
                      <ComponentCard
                        component={component}
                        isSelected={isSelected}
                        onToggle={() => onToggleComponent(component.id)}
                        error={error}
                        onAddRequired={onAddRequired}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      {/* Footer decoration */}
      <div className="p-3 border-t border-[#003366]/10 bg-gradient-to-t from-[#003366]/5 to-transparent">
        <div className="flex items-center justify-center gap-2 text-[#003366]/40">
          <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#FFD700]/40" />
          <Anchor className="w-3 h-3 text-[#FFD700]/50" />
          <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#FFD700]/40" />
        </div>
      </div>
    </div>
  );
};