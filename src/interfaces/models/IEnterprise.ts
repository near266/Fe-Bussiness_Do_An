import { ScaleId } from './IRecruitment';

export interface IEnterprise {
  id: string;
  name: string;
  scale_id: ScaleId;
  city_id: string;
  district_id: string;
  ward_id: string;
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
