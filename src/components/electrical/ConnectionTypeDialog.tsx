import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Zap, GitBranch } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface ConnectionTypeDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectConnectionType: (type: 'series' | 'parallel') => void;
    bulbCount: number;
}

export const ConnectionTypeDialog: React.FC<ConnectionTypeDialogProps> = ({
    isOpen,
    onClose,
    onSelectConnectionType,
    bulbCount,
}) => {
    const [selectedType, setSelectedType] = useState<'series' | 'parallel' | null>(null);

    const handleConfirm = () => {
        if (selectedType) {
            onSelectConnectionType(selectedType);
            onClose();
            setSelectedType(null);
        }
    };

    const handleCancel = () => {
        setSelectedType(null);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Zap className="w-6 h-6 text-primary" />
                        Choose Connection Type for {bulbCount} Bulbs
                    </DialogTitle>
                    <DialogDescription>
                        Select how you want to connect your light bulbs in the circuit.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 py-4">
                    {/* Series Connection Option */}
                    <Card
                        className={`p-4 cursor-pointer transition-all border-2 hover:shadow-lg ${selectedType === 'series'
                                ? 'border-primary bg-primary/5 shadow-md'
                                : 'border-border hover:border-primary/50'
                            }`}
                        onClick={() => setSelectedType('series')}
                    >
                        <div className="flex flex-col items-center text-center space-y-3">
                            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                                <GitBranch className="w-6 h-6 text-amber-600 rotate-90" />
                            </div>
                            <h3 className="font-bold text-lg">Series Connection</h3>
                            <p className="text-sm text-muted-foreground">
                                Bulbs connected one after another in a chain
                            </p>

                            {/* Visual representation */}
                            <div className="flex items-center gap-1 mt-2">
                                <div className="w-3 h-3 rounded-full bg-yellow-400 border border-yellow-600" />
                                <div className="w-6 h-0.5 bg-gray-400" />
                                <div className="w-3 h-3 rounded-full bg-yellow-400 border border-yellow-600" />
                                <div className="w-6 h-0.5 bg-gray-400" />
                                <div className="w-3 h-3 rounded-full bg-yellow-400 border border-yellow-600" />
                            </div>

                            <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                                <strong>Characteristics:</strong>
                                <ul className="list-disc list-inside text-left mt-1 space-y-1">
                                    <li>Voltage divides across bulbs</li>
                                    <li>Same current through all</li>
                                    <li>If one fails, all go off</li>
                                </ul>
                            </div>
                        </div>
                    </Card>

                    {/* Parallel Connection Option */}
                    <Card
                        className={`p-4 cursor-pointer transition-all border-2 hover:shadow-lg ${selectedType === 'parallel'
                                ? 'border-primary bg-primary/5 shadow-md'
                                : 'border-border hover:border-primary/50'
                            }`}
                        onClick={() => setSelectedType('parallel')}
                    >
                        <div className="flex flex-col items-center text-center space-y-3">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                <GitBranch className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="font-bold text-lg">Parallel Connection</h3>
                            <p className="text-sm text-muted-foreground">
                                Each bulb connected independently to the source
                            </p>

                            {/* Visual representation */}
                            <div className="flex flex-col items-center gap-1 mt-2">
                                <div className="flex items-center gap-1">
                                    <div className="w-1 h-4 bg-gray-400" />
                                    <div className="w-6 h-0.5 bg-gray-400" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-400 border border-yellow-600" />
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-1 h-4 bg-gray-400" />
                                    <div className="w-6 h-0.5 bg-gray-400" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-400 border border-yellow-600" />
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-1 h-4 bg-gray-400" />
                                    <div className="w-6 h-0.5 bg-gray-400" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-400 border border-yellow-600" />
                                </div>
                            </div>

                            <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                                <strong>Characteristics:</strong>
                                <ul className="list-disc list-inside text-left mt-1 space-y-1">
                                    <li>Full voltage to each bulb</li>
                                    <li>Current divides among bulbs</li>
                                    <li>Independent operation</li>
                                </ul>
                            </div>
                        </div>
                    </Card>
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={!selectedType}
                        className="min-w-32"
                    >
                        {selectedType ? `Connect in ${selectedType === 'series' ? 'Series' : 'Parallel'}` : 'Select Type'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
