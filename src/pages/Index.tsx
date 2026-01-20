import { useRef, useState, useCallback, DragEvent, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ReactFlowInstance } from 'reactflow';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { toast } from 'sonner';
import { Wand2, Anchor, Compass, Ship, Waves } from 'lucide-react';
import { useElectricalDiagram } from '@/hooks/useElectricalDiagram';
import { ComponentSelectionPanel } from '@/components/electrical/ComponentSelectionPanel';
import { DiagramCanvas } from '@/components/electrical/DiagramCanvas';
import { Toolbar } from '@/components/electrical/Toolbar';
import { ConnectionValidationPanel } from '@/components/electrical/ConnectionValidationPanel';
import { ValidationResultsDialog } from '@/components/electrical/ValidationResultsDialog';
import { ConnectionTypeDialog } from '@/components/electrical/ConnectionTypeDialog';
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
      {/* Premium Indian Naval Academy Header */}
      <header className="flex-shrink-0 relative overflow-hidden">
        {/* Background with subtle pattern */}
        <div className="absolute inset-0 navy-pattern opacity-50"></div>
        
        {/* Main Header */}
        <div className="relative bg-gradient-to-b from-[#003366] via-[#002855] to-[#001a33] px-6 py-3">
          {/* Decorative corners */}
          <div className="absolute top-0 left-0 w-20 h-20 border-l-2 border-t-2 border-[#FFD700]/20 rounded-tl-lg"></div>
          <div className="absolute top-0 right-0 w-20 h-20 border-r-2 border-t-2 border-[#FFD700]/20 rounded-tr-lg"></div>
          
          <div className="flex justify-between items-center relative z-10">
            {/* Left Logo */}
            <div className="flex-shrink-0 relative">
              <div className="absolute inset-0 bg-[#FFD700] rounded-full blur-md opacity-20"></div>
              <div className="relative bg-white rounded-full p-1.5 shadow-lg ring-2 ring-[#FFD700]/40">
                <img src="/logos/left.jpeg" alt="Indian Navy Logo" className="h-12 w-12 object-contain rounded-full" />
              </div>
            </div>

            {/* Center - Title */}
            <div className="flex-1 flex flex-col items-center justify-center mx-6">
              {/* Decorative line */}
              <div className="flex items-center gap-4 mb-1">
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#FFD700]/50 to-[#FFD700]"></div>
                <Anchor className="w-4 h-4 text-[#FFD700]/60" />
                <div className="h-px w-16 bg-gradient-to-l from-transparent via-[#FFD700]/50 to-[#FFD700]"></div>
              </div>
              
              <h1 className="text-white text-xl md:text-2xl font-bold tracking-[0.25em] uppercase drop-shadow-lg" style={{ fontFamily: 'Times New Roman, serif' }}>
                INDIAN NAVAL ACADEMY
              </h1>
              
              <p className="text-[#FFD700] text-xs mt-1 tracking-[0.3em] uppercase font-semibold flex items-center gap-2">
                <Ship className="w-3 h-3" />
                Virtual Electrical Lab
                <Compass className="w-3 h-3" />
              </p>
            </div>

            {/* Right Logo */}
            <div className="flex-shrink-0 relative">
              <div className="absolute inset-0 bg-[#FFD700] rounded-full blur-md opacity-20"></div>
              <div className="relative bg-white rounded-full p-1.5 shadow-lg ring-2 ring-[#FFD700]/40">
                <img src="/logos/right.jpeg" alt="Naval Academy Logo" className="h-12 w-12 object-contain rounded-full" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Premium Gold Accent Border */}
        <div className="gold-accent"></div>

        {/* Experiment Name Bar */}
        <div className="relative px-4 py-2 bg-gradient-to-r from-[#001a33] via-[#002244] to-[#001a33]">
          {/* Subtle wave decoration */}
          <div className="absolute inset-0 overflow-hidden opacity-5">
            <Waves className="absolute -left-10 top-0 w-32 h-32 text-[#FFD700]" />
            <Waves className="absolute -right-10 top-0 w-32 h-32 text-[#FFD700] transform rotate-180" />
          </div>
          
          <div className="flex items-center justify-between gap-3 relative z-10">
            <Button
              variant="ghost"
              size="sm"
              className="text-[#FFD700] hover:text-white hover:bg-white/10 h-7 px-3 text-xs uppercase tracking-wider font-semibold transition-all duration-300"
              onClick={() => window.location.href = '/'}
            >
              <Anchor className="w-3 h-3 mr-1.5" />
              Home
            </Button>
            
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#FFD700] uppercase tracking-widest">Experiment:</span>
                <div className="relative">
                  <Input
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-72 h-8 bg-white/95 text-gray-900 border-2 border-[#FFD700]/30 text-sm font-medium focus:ring-2 focus:ring-[#FFD700]/50 focus:border-[#FFD700] rounded-lg pl-3 pr-10"
                    placeholder="Enter experiment name"
                  />
                  <Compass className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#003366]/40" />
                </div>
              </div>
            </div>
            
            <div className="w-20"></div> {/* Spacer for balance */}
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
        {/* Component Selection Panel */}
        <div className="w-80 flex-shrink-0 overflow-hidden border-r-2 border-[#003366]/10 shadow-lg">
          <ComponentSelectionPanel
            selectedComponents={selectedComponents}
            validationErrors={validationErrors}
            onToggleComponent={toggleComponent}
            onAddRequired={addRequiredComponent}
            onDragStart={handleDragStart}
          />
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <div ref={canvasContainerRef} className="flex-1 relative">
            {nodes.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center navy-gradient-bg navy-pattern">
                {/* Decorative anchors */}
                <Anchor className="absolute top-10 left-10 w-16 h-16 text-[#003366]/5 transform -rotate-12" />
                <Anchor className="absolute bottom-10 right-10 w-20 h-20 text-[#003366]/5 transform rotate-12" />
                <Ship className="absolute top-1/4 right-20 w-12 h-12 text-[#003366]/3" />
                <Compass className="absolute bottom-1/4 left-20 w-14 h-14 text-[#003366]/3" />
                
                <div className="text-center p-8 navy-card max-w-lg relative">
                  <div className="navy-card-header">
                    <Anchor className="w-4 h-4" />
                    Getting Started
                  </div>
                  <div className="p-8">
                    <div className="relative w-20 h-20 mx-auto mb-6">
                      <div className="absolute inset-0 bg-gradient-to-b from-[#FFD700]/20 to-transparent rounded-full blur-xl"></div>
                      <div className="relative w-full h-full rounded-full bg-gradient-to-b from-[#003366] to-[#001a33] flex items-center justify-center shadow-lg ring-2 ring-[#FFD700]/30">
                        <Wand2 className="w-10 h-10 text-[#FFD700]" />
                      </div>
                    </div>
                    
                    <h2 className="text-lg font-bold text-[#003366] mb-3">Welcome, Cadet!</h2>
                    <p className="text-[#003366]/70 mb-4">Select components from the left panel to begin building your circuit diagram.</p>
                    
                    <div className="flex items-center justify-center gap-6 text-xs text-[#003366]/50 mt-6">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span>Live</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span>Neutral</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span>Earth</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <span>DC</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full canvas-grid relative">
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
                
                {/* Floating Auto-Wire Button */}
                {edges.length === 0 && !isManualMode && (
                  <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#FFD700] rounded-xl blur-lg opacity-30 animate-pulse"></div>
                      <Button onClick={handleAutoWire} className="relative navy-btn-gold gap-3 shadow-2xl px-8 py-4 text-base">
                        <Wand2 className="w-5 h-5" />
                        Auto-Connect Wires
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Wire Legend - Bottom Left */}
                <div className="absolute bottom-4 left-4 z-10 wire-legend opacity-80 hover:opacity-100 transition-opacity">
                  <div className="wire-legend-item">
                    <div className="wire-legend-dot bg-red-500"></div>
                    <span>Live</span>
                  </div>
                  <div className="wire-legend-item">
                    <div className="wire-legend-dot bg-blue-500"></div>
                    <span>Neutral</span>
                  </div>
                  <div className="wire-legend-item">
                    <div className="wire-legend-dot bg-green-500"></div>
                    <span>Earth</span>
                  </div>
                  <div className="wire-legend-item">
                    <div className="wire-legend-dot bg-yellow-500"></div>
                    <span>DC</span>
                  </div>
                </div>
              </div>
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