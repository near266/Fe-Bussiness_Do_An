import SrcIcons from '@/assets/icons';
import TextBoxWithLabel from '@/components/TextBoxWithLabel';
import { PayloadContact, recruitmentsAPI } from '@/modules/ManageRecruitment/shared/api';
import { SV_RES_STATUS_CODE } from '@/shared/enums/enums';
import { appLibrary } from '@/shared/utils/loading';
import { Form, message } from 'antd';
import Image from 'next/legacy/image';
import Link from 'next/link';
import React from 'react';

const Footer: React.FC = () => {
  const navItem = [
    { lable: 'Giới thiệu', link: '#' },
    { lable: 'Dịch vụ', link: '#' },
    { lable: 'Đối tác', link: '#' },
    { lable: 'Liên hệ', link: '#' },
  ];
  const [form] = Form.useForm();
  const handleSendContact = () => {
    form.validateFields().then((values: PayloadContact) => {
      console.log(values);
      onSendContact(values);
    });
  };
  const onSendContact = async (data: PayloadContact) => {
    try {
      appLibrary.showloading();
      const { code } = await recruitmentsAPI.sendContact(data);
      if (code === SV_RES_STATUS_CODE.success) {
        message.success('Gửi liên hệ thành công');
      }
      appLibrary.hideloading();
    } catch (error) {
      message.error('Gửi liên hệ thất bại');
      appLibrary.hideloading();
    }
  };
  return (
    <div id="__footer">
      <div className="w-full px-5 xl:px-0 bg-white shadow-[inset_0px_1px_0px_#E2E2EA] py-[23px] ">
        <div className="container">
          <div className="flex flext-start justify-start border-b border-solid border-[#B5B5BE] py-2 sm:py-3 md:py-5 gap-3 sm:gap-6 md:gap-20 flex-wrap">
            {navItem.map((item, index) => (
              <Link href={item.link} key={`${item.link + index}`} legacyBehavior>
                <p className="typo-normal !text-[20px] !text-[#171725]">{item.lable}</p>
              </Link>
            ))}
          </div>
          <div className="grid md:grid-cols-3 pt-4">
            <div className="col-span-12 pr-5 sm:col-span-6 md:col-auto info flex flex-col h-full w-full">
              <div className="flex gap-3 items-center align-middle">
                <Image
                  width={80}
                  height={80}
                  src={SrcIcons.iconYouth}
                  alt="youth enterprise"
                />
                <p className="typo-h1-primary">Eztek</p>
              </div>
              <p className="typo-gray  mt-2 max-w-[302px]">
                Nền tảng định hướng và kết nối việc làm dành cho giới trẻ
              </p>
              <div className="mt-5 col-span-12 pr-5 sm:col-span-6 md:col-auto info flex flex-col h-full w-full">
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
              <p className="typo-gray mt-auto">Eztek. All rights reserved.</p>
            </div>
            <div className="col-span-12 pr-5 sm:col-span-6 md:col-auto my-5 sm:my-0 contact-info flex flex-col gap-4">
              <p className="typo-small-title-purple">Liên hệ chúng tôi</p>
              <div className="flex gap-3 items-center align-middle">
                <div className="min-w-[20px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="24"
                    fill="none"
                    viewBox="0 0 25 24"
                  >
                    <path
                      fill="#44444F"
                      fillRule="evenodd"
                      d="M10.13 10.79c-.18-.191-.213-.634.02-1.16.878-2.345.997-2.78.435-3.373l-3.61-3.799c-.693-.73-1.794-.544-2.475.173-2.667 2.807-2.667 7.338 0 10.145l6.742 7.097c2.694 2.836 7.085 2.836 9.78 0 .658-.693.82-1.765.164-2.457l-3.61-3.8c-.605-.636-1.016-.511-3.27.421-.52.254-.877.224-1.035.058l-3.14-3.306zm9.381 7.768c-1.91 1.943-4.933 1.923-6.819-.063L5.95 11.398c-1.89-1.989-1.932-5.205-.128-7.25l3.006 3.164-.007.026c-.094.344-.269.86-.52 1.536-.515 1.15-.418 2.454.38 3.293l3.14 3.305c.82.863 2.122.971 3.31.386a18.35 18.35 0 011.339-.502l3.041 3.202z"
                      clipRule="evenodd"
                    ></path>
                    <path
                      fill="#44444F"
                      d="M14.2 10.2a.8.8 0 00-.8-.8 1 1 0 110-2 2.8 2.8 0 012.8 2.8 1 1 0 11-2 0z"
                    ></path>
                    <path
                      fill="#44444F"
                      d="M13.4 6.7a3.5 3.5 0 013.5 3.5 1 1 0 102 0 5.5 5.5 0 00-5.5-5.5 1 1 0 100 2z"
                    ></path>
                    <path
                      fill="#44444F"
                      d="M19.6 10.2A6.2 6.2 0 0013.4 4a1 1 0 110-2 8.2 8.2 0 018.2 8.2 1 1 0 11-2 0z"
                    ></path>
                  </svg>
                </div>
                <p className="typo-gray"> 0866 906 811+</p>
              </div>
              <div className="flex gap-3 items-center align-middle">
                <div className="min-w-[20px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="24"
                    fill="none"
                    viewBox="0 0 25 24"
                  >
                    <path
                      fill="#44444F"
                      fillRule="evenodd"
                      d="M18.5 10.006l-6-5.4-6 5.4v9.105c0 .368.298.667.667.667h1.555v-2.472c0-1.583 1.296-2.862 2.89-2.862h1.777c1.593 0 2.889 1.28 2.889 2.862v2.472h1.555a.667.667 0 00.667-.667v-9.105zm2.222 9.105A2.889 2.889 0 0117.833 22h-2.666a1.111 1.111 0 01-1.111-1.111v-3.583c0-.35-.296-.64-.667-.64H11.61a.654.654 0 00-.667.64v3.583c0 .614-.497 1.111-1.11 1.111H7.166a2.889 2.889 0 01-2.89-2.889v-7.11a1.111 1.111 0 01-1.41-1.716l8.89-8a1.111 1.111 0 011.486 0l8.89 8A1.111 1.111 0 0120.722 12v7.111z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <p className="typo-gray">
                  Ngách 32 Ngõ 54 Nguyễn Chí Thanh, Láng Thượng, Đống Đa, Hà Nội
                </p>
              </div>
              <div className="flex gap-3 items-center align-middle">
                <div className="min-w-[20px]">
                  {' '}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="24"
                    fill="none"
                    viewBox="0 0 25 24"
                  >
                    <path
                      fill="#44444F"
                      fillRule="evenodd"
                      d="M20.5 5h-16a1 1 0 00-1 1v12a1 1 0 001 1h16a1 1 0 001-1V6a1 1 0 00-1-1zm-16-2a3 3 0 00-3 3v12a3 3 0 003 3h16a3 3 0 003-3V6a3 3 0 00-3-3h-16z"
                      clipRule="evenodd"
                    ></path>
                    <path
                      fill="#44444F"
                      fillRule="evenodd"
                      d="M5.732 7.36a1 1 0 011.408-.128l4.72 3.933a1 1 0 001.28 0l4.72-3.933a1 1 0 011.28 1.536l-4.72 3.933a3 3 0 01-3.84 0L5.86 8.768a1 1 0 01-.128-1.408z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <p className="typo-gray">info.youth.com.vn@gmail.com</p>
              </div>
            </div>
            <div className="col-span-12 md:col-auto contact-form">
              <p className="typo-small-title-purple">
                Hoặc điền thông tin liên hệ dưới đây:
              </p>
              <Form
                className="w-full flex flex-col "
                onFinish={handleSendContact}
                form={form}
                autoComplete="off"
              >
                <div className="steps-content mt-2">
                  <div className="flex flex-col gap-4 mt-5">
                    <Form.Item
                      name="name"
                      className="w-full"
                      rules={[
                        { required: true, message: 'Vui lòng nhập đầy đủ thông tin' },
                      ]}
                    >
                      <TextBoxWithLabel name="name" label="Họ và tên" />
                    </Form.Item>
                    <Form.Item
                      name="email"
                      className="w-full"
                      rules={[
                        { required: true, message: 'Vui lòng nhập đầy đủ thông tin' },
                      ]}
                    >
                      <TextBoxWithLabel name="email" label="Email của bạn" />
                    </Form.Item>
                    <Form.Item
                      name="phone"
                      className="w-full"
                      rules={[
                        { required: true, message: 'Vui lòng nhập đầy đủ thông tin' },
                      ]}
                    >
                      <TextBoxWithLabel name="phone" label="Số điện thoại" />
                    </Form.Item>
                    <Form.Item
                      name="content"
                      className="w-full"
                      rules={[
                        { required: true, message: 'Vui lòng nhập đầy đủ thông tin' },
                      ]}
                    >
                      <TextBoxWithLabel
                        name="content"
                        label="Điền nội dung của bạn"
                        inputStyle="py-30px"
                        textarea
                      />
                    </Form.Item>
                  </div>
                </div>
              </Form>
              <div className="steps-action flex mt-5">
                <button
                  className="primary-button !mr-auto !ml-0"
                  onClick={handleSendContact}
                >
                  Liên hệ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4">
        <div className="h-2 bg-[#30AB7E] w-full"></div>
        <div className="h-2 bg-[#3BB1CF] w-full"></div>
        <div className="h-2 bg-[#EB4C4C] w-full"></div>
        <div className="h-2 bg-[#F4BF59] w-full"></div>
      </div>
    </div>
  );
};

export default Footer;
