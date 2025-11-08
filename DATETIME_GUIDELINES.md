# DateTime Communication Guidelines

## Overview
This document outlines the standardized approach for datetime communication between frontend and backend in the EraLove application.

## Format Standard

### Backend Expectation
- **Format**: RFC3339 / ISO 8601 with timezone
- **Example**: `"2025-11-06T12:00:00.000Z"`
- **Go Type**: `time.Time`

### Frontend Storage
- **Format**: RFC3339 / ISO 8601 with timezone
- **Example**: `"2025-11-06T12:00:00.000Z"`
- **JavaScript Type**: `Date` object or ISO string

### Display Format
- **Date Only**: `YYYY-MM-DD` (e.g., `"2025-11-06"`)
- **Time Only**: `HH:MM` (e.g., `"14:30"`)

## Utility Functions

All datetime utility functions are located in `/src/utils/datetimeUtils.ts`.

### Sending Data to Backend

#### `formatDateTimeForBackend(dateStr: string, timeStr?: string): string`
Convert date string and optional time to RFC3339 format for backend.

```typescript
import { formatDateTimeForBackend } from '@/utils/datetimeUtils';

// With time
const datetime = formatDateTimeForBackend('2025-11-06', '14:30');
// Returns: "2025-11-06T14:30:00.000Z"

// Without time (uses noon)
const datetime = formatDateTimeForBackend('2025-11-06');
// Returns: "2025-11-06T12:00:00.000Z"
```

#### `formatDateObjectForBackend(date: Date): string`
Convert JavaScript Date object to RFC3339 format.

```typescript
import { formatDateObjectForBackend } from '@/utils/datetimeUtils';

const date = new Date();
const datetime = formatDateObjectForBackend(date);
// Returns: "2025-11-06T12:00:00.000Z"
```

### Receiving Data from Backend

#### `parseDateTimeFromBackend(dateTimeStr: string): Date`
Parse RFC3339 datetime string to JavaScript Date object.

```typescript
import { parseDateTimeFromBackend } from '@/utils/datetimeUtils';

const dateObj = parseDateTimeFromBackend("2025-11-06T12:00:00.000Z");
// Returns: Date object
```

#### `extractDateFromBackend(dateTimeStr: string): string`
Extract date part (YYYY-MM-DD) from backend datetime.

```typescript
import { extractDateFromBackend } from '@/utils/datetimeUtils';

const dateStr = extractDateFromBackend("2025-11-06T12:00:00.000Z");
// Returns: "2025-11-06"
```

#### `extractTimeFromBackend(dateTimeStr: string): string`
Extract time part (HH:MM) from backend datetime.

```typescript
import { extractTimeFromBackend } from '@/utils/datetimeUtils';

const timeStr = extractTimeFromBackend("2025-11-06T14:30:00.000Z");
// Returns: "14:30"
```

### Display Functions

#### `formatDateForDisplay(dateTimeStr: string, locale?: string): string`
Format date for user display (locale-aware).

```typescript
import { formatDateForDisplay } from '@/utils/datetimeUtils';

const displayDate = formatDateForDisplay("2025-11-06T12:00:00.000Z", 'en-US');
// Returns: "11/6/2025" (or based on locale)
```

#### `formatDateTimeForDisplay(dateTimeStr: string, locale?: string): string`
Format datetime for user display (locale-aware).

```typescript
import { formatDateTimeForDisplay } from '@/utils/datetimeUtils';

const displayDateTime = formatDateTimeForDisplay("2025-11-06T14:30:00.000Z", 'en-US');
// Returns: "11/6/2025, 2:30:00 PM" (or based on locale)
```

## Common Use Cases

### Creating an Event

```typescript
import { formatDateTimeForBackend } from '@/utils/datetimeUtils';

const eventData = {
  title: "Anniversary Dinner",
  date: "2025-11-06",
  time: "19:00"
};

const payload = {
  title: eventData.title,
  date: formatDateTimeForBackend(eventData.date, eventData.time),
  // Other fields...
};

await eventService.createEvent(payload);
```

### Displaying Events from Backend

```typescript
import { extractDateFromBackend, extractTimeFromBackend } from '@/utils/datetimeUtils';

const events = await eventService.getEvents();

const displayEvents = events.map(event => ({
  ...event,
  displayDate: extractDateFromBackend(event.date),
  displayTime: extractTimeFromBackend(event.date)
}));
```

### Accepting Match Request

```typescript
import { formatDateObjectForBackend } from '@/utils/datetimeUtils';

const anniversaryDate = new Date('2025-11-06');

await matchRequestService.respondToMatchRequest(requestId, {
  action: 'accept',
  anniversaryDate: formatDateObjectForBackend(anniversaryDate)
});
```

## Migration Checklist

When working with datetime fields:

- [ ] Use `formatDateTimeForBackend()` or `formatDateObjectForBackend()` when sending to backend
- [ ] Use `extractDateFromBackend()` when displaying date-only fields
- [ ] Use `extractTimeFromBackend()` when displaying time-only fields
- [ ] Use `parseDateTimeFromBackend()` when you need a Date object
- [ ] Never use `.toISOString().split('T')[0]` directly
- [ ] Never construct datetime strings manually (e.g., `${date}T${time}:00`)

## Files Already Updated

✅ `/src/utils/datetimeUtils.ts` - Utility functions
✅ `/src/pages/Dashboard.tsx` - Event and photo datetime handling
✅ `/src/components/match/MatchRequestModal.tsx` - Anniversary date handling
✅ `/src/components/photos/PhotoModal.tsx` - Photo date handling
✅ `/src/components/events/EventModal.tsx` - Event date initialization
✅ `/src/components/calendar/Calendar.tsx` - Calendar date comparison
✅ `/src/components/calendar/CalendarSuggestions.tsx` - Date string extraction

## Testing

When testing datetime functionality:

1. **Create Event**: Verify datetime is sent in RFC3339 format
2. **Display Event**: Verify date/time are extracted correctly
3. **Timezone**: Test with different timezones to ensure consistency
4. **Edge Cases**: Test with missing time, midnight, noon values

## Backend Reference

Backend expects all datetime fields in RFC3339 format:
- `time.Time` in Go automatically parses RFC3339
- Format: `"2006-01-02T15:04:05Z07:00"`
- Example: `"2025-11-06T12:00:00.000Z"`
