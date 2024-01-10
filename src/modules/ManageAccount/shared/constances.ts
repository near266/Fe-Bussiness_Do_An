import { JOBS_STATUS, JOBS_STATUS_NUMERIC } from './enum';

export const JOB_STATUS_OPTION = [
  {
    key: 0,
    value: JOBS_STATUS_NUMERIC.APPROVED,
    label: JOBS_STATUS.APPROVED,
  },
  {
    key: 1,
    value: JOBS_STATUS_NUMERIC.PENDING,
    label: JOBS_STATUS.PENDING,
  },
  {
    key: 2,
    value: JOBS_STATUS_NUMERIC.REJECTED,
    label: JOBS_STATUS.REJECTED,
  },
];
