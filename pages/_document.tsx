import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
          <Head>
          <link rel="icon" href="/images/dove.png" type="image/png" />
          <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;1,500&display=swap" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400&display=swap" rel="stylesheet"></link>
          <link href="https://fonts.googleapis.com/css2?family=Noto+Serif:ital@0;1&display=swap" rel="stylesheet"></link>
        </Head>      
        <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

