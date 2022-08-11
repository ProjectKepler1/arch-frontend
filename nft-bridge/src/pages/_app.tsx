import '../styles/globals.css'
import type { AppProps } from 'next/app'

import { Navigate, Route, Routes } from 'react-router-dom';
import "@fontsource/rajdhani"
import "@fontsource/roboto"
import { AppProviders } from '../providers'

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <AppProviders>
      <Component {...pageProps} />
    </AppProviders >
  )
}

export default MyApp
