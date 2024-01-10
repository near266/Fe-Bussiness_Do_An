// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
import { IRecruitment } from '@/interfaces/models/IRecruitment';
import { fetchSSR } from '@/shared/axios/fetchSSR';
import { GetServerSideProps } from 'next';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
type Props = {
  recruitments: IRecruitment[];
};
const RecruitmentDashboard = dynamic(
  () => import('@/modules/ManageRecruitment/pages/Dashboard')
);
const DashboardRecruitmentPage: NextPage = (props: Props) => {
  const { recruitments } = props;
  return (
    <>
      <RecruitmentDashboard recruitments={recruitments} />
    </>
  );
};

export default DashboardRecruitmentPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const url = process.env.NEXT_PUBLIC_ENTERPRISE_API_URL;

    const { data: recruitments } = await fetchSSR(ctx, `${url}/job-posts`);
    console.log(recruitments);
    return {
      props: { recruitments },
    };
  } catch (error) {
    return {
      props: { recruitments: [] },
    };
  }
};
