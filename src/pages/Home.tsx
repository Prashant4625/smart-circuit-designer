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
                                <span className="text-[#FFD700] text-xs tracking-[0.3em] uppercase font-medium">-</span>
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
            <main className="flex-1 container mx-auto px-4 flex flex-col items-center justify-center text-center py-4 relative z-10">
                {/* Icon Badge */}
                <div className="mb-4 relative">
                    <div className="p-3 rounded-full bg-gradient-to-b from-[#003366] to-[#001a33] border-2 border-[#FFD700]/40 shadow-xl">
                        <Zap className="h-10 w-10 text-[#FFD700]" />
                    </div>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent" />
                </div>

                <h2 className="text-3xl md:text-5xl font-bold mb-3 text-[#003366]" style={{ fontFamily: 'Times New Roman, serif' }}>
                    Virtual Electrical Lab
                </h2>

                <div className="gold-divider w-24 mb-4" />

                <p className="text-base text-[#003366]/70 max-w-xl mb-6 leading-relaxed">
                    Advanced circuit simulation and training platform for naval cadets.
                    Master electrical concepts through interactive experiments and real-time validation.
                </p>

                {/* Action Card */}
                <Card className="w-full max-w-sm navy-card">
                    <CardContent className="p-5 space-y-4 bg-gradient-to-b from-white to-slate-50">
                        <Button
                            className="w-full navy-btn-gold font-bold text-base h-12 rounded-md"
                            style={{ backgroundColor: '#003366' }}
                            onClick={handleStart}
                        >
                            Enter Virtual Lab <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>

                        <div className="relative my-3">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full gold-divider" />
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase">
                                <span className="bg-gradient-to-b from-white to-slate-50 px-2 text-[#003366]/60 font-medium tracking-wider">Or explore</span>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            className="w-full border-2 border-[#003366]/20 text-[#003366] hover:bg-[#003366] hover:text-[#FFD700] h-10 font-semibold transition-all duration-300"
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
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                            {/* Left Credit */}
                            <div className="flex flex-col items-center md:items-start text-center md:text-left order-2 md:order-1 flex-1">
                                <h3 className="text-[#FFD700] text-lg font-bold mb-1" style={{ fontFamily: 'Times New Roman, serif' }}>
                                    Dr. Shashidhar Kasthala
                                </h3>
                                <p className="text-white/80 text-xs tracking-wide font-medium">
                                    Indian Naval Academy
                                </p>
                            </div>

                            {/* Center Footer Info */}
                            <div className="text-center order-3 md:order-2 flex-shrink-0 mb-4 md:mb-0">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <Anchor className="w-3 h-3 text-[#FFD700]" />
                                    <span className="text-[#FFD700]/80 text-[10px] font-medium tracking-wider uppercase">Indian Naval Academy</span>
                                    <Anchor className="w-3 h-3 text-[#FFD700]" />
                                </div>
                                <p className="text-white/60 text-[10px]">© {new Date().getFullYear()} Virtual Electrical Lab. All rights reserved.</p>
                            </div>

                            {/* Right Credit */}
                            <div className="flex flex-col items-center md:items-end text-center md:text-right order-1 md:order-3 flex-1">
                                <h3 className="text-[#FFD700] text-lg font-bold mb-1" style={{ fontFamily: 'Times New Roman, serif' }}>
                                    Shanmukha Mandapalli
                                </h3>
                                <p className="text-white/80 text-xs tracking-wide font-medium">
                                    CVR College of Engineering
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;