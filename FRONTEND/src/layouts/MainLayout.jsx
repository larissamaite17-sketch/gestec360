import Sidebar from '../components/Sidebar/Sidebar'
import Header from '../components/Header/Header'
import './MainLayout.css'

function MainLayout({ children }) {
  return (
    <main className="main-layout">
      <Sidebar />

      <section className="main-area">
        <Header />

        <div className="page-content">
          {children}
        </div>
      </section>
    </main>
  )
}

export default MainLayout