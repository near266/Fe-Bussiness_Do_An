import { redirectToAdmin, redirectToAuthenticate } from '@/shared/utils/common';
import { IRootState } from '@/store';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const Auth = ({ children }) => {
  const isAuthenticated = useSelector((state: IRootState) => state.auth.isAuthenticated);
  const isFetched = useSelector((state: IRootState) => state.auth.isFetched);
  const { role_codes } = useSelector((state: IRootState) => state.auth.me);
  const isAdmin = role_codes?.includes('enterprise');
  const router = useRouter();
  useEffect(() => {
    if (!isAuthenticated) {
      redirectToAuthenticate();
    }

    return () => {};
  }, [isAuthenticated]);

  const View = isFetched ? children : <span aria-label="Loading ..."></span>;

  return isAuthenticated ? View : null;
};

export default Auth;
