import SrcImages from '@/assets/images';
import TextBoxWithLabel from '@/components/TextBoxWithLabel';
import { FORM_DATA_FIELD } from '@/modules/SignUp/shared/enums';
import { SV_RES_STATUS_CODE } from '@/shared/enums/enums';
import { redirectToAdmin } from '@/shared/utils/common';
import { appLibrary } from '@/shared/utils/loading';
import { IRootState } from '@/store';
import { Checkbox, Form, message } from 'antd';
import clsx from 'clsx';
import { setCookie } from 'cookies-next';
import Image from 'next/legacy/image';
import Link from 'next/link';

import { useEffect, useState } from 'react';
import { loginInstance, LoginResponse, TokenPair } from '../shared/api';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from '@reduxjs/toolkit';
import { ThunkDispatch } from 'redux-thunk';
import userLogin from '@/shared/services/userLogin';
import { useRouter } from 'next/router';

const LoginModule = () => {
  const [form] = Form.useForm();
  const handleLogin = async () => {
    const { email, password, remember_me } = form.getFieldsValue();
    if (!email || !password) {
      message.warning('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    onLogin(email, password, remember_me);
  };
  const router = useRouter();
  const dispatch = useDispatch();
  const handleRouting = () => {
    router.push('/admin');
  };
  const onLogin = async (
    email: FORM_DATA_FIELD.email,
    password: FORM_DATA_FIELD.password,
    remember_me: boolean
  ) => {
    try {
      appLibrary.showloading();
      const thunkDispatch: ThunkDispatch<any, any, AnyAction> = dispatch;

      thunkDispatch(userLogin({ email, password }));

      appLibrary.hideloading();
      handleRouting();
    } catch (error) {
      appLibrary.hideloading();
      message.error(error?.response?.data?.error ?? 'Đăng nhập thất bại');
    }
  };

  const onAllStepComplete = () => {};

  return (
    <div className="grid grid-cols-2 h-full m-auto max-w-[1310px] bg-white shadow-[3px_-5px_40px_rgba(205,205,212,0.1)] rounded-[20px] overflow-hidden">
      <div className="relative min-h-[645px] h-full w-full">
        <Image
          src={SrcImages.sideImage}
          alt="Youth"
          layout="fill"
          objectFit="fill"
          priority
        />
      </div>
      <div className="w-full">
        <div className="px-[27px] py-[36px] h-full flex flex-col">
          <Form
            className="w-full flex flex-col"
            onFinish={onAllStepComplete}
            form={form}
            autoComplete="off"
          >
            <div className="form-title mt-6">
              <h1 className="font-semibold text-3xl leading-[39px] text-gray-900">
                Đăng nhập tài khoản
              </h1>
              <p className="text-[#696974] max-w-[467px] leading-[26px] font-[16px] mt-4">
                Để tìm kiếm ứng viên phù hợp nhất cho doanh nghiệp, vui lòng điền thông
                tin dưới đây
              </p>
            </div>
            <div className="steps-content mt-2">
              <div className="flex flex-col gap-4 mt-5">
                <Form.Item
                  name="email"
                  className="w-full"
                  required
                  rules={[
                    {
                      required: true,
                      message: 'Email không được để trống',
                    },
                  ]}
                >
                  <TextBoxWithLabel name="email" label="Tên đăng nhập" />
                </Form.Item>
                <Form.Item
                  name="password"
                  className="w-full"
                  required
                  rules={[
                    {
                      required: true,
                      message: 'Mật khẩu không được để trống',
                    },
                  ]}
                >
                  <TextBoxWithLabel
                    name="password"
                    label="Mật khẩu"
                    inputType="password"
                  />
                </Form.Item>

                <div className="flex justify-between">
                  <Form.Item name={FORM_DATA_FIELD.remember_me}>
                    <Checkbox
                      onChange={(value) => {
                        form.setFields([
                          {
                            name: FORM_DATA_FIELD.remember_me,
                            value: value.target.checked,
                          },
                        ]);
                        console.log(form);
                      }}
                    >
                      <p className="font-light text-[16px] leading-[26px] text-gray-700">
                        Ghi nhớ đăng nhập
                      </p>
                    </Checkbox>
                  </Form.Item>
                  <Link href="/" legacyBehavior>
                    <span className="text-[#403ECC] hover:!text-[#403ECC]">
                      Quên mật khẩu
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </Form>
          <div className="steps-action flex m-auto mt-0">
            <button className={clsx('primary-button mt-5')} onClick={() => handleLogin()}>
              Đăng nhập
            </button>
          </div>
          <div className="m-auto text-center">
            <p className="text-[#696974] max-w-[467px] leading-[26px] font-[16px] mt-4">
              Bạn chưa có tài khoản?
            </p>
            <Link href="/sign-up" legacyBehavior>
              <span className="text-[#403ECC] hover:!text-[#403ECC]">Đăng ký</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModule;
export const config = {
  runtime: 'experimental-edge',
};
