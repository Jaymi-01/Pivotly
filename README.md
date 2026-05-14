# Pivotly Engine - High-Performance Real-Time Analytics Dashboard

Pivotly is a production-grade real-time visualization platform designed for high-throughput data streaming and interactive analytics. It simulates a modern monitoring system suitable for DevOps, cybersecurity, or financial trading terminals.

## 🚀 Key Features

- **Real-Time Data Streaming**: Simulated multi-domain data feed (Financial, IoT, Compute, Security) updating every 500ms.
- **Advanced Visualizations**:
  - **Financial**: Market volatility tracking with BTC/USD line charts.
  - **IoT**: Environmental telemetry using smooth area charts.
  - **Compute**: Resource history with historical bar charts.
  - **Security**: Threat vector analysis using radar charts.
  - **Sparklines**: Instant trend visualization in metric cards.
- **Interactive Controls**:
  - **Time Range Filtering**: Switch between 1m, 5m, 1h, or all-time data views.
  - **Live Stream Control**: Pause/Resume incoming data.
  - **Data Clearing**: Reset dashboard state instantly.
- **High-Performance Architecture**: Optimized for smooth updates without flickering or memory leaks.

## 🛠 Tech Stack

- **Frontend**: Vue 3 (Composition API) + TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Pinia
- **Charts**: Apache ECharts (via `vue-echarts`)
- **Icons**: Phosphor Icons
- **Date Handling**: date-fns

## 🏗 Architecture & Decisions

### Data Streaming Approach
The system uses a centralized `DataGenerator` service that simulates real-time metrics and events. It leverages a callback-based pattern to push updates to the global store, mimicking a WebSocket or SSE implementation.

### State Management Strategy
**Pinia** is used as the central nervous system.
- **Shallow Reactive State**: Metrics and events use `shallowRef` to prevent unnecessary deep reactivity overhead on large datasets.
- **Dynamic Filtering**: A computed `filteredMetrics` property handles time-range slicing, ensuring charts only render the necessary data points.

### Rendering Optimization Decisions
1. **Animation Disabling**: For high-frequency updates (500ms), ECharts animations are disabled to reduce CPU load and prevent "visual lag".
2. **Data Slicing**: Bar charts and sparklines use limited data windows (last 20 points) to maintain visual clarity and performance.
3. **Memoized Computed Props**: Chart options are computed only when the underlying filtered data changes.
4. **Viewport Management**: The layout uses `min-h-screen` with a sticky header and activity feed to ensure the dashboard remains usable across all screen sizes while allowing for scrollable content when charts are expanded.

### Trade-offs Made
- **Mocked Data vs. WebSockets**: Given the project scope, a robust mock generator was chosen over a live WebSocket to ensure a consistent and testable environment without external dependencies.
- **ECharts vs. D3.js**: ECharts was selected for its superior performance with large datasets and out-of-the-box responsiveness compared to the manual overhead of D3.
- **Single Page Layout**: A unified dashboard layout was preferred over multiple tabs to provide an "at-a-glance" operational view, consistent with modern NOC (Network Operations Center) standards.

## 📦 Setup Instructions

1. **Install Dependencies**:
   ```bash
   pnpm install
   ```
2. **Run Development Server**:
   ```bash
   pnpm dev
   ```
3. **Build for Production**:
   ```bash
   pnpm build
   ```

---
*Built for performance. Visualizing the future.*
