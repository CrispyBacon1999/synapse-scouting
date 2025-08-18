export type TbaTeam = {
  key: string;
  team_number: number;
  nickname: string;
  name: string;
  school_name: string;
  city: string;
  state_prov: string;
  country: string;
  address: string;
  postal_code: string;
  gmaps_place_id: string;
  lat: number;
  lng: number;
  location_name: string;
  website: string;
  rookie_year: number;
}

export type TbaTeamSimple = Omit<TbaTeam, "school_name" | "address" | "postal_code" | "gmaps_place_id" | "lat" | "lng" | "location_name" | "website" | "rookie_year">;