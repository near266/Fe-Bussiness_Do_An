import { Loading } from '@nextui-org/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Redirect = () => {
  const router = useRouter();
  useEffect(() => {
    router.push('/admin/tin-tuyen-dung/danh-sach-dang-tin');
  }, [router]);
  return (
    <>
      <div className="tw-flex">
        <Loading />
      </div>
    </>
  );
};

export default Redirect;
