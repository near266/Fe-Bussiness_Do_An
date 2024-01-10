import { IEnterprise } from '@/interfaces/models/IEnterprise';
import CreateRecruitmentModule from '@/modules/ManageRecruitment/pages/Create';
import { fetchSSR } from '@/shared/axios/fetchSSR';
import { NextPage, GetServerSideProps } from 'next';

const CreateRecruitmentPage: NextPage = (props: { enterpriseInfo: IEnterprise }) => {
  const { enterpriseInfo } = props;
  return (
    <>
      <CreateRecruitmentModule enterpriseInfo={enterpriseInfo} />
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const url = process.env.NEXT_PUBLIC_ENTERPRISE_API_URL;
    const [res2] = await Promise.all([fetchSSR(ctx, `${url}/enterprises/info`)]);
    console.log(res2.data);
    return {
      props: {
        enterpriseInfo: res2?.data ?? {},
      },
    };
  } catch (error) {
    return { notFound: true };
  }
};
export default CreateRecruitmentPage;
