import { validateMedicationInput } from "../medicationValidation";

describe("validateMedicationInput", () => {
  it("retorna array vacío cuando el nombre es válido", () => {
    const errors = validateMedicationInput("Aspirina");

    expect(errors).toHaveLength(0);
    expect(errors).toEqual([]);
  });

  it("retorna error si el nombre está vacío", () => {
    const errors = validateMedicationInput("");

    expect(errors).toContain("El nombre del medicamento es requerido");
  });

  it("retorna error si el nombre solo tiene espacios", () => {
    const errors = validateMedicationInput("     ");

    expect(errors).toContain("El nombre del medicamento es requerido");
  });

  it("retorna error si el nombre tiene menos de 3 caracteres", () => {
    const errors = validateMedicationInput("Ib");

    expect(errors).toContain("El nombre debe tener al menos 3 caracteres");
  });
});