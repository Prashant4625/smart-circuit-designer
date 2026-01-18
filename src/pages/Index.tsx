import { useRef, useState, useCallback, DragEvent, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
import { ValidationResultsDialog } from '@/components/electrical/ValidationResultsDialog';
// Wiring explanation removed - using validation panel instead
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    setNodes,
    setEdges,
    hasErrors,
    canGenerate,
    onNodesChange,
    onEdgesChange,
    undo,
    canUndo,
    duplicateComponent,
  } = useElectricalDiagram();

  const reactFlowRef = useRef<ReactFlowInstance | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const [showExplanation, setShowExplanation] = useState(false);
  const [showValidationDialog, setShowValidationDialog] = useState(false);
  const [projectName, setProjectName] = useState(location.state?.projectName || 'Untitled Circuit');

  useEffect(() => {
    if (location.state?.projectName) {
      setProjectName(location.state.projectName);
    }
  }, [location.state]);

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
      link.download = `${projectName.replace(/\s+/g, '-').toLowerCase()}.png`;
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
      pdf.text(projectName, pageWidth / 2, 15, { align: 'center' });
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
      pdf.save(`${projectName.replace(/\s+/g, '-').toLowerCase()}.pdf`);
      toast.success('Diagram exported as PDF');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export diagram');
    }
  }, [selectedComponents, projectName]);

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

  const handleAutoWire = useCallback(() => {
    if (nodes.length === 0) {
      generateDiagram();
      return;
    }
    autoArrange();
  }, [nodes, generateDiagram, autoArrange]);

  const handleValidate = useCallback(() => {
    validateConnections();
    setShowValidationDialog(true);
  }, [validateConnections]);

  const explanations = generateWiringExplanation(selectedComponents);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <header className="flex-shrink-0 border-b border-border bg-card">
        <div className="px-4 py-3 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-foreground">⚡ Smart Electrical Wiring Diagram Generator</h1>
            <p className="text-sm text-muted-foreground">Design professional electrical wiring diagrams with automatic connection logic</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Project:</span>
            <Input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-64 h-8"
              placeholder="Project Name"
            />
          </div>
        </div>
      </header>

      <Toolbar
        onGenerate={handleAutoWire}
        onGenerateNodesOnly={generateNodesOnly}
        onReset={resetDiagram}
        onExportPNG={handleExportPNG}
        onExportPDF={handleExportPDF}
        onShare={handleShare}
        onAutoArrange={autoArrange}
        onValidate={handleValidate}
        onUndo={undo}
        canGenerate={canGenerate}
        hasErrors={hasErrors}
        isManualMode={isManualMode}
        hasNodes={nodes.length > 0}
        canUndo={canUndo}
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
              <div className="absolute inset-0 flex items-center justify-center bg-muted/30">
                <div className="text-center p-8">
                  <p className="text-muted-foreground">Select components from the left panel to start</p>
                </div>
              </div>
            ) : (
              <>
                <DiagramCanvas
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  setEdges={setEdges}
                  reactFlowRef={reactFlowRef}
                  onDropComponent={handleDropComponent}
                  onRemoveComponent={removeComponent}
                  onDuplicateComponent={duplicateComponent}
                  isManualMode={isManualMode}
                />
                {edges.length === 0 && !isManualMode && (
                  <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10">
                    <Button onClick={handleAutoWire} className="gap-2 shadow-lg animate-pulse" size="lg">
                      <Wand2 className="w-4 h-4" />
                      Auto-Connect Wires (Series)
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
                isManualMode={isManualMode}
              />
            </div>
          )}

          <ValidationResultsDialog
            isOpen={showValidationDialog}
            onClose={() => setShowValidationDialog(false)}
            validationResult={connectionValidation}
          />

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
