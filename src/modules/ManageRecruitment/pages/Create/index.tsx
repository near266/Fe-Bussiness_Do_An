import SrcImages from '@/assets/images';
import { IEnterprise } from '@/interfaces/models/IEnterprise';
import { IRecruitment, SalaryTypeId, StatusId } from '@/interfaces/models/IRecruitment';
import { ProgressBar } from '@/modules/SignUp/components/ProgressBar';
import { SV_RES_STATUS_CODE } from '@/shared/enums/enums';
import { showAntFormError, showResponseError } from '@/shared/utils/common';
import { appLibrary } from '@/shared/utils/loading';
import Image from 'next/legacy/image';

import { RECRUITMENT_DATA_FIELD } from '../../shared/enums';
import RecruitmentDetailModule from '../Detail';
import React from 'react';
import FileUploader from '@/components/FileUpload';
import { IField } from '@/interfaces/models/IField';
import {
  CreateJobPost,
  recruitmentsAPI,
  SearchCaree,
  UpdatePost,
  ViewAllFields,
} from '@/modules/ManageRecruitment/shared/api';
import { ENTERPRISE_FORM } from '@/modules/SignUp/shared/enums';
import { setUserFieldValue } from '@/store';
import { Form, Input, InputNumber, message, Select } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { isMatch } from 'lodash-es';
import 'moment/locale/vi';
import { useCallback, useEffect, useState } from 'react';

import dynamic from 'next/dynamic';

import { adressAPI } from '@/shared/services';
import { useDispatch, useSelector } from 'react-redux';
import TextArea from 'antd/lib/input/TextArea';
import {
  MASTER_DATA_DEGREE,
  MASTER_DATA_EXPERIENCE,
  MASTER_DATA_GENDER,
  MASTER_DATA_LEVEL,
  MASTER_DATA_PROBATION_PERIOD,
  MASTER_DATA_SALARY_TYPE,
  MASTER_DATA_WORKING_METHOD,
} from '../../shared/constance';
import { TOption } from '@/shared/types';
import moment from 'moment';
import { DetailEnterprise, accountAPI } from '@/modules/ManageAccount/shared/api';
const steps = [
  { id: 0, label: 'TẠO NỘI DUNG' },
  { id: 1, label: 'XEM TRƯỚC TIN TUYỂN' },
];

