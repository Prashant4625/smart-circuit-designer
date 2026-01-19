import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Zap, RotateCcw, Download, Share2, FileImage, FileText, CheckCircle, Undo, Anchor } from 'lucide-react';

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
    <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#002244] via-[#003366] to-[#002244] border-b-2 border-[#FFD700]/30 flex-wrap shadow-md">
      {/* Left decorative anchor */}
      <div className="hidden md:flex items-center gap-2 pr-3 border-r border-[#FFD700]/20">
        <Anchor className="w-4 h-4 text-[#FFD700]/60" />
      </div>
      
      <Button
        onClick={onGenerate}
        disabled={!canGenerate || hasErrors}
        className="navy-btn-gold gap-2 px-4"
        size="sm"
      >
        <Zap className="w-4 h-4" />
        Auto-Wire
      </Button>

      {hasNodes && (
        <Button 
          onClick={onValidate} 
          className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-500"
          size="sm"
        >
          <CheckCircle className="w-4 h-4" />
          Check Connections
        </Button>
      )}

      <Button 
        variant="outline" 
        onClick={onUndo} 
        disabled={!canUndo} 
        className="gap-2 bg-transparent border-[#FFD700]/30 text-[#FFD700]/80 hover:bg-[#FFD700]/10 hover:text-[#FFD700] hover:border-[#FFD700]/50 disabled:opacity-30"
        size="sm"
      >
        <Undo className="w-4 h-4" />
        Undo
      </Button>

      <Button 
        variant="outline" 
        onClick={onReset} 
        className="gap-2 bg-transparent border-[#FFD700]/30 text-[#FFD700]/80 hover:bg-red-500/20 hover:text-red-300 hover:border-red-400/50"
        size="sm"
      >
        <RotateCcw className="w-4 h-4" />
        Reset
      </Button>

      <div className="flex-1" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="gap-2 bg-transparent border-[#FFD700]/30 text-[#FFD700]/80 hover:bg-[#FFD700]/10 hover:text-[#FFD700] hover:border-[#FFD700]/50"
            size="sm"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-[#002244] border-[#FFD700]/30">
          <DropdownMenuItem onClick={onExportPNG} className="text-[#FFD700]/80 hover:bg-[#FFD700]/10 hover:text-[#FFD700] cursor-pointer">
            <FileImage className="w-4 h-4 mr-2" />
            Export as PNG
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onExportPDF} className="text-[#FFD700]/80 hover:bg-[#FFD700]/10 hover:text-[#FFD700] cursor-pointer">
            <FileText className="w-4 h-4 mr-2" />
            Export as PDF
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button 
        variant="outline" 
        onClick={onShare} 
        className="gap-2 bg-transparent border-[#FFD700]/30 text-[#FFD700]/80 hover:bg-[#FFD700]/10 hover:text-[#FFD700] hover:border-[#FFD700]/50"
        size="sm"
      >
        <Share2 className="w-4 h-4" />
        Share
      </Button>
      
      {/* Right decorative anchor */}
      <div className="hidden md:flex items-center gap-2 pl-3 border-l border-[#FFD700]/20">
        <Anchor className="w-4 h-4 text-[#FFD700]/60" />
      </div>
    </div>
  );
};