# WhatsApp Chat Insights

Securely visualize and analyze your WhatsApp chat history directly in your browser.

## 🧩 Visual Components & Graphs available

### Charts (Chart.js)
- **Vertical Bar Chart**: Used for "Messages Sent", "Average Length", "Total Words".
- **Horizontal Bar Chart**: Used for "Social Dynamics" (Most Participative, Link Sharer, etc.).
- **Line Chart**: Used for "Activity Over Time" and "Seasonality".
- **Doughnut Chart**: Used for "Most Used Emojis".
- **Pie Chart**: Used for "Weekend vs Weekdays".

### Special Widgets
- **KPI Grid**: Displays key metrics (Total Messages, Active Days, Participants) with big counters.
- **Historic Streak Card**: A specialized trophy card detailing the longest continuous message streak with timestamps and referencing messages.

## 🚀 Features

### 📊 Primary KPIs
- **Total Messages**: A counter of all messages within the selected range.
- **Active Days**: Number of days with recorded activity.
- **Participants**: Total number of people involved in the conversation.

### 📈 Temporal Analysis
- **Activity Over Time**: Line chart showing activity grouped by quarters.
- **Activity by Hour of Day**: Hourly distribution of messages.
- **Activity by Day of Week**: Weekly distribution (Monday to Sunday).
- **Weekend vs. Weekdays**: Comparison shown in a circular chart.
- **Seasonality (Monthly)**: Monthly activity trends.

### 📝 Content Analysis
- **Media Sent**: Count of multimedia files per person.
- **Average Length**: Average number of characters per message.
- **Total Words**: Total word count per participant.
- **Most Used Emojis**: Top 5 emojis visualized in a doughnut chart.

### 🎯 Social Dynamics & Fun Facts
- **🏆 Historic Streak**: Record for the most consecutive messages by a single person, including:
  - Author's name.
  - Number of consecutive messages.
  - Start and end date/time.
  - The first and last messages of the streak.
- **Most Participative**: Ranking of messages per person.
- **Conversation Starters**: Who initiates conversations (>6h gap).
- **Laughter Meter**: Counter for laughs (jaja, haha, lol, etc.).
- **The Link Sharer**: Who shares the most links.
- **The Questioner**: Who asks the most questions.

### 🔧 Filters
- **Multi-participant Selector**: Filter by one or multiple people.
- **Date Range**: Select specific start and end dates.

## 🛠️ Technologies

- **React 19** + **Vite 7**
- **Chart.js** with `react-chartjs-2`
- **JSZip** for `.zip` file handling
- **Lucide React** for iconography
- **React Hot Toast** for notifications
- **React Dropzone** for file uploads

## 📁 Project Structure

```
src/
├── App.jsx                    # Main entry component
├── App.css                    # Global styles
├── index.css                  # Base CSS reset
├── main.jsx                   # React entry point
├── components/
│   ├── Dashboard.jsx          # Main dashboard stats logic
│   ├── FileUploader.jsx       # File upload with export guide
│   ├── WhatsAppLogo.jsx       # WhatsApp SVG logo
│   ├── common/
│   │   ├── FadeInSection.jsx  # Intersection Observer fade-in animation
│   │   ├── MultiSelect.jsx    # Multi-participant filter component
│   │   └── PerformanceMonitor.jsx  # FPS/RAM monitor (Dev only)
│   └── dashboard/
│       ├── KPIGrid.jsx        # Main KPI cards
│       ├── TemporalAnalysis.jsx    # Temporal charts
│       ├── ContentAnalysis.jsx     # Content-based charts
│       ├── SocialAnalysis.jsx      # Social dynamics section
│       └── HistoricStreak.jsx      # Decorated Historic Streak card
└── utils/
    └── parser.js              # WhatsApp chat export parser
```

## 🚀 Installation & Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Production build
npm run build

# Run Linting
npm run lint
```

## 📱 How to Export Your Chat

1. Open your chat in WhatsApp and tap the name or menu.
2. Select **More** > **Export Chat**.
3. Choose **"Without Media"**.
4. Save it as a `.txt` or `.zip` file on your device.

## 🔒 Privacy

All data is processed **locally in your browser**. No chat data ever leaves your device.

## 🐛 Development Mode

In development mode (`npm run dev`), a **Performance Monitor** is displayed in the bottom-left corner showing:
- Real-time FPS
- Memory usage (Chrome only)
- DOM element count

This monitor is **not included in the production build**.

## 📄 License

MIT
