import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    HeartPulse,
    ShieldCheck,
    Star,
    Stethoscope,
    Brain,
    Heart,
    Activity,
    Eye,
    UserCheck,
    Zap,
    Clock,
    Microscope,
    CalendarCheck,
} from 'lucide-react';

const MedCoreLanding = () => {
    const navigate = useNavigate();
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px',
        };

        observerRef.current = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    (entry.target as HTMLElement).style.animationPlayState = 'running';
                    observerRef.current?.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const animatedElements = document.querySelectorAll('[class*="animate-"]');
        animatedElements.forEach((el) => {
            (el as HTMLElement).style.animationPlayState = 'paused';
            observerRef.current?.observe(el);
        });

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, []);

    return (
        <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50/30 text-gray-900 antialiased min-h-screen font-sans">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 glass-effect border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                                <HeartPulse className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-semibold text-lg tracking-tight">MedCore Health</span>
                        </div>
                        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                            <span className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">Services</span>
                            <span className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer" onClick={() => navigate('/doctor')}>Specialists</span>
                            <span className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">Research</span>
                            <span className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">About</span>
                            <button
                                onClick={() => navigate('/doctor')}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Book Appointment
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
                {/* Header Section */}
                <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between mb-16 opacity-0 animate-fade-in">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-6">
                            <ShieldCheck className="w-4 h-4" />
                            Healthcare Excellence Certified
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.9] font-semibold tracking-tight">
                            Advanced Medical<br />
                            <span className="font-normal text-blue-700">Care Solutions</span>
                        </h1>
                        <p className="text-lg text-gray-600 mt-6 leading-relaxed">
                            Delivering cutting-edge healthcare with compassionate care, innovative technology, and evidence-based treatments for optimal patient outcomes.
                        </p>
                    </div>

                    {/* Stats & Accreditation */}
                    <div className="flex flex-col gap-6 lg:items-end opacity-0 animate-slide-left animate-delay-200">
                        <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex space-x-1">
                                {[1, 2, 3, 4, 5].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-blue-400 text-blue-400" />
                                ))}
                            </div>
                            <div className="text-left">
                                <div className="font-semibold text-gray-900">4.9 Patient Rating</div>
                                <div className="text-sm text-gray-500">15,000+ reviews</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-gray-600">Trusted by patients</span>
                            <div className="flex -space-x-3">
                                <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&h=120&fit=crop&crop=face" alt="Patient" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
                                <img src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=120&h=120&fit=crop&crop=face" alt="Patient" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
                                <img src="https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=120&h=120&fit=crop&crop=face" alt="Patient" className="w-10 h-10 object-cover border-white border-2 rounded-full shadow-sm" />
                                <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=120&h=120&fit=crop&crop=face" alt="Patient" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
                                <div className="w-10 h-10 bg-blue-100 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                                    <span className="text-xs font-semibold text-blue-700">15K+</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bento Grid Layout */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 min-h-[800px] lg:min-h-[600px] auto-rows-fr">
                    {/* Main Hero Card */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 row-span-2 lg:row-span-2 opacity-0 animate-scale-in animate-delay-400">
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl group h-full">
                            <img src="https://images.unsplash.com/photo-1516670428252-df97bba108d1?w=1080&q=80" alt="Medical professionals" className="w-full h-full transition-transform duration-700 group-hover:scale-105 object-cover" />

                            <div className="absolute bottom-6 left-6 right-6 lg:right-auto lg:max-w-xs">
                                <div className="glass-effect p-4 lg:p-5 rounded-2xl shadow-xl">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                                            <Stethoscope className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold leading-tight">
                                                Expert Medical Care
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                                                Board-certified physicians with 20+ years of experience in advanced medical treatments.
                                            </p>
                                            <div className="flex items-center gap-4 mt-3">
                                                <div className="text-center">
                                                    <div className="font-semibold text-blue-600 text-sm">98%</div>
                                                    <div className="text-xs text-gray-500">Success Rate</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="font-semibold text-blue-600 text-sm">24/7</div>
                                                    <div className="text-xs text-gray-500">Emergency</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Specialties Card */}
                    <div className="col-span-1 md:col-span-1 lg:col-span-2 row-span-1 lg:row-span-1 opacity-0 animate-slide-up animate-delay-600">
                        <div className="h-full rounded-3xl bg-gradient-to-br from-blue-800 to-blue-900 text-white p-6 lg:p-8 relative overflow-hidden shadow-2xl group cursor-pointer" onClick={() => navigate('/doctor')}>
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-4 right-4 w-24 h-24 rounded-full bg-white/10"></div>
                                <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full bg-white/5"></div>
                            </div>

                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur">
                                            <Brain className="w-5 h-5 text-blue-200" />
                                        </div>
                                        <div className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium backdrop-blur">
                                            Medical Specialties
                                        </div>
                                    </div>

                                    <h3 className="text-xl lg:text-2xl font-semibold leading-tight mb-4">
                                        Comprehensive Healthcare Solutions
                                    </h3>

                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-center gap-3">
                                            <Heart className="w-4 h-4 text-blue-300 shrink-0" />
                                            <span>Cardiology & Heart Care</span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <Brain className="w-4 h-4 text-blue-300 shrink-0" />
                                            <span>Neurology & Brain Health</span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <Activity className="w-4 h-4 text-blue-300 shrink-0" />
                                            <span>Orthopedic Surgery</span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <Eye className="w-4 h-4 text-blue-300 shrink-0" />
                                            <span>Ophthalmology Services</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="flex items-center justify-between mt-6">
                                    <div className="text-xs text-blue-200">
                                        Insurance Accepted
                                    </div>
                                    <button className="bg-white/20 hover:bg-white/30 backdrop-blur px-3 py-2 rounded-full text-sm font-medium transition-colors">
                                        View All
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Patient Reviews */}
                    <div className="col-span-1 md:col-span-1 lg:col-span-1 row-span-1 lg:row-span-1 opacity-0 animate-slide-left animate-delay-800">
                        <div className="h-full rounded-3xl bg-white p-6 flex flex-col justify-between shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 group">
                            <div>
                                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <UserCheck className="w-5 h-5 text-green-600" />
                                </div>
                                <div className="flex space-x-1 mb-3">
                                    {[1, 2, 3, 4, 5].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-green-400 text-green-400" />
                                    ))}
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                                    "Outstanding care and professionalism. The team saved my life."
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=1080&q=80" alt="Michael R." className="w-8 h-8 object-cover rounded-full" />
                                <div>
                                    <div className="font-medium text-sm">Michael R.</div>
                                    <div className="text-xs text-gray-500">Heart Surgery Patient</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Emergency Services */}
                    <div className="col-span-1 md:col-span-1 lg:col-span-2 row-span-1 lg:row-span-1 opacity-0 animate-slide-up animate-delay-1000">
                        <div
                            className="h-full rounded-3xl bg-gradient-to-br from-red-100 to-red-50 p-6 flex flex-col justify-between shadow-lg hover:shadow-xl transition-shadow duration-300 group cursor-pointer"
                            onClick={() => navigate('/emergency')}
                        >
                            <div>
                                <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <Zap className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-lg lg:text-xl font-semibold leading-tight mb-3">
                                    24/7 Emergency Care
                                </h3>
                                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                                    Round-the-clock emergency services with rapid response times.
                                </p>
                                <div className="flex items-center gap-2 text-sm font-medium text-red-700">
                                    <Clock className="w-4 h-4" />
                                    Average response: 8 minutes
                                </div>
                            </div>
                            <div className="flex justify-end mt-4">
                                <div className="w-16 h-16 opacity-60 group-hover:opacity-100 transition-opacity">
                                    <img src="https://images.unsplash.com/photo-1643780668909-580822430155?w=1080&q=80" alt="Emergency" className="w-full h-full object-cover rounded-xl" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Technology Card */}
                    <div className="col-span-1 md:col-span-1 lg:col-span-2 row-span-1 lg:row-span-1 opacity-0 animate-scale-in animate-delay-1200">
                        <div className="h-full rounded-3xl bg-gradient-to-br from-indigo-50 to-purple-50 p-6 flex flex-col justify-between shadow-lg hover:shadow-xl transition-shadow duration-300 group">
                            <div>
                                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <Microscope className="w-5 h-5 text-indigo-600" />
                                </div>
                                <h3 className="text-lg lg:text-xl font-semibold leading-tight mb-3">
                                    Advanced Medical Technology
                                </h3>
                                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                                    State-of-the-art equipment and innovative treatment methods.
                                </p>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Diagnostic accuracy</span>
                                        <span className="font-semibold text-indigo-600">99.2%</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Treatment success</span>
                                        <span className="font-semibold text-indigo-600">96.8%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Facility Image */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-2 row-span-1 lg:row-span-1 opacity-0 animate-slide-left animate-delay-600">
                        <div className="relative rounded-3xl overflow-hidden shadow-xl group h-full">
                            <img src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1080&q=80" alt="Medical facility" className="w-full h-full transition-transform duration-700 group-hover:scale-105 object-cover" />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent bg-[url('https://images.unsplash.com/photo-1613497767060-7e837a28b413?w=1080&q=80')] bg-cover"></div>

                            <div className="absolute bottom-6 left-6 right-6 text-white">
                                <h3 className="text-xl font-semibold mb-2">
                                    Modern Medical Facility
                                </h3>
                                <p className="text-sm text-white/90 mb-4">
                                    World-class infrastructure designed for patient comfort and care
                                </p>
                                <button
                                    className="bg-white/20 hover:bg-white/30 backdrop-blur px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                    onClick={() => navigate('/hospital')}
                                >
                                    Virtual Tour
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Bottom CTA */}
                <div className="opacity-0 animate-fade-in animate-delay-1000 text-center mt-24 lg:mt-48">
                    <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                        <CalendarCheck className="w-4 h-4" />
                        Same-day appointments available
                    </div>
                    <h2 className="text-3xl font-semibold mb-4 tracking-tight">Ready to Experience Better Healthcare?</h2>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">Join thousands of patients who trust us with their health and wellness journey.</p>
                    <button
                        onClick={() => navigate('/doctor')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:scale-105"
                    >
                        Schedule Your Appointment
                    </button>
                </div>
            </main>
        </div>
    );
};

export default MedCoreLanding;
