import ICareer from '@/interfaces/models/ICareer';
import { IField } from '@/interfaces/models/IField';
import { IRecruitment } from '@/interfaces/models/IRecruitment';
import { IServerResponse } from '@/interfaces/server/IServerResponse';
import { apiEnterprise } from '@/shared/axios/apiv3';

export type UpdateApprovementParam = { status_id: number; reason_of_rejection: string };
export type UpdateStatusParam = { status_id: number };

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
class RecruitmentsAPI {
  getFields = async (payload: ViewAllFields) => {
    const data = await apiEnterprise.post('/api/Cv/Cv/ViewAll-careerfields', payload);
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
    const { data } = await apiEnterprise.get(`/job-posts/${id}`);
    return data;
  };
  createRecruitment = async (params: IRecruitment | FormData) => {
    const { data } = await apiEnterprise.post('/job-posts', params);
    return data;
  };

  async sendContact(data: PayloadContact) {
    const res = await apiEnterprise.post('enterprises/contact', data);
    return res.data;
  }

  updateRcruitment = async (id: string, params: IRecruitment | FormData) => {
    const { data } = await apiEnterprise.post(`/job-posts/${id}`, params);
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
