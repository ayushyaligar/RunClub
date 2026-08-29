import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Login from './pages/Login.jsx';
import RunsList from './pages/RunsList.jsx';
import RunDetail from './pages/RunDetail.jsx';

function Nav() {
  const { user, logout } = useAuth();
  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc', marginBottom: '1rem' }}>
      <Link to="/runs" style={{ marginRight: '1rem' }}>Runs</Link>
      {user
        ? <button onClick={logout}>Log out ({user.role})</button>
        : <Link to="/login">Log in</Link>}
    </nav>
  );
}

function RequireAuth({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <div style={{ padding: '0 1rem' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/runs" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/runs" element={<RunsList />} />
          <Route path="/runs/:id" element={<RequireAuth><RunDetail /></RequireAuth>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}