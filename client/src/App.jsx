import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Login from './components/auth/login';
import Store from './components/products/store';
import Register from './components/auth/register';
import ProtectedRoute from './components/auth/protectedRoute';
import { AuthProvider } from './context/authContext';
import { Navigate } from 'react-router-dom';
import Error404 from './pages/Error404';
import ProductProvider from './context/productContext';


function App() {
  return (
    <AuthProvider>
      <ProductProvider> 
        <Router>
          <Routes>
            
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

      
            <Route element={<ProtectedRoute />}>
              <Route path="/store" element={<Store />} />
              
            </Route>

            <Route path="*" element={<Error404 />} />
          </Routes>
        </Router>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;
