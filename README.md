Project ini bernama sebuah SIGAT (Sistem Informasi geologi dan Air Tanah) — aplikasi peta berbasis web yang menampilkan data pemantauan kondisi tanah (land subsidence / penurunan muka tanah) dan air tanah secara visual di atas peta interaktif. Referensinya adalah SIPASTI (Sistem Informasi geologi dan Air Tanah) milik Badan Geologi ESDM.

Komponen Utama: 

1.  Peta Interaktif (Interactive Map)
    - Menampilkan peta wilayah (misalnya kota tertentu seperti Jakarta)
    - Menggunakan library seperti Leaflet.js atau Mapbox
    - Mendukung zoom in/out, drag, dan layer switching (satelit, street map, dll.)

2.  Marker / Titik Sensor di Peta
    - 🔵 Titik biru (tetesan air) → Sensor air tanah (sumur pantau)
    - 🟠 Titik oranye (pin merah-oranye) → Sensor GNSS untuk penurunan muka tanah
    - 🟢 Titik hijau → Kemungkinan status normal / sensor aktif

3.  Popup Info Sensor
    Ketika marker diklik, muncul popup yang menampilkan:
    Field                           Contoh Data

    Code                            23B
    Lokasi                          Latumenten
    Longitude / Latitude            106.794... / -6.149...
    Nilai Vertikal (Elipsoid)       20.762 Cm
    Trend Penurunan Muka Tanah      -1.940 Cm/Tahun
    Tahun                           2019

4.  Halaman Detail Sensor
    Setelah klik "Lihat Detail", muncul panel berisi:
    - Grafik time-series (Data Pengukuran GNSS Vertikal dari 2016–2019)
    - Tabel observasi terakhir (semua data numerik)
    - Foto sensor di lapangan
    - Mini-map lokasi sensor

5.  Dashboard
    Halaman ringkasan statistik seperti:
    - Total jumlah sensor aktif
    - Rata-rata penurunan tanah
    - Grafik trend keseluruhan wilayah

6.  Pemantauan Realtime (opsional/advanced)
    - Data sensor yang terus diperbarui secara otomatis