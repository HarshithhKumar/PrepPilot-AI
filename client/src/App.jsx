import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
import { getCurrentUser } from './services/api'
import { useDispatch, useSelector } from 'react-redux'
import History from './pages/History'
import Notes from './pages/Notes'
import Pricing from './pages/Pricing'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentFailed from './pages/PaymentFailed'

function App() {
  const dispatch = useDispatch()
  const [sessionReady, setSessionReady] = useState(false)

  useEffect(()=>{
   getCurrentUser(dispatch).finally(() => setSessionReady(true))
  },[dispatch])

  const {userData} = useSelector((state)=>state.user)

  if (!sessionReady) {
    return <main className="app-loading" role="status">Loading your study space…</main>
  }

  return (
    <Routes>
      <Route path='/' element={userData? <Home/> : <Navigate to="/auth" replace/>}/>
      <Route path='/auth' element={userData ? <Navigate to="/" replace/> : <Auth/>}/>
      <Route path='/history' element={userData? <History/> : <Navigate to="/auth" replace/>}/>
      <Route path='/notes' element={userData? <Notes/> : <Navigate to="/auth" replace/>}/>
      <Route path='/pricing' element={userData? <Pricing/> : <Navigate to="/auth" replace/>}/>

      <Route path='/payment-success' element={<PaymentSuccess/>}/>
      <Route path='/payment-failed' element={<PaymentFailed/>}/>
    </Routes>
  )
}

export default App
