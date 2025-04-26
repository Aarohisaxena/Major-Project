// dashboard.js - Simulate anomaly detection alerts

const alertsContainer = document.getElementById("alerts");

// Sample alerts to simulate real-time behavior
const sampleAlerts = [
  {
    message: "⚠️ Unusual movement detected near Platform 3.",
    time: "08:45 AM"
  },
  {
    message: "⚠️ Suspicious activity noticed near baggage area.",
    time: "09:05 AM"
  },
  {
    message: "⚠️ Crowd congestion at entry gate.",
    time: "09:20 AM"
  },
  {
    message: "⚠️ Object left unattended near ticket counter.",
    time: "09:45 AM"
  }
];

let alertIndex = 0;

function showNextAlert() {
  if (alertIndex < sampleAlerts.length) {
    const alert = sampleAlerts[alertIndex];

    const alertBox = document.createElement("div");
    alertBox.className = "alert-box animated";
    alertBox.innerHTML = `
      <strong>${alert.time}</strong>: ${alert.message}
    `;

    alertsContainer.prepend(alertBox);
    alertIndex++;
  } else {
    alertIndex = 0; // Loop alerts
  }
}

// Show a new alert every 7 seconds
setInterval(showNextAlert, 7000);

// Trigger first alert on load
window.onload = () => showNextAlert();