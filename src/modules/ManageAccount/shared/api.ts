import { ScaleId } from '@/interfaces/models/IRecruitment';
import { FORM_DATA_FIELD } from '@/modules/SignUp/shared/enums';
import { axiosInstanceV2 } from '@/shared/axios';
import { apiEnterprise } from '@/shared/axios/apiv3';
import { GENDER_CODE } from '@/shared/enums/enums';
import axios from 'axios';
import { CHANGE_PHONE_OPTION } from './enum';

export type UpdatePasswordPayload = {
  current_password: FORM_DATA_FIELD.password;
  new_password: FORM_DATA_FIELD.new_password;
  confirmed_password: FORM_DATA_FIELD.confirmed_password;
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
  first_name: string;
  last_name: string;
  gender_id: GENDER_CODE;
  address: string;
};
export type UpdateEnterpriseInfoPayload = {
  enterprise_name: string;
  abbreviation_name: string;
  scale_id: ScaleId;
  city_id: number;
  district_id: number;
  ward_id: number;
  address: string;
  career_field_id: number;
  website_url: string;
  enterprise_introduce: string;
  phone: string;
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
    const res = await apiEnterprise.put('enterprises/info', payload);
    return res.data;
  }
  // update Account
  async updatePassword(payload: UpdatePasswordPayload) {
    const res = await apiEnterprise.put('enterprises/account/password', payload);
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
    const res = await apiEnterprise.put('enterprises/account/info', payload);
    return res.data;
  }

  async updateAvatar(payload: FormData | string) {
    const res = await apiEnterprise.post('enterprises/account/avatar', payload);
    return res.data;
  }

  async getStatus() {
    const res = await apiEnterprise.get('enterprises/status');
    return res.data;
  }
}

export const accountAPI = new AccountAPI();
