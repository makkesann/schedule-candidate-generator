// Popup UI logic

// DOM elements
let generateBtn;
let statusDiv;
let resultDiv;

// Settings inputs
let candidateCountInput;
let meetingDurationInput;
let startTimeInput;
let endTimeInput;
let searchDaysInput;
let weekdayCheckboxes;

// Calendar API instance
const calendarAPI = new CalendarAPI();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
  // Get DOM elements
  generateBtn = document.getElementById('generateBtn');
  statusDiv = document.getElementById('status');
  resultDiv = document.getElementById('result');

  candidateCountInput = document.getElementById('candidateCount');
  meetingDurationInput = document.getElementById('meetingDuration');
  startTimeInput = document.getElementById('startTime');
  endTimeInput = document.getElementById('endTime');
  searchDaysInput = document.getElementById('searchDays');

  weekdayCheckboxes = {
    mon: document.getElementById('weekday-mon'),
    tue: document.getElementById('weekday-tue'),
    wed: document.getElementById('weekday-wed'),
    thu: document.getElementById('weekday-thu'),
    fri: document.getElementById('weekday-fri'),
    sat: document.getElementById('weekday-sat'),
    sun: document.getElementById('weekday-sun')
  };

  // Load saved settings
  await loadSettings();

  // Add event listeners
  generateBtn.addEventListener('click', generateCandidates);

  // Save settings when they change
  candidateCountInput.addEventListener('change', saveSettings);
  meetingDurationInput.addEventListener('change', saveSettings);
  startTimeInput.addEventListener('change', saveSettings);
  endTimeInput.addEventListener('change', saveSettings);
  searchDaysInput.addEventListener('change', saveSettings);

  Object.values(weekdayCheckboxes).forEach(checkbox => {
    checkbox.addEventListener('change', saveSettings);
  });
});

// Load settings from storage
async function loadSettings() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['settings'], (result) => {
      if (result.settings) {
        const settings = result.settings;

        if (settings.candidateCount !== undefined) {
          candidateCountInput.value = settings.candidateCount;
        }
        if (settings.meetingDuration !== undefined) {
          meetingDurationInput.value = settings.meetingDuration;
        }
        if (settings.startTime !== undefined) {
          startTimeInput.value = settings.startTime;
        }
        if (settings.endTime !== undefined) {
          endTimeInput.value = settings.endTime;
        }
        if (settings.searchDays !== undefined) {
          searchDaysInput.value = settings.searchDays;
        }
        if (settings.weekdays !== undefined) {
          // Reset all checkboxes
          Object.values(weekdayCheckboxes).forEach(cb => cb.checked = false);

          // Set checked based on saved weekdays
          settings.weekdays.forEach(day => {
            const checkboxMap = {
              0: 'sun', 1: 'mon', 2: 'tue', 3: 'wed',
              4: 'thu', 5: 'fri', 6: 'sat'
            };
            const checkboxKey = checkboxMap[day];
            if (weekdayCheckboxes[checkboxKey]) {
              weekdayCheckboxes[checkboxKey].checked = true;
            }
          });
        }
      }
      resolve();
    });
  });
}

// Save settings to storage
function saveSettings() {
  const settings = getCurrentSettings();
  chrome.storage.local.set({ settings: settings });
}

// Get current settings from UI
function getCurrentSettings() {
  const weekdays = [];
  Object.entries(weekdayCheckboxes).forEach(([key, checkbox]) => {
    if (checkbox.checked) {
      weekdays.push(parseInt(checkbox.value));
    }
  });

  return {
    candidateCount: parseInt(candidateCountInput.value),
    meetingDuration: parseInt(meetingDurationInput.value),
    startTime: startTimeInput.value,
    endTime: endTimeInput.value,
    searchDays: parseInt(searchDaysInput.value),
    weekdays: weekdays
  };
}

// Generate meeting candidates
async function generateCandidates() {
  try {
    // Disable button and show processing status
    generateBtn.disabled = true;
    showStatus('処理中...', 'info');
    resultDiv.textContent = '';

    // Get current settings
    const settings = getCurrentSettings();

    // Validate settings
    if (settings.weekdays.length === 0) {
      showStatus('少なくとも1つの曜日を選択してください', 'error');
      generateBtn.disabled = false;
      return;
    }

    // Get date range
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + settings.searchDays);

    // Fetch calendar events
    showStatus('カレンダー情報を取得中...', 'info');
    const events = await calendarAPI.getEvents(startDate, endDate);

    // Generate slots
    showStatus('候補を生成中...', 'info');
    const generator = new SlotGenerator(settings);
    const slots = generator.generateSlots(events, startDate);

    if (slots.length === 0) {
      showStatus('条件に合う候補が見つかりませんでした', 'error');
      generateBtn.disabled = false;
      return;
    }

    // Format output
    const formattedOutput = Formatter.formatSlots(slots);

    // Copy to clipboard
    await navigator.clipboard.writeText(formattedOutput);

    // Show result
    resultDiv.textContent = formattedOutput;
    showStatus(`候補日時をコピーしました（${slots.length}件）`, 'success');

  } catch (error) {
    console.error('Error generating candidates:', error);
    showStatus(`エラーが発生しました: ${error.message}`, 'error');
  } finally {
    generateBtn.disabled = false;
  }
}

// Show status message
function showStatus(message, type) {
  statusDiv.textContent = message;
  statusDiv.className = `status ${type}`;

  // Auto-hide success messages after 3 seconds
  if (type === 'success') {
    setTimeout(() => {
      statusDiv.textContent = '';
      statusDiv.className = 'status';
    }, 3000);
  }
}
