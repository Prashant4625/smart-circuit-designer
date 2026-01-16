import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Zap, RotateCcw, Download, Share2, FileImage, FileText, Layout, CheckCircle, Pencil } from 'lucide-react';

interface ToolbarProps {
  onGenerate: () => void;
  onGenerateNodesOnly: () => void;
  onReset: () => void;
  onExportPNG: () => void;
  onExportPDF: () => void;
  onShare: () => void;
  onAutoArrange: () => void;
  onValidate: () => void;
  canGenerate: boolean;
  hasErrors: boolean;
  isManualMode: boolean;
  hasNodes: boolean;
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
  canGenerate,
  hasErrors,
  isManualMode,
  hasNodes,
}) => {
  return (
    <div className="flex items-center gap-2 p-3 bg-card border-b border-border flex-wrap">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button disabled={!canGenerate || hasErrors} className="gap-2">
            <Zap className="w-4 h-4" />
            Generate
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={onGenerate}>
            <Zap className="w-4 h-4 mr-2" />
            Auto-Wire Circuit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onGenerateNodesOnly}>
            <Pencil className="w-4 h-4 mr-2" />
            Practice Mode (Wire Yourself)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {isManualMode && hasNodes && (
        <Button onClick={onValidate} variant="secondary" className="gap-2">
          <CheckCircle className="w-4 h-4" />
          Check Connections
        </Button>
      )}

      <Button variant="outline" onClick={onAutoArrange} className="gap-2">
        <Layout className="w-4 h-4" />
        Auto-Arrange
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
