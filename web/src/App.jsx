import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Login from './pages/Login.jsx';
import RunsList from './pages/RunsList.jsx';
import RunDetail from './pages/RunDetail.jsx';

function Nav() {
  const { user, logout } = useAuth();
  return (
    <header className="header">
      <Link to="/runs" className="wordmark">RUNCLUB</Link>
      <nav className="nav">
        <Link to="/runs" className="active">RUNS</Link>
        {user
          ? <button onClick={logout}>LOG OUT</button>
          : <Link to="/login">LOG IN</Link>}
      </nav>
    </header>
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
        <Routes>
          <Route path="/" element={<Navigate to="/runs" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/runs" element={<RunsList />} />
          <Route path="/runs/:id" element={<RequireAuth><RunDetail /></RequireAuth>} />
        </Routes>
    </BrowserRouter>
  );
}