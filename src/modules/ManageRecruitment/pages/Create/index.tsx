import SrcImages from '@/assets/images';
import { IEnterprise } from '@/interfaces/models/IEnterprise';
import { IRecruitment, SalaryTypeId, StatusId } from '@/interfaces/models/IRecruitment';
import { ProgressBar } from '@/modules/SignUp/components/ProgressBar';
import { SV_RES_STATUS_CODE } from '@/shared/enums/enums';
import { showAntFormError, showResponseError } from '@/shared/utils/common';
import { appLibrary } from '@/shared/utils/loading';
import { Form, message } from 'antd';
import Image from 'next/legacy/image';
import { useState } from 'react';
import useSWR from 'swr';
import { RecruitmentForm } from '../../components/RecruitmentForm';
import { recruitmentsAPI } from '../../shared/api';
import { RECRUITMENT_DATA_FIELD } from '../../shared/enums';
import RecruitmentDetailModule from '../Detail';
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
            alt="Youth+ Doanh nghiệp"
            src={SrcImages.completeCreateRecruit}
          />
        </div>
      </div>
    </div>
  );
};

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
      const { code } = await recruitmentsAPI.createRecruitment(formData);
      if (code === SV_RES_STATUS_CODE.success) {
        setCurrentStep(steps.length);
        message.success(
          status === StatusId.DRAFT ? 'Đã lưu bản nháp' : 'Tạo tin tuyển dụng thành công'
        );
      }
      appLibrary.hideloading();
    } catch (error) {
      appLibrary.hideloading();
      console.log(error);
      showResponseError(error);
    }
  };

  const handleSaveRecruitment = async (status: StatusId) => {
    onCreateRecruitment(status);
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
        <RecruitmentForm form={form} />
      </div>
      <div className={currentStep === 1 ? '' : 'hidden'}>
        {currentStep === 1 && (
          <RecruitmentDetailModule form={form} enterpriseInfo={enterpriseInfo} />
        )}
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
                Lưu tin
              </button>
            ) : (
              <button
                className="primary-button"
                type="button"
                onClick={() => {
                  handleStepChange();
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
