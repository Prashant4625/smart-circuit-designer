import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Zap, RotateCcw, Download, Share2, FileImage, FileText, Layout, CheckCircle, Pencil, Undo } from 'lucide-react';

interface ToolbarProps {
  onGenerate: () => void;
  onGenerateNodesOnly: () => void;
  onReset: () => void;
  onExportPNG: () => void;
  onExportPDF: () => void;
  onShare: () => void;
  onAutoArrange: () => void;
  onValidate: () => void;
  onUndo: () => void;
  canGenerate: boolean;
  hasErrors: boolean;
  isManualMode: boolean;
  hasNodes: boolean;
  canUndo: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onGenerate,
  onGenerateNodesOnly,
  onReset,
  onExportPNG,
  onExportPDF,
  onShare,
  onAutoArrange,
  onValidate,
  onUndo,
  canGenerate,
  hasErrors,
  isManualMode,
  hasNodes,
  canUndo,
}) => {
  return (
    <div className="flex items-center gap-2 p-3 bg-card border-b border-border flex-wrap">
      <Button
        onClick={onGenerate}
        disabled={!canGenerate || hasErrors}
        className="gap-2"
      >
        <Zap className="w-4 h-4" />
        Auto-Wire
      </Button>

      {hasNodes && (
        <Button onClick={onValidate} variant="secondary" className="gap-2">
          <CheckCircle className="w-4 h-4" />
          Check Connections
        </Button>
      )}



      <Button variant="outline" onClick={onUndo} disabled={!canUndo} className="gap-2">
        <Undo className="w-4 h-4" />
        Undo
      </Button>

      <Button variant="outline" onClick={onReset} className="gap-2">
        <RotateCcw className="w-4 h-4" />
        Reset
      </Button>

      <div className="flex-1" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={onExportPNG}>
            <FileImage className="w-4 h-4 mr-2" />
            Export as PNG
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onExportPDF}>
            <FileText className="w-4 h-4 mr-2" />
            Export as PDF
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button variant="outline" onClick={onShare} className="gap-2">
        <Share2 className="w-4 h-4" />
        Share
      </Button>
    </div>
  );
};
