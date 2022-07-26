import { Route, Routes, Navigate } from 'react-router-dom'
import SettingBar from './components/SettingBar'
import Toolbar from './components/Toolbar'
import Canvas from './components/Canvas'
import './styles/app.scss'

function App() {
  return (
    <div className="app">
      <Routes>
        <Route
          path="/:id"
          element={
            <>
              <Toolbar />
              <SettingBar />
              <Canvas />
            </>
          }
        />
        <Route
          path="/"
          element={<Navigate replace to={`/${(+new Date()).toString(16)}`} />}
        />
      </Routes>
    </div>
  )
}

export default App
