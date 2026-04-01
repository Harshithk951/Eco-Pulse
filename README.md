# 🌿 Eco-Pulse
> **Breathe life into your data.** Experience the world's first AI-driven carbon guide that breathes with you. Precision data meets natural intuition.

![UI Overview](https://img.shields.io/badge/UI-TailwindCSS-06b6d4?style=flat-square&logo=tailwind-css)
![AI Integrations](https://img.shields.io/badge/AI-Gemini_Flash-10b981?style=flat-square&logo=google)

Eco-Pulse is a beautifully designed, front-end web application that helps individuals and communities track, understand, and reduce their carbon footprint. With an emphasis on stunning glassmorphism design, multilingual accessibility, and intelligent insights, Eco-Pulse makes sustainability engaging and actionable.

---

## ✨ Key Features

- **🌐 Intelligent Localization** 
  Built from the ground up for global reach. A custom JavaScript \`lang.js\` translation engine flawlessly toggles the entire application between English and Hindi environments—including mobile navbars, sidebars, and dynamic alerts—with zero page reloads.

- **🤖 Built-in AI Assistant**
  A sleek, floating leaf widget powers a dedicated Eco-Pulse assistant using the **Gemini 1.5 Flash REST API**. It gracefully maintains context, provides personalized reduction tips, handles local API caching via \`localStorage\`, and formats conversational markdown for improved readability.

- **📊 Comprehensive Carbon Calculator**
  A highly interactive quiz interface evaluating mobility, diet, home energy, and lifestyle. The calculator provides immediate real-time percentage feedback and transitions cleanly into an actionable AI-generated "Carbon Score" editorial view.

- **📱 Fluid Responsive Architecture**
  Designed Mobile-First. Dynamic collapsable sidebars cleanly transform into minimalist, pulse-animated bottom navigation bars on smaller devices.

- **🎨 Modern Frontend Stack**
  Built purely with modern, vanilla technologies heavily enhanced by **Tailwind CSS**. Features organic bezier-curve animations, mist overlays, blur-backdrop overlays, and premium Google Fonts (\`Plus Jakarta Sans\`, \`Manrope\`, and \`Material Symbols\`).

---

## 🛠️ Project Structure

\`\`\`text
eco-pulse/
├── Home.html                # Immersive Welcome & Hero CTA page
├── dashboard.html           # Main metric oversight and quick actions
├── carbon-calculator.html   # Multi-step footprint quiz
├── Results.html             # The editorial review of the user's score
├── impact-report.html       # Monthly reduction reporting
├── challenges.html          # Bento-box style community challenges
├── leaderboard.html         # Localized ranking system
├── profile&settings.html    # Profile management and global toggles
├── assets/
│   ├── ai-chat.js           # Reusable Gemini AI Floating Assistant script
│   ├── lang.js              # Central dictionary & i18n logic 
│   └── (images/media)       # Hero textures and structural assets
└── README.md                # Project documentation
\`\`\`

---

## 🚀 Getting Started

Since Eco-Pulse runs on highly-optimized Vanilla JavaScript and HTML, there is no heavy build process or \`npm install\` required.

### 1. Run Locally
To explore the application locally without CORS constraints on the AI requests, fire up a simple HTTP server in your terminal:

\`\`\`bash
# If you have Python installed:
python3 -m http.server 5500
\`\`\`
Then, navigate your browser to \`http://localhost:5500/Home.html\`.

### 2. Enter Gemini API Key
To use the AI Assistant:
1. Click the floating green Leaf icon on the bottom right of any screen.
2. Ensure you have an active Gemini API token.
3. You will be prompted securely by your browser to enter the API Key on the first use.
4. Your key is stored safely within your browser's \`localStorage\`.

> **Note on Security:** Your private API key is never committed to GitHub or exposed in this repository.

---

## 🤝 Contributing
Contributions, issues, and feature requests are always welcome! Let's make the world a slightly greener place, one line of code at a time.

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
