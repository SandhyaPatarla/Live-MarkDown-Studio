import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Editor from './pages/Editor'
function App() {

  return (
    <div className="bg-black h-screen">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />} >
            <Route path="/" element={<Editor />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
