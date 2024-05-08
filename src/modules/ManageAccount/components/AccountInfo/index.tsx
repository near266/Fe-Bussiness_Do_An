import { Form, Input, message, Select } from 'antd';
import { isMatch } from 'lodash-es';

import SrcIcons from '@/assets/icons';
import SrcImages from '@/assets/images';
import FileUploader from '@/components/FileUpload';
import InputStickLabel from '@/components/InputStickLabel';
import TextBoxWithLabel from '@/components/TextBoxWithLabel';
import VerificationInput from '@/components/VetifyInput';
import { registerInstance } from '@/modules/SignUp/shared/api';
import { FORM_DATA_FIELD, GET_OTP_TYPE } from '@/modules/SignUp/shared/enums';
import { GENDER_CODE, SV_RES_STATUS_CODE } from '@/shared/enums/enums';
import { appLibrary } from '@/shared/utils/loading';
import { IRootState, setUserFieldValue } from '@/store';
import clsx from 'clsx';
import Image from 'next/legacy/image';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  accountAPI,
  UpdateAccountInfoPayload,
  UpdateEmailPayload,
  UpdatePasswordPayload,
  UpdatePhoneNumberPayload,
} from '../../shared/api';
import { CHANGE_PHONE_OPTION } from '../../shared/enum';
import { IRepresent } from '@/interfaces/models/IRepresent';
interface IProps {
  accountInfo: IRepresent;
}
const { Option } = Select;
enum ToggleForgotFormOption {
  none = '',
  email = 'email',
  password = 'password',
  phoneNumber = 'phoneNumber',
}
export const AccountInfoForm = ({ accountInfo }: IProps) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm<FORM_DATA_FIELD>();
  const user = useSelector((state: IRootState) => state.auth.me);
  const [currentAccountInfo, setCurrentAccountInfo] = useState<IRepresent>(accountInfo);
  const [showVerify, setShowVerify] = useState(false);
  const [optToken, setOptToken] = useState<string>('');
  const [toggleForgotForm, setToggleForgotForm] = useState<ToggleForgotFormOption>(
    ToggleForgotFormOption.none
  );
  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({ ...currentAccountInfo });
  }, [toggleForgotForm]);

  // handle Password change
  const handlePasswordChange = useCallback(() => {
    form.validateFields();
    const formData = form.getFieldsValue();
    const payload: UpdatePasswordPayload = {
      new_password: formData[FORM_DATA_FIELD.new_password],
      current_password: formData[FORM_DATA_FIELD.password],
      confirmed_password: formData[FORM_DATA_FIELD.confirmed_password],
    };
    if (Object.values(payload).some((value) => !value)) {
      message.error('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    onPasswordChange(payload);
  }, []);
  const onPasswordChange = async (payload: UpdatePasswordPayload) => {
    try {
      appLibrary.showloading();
      const { code } = await accountAPI.updatePassword(payload);
      if (code === SV_RES_STATUS_CODE.success) {
        message.success('Đổi mật khẩu thành công');
        setToggleForgotForm(ToggleForgotFormOption.none);
        form.resetFields([
          FORM_DATA_FIELD.password,
          FORM_DATA_FIELD.new_password,
          FORM_DATA_FIELD.confirmed_password,
        ]);
      }
      appLibrary.hideloading();
    } catch (error) {
      appLibrary.hideloading();

      const { data } = error.response;
      message.error(
        `${Object.values(data?.errors ?? []).join(' - ')}` ?? 'Có lỗi xảy ra'
      );
      return;
    }
  };
  // end handle Password change

  // handle email change

  const handleEmailChange = useCallback(() => {
    form.validateFields();
    const formData = form.getFieldsValue();
    const payload: UpdateEmailPayload = {
      current_password: formData[FORM_DATA_FIELD.password],
      email: formData[FORM_DATA_FIELD.email],
    };
    if (Object.values(payload).some((value) => !value)) {
      message.error('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    if (payload.email === accountInfo.email) {
      message.error('Email mới không được trùng với email cũ');
      return;
    }
    onEmailChange(payload);
  }, []);
  const onEmailChange = async (payload: UpdateEmailPayload) => {
    try {
      appLibrary.showloading();
      const { code } = await accountAPI.updateEmail(payload);
      if (code === SV_RES_STATUS_CODE.success) {
        message.success('Kiểm tra email của bạn để xác nhận thay đổi');
        setToggleForgotForm(ToggleForgotFormOption.none);
        setCurrentAccountInfo({ ...currentAccountInfo, email: payload.email });
        dispatch(setUserFieldValue({ email: payload.email }));
      }
      appLibrary.hideloading();
    } catch (error) {
      appLibrary.hideloading();

      const { data } = error.response;
      message.error(
        `${Object.values(data?.errors ?? []).join(' - ')}` ?? 'Có lỗi xảy ra'
      );
      return;
    }
  };
  // end handle email change

  // @ handle phone number change
  // step 1: validate and get otp - handlePhoneNumberChange + onGetVerifyCode
  // step 2: wait for user to input otp and submit- handleSubmitVerifyCode + onVerifyOtp=> onPhoneNumberChange
  // step 1:
  const handlePhoneNumberChange = useCallback(() => {
    form.validateFields();
    const formData = form.getFieldsValue();
    console.log(formData);
    const payload: UpdatePhoneNumberPayload = {
      current_password: formData[FORM_DATA_FIELD.password],
      phone: formData[FORM_DATA_FIELD.phone],
      type: CHANGE_PHONE_OPTION.CHANGE_REPRESENT_PHONE,
    };
    if (Object.values(payload).some((value) => !value)) {
      message.error('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    if (payload.phone === accountInfo.telephone) {
      message.error('Số điện thoại mới không được trùng với số điện thoại cũ');
      return;
    }

    onGetVerifyCode();
    // onPhoneNumberChange(payload);
  }, []);
  const onGetVerifyCode = useCallback(async () => {
    try {
      appLibrary.showloading();
      const { code, data } = await registerInstance.getOtp(
        form.getFieldValue(FORM_DATA_FIELD.phone),
        GET_OTP_TYPE.CHANGE_REPRESENT_PHONE
      );
      appLibrary.hideloading();

      if (code === SV_RES_STATUS_CODE.success) {
        if (!data.token) {
          return message.error('Lấy mã xác thực thất bại');
        }
        setShowVerify(true);
        setOptToken(data.token);
      }
    } catch (error) {
      appLibrary.hideloading();
      const { data } = error.response;
      message.error(
        `${Object.values(data?.errors ?? []).join(' - ')}` ?? 'Có lỗi xảy ra'
      );
    }
  }, []);
  // step 2:
  const handleSubmitVerifyCode = () => {
    const verify_code = form.getFieldValue(FORM_DATA_FIELD.verify_code);
    if (!verify_code) {
      return message.error('Vui lòng nhập mã xác thực');
    }
    if (verify_code.length !== 6) {
      return message.error('Mã xác thực bao gồm 6 ký tự');
    }
    onVerifyOtp(optToken, verify_code);
  };
  const onVerifyOtp = useCallback(
    async (otpTokenValue: string, userOtpCode: string, type?: string) => {
      try {
        appLibrary.showloading();
        const { code } = await registerInstance.verifyOtp(
          otpTokenValue,
          userOtpCode,
          GET_OTP_TYPE.SIGNUP
        );
        appLibrary.hideloading();

        if (code === SV_RES_STATUS_CODE.success) {
          setShowVerify(false);
          onPhoneNumberChange({
            current_password: form.getFieldValue(FORM_DATA_FIELD.password),
            phone: form.getFieldValue(FORM_DATA_FIELD.phone),
            type: CHANGE_PHONE_OPTION.CHANGE_REPRESENT_PHONE,
          });
          form.setFields([{ name: FORM_DATA_FIELD.verify_code, value: '' }]);
          message.success('Xác thực thành công');
        }
      } catch (error) {
        appLibrary.hideloading();
        const { data } = error.response;
        message.error(
          `${Object.values(data?.errors ?? []).join(' - ')}` ?? 'Có lỗi xảy ra'
        );
      }
    },
    []
  );

  const onPhoneNumberChange = async (payload: UpdatePhoneNumberPayload) => {
    try {
      appLibrary.showloading();
      const { code } = await accountAPI.updatePhoneNumber(payload);
      if (code === SV_RES_STATUS_CODE.success) {
        message.success('Đổi số điện thoại thành công');
        // setToggleForgotForm(ToggleForgotFormOption.none);
      }
      appLibrary.hideloading();
    } catch (error) {
      appLibrary.hideloading();

      const { data } = error.response;
      message.error(
        `${Object.values(data?.errors ?? []).join(' - ')}` ?? 'Có lỗi xảy ra'
      );
      return;
    }
  };

  // handle account info change
  const handleAccountInfoChange = () => {
    form.validateFields([
      FORM_DATA_FIELD.gender_id,
      FORM_DATA_FIELD.first_name,
      FORM_DATA_FIELD.last_name,
      FORM_DATA_FIELD.address,
    ]);

    const formData = form.getFieldsValue();
    const payload: UpdateAccountInfoPayload = {
      address: formData[FORM_DATA_FIELD.address],
      first_name: formData[FORM_DATA_FIELD.first_name],
      gender_id: formData[FORM_DATA_FIELD.gender_id],
      last_name: formData[FORM_DATA_FIELD.last_name],
    };
    if (Object.values(payload).some((value) => !value)) {
      message.error('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    const { avatar } = form.getFieldsValue([FORM_DATA_FIELD.avatar]);
    // if both avatar and account info are not changed then show message else update which is changed
    if (isMatch(accountInfo, payload) && isMatch(accountInfo.avatar, avatar)) {
      return message.warning('Không có thông tin nào thay đổi');
    }
    if (!isMatch(accountInfo, payload)) {
      onAccountInfoChange(payload);
    }
    if (!isMatch(accountInfo.avatar, avatar)) {
      onUpdateAvatar();
    }
  };
  const onAccountInfoChange = async (payload: UpdateAccountInfoPayload) => {
    try {
      appLibrary.showloading();
      const { code } = await accountAPI.updateAccountInfo(payload);
      if (code === SV_RES_STATUS_CODE.success) {
        message.success('Cập nhật thông tin thành công');
        // setToggleForgotForm(ToggleForgotFormOption.none);
      }
      appLibrary.hideloading();
    } catch (error) {
      appLibrary.hideloading();

      const { data } = error.response;
      message.error(
        `${Object.values(data?.errors ?? []).join(' - ')}` ?? 'Có lỗi xảy ra'
      );
      return;
    }
  };

  const onUpdateAvatar = async () => {
    const formData = new FormData();
    const { avatar } = form.getFieldsValue([FORM_DATA_FIELD.avatar]);
    formData.append('avatar', avatar?.file?.originFileObj ?? avatar);
    try {
      appLibrary.showloading();
      const { code, data } = await accountAPI.updateAvatar(formData);
      if (code === SV_RES_STATUS_CODE.success) {
        // update avatar in redux
        dispatch(
          setUserFieldValue({
            avatar: data?.url,
          })
        );
        message.success('Cập nhật ảnh đại diện thành công');
      }
      appLibrary.hideloading();
    } catch (error) {
      appLibrary.hideloading();
      const { data } = error?.response ?? {};
      message.error(
        `${Object.values(data?.errors ?? []).join(' - ')}` ?? 'Có lỗi xảy ra'
      );
      return;
    }
  };
  // end handle phone number change
  return (
    <>
      <div className="account-info">
        <Form
          form={form}
          name="basic"
          autoComplete="off"
          className="flex flex-col gap-[8px]"
        >
          {toggleForgotForm === ToggleForgotFormOption.none && (
            <div className="grid grid-flow-col">
              <div className="form-input col-span-8 flex flex-col gap-4">
                <h3 className="font-[500] text-[#171725] text-[24px] leading-[32px]">
                  Thông tin tài khoản
                </h3>

                <div className="flex flex-col gap-3">
                  <div>
                    <div className="relative">
                      <Form.Item
                        name={FORM_DATA_FIELD.email}
                        className="w-full"
                        rules={[
                          { required: true, message: 'Email không được bỏ trống!' },
                        ]}
                      >
                        <InputStickLabel
                          disabled
                          name={FORM_DATA_FIELD.email}
                          label={
                            <p className="font-[400] text-[16px] leading-[24px] text-[#44444F]">
                              Gmail
                            </p>
                          }
                          placeholder="Email"
                          inputType="email"
                        />
                      </Form.Item>
                      <div className="absolute top-[43px] right-[10px]">
                        {accountInfo.email_verified ? (
                          <div className="flex ">
                            <p className="text-[14px] text-[#30AB7E]">Đã xác minh</p>
                            &nbsp;&nbsp;
                            <Image
                              onClick={() =>
                                setToggleForgotForm(ToggleForgotFormOption.email)
                              }
                              className="cursor-pointer"
                              width={18}
                              height={18}
                              objectFit="contain"
                              src={SrcIcons.sideBarPen}
                              alt="Eztek Doanh nghiệp"
                            />
                          </div>
                        ) : (
                          <p
                            className="text-[14px] underline text-primary cursor-pointer"
                            onClick={() => {}}
                          >
                            Lấy mã xác thực
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="font-[400] text-[16px] leading-[24px] text-[#44444F]">
                      Mật khẩu
                    </p>
                    <Form.Item
                      rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
                    >
                      <Input.Password
                        size="large"
                        className="py-[9px]"
                        placeholder="*************"
                        disabled
                        autoComplete="new-password"
                      />
                    </Form.Item>
                    <p
                      className="text-[14px] text-[#22216D] mt-2 cursor-pointer"
                      onClick={() => setToggleForgotForm(ToggleForgotFormOption.password)}
                    >
                      Đổi mật khẩu
                    </p>
                  </div>
                </div>

                <h3 className="font-[500] text-[#171725] text-[24px] leading-[32px]">
                  Thông tin liên hệ
                </h3>
                <div className="flex gap-2">
                  <Form.Item
                    name={FORM_DATA_FIELD.first_name}
                    className="w-full"
                    rules={[{ required: true, message: 'Tên không được bỏ trống!' }]}
                  >
                    <TextBoxWithLabel
                      name={FORM_DATA_FIELD.first_name}
                      label="Tên của bạn"
                      onChange={(event) => {
                        form.setFields([
                          { name: FORM_DATA_FIELD.first_name, value: event.target.value },
                        ]);
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    name={FORM_DATA_FIELD.last_name}
                    className="w-full"
                    rules={[
                      { required: true, message: 'Họ và tên đệm không được bỏ trống!' },
                    ]}
                  >
                    <TextBoxWithLabel
                      name={FORM_DATA_FIELD.last_name}
                      label="Họ và tên đệm"
                      onChange={(event) => {
                        form.setFields([
                          { name: FORM_DATA_FIELD.last_name, value: event.target.value },
                        ]);
                      }}
                    />
                  </Form.Item>
                </div>

                <div className="flex flex-row gap-4">
                  <div className="flex flex-col w-full ">
                    {/* phone_number */}
                    <div className="relative">
                      <Form.Item
                        name={FORM_DATA_FIELD.phone}
                        className="w-full"
                        rules={[
                          {
                            required: true,
                            message: 'Số điện thoại không được bỏ trống!',
                          },
                          {
                            type: 'string',
                            pattern: /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/,
                            warningOnly: true,
                            message: 'Số điện thoại không hợp lệ!',
                          },
                          {
                            type: 'string',
                            min: 10,
                            message: 'Số điện thoại phải bao gồm 10 số!',
                          },
                        ]}
                      >
                        <InputStickLabel
                          disabled
                          name={FORM_DATA_FIELD.phone}
                          label={
                            <p className="font-[400] text-[16px] leading-[24px] text-[#44444F]">
                              Số điện thoại
                            </p>
                          }
                          placeholder="Nhập số điện thoại của bạn"
                          inputType="number"
                        />
                      </Form.Item>
                      <div className="absolute top-[46px] right-[21px]">
                        {true ? (
                          <div className="flex ">
                            <p className="text-[14px] text-[#30AB7E]">Đã xác minh</p>
                            &nbsp;&nbsp;
                            <Image
                              onClick={() =>
                                setToggleForgotForm(ToggleForgotFormOption.phoneNumber)
                              }
                              className="cursor-pointer"
                              width={18}
                              height={18}
                              objectFit="contain"
                              src={SrcIcons.sideBarPen}
                              alt="Eztek Doanh nghiệp"
                            />
                          </div>
                        ) : (
                          <p
                            className="text-[14px] underline text-primary cursor-pointer"
                            onClick={() => {}}
                          >
                            Lấy mã xác thực
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col w-1/3 ">
                    <label
                      htmlFor=""
                      className="block mb-[9px] text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      <p className="font-[400] text-[16px] leading-[24px] text-[#44444F]">
                        Giới tính
                      </p>
                    </label>
                    <Form.Item
                      name={FORM_DATA_FIELD.gender_id}
                      className="w-full"
                      rules={[
                        { required: true, message: 'Giới tính không được bỏ trống!' },
                      ]}
                    >
                      <Select
                        placeholder="Chọn giới tính"
                        size="large"
                        bordered={false}
                        className="border-[2px] border-solid  border-gray-300 text-gray-900 text-sm rounded-lg focus:border-[#22216D] block w-full"
                        onChange={(value) => {
                          if (value in GENDER_CODE) {
                            form.setFields([
                              { name: FORM_DATA_FIELD.gender_id, value: value },
                            ]);
                          }
                        }}
                      >
                        <Option value={GENDER_CODE.male}>Nam</Option>
                        <Option value={GENDER_CODE.female}>Nữ</Option>
                      </Select>
                    </Form.Item>
                  </div>

                  <div className="flex flex-col w-full ">
                    <Form.Item
                      name={FORM_DATA_FIELD.address}
                      className="w-full"
                      rules={[
                        { required: true, message: 'Địa chỉ không được bỏ trống!' },
                      ]}
                    >
                      <InputStickLabel
                        name={FORM_DATA_FIELD.address}
                        label={
                          <p className="font-[400] text-[16px] leading-[24px] text-[#44444F]">
                            Vị trí
                          </p>
                        }
                        placeholder="Địa chỉ..."
                      />
                    </Form.Item>
                  </div>
                </div>
                <button
                  type="button"
                  className={'primary-button mt-5 !mr-auto !ml-0'}
                  onClick={handleAccountInfoChange}
                >
                  Lưu thay đổi
                </button>
              </div>
              <div className="form-input col-span-4 flex justify-center mx-auto items-center">
                <Form.Item
                  name={FORM_DATA_FIELD.avatar}
                  className="w-full"
                  rules={[
                    { required: true, message: 'Ảnh đại diện không được bỏ trống!' },
                  ]}
                >
                  <FileUploader
                    defaultImage={accountInfo.avatar}
                    className="flex flex-col"
                    customButton={
                      <p className="!mt-[50px] underline text-[#403ECC] text-[16px]">
                        Chỉnh sửa hình ảnh đại diện
                      </p>
                    }
                  />
                </Form.Item>
              </div>
            </div>
          )}
          {/* form update password/phone/email */}
          <div className="grid grid-cols-2">
            {toggleForgotForm === ToggleForgotFormOption.email && (
              <div className="form-input w-full flex flex-col gap-4 mb-[100px] mt-5">
                <button
                  className="primary-button !ml-0 !mr-auto"
                  type="button"
                  onClick={() => setToggleForgotForm(ToggleForgotFormOption.none)}
                >
                  Quay lại
                </button>
                <div className="flex flex-col gap-4">
                  <h3 className="font-[500] text-[#171725] text-[24px] leading-[32px]">
                    Thay đổi gmail
                  </h3>
                  <div>
                    <Form.Item
                      name={FORM_DATA_FIELD.email}
                      rules={[
                        {
                          required: true,
                          message: 'Email không được bỏ trống!',
                        },
                        {
                          type: 'email',
                          pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                          message: 'Email không đúng định dạng!',
                        },

                        {
                          validator: (rule, value) => {
                            if (value === accountInfo.email) {
                              return Promise.reject(
                                'Mật khẩu không được giống email cũ!'
                              );
                            }
                            return Promise.resolve();
                          },
                        },
                      ]}
                    >
                      <InputStickLabel
                        name={FORM_DATA_FIELD.email}
                        label={
                          <p className="font-[400] text-[16px] leading-[24px] text-[#44444F]">
                            Email
                          </p>
                        }
                        placeholder="Email"
                        inputType="email"
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="font-[400] text-[16px] leading-[24px] text-[#44444F]">
                      Mật khẩu hiện tại
                    </p>
                    <Form.Item
                      name={FORM_DATA_FIELD.password}
                      rules={[
                        {
                          required: true,
                          message: 'Mật khẩu không được bỏ trống!',
                        },
                        {
                          min: 8,
                          message: 'Mật khẩu phải có ít nhất 8 ký tự!',
                        },
                      ]}
                    >
                      <Input.Password
                        size="large"
                        className="py-[9px]"
                        placeholder="Mật khẩu"
                      />
                    </Form.Item>
                  </div>
                </div>

                <button
                  type="button"
                  className={'primary-button mt-5 !mr-auto !ml-0'}
                  onClick={handleEmailChange}
                >
                  Lưu thay đổi
                </button>
              </div>
            )}
            {toggleForgotForm === ToggleForgotFormOption.password && (
              <div className="form-input w-full flex flex-col gap-4 mb-[100px] mt-5">
                <button
                  className="primary-button !ml-0 !mr-auto"
                  type="button"
                  onClick={() => setToggleForgotForm(ToggleForgotFormOption.none)}
                >
                  Quay lại
                </button>
                <div className="flex flex-col gap-4">
                  <h3 className="font-[500] text-[#171725] text-[24px] leading-[32px]">
                    Thay đổi mật khẩu đăng nhập
                  </h3>
                  <div>
                    <p className="font-[400] text-[16px] leading-[24px] text-[#44444F]">
                      Mật khẩu hiện tại
                    </p>
                    <Form.Item
                      name={FORM_DATA_FIELD.password}
                      hasFeedback
                      rules={[
                        {
                          required: true,
                          message: 'Mật khẩu không được bỏ trống!',
                        },
                        {
                          min: 8,
                          message: 'Mật khẩu phải có ít nhất 8 ký tự!',
                        },
                      ]}
                    >
                      <Input.Password
                        size="large"
                        className="py-[9px]"
                        placeholder="Mật khẩu"
                      />
                    </Form.Item>
                  </div>
                  <div>
                    <p className="font-[400] text-[16px] leading-[24px] text-[#44444F]">
                      Mật khẩu mới
                    </p>
                    <Form.Item
                      name={FORM_DATA_FIELD.new_password}
                      dependencies={[FORM_DATA_FIELD.password]}
                      hasFeedback
                      rules={[
                        {
                          required: true,
                          message: 'Mật khẩu không được bỏ trống!',
                        },
                        {
                          min: 8,
                          message: 'Mật khẩu phải có ít nhất 8 ký tự!',
                        },
                        {
                          validator: (rule, value) => {
                            if (value === form.getFieldValue(FORM_DATA_FIELD.password)) {
                              return Promise.reject(
                                'Mật khẩu không được giống mật khẩu cũ!'
                              );
                            }
                            return Promise.resolve();
                          },
                        },
                      ]}
                    >
                      <Input.Password
                        size="large"
                        className="py-[9px]"
                        placeholder="Mật khẩu"
                      />
                    </Form.Item>
                  </div>
                  <div>
                    <p className="font-[400] text-[16px] leading-[24px] text-[#44444F]">
                      Nhập lại mật khẩu mới
                    </p>
                    <Form.Item
                      name={FORM_DATA_FIELD.confirmed_password}
                      dependencies={[FORM_DATA_FIELD.new_password]}
                      hasFeedback
                      rules={[
                        {
                          required: true,
                          message: 'Xác nhận mật khẩu không được bỏ trống!',
                        },
                        {
                          min: 8,
                          message: 'Mật khẩu phải có ít nhất 8 ký tự!',
                        },
                        // validate match password
                        {
                          validator: (rule, value) => {
                            if (
                              value !== form.getFieldValue(FORM_DATA_FIELD.new_password)
                            ) {
                              return Promise.reject('Mật khẩu không khớp!');
                            }
                            return Promise.resolve();
                          },
                        },
                      ]}
                    >
                      <Input.Password
                        size="large"
                        className="py-[9px]"
                        placeholder="Mật khẩu"
                      />
                    </Form.Item>
                  </div>
                </div>
                <button
                  type="button"
                  className={'primary-button mt-5 !mr-auto !ml-0'}
                  onClick={handlePasswordChange}
                >
                  Lưu thay đổi
                </button>
              </div>
            )}
            {toggleForgotForm === ToggleForgotFormOption.phoneNumber && (
              <div className="form-input w-full flex flex-col gap-4 mb-[100px] mt-5">
                <button
                  className="primary-button !ml-0 !mr-auto"
                  type="button"
                  onClick={() => setToggleForgotForm(ToggleForgotFormOption.none)}
                >
                  Quay lại
                </button>
                <div className="flex flex-col gap-4">
                  <h3 className="font-[500] text-[#171725] text-[24px] leading-[32px]">
                    Thay đổi số điện thoại
                  </h3>
                  <div>
                    <Form.Item
                      name={FORM_DATA_FIELD.phone}
                      hasFeedback
                      rules={[
                        {
                          required: true,
                          message: 'Số điện thoại không được bỏ trống!',
                        },
                        {
                          type: 'string',
                          pattern: /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/,
                          warningOnly: true,
                          message: 'Số điện thoại không hợp lệ!',
                        },
                        {
                          type: 'string',
                          min: 10,
                          message: 'Số điện thoại phải bao gồm 10 số!',
                        },
                        {
                          validator: (rule, value) => {
                            if (value === accountInfo.telephone) {
                              return Promise.reject(
                                'Số điện thoại không được giống email cũ!'
                              );
                            }
                            return Promise.resolve();
                          },
                        },
                      ]}
                    >
                      <InputStickLabel
                        name={FORM_DATA_FIELD.phone}
                        label={
                          <p className="font-[400] text-[16px] leading-[24px] text-[#44444F]">
                            Số điện thoại
                          </p>
                        }
                        placeholder="Số điện thoại"
                        inputType="number"
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="font-[400] text-[16px] leading-[24px] text-[#44444F]">
                      Mật khẩu hiện tại
                    </p>
                    <Form.Item
                      name={FORM_DATA_FIELD.password}
                      rules={[
                        {
                          required: true,
                          message: 'Mật khẩu không được bỏ trống!',
                        },
                        {
                          min: 8,
                          message: 'Mật khẩu phải có ít nhất 8 ký tự!',
                        },
                      ]}
                    >
                      <Input.Password
                        size="large"
                        className="py-[9px]"
                        placeholder="Mật khẩu"
                      />
                    </Form.Item>
                  </div>
                </div>

                <button
                  type="button"
                  className={'primary-button mt-5 !mr-auto !ml-0'}
                  onClick={handlePhoneNumberChange}
                >
                  Lưu thay đổi
                </button>
              </div>
            )}

            {/* right side image */}
            <div className="relative w-full form-input flex justify-center mx-auto items-center">
              <Image
                layout="fill"
                objectFit="contain"
                src={SrcImages.forgotPassword}
                alt="Eztek Doanh nghiệp"
              />
            </div>
          </div>
          {/* opt input */}
          {showVerify && (
            <div
              tabIndex={-1}
              className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 md:inset-0 h-modal md:h-full bg-[#1d1d1d1f] "
            >
              <div className="relative p-4 w-full max-w-[45rem] h-full md:h-auto top-1/2 -translate-y-1/2 m-auto">
                <div className="flex flex-col gap-4 relative bg-white rounded-lg shadow text-center p-8">
                  <h3 className="mb-5 text-lg leading-[34px] text-[24px] text-[#171725] font-[600]">
                    Xác thực số điện thoại
                  </h3>
                  <p className="text-[#44444F] font-normal text-[16px]">
                    Mã OTP đã gửi về số điện thoại{' '}
                    <strong>{form.getFieldValue(FORM_DATA_FIELD.phone)}</strong>.
                    <br /> Vui lòng nhập mã vào ô bên dưới để được xác thực số điện thoại.
                  </p>
                  <p className="text-[#44444F] font-normal text-[16px]">
                    Bạn chưa nhận được mã OTP ?&nbsp;
                    <strong className="text-[#403ECC]">Gửi lại mã</strong>.
                  </p>
                  <div className="mt-5">
                    <Form.Item
                      name={FORM_DATA_FIELD.verify_code}
                      required
                      rules={[
                        {
                          message: '',
                        },
                      ]}
                    >
                      <VerificationInput />
                    </Form.Item>
                  </div>
                  <div className="flex">
                    <button
                      type="button"
                      className={clsx(
                        'primary-button mt-5 !ml-0 mr-auto !bg-transparent !text-[#403ECC]'
                      )}
                      onClick={() => {
                        setShowVerify(false);
                      }}
                    >
                      Hủy
                    </button>
                    <button
                      type="button"
                      className={clsx('primary-button mt-5', false && '!bg-[#696974]')}
                      onClick={() => {
                        handleSubmitVerifyCode();
                      }}
                    >
                      Xác nhận
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Form>
      </div>
    </>
  );
};
