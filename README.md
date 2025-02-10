# GDSC_WebD
# Habit Tracker

Habit Tracker is a responsive, frontend-only web application that helps you build and maintain your habits. Track your daily progress with an animated streak system, filter your habits by type, and receive notifications to remind you to complete your tasks.

## Live Demo

[https://trintriniiiii.github.io/GDSC_WebD/](https://trintriniiiii.github.io/GDSC_WebD/)

## Features

- **Add & Manage Habits:**  
  Create new habits with a name, type, and extra details. Mark habits as complete and remove them in edit mode.
- **Daily Streak Tracking:**  
  Keep track of your streak with a dynamic fire icon that pulses on updates. A best streak is shown in the top-right with a trophy icon and confetti celebration when a new record is achieved. A progress bar indicates your progress relative to your best streak.
- **Filtering:**  
  Filter your habits by category (health, productive, leisure, or social).
- **Notifications:**  
  The app uses the Notification API to send reminders.  
  **Note:** Notifications work only while the site is open.

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge, etc.) that supports the Notification API.
- A local web server (recommended) for full functionality:
  - Use the [Live Server extension for VS Code](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer), or
  - Install a simple Node.js server like `http-server`:
  
    ```
    npm install -g http-server
    ```

### Running Locally

1. **Clone the Repository:**

    ```
    git clone https://github.com/trintriniiiii/GDSC_WebD.git
    cd GDSC_WebD
    ```

2. **Serve the Files:**

    **Option A: Using a Local Web Server (Recommended)**
    
    ```
    http-server
    ```
    
    Then open your browser and navigate to the provided URL (typically [http://localhost:8080](http://localhost:8080)).

    **Option B: Opening Directly**
    
    Open `index.html` in your browser.  
    *Note:* Some features (like notifications) may not work as expected when opening files directly due to browser security policies.

## Usage

- **Add Habits:**  
  Click the **+** button to open the "Add Habit" modal. Enter a habit name, select a type, and add additional details if needed. Click **Save Habit** to add it.
- **Mark as Complete:**  
  Check the box next to each habit to mark it complete.
- **Edit & Delete:**  
  Toggle edit mode (using the pencil button) to reveal delete options.
- **Filtering:**  
  Use the filter buttons at the top (All, Health, Productive, Leisure, Social) to display habits of a specific category.
- **Streak Display:**  
  Your current streak is shown with a fire icon that pulses when updated. A progress bar shows progress relative to your best streak, which is displayed in the top-right with a trophy icon. New best streaks trigger a confetti celebration.
- **Notifications:**  
  At the scheduled time, the app sends a notification (with a custom icon) reminding you to complete your habits. Clicking the notification opens the app.  
  **Note:** Notifications are generated from the frontend and work only while the site is open.

## Deployment with GitHub Pages

This project is deployed using GitHub Pages. To update the live site:

1. **Push Your Changes to GitHub:**

    ```
    git add .
    git commit -m "Update Habit Tracker app"
    git push origin main
    ```

2. **Enable GitHub Pages:**

    - Navigate to your repository on GitHub.
    - Go to **Settings** → **Pages**.
    - Under **Source**, select the `main` branch and `/ (root)` folder.
    - Click **Save**.
    - Your site will be available at [https://trintriniiiii.github.io/GDSC_WebD/](https://trintriniiiii.github.io/GDSC_WebD/).

## Contributing

Contributions are welcome! Feel free to fork the repository and submit pull requests for improvements, bug fixes, or new features.

