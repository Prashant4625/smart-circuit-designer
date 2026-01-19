import { useRef, useState, useCallback, DragEvent, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ReactFlowInstance } from 'reactflow';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { toast } from 'sonner';
import { Wand2 } from 'lucide-react';
import { useElectricalDiagram } from '@/hooks/useElectricalDiagram';
import { ComponentSelectionPanel } from '@/components/electrical/ComponentSelectionPanel';
import { DiagramCanvas } from '@/components/electrical/DiagramCanvas';
import { Toolbar } from '@/components/electrical/Toolbar';
import { ConnectionValidationPanel } from '@/components/electrical/ConnectionValidationPanel';
import { ValidationResultsDialog } from '@/components/electrical/ValidationResultsDialog';
import { ConnectionTypeDialog } from '@/components/electrical/ConnectionTypeDialog';
// Wiring explanation removed - using validation panel instead
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ElectricalComponent } from '@/types/electrical';

const Index = () => {
  const {
    selectedComponents,
    nodes,
    edges,
    validationErrors,
    isManualMode,
    connectionValidation,
    connectionType,
    showConnectionDialog,
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
    handleConnectionTypeSelect,
    setShowConnectionDialog,
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
  }, [projectName]);

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
      pdf.save(`${projectName.replace(/\s+/g, '-').toLowerCase()}.pdf`);
      toast.success('Diagram exported as PDF');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export diagram');
    }
  }, [projectName]);

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
    autoConnectWires(projectName);
  }, [nodes, generateDiagram, autoConnectWires, projectName]);

  const handleValidate = useCallback(() => {
    validateConnections();
    setShowValidationDialog(true);
  }, [validateConnections]);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Indian Naval Academy Header */}
      <header className="flex-shrink-0">
        {/* Main Header */}
        <div className="bg-[#003366] px-6 py-3">
          <div className="flex justify-between items-center">
            {/* Left Logo */}
            <div className="flex-shrink-0 bg-white rounded-full p-1">
              <img src="/logos/left.jpeg" alt="Indian Navy Logo" className="h-12 w-12 object-contain rounded-full" />
            </div>

            {/* Center - Title and Experiment Name */}
            <div className="flex-1 flex flex-col items-center justify-center mx-4">
              <h1 className="text-white text-lg md:text-2xl font-bold tracking-[0.2em] uppercase drop-shadow-lg" style={{ fontFamily: 'Times New Roman, serif' }}>
                INDIAN NAVAL ACADEMY
              </h1>
              <p className="text-[#FFD700] text-xs mt-0.5 tracking-wider">Virtual Electrical Lab</p>
            </div>

            {/* Right Logo */}
            <div className="flex-shrink-0 bg-white rounded-full p-1">
              <img src="/logos/right.jpeg" alt="Naval Academy Logo" className="h-12 w-12 object-contain rounded-full" />
            </div>
          </div>
        </div>
        {/* Gold Accent Border */}
        <div className="h-1 bg-gradient-to-r from-[#B8860B] via-[#FFD700] to-[#B8860B]"></div>

        {/* Experiment Name Bar */}
        <div className="px-4 py-2 bg-[#002244]">
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm font-medium text-[#FFD700]">Experiment:</span>
            <Input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-64 h-8 bg-white/90 text-gray-900 border-[#FFD700]"
              placeholder="Experiment Name"
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
                isManualMode={isManualMode}
              />
            </div>
          )}

          <ValidationResultsDialog
            isOpen={showValidationDialog}
            onClose={() => setShowValidationDialog(false)}
            validationResult={connectionValidation}
          />

          <ConnectionTypeDialog
            isOpen={showConnectionDialog}
            onClose={() => setShowConnectionDialog(false)}
            onSelectConnectionType={handleConnectionTypeSelect}
            bulbCount={nodes.filter(n => n.data.componentId === 'light-bulb').length}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
