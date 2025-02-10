// Get references to the DOM elements
const addHabitBtn = document.getElementById('addHabitBtn');
const habitModal = document.getElementById('habitModal');
const saveHabitBtn = document.getElementById('saveHabitBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const habitNameInput = document.getElementById('habitName');
const habitTypeSelect = document.getElementById('habitType');
const habitList = document.getElementById('habitList');
const bodyWrapper = document.querySelector('.body-wrapper');
const noHabitsIllustration = document.querySelector('.no-habits-illustration');
const streakDisplay = document.getElementById('streak-display');
const summaryDisplay = document.getElementById('summary-display');
const bestStreakDisplay = document.getElementById('best-streak-display');
const habitAboutInput = document.getElementById('habitAbout');
let habits = JSON.parse(localStorage.getItem('habits')) || [];
let habitStreak = JSON.parse(localStorage.getItem('habitStreak')) || 0;
let startDate = localStorage.getItem('startDate') || '';
let lastResetDate = localStorage.getItem('resetDate') || new Date().toDateString();
let editMode = false;
let bestStreak = JSON.parse(localStorage.getItem('bestStreak')) || 0;

function toggleEditMode() {
  editMode = !editMode;
  habitList.classList.toggle('edit-mode', editMode);
  renderHabits();
}

const taskIcons = {
  health: '<i class="fa-solid fa-dumbbell"></i>',
  productive: '<i class="fa-solid fa-chart-line"></i>',
  leisure: '<i class="fa-solid fa-gamepad"></i>',
  social: '<i class="fa-solid fa-comments"></i>',
};

initializeApp();

// Function to initialize the app
function initializeApp() {
  checkDailyReset();
  renderHabits();
  toggleNoHabitsIllustration();
  updateLocalStorage();
}

// Open modal
addHabitBtn.addEventListener('click', () => {
  habitModal.style.display = 'flex';
  bodyWrapper.classList.add('modal-active');
});

// Close modal
closeModalBtn.addEventListener('click', closeModal);

// Save habit
saveHabitBtn.addEventListener('click', () => {
  const habitName = habitNameInput.value.trim();
  const habitType = habitTypeSelect.value;
  const habitAbout = habitAboutInput.value.trim(); // get the about info

  if (habitName && habitType) {
    const newHabit = {
      name: habitName,
      type: habitType,
      completed: false,
      about: habitAbout // store the about info
    };
    habits.push(newHabit);
    updateLocalStorage();
    renderHabits();
    toggleNoHabitsIllustration();
    // Clear fields after saving
    habitNameInput.value = '';
    habitAboutInput.value = '';
    closeModal();
  } else {
    alert('Please fill in all fields!');
  }
});

// Render habits list
function renderHabits() {
  habitList.innerHTML = '';
  habits.forEach((habit, index) => {
    const li = document.createElement('li');
    li.classList.add(habit.type);
    li.classList.add('habit-item');
    if (habit.completed) li.classList.add('completed');
    li.innerHTML = `
     <div class="habit-item-wrapper">
    <span class="habit-icon">${taskIcons[habit.type] || ''}</span>
    <label class="habit-label"> 
       
      <input type="checkbox" class="habit-checkbox" data-index="${index}" ${habit.completed ? 'checked' : ''}>
      <div class="habit-content">
        <span>${habit.name}</span>
      </div>
    </label>
    <button class="eye-btn" data-index="${index}" title="View Details">
      <i class="fa-solid fa-eye"></i>
    </button>
    </div>
  `;

  // Attach event listener to the eye button to toggle about section
  const eyeBtn = li.querySelector('.eye-btn');
  eyeBtn.addEventListener('click', () => toggleAboutSection(li, habit));
    if (editMode) {
      const deleteBtn = document.createElement('button');
      deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
      deleteBtn.classList.add('delete-btn');
      deleteBtn.addEventListener('click', () => deleteHabit(index));
      li.appendChild(deleteBtn);
    }
    habitList.appendChild(li);
  });
  
  document.querySelectorAll('.habit-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', toggleHabitCompletion);
  });

  streakDisplay.textContent = `Streak: ${habitStreak} days`;
  summaryDisplay.textContent = startDate ? `Start Date: ${startDate}`: '';
  bestStreakDisplay.textContent = `Best Streak: ${bestStreak} days`;
}


