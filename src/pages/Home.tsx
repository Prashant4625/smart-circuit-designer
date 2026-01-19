import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Anchor, Zap, BookOpen, ArrowRight, Shield, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Home = () => {
    const navigate = useNavigate();

    const handleStart = () => {
        navigate('/lab');
    };

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden">
            {/* Background with navy pattern */}
            <div className="absolute inset-0 navy-gradient-bg navy-pattern" />
            
            {/* Decorative anchor watermarks */}
            <div className="anchor-watermark top-20 left-10 w-64 h-64">
                <Anchor className="w-full h-full text-[#003366]" strokeWidth={0.5} />
            </div>
            <div className="anchor-watermark bottom-20 right-10 w-48 h-48">
                <Anchor className="w-full h-full text-[#003366]" strokeWidth={0.5} />
            </div>

            {/* Indian Naval Academy Header Bar */}
            <nav className="sticky top-0 z-50 shadow-xl">
                {/* Main Header */}
                <div className="bg-gradient-to-b from-[#003366] to-[#002244] px-6 py-4">
                    <div className="container mx-auto flex justify-between items-center">
                        {/* Left Logo */}
                        <div className="flex-shrink-0 bg-white rounded-full p-1.5 shadow-lg ring-2 ring-[#FFD700]/30">
                            <img src="/logos/left.jpeg" alt="Indian Navy Logo" className="h-16 w-16 object-contain rounded-full" />
                        </div>

                        {/* Center Text */}
                        <div className="flex-1 flex flex-col items-center justify-center">
                            <h1 className="text-white text-2xl md:text-4xl font-bold tracking-[0.25em] uppercase drop-shadow-lg" style={{ fontFamily: 'Times New Roman, serif' }}>
                                INDIAN NAVAL ACADEMY
                            </h1>
                            <div className="flex items-center gap-3 mt-1">
                                <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#FFD700]" />
                                <span className="text-[#FFD700] text-xs tracking-[0.3em] uppercase font-medium">Ezhimala</span>
                                <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#FFD700]" />
                            </div>
                        </div>

                        {/* Right Logo */}
                        <div className="flex-shrink-0 bg-white rounded-full p-1.5 shadow-lg ring-2 ring-[#FFD700]/30">
                            <img src="/logos/right.jpeg" alt="Naval Academy Logo" className="h-16 w-16 object-contain rounded-full" />
                        </div>
                    </div>
                </div>
                {/* Gold Accent Border */}
                <div className="h-1.5 bg-gradient-to-r from-[#8B6914] via-[#FFD700] to-[#8B6914] shadow-md"></div>
            </nav>

            {/* Hero Section */}
            <main className="flex-1 container mx-auto px-4 flex flex-col items-center justify-center text-center py-16 relative z-10">
                {/* Icon Badge */}
                <div className="mb-8 relative">
                    <div className="p-5 rounded-full bg-gradient-to-b from-[#003366] to-[#001a33] border-2 border-[#FFD700]/40 shadow-xl">
                        <Zap className="h-14 w-14 text-[#FFD700]" />
                    </div>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent" />
                </div>

                <h2 className="text-4xl md:text-6xl font-bold mb-4 text-[#003366]" style={{ fontFamily: 'Times New Roman, serif' }}>
                    Virtual Electrical Lab
                </h2>
                
                <div className="gold-divider w-32 mb-6" />

                <p className="text-lg text-[#003366]/70 max-w-2xl mb-10 leading-relaxed">
                    Advanced circuit simulation and training platform for naval cadets.
                    Master electrical concepts through interactive experiments and real-time validation.
                </p>

                {/* Feature badges */}
                <div className="flex flex-wrap justify-center gap-3 mb-10">
                    <div className="navy-badge flex items-center gap-1.5">
                        <Shield className="w-3 h-3" />
                        Safe Training
                    </div>
                    <div className="navy-badge flex items-center gap-1.5">
                        <Award className="w-3 h-3" />
                        Navy Standards
                    </div>
                    <div className="navy-badge flex items-center gap-1.5">
                        <Zap className="w-3 h-3" />
                        Real-time Validation
                    </div>
                </div>

                {/* Action Card */}
                <Card className="w-full max-w-md navy-card">
                    <div className="navy-card-header text-center">
                        Training Console
                    </div>
                    <CardContent className="p-6 space-y-5 bg-gradient-to-b from-white to-slate-50">
                        <Button
                            className="w-full navy-btn-gold font-bold text-base h-14 rounded-md"
                            onClick={handleStart}
                        >
                            Enter Virtual Lab <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>

                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full gold-divider" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-gradient-to-b from-white to-slate-50 px-3 text-[#003366]/60 font-medium tracking-wider">Or explore</span>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            className="w-full border-2 border-[#003366]/20 text-[#003366] hover:bg-[#003366] hover:text-[#FFD700] h-12 font-semibold transition-all duration-300"
                            onClick={() => navigate('/experiments')}
                        >
                            <BookOpen className="mr-2 h-4 w-4" /> View Standard Experiments
                        </Button>
                    </CardContent>
                </Card>
            </main>

            {/* Footer */}
            <footer className="relative z-10 border-t-2 border-[#003366]/10">
                <div className="h-1 bg-gradient-to-r from-transparent via-[#FFD700]/50 to-transparent" />
                <div className="bg-gradient-to-b from-[#003366] to-[#001a33] py-6">
                    <div className="container mx-auto px-4 text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Anchor className="w-4 h-4 text-[#FFD700]" />
                            <span className="text-[#FFD700]/80 text-sm font-medium tracking-wider uppercase">Indian Naval Academy</span>
                            <Anchor className="w-4 h-4 text-[#FFD700]" />
                        </div>
                        <p className="text-white/60 text-xs">© {new Date().getFullYear()} Virtual Electrical Lab. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;