import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppShell    from '@/components/layout/AppShell'
import Dashboard   from '@/pages/superadmin/Dashboard'
import PetaPage    from '@/pages/superadmin/peta'
import SensorPage  from '@/pages/superadmin/sensor'
import Analytics   from '@/pages/superadmin/analytics'
import Users       from '@/pages/superadmin/users'
import Companies   from '@/pages/superadmin/companies'
import Roles       from '@/pages/superadmin/roles'
import Reports     from '@/pages/superadmin/reports'
import Config      from '@/pages/superadmin/config'
import ServerPage  from '@/pages/superadmin/server'
import Audit       from '@/pages/superadmin/audit'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/superadmin" replace />} />

        <Route path="/superadmin" element={<AppShell />}>
          <Route index            element={<Dashboard />}  />
          <Route path="peta"      element={<PetaPage />}   />
          <Route path="sensor"    element={<SensorPage />} />
          <Route path="analytics" element={<Analytics />}  />
          <Route path="users"     element={<Users />}      />
          <Route path="companies" element={<Companies />}  />
          <Route path="roles"     element={<Roles />}      />
          <Route path="reports"   element={<Reports />}    />
          <Route path="config"    element={<Config />}     />
          <Route path="server"    element={<ServerPage />} />
          <Route path="audit"     element={<Audit />}      />
        </Route>

        <Route path="*" element={<Navigate to="/superadmin" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
