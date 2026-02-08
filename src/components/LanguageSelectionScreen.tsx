
import React from 'react';
import { useLanguage, languages } from '../contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe } from 'lucide-react';

export const LanguageSelectionScreen = () => {
    const { setLanguage, t, isLanguageModalOpen, setIsLanguageModalOpen } = useLanguage();

    const handleLanguageSelect = (langCode: any) => {
        setLanguage(langCode);
        setIsLanguageModalOpen(false);
    };

    if (!isLanguageModalOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <Card className="w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-300">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 bg-primary/10 p-3 rounded-full w-fit">
                        <Globe className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Welcome / 	స్వాగతం / स्वागत</CardTitle>
                    <CardDescription className="text-lg mt-2">
                        Please select your preferred language
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="max-h-[60vh] overflow-y-auto p-4 grid gap-3 custom-scrollbar">
                        {languages.map((lang) => (
                            <Button
                                key={lang.code}
                                variant="outline"
                                size="lg"
                                className="w-full text-lg justify-between hover:bg-primary/5 border-2 h-14 shrink-0"
                                onClick={() => handleLanguageSelect(lang.code)}
                            >
                                <span className="font-semibold">{lang.label}</span>
                                <span className="text-muted-foreground bg-secondary px-2 py-1 rounded text-xs">
                                    {lang.short}
                                </span>
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
