import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar.jsx'
import Navbar from './components/Navbar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import CreateDiagram from './pages/CreateDiagram.jsx'
import History from './pages/History.jsx'
import DiagramDetails from './pages/DiagramDetails.jsx'
import Settings from './pages/Settings.jsx'

export default function App() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create" element={<CreateDiagram />} />
            <Route path="/history" element={<History />} />
            <Route path="/diagram/:id" element={<DiagramDetails />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
