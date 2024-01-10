import { IRecruitment, SalaryTypeId, StatusId } from '@/interfaces/models/IRecruitment';
import { SV_RES_STATUS_CODE } from '@/shared/enums/enums';
import { showResponseError } from '@/shared/utils/common';
import { appLibrary } from '@/shared/utils/loading';
import { Form, message } from 'antd';
import { useEffect } from 'react';
import { RecruitmentForm } from '../../components/RecruitmentForm';
import { recruitmentsAPI } from '../../shared/api';
import { RECRUITMENT_DATA_FIELD } from '../../shared/enums';

type Props = {
  recruitment: IRecruitment;
};
const EditRecruitmentModule = (props: Props) => {
  const { recruitment } = props;
  console.log(recruitment);
  const [form] = Form.useForm<IRecruitment>();
  useEffect(() => {
    form.setFieldsValue(recruitment);
  }, [recruitment]);

  const handleSaveRecruitment = async (status: StatusId) => {
    const formData = new FormData();
    const data = form.getFieldsValue();
    data.status_id = status;
    delete data?.caching;
    if (data.salary_type_id === SalaryTypeId.DEAL) {
      delete data.salary_min;
      delete data.salary_max;
    }
    Object.keys(data).forEach((key) => {
      if (key === RECRUITMENT_DATA_FIELD.avatar) {
        const { avatar } = form.getFieldsValue([RECRUITMENT_DATA_FIELD.avatar]);
        avatar && formData.append('avatar', avatar?.file?.originFileObj);
        return;
      }
      if (key === RECRUITMENT_DATA_FIELD.tags) {
        const { tags } = form.getFieldsValue([RECRUITMENT_DATA_FIELD.tags]);

        tags &&
          Array.from(tags.length > 0 ? tags : []).forEach((tag) =>
            formData.append('tags[]', `${tag}`)
          );
        return;
      }
      formData.append(key, data[key]);
    });
    onCreateRecruitment(status, formData);
  };

  const onCreateRecruitment = async (status: StatusId, formData: FormData) => {
    try {
      appLibrary.showloading();
      const { code } = await recruitmentsAPI.updateRcruitment(recruitment.id, formData);
      if (code === SV_RES_STATUS_CODE.success) {
        message.success(
          status === StatusId.DRAFT ? 'Đã lưu bản nháp' : 'Cập nhật tuyển dụng thành công'
        );
      }
      appLibrary.hideloading();
    } catch (error) {
      appLibrary.hideloading();
      console.log(error);
      showResponseError(error);
    }
  };

  return (
    <>
      <RecruitmentForm form={form} />
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
            className="primary-button !bg-transparent !text-[#403ecc] !border-[#403ecc] !border !border-solid"
            type="button"
          >
            Hủy bỏ
          </button>
          <button
            className="primary-button"
            type="button"
            onClick={() => {
              handleSaveRecruitment(StatusId.ACTIVE);
            }}
          >
            Lưu tin
          </button>
        </div>
      </div>
    </>
  );
};

export default EditRecruitmentModule;
