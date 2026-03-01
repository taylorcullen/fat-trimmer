"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  type UnitSystem,
  formatWeightDisplay,
  formatHeightDisplay,
  formatWeightChangeDisplay,
  formatMeasurementDisplay,
} from "./units";

interface UnitContextValue {
  unitSystem: UnitSystem;
  setUnitSystem: (system: UnitSystem) => void;
  formatWeight: (kg: number) => string;
  formatHeight: (cm: number) => string;
  formatWeightChange: (kg: number) => string;
  formatMeasurement: (cm: number) => string;
  isLoading: boolean;
}

const UnitContext = createContext<UnitContextValue>({
  unitSystem: "metric",
  setUnitSystem: () => {},
  formatWeight: (kg) => `${kg.toFixed(1)} kg`,
  formatHeight: (cm) => `${cm} cm`,
  formatWeightChange: (kg) => `${Math.abs(kg).toFixed(1)} kg`,
  formatMeasurement: (cm) => `${cm} cm`,
  isLoading: true,
});

export function UnitProvider({ children }: { children: React.ReactNode }) {
  const [unitSystem, setUnitSystemState] = useState<UnitSystem>("metric");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user")
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (data?.unitSystem) {
          setUnitSystemState(data.unitSystem as UnitSystem);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const setUnitSystem = useCallback((system: UnitSystem) => {
    setUnitSystemState(system);
  }, []);

  const formatWeight = useCallback(
    (kg: number) => formatWeightDisplay(kg, unitSystem),
    [unitSystem]
  );

  const formatHeight = useCallback(
    (cm: number) => formatHeightDisplay(cm, unitSystem),
    [unitSystem]
  );

  const formatWeightChange = useCallback(
    (kg: number) => formatWeightChangeDisplay(kg, unitSystem),
    [unitSystem]
  );

  const formatMeasurement = useCallback(
    (cm: number) => formatMeasurementDisplay(cm, unitSystem),
    [unitSystem]
  );

  return (
    <UnitContext.Provider
      value={{
        unitSystem,
        setUnitSystem,
        formatWeight,
        formatHeight,
        formatWeightChange,
        formatMeasurement,
        isLoading,
      }}
    >
      {children}
    </UnitContext.Provider>
  );
}

export function useUnits() {
  return useContext(UnitContext);
}
