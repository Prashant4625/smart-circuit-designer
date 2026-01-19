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
      <header className="flex-shrink-0 shadow-lg">
        {/* Main Header */}
        <div className="bg-gradient-to-b from-[#003366] to-[#002244] px-6 py-2.5">
          <div className="flex justify-between items-center">
            {/* Left Logo */}
            <div className="flex-shrink-0 bg-white rounded-full p-1 shadow-md ring-2 ring-[#FFD700]/20">
              <img src="/logos/left.jpeg" alt="Indian Navy Logo" className="h-11 w-11 object-contain rounded-full" />
            </div>

            {/* Center - Title and Experiment Name */}
            <div className="flex-1 flex flex-col items-center justify-center mx-4">
              <h1 className="text-white text-lg md:text-xl font-bold tracking-[0.2em] uppercase drop-shadow-lg" style={{ fontFamily: 'Times New Roman, serif' }}>
                INDIAN NAVAL ACADEMY
              </h1>
              <p className="text-[#FFD700] text-[10px] mt-0.5 tracking-[0.2em] uppercase font-medium">Virtual Electrical Lab</p>
            </div>

            {/* Right Logo */}
            <div className="flex-shrink-0 bg-white rounded-full p-1 shadow-md ring-2 ring-[#FFD700]/20">
              <img src="/logos/right.jpeg" alt="Naval Academy Logo" className="h-11 w-11 object-contain rounded-full" />
            </div>
          </div>
        </div>
        {/* Gold Accent Border */}
        <div className="h-1 bg-gradient-to-r from-[#8B6914] via-[#FFD700] to-[#8B6914]"></div>

        {/* Experiment Name Bar */}
        <div className="px-4 py-1.5 bg-gradient-to-r from-[#001a33] via-[#002244] to-[#001a33] border-b border-[#FFD700]/10">
          <div className="flex items-center justify-center gap-3">
            <span className="text-xs font-semibold text-[#FFD700] uppercase tracking-wider">Experiment:</span>
            <Input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-64 h-7 bg-white/95 text-gray-900 border-[#FFD700]/30 text-sm focus:ring-[#FFD700]/50 focus:border-[#FFD700]/50"
              placeholder="Enter experiment name"
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
        <div className="w-80 flex-shrink-0 overflow-hidden border-r border-[#003366]/10">
          <ComponentSelectionPanel
            selectedComponents={selectedComponents}
            validationErrors={validationErrors}
            onToggleComponent={toggleComponent}
            onAddRequired={addRequiredComponent}
            onDragStart={handleDragStart}
          />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden relative">
          <div ref={canvasContainerRef} className="flex-1 relative canvas-grid">
            {nodes.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="text-center p-8 navy-card max-w-md">
                  <div className="navy-card-header">Getting Started</div>
                  <div className="p-6">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-b from-[#003366] to-[#001a33] flex items-center justify-center">
                      <Wand2 className="w-8 h-8 text-[#FFD700]" />
                    </div>
                    <p className="text-[#003366]/70 mb-2">Select components from the left panel to begin building your circuit diagram.</p>
                    <p className="text-xs text-[#003366]/50">Click on components or drag them onto the canvas</p>
                  </div>
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
                    <Button onClick={handleAutoWire} className="navy-btn-gold gap-2 shadow-xl px-6 py-3 text-base animate-pulse">
                      <Wand2 className="w-5 h-5" />
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
