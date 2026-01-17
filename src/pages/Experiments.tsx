import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, Play, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';

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
            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {experiments.map((exp) => (
                        <Card key={exp.id} className="bg-card border border-border hover:border-primary/50 transition-colors group flex flex-col overflow-hidden shadow-lg">
                            {exp.image && (
                                <div className="w-full bg-card p-4">
                                    <AspectRatio ratio={16 / 9}>
                                        <img
                                            src={exp.image}
                                            alt={exp.title}
                                            className="object-contain w-full h-full"
                                        />
                                    </AspectRatio>
                                </div>
                            )}

                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-foreground group-hover:text-primary transition-colors text-lg">{exp.title}</CardTitle>
                                    <Badge variant="outline" className={`
                    ${exp.difficulty === 'Beginner' ? 'border-green-500 text-green-500' :
                                            exp.difficulty === 'Intermediate' ? 'border-yellow-500 text-yellow-500' :
                                                'border-red-500 text-red-500'}
                  `}>
                                        {exp.difficulty}
                                    </Badge>
                                </div>
                                <CardDescription className="text-muted-foreground">{exp.description}</CardDescription>
                            </CardHeader>

                            <CardContent className="flex-1">
                                {exp.components && (
                                    <div className="bg-card/60 p-3 rounded-md border border-border">
                                        <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                                            <Info className="w-3 h-3" /> REQUIRED COMPONENTS
                                        </p>
                                        <div className="flex flex-wrap gap-1">
                                            {exp.components.map((comp, i) => (
                                                <span key={i} className="text-xs bg-card/80 text-muted-foreground px-2 py-1 rounded">
                                                    {comp}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>

                            <CardFooter>
                                <Button
                                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 border border-border hover:border-primary transition-all shadow-md"
                                    onClick={() => handleStartExperiment(exp)}
                                >
                                    <Play className="mr-2 h-4 w-4" /> Start Experiment
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Experiments;
