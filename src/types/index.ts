export interface Image {
  src: string;
  subject: string;
  ext: string;
}

export interface Attraction {
  id: number;
  name: string;
  introduction: string;
  open_time: string;
  district: string;
  address: string;
  tel: string;
  fax: string;
  email: string;
  months: string;
  nlat: number;
  elong: number;
  official_site: string;
  facebook: string;
  ticket: string;
  remind: string;
  staytime: string;
  modified: string;
  url: string;
  category: { id: number; name: string }[];
  target: { id: number; name: string }[];
  service: { id: number; name: string }[];
  friendly: { id: number; name: string }[];
  images: Image[];
  files: any[];
}

export interface ApiResponse {
  total: number;
  data: Attraction[];
}
