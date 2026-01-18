import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, Play, Info, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

interface Experiment {
    id: string;
    title: string;
    description: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    image?: string;
    components?: string[];
}

const experiments: Experiment[] = [
    {
        id: 'lamp-control',
        title: 'Control of Lamp by Single Switch',
        description: 'The most fundamental circuit. Learn how to control a light bulb using a single-pole switch.',
        difficulty: 'Beginner',
        image: '/experiments/bulb-circuit.png',
        components: ['AC Supply', 'MCB', 'Switch', 'Light Bulb']
    },
    {
        id: 'fan-regulator',
        title: 'Ceiling Fan with Regulator',
        description: 'Control the speed of a ceiling fan using a series regulator connection.',
        difficulty: 'Intermediate',
        image: '/experiments/fan-circuit.png',
        components: ['AC Supply', 'MCB', 'Switch', 'Fan Regulator', 'Ceiling Fan']
    }
];

const Experiments = () => {
    const navigate = useNavigate();
    const [selectedExperiment, setSelectedExperiment] = useState<Experiment | null>(null);

    const handleStartExperiment = (exp: Experiment) => {
        navigate('/lab', { state: { projectName: exp.title } });
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col relative">
            {/* Header */}
            <header className="border-b border-border bg-card/50 backdrop-blur-sm p-4 sticky top-0 z-50">
                <div className="container mx-auto flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground hover:bg-card/60">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                        <Zap className="h-5 w-5 text-primary" /> Standard Experiments
                    </h1>
                </div>
            </header>

            {/* Content */}
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="grid gap-4">
                    {experiments.map((exp) => (
                        <Card
                            key={exp.id}
                            className="bg-card border border-border hover:border-primary/50 transition-all cursor-pointer hover:shadow-md group"
                            onClick={() => setSelectedExperiment(exp)}
                        >
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
                                <div className="space-y-1">
                                    <CardTitle className="text-foreground group-hover:text-primary transition-colors text-lg flex items-center gap-2">
                                        {exp.title}
                                        <Badge variant="outline" className={`ml-2 text-xs font-normal
                      ${exp.difficulty === 'Beginner' ? 'border-green-500 text-green-500' :
                                                exp.difficulty === 'Intermediate' ? 'border-yellow-500 text-yellow-500' :
                                                    'border-red-500 text-red-500'}
                    `}>
                                            {exp.difficulty}
                                        </Badge>
                                    </CardTitle>
                                    <CardDescription className="text-muted-foreground line-clamp-1">
                                        {exp.description}
                                    </CardDescription>
                                </div>
                                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </main>

            {/* Details Dialog */}
            <Dialog open={!!selectedExperiment} onOpenChange={(open) => !open && setSelectedExperiment(null)}>
                <DialogContent className="sm:max-w-[600px] bg-card border-border">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                            {selectedExperiment?.title}
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            {selectedExperiment?.description}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        {/* Reference Image */}
                        {selectedExperiment?.image && (
                            <div className="rounded-lg overflow-hidden border border-border bg-white p-2">
                                <AspectRatio ratio={16 / 9}>
                                    <img
                                        src={selectedExperiment.image}
                                        alt={selectedExperiment.title}
                                        className="object-contain w-full h-full"
                                    />
                                </AspectRatio>
                            </div>
                        )}

                        {/* Components List */}
                        {selectedExperiment?.components && (
                            <div className="bg-muted/30 p-4 rounded-lg border border-border">
                                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                                    <Info className="w-4 h-4 text-primary" /> Required Components
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedExperiment.components.map((comp, i) => (
                                        <Badge key={i} variant="secondary" className="bg-card border-border text-muted-foreground">
                                            {comp}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSelectedExperiment(null)}>
                            Close
                        </Button>
                        <Button
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                            onClick={() => selectedExperiment && handleStartExperiment(selectedExperiment)}
                        >
                            <Play className="mr-2 h-4 w-4" /> Start Experiment
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Experiments;
