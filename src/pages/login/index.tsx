import LoginModule from '@/modules/LogIn/pages';
import { NextPage } from 'next';

const LoginPage: NextPage = () => {
  return (
    <>
      <div className="m-auto">
        <LoginModule />
      </div>
    </>
  );
};

export default LoginPage;
