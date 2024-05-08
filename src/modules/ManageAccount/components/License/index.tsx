import SrcIcons from '@/assets/icons';
import { Button, Form, message, Modal, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import Image from 'next/legacy/image';
import { IconButton } from '@/components/IconButton';
import { LicenseView } from '../LicenseView';
import { IRepresent } from '@/interfaces/models/IRepresent';
import Dragger from 'antd/lib/upload/Dragger';
import { RcFile } from 'antd/lib/upload';
import { accountAPI } from '../../shared/api';
import { SV_RES_STATUS_CODE } from '@/shared/enums/enums';
import { appLibrary } from '@/shared/utils/loading';
import { apiEnterprise } from '@/shared/axios/apiv3';
import clsx from 'clsx';
import { JOBS_STATUS } from '../../shared/enum';

export interface IProps {
  account: IRepresent;
}

interface IUpload {
  open: boolean;
  onChange(openState: boolean): void;
  setFile(file: RcFile): void;
  setPreview(file: string | ArrayBuffer): void;
}

const toBase64 = (file: RcFile) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const beforeUploadCheck = (file: RcFile) => {
  console.log(URL.createObjectURL(file));
  const isJpgOrPng =
    file.type === 'image/jpeg' ||
    file.type === 'image/png' ||
    file.type === 'application/pdf';
  if (!isJpgOrPng) {
    message.error('Hãy sử dụng ảnh có định dạng là JPG/PNG hoặc file PDF!');
  }
  const isLt2M = file.size / 1024 / 1024 < 5;
  if (!isLt2M) {
    message.warning('Kích cỡ ảnh không nên quá 5MB!');
  }
  return isJpgOrPng && isLt2M;
};

const LicenseUpload = ({ open, onChange, setFile, setPreview }: IUpload) => {
  const handleBeforeUpload = async (value) => {
    if (!beforeUploadCheck(value)) {
      return;
    }
    const preview = await toBase64(value);
    if (preview) {
      setPreview(preview as string);
    }
    setFile(value);
  };

  return (
    <Modal
      open={open}
      className="min-w-[1000px]"
      onCancel={() => {
        setFile(null);
        onChange(false);
      }}
      onOk={() => {
        onChange(false);
      }}
    >
      <div className="min-w-[600px] mt-4">
        <Dragger
          className="h-full"
          maxCount={1}
          onRemove={() => {
            setPreview(null);
            setFile(null);
          }}
          beforeUpload={handleBeforeUpload}
        >
          <p className="ant-upload-drag-icon">
            <Image src={SrcIcons.file_plus} width={42} height={52} />
          </p>
          <p className="ant-upload-text">
            Kéo thả file vào đây hoặc chọn file từ máy tính
          </p>
        </Dragger>
      </div>
    </Modal>
  );
};

export function LicenseForm() {
  const [enterpriseStatus, setEnterpriseStatus] = useState<string>('');
  const [reasonRejection, setReasonRejection] = useState<string>(null);
  const [openLicense, setOpenLicense] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  const [previewUrl, setPrevieweUrl] = useState(null);
  const [uploadLicense, setUploadLicense] = useState(false);
  const [uploadLicenseFile, setUploadLicenseFile] = useState<RcFile>();
  const handleUploadChange = (value: RcFile) => {
    setUploadLicenseFile(value);
  };

  const getStatus = async () => {
    appLibrary.showloading();
    try {
      const {
        data: { status, reason_of_rejection },
      } = await accountAPI.getStatus();
      console.log(`${status}   ${reason_of_rejection}`);
      if (status) {
        setEnterpriseStatus(status);
        setReasonRejection(reason_of_rejection);
        appLibrary.hideloading();
        return;
      }
      console.log('cant load status');
      appLibrary.hideloading();
    } catch (error) {
      console.log(error);
      appLibrary.hideloading();
    }
  };

  const postEnterpriseLicense = async (file: RcFile) => {
    appLibrary.showloading();
    try {
      const fmData = new FormData();
      fmData.append('business_license', file);
      const { code } = await accountAPI.postEnterpriseLicense(fmData);
      console.log(code);
      if (code === SV_RES_STATUS_CODE.success) {
        message.success('Cập nhật thành công');
        await getLicense();
        appLibrary.hideloading();
        return;
      }
      appLibrary.hideloading();
      message.error('Cập nhật không thành công');
    } catch (error) {
      message.error('Cập nhật không thành công');
      console.log(error);
      appLibrary.hideloading();
    }
  };

  const handlePreviewChange = (value: string | ArrayBuffer) => {
    setPrevieweUrl(value);
  };

  const getLicense = async () => {
    try {
      const { data } = await accountAPI.getEnterpriseLicense();
      if (data) {
        return setFileUrl(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitLicense = () => {
    if (!uploadLicenseFile) {
      return;
    }
    postEnterpriseLicense(uploadLicenseFile);
    setUploadLicenseFile(null);
    setPrevieweUrl(null);
  };

  useEffect(() => {
    getStatus();
    getLicense();
  }, []);
  return (
    <>
      <LicenseView
        fileUrl={previewUrl ? previewUrl : fileUrl}
        open={openLicense}
        onChange={(value) => {
          setOpenLicense(value);
        }}
      />
      <LicenseUpload
        open={uploadLicense}
        setPreview={handlePreviewChange}
        onChange={(value) => {
          setUploadLicense(value);
        }}
        setFile={handleUploadChange}
      />
      <div className="min-w-[900px] coupon">
        <Form name="basic" autoComplete="off" className="flex flex-col gap-[8px]">
          <div className="flex flex-row gap-4 border-solid border-b border-[#D5D5DC] pb-5">
            <div className="flex flex-col w-full ">
              <p className="font-[400]  text-xl leading-title">Trạng thái</p>
            </div>

            <div className="flex flex-col w-full ">
              <Tooltip
                title={enterpriseStatus === 'REJECTED' ? reasonRejection : null}
                placement="topLeft"
              >
                <p
                  className={clsx(
                    'font-[400]  text-[18px] leading-title',
                    enterpriseStatus === 'APPROVED'
                      ? 'text-[#30AB7E]'
                      : enterpriseStatus === 'PENDING'
                      ? 'text-[#3BB1CF]'
                      : ''
                  )}
                >
                  {JOBS_STATUS[enterpriseStatus]}
                </p>
              </Tooltip>
            </div>
          </div>

          <div className="create-counpon flex flex-row gap-4 border-solid border-b border-[#D5D5DC] pb-5">
            <div className="flex flex-col w-full gap-[10px]">
              <p className="font-[400] text-[18px] leading-title">
                Giấy phép kinh doanh hợp lệ
              </p>
              <ul className="text-[#696974] text-[16px] list-disc ml-5">
                <li className="text-[16px]">
                  Có dấu giáp lai của cơ quan có thẩm quyền.
                </li>
                <li className="text-[16px]">
                  Trường hợp có giấy phép kinh doanh là bản photo thì phải có dấu công
                  chứng.
                </li>
                <li className="text-[16px]">Dung lượng file không quá 5mb</li>
              </ul>
            </div>

            <div className="flex flex-row w-full justify-between">
              <div className="flex flex-col gap-[10px]">
                <Form.Item name="license" className="w-full">
                  {fileUrl === '' && previewUrl === null ? (
                    <h2>Chưa có giấy phép kinh doanh</h2>
                  ) : (
                    <IconButton
                      className="!rounded-[10px] !p-0"
                      onClick={() => {
                        setOpenLicense(true);
                      }}
                    >
                      <Image src={SrcIcons.attachment} height={20} width={20} />
                      &nbsp;
                      <p className="font-[400] text-[16px] ">Giấy phép kinh doanh</p>
                    </IconButton>
                  )}
                </Form.Item>
              </div>

              <div className="ml">
                <Form.Item name="license_upload" className="w-full">
                  <IconButton
                    className="!rounded-[10px] !p-0"
                    onClick={() => {
                      setUploadLicense(true);
                    }}
                  >
                    <Image src={SrcIcons.editIcon} height={20} width={20} />
                  </IconButton>
                </Form.Item>
              </div>
            </div>
          </div>

          <div className="create-counpon flex flex-row gap-4 pb-5">
            <div className="flex flex-col w-full gap-[10px]">
              <p className="font-[400] text-[18px] leading-title">Giấy tờ bổ sung</p>
              <ul className="text-[#696974] text-[16px] ">
                <li className="text-[16px]">Giấy tờ bổ sung</li>
              </ul>
            </div>

            <div className="flex flex-col w-full gap-[10px]">
              <Form.Item name="additional_license" className="w-full">
                <IconButton className="!rounded-[10px] !p-0" onClick={() => {}}>
                  <Image
                    src={SrcIcons.attachment}
                    height={20}
                    width={20}
                    alt="Eztek Doanh nghiệp"
                  />
                  &nbsp;
                  {/* <p className="font-[400] text-[16px] ">Giấy phép kinh doanh</p> */}
                </IconButton>
              </Form.Item>
            </div>
          </div>

          <Form.Item>
            <Button
              className="bg-primary hover:bg-primary text-white hover:text-white focus:bg-primary focus:text-white rounded-[10px] font-[600] leading-[21px] flex justify-center items-center w-auto px-[20px] py-[20px] drop-shadow-[0_0px_7px_rgba(41,41,50,0.1)]"
              onClick={handleSubmitLicense}
            >
              Lưu thay đổi
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
}
