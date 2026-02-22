import { useAuth } from '../context/AuthContext';
import { User } from 'lucide-react';

export default function Header() {
  const { adminEmail } = useAuth();

  return (
    <header className="header">
      <h1 className="page-title" id="page-title"></h1>
      <div className="header-right">
        <div className="admin-badge">
          <User size={16} />
          <span>{adminEmail ?? 'Admin'}</span>
        </div>
      </div>
    </header>
  );
}
