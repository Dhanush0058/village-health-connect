import { ReactNode } from 'react';
import Header from './Header';
import BottomNav from './BottomNav';
import VoiceButton from './VoiceButton';
import Disclaimer from './Disclaimer';

interface LayoutProps {
  children: ReactNode;
  showDisclaimer?: boolean;
}

const Layout = ({ children, showDisclaimer = true }: LayoutProps) => {
  return (
    <div className="relative min-h-screen flex flex-col bg-background">
      {/* Decorative Background Pattern */}
      <div className="fixed inset-0 -z-10 pointer-events-none opacity-30">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dotPattern" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" className="fill-primary/40" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dotPattern)" />
        </svg>
      </div>

      <Header />
      
      <main className="flex-1 pb-24 md:pb-8">
        {children}
      </main>

      {showDisclaimer && <Disclaimer />}
      
      <VoiceButton />
      <BottomNav />
    </div>
  );
};

export default Layout;