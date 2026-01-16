import { useRef, useState, useCallback, DragEvent } from 'react';
import { ReactFlowInstance } from 'reactflow';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { toast } from 'sonner';
import { ChevronDown, ChevronUp, FileText, Wand2 } from 'lucide-react';
import { useElectricalDiagram } from '@/hooks/useElectricalDiagram';
import { ComponentSelectionPanel } from '@/components/electrical/ComponentSelectionPanel';
import { DiagramCanvas } from '@/components/electrical/DiagramCanvas';
import { Toolbar } from '@/components/electrical/Toolbar';
import { ConnectionValidationPanel } from '@/components/electrical/ConnectionValidationPanel';
import { generateWiringExplanation } from '@/utils/wiringLogic';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ElectricalComponent } from '@/types/electrical';

const Index = () => {
  const {
    selectedComponents,
    nodes,
    edges,
    validationErrors,
    isManualMode,
    connectionValidation,
    toggleComponent,
    addRequiredComponent,
    addComponentAtPosition,
    removeComponent,
    generateDiagram,
    generateNodesOnly,
    autoArrange,
    autoConnectWires,
    resetDiagram,
    generateShareableLink,
    validateConnections,
    showCorrectConnections,
    setNodes,
    setEdges,
    hasErrors,
    canGenerate,
  } = useElectricalDiagram();

  const reactFlowRef = useRef<ReactFlowInstance | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleDragStart = useCallback((event: DragEvent, component: ElectricalComponent) => {
    event.dataTransfer.setData('application/electrical-component', component.id);
    event.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDropComponent = useCallback((componentId: string, position: { x: number; y: number }) => {
    addComponentAtPosition(componentId, position);
    toast.success(`Added ${componentId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}`);
  }, [addComponentAtPosition]);

  const handleExportPNG = useCallback(async () => {
    if (!canvasContainerRef.current) return;
    try {
      const reactFlowViewport = canvasContainerRef.current.querySelector('.react-flow');
      if (!reactFlowViewport) { toast.error('No diagram to export'); return; }
      const dataUrl = await toPng(reactFlowViewport as HTMLElement, { backgroundColor: '#ffffff', quality: 1, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = 'electrical-diagram.png';
      link.href = dataUrl;
      link.click();
      toast.success('Diagram exported as PNG');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export diagram');
    }
  }, []);

  const handleExportPDF = useCallback(async () => {
    if (!canvasContainerRef.current) return;
    try {
      const reactFlowViewport = canvasContainerRef.current.querySelector('.react-flow');
      if (!reactFlowViewport) { toast.error('No diagram to export'); return; }
      const dataUrl = await toPng(reactFlowViewport as HTMLElement, { backgroundColor: '#ffffff', quality: 1, pixelRatio: 2 });
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      pdf.setFontSize(18);
      pdf.text('Electrical Wiring Diagram', pageWidth / 2, 15, { align: 'center' });
      const imgWidth = pageWidth - 40;
      const imgHeight = (pageHeight - 60) * 0.7;
      pdf.addImage(dataUrl, 'PNG', 20, 25, imgWidth, imgHeight);
      const explanations = generateWiringExplanation(selectedComponents);
      pdf.setFontSize(10);
      let yPos = imgHeight + 35;
      explanations.forEach((line) => {
        if (yPos > pageHeight - 10) { pdf.addPage(); yPos = 20; }
        pdf.text(line, 20, yPos);
        yPos += 6;
      });
      pdf.save('electrical-diagram.pdf');
      toast.success('Diagram exported as PDF');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export diagram');
    }
  }, [selectedComponents]);

  const handleShare = useCallback(async () => {
    if (nodes.length === 0) { toast.error('Create a diagram first before sharing'); return; }
    const url = generateShareableLink();
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Shareable link copied to clipboard!');
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast.success('Shareable link copied to clipboard!');
    }
  }, [generateShareableLink, nodes.length]);

  const explanations = generateWiringExplanation(selectedComponents);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <header className="flex-shrink-0 border-b border-border bg-card">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold text-foreground">⚡ Smart Electrical Wiring Diagram Generator</h1>
          <p className="text-sm text-muted-foreground">Design professional electrical wiring diagrams with automatic connection logic</p>
        </div>
      </header>

      <Toolbar
        onGenerate={generateDiagram}
        onGenerateNodesOnly={generateNodesOnly}
        onReset={resetDiagram}
        onExportPNG={handleExportPNG}
        onExportPDF={handleExportPDF}
        onShare={handleShare}
        onAutoArrange={autoArrange}
        onValidate={validateConnections}
        canGenerate={canGenerate}
        hasErrors={hasErrors}
        isManualMode={isManualMode}
        hasNodes={nodes.length > 0}
      />

      <div className="flex-1 flex overflow-hidden">
        <div className="w-80 flex-shrink-0 overflow-hidden">
          <ComponentSelectionPanel
            selectedComponents={selectedComponents}
            validationErrors={validationErrors}
            onToggleComponent={toggleComponent}
            onAddRequired={addRequiredComponent}
            onDragStart={handleDragStart}
          />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden relative">
          <div ref={canvasContainerRef} className="flex-1 relative">
            {nodes.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/30 border-2 border-dashed border-muted-foreground/20">
                <div className="text-center max-w-md p-8">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-4xl">🔌</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Start Your Diagram</h3>
                  <p className="text-sm text-muted-foreground mb-4">Choose a method to create your wiring diagram:</p>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
                      <span className="text-lg">1️⃣</span>
                      <span><strong>Auto-Wire:</strong> Select components → Generate with connections</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
                      <span className="text-lg">2️⃣</span>
                      <span><strong>Practice Mode:</strong> Wire yourself and check if correct</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
                      <span className="text-lg">3️⃣</span>
                      <span><strong>Drag & Drop:</strong> Drag components and connect manually</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <DiagramCanvas
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={setNodes}
                  onEdgesChange={setEdges}
                  reactFlowRef={reactFlowRef}
                  onDropComponent={handleDropComponent}
                  onRemoveComponent={removeComponent}
                  isManualMode={isManualMode}
                />
                {edges.length === 0 && !isManualMode && (
                  <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10">
                    <Button onClick={autoConnectWires} className="gap-2 shadow-lg animate-pulse" size="lg">
                      <Wand2 className="w-4 h-4" />
                      Auto-Connect Wires
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Validation Panel for Manual Mode */}
          {isManualMode && connectionValidation && (
            <div className="absolute bottom-4 right-4 z-20 w-80">
              <ConnectionValidationPanel
                validationResult={connectionValidation}
                onShowCorrectConnections={showCorrectConnections}
                isManualMode={isManualMode}
              />
            </div>
          )}

          {selectedComponents.length > 0 && (
            <div className="flex-shrink-0 border-t border-border bg-card">
              <Button variant="ghost" className="w-full flex items-center justify-between px-4 py-2 h-auto" onClick={() => setShowExplanation(!showExplanation)}>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span className="font-medium">Wiring Explanation</span>
                </div>
                {showExplanation ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </Button>
              {showExplanation && (
                <ScrollArea className="max-h-48 border-t border-border">
                  <div className="p-4 space-y-2">
                    {explanations.map((line, index) => (
                      <p key={index} className={`text-sm ${line.startsWith('⚡') || line.startsWith('   ') ? 'text-muted-foreground' : 'text-foreground'} ${line === '' ? 'h-2' : ''}`}>{line}</p>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
