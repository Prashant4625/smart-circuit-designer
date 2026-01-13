import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Zap, RotateCcw, Download, Share2, FileImage, FileText, Layout } from 'lucide-react';

interface ToolbarProps {
  onGenerate: () => void;
  onReset: () => void;
  onExportPNG: () => void;
  onExportPDF: () => void;
  onShare: () => void;
  onAutoArrange: () => void;
  canGenerate: boolean;
  hasErrors: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onGenerate,
  onReset,
  onExportPNG,
  onExportPDF,
  onShare,
  onAutoArrange,
  canGenerate,
  hasErrors,
}) => {
  return (
    <div className="flex items-center gap-2 p-3 bg-card border-b border-border">
      <Button
        onClick={onGenerate}
        disabled={!canGenerate || hasErrors}
        className="gap-2"
      >
        <Zap className="w-4 h-4" />
        Generate Diagram
      </Button>

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
