import { WebView } from "react-native-webview";

type Props = {
    data: {
        lat: number;
        lng: number;
        status: string;
        nama: string;
        subsidence: number;
    }[];
    mode?: "all" | "single";
};

export default function LeafletMap({ data, mode = "all" }: Props) {
    const first = data && data.length > 0 ? data[0] : null;

    const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
    <style>
      html, body, #map {
        height: 100%;
        margin: 0;
      }
    </style>
  </head>
  <body>
    <div id="map"></div>

    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script>

      const data = ${JSON.stringify(data || [])};

      var map = L.map('map').setView(
        ${first
            ? `[${first.lat}, ${first.lng}]`
            : `[-2.5, 107]`
        },
        ${mode === "single" ? 12 : 5}
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

      let group = [];

      data.forEach(item => {
        const color = item.status === "kritis" ? "red" :
                      item.status === "waspada" ? "orange" : "green";

        const marker = L.circleMarker([item.lat, item.lng], {
          radius: ${mode === "single" ? 10 : 8},
          color: color,
          fillColor: color,
          fillOpacity: 0.9
        }).addTo(map);

        marker.bindPopup(
          "<b>" + item.nama + "</b><br/>" +
          "Status: " + item.status + "<br/>" +
          "Subsidence: " + item.subsidence + " cm/thn"
        );

        group.push(marker);

        ${mode === "single" ? "marker.openPopup();" : ""}
      });

      if (${mode === "all"} && group.length > 1) {
        var groupLayer = new L.featureGroup(group);
        map.fitBounds(groupLayer.getBounds());
      }

    </script>
  </body>
  </html>
  `;

    return (
        <WebView
            originWhitelist={["*"]}
            source={{ html }}
            style={{ flex: 1 }}
        />
    );
}