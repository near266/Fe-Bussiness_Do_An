import SrcIcons from '@/assets/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import Image from 'next/legacy/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
export interface ISideBarProps {
  data?: 'TODO:Change me';
}

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  key: string,
  label: React.ReactNode,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem {
  return {
    key: key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const sideBarItems = [
  {
    label: 'Tổng quan',
    pathName: '/',
  },
  {
    label: 'Tin tuyển dụng',
    pathName: '/tin-tuyen-dung',
    children: [
      {
        icon: SrcIcons.sideBarPen,
        label: 'Tạo tin tuyển dụng',
        pathName: '/tin-tuyen-dung/tao-tin-tuyen-dung',
      },
      {
        icon: SrcIcons.sideBarPen,
        label: 'Tạo tin HĐ ngoại khoá',
        pathName: '/tin-tuyen-dung/tao-tin-khoa-ngoai',
      },
      {
        icon: SrcIcons.list,
        label: 'Danh sách đăng tin',
        pathName: '/tin-tuyen-dung/danh-sach-dang-tin',
      },
    ],
  },
  {
    label: 'Ứng viên',
    pathName: '/ung-vien',
    children: [
      {
        icon: SrcIcons.user,
        label: 'Hồ sơ ứng tuyển',
        pathName: '/ung-vien/ho-so-ung-tuyen',
      },
      {
        icon: SrcIcons.hoso,
        label: 'Hồ sơ yêu cầu nhận việc',
        pathName: '/ung-vien/ho-so-ung-tuyen',
      },
      {
        icon: SrcIcons.bookmark,
        label: 'Hồ sơ đã lưu',
        pathName: '/ung-vien/ho-so-da-luu',
      },
      {
        icon: SrcIcons.searchIcon,
        label: 'Tìm ứng viên mới',
        pathName: '/ung-vien/tim-ung-vien-moi',
      },
    ],
  },

  {
    label: 'Khóa học',
    pathName: '/khoa-hoc',
    children: [
      {
        icon: SrcIcons.sideBarPen,
        label: 'Tạo khóa học',
        pathName: '/khoa-hoc/tao',
      },
      {
        icon: SrcIcons.user,
        label: 'Quản lý học viên',
        pathName: '/khoa-hoc/quan-ly-hoc-vien',
      },
    ],
  },
  {
    label: 'Tài khoản',
    pathName: '/tai-khoan',
    children: [
      {
        label: 'Cài đặt',
        pathName: '/tai-khoan/cai-dat',
        icon: SrcIcons.setting,
      },
      {
        label: 'Lịch sử hoạt động',
        pathName: '/tai-khoan-/lich-su-hoat-dong',
        icon: SrcIcons.history,
      },
      {
        label: 'Theo dõi đơn hàng',
        pathName: '/tai-khoan-/theo-doi-don-hang',
        icon: SrcIcons.tracking,
      },
      {
        label: 'Đăng xuất',
        pathName: '#',
        icon: SrcIcons.signOut,
      },
    ],
  },
  {
    label: 'Giới thiệu',
    icon: SrcIcons.intro,

    pathName: `${process.env.NEXT_PUBLIC_APP_URL}/privacy-policy`,
  },
  {
    label: 'Liên hệ',
    icon: SrcIcons.contact,

    pathName: `${process.env.NEXT_PUBLIC_APP_URL}/privacy-policy`,
  },
  {
    label: 'Điều khoản',
    icon: SrcIcons.note,

    pathName: `${process.env.NEXT_PUBLIC_APP_URL}/privacy-policy`,
  },
  {
    label: 'Cộng đồng',
    icon: SrcIcons.comu,
    pathName: `${process.env.NEXT_PUBLIC_APP_URL}/privacy-policy`,
  },
];
const generateMenuItem = () => {
  /* use link component for prefetch base on view port only */
  return sideBarItems.map((item) => {
    if (item.children) {
      return getItem(
        item.pathName,
        <Link href={item.pathName ?? '#'} legacyBehavior>
          <span>{item.label}</span>
        </Link>,
        item.icon && <Image src={item.icon} height={20} width={20} alt="icon" />,
        item.children?.map((child) => {
          return getItem(
            child.pathName,
            <Link href={child.pathName} legacyBehavior>
              <span>{child.label}</span>
            </Link>,
            child.icon && <Image src={child.icon} height={20} width={20} alt="icon" />
          );
        })
      );
    } else {
      return getItem(
        item.pathName,
        <Link href={item.pathName ?? '#'} legacyBehavior>
          <span>{item.label}</span>
        </Link>,
        item.icon && <Image src={item.icon} height={20} width={20} alt="icon" />
      );
    }
  });
};
const items = generateMenuItem();
export function SideBar(props: ISideBarProps) {
  const router = useRouter();
  const onClick: MenuProps['onClick'] = (e) => {
    router.push(`/admin${e.key}`, undefined, { shallow: true });
  };
  return (
    <aside className="side-bar fixed left-0 h-full w-sidebar transition-transform duration-700 ease pr-2 bg-white p-[10px] hide_scrollbar overflow-y-auto min-h-screen shadow-[inset_-1px_0px_0px_#DCDCE0] z-[var(--side-bar-zindex)]">
      <Link href="/" legacyBehavior>
        <div className="relative w-full place-items-center cursor-pointer	flex items-center justify-center gap-2 h-[64px]">
          <Image src={SrcIcons.iconYouth} alt="Logo" width={36} height={36} priority />
          <div>
            <h2 className="text-title font-title m-0 uppercase text-[#22216D] text-xl w-[117px]">
              Eztek
              <br />
            </h2>
            <span className="text-[#22216D] text-[12px]">for Bussiness</span>
          </div>
        </div>
      </Link>

      <Menu className="sidebar" onClick={onClick} mode="inline" items={items} />
    </aside>
  );
}
