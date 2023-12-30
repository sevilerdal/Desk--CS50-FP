# Desk

Your desk in your browser. Track your work or manage tasks easily with Desk, a productivity application that brings together essential features for a focused work environment.

### Demo

Watch a video demo of Desk in action on YouTube [here](https://youtu.be/xUGulZZsu28). 🚀

### 🔑 Key Features

- **Pomodoro Timer**: Stay focused during work sessions with adjustable timers.
- **Task Management**: Organize and track your tasks efficiently.
- **Time Tracking and Reporting**: Monitor your productivity and generate reports.
- **Sound Effects**: Gentle reminders to help manage your time effectively.

### 🖥️ Technologies Used

- Python
- JavaScript
- Flask
- AJAX
- SQL (SQLite)
- HTML
- CSS
### Pomodoro Timer ⌛

The Pomodoro Timer is designed to enhance productivity by breaking work into intervals, traditionally 25 minutes long, separated by short breaks. It allows you to choose between analog or digital clocks to keep track of your sessions. Completed sessions are saved and prominently displayed on the screen, providing a visual reminder of your progress. When a work session concludes, you have the flexibility to start another session or take a break. The application alerts you with distinct sounds at the beginning and end of sessions, as well as during the last 10 seconds, ensuring you're aware of your time allocation.

### Stopwatch ⏰

The Stopwatch feature simplifies time tracking by enabling you to record your work duration and associated activities effortlessly. Edit or delete entries seamlessly to manage your time log effectively. Whether for project billing, task analysis, or personal time management, the Stopwatch helps keep a detailed record of your activities.

### To-Do List 📋

The To-Do List functionality streamlines task management. With a single click, you can add tasks to your list. Easily mark tasks as completed or delete them as needed. This straightforward interface allows for quick task entry and efficient task management, keeping your focus on completing your goals.

### About the Application

Desk is a productivity tool designed to enhance your work experience by providing a virtual desk space in your browser. It's equipped with the Pomodoro Timer to aid in focused work sessions, task management capabilities, time tracking for better productivity analysis, and subtle sound effects to keep you mindful of time.

### app.py 💻
This is the main application. Handles every template and requests coming from them. Links database to user interface, manages database. It contains all CRUD methods project uses to handle data.

### appdata.db 📡
Database used by all of the application. Contains three tables:
- pomodoro : Keeps date,time information of completed sessions.
- timer : Keeps date, time, duration and task of recorded sessions. Task is not mandatory.
- todo : Keeps todo tasks.

#### ✨ index.html & styles.css
A homepage welcoming user, presents key features. There is even a lamp!

#### ✨ pomodoro.html & pomodorostyles.css, buttonstyles.css
Arranges items for pomodoro clocks. Draws analog and digital clock. I kept button styles separate to keep file readable.

#### ✨ pomodoroData.html & swchData.html
Contains table of completed sessions. I chose to keep them separate to keep document readable.

#### 🕰️ pomodoro.js
This is where the magic happens! Clocks start functioning and sending requests to app.py, processing information. Contains mechanics and animations for clocks, requests to keep information mobile between app.py and front end.

#### ✨ stopwatch.html & stopwatchstyles.css
Front garden of stopwatch. User interface and animations.

#### 💾 stopwatch.js
Again, whole logic of timer lays here. Start-pause-stop, send new entry request, or edit-delete methods.

#### ✨ todo.html & todostyles.css
Todo page is quite simple, so the design is. I tried to keep it minimal to focus only on task management.

#### 📚 todo.js
Sends requests to process new entries, changes or deletes.

#### 🎶 audios & about.txt
This sound effects are there to enhance user experience. Keeps user updated with sound. About text contains license information about audios.


Feel free to contribute or provide feedback to make Desk even better! 🌸