const CreateSuccess = () => {
  return (
    <div className="w-full h-full">
      <div className="card flex flex-row items-center justify-center">
        <div>
          <div className="text-4xl font-bold text-[#22216D]">
            Tạo tin tuyển dụng thành công
          </div>
          <div className="text-[#696974] text-center mt-5">
            Tin tuyển dụng của bạn đã được tạo thành công. Bạn có thể xem lại tin tuyển
            dụng của mình tại trang quản lý tin tuyển dụng.
          </div>
        </div>
        <div className="flex gap-5 mt-5 relative w-[500px] h-[300px]">
          <Image
            layout="fill"
            objectFit="contain"
            alt="Eztek Doanh nghiệp"
            src={SrcImages.completeCreateRecruit}
          />
        </div>
      </div>
    </div>
  );
};
const Editor = dynamic(() => import('@/components/Editor'), {
  loading: () => <div>loading...</div>,
  ssr: false,
});
const CreateRecruitmentModule = ({ enterpriseInfo }: { enterpriseInfo: IEnterprise }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  console.log('tags', form.getFieldValue(RECRUITMENT_DATA_FIELD.tags));

  const handleStepChange = async (isBack?: boolean) => {
    const validator = form.validateFields();
    validator
      .then((data: IRecruitment) => {
        setCurrentStep((pre) =>
          pre >= steps.length
            ? steps[0].id
            : pre < 0
            ? steps[0].id
            : isBack
            ? pre - 1
            : pre + 1
        );
      })
      .catch((err) => showAntFormError(err.errorFields));
  };
  const onCreateRecruitment = async (status: StatusId) => {
    try {
      const formData = new FormData();
      const data = form.getFieldsValue();
      console.log(data);
      data.status_id = status;
      if (data.salary_type_id === SalaryTypeId.DEAL) {
        delete data.salary_min;
        delete data.salary_max;
      }
      delete data.caching;
      Object.keys(data).forEach((key) => {
        if (key === RECRUITMENT_DATA_FIELD.avatar) {
          const { avatar } = form.getFieldsValue([RECRUITMENT_DATA_FIELD.avatar]);
          console.log(avatar?.file?.originFileObj);
          return formData.append('avatar', avatar?.file?.originFileObj ?? avatar);
        }
        if (key === RECRUITMENT_DATA_FIELD.tags) {
          const tags = form.getFieldValue(RECRUITMENT_DATA_FIELD.tags);
          console.log(tags);
          Array.from(tags.length > 0 ? tags : []).forEach((tag) =>
            formData.append('tags[]', `${tag}`)
          );
          return;
        }
        formData.append(key, data[key]);
      });
      appLibrary.showloading();
      console.log(data, formData);

      appLibrary.hideloading();
    } catch (error) {
      appLibrary.hideloading();
      console.log(error);
      showResponseError(error);
    }
  };
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [careers, setCareers] = useState([]);
  const [urlavatar, setUrl] = useState('');
  const [idPost, setIdPost] = useState('');

  const [currentAccountInfo, setCurrentAccountInfo] = useState<any>({});
  const data = useSelector((state: any) => state.login.data);
  const [fields, setFields] = useState([]);
  const rqEnterprise: DetailEnterprise = {
    id: data.id,
  };
  useEffect(() => {
    getProvincesData();
    Enterprise(rqEnterprise);
  }, []);
  const payload: ViewAllFields = {
    page: 1,
    pageSize: 100000,
  };

  const getProvincesData = useCallback(async () => {
    appLibrary.showloading();
    try {
      const res = await adressAPI.getCity();
      const fields = await recruitmentsAPI.getFields(payload);
      setFields([...fields.items]);
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
  const handleCityChange = async (value) => {
    try {
      await getDistrictsData(value);
      form.resetFields(['district_id']);
    } catch (error) {
      console.log(error);
    }
  };

  const Enterprise = async (payload: DetailEnterprise) => {
    const user = await accountAPI.getEnterpriseById(payload);

    setCurrentAccountInfo(user);
    return user;
  };
  const handleFieldsChange = async (value) => {
    try {
      getCaree(value);
      form.resetFields(['career_id']);
    } catch (error) {
      console.log(error);
    }
  };
  const getCaree = useCallback(async (id: any) => {
    const payloadSearch: SearchCaree = {
      idField: id,
      page: 1,
      pageSize: 100000,
    };
    const res = await recruitmentsAPI.getCareee(payloadSearch);
    setCareers([...res.items]);
  }, []);
  const [disableFormField, setDisableFormField] = useState({
    [RECRUITMENT_DATA_FIELD.salary_max]:
      form?.getFieldValue(RECRUITMENT_DATA_FIELD.salary_type_id) === SalaryTypeId.DEAL,
    [RECRUITMENT_DATA_FIELD.salary_min]:
      form?.getFieldValue(RECRUITMENT_DATA_FIELD.salary_type_id) === SalaryTypeId.DEAL,
  });
  const handleSaveRecruitment = async (status: StatusId) => {
    setCurrentStep(2);
    // onCreateRecruitment(status);
  };
  const handleAccountInfoChange = async () => {
    form.validateFields();

    const formData = form.getFieldsValue();

    console.log(formData);
    const payload: CreateJobPost = {
      title: formData[RECRUITMENT_DATA_FIELD.title],
      address: formData[RECRUITMENT_DATA_FIELD.address],
      career_field_id: formData[RECRUITMENT_DATA_FIELD.career_field_id],
      city: formData[RECRUITMENT_DATA_FIELD.city_id],
      district: formData[RECRUITMENT_DATA_FIELD.district_id],
      career_id: formData[RECRUITMENT_DATA_FIELD.career_id],
      salary_max: formData[RECRUITMENT_DATA_FIELD.salary_max],
      salary_min: formData[RECRUITMENT_DATA_FIELD.salary_min],
      salary_type: formData[RECRUITMENT_DATA_FIELD.salary_type_id].toString(),
      image_url: '',
      gender: formData[RECRUITMENT_DATA_FIELD.gender_id].toString(),
      map_url: formData[RECRUITMENT_DATA_FIELD.map_url],
      contact_email: formData[RECRUITMENT_DATA_FIELD.contact_email],
      contact_name: formData[RECRUITMENT_DATA_FIELD.contact_name],
      contact_phone: formData[RECRUITMENT_DATA_FIELD.contact_phone],
      status_id: formData[RECRUITMENT_DATA_FIELD.status_id],
      deadline: moment(formData[RECRUITMENT_DATA_FIELD.deadline]),
      probationary_period:
        formData[RECRUITMENT_DATA_FIELD.probationary_period_id].toString(),
      experience: formData[RECRUITMENT_DATA_FIELD.experience_id].toString(),
      slug: '',
      form_of_work: formData[RECRUITMENT_DATA_FIELD.form_of_work_id].toString(),
      diploma: formData[RECRUITMENT_DATA_FIELD.diploma_id].toString(),
      level: formData[RECRUITMENT_DATA_FIELD.level_id].toString(),
      overview: formData[RECRUITMENT_DATA_FIELD.overview],
      requirement: formData[RECRUITMENT_DATA_FIELD.requirement],
      benefit: formData[RECRUITMENT_DATA_FIELD.benefit],
      created_date: moment(),
      enterprise_id: currentAccountInfo.id,
    };

    onUpdateAvatar(payload);
  };
  const onUpdateAvatar = async (payload: CreateJobPost) => {
    const formData = new FormData();
    const { avatar } = form.getFieldsValue([RECRUITMENT_DATA_FIELD.avatar]);
    formData.append('file', avatar?.file?.originFileObj ?? avatar);
    try {
      appLibrary.showloading();
      const res = await accountAPI.updateAvatar(formData);
      const url = await accountAPI.getUrlCDN(res.getInfoUri);

      const urlAvatar = res.stringConnect + url.downloadTokens;

      payload.image_url = urlAvatar;
      const create = await recruitmentsAPI.createRecruitment(payload);

      setIdPost(create.id);
      message.success('Cập nhật ảnh đại diện thành công');

      appLibrary.hideloading();
      handleStepChange();
    } catch (error) {
      appLibrary.hideloading();
      const { data } = error?.response ?? {};
      message.error(
        `${Object.values(data?.errors ?? []).join(' - ')}` ?? 'Có lỗi xảy ra'
      );
      return;
    }
  };
  return (
    <div>
      <div className="bg-white top-[var(--height-navbar)] ">
        <ProgressBar
          containerClassName="max-w-[600px]"
          currentStep={currentStep}
          steps={steps}
        />
      </div>
      <div className="my-5 text-title text-[#22216D] font-title">Tạo tin tuyển dụng</div>
      <div className={currentStep === 0 ? '' : 'hidden'}>
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
                      Tiêu đề tuyển dụng <span className="text-[#EB4C4C]">*</span>
                    </p>

                    <Form.Item
                      name={RECRUITMENT_DATA_FIELD.title}
                      className="w-full"
                      rules={[{ required: true, message: 'Tên không được bỏ trống!' }]}
                    >
                      <Input
                        name={RECRUITMENT_DATA_FIELD.title}
                        size="large"
                        className="rounded-[10px] bg-white w-full"
                        allowClear
                      />
                    </Form.Item>
                  </div>
                </div>

                <p className="font-[400] text-xl leading-title">
                  Địa điểm làm việc<span className="text-[#EB4C4C]">*</span>
                </p>
                <div className="flex flex-row gap-4">
                  <div className="flex flex-col w-full ">
                    <FormItem
                      name={RECRUITMENT_DATA_FIELD.city_id}
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
                          return {
                            key: item.value,
                            value: item.value,
                            label: item.value,
                          };
                        })}
                      />
                    </FormItem>
                  </div>

                  <div className="flex flex-col w-full ">
                    <FormItem
                      name={RECRUITMENT_DATA_FIELD.district_id}
                      className="w-full"
                      rules={[
                        { required: true, message: 'Quận/huyện không được bỏ trống!' },
                      ]}
                    >
                      <Select
                        size="large"
                        placeholder="Chọn quận/huyện"
                        className="!rounded-[10px] bg-white w-full"
                        options={districts?.map((item) => {
                          return {
                            key: item.value,
                            value: item.value,
                            label: item.value,
                          };
                        })}
                      />
                    </FormItem>
                  </div>
                </div>

                <div className="campaign">
                  <p className="font-[400]  text-xl leading-title">Địa chỉ chi tiết</p>
                  <Form.Item name={RECRUITMENT_DATA_FIELD.address} className="w-full">
                    <Input
                      size="large"
                      className="rounded-[10px] bg-white w-full"
                      allowClear
                    />
                  </Form.Item>
                </div>
                <div className="flex flex-row gap-4">
                  <div className="flex flex-col w-full ">
                    <p className="font-[400] text-xl leading-title">Hình thức làm việc</p>
                    <Form.Item
                      name={RECRUITMENT_DATA_FIELD.form_of_work_id}
                      className="w-full"
                    >
                      <Select
                        size="large"
                        className="!rounded-[10px] bg-white w-full h-full m-0"
                        options={MASTER_DATA_WORKING_METHOD.map((op: TOption) => ({
                          key: op.key,
                          value: op.key,
                          label: op.label,
                        }))}
                      />
                    </Form.Item>
                  </div>
                  <div className="flex flex-col w-full ">
                    <p className="font-[400] text-xl leading-title">Bằng cấp</p>
                    <Form.Item
                      name={RECRUITMENT_DATA_FIELD.diploma_id}
                      className="w-full"
                    >
                      <Select
                        size="large"
                        className="!rounded-[10px] bg-white w-full h-full m-0"
                        options={MASTER_DATA_DEGREE.map((op) => ({
                          key: op.key,
                          value: op.key,
                          label: op.label,
                        }))}
                      />
                    </Form.Item>
                  </div>

                  <div className="flex flex-col w-full ">
                    <p className="font-[400] text-xl leading-title">Kinh ngiệm</p>
                    <Form.Item
                      name={RECRUITMENT_DATA_FIELD.experience_id}
                      className="w-full"
                    >
                      <Select
                        size="large"
                        className="!rounded-[10px] bg-white w-full h-full m-0"
                        options={MASTER_DATA_EXPERIENCE.map((op) => ({
                          key: op.key,
                          value: op.key,
                          label: op.label,
                        }))}
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className="flex flex-row gap-4">
                  <div className="flex flex-col w-full ">
                    <p className="font-[400] text-xl leading-title">
                      Cấp bậc<span className="text-[#EB4C4C]">*</span>
                    </p>
                    <Form.Item name={RECRUITMENT_DATA_FIELD.level_id} className="w-full">
                      <Select
                        size="large"
                        className="!rounded-[10px] bg-white w-full h-full m-0"
                        options={MASTER_DATA_LEVEL.map((op) => ({
                          key: op.key,
                          value: op.key,
                          label: op.label,
                        }))}
                      />
                    </Form.Item>
                  </div>
                  <div className="flex flex-col w-full ">
                    <p className="font-[400] text-xl leading-title">
                      Lĩnh vực<span className="text-[#EB4C4C]">*</span>
                    </p>
                    <Form.Item
                      name={RECRUITMENT_DATA_FIELD.career_field_id}
                      className="w-full"
                    >
                      <Select
                        size="large"
                        className="!rounded-[10px] bg-white w-full h-full m-0"
                        onChange={handleFieldsChange}
                        options={
                          fields &&
                          fields.map((fields) => ({
                            key: fields.id,
                            value: fields.id,
                            label: fields.name,
                          }))
                        }
                      />
                    </Form.Item>
                  </div>
                  <div className="flex flex-col w-full ">
                    <p className="font-[400] text-xl leading-title">
                      Nghề<span className="text-[#EB4C4C]">*</span>
                    </p>
                    <Form.Item name={RECRUITMENT_DATA_FIELD.career_id} className="w-full">
                      <Select
                        size="large"
                        className="!rounded-[10px] bg-white w-full h-full m-0"
                        options={
                          careers &&
                          careers.map((fields) => ({
                            key: fields.id,
                            value: fields.id,
                            label: fields.name,
                          }))
                        }
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className="flex flex-row gap-4">
                  <div className="flex flex-col w-full ">
                    <p className="font-[400] text-xl leading-title">Hạn nhận hồ sơ</p>
                    <FormItem
                      name={RECRUITMENT_DATA_FIELD.deadline}
                      rules={[
                        { required: true, message: 'Chọn hạn nhận hồ sơ' },
                        // no select date in the past
                        () => ({
                          validator(_, value) {
                            if (!value || moment().isBefore(value, 'day')) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error('Chọn ngày trong tương lai'));
                          },
                        }),
                      ]}
                    >
                      <Input
                        size="large"
                        type="date"
                        placeholder="dd/mm/yyyy"
                        className="rounded-[10px] bg-white w-full"
                        // no select date before today
                        min={moment().format('YYYY-MM-DD')}
                      ></Input>
                    </FormItem>
                  </div>
                  <div className="flex flex-col w-full ">
                    <p className="font-[400] text-xl leading-title">Thời hạn thử việc</p>
                    <Form.Item
                      name={RECRUITMENT_DATA_FIELD.probationary_period_id}
                      className="w-full"
                    >
                      <Select
                        size="large"
                        className="!rounded-[10px] bg-white w-full h-full m-0"
                        options={MASTER_DATA_PROBATION_PERIOD.map((fields) => ({
                          key: fields.key,
                          value: fields.key,
                          label: fields.label,
                        }))}
                      />
                    </Form.Item>
                  </div>
                  <div className="flex flex-col w-full ">
                    <p className="font-[400] text-xl leading-title">Giới tính</p>
                    <Form.Item name={RECRUITMENT_DATA_FIELD.gender_id} className="w-full">
                      <Select
                        size="large"
                        className="!rounded-[10px] bg-white w-full h-full m-0"
                        options={MASTER_DATA_GENDER.map((fields) => ({
                          key: fields.key,
                          value: fields.key,
                          label: fields.label,
                        }))}
                      />
                    </Form.Item>
                  </div>
                </div>
                <p className="font-[700] text-2xl leading-title ">
                  Mức lương/tháng<span className="text-[#EB4C4C]">*</span>
                </p>
                <div className="flex flex-row gap-4 mt-5">
                  <div className="flex flex-col w-full ">
                    <p className="font-[400] text-xl leading-title">Mức lương</p>
                    <Form.Item
                      name={RECRUITMENT_DATA_FIELD.salary_type_id}
                      className="w-full"
                    >
                      <Select
                        size="large"
                        className="!rounded-[10px] bg-white w-full h-full m-0"
                        onChange={(value) => {
                          value === SalaryTypeId.DEAL &&
                            form.resetFields([
                              RECRUITMENT_DATA_FIELD.salary_min,
                              RECRUITMENT_DATA_FIELD.salary_max,
                            ]);
                          setDisableFormField({
                            ...disableFormField,
                            [RECRUITMENT_DATA_FIELD.salary_min]:
                              value === SalaryTypeId.DEAL,
                            [RECRUITMENT_DATA_FIELD.salary_max]:
                              value === SalaryTypeId.DEAL,
                          });
                        }}
                        options={MASTER_DATA_SALARY_TYPE.map((fields) => ({
                          key: fields.key,
                          value: fields.key,
                          label: fields.label,
                        }))}
                      />
                    </Form.Item>
                  </div>
                  <div className="flex flex-col w-full ">
                    <p className="font-[400] text-xl leading-title">Từ</p>

                    <FormItem
                      name={RECRUITMENT_DATA_FIELD.salary_min}
                      dependencies={[RECRUITMENT_DATA_FIELD.salary_max]}
                      className="w-full"
                      rules={[
                        ({ getFieldValue }) => ({
                          validator(value) {
                            if (disableFormField[RECRUITMENT_DATA_FIELD.salary_min]) {
                              return Promise.resolve();
                            }
                            const data = getFieldValue(RECRUITMENT_DATA_FIELD.salary_min);
                            if (data >= 500000 && data <= 1000000000) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error('Mức lương phải từ 500.000 đến 1 tỷ')
                            );
                          },
                        }),

                        {
                          required: disableFormField[RECRUITMENT_DATA_FIELD.salary_min]
                            ? false
                            : true,
                          message: 'Nhập rank lương tối thiểu',
                        },
                        {
                          pattern: new RegExp(/^[0-9]*$/),
                          message: 'Nhập số',
                        },
                        // salary_min have to smaller than salary_max
                        ({ getFieldValue }) => ({
                          validator(rule, value) {
                            if (
                              !value ||
                              Number(getFieldValue(RECRUITMENT_DATA_FIELD.salary_max)) >=
                                Number(value)
                            ) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              'Rank lương tối đa không được nhỏ hơn tối thiểu!'
                            );
                          },
                        }),
                      ]}
                    >
                      <InputNumber
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        }
                        controls={false}
                        parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                        size="large"
                        placeholder="VD:2.000.000"
                        className="rounded-[10px] bg-white w-full"
                        disabled={disableFormField[RECRUITMENT_DATA_FIELD.salary_min]}
                      />
                    </FormItem>
                  </div>
                  <div className="flex flex-col w-full ">
                    <p className="font-[400] text-xl leading-title">Đến</p>
                    <FormItem
                      name={RECRUITMENT_DATA_FIELD.salary_max}
                      className="w-full"
                      dependencies={[RECRUITMENT_DATA_FIELD.salary_min]}
                      rules={[
                        {
                          required: disableFormField[RECRUITMENT_DATA_FIELD.salary_min]
                            ? false
                            : true,
                          message: 'Nhập rank lương tối đa',
                        },
                        ({ getFieldValue }) => ({
                          validator(value) {
                            if (disableFormField[RECRUITMENT_DATA_FIELD.salary_min]) {
                              return Promise.resolve();
                            }
                            const data = getFieldValue(RECRUITMENT_DATA_FIELD.salary_min);
                            if (data >= 500000 && data <= 1000000000) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error('Mức lương phải từ 500.000 đến 1 tỷ')
                            );
                          },
                        }),
                        // salary_max must greater than salary_min
                        ({ getFieldValue }) => ({
                          validator(rule, value) {
                            if (
                              !value ||
                              Number(getFieldValue(RECRUITMENT_DATA_FIELD.salary_min)) <=
                                Number(value)
                            ) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              'Rank lương tối đa không được nhỏ hơn tối thiểu!'
                            );
                          },
                          validateTrigger: 'onBlur',
                        }),
                      ]}
                    >
                      <InputNumber
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        }
                        controls={false}
                        parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                        size="large"
                        placeholder="VD:30.000.000"
                        className="rounded-[10px] bg-white w-full"
                        disabled={disableFormField[RECRUITMENT_DATA_FIELD.salary_max]}
                      />
                    </FormItem>
                  </div>
                </div>
                <div className="card mt-10">
                  <h3 className="font-[500] text-[22px] leading-[32px] text-[#171725]">
                    Nội dung chi tiết
                  </h3>
                  <div className="flex flex-col gap-4 mt-5">
                    <div className="flex flex-row gap-4">
                      <div className="flex flex-col w-1/2 gap-[10px]">
                        <p className="font-[400] text-[18px] leading-[24px] text-[#44444F]">
                          Tổng quan <span className="text-[#EB4C4C]">*</span>
                        </p>
                      </div>
                      <div className="flex flex-col w-full gap-[10px]">
                        <FormItem
                          name={RECRUITMENT_DATA_FIELD.overview}
                          rules={[
                            {
                              required: true,
                              message: 'Nhập tổng quan cho tin tuyển dụng',
                            },
                          ]}
                        >
                          {/* <TextArea
                      rows={5}
                      size="large"
                      placeholder="Nhập thông tin vào đây"
                      className="rounded-[10px] bg-white w-full"
                      allowClear
                    /> */}
                          <Editor
                            defaultValue={form.getFieldValue([
                              RECRUITMENT_DATA_FIELD.overview,
                            ])}
                            onChange={() => {}}
                          />
                        </FormItem>
                      </div>
                    </div>
                    <div className="flex flex-row gap-4">
                      <div className="flex flex-col w-1/2 gap-[10px]">
                        <p className="font-[400] text-[16px] leading-[24px] text-[#44444F]">
                          Yêu cầu công việc <span className="text-[#EB4C4C]">*</span>
                        </p>
                      </div>
                      <div className="flex flex-col w-full gap-[10px]">
                        <FormItem
                          name={RECRUITMENT_DATA_FIELD.requirement}
                          rules={[
                            {
                              required: true,
                              message: 'Nhập yêu cầu công việc cho tin tuyển dụng',
                            },
                          ]}
                        >
                          {/* <TextArea
                      rows={5}
                      size="large"
                      placeholder="Nhập thông tin vào đây"
                      className="rounded-[10px] bg-white w-full"
                      allowClear
                    /> */}
                          <Editor
                            defaultValue={form.getFieldValue([
                              RECRUITMENT_DATA_FIELD.requirement,
                            ])}
                            onChange={() => {}}
                          />
                        </FormItem>
                      </div>
                    </div>
                    <div className="flex flex-row gap-4">
                      <div className="flex flex-col w-1/2 gap-[10px]">
                        <p className="font-[400] text-[16px] leading-[24px] text-[#44444F]">
                          Yêu cầu công việc <span className="text-[#EB4C4C]">*</span>
                        </p>
                      </div>
                      <div className="flex flex-col w-full gap-[10px]">
                        <FormItem
                          name={RECRUITMENT_DATA_FIELD.requirement}
                          rules={[
                            {
                              required: true,
                              message: 'Nhập yêu cầu công việc cho tin tuyển dụng',
                            },
                          ]}
                        >
                          {/* <TextArea
                      rows={5}
                      size="large"
                      placeholder="Nhập thông tin vào đây"
                      className="rounded-[10px] bg-white w-full"
                      allowClear
                    /> */}
                          <Editor
                            defaultValue={form.getFieldValue([
                              RECRUITMENT_DATA_FIELD.requirement,
                            ])}
                            onChange={() => {}}
                          />
                        </FormItem>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card mt-10">
                  <h3 className="font-[500] text-[22px] leading-[32px] text-[#171725]">
                    Thông tin nhận CV
                  </h3>
                  <div className="flex flex-row gap-4 mt-5">
                    <div className="flex flex-col w-full gap-[10px]">
                      <p className="font-[400] text-[16px] leading-[24px] text-[#44444F]">
                        Họ và tên <span className="text-[#EB4C4C]">*</span>
                      </p>
                      <FormItem
                        name={RECRUITMENT_DATA_FIELD.contact_name}
                        rules={[
                          { required: true, message: 'Họ và tên không được để trống!' },
                        ]}
                      >
                        <Input
                          size="large"
                          placeholder="Họ và tên"
                          className="rounded-[10px] bg-white w-full"
                          allowClear
                        ></Input>
                      </FormItem>
                    </div>
                    <div className="flex flex-col w-full gap-[10px]">
                      <p className="font-[400] text-[16px] leading-[24px] text-[#44444F]">
                        Số điện thoại <span className="text-[#EB4C4C]">*</span>
                      </p>
                      <FormItem
                        name={RECRUITMENT_DATA_FIELD.contact_phone}
                        className="w-full"
                        rules={[
                          {
                            required: true,
                            message: 'Số điện thoại không được bỏ trống!',
                          },
                          {
                            type: 'string',
                            pattern: /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/,
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
                          size="large"
                          placeholder="Số điện thoại"
                          className="rounded-[10px] bg-white w-full"
                          allowClear
                        ></Input>
                      </FormItem>
                    </div>
                    <div className="flex flex-col w-full gap-[10px]">
                      <p className="font-[400] text-[16px] leading-[24px] text-[#44444F]">
                        Email <span className="text-[#EB4C4C]">*</span>
                      </p>
                      <FormItem
                        name={RECRUITMENT_DATA_FIELD.contact_email}
                        className="w-full"
                        rules={[
                          { required: true, message: 'Email không được để trống!' },
                        ]}
                      >
                        <Input
                          size="large"
                          placeholder="Email"
                          className="rounded-[10px] bg-white w-full"
                          allowClear
                        ></Input>
                      </FormItem>
                    </div>
                  </div>
                </div>
              </div>

              <div className="m-8 w-1/3 mt-auto ">
                <div className="flex justify-center mx-auto items-center">
                  <Form.Item
                    name={RECRUITMENT_DATA_FIELD.avatar}
                    className="w-full"
                    rules={[
                      { required: true, message: 'Ảnh đại diện không được bỏ trống!' },
                    ]}
                  >
                    <FileUploader
                      defaultImage=""
                      className="flex flex-col"
                      customButton={
                        <p className="!mt-[50px] underline text-[#403ECC] text-[16px]">
                          Chỉnh sửa hình ảnh đại diện
                        </p>
                      }
                    />
                  </Form.Item>
                </div>

                <div className="companyTextarea w-full min-h-[1700px]"></div>
              </div>
            </div>
          </Form>
        </div>
      </div>
      <div className={currentStep === 1 ? '' : 'hidden'}>
        {currentStep === 1 && <RecruitmentDetailModule form={form} idPost={idPost} />}
      </div>

      {currentStep === 2 && <CreateSuccess />}
      {currentStep < 2 && (
        <div className="flex justify-between mt-5">
          <button
            className="primary-button !bg-white  !text-[#403ecc]"
            onClick={() => {
              handleSaveRecruitment(StatusId.DRAFT);
            }}
          >
            Lưu dạng nháp
          </button>
          <div className="flex gap-5">
            <button
              onClick={() => handleStepChange(true)}
              className="primary-button !bg-transparent !text-[#403ecc] !border-[#403ecc] !border !border-solid"
              type="button"
            >
              Hủy bỏ
            </button>
            {currentStep === 1 ? (
              <button
                className="primary-button"
                type="button"
                onClick={() => {
                  handleSaveRecruitment(StatusId.ACTIVE);
                }}
              >
                Về trang chủ
              </button>
            ) : (
              <button
                className="primary-button"
                type="button"
                onClick={() => {
                  handleAccountInfoChange();
                }}
              >
                Tiếp tục
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateRecruitmentModule;
