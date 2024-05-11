import FileUploader from '@/components/FileUpload';
import { IEnterprise } from '@/interfaces/models/IEnterprise';
import { IField } from '@/interfaces/models/IField';
import { recruitmentsAPI, ViewAllFields } from '@/modules/ManageRecruitment/shared/api';
import { ENTERPRISE_FORM } from '@/modules/SignUp/shared/enums';
import { SV_RES_STATUS_CODE } from '@/shared/enums/enums';
import { appLibrary } from '@/shared/utils/loading';
import { setUserFieldValue } from '@/store';
import { Form, Input, message, Select } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { isMatch } from 'lodash-es';
import 'moment/locale/vi';
import { useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';
import {
  accountAPI,
  DetailEnterprise,
  UpdateEnterpriseInfoPayload,
} from '../../shared/api';
import { convertOption, SCALE } from '../../shared/enum';
import { adressAPI } from '@/shared/services';
import { useDispatch, useSelector } from 'react-redux';

interface IProps {
  company: any;
}

const { TextArea } = Input;

export const CompanyInfoForm = ({ company }: IProps) => {
  const dispatch = useDispatch();

  const [isLoading, setisLoading] = useState(true);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [getFields, setFields] = useState([]);
  const [Img, setImageUrl] = useState('');

  const [form] = Form.useForm<any>();
  const [currentCompanyInfo, setCurrentCompanyInfo] = useState<any>({});
  const data = useSelector((state: any) => state.login.data);
  const rqEnterprise: DetailEnterprise = {
    id: data.id,
  };
  enum ToggleForgotFormOption {
    none = '',
    email = 'email',
    password = 'password',
    phoneNumber = 'phoneNumber',
  }
  const [toggleForgotForm, setToggleForgotForm] = useState<ToggleForgotFormOption>(
    ToggleForgotFormOption.none
  );

  const payload: ViewAllFields = {
    page: 1,
    pageSize: 100000,
  };
  const getAllFields = async () => {
    const res = await recruitmentsAPI.getFields(payload);
    setFields(res.items);
  };
  const Enterprise = async (payload: DetailEnterprise) => {
    const user = await accountAPI.getEnterpriseById(payload);
    setImageUrl(user.avatar);
    setCurrentCompanyInfo(user);
    form.setFieldsValue({ ...user });
    return user;
  };

  useEffect(() => {
    getAllFields();

    form.resetFields();
    Enterprise(rqEnterprise);
  }, [Img]);

  const getProvincesData = useCallback(async () => {
    appLibrary.showloading();
    try {
      const res = await adressAPI.getCity();
      if (res) {
        setProvinces([...res]);
      }
      appLibrary.hideloading();
    } catch (error) {
      console.log(error);
      appLibrary.hideloading();
    }
  }, []);

  const getDistrictsData = useCallback(async (city_id: string) => {
    appLibrary.showloading();
    try {
      const res = await adressAPI.FindDistrictByCity(city_id);
      if (res) {
        setDistricts([...res]);
      }
      appLibrary.hideloading();
    } catch (error) {
      console.log(error);
      appLibrary.hideloading();
    }
  }, []);

  const getWardsData = useCallback(async (district_id: string) => {
    appLibrary.showloading();
    try {
      const res = await adressAPI.FindWardByDitrict(district_id);
      if (res) {
        setWards([...res]);
      }
      appLibrary.hideloading();
    } catch (error) {
      console.log(error);
      appLibrary.hideloading();
    }
  }, []);

  const getLocation = async () => {
    if (!isLoading) {
      return;
    }
    form.resetFields();
    form.setFieldsValue({ ...currentCompanyInfo });
    const req1 = getProvincesData();
    const req2 = getDistrictsData(company.city_id);
    const req3 = getWardsData(company.district_id);
    Promise.all([req1, req2, req3]).then(() => {
      setisLoading(false);
    });
  };

  const handleCityChange = async (value) => {
    try {
      await getDistrictsData(value);
      form.resetFields(['district_id']);
      setWards([]);
      form.resetFields(['ward_id']);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDistrictChange = async (value) => {
    try {
      await getWardsData(value);
      form.resetFields(['ward_id']);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAccountInfoChange = () => {
    form.validateFields();
    const formData = form.getFieldsValue();
    console.log(formData);
    const payload: UpdateEnterpriseInfoPayload = {
      id: currentCompanyInfo.id,
      abbreviation_name: formData[ENTERPRISE_FORM.abbreviation_name],
      address: formData[ENTERPRISE_FORM.address],
      career_field_id: formData[ENTERPRISE_FORM.career_field_id],
      city_id: formData[ENTERPRISE_FORM.city_id],
      district_id: formData[ENTERPRISE_FORM.district_id],
      enterprise_introduce: formData[ENTERPRISE_FORM.introduce],
      enterprise_name: formData[ENTERPRISE_FORM.name],
      scale_id: formData[ENTERPRISE_FORM.scale_id],
      ward_id: formData[ENTERPRISE_FORM.ward_id],
      website_url: formData[ENTERPRISE_FORM.website_url],
      phone: formData[ENTERPRISE_FORM.phone],
    };
    console.log(Object.values(payload));
    console.log(company);
    if (
      Object.values(payload).some(
        (value) => value === 0 || value === '' || value === undefined || value === null
      )
    ) {
      message.error('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    const { avatar } = form.getFieldsValue([ENTERPRISE_FORM.avatar]);
    // if both avatar and account info are not changed then show message else update which is changed
    if (isMatch(company, payload) && isMatch(company.avatar, avatar)) {
      return message.warning('Không có thông tin nào thay đổi');
    }
    if (!isMatch(company, payload)) {
      onEnterpriseInfoChange(payload);
    }
    if (!isMatch(company.avatar, avatar)) {
      onUpdateAvatar();
    }
  };

  const onEnterpriseInfoChange = async (payload) => {
    try {
      appLibrary.showloading();
      const { code } = await accountAPI.updateEnterpriseInfo(payload);
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
    const { avatar } = form.getFieldsValue([ENTERPRISE_FORM.avatar]);
    formData.append('file', avatar?.file?.originFileObj ?? avatar);
    try {
      appLibrary.showloading();
      const res = await accountAPI.updateAvatar(formData);
      const url = await accountAPI.getUrlCDN(res.getInfoUri);

      const urlavatar = res.stringConnect + url.downloadTokens;
      // const payloadUpdateAvatar :
      // await accountAPI.updateAccountInfo()
      message.success('Cập nhật ảnh đại diện thành công');

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

  useEffect(() => {
    getLocation();
  }, []);

  return isLoading ? (
    <>{isLoading}</>
  ) : (
    // return (
    <>
      <div className="min-w-[900px] coupon account-info">
        <Form
          form={form}
          name="basic"
          autoComplete="off"
          className="flex flex-col gap-[8px]"
        >
          <div className="flex ">
            <div className="w-full">
              <div className="flex flex-row gap-4">
                <div className="flex flex-col w-full ">
                  <p className="font-[400] text-xl leading-title">
                    Tên công ty <span className="text-[#EB4C4C]">*</span>
                  </p>

                  <Form.Item
                    name={ENTERPRISE_FORM.name}
                    className="w-full"
                    rules={[{ required: true, message: 'Tên không được bỏ trống!' }]}
                  >
                    <Input
                      name={ENTERPRISE_FORM.name}
                      size="large"
                      className="rounded-[10px] bg-white w-full"
                      allowClear
                    />
                  </Form.Item>
                </div>

                <div className="flex flex-col w-2/5 ">
                  <p className="font-[400] text-xl leading-title text-ellipsis whitespace-nowrap overflow-hidden">
                    Tên viết tắt <span className="text-[#EB4C4C]">*</span>
                  </p>
                  <FormItem
                    name={ENTERPRISE_FORM.abbreviation_name}
                    className="w-full"
                    rules={[
                      { required: true, message: 'Tên viết tắt không được bỏ trống!' },
                    ]}
                  >
                    <Input
                      name={ENTERPRISE_FORM.abbreviation_name}
                      size="large"
                      className="rounded-[10px] bg-white w-full"
                      allowClear
                    />
                  </FormItem>
                </div>

                <div className="flex flex-col w-2/5 ">
                  <p className="font-[400] text-xl leading-title">
                    Quy mô <span className="text-[#EB4C4C]">*</span>
                  </p>
                  <FormItem
                    name={ENTERPRISE_FORM.scale_id}
                    className="w-full"
                    rules={[{ required: true, message: 'Quy mô không được bỏ trống!' }]}
                  >
                    <Select
                      size="large"
                      className="!rounded-[10px] bg-white w-full h-full"
                      options={convertOption(SCALE)}
                    />
                  </FormItem>
                </div>
              </div>

              <p className="font-[400] text-xl leading-title">
                Địa điểm <span className="text-[#EB4C4C]">*</span>
              </p>
              <div className="flex flex-row gap-4">
                <div className="flex flex-col w-full ">
                  <FormItem
                    name={ENTERPRISE_FORM.city_id}
                    className="w-full"
                    rules={[
                      { required: true, message: 'Thành phố không được bỏ trống!' },
                    ]}
                  >
                    <Select
                      size="large"
                      placeholder="Chọn thành phố"
                      className="!rounded-[10px] bg-white w-full"
                      onChange={handleCityChange}
                      options={provinces?.map((item) => {
                        return { key: item.value, value: item.value, label: item.value };
                      })}
                    />
                  </FormItem>
                </div>

                <div className="flex flex-col w-full ">
                  <FormItem
                    name={ENTERPRISE_FORM.district_id}
                    className="w-full"
                    rules={[
                      { required: true, message: 'Quận/huyện không được bỏ trống!' },
                    ]}
                  >
                    <Select
                      size="large"
                      placeholder="Chọn quận/huyện"
                      className="!rounded-[10px] bg-white w-full"
                      onChange={handleDistrictChange}
                      options={districts?.map((item) => {
                        return { key: item.value, value: item.value, label: item.value };
                      })}
                    />
                  </FormItem>
                </div>

                <div className="flex flex-col w-full ">
                  <FormItem
                    name={ENTERPRISE_FORM.ward_id}
                    className="w-full"
                    rules={[
                      { required: true, message: 'Xã/phường không được bỏ trống!' },
                    ]}
                  >
                    <Select
                      size="large"
                      placeholder="Chọn xã/phường"
                      className="!rounded-[10px] bg-white w-full"
                      options={wards?.map((item) => {
                        return { key: item.value, value: item.value, label: item.value };
                      })}
                    />
                  </FormItem>
                </div>
              </div>

              <div className="campaign">
                <p className="font-[400]  text-xl leading-title">Địa chỉ chi tiết</p>
                <Form.Item name={ENTERPRISE_FORM.address} className="w-full">
                  <Input
                    size="large"
                    className="rounded-[10px] bg-white w-full"
                    allowClear
                  />
                </Form.Item>
              </div>

              <div className="campaign">
                <p className="font-[400]  text-xl leading-title">Số điện thoại</p>
                <Form.Item
                  name={ENTERPRISE_FORM.phone}
                  className="w-full"
                  rules={[
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
                  <Input
                    name={ENTERPRISE_FORM.phone}
                    size="large"
                    type="number"
                    className="rounded-[10px] bg-white w-full"
                    allowClear
                  />
                </Form.Item>
              </div>

              <div className="flex flex-row gap-4">
                <div className="flex flex-col w-full ">
                  <p className="font-[400] text-xl leading-title">Lĩnh vực hoạt động</p>
                  <Form.Item name={ENTERPRISE_FORM.career_field_id} className="w-full">
                    <Select
                      size="large"
                      className="!rounded-[10px] bg-white w-full h-full m-0"
                      options={
                        getFields &&
                        getFields.map((fields) => ({
                          key: fields.id,
                          value: fields.id,
                          label: fields.name,
                        }))
                      }
                    />
                  </Form.Item>
                </div>

                <div className="flex flex-col w-full ">
                  <p className="font-[400] text-xl leading-title">Website</p>

                  <Form.Item name={ENTERPRISE_FORM.website_url} className="w-full">
                    <Input
                      name={ENTERPRISE_FORM.website_url}
                      size="large"
                      className="rounded-[10px] bg-white w-full"
                      allowClear
                    />
                  </Form.Item>
                </div>
              </div>
            </div>

            <div className="m-8 w-1/3 mt-auto ">
              <div className="flex justify-center mx-auto items-center">
                <Form.Item
                  name={ENTERPRISE_FORM.avatar}
                  className="w-full"
                  rules={[
                    { required: true, message: 'Ảnh đại diện không được bỏ trống!' },
                  ]}
                >
                  <FileUploader
                    defaultImage={Img}
                    className="flex flex-col"
                    customButton={
                      <p className="!mt-[50px] underline text-[#403ECC] text-[16px]">
                        Chỉnh sửa hình ảnh đại diện
                      </p>
                    }
                  />
                </Form.Item>
              </div>

              <div className="companyTextarea">
                <p className="font-[400]  text-xl leading-title">
                  Giới thiệu về công ty <span className="text-[#EB4C4C]">*</span>
                </p>
                <Form.Item
                  className="w-full"
                  name={ENTERPRISE_FORM.introduce}
                  rules={[{ required: true, message: 'Tên không được bỏ trống!' }]}
                >
                  <TextArea
                    name={ENTERPRISE_FORM.introduce}
                    rows={5}
                    className="rounded-[10px] bg-white w-full min-h-[200px]"
                  />
                </Form.Item>
              </div>
            </div>
          </div>

          <button
            type="button"
            className={'primary-button mt-5 !mr-auto !ml-0'}
            onClick={handleAccountInfoChange}
          >
            Lưu thay đổi
          </button>
        </Form>
      </div>
    </>
  );
};
