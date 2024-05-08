import SrcIcons from '@/assets/icons';
import ICareer from '@/interfaces/models/ICareer';
import { IField } from '@/interfaces/models/IField';
import { IRecruitment, SalaryTypeId } from '@/interfaces/models/IRecruitment';
import { IDistrict, IProvinces, provinceService } from '@/shared/services/provinces';
import { TOption } from '@/shared/types';
import { Form, Input, InputNumber, message, Select } from 'antd';
import { FormInstance } from 'antd/es/form/Form';
import FormItem from 'antd/lib/form/FormItem';
import TextArea from 'antd/lib/input/TextArea';
import { RcFile, UploadChangeParam, UploadFile, UploadProps } from 'antd/lib/upload';
import Dragger from 'antd/lib/upload/Dragger';
import clsx from 'clsx';
import moment from 'moment';
import Image from 'next/legacy/image';
import { useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';
import { recruitmentsAPI } from '../../shared/api';
import {
  MASTER_DATA_DEGREE,
  MASTER_DATA_EXPERIENCE,
  MASTER_DATA_GENDER,
  MASTER_DATA_LEVEL,
  MASTER_DATA_PROBATION_PERIOD,
  MASTER_DATA_SALARY_TYPE,
  MASTER_DATA_WORKING_METHOD,
} from '../../shared/constance';
import { RECRUITMENT_DATA_FIELD } from '../../shared/enums';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('@/components/Editor'), {
  loading: () => <div>loading...</div>,
  ssr: false,
});
interface Iprops {
  form?: FormInstance<IRecruitment>;
}
const { Option } = Select;

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};
export function RecruitmentForm(props: Iprops) {
  const { form } = props;
  const [fields, setFields] = useState([] as IField[]);
  const [careers, setCareers] = useState([] as ICareer[]);
  const [TAGS, setTAGS] = useState([] as TOption[]);
  const avatarFile = Form.useWatch<UploadChangeParam<UploadFile<any>>>(
    RECRUITMENT_DATA_FIELD.avatar,
    form
  );
  useEffect(() => {
    Promise.all([
      recruitmentsAPI.getFields(),
      recruitmentsAPI.getCareers(),
      recruitmentsAPI.getAllTags(),
    ]).then(([fields, careers, tags]) => {
      setFields(fields);
      setCareers(careers);
      setTAGS(
        tags.map((tag: { id: string; label: string }) => ({
          key: tag.id,
          value: tag.id,
          label: tag.label,
        }))
      );
    });
  }, []);
  const [disableFormField, setDisableFormField] = useState({
    [RECRUITMENT_DATA_FIELD.salary_max]:
      form?.getFieldValue(RECRUITMENT_DATA_FIELD.salary_type_id) === SalaryTypeId.DEAL,
    [RECRUITMENT_DATA_FIELD.salary_min]:
      form?.getFieldValue(RECRUITMENT_DATA_FIELD.salary_type_id) === SalaryTypeId.DEAL,
  });

  const [provinces, setProvinces] = useState<IProvinces[]>([]);
  const [districts, setDistricts] = useState<IDistrict[]>([]);
  const getProvincesData = useCallback(async () => {
    const res = await provinceService.fetchProvinces();
    if (res) {
      setProvinces([...res]);
    }
    if (form.getFieldValue([RECRUITMENT_DATA_FIELD.district_id])) {
      getDistrictsData(form.getFieldValue([RECRUITMENT_DATA_FIELD.city_id]));
    }
  }, []);
  const getDistrictsData = useCallback(async (province_code: number) => {
    const res = await provinceService.fetchDistricts(province_code);
    if (res) {
      setDistricts([...res]);
    }
  }, []);
  useEffect(() => {
    if (form.getFieldValue([RECRUITMENT_DATA_FIELD.avatar])) {
      form.setFields([
        {
          name: [RECRUITMENT_DATA_FIELD.avatar],
          value: form.getFieldValue([RECRUITMENT_DATA_FIELD.avatar]),
        },
      ]);
    }
    getProvincesData();
  }, []);

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Bạn chỉ có thể tải lên file JPG/PNG!');
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('File phải nhỏ hơn 5MB!');
    }

    return isJpgOrPng && isLt5M;
  };

  const handleFileChange: UploadProps['onChange'] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as RcFile, (url) => {
        form.setFields([
          {
            name: RECRUITMENT_DATA_FIELD.caching,
            value: {
              ...form.getFieldValue(RECRUITMENT_DATA_FIELD.caching),
              [RECRUITMENT_DATA_FIELD.avatar]: url,
            },
          },
        ]);
      });
    }
  };
  const handleSelectProvinces = async (
    province_code: number,
    option?: { key: string; value: number; children: string }
  ) => {
    form.setFields([
      { name: RECRUITMENT_DATA_FIELD.city_id, value: province_code },
      {
        name: RECRUITMENT_DATA_FIELD.caching,
        // update new value into caching
        value: {
          ...form.getFieldValue(RECRUITMENT_DATA_FIELD.caching),
          [RECRUITMENT_DATA_FIELD.city_id]: option,
        },
      },
    ]);
    form.resetFields([RECRUITMENT_DATA_FIELD.district_id]);
    getDistrictsData(province_code);
  };

  return (
    <>
      <div className=" min-width-[900px] customNewsDetail">
        <Form
          form={form}
          name="basic"
          initialValues={{ remember: true }}
          autoComplete="off"
          className="flex flex-col gap-[8px]"
        >
          <div className="card">
            <h3 className="font-[500] text-[22px] leading-[32px] text-[#171725] mb-6">
              Thông tin chung
            </h3>
            <div className="flex flex-row gap-4">
              <div className="flex flex-col w-full gap-[10px]">
                <div className="campaign">
                  <p className="font-[400] text-[16px] leading-[24px] text-[#44444F]">
                    Tiêu đề tuyển dụng <span className="text-[#EB4C4C]">*</span>
                  </p>
                  <FormItem
                    name={RECRUITMENT_DATA_FIELD.title}
                    className="w-full"
                    rules={[{ required: true, message: 'Nhập tên tiêu đề!' }]}
                  >
                    <Input
                      size="large"
                      placeholder="Tiêu đề tuyển dụng"
                      className="rounded-[10px] bg-white w-full"
                      allowClear
                    ></Input>
                  </FormItem>
                </div>
                <div>
                  <p className="font-[400] text-[16px] leading-[24px] text-[#44444F]">
                    Địa điểm làm việc <span className="text-[#EB4C4C]">*</span>
                  </p>
                  <div className="flex flex-row gap-4">
                    <div className="flex flex-col w-full gap-[10px]">
                      <Form.Item
                        name={RECRUITMENT_DATA_FIELD.city_id}
                        className="w-full"
                        rules={[
                          {
                            required: true,
                            message: 'Thành phố/Tỉnh không được bỏ trống!',
                          },
                        ]}
                      >
                        <Select
                          placeholder="Thành phố/Tỉnh"
                          size="large"
                          bordered={false}
                          className="border-[2px] border-solid  border-gray-300 text-gray-900 text-sm rounded-lg focus:border-[#22216D] block w-full"
                          onChange={(
                            value,
                            option: { key: string; value: number; children: string }
                          ) => {
                            console.log(option.children);
                            handleSelectProvinces(value, option);
                          }}
                          allowClear
                        >
                          {provinces.map((item) => (
                            <Option key={item.codename} value={item.code}>
                              {item.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </div>
                    <div className="flex flex-col w-full gap-[10px]">
                      <Form.Item
                        name={RECRUITMENT_DATA_FIELD.district_id}
                        className="w-full"
                        rules={[
                          {
                            required: true,
                            message: 'Quận/Huyện không được bỏ trống!',
                          },
                        ]}
                      >
                        <Select
                          placeholder="Quận/Huyện"
                          size="large"
                          bordered={false}
                          className="border-[2px] border-solid  border-gray-300 text-gray-900 text-sm rounded-lg focus:border-[#22216D] block w-full"
                          onChange={(
                            value,
                            option: { key: string; value: number; children: string }
                          ) => {
                            form.setFields([
                              { name: RECRUITMENT_DATA_FIELD.district_id, value: value },
                              {
                                name: RECRUITMENT_DATA_FIELD.caching,
                                // update new value into caching
                                value: {
                                  ...form.getFieldValue(RECRUITMENT_DATA_FIELD.caching),
                                  [RECRUITMENT_DATA_FIELD.district_id]: option,
                                },
                              },
                            ]);
                          }}
                          allowClear
                        >
                          {districts &&
                            districts.map((item) => (
                              <Option key={item.codename} value={item.code}>
                                {item.name}
                              </Option>
                            ))}
                        </Select>
                      </Form.Item>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="font-[400] text-[16px] leading-[24px] text-[#44444F]">
                    Địa chỉ chi tiết <span className="text-[#EB4C4C]">*</span>
                  </p>
                  <FormItem
                    name={RECRUITMENT_DATA_FIELD.map_url}
                    className="w-full"
                    rules={[{ required: true, message: 'Nhập địa chỉ chi tiết!' }]}
                  >
                    <Input
                      size="large"
                      placeholder="Địa chỉ chi tiết"
                      className="rounded-[10px] bg-white w-full"
                      allowClear
                    ></Input>
                  </FormItem>
                </div>
              </div>
              <div className="flex flex-col w-full gap-[10px]">
                <p className="font-[400] text-xl ">
                  Hình ảnh đại diện tin tuyển <span className="text-[#EB4C4C]">*</span>
                </p>
                <p className="font-[400] mb-1 text-[14px] text-[#696974] ">
                  Dung lượng file không được quá 5mb, kích thước 1200x300 px
                </p>
                <FormItem
                  name={RECRUITMENT_DATA_FIELD.avatar}
                  className="w-full h-full"
                  rules={[
                    { required: true, message: 'Chọn hình ảnh đại diện tin tuyển dụng!' },
                  ]}
                >
                  <Dragger
                    className="h-full bg-[#F1F1F5] !rounded-[10px] !border-[3px] !border-dashed border-[#D5D5DC] !overflow-hidden"
                    maxCount={1}
                    // upload only png or jpg file
                    beforeUpload={beforeUpload}
                    onChange={handleFileChange}
                    fileList={avatarFile?.fileList}
                  >
                    {form.getFieldValue(RECRUITMENT_DATA_FIELD.image_url) ? (
                      <div className="relative w-full min-h-[52px]">
                        <Image
                          src={form.getFieldValue(RECRUITMENT_DATA_FIELD.image_url)}
                          alt="Eztek Doanh nghiệp"
                          layout="fill"
                        />
                      </div>
                    ) : (
                      <p className="ant-upload-drag-icon">
                        <Image
                          src={SrcIcons.file_plus}
                          width={42}
                          height={52}
                          alt="Eztek Doanh nghiệp"
                        />
                      </p>
                    )}
                    <p className="ant-upload-text">
                      Kéo thả file vào đây hoặc chọn file từ máy tính
                    </p>
                    <p className="ant-upload-hint">
                      Kích thước: {Number(avatarFile?.file?.size / 1048576).toFixed(3)} MB
                    </p>
                    {avatarFile?.file?.name && (
                      <p className="ant-upload-hint">
                        Tên file: {avatarFile?.file?.name}
                      </p>
                    )}
                  </Dragger>
                </FormItem>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-row gap-4 mt-4">
                <div className="flex flex-col w-full gap-[10px]">
                  <p className="font-[400] text-[16px] leading-[24px] text-[#44444F]">
                    Hình thức làm việc <span className="text-[#EB4C4C]">*</span>
                  </p>
                  <FormItem
                    name={RECRUITMENT_DATA_FIELD.form_of_work_id}
                    className="w-full"
                    rules={[{ required: true, message: 'Chọn hình thức làm việc' }]}
                  >
                    <Select
                      size="large"
                      placeholder="Chọn hình thức làm việc"
                      className="!rounded-[10px] bg-white w-full"
                      allowClear
                    >
                      {MASTER_DATA_WORKING_METHOD.map((item: TOption) => (
                        <Select.Option key={item.key} value={item.key}>
                          {item.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </FormItem>
                </div>
                <div className="flex flex-col w-full gap-[10px]">
                  <p className="font-[400] text-[16px] leading-[24px] text-[#44444F]">
                    Bằng cấp <span className="text-[#EB4C4C]">*</span>
                  </p>
                  <FormItem
                    name={RECRUITMENT_DATA_FIELD.diploma_id}
                    className="w-full"
                    rules={[{ required: true, message: 'Chọn bằng cấp' }]}
                  >
                    <Select
                      size="large"
                      placeholder="Chọn bằng cấp"
                      className="!rounded-[10px] bg-white w-full"
                      allowClear
                    >
                      {MASTER_DATA_DEGREE.map((item: TOption) => (
                        <Select.Option key={item.key} value={item.key}>
                          {item.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </FormItem>
                </div>
                <div className="flex flex-col w-full gap-[10px]">
                  <p className="font-[400] text-[16px] leading-[24px] text-[#44444F]">
                    Kinh nghiệm <span className="text-[#EB4C4C]">*</span>
                  </p>
                  <FormItem
                    name={RECRUITMENT_DATA_FIELD.experience_id}
                    className="w-full"
                    rules={[{ required: true, message: 'Chọn kinh nghiệm' }]}
                  >
                    <Select
                      size="large"
                      placeholder="Chọn kinh nghiệm"
                      className="!rounded-[10px] bg-white w-full"
                      allowClear
                    >
                      {MASTER_DATA_EXPERIENCE.map((item: TOption) => (
                        <Select.Option key={item.key} value={item.key}>
                          {item.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </FormItem>
                </div>
              </div>
              <div className="flex flex-row gap-4">
                <div className="flex flex-col w-full gap-[10px]">
                  <p className="font-[400] text-[16px] leading-[24px] text-[#44444F]">
                    Cấp bậc <span className="text-[#EB4C4C]">*</span>
                  </p>
                  <FormItem
                    name={RECRUITMENT_DATA_FIELD.level_id}
                    className="w-full"
                    rules={[{ required: true, message: 'Chọn cấp bậc' }]}
                  >
                    <Select
                      size="large"
                      placeholder="Chọn cấp bậc"
                      className="!rounded-[10px] bg-white w-full"
                      allowClear
                    >
                      {MASTER_DATA_LEVEL.map((item: TOption) => (
                        <Select.Option key={item.key} value={item.key}>
                          {item.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </FormItem>
                </div>
                <div className="flex flex-col w-full gap-[10px]">
                  <p className="font-[400] text-[16px] leading-[24px] text-[#44444F]">
                    Lĩnh vực <span className="text-[#EB4C4C]">*</span>
                  </p>
                  <FormItem
                    name={RECRUITMENT_DATA_FIELD.career_field_id}
                    className="w-full"
                    rules={[{ required: true, message: 'Chọn lĩnh vực' }]}
                  >
                    <Select
                      size="large"
                      placeholder="Chọn lĩnh vực"
                      className="!rounded-[10px] bg-white w-full"
                      allowClear
                      onChange={(value, option) => {
                        form.setFields([
                          {
                            name: RECRUITMENT_DATA_FIELD.caching,
                            // update new value into caching
                            value: {
                              ...form.getFieldValue(RECRUITMENT_DATA_FIELD.caching),
                              [RECRUITMENT_DATA_FIELD.career_field_id]: option,
                            },
                          },
                        ]);
                      }}
                    >
                      {fields &&
                        fields.map((fields: IField) => (
                          <Option
                            key={fields.id}
                            value={fields.id}
                            className={clsx('font-[400] text-sm text-[#696974]')}
                          >
                            {fields.name}
                          </Option>
                        ))}
                    </Select>
                  </FormItem>
                </div>
                <div className="flex flex-col w-full gap-[10px]">
                  <p className="font-[400] text-[16px] leading-[24px] text-[#44444F]">
                    Nghề <span className="text-[#EB4C4C]">*</span>
                  </p>
                  <FormItem
                    name={RECRUITMENT_DATA_FIELD.career_id}
                    className="w-full"
                    rules={[{ required: true, message: 'Chọn nghề' }]}
                  >
                    <Select
                      size="large"
                      placeholder="Chọn nghề"
                      className="!rounded-[10px] bg-white w-full"
                      allowClear
                      onChange={(value, option) => {
                        form.setFields([
                          {
                            name: RECRUITMENT_DATA_FIELD.caching,
                            // update new value into caching
                            value: {
                              ...form.getFieldValue(RECRUITMENT_DATA_FIELD.caching),
                              [RECRUITMENT_DATA_FIELD.career_id]: option,
                            },
                          },
                        ]);
                      }}
                    >
                      {careers &&
                        careers.map((career: ICareer) => (
                          <Option
                            key={career.id}
                            value={career.id}
                            className={clsx('font-[400] text-sm text-[#696974]')}
                          >
                            {career.name}
                          </Option>
                        ))}
                    </Select>
                  </FormItem>
                </div>
              </div>
              <div className="flex flex-row gap-4">
                <div className="flex flex-col w-full gap-[10px]">
                  <p className="font-[400] text-[16px] leading-[24px] text-[#44444F]">
                    Hạn nhận hồ sơ <span className="text-[#EB4C4C]">*</span>
                  </p>
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
                <div className="flex flex-col w-full gap-[10px]">
                  <p className="font-[400] text-[16px] leading-[24px] text-[#44444F]">
                    Thời hạn thử việc <span className="text-[#EB4C4C]">*</span>
                  </p>
                  <FormItem
                    name={RECRUITMENT_DATA_FIELD.probationary_period_id}
                    className="w-full"
                    rules={[{ required: true, message: 'Chọn thời hạn thử việc' }]}
                  >
                    <Select
                      size="large"
                      placeholder="Chọn thời hạn thử việc"
                      className="!rounded-[10px] bg-white w-full"
                      allowClear
                    >
                      {MASTER_DATA_PROBATION_PERIOD.map((item: TOption) => (
                        <Select.Option key={item.key} value={item.key}>
                          {item.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </FormItem>
                </div>
                <div className="flex flex-col w-full gap-[10px]">
                  <p className="font-[400] text-[16px] leading-[24px] text-[#44444F]">
                    Giới tính <span className="text-[#EB4C4C]">*</span>
                  </p>
                  <FormItem
                    name={RECRUITMENT_DATA_FIELD.gender_id}
                    className="w-full"
                    rules={[{ required: true, message: 'Chọn giới tính' }]}
                  >
                    <Select
                      size="large"
                      placeholder="Chọn giới tính"
                      className="!rounded-[10px] bg-white w-full"
                      allowClear
                    >
                      {MASTER_DATA_GENDER.map((item: TOption) => (
                        <Select.Option key={item.key} value={item.key}>
                          {item.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </FormItem>
                </div>
              </div>
              <div className="flex flex-col w-full gap-[10px]">
                <p className="font-[400] text-[16px] leading-[24px] text-[#44444F]">
                  Tag&nbsp;<span className="text-[#EB4C4C]">*</span>
                </p>
                <Form.Item
                  name={RECRUITMENT_DATA_FIELD.tags}
                  className="w-full"
                  rules={[{ required: true, message: 'Nhấn enter để tạo tag hoặc chọn' }]}
                >
                  <Select
                    mode="tags"
                    size="large"
                    placeholder="Chọn tag"
                    className="!rounded-[10px] bg-white"
                    allowClear
                    optionFilterProp="label"
                  >
                    {TAGS &&
                      TAGS.map((tag: TOption) => (
                        <Option key={tag.key} value={tag.label}>
                          {tag.name}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </div>
            </div>
            <h3 className="font-[500] text-[22px] leading-[32px] text-[#171725] mt-4 ">
              Mức lương/tháng
            </h3>
            <div className="flex flex-row gap-4 mt-5">
              <div className="flex flex-col w-full gap-[10px]">
                <p className="font-[400] text-[16px] leading-[24px] text-[#44444F]">
                  Kiểu lương&nbsp;<span className="text-[#EB4C4C]">*</span>
                </p>
                <FormItem
                  name={RECRUITMENT_DATA_FIELD.salary_type_id}
                  rules={[{ required: true, message: 'Chọn kiểu lương' }]}
                >
                  <Select
                    size="large"
                    placeholder="Chọn kiểu lương"
                    className="!rounded-[10px] bg-white w-full"
                    allowClear
                    onChange={(value) => {
                      value === SalaryTypeId.DEAL &&
                        form.resetFields([
                          RECRUITMENT_DATA_FIELD.salary_min,
                          RECRUITMENT_DATA_FIELD.salary_max,
                        ]);
                      setDisableFormField({
                        ...disableFormField,
                        [RECRUITMENT_DATA_FIELD.salary_min]: value === SalaryTypeId.DEAL,
                        [RECRUITMENT_DATA_FIELD.salary_max]: value === SalaryTypeId.DEAL,
                      });
                    }}
                  >
                    {MASTER_DATA_SALARY_TYPE.map((item: TOption) => (
                      <Select.Option key={item.key} value={item.key}>
                        {item.label}
                      </Select.Option>
                    ))}
                  </Select>
                </FormItem>
              </div>
              <div className="flex flex-col w-full gap-[10px]">
                <p className="font-[400] text-[16px] leading-[24px] text-[#44444F]">Từ</p>
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
              <div className="flex flex-col w-full gap-[10px]">
                <p className="font-[400] text-[16px] leading-[24px] text-[#44444F]">
                  Đến
                </p>
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
          </div>

          <div className="card">
            <h3 className="font-[500] text-[22px] leading-[32px] text-[#171725]">
              Nội dung chi tiết
            </h3>
            <div className="flex flex-col gap-4 mt-5">
              <div className="flex flex-row gap-4">
                <div className="flex flex-col w-1/2 gap-[10px]">
                  <p className="font-[400] text-[16px] leading-[24px] text-[#44444F]">
                    Tổng quan <span className="text-[#EB4C4C]">*</span>
                  </p>
                </div>
                <div className="flex flex-col w-full gap-[10px]">
                  <FormItem
                    name={RECRUITMENT_DATA_FIELD.overview}
                    rules={[
                      { required: true, message: 'Nhập tổng quan cho tin tuyển dụng' },
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
                      defaultValue={form.getFieldValue([RECRUITMENT_DATA_FIELD.overview])}
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
                    Quyền lợi <span className="text-[#EB4C4C]">*</span>
                  </p>
                </div>
                <div className="flex flex-col w-full gap-[10px]">
                  <FormItem
                    name={RECRUITMENT_DATA_FIELD.benefit}
                    rules={[
                      {
                        required: true,
                        message: 'Nhập quyền lợi cho tin tuyển dụng',
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
                      defaultValue={form.getFieldValue([RECRUITMENT_DATA_FIELD.benefit])}
                      onChange={() => {}}
                    />
                  </FormItem>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
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
                  rules={[{ required: true, message: 'Họ và tên không được để trống!' }]}
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
                    { required: true, message: 'Số điện thoại không được bỏ trống!' },
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
                  rules={[{ required: true, message: 'Email không được để trống!' }]}
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

          <FormItem name={RECRUITMENT_DATA_FIELD.caching} className="w-full"></FormItem>
        </Form>
      </div>
    </>
  );
}
