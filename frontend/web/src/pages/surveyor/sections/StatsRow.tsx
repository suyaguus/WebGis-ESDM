import { StatCard } from '../../../components/ui';
import { SURVEYOR_SENSORS, SURVEYOR_MEASUREMENTS, TODAY_TASKS } from '../../../constants/surveyorData';

export default function SurveyorStatsRow() {
  const totalSensor     = SURVEYOR_SENSORS.length;
  const alertSensor     = SURVEYOR_SENSORS.filter(s => s.status === 'alert').length;
  const selesai         = TODAY_TASKS.filter(t => t.status === 'selesai').length;
  const totalToday      = TODAY_TASKS.length;
  const pendingVerif    = SURVEYOR_MEASUREMENTS.filter(m => m.status === 'pending').length;
  const totalBulanIni   = SURVEYOR_MEASUREMENTS.filter(m => m.date.includes('Apr 2026')).length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <StatCard
        label="Sensor Ditugaskan"
        value={totalSensor}
        sub={`${alertSensor > 0 ? `${alertSensor} perlu perhatian` : 'Semua normal'}`}
        color={alertSensor > 0 ? 'red' : 'blue'}
        trendDown={alertSensor > 0}
      />
      <StatCard
        label="Selesai Hari Ini"
        value={`${selesai}/${totalToday}`}
        sub={selesai === totalToday ? 'Semua tugas selesai' : `${totalToday - selesai} belum dikerjakan`}
        color={selesai === totalToday ? 'green' : 'amber'}
        trendUp={selesai === totalToday}
      />
      <StatCard
        label="Pending Verifikasi"
        value={pendingVerif}
        sub="Menunggu persetujuan admin"
        color={pendingVerif > 0 ? 'amber' : 'green'}
      />
      <StatCard
        label="Pengukuran Bulan Ini"
        value={totalBulanIni}
        sub="April 2026"
        color="blue"
        trendUp
      />
    </div>
  );
}
