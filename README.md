# React Date Range Picker

A flexible date range picker component for React, inspired by [vue2-datepicker](https://mengxiong10.github.io/vue2-datepicker/).

## Features

- 📅 Two-calendar side-by-side layout
- 🚀 Quick preset selections (Last 7 days, Last 30 days, Financial Year, etc.)
- 🎨 Clean, modern design
- 📱 Responsive layout
- ⚡ Zero external dependencies (except React)
- 🎯 TypeScript-friendly

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

This will start the development server at `http://localhost:3000`.

## Usage

```jsx
import React, { useState } from 'react';
import { DateRangePicker } from './src';

function App() {
  const [dateRange, setDateRange] = useState([null, null]);

  return (
    <DateRangePicker
      value={dateRange}
      onChange={setDateRange}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `[Date \| null, Date \| null]` | `[null, null]` | Selected date range |
| `onChange` | `(range: [Date, Date]) => void` | - | Callback when date range changes |
| `format` | `string` | `'YYYY-MM-DD'` | Date format for display |
| `placeholder` | `[string, string]` | `['Start Date', 'End Date']` | Placeholder text |
| `separator` | `string` | `' ~ '` | Separator between dates |
| `disabled` | `boolean` | `false` | Disable the picker |
| `clearable` | `boolean` | `true` | Show clear button |
| `showPresets` | `boolean` | `true` | Show preset buttons |
| `presets` | `object` | Default presets | Custom preset ranges |
| `minDate` | `Date` | - | Minimum selectable date |
| `maxDate` | `Date` | - | Maximum selectable date |
| `className` | `string` | - | Container class name |
| `inputClassName` | `string` | - | Input class name |
| `popupClassName` | `string` | - | Popup class name |

## Custom Presets

```jsx
<DateRangePicker
  presets={{
    today: {
      label: 'Today',
      start: new Date(),
      end: new Date()
    },
    thisWeek: {
      label: 'This Week',
      start: getWeekStart(),
      end: new Date()
    },
    thisMonth: {
      label: 'This Month',
      start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      end: new Date()
    }
  }}
/>
```

## Styling

The component uses CSS custom properties for easy theming:

```css
:root {
  --dp-primary-color: #3b82f6;
  --dp-primary-dark: #2563eb;
  --dp-primary-light: #dbeafe;
  --dp-text-color: #1f2937;
  --dp-text-muted: #9ca3af;
  --dp-border-color: #e5e7eb;
  --dp-bg-color: #ffffff;
  --dp-hover-color: #f3f4f6;
  --dp-range-color: #eff6ff;
}
```

## Build

```bash
npm run build
```

## License

MIT
