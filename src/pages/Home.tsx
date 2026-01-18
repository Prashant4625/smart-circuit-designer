import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Anchor, Zap, BookOpen, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Home = () => {
    const navigate = useNavigate();

    const handleStart = () => {
        navigate('/lab');
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">

            {/* Indian Naval Academy Header Bar */}
            <nav className="bg-[#003087] p-3 sticky top-0 z-50 shadow-lg">
                <div className="container mx-auto flex justify-between items-center">
                    {/* Left Logo */}
                    <div className="flex-shrink-0">
                        <img src="/logos/left.jpeg" alt="Indian Navy Logo" className="h-20 w-auto object-contain" />
                    </div>

                    {/* Center Text */}
                    <div className="flex-1 flex justify-center items-center">
                        <span className="text-white text-2xl md:text-3xl font-bold tracking-[0.3em] uppercase">INDIAN NAVAL ACADEMY</span>
                    </div>

                    {/* Right Logo */}
                    <div className="flex-shrink-0">
                        <img src="/logos/right.jpeg" alt="Naval Academy Logo" className="h-20 w-auto object-contain" />
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="flex-1 container mx-auto px-4 flex flex-col items-center justify-center text-center py-20 relative z-10">
                <div className="mb-8 p-4 rounded-full bg-primary/10 border border-primary/20 animate-pulse">
                    <Zap className="h-12 w-12 text-primary" />
                </div>

                <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground">
                    Virtual Electrical Lab
                </h1>

                <p className="text-xl text-muted-foreground max-w-2xl mb-12">
                    Advanced circuit simulation and training platform for naval cadets.
                    Master electrical concepts through interactive experiments and real-time validation.
                </p>

                {/* Action Card */}
                <Card className="w-full max-w-md bg-card border border-border shadow-2xl shadow-black/50">
                    <CardContent className="p-6 space-y-6">

                        <Button
                            className="w-full bg-primary text-primary-foreground font-bold text-lg h-14 hover:bg-primary/90 shadow-md"
                            onClick={handleStart}
                        >
                            Enter Lab <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>

                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-800" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">Or explore</span>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            className="w-full border-border text-muted-foreground hover:bg-card/60 hover:text-foreground h-12 shadow-sm"
                            onClick={() => navigate('/experiments')}
                        >
                            <BookOpen className="mr-2 h-4 w-4" /> View Standard Experiments
                        </Button>
                    </CardContent>
                </Card>
            </main>

            {/* Footer */}
            <footer className="border-t border-border py-8 bg-card/50 relative z-10">
                <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
                    <p>© {new Date().getFullYear()} Naval Academy Virtual Lab. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
