import SrcIcons from '@/assets/icons';
import SrcImages from '@/assets/images';
import { IEnterprise } from '@/interfaces/models/IEnterprise';
import { ScaleId } from '@/interfaces/models/IRecruitment';
import { numberWithCommas } from '@/shared/helpers';
import { FormInstance } from 'antd/es/form/Form';
import clsx from 'clsx';
import Image from 'next/legacy/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { TruncateLines } from 'react-truncate-lines';
import {
  MASTER_DATA_EXPERIENCE_MAP,
  MASTER_DATA_GENDER_MAP,
  MASTER_DATA_LEVEL_MAP,
  MASTER_DATA_PROBATION_PERIOD_MAP,
  MASTER_DATA_WORKING_METHOD_MAP,
} from '../../shared/constance';
import { RECRUITMENT_DATA_FIELD } from '../../shared/enums';

interface IProps {
  form: FormInstance<any>;
  enterpriseInfo: IEnterprise;
}
const RecruitmentDetailModule = (props: IProps) => {
  const { form, enterpriseInfo } = props;
  const [formValues, setFormValues] = useState<RECRUITMENT_DATA_FIELD>(
    form?.getFieldsValue()
  );
  const side1 = useMemo(
    () => [
      {
        title: 'Kinh nghiệm',
        subTitle: MASTER_DATA_EXPERIENCE_MAP.get(
          formValues[RECRUITMENT_DATA_FIELD.experience_id]
        )?.label,
      },
      {
        title: 'Cấp bậc',
        subTitle: MASTER_DATA_LEVEL_MAP.get(formValues[RECRUITMENT_DATA_FIELD.level_id])
          ?.label,
      },
      {
        title: 'Hình thức',
        subTitle: MASTER_DATA_WORKING_METHOD_MAP.get(
          formValues[RECRUITMENT_DATA_FIELD.form_of_work_id]
        )?.label,
      },
      {
        title: 'Mức lương',
        subTitle: formValues[RECRUITMENT_DATA_FIELD.salary_min]
          ? `${numberWithCommas(formValues[RECRUITMENT_DATA_FIELD.salary_min])} -
          ${numberWithCommas(formValues[RECRUITMENT_DATA_FIELD.salary_max])}`
          : 'Thỏa thuận',
      },
    ],
    [form]
  );

  const side2 = useMemo(
    () => [
      {
        title: 'Giới tính',
        subTitle: MASTER_DATA_GENDER_MAP.get(formValues[RECRUITMENT_DATA_FIELD.gender_id])
          ?.label,
      },
      {
        title: 'Bằng cấp',
        subTitle: MASTER_DATA_LEVEL_MAP.get(formValues[RECRUITMENT_DATA_FIELD.level_id])
          ?.label,
      },
      {
        title: 'Thời hạn thử việc',
        subTitle: MASTER_DATA_PROBATION_PERIOD_MAP.get(
          formValues[RECRUITMENT_DATA_FIELD.probationary_period_id]
        )?.label,
      },
      {
        title: 'Hạn nhận hồ sơ',
        subTitle: formValues[RECRUITMENT_DATA_FIELD.deadline],
      },
    ],
    [form]
  );
  useEffect(() => {}, [form]);
  return (
    <div className="bg-white rounded-[10px] flex flex-col xl:flex-row xl:bg-transparent gap-5 ">
      <div className="rounded-[10px] flex flex-col w-full overflow-hidden bg-white xl:card !shadow-none">
        <div className="cover relative h-[173px] md:h-[266px] ">
          <Image
            src={
              formValues[RECRUITMENT_DATA_FIELD.caching]?.avatar ?? SrcImages.sideImage
            }
            alt="Eztek Doanh nghiệp"
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="flex flex-col contentpt-0 ">
          <div className="recruitment  p-[15px] md:p-[24px] ">
            {/* title and subinfo */}
            <div className="title flex justify-between items-center flex-col-reverse md:flex-row">
              <div className="w-full ">
                <h1 className="leading-[32px] text-primary font-[500] text-[24px] xl:text-[24px] mb-5">
                  {formValues[RECRUITMENT_DATA_FIELD.title]}
                </h1>
              </div>
              <div className="icons flex w-fit items-center -translate-y-[40%] text-left">
                <div className="sm:hidden relative border-[4px] border-solid border-[#FAFAFB] bg-[#FAFAFB] rounded-[10px] overflow-hidden h-16 w-16">
                  <Image
                    src={enterpriseInfo.avatar}
                    alt="Eztek Doanh nghiệp"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
                <div className="flex gap-4 ml-auto">
                  <div className="bg-white relative ml-auto p-2 rounded-[10px] h-[34px] w-[34px] drop-shadow-[0_0_2px_rgba(0,0,0,0.25)]">
                    <Image
                      width={20}
                      height={20}
                      src={SrcIcons.bookmark}
                      alt="Eztek Doanh nghiệp"
                    />
                  </div>
                  <div className="bg-white relative p-2 rounded-[10px] h-[34px] w-[34px] drop-shadow-[0_0_2px_rgba(0,0,0,0.25)]">
                    <Image
                      width={20}
                      height={20}
                      src={SrcIcons.attachment}
                      alt="Eztek Doanh nghiệp"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2">
              {Array.from([
                `${
                  formValues[RECRUITMENT_DATA_FIELD.caching][
                    RECRUITMENT_DATA_FIELD.district_id
                  ]?.children
                } - ${
                  formValues[RECRUITMENT_DATA_FIELD.caching][
                    RECRUITMENT_DATA_FIELD.city_id
                  ]?.children
                }`,
                formValues[RECRUITMENT_DATA_FIELD.caching][
                  RECRUITMENT_DATA_FIELD.career_id
                ]?.children,
                formValues[RECRUITMENT_DATA_FIELD.caching][
                  RECRUITMENT_DATA_FIELD.career_field_id
                ]?.children,
                formValues[RECRUITMENT_DATA_FIELD.caching][
                  RECRUITMENT_DATA_FIELD.career_field_id
                ]?.children,
              ]).map((item, index) =>
                index !== 2 ? (
                  <p
                    className={clsx(
                      index % 2 === 0 ? '' : 'sm:ml-auto',
                      'font-[300] text-[18px] leading-[28px] text-[#44444F]'
                    )}
                  >
                    {index === 3 && <span>Lĩnh vực - </span>} {item}
                  </p>
                ) : (
                  <div className={clsx('flex items-end')}>
                    <div className="flex flex-nowrap">
                      {Array.from({ length: 5 }, (_, index) => {
                        if (index < 3) {
                          return (
                            <div
                              className="h-8 w-8 rounded-full border-[1px] border-solid border-[#E2E2EA] relative overflow-hidden bg-white"
                              style={{
                                zIndex: 100 - index * 10,
                                transform: `translateX(${-index * 8}px)`,
                              }}
                            >
                              <Image
                                layout="fill"
                                objectFit="contain"
                                src={SrcImages.defaultAvatar}
                                alt="Principal UX Designer"
                              />
                            </div>
                          );
                        }
                        if (index === 3) {
                          return (
                            <div
                              className="flex h-8 w-8 rounded-full border-[1px] border-solid border-[#E2E2EA] relative overflow-hidden justify-center items-center"
                              style={{
                                zIndex: 0,
                                transform: `translateX(${-index * 8}px)`,
                              }}
                            >
                              <span className="text-[#696974] text-[12px] font-[400] text-center">
                                +{5 - index}
                              </span>
                            </div>
                          );
                        }
                      })}
                    </div>
                    <span className="text-[#92929D] leading-[26px] text-[16px] font-[300] relative -left-4 whitespace-nowrap">
                      5 người bạn làm việc ở đây
                    </span>
                  </div>
                )
              )}
            </div>

            <div className="flex  md:flex-col">
              {/* main  */}
              <div className="rounded-r-none rounded-l-[10px] md:rounded-[10px] w-full border border-[#F1F1F5] border-solid mt-5">
                <div className="grid grid-flow-row md:gap-4 md:grid-cols-4">
                  {Array.from(side1).map((item, index) => (
                    <div
                      className={clsx(
                        'flex flex-col gap-3 p-[15px] md:!py-[20px] md:border-r md:border-r-[#F1F1F5] md:border-solid'
                      )}
                    >
                      <p className="font-[400] text-[14px] md:text-[16px] leading-[10px] md:leading-[22px] text-[#B5B5BE]">
                        {item.title}{' '}
                        {index === 3 && <span className="text-[12px]">/Tháng</span>}
                      </p>
                      <p className="font-[500] text-[16px] md:text-[16px] leading-[16px] md:leading-[28px] text-[#44444F]">
                        {item.subTitle}{' '}
                        {index === 3 && <span className="text-[12px]">VNĐ</span>}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              {/* main  */}
              <div className="rounded-l-none rounded-r-[10px] md:rounded-[10px] w-full border border-[#F1F1F5] border-solid mt-5">
                <div className="grid grid-flow-row md:gap-4 md:grid-cols-4">
                  {Array.from(side2).map((item, index) => (
                    <div
                      className={clsx(
                        'flex flex-col gap-3 p-[15px] md:!py-[20px] md:border-r md:border-r-[#F1F1F5] md:border-solid'
                      )}
                    >
                      <p className="font-[400] text-[14px] md:text-[16px] leading-[10px] md:leading-[22px] text-[#B5B5BE]">
                        {item.title}
                      </p>
                      <p className="font-[500] text-[16px] md:text-[16px] leading-[16px] md:leading-[28px] text-[#44444F]">
                        {item.subTitle}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <p className="leading-[24px] text-primary font-[500] text-[16px] mt-5  mb-[8px]">
              Tổng quan
            </p>

            <div
              className="text-[#696974] font-[300] text-[15px] md:text-[16px]"
              dangerouslySetInnerHTML={{
                __html: formValues[RECRUITMENT_DATA_FIELD.overview],
              }}
            ></div>
            {/* title with list */}
            {Array(2)
              .fill('')
              .map((item, index) => (
                <>
                  <p className="leading-[24px] text-primary font-[500] text-[16px] mt-5  mb-[8px]">
                    {index == 1 ? 'Lợi ích' : 'Yêu cầu công việc'}
                  </p>
                  <div
                    className="text-[#696974] font-[300] text-[15px] md:text-[16px]"
                    dangerouslySetInnerHTML={{
                      __html:
                        index === 1
                          ? formValues[RECRUITMENT_DATA_FIELD.benefit]
                          : formValues[RECRUITMENT_DATA_FIELD.requirement],
                    }}
                  ></div>
                  {/* <ul className="pl-[20px] ">
                    <li className="flex items-center gap-[14px]">
                      <span className="h-[8px] w-[8px] rounded-full border border-[#50B5FF] border-solid block"></span>
                      <p className="text-[#696974] font-[300] text-[15px] md:text-[17px]">
                        Provide clear user flow and wireframe
                      </p>
                    </li>
                    <li className="flex items-center gap-[14px]">
                      <span className="h-[8px] w-[8px] rounded-full border border-[#50B5FF] border-solid block"></span>
                      <p className="text-[#696974] font-[300] text-[15px] md:text-[17px]">
                        Build prototype and do usability testing to solve user problems.
                      </p>
                    </li>
                    <li className="flex items-center gap-[14px]">
                      <span className="h-[8px] w-[8px] rounded-full border border-[#50B5FF] border-solid block"></span>
                      <p className="text-[#696974] font-[300] text-[15px] md:text-[17px]">
                        Follow design system guidelines.
                      </p>
                    </li>
                    <li className="flex items-center gap-[14px]">
                      <span className="h-[8px] w-[8px] rounded-full border border-[#50B5FF] border-solid block"></span>
                      <p className="text-[#696974] font-[300] text-[15px] md:text-[17px]">
                        Explore best practice approach to execute comprehensive
                        documentation
                      </p>
                    </li>
                  </ul> */}
                </>
              ))}
            <div className="my-5 flex flex-col md:flex-row md:justify-between gap-4">
              <p className="text-primary font-semibold text-4 md:text-[18px]">
                Bạn thấy phù hợp với công việc?
              </p>
              <div className="flex gap-4">
                <button className="primary-button !bg-white  !text-[#403ecc]">
                  Lưu tin
                </button>
                <button className="primary-button font-semibold text-[16px]  leading-[24px]">
                  Ứng tuyển ngay
                </button>
              </div>
            </div>

            <div className="w-full flex gap-[1rem] flex-row items-center">
              <p className="text-primary font-[400] text-[13px] md:text-[16px]">Tag:</p>
              {Array.from<string>(formValues[RECRUITMENT_DATA_FIELD.tags]).map((tag) => (
                <div
                  className={
                    'bg-[#F1F1F5] p-3  rounded-[5px]  flex items-center justify-center'
                  }
                >
                  <p>{tag}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* company info */}
      <div className="w-full flex flex-col xl:gap-5  xl:w-[400px] ">
        <div className="bg-white  px-[15px] md:px-[20px] rounded-[10px] ">
          <div className="flex flex-col  gap-4">
            <p className="leading-[34px] text-primary font-[500] text-[24px] mt-5  mb-[8px] xl:font[400] xl:text-[18px] xl:leading-[24px]">
              {enterpriseInfo.name}
            </p>
            <p className="font-semibold text-[16px] leading-[24px] text-[#22216D]">
              Thông tin công ty
            </p>

            <TruncateLines
              lines={4}
              ellipsis={
                <Link href={'#'} legacyBehavior>
                  <span>...Xem thêm</span>
                </Link>
              }
              className="text-[#696974] font-[300] text-[17px] md:text-[16px] "
            >
              {enterpriseInfo.introduce}
            </TruncateLines>
            <div className="map ">
              <p className="font-semibold text-[16px] leading-[24px] text-[#22216D] mb-5">
                Vi trí
              </p>
              {enterpriseInfo.map_url}
            </div>
            <div className="flex gap-4 items-center">
              <p className="font-semibold text-[16px] leading-[24px] text-[#22216D]">
                Website
              </p>
              <Link href="#" legacyBehavior>
                <span> {enterpriseInfo.website_url}</span>
              </Link>
            </div>
            <div className="flex gap-4 items-center">
              <p className="font-semibold text-[16px] leading-[24px] text-[#22216D]">
                Quy mô
              </p>
              {enterpriseInfo.scale_id && (
                <p>{ScaleId[`STR_SCALE_${enterpriseInfo.scale_id}`]}&nbsp; người</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-4 items-center bg-white rounded-[10px]  p-[15px] md:px-[20px]  xl:flex-col xl:items-start xl:card !shadow-none md:pt-0 xl:pt-[20px]">
          <p className="font-semibold text-[16px] leading-[24px] text-[#22216D]">
            Chia sẻ ngay:
          </p>
          <ul className="list-inline flex social-list-icon gap-3">
            <li className="list-inline-item social">
              <a
                className="social-icon text-xs-center"
                href="https://www.facebook.com/youthvn11"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/icons/facebook_v2.svg" alt="Facebook" />
              </a>
            </li>
            <li className="list-inline-item social">
              <a
                className="social-icon text-xs-center"
                href="https://www.instagram.com/youth.com.vn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/icons/instagram_v2.svg" alt="Instagram" />
              </a>
            </li>
            <li className="list-inline-item social">
              <a
                className="social-icon text-xs-center"
                href="https://www.instagram.com/youth.com.vn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/icons/tiktok.svg" alt="Tiktok Youth" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RecruitmentDetailModule;
