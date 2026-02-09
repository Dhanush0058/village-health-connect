import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { LanguageSelectionScreen } from "@/components/LanguageSelectionScreen";
// import Index from "./pages/Index"; // Keeping for reference if needed, but replaced by MedCoreLanding
import MedCoreLanding from "./pages/MedCoreLanding";
import DoctorConsult from "./pages/DoctorConsult";
import AnimalHealth from "./pages/AnimalHealth";
import PhotoHelp from "./pages/PhotoHelp";
import MedicineDelivery from "./pages/MedicineDelivery";
import NearbyHospitals from "./pages/NearbyHospitals";
import Emergency from "./pages/Emergency";
import Profile from "./pages/Profile";
import Alerts from "./pages/Alerts";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <LanguageSelectionScreen />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MedCoreLanding />} />
            <Route path="/doctor" element={<DoctorConsult />} />
            <Route path="/animal" element={<AnimalHealth />} />
            <Route path="/photo" element={<PhotoHelp />} />
            <Route path="/medicine" element={<MedicineDelivery />} />
            <Route path="/hospital" element={<NearbyHospitals />} />
            <Route path="/emergency" element={<Emergency />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/alerts" element={<Alerts />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;