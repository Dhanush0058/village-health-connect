import { useState, useEffect } from 'react';
import { toast } from "sonner";

interface Location {
    latitude: number;
    longitude: number;
}

interface UseLocationReturn {
    location: Location | null;
    error: string | null;
    isLoading: boolean;
    getLocation: () => void;
}

export const useLocation = (): UseLocationReturn => {
    const [location, setLocation] = useState<Location | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const getLocation = () => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            toast.error("Location Error", { description: "Your browser does not support GPS." });
            return;
        }

        setIsLoading(true);
        setError(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ latitude, longitude });
                setIsLoading(false);
                toast.success("Location Found", { description: "Using your current location." });
            },
            (err) => {
                setError(err.message);
                setIsLoading(false);
                let errorMessage = "Unable to retrieve location.";
                if (err.code === 1) errorMessage = "Location permission denied. Please enable it in browser settings.";
                else if (err.code === 2) errorMessage = "Location unavailable.";
                else if (err.code === 3) errorMessage = "Location request timed out.";

                toast.error("Location Error", { description: errorMessage });
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };

    return { location, error, isLoading, getLocation };
};
