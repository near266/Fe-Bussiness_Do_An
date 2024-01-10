import SrcImages from '@/assets/images';
import InputStickLabel from '@/components/InputStickLabel';
import TextBoxWithLabel from '@/components/TextBoxWithLabel';
import { GENDER_CODE, SV_RES_STATUS_CODE } from '@/shared/enums/enums';
import { IDistrict, IProvinces, provinceService } from '@/shared/services/provinces';
import { appLibrary } from '@/shared/utils/loading';
import { Checkbox, Form, message, Select } from 'antd';
import clsx from 'clsx';
import dynamic from 'next/dynamic';
import Image from 'next/legacy/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ProgressBar } from '../components/ProgressBar';
import { registerInstance, RegisterPayload } from '../shared/api';
import { FORM_DATA_FIELD, GET_OTP_TYPE } from '../shared/enums';
import autoAnimate from '@formkit/auto-animate';

const VerificationInput = dynamic(() => import('@/components/VetifyInput'), {
  ssr: false,
});
const steps = [
  { id: 0, label: 'QUY ĐỊNH' },
  { id: 1, label: 'THÔNG TIN DOANH NGHIỆP' },
  { id: 2, label: 'THÔNG TIN TÀI KHOẢN' },
  { id: 3, label: 'XÁC NHẬN' },
];
const { Option } = Select;

