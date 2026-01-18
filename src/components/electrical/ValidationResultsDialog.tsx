import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle2, XCircle, AlertTriangle, ArrowRight, AlertOctagon, Zap } from 'lucide-react';
import { ConnectionValidationResult, CorrectConnection } from '@/utils/wiringLogic';
import { WIRE_COLORS } from '@/constants/electricalComponents';

interface ValidationResultsDialogProps {
    isOpen: boolean;
    onClose: () => void;
    validationResult: ConnectionValidationResult | null;
}

export const ValidationResultsDialog: React.FC<ValidationResultsDialogProps> = ({
    isOpen,
    onClose,
    validationResult,
}) => {
    if (!validationResult) return null;

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
            className={`flex items-center gap-3 p-3 rounded-lg text-sm border ${type === 'missing'
                    ? 'bg-amber-50 border-amber-200 text-amber-900'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                }`}
        >
            <div
                className="w-4 h-4 rounded-full flex-shrink-0 border border-black/10 shadow-sm"
                style={getWireColorStyle(conn.wireType)}
            />
            <span className="font-semibold">{conn.source}</span>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
            <span className="font-semibold">{conn.target}</span>
            <span className="text-muted-foreground ml-auto capitalize text-xs font-medium bg-white/50 px-2 py-0.5 rounded">
                {conn.wireType} Wire
            </span>
        </div>
    );

    const shortCircuits = incorrectEdges.filter(e => e.reason.includes('Short Circuit'));
    const otherErrors = incorrectEdges.filter(e => !e.reason.includes('Short Circuit'));

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        {isValid ? (
                            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                        ) : (
                            <AlertTriangle className="w-6 h-6 text-amber-500" />
                        )}
                        {isValid ? 'Circuit Validation Successful!' : 'Circuit Validation Results'}
                    </DialogTitle>
                    <DialogDescription>
                        Score: <span className="font-bold">{score}/{totalExpected}</span> connections correct.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="flex-1 pr-4">
                    <div className="space-y-6 py-4">

                        {/* Circuit Status */}
                        <div className={`p-4 rounded-lg border-l-4 ${circuitStatus.isClosed
                                ? 'bg-emerald-50 border-emerald-500'
                                : 'bg-red-50 border-red-500'
                            }`}>
                            <h4 className="font-bold flex items-center gap-2 mb-1">
                                {circuitStatus.isClosed ? (
                                    <Zap className="w-5 h-5 text-emerald-600" />
                                ) : (
                                    <AlertOctagon className="w-5 h-5 text-red-600" />
                                )}
                                {circuitStatus.isClosed ? 'Circuit Closed - Devices Working!' : 'Open Circuit'}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                {circuitStatus.message}
                            </p>
                        </div>

                        {/* Critical Errors */}
                        {shortCircuits.length > 0 && (
                            <div>
                                <h3 className="text-red-600 font-bold flex items-center gap-2 mb-3 text-lg">
                                    <AlertOctagon className="w-5 h-5" />
                                    Critical Safety Errors
                                </h3>
                                <div className="space-y-2">
                                    {shortCircuits.map((item, idx) => (
                                        <div key={idx} className="bg-red-50 border border-red-200 rounded-lg p-3">
                                            <p className="font-bold text-red-700">{item.reason}</p>
                                            <p className="text-sm text-red-600 mt-1">
                                                ⚠️ DANGER: This connection creates a short circuit!
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Incorrect Connections */}
                        {otherErrors.length > 0 && (
                            <div>
                                <h3 className="text-orange-600 font-bold flex items-center gap-2 mb-3 text-lg">
                                    <XCircle className="w-5 h-5" />
                                    Incorrect Connections
                                </h3>
                                <div className="space-y-2">
                                    {otherErrors.map((item, idx) => (
                                        <div key={idx} className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                                            <p className="font-medium text-orange-800">{item.reason}</p>
                                            {item.suggestion && (
                                                <div className="mt-2 text-sm bg-white p-2 rounded border border-orange-100">
                                                    <span className="font-bold text-orange-600">Hint: </span>
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
                                <h3 className="text-amber-600 font-bold flex items-center gap-2 mb-3 text-lg">
                                    <AlertTriangle className="w-5 h-5" />
                                    Missing Connections
                                </h3>
                                <div className="space-y-2">
                                    {missingConnections.map((conn) => renderConnection(conn, 'missing'))}
                                </div>
                            </div>
                        )}

                        {/* Correct Connections */}
                        {correctEdges.length > 0 && (
                            <div>
                                <h3 className="text-emerald-600 font-bold flex items-center gap-2 mb-3 text-lg">
                                    <CheckCircle2 className="w-5 h-5" />
                                    Correct Connections
                                </h3>
                                <div className="space-y-2">
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

                <DialogFooter>
                    <Button onClick={onClose} className="w-full sm:w-auto">
                        {isValid ? 'Great Job!' : 'Close & Fix Errors'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};