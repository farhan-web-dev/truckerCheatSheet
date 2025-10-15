"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import MapFixer from "./ui/MapFixer";
import { useUserVeiw } from "@/hooks/useUser";

// Patch default Leaflet icons
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});

// Services configuration
const serviceTypes = [
  {
    key: "truck_stops",
    label: "Truck Stops",
    icon: "🚚",
    query: `node["amenity"="parking"]["hgv"="yes"]`,
  },
  {
    key: "diesel_repair",
    label: "Diesel Repair",
    icon: "🔧",
    query: `node["shop"="car_repair"]`,
  },
  {
    key: "nearby_users",
    label: "Nearby Users",
    icon: "🧑",
    query: "", // will be handled separately
  },
];

type Place = {
  id: string;
  name: string;
  lat: number;
  lon: number;
};

const NearbyServicesDirectory: React.FC = () => {
  const [currentPos, setCurrentPos] = useState<[number, number] | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedType, setSelectedType] = useState(serviceTypes[0]);
  const [isClient, setIsClient] = useState(false);

  const { data: users, isLoading: isUsersLoading } = useUserVeiw();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get current location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setCurrentPos([pos.coords.latitude, pos.coords.longitude]),
      () => {
        alert("Location access denied. Using Dallas fallback.");
        setCurrentPos([32.7767, -96.797]);
      }
    );
  }, []);

  // Fetch services or users based on selected type
  useEffect(() => {
    if (!currentPos) return;

    const fetchPOIs = async () => {
      if (selectedType.key === "nearby_users") {
        if (!users) return;

        const userPlaces: Place[] = users
          .filter((user: any) => user.location?.coordinates?.length === 2)
          .map((user: any) => ({
            id: user._id,
            name: user.name || "Unnamed User",
            lat: user.location.coordinates[1], // Leaflet: [lat, lng]
            lon: user.location.coordinates[0],
          }));

        setPlaces(userPlaces);
      } else {
        const [lat, lon] = currentPos;
        const query = `
          [out:json];
          (
            ${selectedType.query}(around:50000, ${lat}, ${lon});
          );
          out body;
        `;

        const res = await fetch("https://overpass-api.de/api/interpreter", {
          method: "POST",
          body: query,
        });

        const data = await res.json();

        const results: Place[] = data.elements
          .filter((el: any) => el.lat && el.lon)
          .map((el: any) => ({
            id: el.id,
            name: el.tags?.name || "Unnamed",
            lat: el.lat,
            lon: el.lon,
          }));

        setPlaces(results);
      }
    };

    fetchPOIs();
  }, [currentPos, selectedType, users]);

  if (!isClient || !currentPos)
    return <div className="text-white p-6">Loading map...</div>;

  // Custom icons
  const truckStopIcon = L.icon({
    iconUrl: "/nearby-truckstop.svg",
    iconSize: [35, 35],
    iconAnchor: [17, 35],
  });

  const dieselRepairIcon = L.icon({
    iconUrl: "/nearby-diesel.svg",
    iconSize: [35, 35],
    iconAnchor: [17, 35],
  });

  const userIcon = L.icon({
    iconUrl: "/nearby-user.svg",
    iconSize: [35, 35],
    iconAnchor: [17, 35],
  });

  const getIcon = (typeKey: string) => {
    if (typeKey === "truck_stops") return truckStopIcon;
    if (typeKey === "diesel_repair") return dieselRepairIcon;
    if (typeKey === "nearby_users") return userIcon;
    return truckStopIcon;
  };

  return (
    <div className="bg-[#111827] text-white min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 py-6 px-8 flex justify-between items-center rounded-md shadow">
        <div>
          <h1 className="md:text-3xl  text-xl font-bold flex items-center gap-2">
            <span>📍</span> Nearby Services Directory
          </h1>
          <p className="md:text-sm pl-6 md:pl-0 text-xs mt-1">
            Find diesel repair shops, truck stops, and nearby users within 50
            miles
          </p>
        </div>
        <div className="md:text-sm text-xs text-right text-gray-300">
          Powered by OpenStreetMap
        </div>
      </div>

      {/* Filters */}
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">
          Nearby Services Directory
        </h2>
        <div className="grid grid-cols-2 md:flex gap-4 flex-wrap">
          {serviceTypes.map((type) => (
            <button
              key={type.key}
              onClick={() => setSelectedType(type)}
              className={`px-6 py-3 rounded-md bg-[#1F2937] hover:bg-[#374151] transition ${
                selectedType.key === type.key ? "border border-blue-500" : ""
              }`}
            >
              <span className="mr-2">{type.icon}</span>
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="w-full px-6 pb-6">
        <div className="z-0 relative w-full h-[400px] lg:h-[500px] rounded-md overflow-hidden border border-gray-700">
          <MapContainer
            center={currentPos}
            zoom={11}
            scrollWheelZoom
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
            />
            <MapFixer />
            <Marker position={currentPos}>
              <Popup>You are here</Popup>
            </Marker>
            {places.map((place) => (
              <Marker
                key={place.id}
                position={[place.lat, place.lon]}
                icon={getIcon(selectedType.key)}
              >
                <Popup>{place.name}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default NearbyServicesDirectory;
