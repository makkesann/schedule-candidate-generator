// Formatter - formats time slots into the required output format

class Formatter {
  // Format slots into Japanese date/time format
  static formatSlots(slots) {
    return slots.map(slot => this.formatSlot(slot)).join('\n');
  }

  // Format a single slot
  static formatSlot(slot) {
    const start = slot.start;
    const end = slot.end;

    const month = start.getMonth() + 1;
    const day = start.getDate();
    const weekday = this.getWeekdayName(start.getDay());

    const startHour = start.getHours();
    const startMinute = String(start.getMinutes()).padStart(2, '0');

    const endHour = end.getHours();
    const endMinute = String(end.getMinutes()).padStart(2, '0');

    return `${month}月${day}日（${weekday}）${startHour}時${startMinute}分〜${endHour}時${endMinute}分`;
  }

  // Get Japanese weekday name
  static getWeekdayName(dayIndex) {
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    return weekdays[dayIndex];
  }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Formatter;
}
