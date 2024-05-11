import { IEnterprise } from '@/interfaces/models/IEnterprise';
import { IRepresent } from '@/interfaces/models/IRepresent';
import { EditJobsModule as EditProfileModule } from '@/modules/ManageAccount/pages/Edit';
import { fetchSSR } from '@/shared/axios/fetchSSR';
import { NextPage } from 'next';

type Props = {
  enterpriseInfo: any;
  accountInfo: any;
};
const SettingPage: NextPage = (props: Props) => {
  const { enterpriseInfo, accountInfo } = props;

  return <EditProfileModule account={accountInfo} company={enterpriseInfo} />;
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const url = process.env.NEXT_PUBLIC_ENTERPRISE_API_URL;
    const [res1, res2] = await Promise.all([
      fetchSSR(ctx, `${url}/enterprises/account/info`),
      fetchSSR(ctx, `${url}/enterprises/info`),
    ]);
    return {
      props: {
        accountInfo: res1?.data ?? {},
        enterpriseInfo: res2?.data ?? {},
      },
    };
  } catch (error) {
    return {
      props: {
        accountInfo: {},
        enterpriseInfo: {},
      },
    };
  }
};

export default SettingPage;
