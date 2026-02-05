import React, { useState } from 'react';
import DateRangePicker from './components/DateRangePicker';
import './App.css';

function App() {
  const [dateRange, setDateRange] = useState([null, null]);
  const [dateRange2, setDateRange2] = useState([new Date(2026, 0, 5), new Date(2026, 1, 5)]);

  const handleChange = (range) => {
    setDateRange(range);
    console.log('Selected range:', range);
  };

  const formatDateDisplay = (date) => {
    if (!date) return 'Not selected';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>React Date Range Picker</h1>
        <p>A flexible date range picker component for React, inspired by vue2-datepicker</p>
      </header>

      <main className="app-content">
        {/* Basic Example */}
        <section className="demo-section">
          <h2>Basic Usage</h2>
          <p>Click the input to open the date picker. Select a start date, then an end date.</p>
          
          <div className="demo-row">
            <DateRangePicker
              value={dateRange}
              onChange={handleChange}
            />
          </div>
          
          <div className="demo-result">
            <strong>Selected Range:</strong>{' '}
            {formatDateDisplay(dateRange[0])} — {formatDateDisplay(dateRange[1])}
          </div>
        </section>

        {/* With Initial Value */}
        <section className="demo-section">
          <h2>With Initial Value</h2>
          <p>Pre-populated date range picker.</p>
          
          <div className="demo-row">
            <DateRangePicker
              value={dateRange2}
              onChange={setDateRange2}
            />
          </div>
          
          <div className="demo-result">
            <strong>Selected Range:</strong>{' '}
            {formatDateDisplay(dateRange2[0])} — {formatDateDisplay(dateRange2[1])}
          </div>
        </section>

        {/* Without Presets */}
        <section className="demo-section">
          <h2>Without Presets</h2>
          <p>Date picker without quick selection presets.</p>
          
          <div className="demo-row">
            <DateRangePicker
              value={[null, null]}
              onChange={(range) => console.log('Range:', range)}
              showPresets={false}
            />
          </div>
        </section>

        {/* Custom Presets */}
        <section className="demo-section">
          <h2>Custom Presets</h2>
          <p>Date picker with custom preset options.</p>
          
          <div className="demo-row">
            <DateRangePicker
              value={[null, null]}
              onChange={(range) => console.log('Range:', range)}
              presets={{
                today: {
                  label: 'Today',
                  start: new Date(),
                  end: new Date()
                },
                thisWeek: {
                  label: 'This Week',
                  start: (() => {
                    const d = new Date();
                    d.setDate(d.getDate() - d.getDay());
                    return d;
                  })(),
                  end: new Date()
                },
                thisMonth: {
                  label: 'This Month',
                  start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                  end: new Date()
                }
              }}
            />
          </div>
        </section>

        {/* Disabled State */}
        <section className="demo-section">
          <h2>Disabled State</h2>
          <p>Disabled date picker that cannot be interacted with.</p>
          
          <div className="demo-row">
            <DateRangePicker
              value={[new Date(2026, 0, 1), new Date(2026, 0, 15)]}
              disabled
            />
          </div>
        </section>

        {/* Custom Format */}
        <section className="demo-section">
          <h2>Custom Date Format</h2>
          <p>Date displayed in DD/MM/YYYY format.</p>
          
          <div className="demo-row">
            <DateRangePicker
              value={[null, null]}
              onChange={(range) => console.log('Range:', range)}
              format="DD/MM/YYYY"
              placeholder={['DD/MM/YYYY', 'DD/MM/YYYY']}
            />
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <p>Built with React. Inspired by <a href="https://mengxiong10.github.io/vue2-datepicker/" target="_blank" rel="noopener noreferrer">vue2-datepicker</a>.</p>
      </footer>
    </div>
  );
}

export default App;
