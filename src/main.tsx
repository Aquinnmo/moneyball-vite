import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import './index.css'
import App from './App.tsx'
import GameView from './Game.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="game/:gamePk" element={<GameView />} />
        <Route path="/" element={<App />}/>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
