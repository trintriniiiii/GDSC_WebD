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
const bestStreakDisplay = document.getElementById('best-streak-display');
const habitAboutInput = document.getElementById('habitAbout');
let habits = JSON.parse(localStorage.getItem('habits')) || [];
let habitStreak = JSON.parse(localStorage.getItem('habitStreak')) || 0;
let startDate = localStorage.getItem('startDate') || '';
let lastResetDate = localStorage.getItem('resetDate') || new Date().toDateString();
let editMode = false;
let bestStreak = JSON.parse(localStorage.getItem('bestStreak')) || 0;
let activeFilter = 'all'; 
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

function initializeApp() {
  checkDailyReset();
  renderHabits();
  toggleNoHabitsIllustration();
  updateLocalStorage();
}

addHabitBtn.addEventListener('click', () => {
  habitModal.style.display = 'flex';
  bodyWrapper.classList.add('modal-active');
});

closeModalBtn.addEventListener('click', closeModal);

saveHabitBtn.addEventListener('click', () => {
  const habitName = habitNameInput.value.trim();
  const habitType = habitTypeSelect.value;
  const habitAbout = habitAboutInput.value.trim(); 

  if (habitName && habitType) {
    const newHabit = {
      name: habitName,
      type: habitType,
      completed: false,
      about: habitAbout 
    };
    habits.push(newHabit);
    updateLocalStorage();
    renderHabits();
    toggleNoHabitsIllustration();

    habitNameInput.value = '';
    habitAboutInput.value = '';
    closeModal();
  } else {
    alert('Please fill in all fields!');
  }
});

function renderHabits() {
  habitList.innerHTML = '';
  habits.forEach((habit, index) => {

    if (activeFilter !== 'all' && habit.type !== activeFilter) {
      return; 
    }

    const li = document.createElement('li');
    li.classList.add(habit.type, 'habit-item');
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
  const bestStreakElement = document.getElementById('best-streak-number');
  bestStreakElement.textContent = bestStreak;
  const streakOverlay = document.getElementById('streak-number-overlay');

  streakOverlay.textContent = habitStreak;
}

document.querySelectorAll('.Filter').forEach(button => {
  button.addEventListener('click', function() {
    if(this.getAttribute('data-type')) {
    activeFilter = this.getAttribute('data-type');
    renderHabits();
    }
  });
});

function animateStreakUpdate() {
  const fireImg = document.getElementById('fire-img');
  const streakOverlay = document.getElementById('streak-number-overlay');

  streakOverlay.textContent = habitStreak;

  fireImg.classList.remove('fire-animate');
  void fireImg.offsetWidth; 
  fireImg.classList.add('fire-animate');

}

function showConfetti() {

  let confettiContainer = document.getElementById('confetti-container');
  if (!confettiContainer) {
    confettiContainer = document.createElement('div');
    confettiContainer.id = 'confetti-container';
    document.getElementById('streak-container').appendChild(confettiContainer);
  }

  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.backgroundColor = randomColor();
    confettiContainer.appendChild(confetti);
  }

  setTimeout(() => {
    if (confettiContainer) {
      confettiContainer.remove();
    }
  }, 3000);
}

function randomColor() {
  const colors = ['#FFC107', '#FF5722', '#4CAF50', '#2196F3', '#9C27B0'];
  return colors[Math.floor(Math.random() * colors.length)];
}

function animateBestStreakUpdate() {
  const bestStreakElement = document.getElementById('best-streak-number');
  bestStreakElement.textContent = bestStreak;

  const bestStreakDisplay = document.getElementById('best-streak-display');

  bestStreakDisplay.classList.remove('best-streak-animate');

  void bestStreakDisplay.offsetWidth;
  bestStreakDisplay.classList.add('best-streak-animate');

  showConfetti();
}

function updateMotivationIllustration() {
  const illustration = document.getElementById('motivation-illustration');
  if (habitStreak === 0) {
    illustration.style.display = 'block';
  } else {
    illustration.style.display = 'none';
  }
}

function toggleHabitCompletion(e) {
  const index = e.target.dataset.index;
  habits[index].completed = e.target.checked;
  updateLocalStorage();
  renderHabits();
  checkDailyReset();
}

function toggleAboutSection(li, habit) {

  const wrapper = li.querySelector('.habit-item-wrapper');
  let aboutDiv = wrapper.querySelector('.habit-about');
  if (aboutDiv) {

    aboutDiv.remove();
  } else {

    aboutDiv = document.createElement('div');
    aboutDiv.classList.add('habit-about');
    aboutDiv.classList.add(`${habit.type}-about`);
    aboutDiv.textContent = habit.about ? habit.about : "No additional info provided.";

    wrapper.appendChild(aboutDiv);
  }
}

function updateLocalStorage() {
  localStorage.setItem('habits', JSON.stringify(habits));
  localStorage.setItem('habitStreak', JSON.stringify(habitStreak));
  localStorage.setItem('startDate', startDate);
  localStorage.setItem('resetDate', lastResetDate);
  localStorage.setItem('bestStreak', bestStreak);
}

function getDifferenceInDays(date1, date2) {
  const oneDay = 24 * 60 * 60 * 1000; 
  const firstDate = new Date(date1);
  const secondDate = new Date(date2);
  return Math.round(Math.abs((firstDate - secondDate) / oneDay));
}

function checkDailyReset() {
  const today = new Date().toDateString();
  if (today !== lastResetDate) {
    const allCompleted = habits.length > 0 && habits.every(habit => habit.completed);
    console.log(getDifferenceInDays(today, lastResetDate));
    if (allCompleted && getDifferenceInDays(today, lastResetDate) === 1) {
      if (!startDate) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        startDate = yesterday.toDateString(); 
      }
      habitStreak++;
      if (habitStreak > bestStreak){
        bestStreak = habitStreak;
        animateBestStreakUpdate();
      }

      animateStreakUpdate();
    } else {
      habitStreak = 0;
      startDate = '';
      animateStreakUpdate(); 
    }
    habits = habits.map(habit => ({ ...habit, completed: false }));
    lastResetDate = today;

    updateLocalStorage();
    renderHabits();
    updateMotivationIllustration();
  }
}

function closeModal() {
  habitModal.style.display = 'none';
  bodyWrapper.classList.remove('modal-active');
}

function toggleNoHabitsIllustration() {
  noHabitsIllustration.style.display = habits.length === 0 ? 'block' : 'none';
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

const testDelay = 5000; 

function scheduleEndOfDayNotification() {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(23, 0, 0, 0); 

  const timeUntilNotification = midnight - now;

  if (timeUntilNotification > 0) {
    setTimeout(showInPageNotification, testDelay);
  }
}
function showInPageNotification() {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("Reminder", {
      body: "The day is ending soon! Complete your habits.",
      icon: "/content/streak.png"  
    });

  }
}

function showCompletionNotification() {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("Great Job!", {
      body: "You've completed your habits for today!",
      icon: "streak.png",
    });
  }
}

initializeApp();
requestNotificationPermission();
scheduleEndOfDayNotification();