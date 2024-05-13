import { ScaleId } from '@/interfaces/models/IRecruitment';
import { FORM_DATA_FIELD } from '@/modules/SignUp/shared/enums';
import { axiosInstanceV2 } from '@/shared/axios';
import { apiEnterprise } from '@/shared/axios/apiv3';
import { GENDER_CODE } from '@/shared/enums/enums';
import axios from 'axios';
import { CHANGE_PHONE_OPTION } from './enum';

export type UpdatePasswordPayload = {
  userName: string;
  oldPass: FORM_DATA_FIELD.password;
  password: FORM_DATA_FIELD.new_password;
  confirmPassword: FORM_DATA_FIELD.confirmPassword;
};

export type UpdatePhoneNumberPayload = {
  current_password: FORM_DATA_FIELD.password;
  phone: FORM_DATA_FIELD.phone;
  type: CHANGE_PHONE_OPTION;
};

export type UpdateEmailPayload = {
  current_password: string;
  email: string;
};

export type UpdateAccountInfoPayload = {
  id: string;
  name: string;
  gender_id: GENDER_CODE;
  address: string;
};
export type UpdateEnterpriseInfoPayload = {
  id: string;
  enterprise_name: string;
  abbreviation_name: string;
  scale_id: ScaleId;
  city_id: string;
  district_id: string;
  ward_id: string;
  address: string;
  career_field_id: number;
  website_url: string;
  introduce: string;
  phone: string;
};
export type DetailEnterprise = {
  id: string;
};
class AccountAPI {
  async getEnterpriseLicense() {
    const res = await apiEnterprise.get('enterprises/account/business-license');
    return res.data;
  }

  async postEnterpriseLicense(data) {
    const res = await apiEnterprise.post('enterprises/account/business-license', data);
    return res.data;
  }

  async fetchProvinces() {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_PROVINCES_API_URL}/p/`);
    return res.data;
  }

  async fetchDistricts(provinceCode: number) {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_PROVINCES_API_URL}/p/${provinceCode}?depth=2`
    );
    return res.data;
  }

  async fetchWards(districtCode: number) {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_PROVINCES_API_URL}/d/${districtCode}?depth=2`
    );
    return res.data;
  }
  // update Enterprise
  async updateEnterpriseInfo(payload: UpdateEnterpriseInfoPayload) {
    const res = await apiEnterprise.put('/api/UserInfo/Enterprise/Update', payload);
    return res.data;
  }
  // update Account
  async updatePassword(payload: UpdatePasswordPayload) {
    const res = await apiEnterprise.post('/api/User/reset-password', payload);
    return res.data;
  }

  async updatePhoneNumber(payload: UpdatePhoneNumberPayload) {
    const res = await apiEnterprise.put('enterprises/account/phone', payload);
    return res.data;
  }

  async updateEmail(payload: UpdateEmailPayload) {
    const res = await apiEnterprise.put('enterprises/account/email', payload);
    return res.data;
  }

  async updateAccountInfo(payload: UpdateAccountInfoPayload) {
    const res = await apiEnterprise.put(
      '/api/UserInfo/Enterprise/Update-AccountInfo',
      payload
    );
    return res.data;
  }
  async getUrlCDN(url) {
    const res = await apiEnterprise.get(`${url}`);
    return res.data;
  }
  async updateAvatar(payload: FormData | string) {
    const res = await apiEnterprise.post('/api/Upload/uploadV2', payload);
    return res.data;
  }

  async getStatus() {
    const res = await apiEnterprise.get('enterprises/status');
    return res.data;
  }
  async getEnterpriseById(payload: DetailEnterprise) {
    const res = await apiEnterprise.post('/api/UserInfo/Enterprise/Detail', payload);
    return res.data;
  }
}

export const accountAPI = new AccountAPI();
