import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle, ArrowRight, AlertOctagon, Zap } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ConnectionValidationResult, CorrectConnection } from '@/utils/wiringLogic';
import { WIRE_COLORS } from '@/constants/electricalComponents';

interface ConnectionValidationPanelProps {
  validationResult: ConnectionValidationResult | null;
  isManualMode: boolean;
}

export const ConnectionValidationPanel: React.FC<ConnectionValidationPanelProps> = ({
  validationResult,
  isManualMode,
}) => {
  if (!validationResult || !isManualMode) return null;

  const { isValid, incorrectEdges, missingConnections, score, totalExpected, correctEdges, circuitStatus } = validationResult;

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
      className={`flex items-center gap-2 p-2 rounded-lg text-xs ${type === 'missing' ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-emerald-500/10 border border-emerald-500/30'
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

  const shortCircuits = incorrectEdges.filter(e => e.reason.includes('Short Circuit'));
  const otherErrors = incorrectEdges.filter(e => !e.reason.includes('Short Circuit'));

  return (
    <div className="navy-panel overflow-hidden flex flex-col max-h-[500px]">
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
            <span className={`text-sm font-bold ${score === totalExpected ? 'text-emerald-500' :
              score > 0 ? 'text-amber-500' : 'text-muted-foreground'
              }`}>
              {score}/{totalExpected}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${score === totalExpected ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            style={{ width: `${totalExpected > 0 ? (score / totalExpected) * 100 : 0}%` }}
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-4">
          {/* Circuit Closure Status */}
          <div className={`p-3 rounded-lg border ${circuitStatus.isClosed
            ? 'bg-emerald-500/10 border-emerald-500/30'
            : 'bg-destructive/10 border-destructive/30'
            }`}>
            <h4 className={`text-xs font-bold flex items-center gap-2 ${circuitStatus.isClosed ? 'text-emerald-600' : 'text-destructive'
              }`}>
              {circuitStatus.isClosed ? (
                <Zap className="w-4 h-4" />
              ) : (
                <AlertOctagon className="w-4 h-4" />
              )}
              {circuitStatus.isClosed ? 'Circuit Closed - Devices Working!' : 'Open Circuit'}
            </h4>
            <p className="text-xs mt-1 text-muted-foreground">
              {circuitStatus.message}
            </p>
          </div>

          {/* Critical Errors (Short Circuits) */}
          {shortCircuits.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-destructive flex items-center gap-1 mb-2 uppercase tracking-wider">
                <AlertOctagon className="w-3 h-3" />
                Critical Safety Errors
              </h4>
              <div className="space-y-2">
                {shortCircuits.map((item, idx) => (
                  <div key={idx} className="bg-destructive/20 border border-destructive/50 rounded-lg p-2">
                    <p className="text-xs text-destructive font-bold">{item.reason}</p>
                    <p className="text-[10px] text-destructive/80 mt-1">
                      DANGER: This would cause a spark or trip the breaker!
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other Errors */}
          {otherErrors.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-orange-600 flex items-center gap-1 mb-2">
                <XCircle className="w-3 h-3" />
                Incorrect Connections
              </h4>
              <div className="space-y-2">
                {otherErrors.map((item, idx) => (
                  <div key={idx} className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-2">
                    <p className="text-xs text-orange-700 font-medium">{item.reason}</p>
                    {item.suggestion && (
                      <div className="mt-2 text-xs bg-background/50 p-1.5 rounded border border-border">
                        <span className="font-semibold text-muted-foreground">Try this: </span>
                        {item.suggestion.description}
                      </div>
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
                    (e.sourceHandle === cc.sourceHandle && e.targetHandle === cc.targetHandle) ||
                    (e.targetHandle === cc.sourceHandle && e.sourceHandle === cc.targetHandle)
                  ))
                  .map((conn) => renderConnection(conn, 'correct'))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Success Message */}
      {isValid && (
        <div className="p-3 border-t bg-emerald-500/10">
          <p className="text-sm font-medium text-emerald-600 text-center">
            🎉 Perfect! Your circuit is correctly wired!
          </p>
        </div>
      )}
    </div>
  );
};
