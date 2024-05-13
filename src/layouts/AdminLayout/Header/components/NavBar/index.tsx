import SrcIcons from '@/assets/icons';
import Notification from '@/components/Notification';
import UserPop from '@/components/UserNav';
import { Grid, User } from '@nextui-org/react';
import { Tabs } from 'antd';
import Image from 'next/legacy/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { useCallback, useEffect, useState } from 'react';

export interface INavBarProps {
  data?: 'TODO:Change me';
}

const genNavbarBySidebar = (sidebarRoute) => {
  let tabs = <></>;
  switch (sidebarRoute) {
    case 'quan-ly-mentors':
      return (tabs = <></>);
    case 'quan-ly-thanh-vien':
      return (tabs = <></>);
    case 'quan-ly-khoa-hoc':
      return (tabs = (
        <>
          <TabPane tab="Danh sách khoá học" key="?danh-sach-khoa-hoc"></TabPane>
          <TabPane tab="Danh sách người mua" key="?danh-sach-nguoi-mua"></TabPane>
          <TabPane tab="Danh mục" key="?danh-muc"></TabPane>
        </>
      ));
    case 'quan-ly-bai-test':
      return (tabs = (
        <>
          <TabPane tab="Hiểu mình" key="?hieu-minh"></TabPane>
          <TabPane tab="Hiểu nghề" key="?hieu-nghe"></TabPane>
          <TabPane tab="Năng lực" key="?nang-luc"></TabPane>
        </>
      ));
    case 'quan-ly-su-kien':
      return (tabs = <></>);
    case 'quan-ly-viec-lam':
      return (tabs = (
        <>
          <TabPane tab="Danh sách" key="?danh-sach"></TabPane>
          <TabPane tab="Danh sách ứng tuyển" key="?danh-sach-ung-tuyen"></TabPane>
          <TabPane tab="Tin tuyển dụng" key="?tin-tuyeb-dung"></TabPane>
          <TabPane tab="Danh mục ngành nghề" key="?danh-muc-nganh-nghe"></TabPane>
        </>
      ));
    case 'quan-ly-nghe':
      return (tabs = (
        <>
          <TabPane tab="Quản lý nghề" key="?hieu-minh"></TabPane>
        </>
      ));
    case 'quan-ly-linh-vuc':
      return (tabs = (
        <>
          <TabPane tab="Quản lý lĩnh vực" key="?quan-ly-linh-vuc"></TabPane>
        </>
      ));
    case 'coupon':
      return (tabs = (
        <>
          <TabPane tab="COUPON" key="?coupon"></TabPane>
        </>
      ));

    default:
      tabs = <TabPane tab={sidebarRoute} key="null"></TabPane>;
      break;
  }
  return tabs;
};
const { TabPane } = Tabs;
export function NavBar(props: INavBarProps) {
  const router = useRouter();
  const [tabs, setTabs] = useState(<></>);
  const testRoute = useCallback(
    (key) => {
      const currentUrl = router.pathname;
      router.push(`${currentUrl}/${key}`, undefined, {
        shallow: true,
      });
    },
    [router]
  );
  const [isOpen, setIsOpen] = useState(false);
  const onTabChange = (tabKey) => {};
  useEffect(() => {
    setTabs(genNavbarBySidebar(router.pathname.split('/')[1]));
  }, [router.pathname]);
  return (
    <nav className="fixed w-full bg-white h-[var(--height-navbar)] shadow-[inset_0px_-1px_0px_#E2E2EA] ml-[var(--width-sidebar)] px-3 z-[var(--nav-bar-zindex)] ">
      {/* <Tabs size="large" defaultActiveKey="1" onChange={onTabChange}>
        {tabs}
      </Tabs> */}
      <div className=" mr-[var(--width-sidebar)]  top-0 h-full flex items-center gap-5 z-[var(--nav-bar-zindex)]">
        {/* <Notification /> */}
        <div className="action flex gap-4 ml-auto mr-3">
          <button
            className="secondary-button !px-[17px] !py-[10px] !m-0 border border-solid border-[#403ECC] text-[16px]"
            onClick={() => router.push('/admin/tin-tuyen-dung/tao-tin-tuyen-dung  ')}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M3 5C3 2.79086 4.79086 1 7 1H15.3431C16.404 1 17.4214 1.42143 18.1716 2.17157L19.8284 3.82843C20.5786 4.57857 21 5.59599 21 6.65685V19C21 21.2091 19.2091 23 17 23H7C4.79086 23 3 21.2091 3 19V5ZM19 8V19C19 20.1046 18.1046 21 17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H14V5C14 6.65685 15.3431 8 17 8H19ZM18.8891 6C18.7909 5.7176 18.6296 5.45808 18.4142 5.24264L16.7574 3.58579C16.5419 3.37035 16.2824 3.20914 16 3.11094V5C16 5.55228 16.4477 6 17 6H18.8891Z"
                fill="#403ECC"
              />
              <g clip-path="url(#clip0_5715_47554)">
                <path
                  d="M7.375 18.0833C7.375 17.8302 7.5802 17.625 7.83333 17.625H15.1667C15.4198 17.625 15.625 17.8302 15.625 18.0833C15.625 18.3365 15.4198 18.5417 15.1667 18.5417H7.83333C7.5802 18.5417 7.375 18.3365 7.375 18.0833Z"
                  fill="#403ECC"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M13.6574 9.43055C13.4784 9.25156 13.1882 9.25156 13.0092 9.43055L12.6065 9.83326L14.25 11.4767L14.6527 11.074C14.8317 10.895 14.8317 10.6048 14.6527 10.4259L13.6574 9.43055ZM9.16903 13.2708L11.9583 10.4814L13.6018 12.1249L10.8125 14.9142L9.16903 13.2708ZM8.52085 13.9189L8.29167 14.1481V15.7916H9.93515L10.1643 15.5624L8.52085 13.9189ZM12.3611 8.78237C12.898 8.2454 13.7686 8.2454 14.3056 8.78237L15.3009 9.77767C15.8379 10.3146 15.8379 11.1852 15.3009 11.7222L10.5833 16.4398C10.4114 16.6117 10.1783 16.7083 9.93515 16.7083H8.29167C7.78541 16.7083 7.375 16.2979 7.375 15.7916V14.1481C7.375 13.905 7.47158 13.6719 7.64349 13.4999L12.3611 8.78237Z"
                  fill="#403ECC"
                />
              </g>
              <defs>
                <clipPath id="clip0_5715_47554">
                  <rect width="9" height="11" fill="white" transform="translate(7 8)" />
                </clipPath>
              </defs>
            </svg>
            &nbsp; Đăng tin
          </button>
          <button className="secondary-button !px-[17px] !py-[10px] !m-0 border border-solid border-[#403ECC] text-[16px]">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M3 5C3 2.79086 4.79086 1 7 1H15.3431C16.404 1 17.4214 1.42143 18.1716 2.17157L19.8284 3.82843C20.5786 4.57857 21 5.59599 21 6.65685V19C21 21.2091 19.2091 23 17 23H7C4.79086 23 3 21.2091 3 19V5ZM19 8V19C19 20.1046 18.1046 21 17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H14V5C14 6.65685 15.3431 8 17 8H19ZM18.8891 6C18.7909 5.7176 18.6296 5.45808 18.4142 5.24264L16.7574 3.58579C16.5419 3.37035 16.2824 3.20914 16 3.11094V5C16 5.55228 16.4477 6 17 6H18.8891Z"
                fill="#403ECC"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M13.032 15.4462C12.4365 15.7981 11.7418 16 11 16C8.79086 16 7 14.2091 7 12C7 9.79086 8.79086 8 11 8C13.2091 8 15 9.79086 15 12C15 12.7418 14.7981 13.4365 14.4462 14.032L16.7072 16.293C17.0977 16.6835 17.0977 17.3167 16.7072 17.7072C16.3167 18.0977 15.6835 18.0977 15.293 17.7072L13.032 15.4462ZM13 12C13 13.1046 12.1046 14 11 14C9.89543 14 9 13.1046 9 12C9 10.8954 9.89543 10 11 10C12.1046 10 13 10.8954 13 12Z"
                fill="#403ECC"
              />
            </svg>
            &nbsp; Tìm CV
          </button>
        </div>
        <div className="cursor-pointer">
          <svg
            width="20"
            height="24"
            viewBox="0 0 20 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M11.98 5.14094C11.8026 3.65337 10.5367 2.5 9.0013 2.5C7.46596 2.5 6.2 3.65337 6.02257 5.14094C3.5199 6.27546 1.77908 8.79555 1.77908 11.7222V16.7399L0.108582 20.0494C-0.227141 20.7145 0.25626 21.5 1.0013 21.5H6.17201C6.58385 22.6652 7.69509 23.5 9.0013 23.5C10.3075 23.5 11.4188 22.6652 11.8306 21.5H17.0013C17.7463 21.5 18.2297 20.7145 17.894 20.0494L16.2235 16.7399V11.7222C16.2235 8.79555 14.4827 6.27546 11.98 5.14094ZM14.3308 17.4286L15.3764 19.5H2.62623L3.6718 17.4286C3.74234 17.2888 3.77908 17.1345 3.77908 16.978V11.7222C3.77908 8.83807 6.11715 6.5 9.0013 6.5C11.8855 6.5 14.2235 8.83807 14.2235 11.7222V16.978C14.2235 17.1345 14.2603 17.2888 14.3308 17.4286Z"
              fill="#171725"
            />
            {/* if have notifi */}
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M16 8.5C18.2091 8.5 20 6.70914 20 4.5C20 2.29086 18.2091 0.5 16 0.5C13.7909 0.5 12 2.29086 12 4.5C12 6.70914 13.7909 8.5 16 8.5Z"
              fill="#EB4C4C"
            />
          </svg>
        </div>
        <div className="avatar h-full">
          <UserPop />
        </div>
        <button className="primary-button">Liên hệ phỏng vấn</button>
      </div>
    </nav>
  );
}
