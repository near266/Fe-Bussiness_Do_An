import { FORM_DATA_FIELD, GET_OTP_TYPE } from '@/modules/SignUp/shared/enums';
import { apiEnterprise } from '@/shared/axios/apiv3';
export type RegisterPayload = {
  last_name: string;
  first_name: string;
  phone: string;
  gender_id: number;
  address: string;
  enterprise_name: string;
  city_id: number;
  district_id: number;
  email: string;
  password: string;
  confirmed_password: string;
  receive_news: true;
};

class Register {
  async registerAccount(payload: RegisterPayload) {
    const res = await apiEnterprise.post('/register', payload);
    return res.data;
  }

  async getOtp(phone: FORM_DATA_FIELD.phone, type: GET_OTP_TYPE) {
    const res = await apiEnterprise.get(`/otp?phone=${phone}&type=${type}`);
    return res.data;
  }

  async verifyOtp(token: string, code: string, type: GET_OTP_TYPE) {
    const res = await apiEnterprise.get(
      `/otp/verify?token=${token}&code=${code}&type=${type}`
    );
    return res.data;
  }
}
export const registerInstance = new Register();
