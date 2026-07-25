// ============================================
// script.js — this is where JavaScript behavior lives
// ============================================

// This function grabs the current time and displays it
function updateClock() {
  const now = new Date(); // JS built-in object that knows the current date/time

  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();

  // Figure out AM or PM, then convert hours to 12-hour format
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours === 0 ? 12 : hours; // "0" should display as "12"

  // Add a leading zero if the number is less than 10 (e.g. "9" -> "09")
  hours = hours.toString().padStart(2, '0');
  minutes = minutes.toString().padStart(2, '0');
  seconds = seconds.toString().padStart(2, '0');

  // Build the final time string, now with AM/PM
  const timeString = `${hours}:${minutes}:${seconds} ${ampm}`;

  document.getElementById('clock').textContent = timeString;
}

updateClock();
setInterval(updateClock, 1000);


// ============================================
// DARK / LIGHT MODE TOGGLE
// ============================================

const toggleButton = document.getElementById('theme-toggle');

toggleButton.addEventListener('click', function () {
  // .toggle() adds the class if it's missing, removes it if it's present
  document.body.classList.toggle('light-mode');

  // Update the button's own text/icon depending on current mode
  if (document.body.classList.contains('light-mode')) {
    toggleButton.textContent = '🌙 Dark Mode';
  } else {
    toggleButton.textContent = '☀️ Light Mode';
  }
});
