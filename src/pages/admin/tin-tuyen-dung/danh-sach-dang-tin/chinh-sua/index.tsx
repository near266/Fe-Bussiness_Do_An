// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
import { IRecruitment } from '@/interfaces/models/IRecruitment';
import { fetchSSR } from '@/shared/axios/fetchSSR';
import { GetServerSideProps } from 'next';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
type Props = {
  recruitment: IRecruitment;
};
const EditRecruitmentModule = dynamic(
  () => import('@/modules/ManageRecruitment/pages/Edit')
);
const EditRecruitmentPage: NextPage = (props: Props) => {
  const { recruitment } = props;
  return (
    <>
      <EditRecruitmentModule recruitment={recruitment} />
    </>
  );
};

export default EditRecruitmentPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const url = process.env.NEXT_PUBLIC_ENTERPRISE_API_URL;
    const { id } = ctx.query;
    const { data: recruitment } = await fetchSSR(ctx, `${url}/job-posts/${id}`);
    console.log(recruitment);
    return {
      props: { recruitment },
    };
  } catch (error) {
    return {
      props: {},
    };
  }
};
