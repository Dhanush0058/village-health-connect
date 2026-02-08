import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { Loader2, Navigation, MapPin, Star, Clock } from 'lucide-react';
import { GOOGLE_MAPS_API_KEY, mapContainerStyle, defaultMapOptions } from '@/config/maps';

interface Location {
    latitude: number;
    longitude: number;
}

interface MapComponentProps {
    userLocation: Location;
    type: 'hospital' | 'pharmacy' | 'veterinary_care';
}

const libraries: ("places" | "geometry" | "drawing" | "visualization")[] = ["places"];

const MapComponent: React.FC<MapComponentProps> = ({ userLocation, type }) => {
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries,
    });

    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [places, setPlaces] = useState<google.maps.places.PlaceResult[]>([]);
    const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
    const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);

    // Search for places when map is loaded or location/type changes
    useEffect(() => {
        if (map && userLocation) {
            setIsLoadingPlaces(true);
            const service = new google.maps.places.PlacesService(map);

            const request: google.maps.places.PlaceSearchRequest = {
                location: new google.maps.LatLng(userLocation.latitude, userLocation.longitude),
                radius: 5000, // 5km radius
                type: type,
            };

            service.nearbySearch(request, (results, status) => {
                setIsLoadingPlaces(false);
                if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                    setPlaces(results);
                } else {
                    console.error("Places search failed:", status);
                }
            });
        }
    }, [map, userLocation, type]);

    const onLoad = useCallback((map: google.maps.Map) => {
        setMap(map);
    }, []);

    const onUnmount = useCallback(() => {
        setMap(null);
    }, []);

    const handleMarkerClick = (place: google.maps.places.PlaceResult) => {
        setSelectedPlace(place);
    };

    const handleDirectionClick = (place: google.maps.places.PlaceResult) => {
        const lat = place.geometry?.location?.lat();
        const lng = place.geometry?.location?.lng();
        if (lat && lng) {
            window.open(`https://www.google.com/maps/dir/${userLocation.latitude},${userLocation.longitude}/${lat},${lng}`, '_blank');
        }
    };

    if (loadError) {
        return <div className="p-4 text-destructive bg-destructive/10 rounded-xl">Error loading Google Maps</div>;
    }

    if (!isLoaded) {
        return (
            <div className="flex flex-col items-center justify-center h-[400px] bg-secondary/30 rounded-xl animate-pulse">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="mt-2 text-muted-foreground">Loading Maps...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="relative rounded-xl overflow-hidden shadow-lg border border-border">
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={{ lat: userLocation.latitude, lng: userLocation.longitude }}
                    zoom={13}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                    options={defaultMapOptions}
                >
                    {/* User Location Marker */}
                    <MarkerF
                        position={{ lat: userLocation.latitude, lng: userLocation.longitude }}
                        icon={{
                            path: google.maps.SymbolPath.CIRCLE,
                            scale: 8,
                            fillColor: "#4285F4",
                            fillOpacity: 1,
                            strokeColor: "white",
                            strokeWeight: 2,
                        }}
                        zIndex={100}
                    />

                    {/* Places Markers */}
                    {places.map((place) => (
                        <MarkerF
                            key={place.place_id}
                            position={place.geometry?.location!}
                            onClick={() => handleMarkerClick(place)}
                        // Use default red pin or customize based on type
                        />
                    ))}

                    {selectedPlace && (
                        <InfoWindowF
                            position={selectedPlace.geometry?.location!}
                            onCloseClick={() => setSelectedPlace(null)}
                        >
                            <div className="p-2 max-w-xs">
                                <h3 className="font-bold text-sm">{selectedPlace.name}</h3>
                                <p className="text-xs text-gray-600 truncate">{selectedPlace.vicinity}</p>
                                {selectedPlace.rating && (
                                    <div className="flex items-center gap-1 mt-1">
                                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                        <span className="text-xs font-medium">{selectedPlace.rating}</span>
                                        <span className="text-xs text-gray-400">({selectedPlace.user_ratings_total})</span>
                                    </div>
                                )}
                                <button
                                    onClick={() => handleDirectionClick(selectedPlace)}
                                    className="mt-2 w-full text-xs bg-blue-600 text-white py-1.5 px-3 rounded-md flex items-center justify-center gap-1 hover:bg-blue-700 transition"
                                >
                                    <Navigation className="w-3 h-3" />
                                    Directions
                                </button>
                            </div>
                        </InfoWindowF>
                    )}
                </GoogleMap>
            </div>

            {/* Places List */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Nearby {type === 'hospital' ? 'Hospitals' : type === 'pharmacy' ? 'Pharmacies' : 'Veterinary Clinics'}
                </h3>

                {isLoadingPlaces ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                ) : places.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground bg-secondary/30 rounded-xl">
                        No places found nearby.
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
                        {places.map((place) => (
                            <div
                                key={place.place_id}
                                className={`bg-card p-4 rounded-xl border border-border hover:border-primary transition-all cursor-pointer ${selectedPlace?.place_id === place.place_id ? 'ring-2 ring-primary bg-primary/5' : ''}`}
                                onClick={() => {
                                    setSelectedPlace(place);
                                    map?.panTo(place.geometry?.location!);
                                }}
                            >
                                <div className="flex justify-between items-start gap-4">
                                    <div>
                                        <h4 className="font-bold text-lg">{place.name}</h4>
                                        <p className="text-sm text-muted-foreground mt-1">{place.vicinity}</p>
                                        <div className="flex items-center gap-4 mt-2">
                                            {place.rating && (
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                    <span className="font-medium text-sm">{place.rating}</span>
                                                    <span className="text-xs text-muted-foreground">({place.user_ratings_total})</span>
                                                </div>
                                            )}
                                            {place.opening_hours?.open_now !== undefined && (
                                                <div className={`flex items-center gap-1 text-sm font-medium ${place.opening_hours.open_now ? 'text-green-600' : 'text-red-500'}`}>
                                                    <Clock className="w-4 h-4" />
                                                    {place.opening_hours.open_now ? 'Open Now' : 'Closed'}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDirectionClick(place);
                                        }}
                                        className="p-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                                    >
                                        <Navigation className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MapComponent;
