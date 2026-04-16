import AppShell from './components/layout/superAdmin/AppShell';
import SuperAdminDashboard from '../src/pages/superadmin/Dashboard';
import PetaPage            from './pages/superadmin/peta/index';
import SensorPage          from './pages/superadmin/sensor/index';
import AnalyticsPage       from './pages/superadmin/analytics/index';
import UsersPage           from './pages/superadmin/users/index';
import CompaniesPage       from './pages/superadmin/companies/index';
import RolesPage           from '../src/pages/superadmin/roles/index';
import ReportsPage         from './pages/superadmin/reports/index';
import ConfigPage          from '../src/pages/superadmin/config/index';
import ServerPage          from './pages/superadmin/server/index';
import AuditPage           from './pages/superadmin/audit/index';
import { useAppStore } from './store';

export default function App() {
  const { activePage } = useAppStore();

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

  const isFullHeight = activePage === 'peta';
  return <AppShell fullHeight={isFullHeight}>{page}</AppShell>;
}
