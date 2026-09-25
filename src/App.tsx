import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Search } from './pages/Search';
import { PropertyDetail } from './pages/PropertyDetail';
import { Checkout } from './pages/Checkout';
import { MyBookings } from './pages/MyBookings';
import { AffiliateProgram } from './pages/AffiliateProgram';
import { AffiliateDashboard } from './pages/AffiliateDashboard';
import { AdminPanel } from './pages/AdminPanel';
import { BookingConfirmation } from './pages/BookingConfirmation';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/buscar" element={<Search />} />
            <Route path="/imovel/:id" element={<PropertyDetail />} />
            <Route path="/checkout/:bookingId" element={<Checkout />} />
            <Route path="/minhas-reservas" element={<MyBookings />} />
            <Route path="/confirmacao/:bookingId" element={<BookingConfirmation />} />
            <Route path="/afiliados" element={<AffiliateProgram />} />
            <Route path="/afiliados/painel" element={<AffiliateDashboard />} />
            <Route path="/painel" element={<AdminPanel />} />
            <Route path="/parceiro/:code" element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
