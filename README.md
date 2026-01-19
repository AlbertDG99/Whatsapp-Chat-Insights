# WhatsApp Chat Insights

Securely visualize and analyze your WhatsApp chat history directly in your browser. Experience a premium, high-performance dashboard with deep insights into your digital conversations.

## 🧩 Visual Components & Graphs available

### Charts (Chart.js)
- **Line Chart**: Used for "Activity Over Time" (Quarterly) and "Seasonality".
- **Bar Chart**: Used for Hourly and Weekly activity distributions.
- **Pie & Doughnut Charts**: Used for "Weekend vs Weekdays" and "Most Used Emojis".

### Premium Dashboard Widgets
- **Unified Card System**: All analysis modules are presented in standardized 430x430px cards for a clean, grid-based layout.
- **2x3 Stat Groups**: Smaller metrics are intelligently grouped in 2-column, 3-row grids that fill first vertically.
- **Historic Streak Card**: A specialized trophy card detailing the longest continuous message streak.
- **Single User View**: Deep dive into individual participant stats with a dedicated, interleaved layout of charts and KPIs.

## 🚀 Features

### 👤 Single User Deep Dive (New)
- Dedicated analysis view when a single participant is selected.
- Interleaved layout of charts and groups of 6 stats.
- Comparative analysis against the group's timeline.

### 📊 Primary KPIs
- **Total Messages**: Global and per-user message counters.
- **Active Days**: Real calendar days with activity (Set-based precision).
- **Participants**: Total number of unique authors.

### 📈 Temporal Analysis
- **Activity Over Time**: Global trends grouped by quarters.
- **Hourly & Weekly distribution**: Heatmaps of when you talk the most.
- **Seasonality**: Monthly patterns to see your chat pulse throughout the year.

### 🎯 Social Dynamics & Fun Facts
- **🏆 Historic Streak**: Who took over the chat with the most consecutive messages.
- **Conversation Starters**: Who breaks the silence after a >4h gap.
- **Laughter Meter**: Specialized regex for detecting laughter (haha, lol, xd).
- **The Link Sharer & Questioner**: Dedicated counters for links and questions.

### 🔧 Filters & UI
- **Smart Participant Selector**: Search and filter by one or multiple authors with "Select All/Clear" actions.
- **Responsive Design**: Premium mobile experience with adapted grids and container-query based font scaling.
- **Date Range**: Precise temporal filtering.

## 🛠️ Technologies

- **React 19** + **Vite 6**
- **Chart.js 4** + **react-chartjs-2**
- **Lucide React**: Modern iconography.
- **CSS3 Modern Features**: Container Queries for fluid text, Flexbox/Grid, and Backdrop Filters.
- **JSZip**: Ultra-fast `.zip` file processing.

## 📁 Project Structure

```
src/
├── App.jsx                    # Main entry & Landing Page logic
├── index.css                  # Unified design system & global styles
├── components/
│   ├── Dashboard.jsx          # Dashboard layout & routing logic
│   ├── FileUploader.jsx       # Landing page uploader & export guide
│   ├── common/
│   │   ├── FadeInSection.jsx  # Intersection-based scroll animations
│   │   └── MultiSelect.jsx    # Advanced participant filter
│   └── dashboard/
│       ├── KPIGrid.jsx        # Global KPI overview
│       ├── SingleUserStats.jsx # Specialized single-person dashboard
│       ├── TemporalAnalysis.jsx # Time-based charts
│       ├── ContentAnalysis.jsx  # Content/Emoji analysis
│       ├── SocialAnalysis.jsx   # Dynamics & Streak widgets
│       ├── HistoricStreak.jsx   # The "Streak Trophy" component
│       └── MiniStatCard.jsx     # Reusable adaptive KPI card
└── utils/
    ├── parser.js              # Advanced WhatsApp regex parser
    └── statsCalculator.js     # Heavy-lifting stats computation
```

## 🚀 Installation & Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Production build
npm run build
```

## 📱 How to Export Your Chat

1. Open your chat in WhatsApp and tap the name or menu.
2. Select **More** > **Export Chat**.
3. Choose **"Without Media"**.
4. Save it as a `.txt` or `.zip` file on your device.

## 🔒 Privacy

All data is processed **locally in your browser**. No chat data ever leaves your device. We don't use servers for analysis; your privacy is guaranteed by design.

## 📄 License

MIT
