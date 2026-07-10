// ============================================
// script.js — this is where JavaScript behavior lives
// ============================================

// This function grabs the current time and displays it
function updateClock() {
  const now = new Date(); // JS built-in object that knows the current date/time

  // Extract hours, minutes, seconds
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();

  // Add a leading zero if the number is less than 10 (e.g. "9" -> "09")
  hours = hours.toString().padStart(2, '0');
  minutes = minutes.toString().padStart(2, '0');
  seconds = seconds.toString().padStart(2, '0');

  // Build the final time string
  const timeString = `${hours}:${minutes}:${seconds}`;

  // Find the HTML element with id="clock" and update its text
  document.getElementById('clock').textContent = timeString;
}

// Run updateClock() immediately so the time shows right away
updateClock();

// Then run it again every 1000 milliseconds (1 second) forever
setInterval(updateClock, 1000);
