import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

import type { Medication } from "../types/Medication";

type MedicationStore = {
  medications: Medication[];

  loadMedications: () => Promise<void>;
  addMedication: (medication: Medication) => Promise<void>;
  deleteMedication: (id: string) => Promise<void>;
  updateMedication: (
    id: string,
    updatedData: Partial<Medication>
  ) => Promise<void>;
  clearMedications: () => Promise<void>;
};

export const useMedicationStore = create<MedicationStore>((set, get) => ({
  medications: [],

  loadMedications: async () => {
    const storedItems = await AsyncStorage.getItem("medications");

    const medications = storedItems
      ? JSON.parse(storedItems)
      : [];

    set({
      medications,
    });
  },

  addMedication: async (medication) => {
    const currentMedications = get().medications;

    const updatedMedications = [
      ...currentMedications,
      medication,
    ];

    set({
      medications: updatedMedications,
    });

    await AsyncStorage.setItem(
      "medications",
      JSON.stringify(updatedMedications)
    );
  },

  deleteMedication: async (id) => {
    const currentMedications = get().medications;

    const updatedMedications = currentMedications.filter(
      (medication) => medication.id !== id
    );

    set({
      medications: updatedMedications,
    });

    await AsyncStorage.setItem(
      "medications",
      JSON.stringify(updatedMedications)
    );
  },

  updateMedication: async (id, updatedData) => {
    const currentMedications = get().medications;

    const updatedMedications = currentMedications.map(
      (medication) =>
        medication.id === id
          ? { ...medication, ...updatedData }
          : medication
    );

    set({
      medications: updatedMedications,
    });

    await AsyncStorage.setItem(
      "medications",
      JSON.stringify(updatedMedications)
    );
  },

  clearMedications: async () => {
    set({
      medications: [],
    });

    await AsyncStorage.removeItem("medications");
  },
}));