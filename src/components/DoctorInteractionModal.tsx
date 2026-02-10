import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Phone, Video, MessageCircle, Mic, PhoneOff, Send, User } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from "sonner";

type InteractionType = 'chat' | 'audio' | 'video' | null;

interface DoctorInteractionModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: InteractionType;
}

export const DoctorInteractionModal = ({ isOpen, onClose, type }: DoctorInteractionModalProps) => {
    const { t } = useLanguage();
    const [status, setStatus] = useState<'connecting' | 'connected' | 'ended'>('connecting');
    const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'doctor' }[]>([]);
    const [inputText, setInputText] = useState('');
    const [callDuration, setCallDuration] = useState(0);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setStatus('connecting');
            setMessages([]);
            setCallDuration(0);

            // Simulate connection delay
            const timer = setTimeout(() => {
                setStatus('connected');
                if (type === 'chat') {
                    setMessages([{
                        text: "Namaste! I am your AI Health Assistant. Please describe your symptoms.",
                        sender: 'doctor'
                    }]);
                }
            }, 1500); // 1.5 seconds to connect

            return () => {
                clearTimeout(timer);
                if ('speechSynthesis' in window) window.speechSynthesis.cancel();
            };
        } else {
            // Also ensure speech stops if modal is closed (isOpen becomes false)
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        }
    }, [isOpen, type]);

    // Timer for calls
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (status === 'connected' && (type === 'audio' || type === 'video')) {
            interval = setInterval(() => {
                setCallDuration(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [status, type]);

    // Format duration
    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isTyping]);

    const [conversationStep, setConversationStep] = useState<'GREETING' | 'SYMPTOM_CHECK' | 'DETAILS' | 'ADVICE' | 'CLOSING'>('GREETING');
    const [currentSymptom, setCurrentSymptom] = useState<string | null>(null);

    // Refs to access latest state in speech callbacks
    const stepRef = useRef(conversationStep);
    const symptomRef = useRef(currentSymptom);

    useEffect(() => {
        stepRef.current = conversationStep;
    }, [conversationStep]);

    useEffect(() => {
        symptomRef.current = currentSymptom;
    }, [currentSymptom]);

    // Mock AI Logic with State Machine (Fallback & Structure)
    const processAIResponse = (input: string, step: string, symptom: string | null) => {
        // ... (Logic kept as fallback)
        // We will call this only if API fails
        const lowerInput = input.toLowerCase();
        let nextStep = step;
        let nextSymptom = symptom;
        let responseKey = "DEFAULT";

        // GREETING STATE
        if (step === 'GREETING') {
            if (lowerInput.includes('hi') || lowerInput.includes('hello') || lowerInput.includes('namaste')) {
                nextStep = 'SYMPTOM_CHECK';
                responseKey = "GREETING_REPLY";
            } else {
                nextStep = 'SYMPTOM_CHECK';
                return processAIResponse(input, 'SYMPTOM_CHECK', null);
            }
        }
        // SYMPTOM CHECK STATE
        else if (step === 'SYMPTOM_CHECK') {
            if (lowerInput.includes('fever') || lowerInput.includes('hot') || lowerInput.includes('temperature')) {
                nextSymptom = 'FEVER';
                nextStep = 'DETAILS';
                responseKey = "ASK_TEMP";
            } else if (lowerInput.includes('headache') || lowerInput.includes('head')) {
                nextSymptom = 'HEADACHE';
                nextStep = 'DETAILS';
                responseKey = "ASK_DURATION";
            } else if (lowerInput.includes('stomach') || lowerInput.includes('pain') || lowerInput.includes('ache')) {
                nextSymptom = 'PAIN';
                nextStep = 'DETAILS';
                responseKey = "ASK_LOCATION";
            } else if (lowerInput.includes('cough') || lowerInput.includes('cold') || lowerInput.includes('sneeze')) {
                nextSymptom = 'COLD';
                nextStep = 'DETAILS';
                responseKey = "ASK_BREATHING";
            } else {
                responseKey = "UNCLEAR";
            }
        }
        // DETAILS STATE (Context Aware)
        else if (step === 'DETAILS') {
            if (symptom === 'FEVER') {
                if (lowerInput.match(/\d+/) || lowerInput.includes('high') || lowerInput.includes('yes') || lowerInput.includes('more')) {
                    nextStep = 'ADVICE';
                    responseKey = "ADVICE_FEVER";
                } else {
                    responseKey = "ASK_TEMP_AGAIN";
                }
            } else if (symptom === 'HEADACHE') {
                nextStep = 'ADVICE';
                responseKey = "ADVICE_HEADACHE";
            } else if (symptom === 'PAIN') {
                nextStep = 'ADVICE';
                responseKey = "ADVICE_PAIN";
            } else if (symptom === 'COLD') {
                if (lowerInput.includes('yes') || lowerInput.includes('hard') || lowerInput.includes('trouble')) {
                    responseKey = "EMERGENCY_BREATHING";
                    nextStep = 'CLOSING';
                } else {
                    nextStep = 'ADVICE';
                    responseKey = "ADVICE_COLD";
                }
            } else {
                // Fallback if symptom is lost or undefined in Details
                nextStep = 'SYMPTOM_CHECK';
                responseKey = "UNCLEAR";
            }
        }
        // ADVICE / CLOSING
        else if (step === 'ADVICE' || step === 'CLOSING') {
            if (lowerInput.includes('thank') || lowerInput.includes('ok') || lowerInput.includes('bye')) {
                nextStep = 'CLOSING';
                responseKey = "CLOSING";
            } else {
                nextStep = 'SYMPTOM_CHECK'; // Reset to check other symptoms
                responseKey = "ANYTHING_ELSE";
            }
        }

        return { nextStep, nextSymptom, responseKey };
    };

    const getResponseText = (key: string) => {
        switch (key) {
            case "GREETING_REPLY": return "Namaste! How can I help you today? Please tell me your symptoms.";
            case "ASK_TEMP": return "I understand you have a fever. have you checked your temperature? What is the reading?";
            case "ASK_DURATION": return "I see. How long have you had this headache? Is it severe?";
            case "ASK_LOCATION": return "Can you point to where exactly it hurts? Is it a sharp pain?";
            case "ASK_BREATHING": return "For the cough/cold, are you experiencing any difficulty in breathing?";
            case "ASK_TEMP_AGAIN": return "Could you please confirm if you have measured your temperature? A number allows me to advise better.";

            case "ADVICE_FEVER": return "Since your fever is high, please take one Paracetamol 650mg tablet after food. Drink plenty of water and rest. If it persists for more than 2 days, visit the clinic.";
            case "ADVICE_HEADACHE": return "For the headache, please hydrate yourself and try to rest in a dark, quiet room. If visuals get blurry, please see a doctor immediately.";
            case "ADVICE_PAIN": return "Please apply a warm compress to the area. Avoid heavy lifting. If the pain is unbearable, please visit the PHC immediately.";
            case "ADVICE_COLD": return "Steam inhalation twice a day is very effective. You can also drink warm water with honey and ginger. Avoid cold drinks.";
            case "EMERGENCY_BREATHING": return "⚠️ Breathing difficulty can be serious. Please go to the nearest hospital or Primary Health Centre immediately. Do not wait.";

            case "CLOSING": return "You're very welcome. Take care and get well soon! I am always here if you need me.";
            case "ANYTHING_ELSE": return "Is there anything else you are experiencing?";
            case "UNCLEAR": return "I'm listening. Could you describe that in a different way? I can help with fever, pain, cold, etc.";
            default: return "Please tell me more about how you are feeling.";
        }
    };

    const [isAiProcessing, setIsAiProcessing] = useState(false);

    const handleSendMessage = async () => {
        if (!inputText.trim()) return;

        const userText = inputText;
        const newMessage = { text: userText, sender: 'user' as const };

        setMessages(prev => [...prev, newMessage]);
        setInputText('');
        setIsTyping(true);
        setIsAiProcessing(true);

        try {
            // Import dynamically - use relative path to be safe
            const { getGeminiResponse } = await import('../services/gemini');

            // Build context
            const context = `
                Current Phase: ${conversationStep}
                Current Symptom: ${currentSymptom || "None yet"}
                History: ${messages.slice(-4).map(m => m.sender + ": " + m.text).join(' | ')}
            `;

            const aiText = await getGeminiResponse(userText, [], context);

            if (aiText) {
                setMessages(prev => [...prev, {
                    text: aiText,
                    sender: 'doctor'
                }]);
                if (type === 'audio' || type === 'video') {
                    speakText(aiText);
                }

                // Update state heuristically
                if (conversationStep === 'GREETING') setConversationStep('SYMPTOM_CHECK');
            } else {
                throw new Error("AI Empty Response");
            }

        } catch (error) {
            console.error("AI Error, falling back:", error);
            toast.error("AI Service Unavailable", {
                description: "Using offline assistant due to connection/key error."
            });

            // Fallback gracefully to mock logic
            setTimeout(() => {
                const { nextStep, nextSymptom, responseKey } = processAIResponse(userText, conversationStep, currentSymptom);
                const responseText = getResponseText(responseKey);

                setConversationStep(nextStep as any);
                setCurrentSymptom(nextSymptom);

                setMessages(prev => [...prev, {
                    text: responseText,
                    sender: 'doctor'
                }]);
                speakText(responseText);
            }, 1000);
        } finally {
            setIsTyping(false);
            setIsAiProcessing(false);
        }
    };

    const handleEndInteraction = () => {
        setStatus('ended');
        setTimeout(() => {
            onClose();
        }, 1000);
    };

    const [voiceState, setVoiceState] = useState<'listening' | 'processing' | 'speaking'>('speaking');
    const [subtitles, setSubtitles] = useState("Initializing AI Voice...");

    // Text to Speech
    const speakText = (text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Stop previous
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1;
            utterance.pitch = 1;
            utterance.onstart = () => {
                setVoiceState('speaking');
                setSubtitles(text);
            };
            utterance.onend = () => {
                // Check if component is still connected before listening again
                startListening();
            };
            window.speechSynthesis.speak(utterance);
        } else {
            // Fallback for no TTS
            setSubtitles(text);
            setTimeout(() => startListening(), 3000);
        }
    };

    // Speech to Text
    const startListening = () => {
        setVoiceState('listening');
        setSubtitles("Listening...");

        // Check for browser support
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.lang = 'en-US';
            recognition.interimResults = false;

            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setSubtitles(`You said: "${transcript}"`);
                setVoiceState('processing');

                const currentStep = stepRef.current;
                const currentSymp = symptomRef.current;

                // Call Real AI for Voice Logic
                import('../services/gemini').then(async ({ getGeminiResponse }) => {
                    const context = `Spoken Interaction. Step: ${currentStep}. Symptom: ${currentSymp}`;
                    const aiText = await getGeminiResponse(transcript, [], context);

                    if (aiText) {
                        speakText(aiText);
                        // Note: We don't add to chat 'messages' state for voice-only mode usually, 
                        // but if we want logs we could. For now, we trust speakText handles visual feedback via subtitles.
                    } else {
                        throw new Error("AI Empty");
                    }
                }).catch((err) => {
                    console.error("Voice AI Error:", err);
                    toast.error("Voice AI Error", {
                        description: "Falling back to basic response."
                    });

                    // Fallback to Mock
                    setTimeout(() => {
                        const { nextStep, nextSymptom, responseKey } = processAIResponse(transcript, currentStep, currentSymp);

                        setConversationStep(nextStep as any);
                        setCurrentSymptom(nextSymptom);

                        const responseText = getResponseText(responseKey);
                        speakText(responseText);
                    }, 1000);
                });
            };

            recognition.onerror = () => {
                setSubtitles("Listening... (Speak louder)");
            };

            recognition.start();
        } else {
            // Fallback for no STT (Simulated Loop)
            setTimeout(() => {
                setVoiceState('processing');
                const simulatedInput = "I have a fever"; // Default simulation fallback
                setSubtitles(`(Simulated): "${simulatedInput}"`);

                setTimeout(() => {
                    const currentStep = stepRef.current;
                    const currentSymp = symptomRef.current;

                    const { nextStep, nextSymptom, responseKey } = processAIResponse(simulatedInput, currentStep, currentSymp);

                    setConversationStep(nextStep as any);
                    setCurrentSymptom(nextSymptom);

                    const responseText = getResponseText(responseKey);
                    speakText(responseText);
                }, 1000);
            }, 4000);
        }
    };

    // Initial Voice Trigger
    useEffect(() => {
        if (status === 'connected' && (type === 'audio' || type === 'video')) {
            speakText("Namaste! I am your AI Health Assistant. Please tell me your symptoms.");
        }
    }, [status, type]);

    if (!type) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md h-[80vh] flex flex-col p-0 gap-0 overflow-hidden border-none sm:h-[600px] sm:rounded-xl">
                {/* Header */}
                <div className={`p-4 flex items-center justify-between ${type === 'video' ? 'bg-black text-white' : 'bg-primary/10'
                    }`}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center border-2 border-white">
                            <span className="font-bold text-white text-xs">AI</span>
                        </div>
                        <div>
                            <h3 className="font-bold">GramHealth AI</h3>
                            <p className="text-xs opacity-70">
                                {status === 'connecting' ? 'Initializing...' :
                                    status === 'connected' ? 'Online' : 'Session Ended'}
                            </p>
                        </div>
                    </div>
                    {status === 'connected' && (type === 'audio' || type === 'video') && (
                        <div className="font-mono bg-black/20 px-2 py-1 rounded text-sm">
                            {formatDuration(callDuration)}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className={`flex-1 overflow-hidden relative ${type === 'video' ? 'bg-zinc-900' : 'bg-background'}`}>




                    {/* Connecting State */}
                    {status === 'connecting' && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center animate-pulse">
                            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                                {type === 'audio' && <Phone className="w-10 h-10 text-primary" />}
                                {type === 'video' && <Video className="w-10 h-10 text-primary" />}
                                {type === 'chat' && <MessageCircle className="w-10 h-10 text-primary" />}
                            </div>
                            <h2 className="text-xl font-semibold mb-2">Connecting to Doctor...</h2>
                            <p className="text-muted-foreground">Please wait a moment</p>
                        </div>
                    )}

                    {/* Chat Interface */}
                    {type === 'chat' && status === 'connected' && (
                        <div className="flex flex-col h-full">
                            <ScrollArea className="flex-1 p-4">
                                <div className="space-y-4">
                                    {messages.map((msg, i) => (
                                        <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[80%] p-3 rounded-2xl ${msg.sender === 'user'
                                                ? 'bg-primary text-primary-foreground rounded-tr-none'
                                                : 'bg-secondary text-secondary-foreground rounded-tl-none'
                                                }`}>
                                                {msg.text}
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={scrollAreaRef} />
                                    {isTyping && (
                                        <div className="flex justify-start">
                                            <div className="bg-secondary text-secondary-foreground p-3 rounded-2xl rounded-tl-none flex items-center gap-1">
                                                <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" />
                                                <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce delay-75" />
                                                <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce delay-150" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                            <div className="p-3 border-t bg-background flex gap-2">
                                <Input
                                    placeholder="Type a message..."
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    className="flex-1"
                                />
                                <Button size="icon" onClick={handleSendMessage}>
                                    <Send className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Audio/Video Interface */}
                    {(type === 'audio' || type === 'video') && status === 'connected' && (
                        <div className="h-full flex flex-col items-center justify-center relative p-6">
                            {type === 'video' ? (
                                <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center">
                                    <User className="w-32 h-32 text-zinc-600" />
                                    {/* Subtitles Overlay */}
                                    <div className="absolute bottom-20 left-0 right-0 text-center px-4">
                                        <div className="inline-block bg-black/60 text-white px-4 py-2 rounded-xl backdrop-blur-sm max-w-[90%] text-sm">
                                            {subtitles}
                                        </div>
                                    </div>
                                    {/* Self view */}
                                    <div className="absolute top-4 right-4 w-24 h-32 bg-zinc-900 rounded-lg border border-zinc-700 shadow-lg overflow-hidden">
                                        {/* Mock camera view */}
                                        <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                                            <User className="w-8 h-8 text-zinc-600" />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-8 w-full max-w-sm">
                                    {/* Visualiser */}
                                    <div className={`relative w-40 h-40 flex items-center justify-center`}>
                                        {/* Ripple Effects for Speaking */}
                                        {voiceState === 'speaking' && (
                                            <>
                                                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                                                <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse blur-xl" />
                                            </>
                                        )}
                                        {/* Ripple Effects for Listening */}
                                        {voiceState === 'listening' && (
                                            <div className="absolute -inset-4 border-2 border-primary/30 rounded-full animate-pulse" />
                                        )}

                                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white shadow-2xl z-10 relative">
                                            {voiceState === 'listening' ? (
                                                <Mic className="w-12 h-12 animate-pulse" />
                                            ) : voiceState === 'speaking' ? (
                                                <div className="flex gap-1 items-end h-8">
                                                    <div className="w-2 bg-white rounded-full animate-[bounce_1s_infinite] h-4" />
                                                    <div className="w-2 bg-white rounded-full animate-[bounce_1s_infinite_0.2s] h-8" />
                                                    <div className="w-2 bg-white rounded-full animate-[bounce_1s_infinite_0.4s] h-6" />
                                                </div>
                                            ) : (
                                                <div className="w-3 h-3 bg-white rounded-full animate-bounce" />
                                            )}
                                        </div>
                                    </div>

                                    {/* Captions */}
                                    <div className="text-center space-y-2 min-h-[5rem]">
                                        <h2 className="text-xl font-bold transition-all duration-300">
                                            {voiceState === 'listening' ? "Listening..." : "GramHealth AI"}
                                        </h2>
                                        <p className="text-muted-foreground text-lg font-medium leading-relaxed">
                                            "{subtitles}"
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer Controls */}
                <div className={`p-6 flex justify-center gap-6 ${type === 'video' ? 'bg-black' : 'bg-background border-t'}`}>
                    {(type === 'audio' || type === 'video') && (
                        <>
                            <Button variant="outline" size="icon" className="h-14 w-14 rounded-full">
                                <Mic className="w-6 h-6" />
                            </Button>
                            <Button
                                variant="destructive"
                                size="icon"
                                className="h-14 w-14 rounded-full hover:bg-red-600"
                                onClick={handleEndInteraction}
                            >
                                <PhoneOff className="w-6 h-6" />
                            </Button>
                            {type === 'video' && (
                                <Button variant="outline" size="icon" className="h-14 w-14 rounded-full">
                                    <Video className="w-6 h-6" />
                                </Button>
                            )}
                        </>
                    )}
                    {type === 'chat' && (
                        <Button variant="ghost" onClick={handleEndInteraction} className="text-destructive w-full">
                            End Chat
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
