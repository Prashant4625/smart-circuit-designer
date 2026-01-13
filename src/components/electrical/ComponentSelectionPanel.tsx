import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ELECTRICAL_COMPONENTS, COMPONENT_CATEGORIES } from '@/constants/electricalComponents';
import { ComponentCard } from './ComponentCard';
import { ValidationError } from '@/types/electrical';

interface ComponentSelectionPanelProps {
  selectedComponents: string[];
  validationErrors: ValidationError[];
  onToggleComponent: (componentId: string) => void;
  onAddRequired: (componentId: string) => void;
}

export const ComponentSelectionPanel: React.FC<ComponentSelectionPanelProps> = ({
  selectedComponents,
  validationErrors,
  onToggleComponent,
  onAddRequired,
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

  return (
    <div className="h-full flex flex-col bg-card border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-bold text-foreground">Components</h2>
        <p className="text-sm text-muted-foreground">
          Select components to add to your diagram
        </p>
        {selectedComponents.length > 0 && (
          <div className="mt-2 text-xs text-muted-foreground">
            <span className="font-medium text-primary">{selectedComponents.length}</span> components selected
          </div>
        )}
      </div>

      {/* Component List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {sortedCategories.map(([category, { label }]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                {label}
              </h3>
              <div className="space-y-2">
                {groupedComponents[category]?.map((component) => {
                  const error = validationErrors.find(
                    (e) => e.componentId === component.id
                  );
                  return (
                    <ComponentCard
                      key={component.id}
                      component={component}
                      isSelected={selectedComponents.includes(component.id)}
                      onToggle={() => onToggleComponent(component.id)}
                      error={error}
                      onAddRequired={onAddRequired}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
