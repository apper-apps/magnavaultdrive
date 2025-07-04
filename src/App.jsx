import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from '@/components/organisms/Layout'
import FileExplorer from '@/components/pages/FileExplorer'
import RecentFiles from '@/components/pages/RecentFiles'
import SharedFiles from '@/components/pages/SharedFiles'
import Trash from '@/components/pages/Trash'
import Settings from '@/components/pages/Settings'

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Layout>
        <Routes>
          <Route path="/" element={<FileExplorer />} />
          <Route path="/folder/:folderId" element={<FileExplorer />} />
          <Route path="/recent" element={<RecentFiles />} />
          <Route path="/shared" element={<SharedFiles />} />
          <Route path="/trash" element={<Trash />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="z-[9999]"
      />
    </div>
  )
}

export default App