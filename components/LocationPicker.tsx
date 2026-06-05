"use client";

import React, { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { Skeleton } from "primereact/skeleton";

interface State {
  id: number;
  name: string;
  capital: string;
}

interface LGA {
  id: number;
  name: string;
}

interface LocationPickerProps {
  onStateChange?: (stateId: number | null, stateName: string | null) => void;
  onLGAChange?: (lgaId: number | null, lgaName: string | null) => void;
  selectedStateId?: number | null;
  selectedLGAId?: number | null;
  disabled?: boolean;
  showLabels?: boolean;
  className?: string;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  onStateChange,
  onLGAChange,
  selectedStateId,
  selectedLGAId,
  disabled = false,
  showLabels = true,
  className = "",
}) => {
  const [states, setStates] = useState<State[]>([]);
  const [lgas, setLgas] = useState<LGA[]>([]);
  const [loadingStates, setLoadingStates] = useState(true);
  const [loadingLgas, setLoadingLgas] = useState(false);
  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [selectedLGA, setSelectedLGA] = useState<LGA | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:8000/api/";

  // Fetch states on mount
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await fetch(`${baseUrl}accounts/locations/states/`);
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        const data = await response.json();
        setStates(data);
      } catch (error) {
        console.error("Error fetching states:", error);
      } finally {
        setLoadingStates(false);
      }
    };
    fetchStates();
  }, [baseUrl]);

  // Set selected state from prop
  useEffect(() => {
    if (selectedStateId && states.length > 0) {
      const state = states.find((s) => s.id === selectedStateId);
      if (state) {
        setSelectedState(state);
        fetchLgas(state.id);
      }
    }
  }, [selectedStateId, states]);

  // Set selected LGA from prop
  useEffect(() => {
    if (selectedLGAId && lgas.length > 0) {
      const lga = lgas.find((l) => l.id === selectedLGAId);
      if (lga) {
        setSelectedLGA(lga);
      }
    }
  }, [selectedLGAId, lgas]);

  const fetchLgas = async (stateId: number) => {
    setLoadingLgas(true);
    try {
      const response = await fetch(`${baseUrl}accounts/locations/states/${stateId}/lgas/`);
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      const data = await response.json();
      setLgas(data);
    } catch (error) {
      console.error("Error fetching LGAs:", error);
    } finally {
      setLoadingLgas(false);
    }
  };

  const handleStateChange = (e: { value: State }) => {
    const state = e.value;
    setSelectedState(state);
    setSelectedLGA(null);
    setLgas([]);
    if (onStateChange) {
      onStateChange(state?.id || null, state?.name || null);
    }
    if (onLGAChange) {
      onLGAChange(null, null);
    }
    if (state) {
      fetchLgas(state.id);
    }
  };

  const handleLGAChange = (e: { value: LGA }) => {
    const lga = e.value;
    setSelectedLGA(lga);
    if (onLGAChange) {
      onLGAChange(lga?.id || null, lga?.name || null);
    }
  };

  if (loadingStates) {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        {showLabels && <Skeleton width="100px" height="20px" />}
        <Skeleton width="100%" height="40px" />
        {showLabels && <Skeleton width="100px" height="20px" />}
        <Skeleton width="100%" height="40px" />
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* State Dropdown */}
      <div className="flex flex-col gap-1">
        {showLabels && (
          <label className="font-square font-medium text-primary-black">
            State <span className="text-red-500">*</span>
          </label>
        )}
        <Dropdown
          value={selectedState}
          options={states}
          onChange={handleStateChange}
          optionLabel="name"
          placeholder="Select your state"
          className="w-full"
          disabled={disabled}
          filter
          showClear
        />
      </div>

      {/* LGA Dropdown */}
      <div className="flex flex-col gap-1">
        {showLabels && (
          <label className="font-square font-medium text-primary-black">
            Local Government Area <span className="text-red-500">*</span>
          </label>
        )}
        {loadingLgas ? (
          <Skeleton width="100%" height="40px" />
        ) : (
          <Dropdown
            value={selectedLGA}
            options={lgas}
            onChange={handleLGAChange}
            optionLabel="name"
            placeholder={selectedState ? "Select your LGA" : "Select a state first"}
            className="w-full"
            disabled={disabled || !selectedState}
            filter
            showClear
          />
        )}
      </div>
    </div>
  );
};

export default LocationPicker;