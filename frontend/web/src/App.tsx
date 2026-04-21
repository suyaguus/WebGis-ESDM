import { useCallback, useEffect, useState } from 'react';
import { useAppStore, useAuthStore } from '@/store';

import LandingPage from '@/pages/public/Landing';
import HomePage from '@/pages/public/Home';
import InfoPage from '@/pages/public/Info';
import ContactPage from '@/pages/public/Contact';
import LoginPage from '@/pages/auth/Login';
import RegisterPage from '@/pages/auth/Register';

/* ── Super Admin ── */
import SuperAdminShell from '@/components/layout/superAdmin/AppShell';
import SuperAdminDashboard from '@/pages/superadmin/Dashboard';
import PetaPage from '@/pages/superadmin/peta/index';
import SensorPage from '@/pages/superadmin/sensor/index';
import AnalyticsPage from '@/pages/superadmin/analytics/index';
import UsersPage from '@/pages/superadmin/users/index';
import CompaniesPage from '@/pages/superadmin/companies/index';
import RolesPage from '@/pages/superadmin/roles/index';
import VerifikasiPage from '@/pages/superadmin/verifikasi/index';
import ReportsPage from '@/pages/superadmin/reports/index';
import KirimKadisPage from '@/pages/superadmin/kirim-kadis/index';
import ConfigPage from '@/pages/superadmin/config/index';
import ServerPage from '@/pages/superadmin/server/index';
import AuditPage from '@/pages/superadmin/audit/index';

/* ── Admin Perusahaan ── */
import AdminAppShell from '@/components/layout/adminPerusahaan/AppShell';
import AdminDashboard from '@/pages/adminPerusahaan/Dashboard';
import AdminPetaPage from '@/pages/adminPerusahaan/peta/index';
import AdminSumurPage from '@/pages/adminPerusahaan/sumur/index';
import AdminDokumenPage from '@/pages/adminPerusahaan/dokumen/index';
import AdminStatusPage from '@/pages/adminPerusahaan/status/index';
import AdminLaporanPage from '@/pages/adminPerusahaan/laporan/index';
import AdminKirimSurveyorPage from '@/pages/adminPerusahaan/kirim/index';

/* ── Kadis ── */
import KadisAppShell from '@/components/layout/Kadis/appShell';
import KadisDashboard from '@/pages/kadis/Dashboard';
import KadisPetaPage from '@/pages/kadis/peta/index';
import KadisAnalitikPage from '@/pages/kadis/analitik/index';
import KadisLaporanPage from '@/pages/kadis/laporan/index';
import KadisPerusahaanPage from '@/pages/kadis/perusahaan/index';
import KadisPersetujuanPage from '@/pages/kadis/persetujuan/index';

/* ── Surveyor ── */
import SurveyorAppShell from '@/components/layout/surveyor/AppShell';
import SurveyorDashboard from '@/pages/surveyor/Dashboard';
import SurveyorSensorPage from '@/pages/surveyor/sensor/index';
import SurveyorInputPage from '@/pages/surveyor/input/index';
import SurveyorDokumenPage from '@/pages/surveyor/dokumen/index';
import SurveyorPetaPage from '@/pages/surveyor/peta/index';
import SurveyorLaporanPage from '@/pages/surveyor/laporan/index';
import SurveyorKirimPage from '@/pages/surveyor/kirim/index';

type AppRoute = 'public' | 'landing' | 'home' | 'info' | 'contact' | 'login' | 'register' | 'dashboard';

function routeFromPath(pathname: string): AppRoute {
  if (pathname === '/login') return 'login';
  if (pathname === '/register') return 'register';
  if (pathname === '/dashboard') return 'dashboard';
  if (pathname === '/peta') return 'landing';
  if (pathname === '/beranda') return 'home';
  if (pathname === '/informasi') return 'info';
  if (pathname === '/kontak') return 'contact';
  return 'public';
}

function pathFromRoute(route: AppRoute): string {
  switch (route) {
    case 'login':
      return '/login';
    case 'register':
      return '/register';
    case 'dashboard':
      return '/dashboard';
    case 'landing':
      return '/peta';
    case 'home':
      return '/beranda';
    case 'info':
      return '/informasi';
    case 'contact':
      return '/kontak';
    default:
      return '/';
  }
}

function SuperAdminApp() {
  const { activePage } = useAppStore();
  const isFullH = activePage === 'peta';
  const page = (() => {
    switch (activePage) {
      case 'dashboard':
        return <SuperAdminDashboard />;
      case 'peta':
        return <PetaPage />;
      case 'sensor':
        return <SensorPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'users':
        return <UsersPage />;
      case 'companies':
        return <CompaniesPage />;
      case 'roles':        return <RolesPage />;
      case 'verifikasi':   return <VerifikasiPage />;
      case 'reports':      return <ReportsPage />;
      case 'kirim-kadis':  return <KirimKadisPage />;
      case 'config':       return <ConfigPage />;
      case 'server':       return <ServerPage />;
      case 'audit':        return <AuditPage />;
      default:             return <SuperAdminDashboard />;
    }
  })();

  return <SuperAdminShell fullHeight={isFullH}>{page}</SuperAdminShell>;
}

function AdminPerusahaanApp() {
  const { activePage } = useAppStore();
  const isFullH = activePage === 'ap-peta';
  const page = (() => {
    switch (activePage) {
      case 'ap-dashboard': return <AdminDashboard />;
      case 'ap-sumur':     return <AdminSumurPage />;
      case 'ap-dokumen':   return <AdminDokumenPage />;
      case 'ap-status':    return <AdminStatusPage />;
      case 'ap-laporan':   return <AdminLaporanPage />;
      case 'ap-kirim':     return <AdminKirimSurveyorPage />;
      case 'ap-peta':      return <AdminPetaPage />;
      default:             return <AdminDashboard />;
    }
  })();

  return <AdminAppShell fullHeight={isFullH}>{page}</AdminAppShell>;
}

