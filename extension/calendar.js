// Google Calendar API integration

class CalendarAPI {
  constructor() {
    this.accessToken = null;
  }

  // Authenticate and get access token
  async authenticate() {
    return new Promise((resolve, reject) => {
      chrome.identity.getAuthToken({ interactive: true }, (token) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
          return;
        }
        this.accessToken = token;
        resolve(token);
      });
    });
  }

  // Get calendar events within the specified date range
  async getEvents(startDate, endDate) {
    if (!this.accessToken) {
      await this.authenticate();
    }

    const timeMin = startDate.toISOString();
    const timeMax = endDate.toISOString();

    const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?` +
      `timeMin=${encodeURIComponent(timeMin)}` +
      `&timeMax=${encodeURIComponent(timeMax)}` +
      `&singleEvents=true` +
      `&orderBy=startTime`;

    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired, clear it and retry
          await this.clearToken();
          await this.authenticate();
          return this.getEvents(startDate, endDate);
        }
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return this.parseEvents(data.items || []);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      throw error;
    }
  }

  // Parse events into a simpler format
  parseEvents(items) {
    return items.map(item => {
      // Handle all-day events and events with dateTime
      const start = item.start.dateTime ? new Date(item.start.dateTime) : new Date(item.start.date);
      const end = item.end.dateTime ? new Date(item.end.dateTime) : new Date(item.end.date);

      return {
        id: item.id,
        summary: item.summary || '(タイトルなし)',
        start: start,
        end: end,
        isAllDay: !item.start.dateTime
      };
    }).filter(event => !event.isAllDay); // Filter out all-day events
  }

  // Clear cached auth token
  async clearToken() {
    return new Promise((resolve) => {
      if (this.accessToken) {
        chrome.identity.removeCachedAuthToken({ token: this.accessToken }, () => {
          this.accessToken = null;
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CalendarAPI;
}
