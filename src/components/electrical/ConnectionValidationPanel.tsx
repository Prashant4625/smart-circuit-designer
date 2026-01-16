import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ConnectionValidationResult, CorrectConnection } from '@/utils/wiringLogic';
import { WIRE_COLORS } from '@/constants/electricalComponents';

interface ConnectionValidationPanelProps {
  validationResult: ConnectionValidationResult | null;
  onShowCorrectConnections: () => void;
  isManualMode: boolean;
}

export const ConnectionValidationPanel: React.FC<ConnectionValidationPanelProps> = ({
  validationResult,
  onShowCorrectConnections,
  isManualMode,
}) => {
  if (!validationResult || !isManualMode) return null;

  const { isValid, incorrectEdges, missingConnections, score, totalExpected, correctEdges } = validationResult;

  const getWireColorStyle = (wireType: 'live' | 'neutral' | 'earth' | 'dc') => {
    const colors = {
      live: WIRE_COLORS.live,
      neutral: WIRE_COLORS.neutral,
      earth: WIRE_COLORS.earth,
      dc: WIRE_COLORS.dc,
    };
    return { backgroundColor: colors[wireType] };
  };

  const renderConnection = (conn: CorrectConnection, type: 'missing' | 'correct') => (
    <div 
      key={`${conn.source}-${conn.target}-${conn.sourceHandle}`}
      className={`flex items-center gap-2 p-2 rounded-lg text-xs ${
        type === 'missing' ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-emerald-500/10 border border-emerald-500/30'
      }`}
    >
      <div 
        className="w-3 h-3 rounded-full flex-shrink-0" 
        style={getWireColorStyle(conn.wireType)} 
      />
      <span className="font-medium">{conn.source}</span>
      <ArrowRight className="w-3 h-3 text-muted-foreground" />
      <span className="font-medium">{conn.target}</span>
      <span className="text-muted-foreground ml-auto capitalize">({conn.wireType})</span>
    </div>
  );

  return (
    <div className="bg-card border border-border rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className={`p-3 ${isValid ? 'bg-emerald-500/10' : 'bg-amber-500/10'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isValid ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            )}
            <span className="font-semibold text-sm">
              {isValid ? 'Circuit Complete! ✓' : 'Connection Check'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-bold ${
              score === totalExpected ? 'text-emerald-500' : 
              score > 0 ? 'text-amber-500' : 'text-muted-foreground'
            }`}>
              {score}/{totalExpected}
            </span>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${
              score === totalExpected ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
            style={{ width: `${totalExpected > 0 ? (score / totalExpected) * 100 : 0}%` }}
          />
        </div>
      </div>

      <ScrollArea className="max-h-64">
        <div className="p-3 space-y-3">
          {/* Incorrect Connections */}
          {incorrectEdges.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-destructive flex items-center gap-1 mb-2">
                <XCircle className="w-3 h-3" />
                Incorrect Connections ({incorrectEdges.length})
              </h4>
              <div className="space-y-2">
                {incorrectEdges.map((item, idx) => (
                  <div key={idx} className="bg-destructive/10 border border-destructive/30 rounded-lg p-2">
                    <p className="text-xs text-destructive font-medium">{item.reason}</p>
                    {item.suggestion && (
                      <p className="text-xs text-muted-foreground mt-1">
                        💡 Suggestion: {item.suggestion.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Missing Connections */}
          {missingConnections.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-amber-600 flex items-center gap-1 mb-2">
                <AlertTriangle className="w-3 h-3" />
                Missing Connections ({missingConnections.length})
              </h4>
              <div className="space-y-1">
                {missingConnections.map((conn) => renderConnection(conn, 'missing'))}
              </div>
            </div>
          )}

          {/* Correct Connections */}
          {correctEdges.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mb-2">
                <CheckCircle2 className="w-3 h-3" />
                Correct Connections ({correctEdges.length})
              </h4>
              <div className="space-y-1">
                {validationResult.correctConnections
                  .filter(cc => correctEdges.some(e => 
                    e.sourceHandle === cc.sourceHandle && e.targetHandle === cc.targetHandle
                  ))
                  .map((conn) => renderConnection(conn, 'correct'))}
              </div>
            </div>
          )}

          {/* Show Correct Answer Button */}
          {!isValid && (
            <Button 
              onClick={onShowCorrectConnections}
              variant="outline"
              className="w-full mt-2 gap-2"
              size="sm"
            >
              <Sparkles className="w-4 h-4" />
              Show Correct Circuit
            </Button>
          )}

          {/* Success Message */}
          {isValid && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 text-center">
              <p className="text-sm font-medium text-emerald-600">
                🎉 Perfect! Your circuit is correctly wired!
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                All connections form proper closed circuits with correct polarity.
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
