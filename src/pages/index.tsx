import HomeModule from '@/modules/LandingPage/pages';
import { IRootState } from '@/store';
import type { NextPage } from 'next';
import { useSelector } from 'react-redux';
import AdminPage from './admin';

const Home: NextPage = () => {
  const { role_codes } = useSelector((state: IRootState) => state.auth.me);
  const isAdmin = role_codes?.includes('enterprise');

  return <>{isAdmin ? <AdminPage /> : <HomeModule />}</>;
};

export default Home;
