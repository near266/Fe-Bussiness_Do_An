import { JOBS_STATUS } from './enum';

export type TJobs = {
  id: string | number;
  name: string;
  avatar: string;
  represent: string;
  email: string;
  plan: string;
  created_at: string;
  status: JOBS_STATUS;
};
