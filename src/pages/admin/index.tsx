import dynamic from 'next/dynamic';
import { NextPage } from 'next';
const AdminDashboard = dynamic(() => import('@/modules/AdminDashboard'), { ssr: false });
const AdminPage: NextPage = () => {
  return (
    <>
      <div className="m-auto">
        <h1 className="font-title text-title text-[#22216D] leading-tight ">
          Hiệu quả tuyển dụng
        </h1>
        <div className="card my-5">
          <AdminDashboard />
        </div>
        <h1 className="font-title text-title text-[#22216D] leading-tight">Bảng tin</h1>
      </div>
    </>
  );
};

export default AdminPage;