// Toggle habit completion
function toggleHabitCompletion(e) {
  const index = e.target.dataset.index;
  habits[index].completed = e.target.checked;
  updateLocalStorage();
  renderHabits();
  checkDailyReset();
}

function toggleAboutSection(li, habit) {
  // Look for an existing about section inside the li's wrapper.
  const wrapper = li.querySelector('.habit-item-wrapper');
  let aboutDiv = wrapper.querySelector('.habit-about');
  if (aboutDiv) {
    // Remove it if it's there.
    aboutDiv.remove();
  } else {
    // Create the about div as a block-level element.
    aboutDiv = document.createElement('div');
    aboutDiv.classList.add('habit-about');
    aboutDiv.textContent = habit.about ? habit.about : "No additional info provided.";
    // Append it so it's part of the document flow.
    wrapper.appendChild(aboutDiv);
  }
}

// Save to local storage
function updateLocalStorage() {
  localStorage.setItem('habits', JSON.stringify(habits));
  localStorage.setItem('habitStreak', JSON.stringify(habitStreak));
  localStorage.setItem('startDate', startDate);
  localStorage.setItem('resetDate', lastResetDate);
  localStorage.setItem('bestStreak', bestStreak);
}
// Function to calculate the difference in days between two dates
function getDifferenceInDays(date1, date2) {
  const oneDay = 24 * 60 * 60 * 1000; // Milliseconds in one day
  const firstDate = new Date(date1);
  const secondDate = new Date(date2);
  return Math.round(Math.abs((firstDate - secondDate) / oneDay));
}
// Daily reset check
function checkDailyReset() {
  const today = new Date().toDateString();

  if (today !== lastResetDate) {
    const allCompleted = habits.length > 0 && habits.every(habit => habit.completed);
    console.log(getDifferenceInDays(today, lastResetDate));
    if (allCompleted && getDifferenceInDays(today, lastResetDate) === 1) {
      if (!startDate) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        startDate = yesterday.toDateString(); // Set start date to one day before today
      }
      if (habitStreak > bestStreak) bestStreak = habitStreak;// Update best streak
      habitStreak++;
    } else {
      habitStreak = 0;
      startDate = '';
    }

    habits = habits.map(habit => ({ ...habit, completed: false }));
    lastResetDate = today;

    updateLocalStorage();
    renderHabits();
  }
}

// Close the modal and remove blur
function closeModal() {
  habitModal.style.display = 'none';
  bodyWrapper.classList.remove('modal-active');
}

// Show or hide the no habits illustration
function toggleNoHabitsIllustration() {
  noHabitsIllustration.style.display = habitList.children.length === 0 ? 'block' : 'none';
}

function deleteHabit(index) {
  const li = habitList.children[index];
  li.classList.add('fall-off');
  setTimeout(() => {
    habits.splice(index, 1);
    updateLocalStorage();
    renderHabits();
    toggleNoHabitsIllustration();
  }, 500);
}

document.getElementById('edit').addEventListener('click', toggleEditMode);
// Request notification permission
function requestNotificationPermission() {
  if ("Notification" in window) {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        console.log("Notifications enabled!");
      } else {
        alert("Please enable notifications for better reminders!");
      }
    });
  }
}

// Register Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js")
    .then(swReg => console.log("Service Worker Registered:", swReg))
    .catch(err => console.error("Service Worker Error:", err));
}
const testDelay = 5000; // 5 seconds
// Schedule notification for end of the day
function scheduleEndOfDayNotification() {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(23, 0, 0, 0); // 11:00 PM

  const timeUntilNotification = midnight - now;

  if (timeUntilNotification > 0) {
    setTimeout(() => {
      navigator.serviceWorker.ready.then(swReg => {
        swReg.showNotification("Reminder", {
          body: "The day is ending soon! Complete your habits.",
          icon: "content/icon.png",
        });
      });
    }, testDelay);
  }
}

// Show notification when a streak is maintained
function showCompletionNotification() {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("Great Job!", {
      body: "You've completed your habits for today!",
      icon: "icon.png",
    });
  }
}

// Call functions on app load
initializeApp();
requestNotificationPermission();
scheduleEndOfDayNotification();
