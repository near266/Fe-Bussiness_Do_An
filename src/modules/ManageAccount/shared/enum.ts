type AllValuesOf<T extends object> = T[keyof T];

export function convertOption(obj) {
  return Object.keys(obj).map((key) => {
    return { key: obj[key].key, value: obj[key].key, label: obj[key].label };
  });
}

export enum JOBS_STATUS {
  PENDING = 'Đang chờ duyệt',
  APPROVED = 'Đã duyệt',
  REJECTED = 'Từ chối',
}

export enum JOBS_STATUS_NUMERIC {
  PENDING = 1,
  APPROVED = 2,
  REJECTED = 3,
}

export enum CHANGE_PHONE_OPTION {
  SIGNUP = 1,
  CHANGE_ENTERPRISE_PHONE = 2,
  CHANGE_REPRESENT_PHONE = 3,
}

export const SCALE = {
  SCALE_1: { key: 1, name: '0 - 25', label: '0 - 25' },
  SCALE_2: { key: 3, name: '25 - 50', label: '25 - 50' },
  SCALE_3: { key: 2, name: '50 - 100', label: '50 - 100' },
  SCALE_4: { key: 4, name: '100 - 200', label: '100 - 200' },
  SCALE_5: { key: 5, name: 'Trên 200', label: 'Trên 200' },
};

export type SCALE_LABEL = AllValuesOf<typeof SCALE>['label'];
export type SCALE_KEY = AllValuesOf<typeof SCALE>['key'];
