import { HashRouter, Routes, Route } from 'react-router-dom';
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
import { Wishlists } from './pages/Wishlists';
import { Loyalty } from './pages/Loyalty';
import { SignIn, SignUp, ResetPassword } from './pages/Auth';

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
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
            <Route path="/favoritos" element={<Wishlists />} />
            <Route path="/fidelidade" element={<Loyalty />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/parceiro/:code" element={<Home />} />
          </Route>
        </Routes>
      </HashRouter>
    </AppProvider>
  );
}
