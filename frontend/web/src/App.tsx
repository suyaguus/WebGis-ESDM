import { useAppStore } from '@/store';

/* ── Super Admin ── */
import SuperAdminShell     from '@/components/layout/superAdmin/AppShell';
import SuperAdminDashboard from '@/pages/superadmin/Dashboard';
import PetaPage            from '@/pages/superadmin/peta/index';
import SensorPage          from '@/pages/superadmin/sensor/index';
import AnalyticsPage       from '@/pages/superadmin/analytics/index';
import UsersPage           from '@/pages/superadmin/users/index';
import CompaniesPage       from '@/pages/superadmin/companies/index';
import RolesPage           from '@/pages/superadmin/roles/index';
import ReportsPage         from '@/pages/superadmin/reports/index';
import ConfigPage          from '@/pages/superadmin/config/index';
import ServerPage          from '@/pages/superadmin/server/index';
import AuditPage           from '@/pages/superadmin/audit/index';

/* ── Admin Perusahaan ── */
import AdminAppShell    from '@/components/layout/adminPerusahaan/AppShell';
import AdminDashboard   from '@/pages/adminPerusahaan/Dashboard';
import AdminPetaPage    from '@/pages/adminPerusahaan/peta/index';
import AdminSumurPage   from '@/pages/adminPerusahaan/sumur/index';
import AdminTimPage     from '@/pages/adminPerusahaan/tim/index';
import AdminVerifPage   from '@/pages/adminPerusahaan/verifikasi/index';
import AdminHistoriPage from '@/pages/adminPerusahaan/histori/index';
import AdminLaporanPage from '@/pages/adminPerusahaan/laporan/index';

/* ── Kadis ── */
import KadisAppShell    from '@/components/layout/Kadis/appShell';
import KadisDashboard   from '@/pages/kadis/Dashboard';
import KadisPetaPage    from '@/pages/kadis/peta/index';
import KadisAnalitikPage from '@/pages/kadis/analitik/index';
import KadisLaporanPage from '@/pages/kadis/laporan/index';
import KadisPerusahaanPage from '@/pages/kadis/perusahaan/index';

/* ─────────────────────────────────────────────────────── */

function SuperAdminApp() {
  const { activePage } = useAppStore();
  const isFullH = activePage === 'peta';
  const page = (() => {
    switch (activePage) {
      case 'dashboard':  return <SuperAdminDashboard />;
      case 'peta':       return <PetaPage />;
      case 'sensor':     return <SensorPage />;
      case 'analytics':  return <AnalyticsPage />;
      case 'users':      return <UsersPage />;
      case 'companies':  return <CompaniesPage />;
      case 'roles':      return <RolesPage />;
      case 'reports':    return <ReportsPage />;
      case 'config':     return <ConfigPage />;
      case 'server':     return <ServerPage />;
      case 'audit':      return <AuditPage />;
      default:           return <SuperAdminDashboard />;
    }
  })();
  return <SuperAdminShell fullHeight={isFullH}>{page}</SuperAdminShell>;
}

function AdminPerusahaanApp() {
  const { activePage } = useAppStore();
  const isFullH = activePage === 'ap-peta';
  const page = (() => {
    switch (activePage) {
      case 'ap-dashboard':  return <AdminDashboard />;
      case 'ap-sumur':      return <AdminSumurPage />;
      case 'ap-tim':        return <AdminTimPage />;
      case 'ap-verifikasi': return <AdminVerifPage />;
      case 'ap-histori':    return <AdminHistoriPage />;
      case 'ap-laporan':    return <AdminLaporanPage />;
      case 'ap-peta':       return <AdminPetaPage />;
      default:              return <AdminDashboard />;
    }
  })();
  return <AdminAppShell fullHeight={isFullH}>{page}</AdminAppShell>;
}

function KadisApp() {
  const { activePage } = useAppStore();
  const isFullH = activePage === 'kadis-peta';
  const page = (() => {
    switch (activePage) {
      case 'kadis-dashboard':  return <KadisDashboard />;
      case 'kadis-peta':       return <KadisPetaPage />;
      case 'kadis-analitik':   return <KadisAnalitikPage />;
      case 'kadis-laporan':    return <KadisLaporanPage />;
      case 'kadis-perusahaan': return <KadisPerusahaanPage />;
      default:                 return <KadisDashboard />;
    }
  })();
  return <KadisAppShell fullHeight={isFullH}>{page}</KadisAppShell>;
}

/* ─────────────────────────────────────────────────────── */

export default function App() {
  const { role } = useAppStore();
  if (role === 'admin')  return <AdminPerusahaanApp />;
  if (role === 'kadis')  return <KadisApp />;
  return <SuperAdminApp />;
}
