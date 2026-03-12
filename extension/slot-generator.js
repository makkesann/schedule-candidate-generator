// Slot generator - calculates available time slots

class SlotGenerator {
  constructor(config) {
    this.config = {
      meetingDuration: config.meetingDuration || 60, // minutes
      startTime: config.startTime || '09:00',
      endTime: config.endTime || '18:00',
      weekdays: config.weekdays || [1, 2, 3, 4, 5], // Mon-Fri by default
      candidateCount: config.candidateCount || 5,
      searchDays: config.searchDays || 7
    };
  }

  // Generate available time slots from events
  generateSlots(events, startDate) {
    const slots = [];
    const endSearchDate = new Date(startDate);
    endSearchDate.setDate(endSearchDate.getDate() + this.config.searchDays);

    // Process each day
    for (let currentDate = new Date(startDate);
         currentDate < endSearchDate && slots.length < this.config.candidateCount;
         currentDate.setDate(currentDate.getDate() + 1)) {

      // Check if this day is in the allowed weekdays
      const dayOfWeek = currentDate.getDay();
      if (!this.config.weekdays.includes(dayOfWeek)) {
        continue;
      }

      // Get events for this day
      const dayEvents = this.getEventsForDay(events, currentDate);

      // Calculate available slots for this day
      const daySlots = this.calculateDaySlots(currentDate, dayEvents);

      // Add slots until we reach the candidate count
      for (const slot of daySlots) {
        if (slots.length >= this.config.candidateCount) {
          break;
        }
        slots.push(slot);
      }
    }

    return slots;
  }

  // Get events for a specific day
  getEventsForDay(events, date) {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    return events.filter(event => {
      return event.start < dayEnd && event.end > dayStart;
    }).sort((a, b) => a.start - b.start);
  }

  // Calculate available slots for a single day
  calculateDaySlots(date, events) {
    const slots = [];

    // Parse start and end times
    const [startHour, startMinute] = this.config.startTime.split(':').map(Number);
    const [endHour, endMinute] = this.config.endTime.split(':').map(Number);

    // Create boundary times for this day
    const dayStart = new Date(date);
    dayStart.setHours(startHour, startMinute, 0, 0);

    const dayEnd = new Date(date);
    dayEnd.setHours(endHour, endMinute, 0, 0);

    // If we're checking today, make sure we start from current time
    const now = new Date();
    const effectiveStart = date.toDateString() === now.toDateString() && now > dayStart ? now : dayStart;

    // Calculate gaps between events
    let currentTime = new Date(effectiveStart);

    for (const event of events) {
      const eventStart = event.start < dayStart ? dayStart : event.start;
      const eventEnd = event.end > dayEnd ? dayEnd : event.end;

      // Check if there's a gap before this event
      if (currentTime < eventStart) {
        const gap = this.createSlotsFromGap(currentTime, eventStart);
        slots.push(...gap);
      }

      // Move current time to the end of this event
      currentTime = new Date(Math.max(currentTime, eventEnd));
    }

    // Check for remaining time after all events
    if (currentTime < dayEnd) {
      const gap = this.createSlotsFromGap(currentTime, dayEnd);
      slots.push(...gap);
    }

    return slots;
  }

  // Create slots from a time gap
  createSlotsFromGap(start, end) {
    const slots = [];
    const durationMs = this.config.meetingDuration * 60 * 1000;
    const gapDuration = end - start;

    // Check if gap is large enough
    if (gapDuration < durationMs) {
      return slots;
    }

    // For simplicity, create one slot at the start of the gap
    // Could be enhanced to create multiple slots within larger gaps
    const slotStart = new Date(start);
    const slotEnd = new Date(slotStart.getTime() + durationMs);

    if (slotEnd <= end) {
      slots.push({
        start: slotStart,
        end: slotEnd
      });
    }

    return slots;
  }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SlotGenerator;
}
