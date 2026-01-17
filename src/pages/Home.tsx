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
        <div className="min-h-screen bg-slate-950 text-white flex flex-col relative overflow-hidden">

            {/* Logos */}
            <div className="absolute top-4 left-4 z-50">
                <img src="/logos/left.jpeg" alt="Left Logo" className="h-24 w-auto object-contain rounded-lg shadow-lg" />
            </div>
            <div className="absolute top-4 right-4 z-50">
                <img src="/logos/right.jpeg" alt="Right Logo" className="h-24 w-auto object-contain rounded-lg shadow-lg" />
            </div>

            {/* Navigation Bar */}
            <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm p-4 sticky top-0 z-40">
                <div className="container mx-auto flex justify-center items-center">
                    <div className="flex items-center gap-2">
                        <Anchor className="h-6 w-6 text-yellow-400" />
                        <span className="text-xl font-bold tracking-wider text-yellow-400">NAVAL ACADEMY</span>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="flex-1 container mx-auto px-4 flex flex-col items-center justify-center text-center py-20 relative z-10">
                <div className="mb-8 p-4 rounded-full bg-yellow-400/10 border border-yellow-400/20 animate-pulse">
                    <Zap className="h-12 w-12 text-yellow-400" />
                </div>

                <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                    Virtual Electrical Lab
                </h1>

                <p className="text-xl text-slate-400 max-w-2xl mb-12">
                    Advanced circuit simulation and training platform for naval cadets.
                    Master electrical concepts through interactive experiments and real-time validation.
                </p>

                {/* Action Card */}
                <Card className="w-full max-w-md bg-slate-900 border-slate-800 shadow-2xl shadow-black/50">
                    <CardContent className="p-6 space-y-6">

                        <Button
                            className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-lg h-14"
                            onClick={handleStart}
                        >
                            Enter Laboratory <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>

                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-800" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-slate-900 px-2 text-slate-500">Or explore</span>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white h-12"
                            onClick={() => navigate('/experiments')}
                        >
                            <BookOpen className="mr-2 h-4 w-4" /> View Standard Experiments
                        </Button>
                    </CardContent>
                </Card>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-800 py-8 bg-slate-900/50 relative z-10">
                <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
                    <p>© {new Date().getFullYear()} Naval Academy Virtual Lab. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
