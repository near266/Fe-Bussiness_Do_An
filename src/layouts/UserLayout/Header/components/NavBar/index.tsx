import SrcImages from '@/assets/images';
import Image from 'next/legacy/image';
import Link from 'next/link';

export interface INavBarProps {
  data?: 'TODO:Change me';
}

export function NavBar(props: INavBarProps) {
  return (
    <nav className="fixed w-full bg-white h-[var(--height-navbar)] shadow-[inset_0px_-1px_0px_#E2E2EA] px-3 z-[var(--nav-bar-zindex)] ">
      <div className="container h-full">
        <div className="flex w-full  justify-between items-center">
          <div className="flex-shrink">
            <Link href="/" legacyBehavior>
              <div className="logo relative h-[var(--height-navbar)] w-full min-w-[165px]">
                <Image
                  src={SrcImages.logoNav}
                  layout="fill"
                  priority
                  quality={100}
                  objectFit="contain"
                  alt="Youht doanh nghiệp"
                />
              </div>
            </Link>
          </div>
          <div className="flex gap-4 my-auto">
            <Link href="/sign-up" legacyBehavior>
              <button className="secondary-button border border-solid">Đăng ký</button>
            </Link>
            <Link href="/login" legacyBehavior>
              <button className="primary-button">Đăng nhập</button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
