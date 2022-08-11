import type { NextPage } from 'next'
import Bridge from '../components/Bridge/Bridge'
import { AppProviders } from '../providers'
import Title from '../components/Title/Title'
import Header from '../layout/Header/Header'
const Home: NextPage = () => {
  return (
    <div style={{ width: "100%", height: "100%", background: "#191c26" }}>
      <Header />
      <Title />
      <Bridge confirmation={0} />
    </div>
  )
}

export default Home
