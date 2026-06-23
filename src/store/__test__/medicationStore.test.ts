import AsyncStorage from "@react-native-async-storage/async-storage";

import { useMedicationStore } from "../medicationStore";

describe("Medication Store", () => {
  beforeEach(async () => {
    useMedicationStore.setState({
      medications: [],
    });

    await AsyncStorage.clear();
  });

  it("agrega un medicamento al store", async () => {
    await useMedicationStore.getState().addMedication({
      id: "1",
      name: "Aspirina",
      hour: "08:00",
      imageUri: null,
      pharmacyLocation: null,
      relatedContact: null,
      calendarEventCreated: false,
    });

    const medications =
      useMedicationStore.getState().medications;

    expect(medications).toHaveLength(1);
    expect(medications[0].name).toBe("Aspirina");
  });

  it("elimina un medicamento del store", async () => {
    await useMedicationStore.getState().addMedication({
      id: "1",
      name: "Aspirina",
      hour: "08:00",
      imageUri: null,
      pharmacyLocation: null,
      relatedContact: null,
      calendarEventCreated: false,
    });

    await useMedicationStore.getState().deleteMedication("1");

    const medications =
      useMedicationStore.getState().medications;

    expect(medications).toHaveLength(0);
  });

  it("actualiza un medicamento del store", async () => {
    await useMedicationStore.getState().addMedication({
      id: "1",
      name: "Aspirina",
      hour: "08:00",
      imageUri: null,
      pharmacyLocation: null,
      relatedContact: null,
      calendarEventCreated: false,
    });

    await useMedicationStore.getState().updateMedication("1", {
      name: "Ibuprofeno",
      hour: "10:30",
    });

    const medications =
      useMedicationStore.getState().medications;

    expect(medications[0].name).toBe("Ibuprofeno");
    expect(medications[0].hour).toBe("10:30");
  });
});