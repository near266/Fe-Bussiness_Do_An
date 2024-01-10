import { ScaleId } from './IRecruitment';

export interface IEnterprise {
  id: string;
  name: string;
  scale_id: ScaleId;
  city_id: number;
  district_id: number;
  ward_id: number;
  map_url: null;
  phone: string;
  career_field_id: number;
  website_url: string;
  introduce: string;
  user_id: string;
  avatar: string;
  represent: string;
  plan: string;
  phone_verified: true;
}
