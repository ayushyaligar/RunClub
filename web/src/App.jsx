import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate} from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Login from './pages/Login.jsx';
import RunsList from './pages/RunsList.jsx';
import RunDetail from './pages/RunDetail.jsx';
import Profile from './pages/Profile.jsx';
import Register from './pages/Register.jsx';
import AdminRunForm from './pages/AdminRunForm.jsx';
import AdminAnnouncementForm from './pages/AdminAnnouncementForm.jsx';
import AdminNotify from './pages/AdminNotify.jsx';

function Nav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className="header">
      <Link to="/runs" className="wordmark">RUNCLUB</Link>
      <nav className="nav">
        <Link to="/runs" className="active">RUNS</Link>
        {user && <Link to="/profile">PROFILE</Link>}
        {user
          ? <button onClick={handleLogout}>LOG OUT</button>
          : <Link to="/login">LOG IN</Link>}
        {user?.role === 'admin' && <Link to="/admin/runs/new">NEW RUN</Link>}
      </nav>
    </header>
  );
}

function RequireAuth({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

function RequireAdmin({ children }) {
  const { user } = useAuth();
  return user?.role === 'admin' ? children : <Navigate to="/runs" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/runs" element={<RequireAuth><RunsList /></RequireAuth>} />
          <Route path="/runs/:id" element={<RequireAuth><RunDetail /></RequireAuth>} />
          <Route path="/admin/runs/new" element={<RequireAdmin><AdminRunForm /></RequireAdmin>} />
          <Route path="/admin/runs/:id/edit" element={<RequireAdmin><AdminRunForm /></RequireAdmin>} />
          <Route path="/admin/announcements/new" element={<RequireAdmin><AdminAnnouncementForm /></RequireAdmin>} />
          <Route path="/admin/announcements/:id/edit" element={<RequireAdmin><AdminAnnouncementForm /></RequireAdmin>} />
          <Route path="/admin/announcements/:id/notify" element={<RequireAdmin><AdminNotify /></RequireAdmin>} />
        </Routes>
    </BrowserRouter>
  );
}