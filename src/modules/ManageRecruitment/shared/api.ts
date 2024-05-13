import ICareer from '@/interfaces/models/ICareer';
import { IField } from '@/interfaces/models/IField';
import {
  ApproveStatusId,
  DiplomaId,
  ExperienceId,
  FormOfWorkId,
  IRecruitment,
  StatusId,
} from '@/interfaces/models/IRecruitment';
import { IServerResponse } from '@/interfaces/server/IServerResponse';
import { apiEnterprise } from '@/shared/axios/apiv3';

export type UpdateApprovementParam = { status_id: number; reason_of_rejection: string };
export type UpdateStatusParam = { status_id: number };
export type CreateJobPost = {
  enterprise_id: string;
  career_field_id: 0;
  career_id: string;
  title: string;
  slug: string;
  city: string;
  district: string;
  address: string;
  map_url: string;
  image_url: string;
  form_of_work: string;
  diploma: string;
  experience: string;
  level: string;
  gender: string;
  deadline: any;
  probationary_period: string;
  salary_type: string;
  salary_min: 0;
  salary_max: 0;
  overview: string;
  requirement: string;
  benefit: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  status_id: string;
  // approve_status_id: string;
  // reason_of_view: string;
  // total_view: 0;
  // total_cv: 0;
  // deleted_at: '2024-05-12T13:06:05.613Z';
  // created_by: string;
  created_date: any;
  // update_by: string;
  // update_at: '2024-05-12T13:06:05.613Z';
};
export type PayloadContact = {
  name: string;
  email: string;
  phone: string;
  content: string;
};
export type ViewAllFields = {
  page: number;
  pageSize: number;
};
export type SearchCaree = {
  idField: any;
  page: number;
  pageSize: number;
};
export type CreatePost = {
  title: string;
  city_id: number;
  district_id: number;
  form_of_work_id: FormOfWorkId;
  diploma_id: DiplomaId;
  experience_id: ExperienceId;
  career_field_id: number;
  career_id: string;
  deadline: string;
  probationary_period_id: number;
  salary_type_id: number;
  salary_min: number;
  salary_max: number;
  overview: string;
  requirement: string;
  benefit: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  status_id: StatusId;
  active_status_id: StatusId;
  image_url?: string;
  view_count?: number;
  approve_status_id?: ApproveStatusId;
  slug?: string;
  enterprise_id?: string;
  reason_of_rejection?: string;
  updated_at?: string;
};
export type UpdatePost = {
  id: string;
  title: string;
  city_id: number;
  district_id: number;
  form_of_work_id: FormOfWorkId;
  diploma_id: DiplomaId;
  experience_id: ExperienceId;
  career_field_id: number;
  career_id: string;
  deadline: string;
  probationary_period_id: number;
  salary_type_id: number;
  salary_min: number;
  salary_max: number;
  overview: string;
  requirement: string;
  benefit: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  status_id: StatusId;
  active_status_id: StatusId;
  image_url?: string;
  view_count?: number;
  approve_status_id?: ApproveStatusId;
  slug?: string;
  enterprise_id?: string;
  reason_of_rejection?: string;
  updated_at?: string;
};
export type Detail = {
  id: string;
};
class RecruitmentsAPI {
  getFields = async (payload: ViewAllFields) => {
    const data = await apiEnterprise.post('/api/Cv/Cv/ViewAll-careerfields', payload);
    return data.data;
  };

  getCareee = async (payload: SearchCaree) => {
    const data = await apiEnterprise.post('/api/Cv/caree/search', payload);
    return data.data;
  };
  getCareeeDetail = async (payload: Detail) => {
    const data = await apiEnterprise.post('/api/Cv/caree/detail', payload);
    return data.data;
  };
  getCareeeFields = async (payload: Detail) => {
    const data = await apiEnterprise.post('/api/Cv/careeFields/detail', payload);
    return data.data;
  };
  async getAllTags() {
    const { data } = await apiEnterprise.get(
      `${process.env.NEXT_PUBLIC_ENTERPRISE_API_URL}/tags`
    );
    return data.data;
  }
  getCareers = async (keyword?: string) => {
    const { data } = await apiEnterprise.get<IServerResponse>(
      `/careers?search=${keyword ?? ''}`
    );
    return data.data as ICareer[];
  };
  getRecruitments = async () => {
    const { data } = await apiEnterprise.get('/job-posts');
    return data;
  };
  getRecruitmentById = async (id: string) => {
    const { data } = await apiEnterprise.get(`/api/Cv/job-post/detail?id=${id}`);
    return data;
  };
  createRecruitment = async (params: CreateJobPost) => {
    const { data } = await apiEnterprise.post('/api/Cv/job-post/create', params);
    return data;
  };

  async sendContact(data: PayloadContact) {
    const res = await apiEnterprise.post('enterprises/contact', data);
    return res.data;
  }

  updateRcruitment = async (params: UpdatePost) => {
    const { data } = await apiEnterprise.put(`/api/Cv/job-post/update`, params);
    return data;
  };
  deleteRecruitment = async (id: string) => {
    const { data } = await apiEnterprise.delete(`/job-posts/${id}`);
    return data;
  };
  updateRecruittmentStatus = async (id: string, params: UpdateStatusParam) => {
    const { data } = await apiEnterprise.put(`/job-posts/${id}/status`, params);
    return data;
  };
  updateApprovement = async (id: string, params: UpdateApprovementParam) => {
    const { data } = await apiEnterprise.put(`/job-posts/${id}/approve`, params);
    return data;
  };
}

export const recruitmentsAPI = new RecruitmentsAPI();