function KadisApp() {
  const { activePage } = useAppStore();
  const isFullH = activePage === 'kadis-peta';
  const page = (() => {
    switch (activePage) {
      case 'kadis-dashboard':   return <KadisDashboard />;
      case 'kadis-peta':        return <KadisPetaPage />;
      case 'kadis-analitik':    return <KadisAnalitikPage />;
      case 'kadis-laporan':     return <KadisLaporanPage />;
      case 'kadis-perusahaan':  return <KadisPerusahaanPage />;
      case 'kadis-persetujuan': return <KadisPersetujuanPage />;
      default:                  return <KadisDashboard />;
    }
  })();

  return <KadisAppShell fullHeight={isFullH}>{page}</KadisAppShell>;
}

function SurveyorApp() {
  const { activePage } = useAppStore();
  const isFullH = activePage === 'sv-peta';
  const page = (() => {
    switch (activePage) {
      case 'sv-dashboard': return <SurveyorDashboard />;
      case 'sv-sumur':     return <SurveyorSensorPage />;
      case 'sv-input':     return <SurveyorInputPage />;
      case 'sv-dokumen':   return <SurveyorDokumenPage />;
      case 'sv-peta':      return <SurveyorPetaPage />;
      case 'sv-laporan':   return <SurveyorLaporanPage />;
      case 'sv-kirim':     return <SurveyorKirimPage />;
      default:             return <SurveyorDashboard />;
    }
  })();

  return <SurveyorAppShell fullHeight={isFullH}>{page}</SurveyorAppShell>;
}

function DashboardRouter() {
  const { role } = useAppStore();

  if (role === 'admin') return <AdminPerusahaanApp />;
  if (role === 'kadis') return <KadisApp />;
  if (role === 'surveyor') return <SurveyorApp />;
  return <SuperAdminApp />;
}

export default function App() {
  const { role, setRole } = useAppStore();
  const { isAuthenticated, user, clearAuth } = useAuthStore();

  const [route, setRoute] = useState<AppRoute>(() => routeFromPath(window.location.pathname));

  const navigate = useCallback((nextRoute: AppRoute, replace = false) => {
    const nextPath = pathFromRoute(nextRoute);

    if (replace) {
      window.history.replaceState(null, '', nextPath);
    } else {
      window.history.pushState(null, '', nextPath);
    }

    setRoute(nextRoute);
  }, []);

  const openAuthPage = useCallback((target: 'login' | 'register') => {
    if (isAuthenticated) {
      clearAuth();
    }
    navigate(target);
  }, [isAuthenticated, clearAuth, navigate]);

  useEffect(() => {
    const onPopState = () => {
      setRoute(routeFromPath(window.location.pathname));
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    if (isAuthenticated && user?.role && user.role !== role) {
      setRole(user.role);
    }
  }, [isAuthenticated, user?.role, role, setRole]);

  useEffect(() => {
    if (!isAuthenticated && route === 'dashboard') {
      navigate('login', true);
      return;
    }

    if (isAuthenticated && (route === 'login' || route === 'register')) {
      navigate('dashboard', true);
    }
  }, [isAuthenticated, route, navigate]);

  const handlePublicNavigate = useCallback((page: 'landing' | 'home' | 'info' | 'contact') => {
    const routeMap = {
      'landing': 'landing' as const,
      'home': 'home' as const,
      'info': 'info' as const,
      'contact': 'contact' as const,
    };
    navigate(routeMap[page]);
  }, [navigate]);

  if (route === 'public' || route === 'landing' || route === 'home' || route === 'info' || route === 'contact') {
    const pageMap = {
      'public': (
        <LandingPage
          onNavigate={handlePublicNavigate}
          onLogin={() => openAuthPage('login')}
          onRegister={() => openAuthPage('register')}
        />
      ),
      'landing': (
        <LandingPage
          onNavigate={handlePublicNavigate}
          onLogin={() => openAuthPage('login')}
          onRegister={() => openAuthPage('register')}
        />
      ),
      'home': (
        <HomePage
          onNavigate={handlePublicNavigate}
          onLogin={() => openAuthPage('login')}
          onRegister={() => openAuthPage('register')}
        />
      ),
      'info': (
        <InfoPage
          onNavigate={handlePublicNavigate}
          onLogin={() => openAuthPage('login')}
          onRegister={() => openAuthPage('register')}
        />
      ),
      'contact': (
        <ContactPage
          onNavigate={handlePublicNavigate}
          onLogin={() => openAuthPage('login')}
          onRegister={() => openAuthPage('register')}
        />
      ),
    };
    return pageMap[route];
  }

  if (route === 'login') {
    return (
      <LoginPage
        onBackToMap={() => navigate('public')}
        onGoRegister={() => navigate('register')}
        onSuccess={() => navigate('dashboard', true)}
      />
    );
  }

  if (route === 'register') {
    return (
      <RegisterPage
        onBackToMap={() => navigate('public')}
        onGoLogin={() => navigate('login')}
        onSuccess={() => navigate('dashboard', true)}
      />
    );
  }

  if (!isAuthenticated) {
    return (
      <LoginPage
        onBackToMap={() => navigate('public')}
        onGoRegister={() => navigate('register')}
        onSuccess={() => navigate('dashboard', true)}
      />
    );
  }

  return <DashboardRouter />;
}
