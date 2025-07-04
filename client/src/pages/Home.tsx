import Footer from '../components/Footer'
import Header from '../components/Header'
import Content from '../components/Content'
import Design from '../components/Design'
import Features from '../components/Features'
import Hero from '../components/Hero'

function Home() {
  return (
    <div>
        <Header />
        <Hero />
        <Design />
        <Features />
        {/* <Content /> */}
        <Footer />
    </div>
  )
}

export default Home