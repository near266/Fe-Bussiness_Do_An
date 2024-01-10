import { FORM_DATA_FIELD } from '@/modules/SignUp/shared/enums';
import { axiosInstanceV2 } from '@/shared/axios';

export type LoginResponse = {
  access_token: string;
  refresh_token: string;
  access_token_expires_in: number;
  refresh_token_expires_in: number;
  secure: boolean;
  domain: string;
};

export enum TokenPair {
  access_token = 'access_token',
  refresh_token = 'refresh_token',
  secure = 'secure',
}
class Login {
  async login(
    email: FORM_DATA_FIELD.email,
    password: FORM_DATA_FIELD.password,
    remember_me = false
  ) {
    const res = await axiosInstanceV2.post(
      `${process.env.NEXT_PUBLIC_API_URL_V2}/enterprise/login`,
      {
        email,
        password,
        remember_me,
      }
    );
    return res.data;
  }
}
export const loginInstance = new Login();
