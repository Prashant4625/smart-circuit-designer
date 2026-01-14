import React, { useCallback } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ELECTRICAL_COMPONENTS, COMPONENT_CATEGORIES } from '@/constants/electricalComponents';
import { ComponentCard } from './ComponentCard';
import { DraggableComponent } from './DraggableComponent';
import { ValidationError, ElectricalComponent } from '@/types/electrical';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToggleLeft, Move } from 'lucide-react';

interface ComponentSelectionPanelProps {
  selectedComponents: string[];
  validationErrors: ValidationError[];
  onToggleComponent: (componentId: string) => void;
  onAddRequired: (componentId: string) => void;
  onDragStart?: (event: React.DragEvent, component: ElectricalComponent) => void;
}

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
    <div className="h-full flex flex-col bg-card border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-bold text-foreground">Components</h2>
        <p className="text-sm text-muted-foreground">
          Toggle or drag components to canvas
        </p>
        {selectedComponents.length > 0 && (
          <div className="mt-2 text-xs text-muted-foreground">
            <span className="font-medium text-primary">{selectedComponents.length}</span> components selected
          </div>
        )}
      </div>

      <Tabs defaultValue="toggle" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="mx-4 mt-2 grid w-auto grid-cols-2">
          <TabsTrigger value="toggle" className="gap-1 text-xs">
            <ToggleLeft className="w-3 h-3" />
            Toggle Mode
          </TabsTrigger>
          <TabsTrigger value="drag" className="gap-1 text-xs">
            <Move className="w-3 h-3" />
            Drag & Drop
          </TabsTrigger>
        </TabsList>

        {/* Toggle Mode */}
        <TabsContent value="toggle" className="flex-1 overflow-hidden m-0">
          <ScrollArea className="h-full">
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
        </TabsContent>

        {/* Drag & Drop Mode */}
        <TabsContent value="drag" className="flex-1 overflow-hidden m-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded-md">
                💡 Drag components directly onto the canvas to add them to your diagram
              </p>
              {sortedCategories.map(([category, { label }]) => (
                <div key={category}>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    {label}
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {groupedComponents[category]?.map((component) => (
                      <DraggableComponent
                        key={component.id}
                        component={component}
                        onDragStart={handleDragStart}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};
