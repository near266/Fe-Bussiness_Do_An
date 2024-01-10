import SrcIcons from '@/assets/icons';
import { appLibrary } from '@/shared/utils/loading';
import { asyncLogoutAuth, IRootState } from '@/store';
import { Grid, User } from '@nextui-org/react';
import clsx from 'clsx';
import Image from 'next/legacy/image';
import Link from 'next/link';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles.module.scss';

export interface IProps {
  data?: '';
}

const UserPop: React.FC = (props: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const user = useSelector((state: IRootState) => state.auth.me);
  const handleClick = (e) => {
    setIsOpen(!isOpen);
    setAnchorEl(anchorEl ? null : e.target);
  };
  const logout = () => {
    appLibrary.showloading();
    dispatch(asyncLogoutAuth());
  };
  return (
    <div className="relative h-full ">
      <div
        className="flex h-full items-center gap-3"
        onClick={() => setIsOpen((pre) => !pre)}
      >
        <User as="button" size="md" color="primary" name="" src={user?.avatar} />
        <Image
          objectFit="contain"
          src={SrcIcons.dropDown}
          height={20}
          width={20}
          className={clsx(
            isOpen ? 'rotate-180' : '',
            'transition-transform duration-[400] ease-in-out'
          )}
          alt="youth enterprise"
        />
      </div>
      {isOpen && (
        <div
          className={clsx(
            'absolute top-full flex items-center gap-3 transition-all duration-500 ease-in-out z-[var(--nav-bar-zindex)]'
          )}
          onClick={() => {}}
        >
          <div className="min-w-[240px] m-[2px_10px_0_0] shadow-[0_2px_4px_rgba(0,0,0,0.1)] bg-white border border-solid border-[#e5e5e5] rounded-[10px] overflow-hidden">
            <div className="p-[10px_12px_8px]">
              <div className="font-bold">{user.name}</div>
              <div className="username">{`@${user.username}`}</div>
            </div>
            <div className="h-[1px] m-0 p-0 bg-[#dfdfdf]" />
            <ul className="list-none pl-0 m-0">
              <li>
                <Link href="/admin/tai-khoan/cai-dat" legacyBehavior>
                  <p className="flex px-2 py-3 cursor-pointer hover:bg-[#eee] ">
                    <i className="fa fa-cog" />
                    Cài đặt tài khoản
                  </p>
                </Link>
              </li>
              <div className="h-[1px] m-0 p-0 bg-[#dfdfdf]" />
              <li>
                {/* TODOKOGAP: Xem co che dang xuat khac hay hon k */}
                <span
                  className="flex px-2 py-3 cursor-pointer hover:bg-[#eee]"
                  onClick={logout}
                >
                  <i className="fa fa-sign-out-alt" />
                  Đăng xuất
                </span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
export default UserPop;
