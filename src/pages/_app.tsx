import { useNProgress } from '@/hooks/useNProgress';
import { AppLayout } from '@/layouts/app';
import Auth from '@/layouts/Auth/Auth';
import { isBrowser } from '@/shared/helpers';
import { asyncProcessAuth } from '@/store';
import store from '@/store/configureStore';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import '../assets/styles/app.scss';

if (isBrowser()) {
  store.dispatch(asyncProcessAuth());
}
function MyApp({ Component, pageProps, router }: AppProps) {
  useNProgress();
  return (
    <Provider store={store}>
      {router.pathname.includes('admin') ? (
        <Auth>
          <AppLayout>
            <Component {...pageProps} />
          </AppLayout>
        </Auth>
      ) : (
        <AppLayout>
          <Component {...pageProps} />
        </AppLayout>
      )}
    </Provider>
  );
}

export default MyApp;
