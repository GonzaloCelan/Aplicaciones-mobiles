
export function validateMedicationInput(name: string): string[] {
  const errors: string[] = [];

  if (!name.trim()) {
    errors.push("El nombre del medicamento es requerido");
  } else if (name.trim().length < 3) {
    errors.push("El nombre debe tener al menos 3 caracteres");
  }

  return errors;
}