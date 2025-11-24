// pages/_app.js
import '../styles.css' // if you want to add basic CSS file (optional)
export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
