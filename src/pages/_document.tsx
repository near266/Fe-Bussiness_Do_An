import Document, { Head, Html, Main, NextScript } from 'next/document';
import React from 'react';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return {
      ...initialProps,
      styles: React.Children.toArray([initialProps.styles]),
    };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
          <meta name="keywords" content="youth, youth+, youth doanh nghiệp" />
          <meta property="og:url" content="https://enterprise.youth.com.vn/" />
          <meta property="og:description" content="Youth+ Doanh nghiệp" />
          <meta property="og:type" content="website" />
          <meta name="theme-color"></meta>
          <link
            href="https://fonts.googleapis.com/css2?family=Lexend+Deca:wght@100;200;300;400;500;600;700;800;900&display=swap"
            rel="stylesheet"
          ></link>
          <meta
            name="description"
            content="YOUTH+ - Mang đến cho bạn dịch vụ tuyển dụng chất lượng và đáng tin cậy"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
