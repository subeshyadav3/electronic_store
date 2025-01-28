
import { BrowserRouter as Router, Routes,Route} from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Login from './components/auth/login'
import Store from './components/products/products'

function App() {


  return (
    <Router>
        <Routes>
          <Route path="/"  index element={<Home />} />
          <Route path='/login' element={<Login />} />
          {/* <Route path='/register' element={<Register />} /> */}
          <Route path='/store' element={<Store />} />
        </Routes>
      </Router>
  )
}

export default App
