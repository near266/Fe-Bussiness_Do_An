import { redirectToAdmin, redirectToAuthenticate } from '@/shared/utils/common';
import { IRootState } from '@/store';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const Auth = ({ children }) => {
  const { role_codes } = useSelector((state: IRootState) => state.auth.me);
  const { loading, data, succeeded } = useSelector((state: any) => state.login);
  const isAuthenticated = succeeded;

  const isAdmin = data?.roles.includes('Enterprise');

  const View = isAdmin ? children : <span aria-label="Loading ..."></span>;

  return succeeded ? View : null;
};

export default Auth;