const StepAgreePolicy = ({ form }) => {
  return (
    <>
      <div className="flex flex-col h-full mt-4 gap-4">
        <p className="font-light text-[16px] leading-[26px] text-gray-800">
          Để đảm bảo chất lượng dịch vụ, Youth+ không cho phép một người dùng tạo nhiều
          tài khoản khác nhau.
          <br /> Nếu phát hiện vi phạm, Youth+ sẽ ngừng cung cấp dịch vụ tới tất cả các
          tài khoản trùng lặp hoặc chặn toàn bộ truy cập tới hệ thống website của Youth+.
          <br /> Đối với trường hợp khách hàng đã sử dụng hết 3 tin tuyển dụng miễn phí,
          Youth+ hỗ trợ kích hoạt đăng tin tuyển dụng không giới hạn sau khi quý doanh
          nghiệp cung cấp thông tin giấy phép kinh doanh.
        </p>
        <Form.Item name={'agree_policy'}>
          <Checkbox
            onChange={(value) => {
              form.setFields([{ name: 'agree_policy', value: value.target.checked }]);
            }}
          >
            <p className="font-light text-[16px] leading-[26px] text-gray-700">
              Tôi đồng ý với các quy định trên
            </p>
          </Checkbox>
        </Form.Item>
      </div>
    </>
  );
};
const StepEnterpriseInfo = ({ form }) => {
  const [showVerify, setShowVerify] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [provinces, setProvinces] = useState<IProvinces[]>([]);
  const [districts, setDistricts] = useState<IDistrict[]>([]);
  const [optToken, setOptToken] = useState<string>('');
  const getProvincesData = useCallback(async () => {
    const res = await provinceService.fetchProvinces();
    if (res) {
      setProvinces([...res]);
    }
  }, []);
  useEffect(() => {
    !provinces.length && getProvincesData();
  }, []);
  const onGetVerifyCode = useCallback(async () => {
    try {
      appLibrary.showloading();
      const { code, data } = await registerInstance.getOtp(
        form.getFieldValue(FORM_DATA_FIELD.phone),
        GET_OTP_TYPE.SIGNUP
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
      message.error(error.message);
    }
  }, []);
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
          setIsVerified(true);
          setShowVerify(false);
          // reset field otp
          form.setFields([{ name: FORM_DATA_FIELD.verify_code, value: '' }]);
          message.success('Xác thực thành công');
        }
      } catch (error) {
        appLibrary.hideloading();
        console.log(error);
        message.error(error.response.data.errors.code);
      }
    },
    []
  );
  const handleToggleVerify = () => {
    if (form.getFieldValue(FORM_DATA_FIELD.phone)) {
      onGetVerifyCode();
    } else {
      return message.error('Vui lòng nhập số điện thoại để nhận mã xác thực');
    }
  };
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
  const handleSelectProvinces = async (province_code: number) => {
    form.setFields([{ name: FORM_DATA_FIELD.city_id, value: province_code }]);
    form.resetFields([FORM_DATA_FIELD.district_id]);
    const res = await provinceService.fetchDistricts(province_code);
    if (res) {
      setDistricts([...res]);
    }
  };

  return (
    <>
      <div className="flex flex-col h-full gap-[10px] ">
        {/* name */}
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
            rules={[{ required: true, message: 'Họ và tên đệm không được bỏ trống!' }]}
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
        {/* phone_number */}
        <div className="relative">
          <Form.Item
            name={FORM_DATA_FIELD.phone}
            className="w-full"
            rules={[
              { required: true, message: 'Số điện thoại không được bỏ trống!' },
              {
                type: 'string',
                pattern: /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/,
                warningOnly: true,
                message: 'Số điện thoại không hợp lệ!',
              },
              { type: 'string', min: 10, message: 'Số điện thoại phải bao gồm 10 số!' },
            ]}
          >
            <InputStickLabel
              name={FORM_DATA_FIELD.phone}
              label={<p>Số điện thoại</p>}
              placeholder="Nhập số điện thoại của bạn"
              inputType="number"
              disabled={isVerified}
              onChange={(event) => {
                form.setFields([
                  { name: FORM_DATA_FIELD.phone, value: event.target.value },
                ]);
              }}
            />
          </Form.Item>
          {isVerified ? (
            <div className="absolute top-[38px] right-[21px] text-[#30AB7E]">
              Đã xác thực
            </div>
          ) : (
            <div
              onClick={handleToggleVerify}
              className="absolute top-[38px] right-[21px] underline cursor-pointer"
            >
              Lấy mã xác thực
            </div>
          )}
        </div>
        {/* gender */}
        <div className="flex gap-4">
          <div className="w-1/3">
            <label
              htmlFor=""
              className="block mb-[9px] text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              <p>Giới tính</p>
            </label>
            <Form.Item
              name={FORM_DATA_FIELD.gender_id}
              className="w-full"
              rules={[{ required: true, message: 'Giới tính không được bỏ trống!' }]}
            >
              <Select
                placeholder="Chọn giới tính"
                size="large"
                bordered={false}
                className="border-[2px] border-solid  border-gray-300 text-gray-900 text-sm rounded-lg focus:border-[#22216D] block w-full"
                onChange={(value) => {
                  if (value in GENDER_CODE) {
                    form.setFields([{ name: FORM_DATA_FIELD.gender_id, value: value }]);
                  }
                }}
              >
                <Option value={GENDER_CODE.male}>Nam</Option>
                <Option value={GENDER_CODE.female}>Nữ</Option>
              </Select>
            </Form.Item>
          </div>
          <div className="w-2/3">
            <Form.Item
              name={FORM_DATA_FIELD.address}
              className="w-full"
              rules={[{ required: true, message: 'Địa chỉ không được bỏ trống!' }]}
            >
              <InputStickLabel
                name={FORM_DATA_FIELD.address}
                label={<p>Vị trí</p>}
                placeholder="Địa chỉ..."
              />
            </Form.Item>
          </div>
        </div>
        {/* company_name */}
        <Form.Item
          name={FORM_DATA_FIELD.enterprise_name}
          className="w-full"
          rules={[
            { required: true, message: 'Tên công ty không được bỏ trống!' },
            {
              type: 'string',
              min: 3,
              message: 'Tên công ty phải bao gồm ít nhất 3 ký tự!',
            },
          ]}
        >
          <InputStickLabel
            name={FORM_DATA_FIELD.enterprise_name}
            label={
              <p>
                Tên công ty <strong className="text-red-500">*</strong>
              </p>
            }
            onChange={(event) => {
              form.setFields([
                { name: FORM_DATA_FIELD.enterprise_name, value: event.target.value },
              ]);
            }}
            placeholder="Tên công ty"
          />
        </Form.Item>
        {/* address */}
        <div>
          <label
            htmlFor=""
            className="block text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            <p>
              Địa điểm <strong className="text-red-500">*</strong>
            </p>
          </label>
          <div className="flex gap-2">
            <Form.Item
              name={FORM_DATA_FIELD.city_id}
              className="w-full"
              rules={[
                {
                  required: true,
                  message: 'Thành phố/Tỉnh không được bỏ trống!',
                  validateTrigger: 'onBlur',
                },
              ]}
            >
              <Select
                placeholder="Thành phố/Tỉnh"
                size="large"
                bordered={false}
                className="border-[2px] border-solid  border-gray-300 text-gray-900 text-sm rounded-lg focus:border-[#22216D] block w-full"
                onChange={handleSelectProvinces}
              >
                {provinces.map((item) => (
                  <Option key={item.codename} value={item.code}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name={FORM_DATA_FIELD.district_id}
              className="w-full"
              rules={[{ required: true, message: 'Quận/Huyện không được bỏ trống!' }]}
            >
              <Select
                placeholder="Quận/Huyện"
                size="large"
                bordered={false}
                className="border-[2px] border-solid  border-gray-300 text-gray-900 text-sm rounded-lg focus:border-[#22216D] block w-full"
                onChange={() => {}}
              >
                {districts.map((item) => (
                  <Option key={item.codename} value={item.code}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        </div>
        {/* <CustomModal open={showVetify} /> */}
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
                    onClick={handleSubmitVerifyCode}
                  >
                    Xác nhận
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
const StepAccountInfo = ({ form }) => {
  return (
    <>
      <div className="flex flex-col gap-4 mt-5">
        <Form.Item
          name={FORM_DATA_FIELD.email}
          className="w-full"
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

            // {
            //   validator: async (rule, value) => {
            //     const res = await checkEmail(value);
            //     if (res?.data?.data?.isExist) {
            //       return Promise.reject('Email đã tồn tại!');
            //     }
            //     return Promise.resolve();
            //   },
            // },
          ]}
          hasFeedback
        >
          <TextBoxWithLabel name={FORM_DATA_FIELD.email} label="Nhập Email " />
        </Form.Item>
        <Form.Item
          name={FORM_DATA_FIELD.password}
          className="w-full"
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
          <TextBoxWithLabel
            name={FORM_DATA_FIELD.password}
            inputType="password"
            label="Mật khẩu"
          />
        </Form.Item>
        <Form.Item
          dependencies={[FORM_DATA_FIELD.password]}
          name={FORM_DATA_FIELD.confirmed_password}
          className="w-full"
          rules={[
            {
              required: true,
              message: 'Xác nhận mật khẩu không được bỏ trống!',
            },
            // validate match password
            {
              validator: (rule, value) => {
                if (value !== form.getFieldValue(FORM_DATA_FIELD.password)) {
                  return Promise.reject('Mật khẩu không khớp!');
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <TextBoxWithLabel
            name={FORM_DATA_FIELD.confirmed_password}
            inputType="password"
            label="Nhập lại mật khẩu"
          />
        </Form.Item>
        <Form.Item
          name={FORM_DATA_FIELD.receive_news}
          initialValue={false}
          required={false}
        >
          <Checkbox
            onChange={(value) => {
              form.setFields([
                { name: FORM_DATA_FIELD.receive_news, value: value.target.checked },
              ]);
            }}
          >
            <p className="font-light text-[16px] leading-[26px] text-gray-700">
              Nhận những thông tin bổ ích từ &nbsp;
              <strong className="text-[#3BB1CF]">youth.com.vn</strong>
            </p>
          </Checkbox>
        </Form.Item>
      </div>
    </>
  );
};
const StepSuccess = ({ form }) => {
  return (
    <>
      <div className="flex flex-col justify-center align-middle items-center px-[40px] gap-4">
        <div className="relative h-[217px] w-full">
          <Image
            layout="fill"
            objectFit="contain"
            src={SrcImages.successSignup}
            alt="Youth+ Doanh nghiệp"
          />
        </div>
        <h2 className="not-italic font-semibold text-2xl leading-8 text-center text-gray-900">
          Bạn đã tạo tài khoản thành công
        </h2>
        <p className="max-w-[356px] text-center">
          Vui lòng kiểm tra hộp thư, chúng tôi vừa gửi bạn link truy cập vào hệ thống
          Youth+ Business
        </p>
        <Link href="/login" legacyBehavior>
          <button className="primary-button !m-auto !bg-transparent !text-[#403ECC]">
            Đăng nhập ngay
          </button>
        </Link>
      </div>
    </>
  );
};
const SignUpModule = () => {
  const [form] = Form.useForm();
  const policy = Form.useWatch('agree_policy', form);
  const [isDisable, setIsDisable] = useState(false);
  const [currentStep, setCurrentStep] = useState(steps[0].id);
  const animaRef = useRef(null);

  const register = async (values: RegisterPayload) => {
    try {
      appLibrary.showloading();
      const res = await registerInstance.registerAccount(values);
      console.log(res);
      appLibrary.hideloading();
      return true;
    } catch (error) {
      console.log(error);
      appLibrary.hideloading();
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorList = Object.keys(errors).map((key) => {
          message.error('Đăng ký thất bại!');
          return {
            name: key,
            errors: errors[key],
          };
        });
        console.log(errorList);

        form.setFields(errorList);
      } else {
        message.error('Đăng ký không thành công!');
      }

      return false;
    }
  };
  const handleStepChange = async (isBack = false) => {
    console.log(currentStep, form.getFieldsValue());
    if (currentStep === steps[1].id && !isBack) {
      const {
        address,
        city_id,
        first_name,
        last_name,
        phone,
        enterprise_name,
        gender_id,
        district_id,
      } = form.getFieldsValue();
      if (
        !(
          address &&
          city_id &&
          first_name &&
          last_name &&
          phone &&
          enterprise_name &&
          gender_id &&
          district_id
        )
      ) {
        form.validateFields([
          FORM_DATA_FIELD.address,
          FORM_DATA_FIELD.city_id,
          FORM_DATA_FIELD.first_name,
          FORM_DATA_FIELD.last_name,
          FORM_DATA_FIELD.phone,
          FORM_DATA_FIELD.enterprise_name,
          FORM_DATA_FIELD.district_id,
          FORM_DATA_FIELD.gender_id,
        ]);
        return message.error('Vui lòng nhập đầy đủ thông tin!');
      }
    }
    if (currentStep === steps[2].id && !isBack) {
      const { email, password, confirmed_password } = form.getFieldsValue();
      if (!(email && password && confirmed_password)) {
        form.validateFields([
          FORM_DATA_FIELD.email,
          FORM_DATA_FIELD.password,
          FORM_DATA_FIELD.confirmed_password,
        ]);
        return message.error('Vui lòng nhập đầy đủ thông tin!');
      }
    }

    if (currentStep === steps[2].id && !isBack) {
      // get all error from form error array and show message
      const errors = form.getFieldsError();
      const errorList = errors
        .map((err) => {
          if (err.errors.length) {
            return err.errors;
          }
          return null;
        })
        .filter((item) => item);
      if (errorList.length) {
        return message.error(errorList.join(' -\n '), 4);
      } else {
        const value = form.getFieldsValue();
        console.log(value);
        delete value.agree_policy;
        // if register success then go to step success else show error
        return register(value).then((res) => {
          if (res) {
            setCurrentStep(steps[3].id);
          }
        });
      }
    }

    setCurrentStep((pre) =>
      pre >= steps.length - 1
        ? steps[0].id
        : pre < 0
        ? steps[0].id
        : isBack
        ? pre - 1
        : pre + 1
    );
  };

  useEffect(() => {
    animaRef.current && autoAnimate(animaRef.current);
  }, [animaRef]);

  useEffect(() => {
    currentStep === 0 && setIsDisable(!policy);
  }, [policy]);

  const onAllStepComplete = () => {};
  return (
    <div
      ref={animaRef}
      className={clsx(
        'grid grid-cols-2 smooth_animation h-full m-auto max-w-[1310px] bg-white shadow-[3px_-5px_40px_rgba(205,205,212,0.1)] rounded-[20px] overflow-hidden',
        currentStep > steps[2].id && ' !grid-cols-1 !w-fit'
      )}
    >
      {currentStep <= steps[2].id && (
        <div className="relative min-h-[645px] h-full w-full smooth_animation select-none">
          <Image
            src={SrcImages.sideImage}
            alt="Youth"
            layout="fill"
            objectFit="fill"
            priority
          />
          <div className="absolute bottom-7 left-7 rounded-lg shadow text-left bg-indigo-700 p-5  h-40 w-1/2">
            <h1 className="font-semibold text-3xl leading-10 text-white">
              Đăng ký tài khoản
            </h1>
            <p className=" font-light text-base leading-6 text-gray-100">
              Để tìm kiếm ứng viên phù hợp nhất cho doanh nghiệp, vui lòng điền thông tin,
              thực hiện các bước.
            </p>
          </div>
        </div>
      )}
      <div className="w-full">
        <div className="px-[27px] py-[36px] h-full flex flex-col">
          <ProgressBar currentStep={currentStep} steps={steps} />
          <Form
            className="w-full h-full flex flex-col shrink"
            onFinish={onAllStepComplete}
            form={form}
            autoComplete="off"
          >
            <div className="form-title mt-6">
              <h1 className="font-semibold text-3xl leading-[39px] text-gray-900">
                {currentStep === steps[0].id
                  ? '  Quy định khi đăng ký tài \n khoản doanh nghiệp'
                  : currentStep === steps[1].id
                  ? 'Thông tin nhà tuyển dụng'
                  : currentStep === steps[2].id
                  ? 'Thông tin tài khoản'
                  : ''}
              </h1>
            </div>
            <div className="steps-content mt-2">
              <div className={currentStep !== 0 ? 'hidden' : ''}>
                <StepAgreePolicy form={form} />
              </div>
              <div className={currentStep !== 1 ? 'hidden' : ''}>
                <StepEnterpriseInfo form={form} />
              </div>
              <div className={currentStep !== 2 ? 'hidden' : ''}>
                <StepAccountInfo form={form} />
              </div>
              <div className={currentStep !== 3 ? 'hidden' : ''}>
                <StepSuccess form={form} />
              </div>
            </div>
          </Form>

          {currentStep <= steps[2].id && (
            <div className="steps-action flex mt-auto">
              {currentStep > 0 && (
                <button
                  className={clsx(
                    'primary-button mt-5 !ml-0 mr-auto !bg-transparent !text-[#403ECC]'
                  )}
                  onClick={() => handleStepChange(true)}
                >
                  Quay lại
                </button>
              )}

              <button
                type="submit"
                disabled={isDisable}
                className={clsx('primary-button mt-5', isDisable && '!bg-[#696974]')}
                onClick={() => handleStepChange()}
              >
                Tiếp theo &nbsp;
                <svg
                  width="14"
                  height="9"
                  viewBox="0 0 14 9"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.09094 0.265207C9.49676 -0.109399 10.1294 -0.0840962 10.504 0.321722L13.7348 3.82168C14.0884 4.20474 14.0884 4.79518 13.7348 5.17824L10.504 8.67828C10.1294 9.08411 9.49677 9.10941 9.09095 8.73481C8.68513 8.36021 8.65982 7.72755 9.03442 7.32173L10.716 5.49997L0.999999 5.49997C0.447714 5.49997 -7.64154e-07 5.05225 -7.86799e-07 4.49997C-8.09444e-07 3.94768 0.447714 3.49997 0.999999 3.49997L10.716 3.49997L9.03443 1.67829C8.65982 1.27247 8.68513 0.639813 9.09094 0.265207Z"
                    fill="white"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUpModule;
