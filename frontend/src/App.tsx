import { Link, Route, Routes } from 'react-router-dom';
import CreateLink from './pages/CreateLink';
import PaymentPage from './pages/PaymentPage';
import HistoryPage from './pages/HistoryPage';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <div className="app">
      <header>
        <Link to="/">Pay Links</Link>
        <nav>
          <Link to="/">New link</Link> | <Link to="/history">History</Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<CreateLink />} />
          <Route path="/pay/:id" element={<PaymentPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}
