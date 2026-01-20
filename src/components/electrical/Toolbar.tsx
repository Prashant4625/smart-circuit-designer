import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Zap, RotateCcw, Download, Share2, FileImage, FileText, CheckCircle, Undo, Anchor, Ship, Compass } from 'lucide-react';

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
    <div className="relative flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-[#001a33] via-[#002855] to-[#001a33] border-b-2 border-[#FFD700]/20 flex-wrap shadow-lg">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
        <div className="absolute left-0 top-0 w-32 h-32 bg-[#FFD700] rounded-full blur-3xl"></div>
        <div className="absolute right-0 top-0 w-32 h-32 bg-[#FFD700] rounded-full blur-3xl"></div>
      </div>
      
      {/* Left decorative element */}
      <div className="hidden lg:flex items-center gap-3 pr-4 border-r border-[#FFD700]/20 relative z-10">
        <div className="p-1.5 rounded bg-[#FFD700]/10 border border-[#FFD700]/20">
          <Anchor className="w-4 h-4 text-[#FFD700]" />
        </div>
        <span className="text-[#FFD700]/60 text-xs font-semibold uppercase tracking-wider">Controls</span>
      </div>
      
      {/* Primary Actions */}
      <div className="flex items-center gap-2 relative z-10">
        <Button
          onClick={onGenerate}
          disabled={!canGenerate || hasErrors}
          className="navy-btn-gold gap-2 px-5 h-9"
          size="sm"
        >
          <Zap className="w-4 h-4" />
          <span className="hidden sm:inline">Auto-Wire</span>
        </Button>

        {hasNodes && (
          <Button 
            onClick={onValidate} 
            className="gap-2 h-9 bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white border border-emerald-400 shadow-md"
            size="sm"
          >
            <CheckCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Check Circuit</span>
          </Button>
        )}
      </div>

      {/* Secondary Actions */}
      <div className="flex items-center gap-2 relative z-10">
        <Button 
          variant="outline" 
          onClick={onUndo} 
          disabled={!canUndo} 
          className="gap-2 h-9 bg-[#002244]/50 border-[#FFD700]/30 text-[#FFD700]/90 hover:bg-[#FFD700]/10 hover:text-[#FFD700] hover:border-[#FFD700]/50 disabled:opacity-30 transition-all duration-300"
          size="sm"
        >
          <Undo className="w-4 h-4" />
          <span className="hidden md:inline">Undo</span>
        </Button>

        <Button 
          variant="outline" 
          onClick={onReset} 
          className="gap-2 h-9 bg-[#002244]/50 border-red-500/30 text-red-400/90 hover:bg-red-500/20 hover:text-red-300 hover:border-red-400/50 transition-all duration-300"
          size="sm"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden md:inline">Reset</span>
        </Button>
      </div>

      <div className="flex-1 flex justify-center relative z-10">
        {/* Center decorative ship */}
        <div className="hidden xl:flex items-center gap-2 text-[#FFD700]/30">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#FFD700]/30"></div>
          <Ship className="w-5 h-5" />
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#FFD700]/30"></div>
        </div>
      </div>

      {/* Export & Share */}
      <div className="flex items-center gap-2 relative z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="gap-2 h-9 bg-[#002244]/50 border-[#FFD700]/30 text-[#FFD700]/90 hover:bg-[#FFD700]/10 hover:text-[#FFD700] hover:border-[#FFD700]/50 transition-all duration-300"
              size="sm"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[#001a33] border border-[#FFD700]/30 shadow-xl">
            <DropdownMenuItem onClick={onExportPNG} className="text-[#FFD700]/90 hover:bg-[#FFD700]/10 hover:text-[#FFD700] cursor-pointer focus:bg-[#FFD700]/10 focus:text-[#FFD700]">
              <FileImage className="w-4 h-4 mr-2" />
              Export as PNG
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#FFD700]/20" />
            <DropdownMenuItem onClick={onExportPDF} className="text-[#FFD700]/90 hover:bg-[#FFD700]/10 hover:text-[#FFD700] cursor-pointer focus:bg-[#FFD700]/10 focus:text-[#FFD700]">
              <FileText className="w-4 h-4 mr-2" />
              Export as PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button 
          variant="outline" 
          onClick={onShare} 
          className="gap-2 h-9 bg-[#002244]/50 border-[#FFD700]/30 text-[#FFD700]/90 hover:bg-[#FFD700]/10 hover:text-[#FFD700] hover:border-[#FFD700]/50 transition-all duration-300"
          size="sm"
        >
          <Share2 className="w-4 h-4" />
          <span className="hidden sm:inline">Share</span>
        </Button>
      </div>
      
      {/* Right decorative element */}
      <div className="hidden lg:flex items-center gap-3 pl-4 border-l border-[#FFD700]/20 relative z-10">
        <span className="text-[#FFD700]/60 text-xs font-semibold uppercase tracking-wider">Export</span>
        <div className="p-1.5 rounded bg-[#FFD700]/10 border border-[#FFD700]/20">
          <Compass className="w-4 h-4 text-[#FFD700]" />
        </div>
      </div>
    </div>
  );
};