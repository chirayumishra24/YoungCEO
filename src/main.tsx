import { Suspense, StrictMode, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'

const Layout = lazy(() => import('./components/Layout'))
const Home = lazy(() => import('./pages/Home'))
const Chapter1_1 = lazy(() => import('./pages/Chapter1_1'))
const Chapter1_2 = lazy(() => import('./pages/Chapter1_2'))
const Chapter2_1 = lazy(() => import('./pages/Chapter2_1'))
const Chapter2_2 = lazy(() => import('./pages/Chapter2_2'))
const Final = lazy(() => import('./pages/Final'))

function LoadingScreen() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center px-6 text-center">
      <div className="rounded-[28px] border border-primary/10 bg-white/90 px-8 py-6 shadow-xl shadow-primary/5 backdrop-blur-xl">
        <div className="text-[0.7rem] font-black uppercase tracking-[0.28em] text-primary/50">Loading</div>
        <div className="mt-3 font-[Fredoka] text-3xl font-bold text-text-dark">Opening the inventor lab...</div>
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/1-1" element={<Chapter1_1 />} />
            <Route path="/1-2" element={<Chapter1_2 />} />
            <Route path="/2-1" element={<Chapter2_1 />} />
            <Route path="/2-2" element={<Chapter2_2 />} />
            <Route path="/final" element={<Final />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
)
