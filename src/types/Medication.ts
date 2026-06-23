export type PharmacyLocation = {
  latitude: number;
  longitude: number;
};

export type RelatedContact = {
  name: string;
  phone: string;
};

export type Medication = {
  id: string;
  name: string;
  hour: string;
  imageUri?: string | null;
  pharmacyLocation?: PharmacyLocation | null;
  relatedContact?: RelatedContact | null;
  calendarEventCreated?: boolean;
};