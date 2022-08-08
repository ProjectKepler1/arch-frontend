import type { NextPage } from 'next'
import Bridge from '../routes/Bridge/Bridge'
import { AppProviders } from '../providers'
import Title from '../components/Title/Title'
import Header from '../layout/Header/Header'
const Home: NextPage = () => {
  return (
    <AppProviders>
      <Header />
      <Title />
      <Bridge />
    </AppProviders >
  )
}

export default Home
