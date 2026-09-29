"use strict";

/*
============================================================
🚀 WORKSPACE FLOW — MAIN APPLICATION ENGINE
============================================================

Hinglish:
Ye file poore application ka brain hai.

Main responsibilities:

1. Task CRUD
2. LocalStorage
3. Deadline countdown
4. Task statistics
5. Pomodoro timer
6. Breathing exercise
7. Mood/environment switching
8. Ambient sound
9. Toast notifications
10. UI state management
11. Data validation
12. Timer cleanup

HTML ke saare IDs yahan intentionally match kiye gaye hain.
============================================================
*/

// ============================================================
// 🎯 DOM SELECTORS
// ============================================================

const appBody = document.querySelector("#app-body");

const workspaceCard = document.querySelector("#workspace-card");

const headerBanner = document.querySelector("#header-banner");

const headerTitle = document.querySelector("#header-title");

const headerSubtitle = document.querySelector("#header-subtitle");

const toast = document.querySelector("#toast");

// ============================================================
// 📝 TASK DOM ELEMENTS
// ============================================================

const todoform = document.querySelector("#todo-form");

const todoinput = document.querySelector("#todo-input");

const todoDeadline = document.querySelector("#todo-deadline");

const todolist = document.querySelector("#todo-list");

const formbtn = document.querySelector("#form-btn");

const cancelbtn = document.querySelector("#cancel-btn");

const taskcoun = document.querySelector("#task-count");

const completecount = document.querySelector("#complete-count");

const emptyState = document.querySelector("#empty-state");

const clearCompletedBtn = document.querySelector("#clear-completed-btn");

const clearAllBtn = document.querySelector("#clear-all-btn");

// ============================================================
// 🔀 VIEW ELEMENTS
// ============================================================

const tasksView = document.querySelector("#tasks-view");

const pomodoroView = document.querySelector("#pomodoro-view");

const switchToPomoBtn = document.querySelector("#switch-to-pomodoro");

const exitPomoBtn = document.querySelector("#exit-pomodoro");

// ============================================================
// ⏱️ POMODORO DOM ELEMENTS
// ============================================================

const pomoTimerDisplay = document.querySelector("#pomo-timer-display");

const pomoStartBtn = document.querySelector("#pomo-start-btn");

const pomoResetBtn = document.querySelector("#pomo-reset-btn");

const pomoStatus = document.querySelector("#pomo-status");

const pomoDurationSelect = document.querySelector("#pomo-duration-select");

const pomoProgressBar = document.querySelector("#pomo-progress-bar");

const pomoProgressText = document.querySelector("#pomo-progress-text");

const sessionCounter = document.querySelector("#session-counter");

const timerCard = document.querySelector("#timer-card");

// ============================================================
// 🌬️ BREATHING DOM ELEMENTS
// ============================================================

const clockWrapper = document.querySelector("#clock-wrapper");

const breathingWrapper = document.querySelector("#breathing-wrapper");

const breathingNode = document.querySelector("#breathing-node");

const breathingActionTxt = document.querySelector("#breathing-action-txt");

const toggleBreathingModeBtn = document.querySelector("#toggle-breathing-mode");

// ============================================================
// 🔊 SOUND
// ============================================================

const soundToggleBtn = document.querySelector("#sound-toggle-btn");

// ============================================================
// 💾 STORAGE KEYS
// ============================================================

const STORAGE_KEYS = {
  todos: "workspace-flow-todos",

  mode: "workspace-flow-mode",

  sound: "workspace-flow-sound",

  session: "workspace-flow-session",
};

// ============================================================
// ⚙️ APPLICATION STATE
// ============================================================

let todos = loadTodos();

let EditTodoID = null;

let pomoInterval = null;

let breathingInterval = null;

let deadlineRefreshInterval = null;

let currentActiveMode = loadStoredMode();

let pomoTimeLeft = 25 * 60;

let pomoInitialTime = 25 * 60;

let isPomoRunning = false;

let isBreathingActiveMode = false;

let soundEnabled = loadSoundPreference();

let sessionNumber = loadSessionNumber();

let audioContext = null;

let ambientNodes = [];

let toastTimer = null;

// ============================================================
// 🎨 MOOD CONFIGURATION
// ============================================================

/*
Hinglish:

Har mood ke andar:

- background image
- card design
- banner gradient
- title
- subtitle
- accent color
- ambient sound character

defined hai.
*/

const moodConfigurations = {
  work: {
    bg: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=85",

    cardClass:
      "w-full max-w-md md:max-w-2xl overflow-hidden rounded-3xl border border-slate-900 bg-slate-950 shadow-2xl transition-all duration-500",

    bannerStyle:
      "background-image: linear-gradient(to right, rgba(49,46,129,.95), rgba(79,70,229,.78)), url('https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=85');",

    title: "Deep Focus Flow",

    sub: "Strategic Working Target Active",

    accent: "text-indigo-400",
  },

  rain: {
    bg: "https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&w=1800&q=85",

    cardClass:
      "w-full max-w-md md:max-w-2xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/95 shadow-2xl transition-all duration-500",

    bannerStyle:
      "background-image: linear-gradient(to right, rgba(30,41,59,.96), rgba(15,23,42,.86)), url('https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&w=1800&q=85');",

    title: "Rainy Cozy Sanctuary",

    sub: "Comfort Study Framework",

    accent: "text-blue-400",
  },

  lofi: {
    bg: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1800&q=85",

    cardClass:
      "w-full max-w-md md:max-w-2xl overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-950 shadow-2xl transition-all duration-500",

    bannerStyle:
      "background-image: linear-gradient(to right, rgba(120,53,15,.95), rgba(67,20,7,.85)), url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1800&q=85');",

    title: "Chill Cafe Lo-Fi",

    sub: "Relaxed Mindset Integration",

    accent: "text-amber-400",
  },

  happy: {
    bg: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1800&q=85",

    cardClass:
      "w-full max-w-md md:max-w-2xl overflow-hidden rounded-3xl border border-amber-900 bg-amber-950 shadow-2xl transition-all duration-500",

    bannerStyle:
      "background-image: linear-gradient(to right, rgba(180,83,9,.92), rgba(5,150,105,.78)), url('https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1800&q=85');",

    title: "High Vibrations Flow",

    sub: "Creative Sprint Space",

    accent: "text-yellow-400",
  },

  zen: {
    bg: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1800&q=85",

    cardClass:
      "w-full max-w-md md:max-w-2xl overflow-hidden rounded-3xl border border-stone-800 bg-stone-950 shadow-2xl transition-all duration-500",

    bannerStyle:
      "background-image: linear-gradient(to right, rgba(6,78,59,.96), rgba(4,120,87,.82)), url('https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1800&q=85');",

    title: "Deep Zen Sanctuary",

    sub: "Tranquil Breathing Alignment",

    accent: "text-emerald-400",
  },
};

// ============================================================
// 💾 SAFE LOCAL STORAGE
// ============================================================

/*
Hinglish:

localStorage mein JSON save/load karte waqt try/catch use
kiya gaya hai taaki storage unavailable hone par application
crash na ho.
*/

function loadTodos() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.todos);

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch (error) {
    console.warn("Todo storage load failed:", error);

    return [];
  }
}

function saveToLocalStorage() {
  try {
    localStorage.setItem(STORAGE_KEYS.todos, JSON.stringify(todos));
  } catch (error) {
    console.warn("Todo storage save failed:", error);

    showToast("Storage save nahi ho paya.", "error");
  }
}

// ============================================================
// 🎨 LOAD MODE
// ============================================================

function loadStoredMode() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.mode);

    return moodConfigurations[stored] ? stored : "work";
  } catch {
    return "work";
  }
}

// ============================================================
// 🔊 LOAD SOUND PREFERENCE
// ============================================================

function loadSoundPreference() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.sound);

    return stored !== "off";
  } catch {
    return true;
  }
}

// ============================================================
// 🔢 LOAD SESSION NUMBER
// ============================================================

function loadSessionNumber() {
  try {
    const stored = Number(localStorage.getItem(STORAGE_KEYS.session));

    return stored > 0 ? stored : 1;
  } catch {
    return 1;
  }
}

// ============================================================
// 💾 SAVE SMALL SETTINGS
// ============================================================

function saveSetting(key, value) {
  try {
    localStorage.setItem(key, String(value));
  } catch (error) {
    console.warn("Setting save failed:", error);
  }
}

// ============================================================
// 🔔 TOAST SYSTEM
// ============================================================

/*
Hinglish:

Normal alert() ke jagah modern toast notification use kiya hai.
*/

function showToast(message, type = "info") {
  if (!toast) return;

  clearTimeout(toastTimer);

  const typeClasses = {
    success: "bg-emerald-600",

    error: "bg-rose-600",

    info: "bg-slate-950",

    warning: "bg-amber-500",
  };

  toast.className = `fixed z-[100] left-1/2 bottom-5 hidden max-w-[calc(100%-2rem)] -translate-x-1/2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-2xl ${typeClasses[type] || typeClasses.info}`;

  toast.textContent = message;

  toast.classList.remove("hidden");

  toast.classList.add("toast-visible");

  toastTimer = setTimeout(() => {
    toast.classList.add("hidden");

    toast.classList.remove("toast-visible");
  }, 3000);
}

// ============================================================
// 🛡️ HTML ESCAPE
// ============================================================

/*
Hinglish:

User agar task ke andar <script> ya HTML likhe,
toh direct HTML render na ho.

Isse task rendering safer hoti hai.
*/

function escapeHTML(value) {
  const div = document.createElement("div");

  div.textContent = String(value);

  return div.innerHTML;
}

// ============================================================
// 📅 DATETIME FORMATTER
// ============================================================

function formatDeadline(deadline) {
  if (!deadline) {
    return "";
  }

  const date = new Date(deadline);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ============================================================
// ⏳ REMAINING TIME CALCULATOR
// ============================================================

/*
Hinglish:

Deadline aur current time ka difference calculate karta hai.

Example:

2d 4h left
3h 20m left
18m left
Deadline Ended
Task Completed
*/

function getRemainingTime(deadlineStr, isCompleted) {
  if (isCompleted) {
    return {
      text: "Task Completed",

      class: "border-emerald-100 bg-emerald-50 text-emerald-600",
    };
  }

  if (!deadlineStr) {
    return {
      text: "No Deadline",

      class: "border-slate-100 bg-slate-50 text-slate-500",
    };
  }

  const deadline = Date.parse(deadlineStr);

  if (Number.isNaN(deadline)) {
    return {
      text: "Invalid Deadline",

      class: "border-rose-100 bg-rose-50 text-rose-600",
    };
  }

  const totalMs = deadline - Date.now();

  if (totalMs <= 0) {
    return {
      text: "Deadline Ended",

      class: "border-rose-100 bg-rose-50 font-bold text-rose-600",
    };
  }

  const totalMinutes = Math.floor(totalMs / 1000 / 60);

  const minutes = totalMinutes % 60;

  const hours = Math.floor(totalMinutes / 60) % 24;

  const days = Math.floor(totalMinutes / (60 * 24));

  if (days > 0) {
    return {
      text: `${days}d ${hours}h left`,

      class: "border-indigo-100 bg-indigo-50 text-indigo-600",
    };
  }

  if (hours > 0) {
    return {
      text: `${hours}h ${minutes}m left`,

      class: "border-amber-100 bg-amber-50 text-amber-600",
    };
  }

  return {
    text: `${Math.max(minutes, 1)}m left`,

    class: "border-rose-100 bg-rose-50 font-semibold text-rose-500",
  };
}

// ============================================================
// 📊 ANALYTICS DASHBOARD
// ============================================================

function updateAnalyticsDashboard() {
  const total = todos.length;

  const completed = todos.filter((todo) => todo.iscompleted).length;

  if (taskcoun) {
    taskcoun.textContent = `TASKS (${total})`;
  }

  if (completecount) {
    completecount.textContent = `COMPLETED : ${completed}`;
  }

  if (emptyState) {
    if (total === 0) {
      emptyState.classList.remove("hidden");
    } else {
      emptyState.classList.add("hidden");
    }
  }
}

// ============================================================
// 📋 RENDER TASK LIST
// ============================================================

/*
Hinglish:

Todos array ko actual HTML cards mein convert karta hai.

Ye function:

- checkbox
- task title
- deadline badge
- edit
- delete

sab generate karta hai.
*/

function rendertodo() {
  if (!todolist) return;

  todolist.innerHTML = "";

  todos.forEach((todo) => {
    const li = document.createElement("li");

    li.dataset.id = todo.id;

    li.className =
      "task-enter rounded-2xl border border-slate-100 bg-white p-3.5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md";

    const badge = getRemainingTime(todo.deadline, todo.iscompleted);

    const dateStr = formatDeadline(todo.deadline);

    const completedClass = todo.iscompleted
      ? "line-through text-slate-400 decoration-slate-300"
      : "text-slate-700";

    li.innerHTML = `

            <div class="flex w-full items-start gap-3">

                <input
                    type="checkbox"
                    data-action="toggle"
                    aria-label="Complete task"
                    ${todo.iscompleted ? "checked" : ""}
                    class="mt-1 h-4 w-4 cursor-pointer accent-indigo-600"
                >


                <div class="min-w-0 flex-1">

                    <p
                        class="
                            break-words
                            text-sm
                            font-bold
                            ${completedClass}
                        "
                    >
                        ${escapeHTML(todo.text)}
                    </p>


                    <div
                        class="
                            mt-2
                            flex
                            flex-wrap
                            items-center
                            gap-2
                        "
                    >

                        <span
                            class="
                                rounded-md
                                border
                                px-2
                                py-1
                                text-[10px]
                                font-black
                                uppercase
                                tracking-wide
                                ${badge.class}
                            "
                        >
                            ${badge.text}
                        </span>


                        ${
                          todo.deadline
                            ? `
                                    <span
                                        class="
                                            text-[10px]
                                            font-semibold
                                            text-slate-400
                                        "
                                    >
                                        Due: ${escapeHTML(dateStr)}
                                    </span>
                                  `
                            : ""
                        }

                    </div>

                </div>


                <div
                    class="
                        flex
                        shrink-0
                        gap-1.5
                    "
                >

                    <button
                        type="button"
                        data-action="edit"
                        class="
                            rounded-lg
                            bg-amber-50
                            px-2.5
                            py-1.5
                            text-[10px]
                            font-black
                            text-amber-600
                            transition-all
                            hover:bg-amber-100
                        "
                    >
                        Edit
                    </button>


                    <button
                        type="button"
                        data-action="delete"
                        class="
                            rounded-lg
                            bg-rose-50
                            px-2.5
                            py-1.5
                            text-[10px]
                            font-black
                            text-rose-600
                            transition-all
                            hover:bg-rose-100
                        "
                    >
                        Delete
                    </button>

                </div>

            </div>
        `;

    todolist.appendChild(li);
  });

  updateAnalyticsDashboard();
}

// ============================================================
// ➕ TASK FORM SUBMIT
// ============================================================

/*
Hinglish:

Agar EditTodoID null hai => new task.

Agar EditTodoID available hai => existing task update.
*/

if (todoform) {
  todoform.addEventListener("submit", (event) => {
    event.preventDefault();

    const text = todoinput?.value.trim();

    const deadline = todoDeadline?.value || null;

    if (!text) {
      showToast("Please task ka naam enter karein.", "warning");

      todoinput?.focus();

      return;
    }

    // ================================================
    // ✏️ EDIT EXISTING TASK
    // ================================================

    if (EditTodoID !== null) {
      todos = todos.map((todo) => {
        if (todo.id === Number(EditTodoID)) {
          return {
            ...todo,

            text,

            deadline,
          };
        }

        return todo;
      });

      showToast("Task successfully updated.", "success");
    }

    // ================================================
    // ➕ ADD NEW TASK
    // ================================================
    else {
      todos.unshift({
        id: Date.now(),

        text,

        iscompleted: false,

        deadline,
      });

      showToast("New focus task added.", "success");
    }

    saveToLocalStorage();

    resetFormState();

    rendertodo();
  });
}

// ============================================================
// ❌ CANCEL EDIT
// ============================================================

if (cancelbtn) {
  cancelbtn.addEventListener("click", () => {
    resetFormState();

    showToast("Edit cancelled.", "info");
  });
}

// ============================================================
// ✏️ START EDIT
// ============================================================

function Startedit(id) {
  const current = todos.find((todo) => todo.id === Number(id));

  if (!current) {
    return;
  }

  EditTodoID = Number(id);

  if (todoinput) {
    todoinput.value = current.text;
  }

  if (todoDeadline) {
    todoDeadline.value = current.deadline ? current.deadline.slice(0, 16) : "";
  }

  if (formbtn) {
    formbtn.textContent = "Save Changes";
  }

  if (cancelbtn) {
    cancelbtn.classList.remove("hidden");
  }

  todoinput?.focus();

  showToast("Task editing mode active.", "info");
}

// ============================================================
// 🔄 RESET FORM
// ============================================================

function resetFormState() {
  EditTodoID = null;

  if (formbtn) {
    formbtn.textContent = "Add Task";
  }

  if (cancelbtn) {
    cancelbtn.classList.add("hidden");
  }

  if (todoinput) {
    todoinput.value = "";
  }

  if (todoDeadline) {
    todoDeadline.value = "";
  }
}

// ============================================================
// 🖱️ TASK EVENT DELEGATION
// ============================================================

/*
Hinglish:

Har task ke andar individual listeners banane ke bajaye
parent <ul> par ek listener use kiya gaya hai.

Isse dynamically added tasks bhi automatically work karte hain.
*/

if (todolist) {
  todolist.addEventListener("click", (event) => {
    const target = event.target;

    const li = target.closest("li");

    if (!li) return;

    const id = Number(li.dataset.id);

    const action = target.dataset.action;

    // ================================================
    // ✏️ EDIT
    // ================================================

    if (action === "edit") {
      Startedit(id);

      return;
    }

    // ================================================
    // 🗑️ DELETE
    // ================================================

    if (action === "delete") {
      const task = todos.find((todo) => todo.id === id);

      todos = todos.filter((todo) => todo.id !== id);

      saveToLocalStorage();

      rendertodo();

      showToast(`"${task?.text || "Task"}" deleted.`, "success");

      return;
    }
  });

  // ========================================================
  // ☑️ CHECKBOX COMPLETE
  // ========================================================

  todolist.addEventListener("change", (event) => {
    const target = event.target;

    if (target.dataset.action !== "toggle") {
      return;
    }

    const li = target.closest("li");

    if (!li) return;

    const id = Number(li.dataset.id);

    todos = todos.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,

          iscompleted: Boolean(target.checked),
        };
      }

      return todo;
    });

    saveToLocalStorage();

    rendertodo();

    showToast(
      target.checked ? "Task completed! 🎉" : "Task marked active.",
      target.checked ? "success" : "info",
    );
  });
}

// ============================================================
// 🧹 CLEAR COMPLETED
// ============================================================

if (clearCompletedBtn) {
  clearCompletedBtn.addEventListener("click", () => {
    const before = todos.length;

    todos = todos.filter((todo) => !todo.iscompleted);

    const removed = before - todos.length;

    if (!removed) {
      showToast("No completed tasks to clear.", "info");

      return;
    }

    saveToLocalStorage();

    rendertodo();

    showToast(
      `${removed} completed task${removed > 1 ? "s" : ""} cleared.`,
      "success",
    );
  });
}

// ============================================================
// 🧹 CLEAR ALL
// ============================================================

if (clearAllBtn) {
  clearAllBtn.addEventListener("click", () => {
    if (todos.length === 0) {
      showToast("Workspace already empty.", "info");

      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete all tasks?",
    );

    if (!confirmed) {
      return;
    }

    todos = [];

    saveToLocalStorage();

    resetFormState();

    rendertodo();

    showToast("All tasks removed.", "success");
  });
}

// ============================================================
// 🔀 OPEN POMODORO
// ============================================================

if (switchToPomoBtn) {
  switchToPomoBtn.addEventListener("click", () => {
    tasksView?.classList.add("hidden");

    pomodoroView?.classList.remove("hidden");

    syncEnvironmentalMode(currentActiveMode);

    showToast("Focus Hub ready. 🚀", "success");
  });
}

// ============================================================
// 🚪 EXIT POMODORO
// ============================================================

if (exitPomoBtn) {
  exitPomoBtn.addEventListener("click", () => {
    stopPomodoro();

    stopBreathing();

    stopAmbientSound();

    pomodoroView?.classList.add("hidden");

    tasksView?.classList.remove("hidden");

    resetWorkspaceAppearance();

    showToast("Back to workspace.", "info");
  });
}

// ============================================================
// 🎨 RESET WORKSPACE APPEARANCE
// ============================================================

function resetWorkspaceAppearance() {
  if (appBody) {
    appBody.style.backgroundImage = `url("https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=85")`;
  }

  if (workspaceCard) {
    workspaceCard.className =
      "w-full max-w-md md:max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl transition-all duration-500";
  }

  if (headerBanner) {
    headerBanner.style.backgroundImage = `linear-gradient(to right, rgba(79,70,229,.90), rgba(124,58,237,.80)), url("https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=85")`;
  }

  if (headerTitle) {
    headerTitle.textContent = "Workspace Flow";
  }

  if (headerSubtitle) {
    headerSubtitle.textContent = "Deadlines & Focus Dashboard";
  }
}

// ============================================================
// ⏱️ DURATION SELECTOR
// ============================================================

if (pomoDurationSelect) {
  pomoDurationSelect.addEventListener("change", (event) => {
    if (isPomoRunning) {
      showToast(
        "Running session ke during duration change nahi kar sakte.",
        "warning",
      );

      pomoDurationSelect.value = String(Math.round(pomoInitialTime / 60));

      return;
    }

    const minutes = Number(event.target.value);

    if (!Number.isFinite(minutes) || minutes <= 0) {
      return;
    }

    pomoInitialTime = minutes * 60;

    pomoTimeLeft = pomoInitialTime;

    updateClockDisplay();

    updatePomodoroProgress();
  });
}

// ============================================================
// 🕐 FORMAT TIMER
// ============================================================

function formatTimer(seconds) {
  const safeSeconds = Math.max(0, Number(seconds) || 0);

  const minutes = Math.floor(safeSeconds / 60);

  const remainingSeconds = safeSeconds % 60;

  return {
    minutes: String(minutes).padStart(2, "0"),

    seconds: String(remainingSeconds).padStart(2, "0"),
  };
}

// ============================================================
// 🕐 UPDATE TIMER DISPLAY
// ============================================================

function updateClockDisplay() {
  if (!pomoTimerDisplay) {
    return;
  }

  const time = formatTimer(pomoTimeLeft);

  pomoTimerDisplay.textContent = `${time.minutes}:${time.seconds}`;

  updatePomodoroProgress();
}

// ============================================================
// 📈 POMODORO PROGRESS
// ============================================================

function updatePomodoroProgress() {
  if (!pomoProgressBar || !pomoProgressText) {
    return;
  }

  if (pomoInitialTime <= 0) {
    return;
  }

  const elapsed = pomoInitialTime - pomoTimeLeft;

  const percentage = Math.min(
    100,
    Math.max(0, (elapsed / pomoInitialTime) * 100),
  );

  pomoProgressBar.style.width = `${percentage}%`;

  pomoProgressText.textContent = `${Math.round(percentage)}%`;
}

// ============================================================
// ▶️ START / RESUME POMODORO
// ============================================================

if (pomoStartBtn) {
  pomoStartBtn.addEventListener("click", () => {
    if (isPomoRunning) {
      pausePomodoro();
    } else {
      startPomodoro();
    }
  });
}

// ============================================================
// ▶️ START POMODORO FUNCTION
// ============================================================

function startPomodoro() {
  if (pomoTimeLeft <= 0) {
    resetPomodoro();
  }

  isPomoRunning = true;

  pomoStartBtn.textContent = "Pause Focus";

  pomoStatus.textContent = "Deep Focus Active";

  timerCard?.classList.add("timer-running");

  startAmbientSound();

  clearInterval(pomoInterval);

  pomoInterval = setInterval(tickPomodoro, 1000);

  showToast("Focus session started. 🎯", "success");
}

// ============================================================
// ⏸️ PAUSE POMODORO
// ============================================================

function pausePomodoro() {
  isPomoRunning = false;

  clearInterval(pomoInterval);

  pomoInterval = null;

  pomoStartBtn.textContent = "Resume Session";

  pomoStatus.textContent = "Focus Paused";

  timerCard?.classList.remove("timer-running");

  stopAmbientSound();

  showToast("Focus session paused.", "info");
}

// ============================================================
// ⏱️ TIMER TICK
// ============================================================

function tickPomodoro() {
  if (pomoTimeLeft <= 0) {
    completePomodoro();

    return;
  }

  pomoTimeLeft--;

  updateClockDisplay();
}

// ============================================================
// 🎉 POMODORO COMPLETE
// ============================================================

function completePomodoro() {
  clearInterval(pomoInterval);

  pomoInterval = null;

  isPomoRunning = false;

  pomoTimeLeft = 0;

  updateClockDisplay();

  pomoStartBtn.textContent = "Start Session";

  pomoStatus.textContent = "Session Completed";

  timerCard?.classList.remove("timer-running");

  stopAmbientSound();

  sessionNumber++;

  saveSetting(STORAGE_KEYS.session, sessionNumber);

  updateSessionCounter();

  playCompletionChime();

  showToast("Focus milestone completed! 🎉", "success");

  window.setTimeout(() => {
    const next = window.confirm(
      "Focus session complete! Start another session?",
    );

    if (next) {
      resetPomodoro();

      startPomodoro();
    }
  }, 250);
}

// ============================================================
// 🔄 RESET POMODORO
// ============================================================

if (pomoResetBtn) {
  pomoResetBtn.addEventListener("click", () => {
    resetPomodoro();
  });
}

function resetPomodoro() {
  clearInterval(pomoInterval);

  pomoInterval = null;

  isPomoRunning = false;

  const selected = Number(pomoDurationSelect?.value || 25);

  pomoInitialTime = selected * 60;

  pomoTimeLeft = pomoInitialTime;

  pomoStartBtn.textContent = "Start Session";

  pomoStatus.textContent = "Ready To Focus";

  timerCard?.classList.remove("timer-running");

  stopAmbientSound();

  updateClockDisplay();

  showToast("Timer reset.", "info");
}

// ============================================================
// 📊 SESSION COUNTER
// ============================================================

function updateSessionCounter() {
  if (!sessionCounter) {
    return;
  }

  sessionCounter.textContent = `Session ${sessionNumber}`;
}

// ============================================================
// 🎨 MODE TAB INITIALIZATION
// ============================================================

document.querySelectorAll(".mode-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    const mode = tab.dataset.mode;

    if (!moodConfigurations[mode]) {
      return;
    }

    currentActiveMode = mode;

    saveSetting(STORAGE_KEYS.mode, mode);

    syncEnvironmentalMode(mode);

    if (isPomoRunning) {
      startAmbientSound();
    }
  });
});

// ============================================================
// 🎨 SYNC ENVIRONMENTAL MODE
// ============================================================

function syncEnvironmentalMode(modeKey) {
  const config = moodConfigurations[modeKey];

  if (!config) {
    return;
  }

  // ========================================================
  // 🌄 BODY BACKGROUND
  // ========================================================

  if (appBody) {
    appBody.style.backgroundImage = `url("${config.bg}")`;

    appBody.style.backgroundSize = "cover";

    appBody.style.backgroundPosition = "center";
  }

  // ========================================================
  // 🏠 WORKSPACE CARD
  // ========================================================

  if (workspaceCard) {
    workspaceCard.className = config.cardClass;
  }

  // ========================================================
  // 🌄 HEADER
  // ========================================================

  if (headerBanner) {
    headerBanner.style.backgroundImage = config.bannerStyle.replace(
      "background-image:",
      "",
    );
  }

  if (headerTitle) {
    headerTitle.textContent = config.title;
  }

  if (headerSubtitle) {
    headerSubtitle.textContent = config.sub;
  }

  // ========================================================
  // 🎨 STATUS COLOR
  // ========================================================

  if (pomoStatus) {
    pomoStatus.className = `text-[10px] font-black uppercase tracking-[0.18em] ${config.accent}`;
  }

  // ========================================================
  // 🔘 MODE TAB STYLING
  // ========================================================

  document.querySelectorAll(".mode-tab").forEach((tab) => {
    const isActive = tab.dataset.mode === modeKey;

    tab.className = isActive
      ? `mode-tab rounded-xl border border-indigo-400/60 bg-slate-900 px-2 py-2 text-[10px] font-black text-indigo-300 shadow-sm transition-all`
      : `mode-tab rounded-xl border border-slate-700 bg-slate-800 px-2 py-2 text-[10px] font-bold text-slate-400 transition-all hover:bg-slate-700`;
  });

  // ========================================================
  // 🔊 SOUND LABEL
  // ========================================================

  updateSoundButton();
}

// ============================================================
// 🌬️ BREATHING TOGGLE
// ============================================================

if (toggleBreathingModeBtn) {
  toggleBreathingModeBtn.addEventListener("click", () => {
    if (isBreathingActiveMode) {
      stopBreathing();
    } else {
      startBreathing();
    }
  });
}

// ============================================================
// 🌬️ START BREATHING
// ============================================================

function startBreathing() {
  isBreathingActiveMode = true;

  clockWrapper?.classList.add("hidden");

  breathingWrapper?.classList.remove("hidden");

  breathingWrapper?.classList.add("flex");

  toggleBreathingModeBtn.textContent = "View Timer Clock";

  launchBreathingCycleLoop();

  showToast("Breathing sanctuary activated. 🧘", "success");
}

// ============================================================
// 🌬️ STOP BREATHING
// ============================================================

function stopBreathing() {
  isBreathingActiveMode = false;

  clearInterval(breathingInterval);

  breathingInterval = null;

  breathingWrapper?.classList.add("hidden");

  breathingWrapper?.classList.remove("flex");

  clockWrapper?.classList.remove("hidden");

  toggleBreathingModeBtn.textContent = "Switch Breathing";

  if (breathingNode) {
    breathingNode.className = `
            flex
            h-28
            w-28
            items-center
            justify-center
            rounded-full
            border-4
            border-indigo-500
            bg-indigo-500/20
            `;
  }
}

// ============================================================
// 🌬️ BREATHING LOOP
// ============================================================

function launchBreathingCycleLoop() {
  clearInterval(breathingInterval);

  let step = 0;

  setBreathingState("inhale");

  breathingInterval = setInterval(() => {
    step = (step + 1) % 3;

    if (step === 0) {
      setBreathingState("inhale");
    } else if (step === 1) {
      setBreathingState("hold");
    } else {
      setBreathingState("exhale");
    }
  }, 4000);
}

// ============================================================
// 🌬️ BREATHING STATE
// ============================================================

function setBreathingState(state) {
  if (!breathingNode || !breathingActionTxt) {
    return;
  }

  const baseClass = `
        flex
        h-28
        w-28
        items-center
        justify-center
        rounded-full
        border-4
        `;

  if (state === "inhale") {
    breathingActionTxt.textContent = "Inhale";

    breathingNode.className = `${baseClass} border-indigo-500 bg-indigo-500/20 breathing-inhale`;
  } else if (state === "hold") {
    breathingActionTxt.textContent = "Hold";

    breathingNode.className = `${baseClass} border-amber-500 bg-amber-500/20 breathing-hold`;
  } else {
    breathingActionTxt.textContent = "Exhale";

    breathingNode.className = `${baseClass} border-rose-500 bg-rose-500/20 breathing-exhale`;
  }
}

// ============================================================
// 🔊 SOUND BUTTON
// ============================================================

if (soundToggleBtn) {
  soundToggleBtn.addEventListener("click", () => {
    soundEnabled = !soundEnabled;

    saveSetting(STORAGE_KEYS.sound, soundEnabled ? "on" : "off");

    if (!soundEnabled) {
      stopAmbientSound();
    } else if (isPomoRunning) {
      startAmbientSound();
    }

    updateSoundButton();
  });
}

// ============================================================
// 🔊 UPDATE SOUND BUTTON
// ============================================================

function updateSoundButton() {
  if (!soundToggleBtn) {
    return;
  }

  soundToggleBtn.textContent = soundEnabled ? "🔊 Sound On" : "🔇 Sound Off";
}

// ============================================================
// 🎵 WEB AUDIO ENGINE
// ============================================================

/*
Hinglish:

Original HTML mein Mixkit/SoundJay ke website URLs ko
<audio src=""> mein use kiya gaya tha.

Wo actual audio files nahi the.

Is version mein external audio files ki dependency remove
kar di gayi hai.

Browser Web Audio API se lightweight ambient sounds generate
hote hain.

Mood ke according sound character change hota hai.
*/

function ensureAudioContext() {
  if (!soundEnabled) {
    return null;
  }

  if (!audioContext) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;

    if (!AudioContext) {
      return null;
    }

    audioContext = new AudioContext();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume().catch(() => {});
  }

  return audioContext;
}

// ============================================================
// 🎵 START AMBIENT SOUND
// ============================================================

function startAmbientSound() {
  if (!soundEnabled) {
    return;
  }

  stopAmbientSound();

  const ctx = ensureAudioContext();

  if (!ctx) {
    return;
  }

  const master = ctx.createGain();

  master.gain.value = 0.035;

  master.connect(ctx.destination);

  ambientNodes.push(master);

  // ========================================================
  // 💼 WORK
  // ========================================================

  if (currentActiveMode === "work") {
    createTone(ctx, master, 110, "sine", 0.018);

    createTone(ctx, master, 165, "sine", 0.012);
  }

  // ========================================================
  // 🌧️ RAIN
  // ========================================================
  else if (currentActiveMode === "rain") {
    createNoise(ctx, master, 0.045, 850);
  }

  // ========================================================
  // ☕ LOFI
  // ========================================================
  else if (currentActiveMode === "lofi") {
    createTone(ctx, master, 130.81, "triangle", 0.018);

    createTone(ctx, master, 196, "triangle", 0.01);
  }

  // ========================================================
  // ☀️ HAPPY
  // ========================================================
  else if (currentActiveMode === "happy") {
    createTone(ctx, master, 261.63, "sine", 0.012);

    createTone(ctx, master, 329.63, "sine", 0.009);
  }

  // ========================================================
  // 🧘 ZEN
  // ========================================================
  else if (currentActiveMode === "zen") {
    createTone(ctx, master, 174.61, "sine", 0.018);

    createTone(ctx, master, 261.63, "sine", 0.007);
  }
}

// ============================================================
// 🎵 CREATE OSCILLATOR
// ============================================================

function createTone(ctx, destination, frequency, type, volume) {
  const oscillator = ctx.createOscillator();

  const gain = ctx.createGain();

  oscillator.type = type;

  oscillator.frequency.value = frequency;

  gain.gain.value = volume;

  oscillator.connect(gain);

  gain.connect(destination);

  oscillator.start();

  ambientNodes.push(oscillator, gain);
}

// ============================================================
// 🌧️ CREATE NOISE
// ============================================================

function createNoise(ctx, destination, volume, filterFrequency) {
  const bufferSize = ctx.sampleRate * 2;

  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);

  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const source = ctx.createBufferSource();

  source.buffer = buffer;

  source.loop = true;

  const filter = ctx.createBiquadFilter();

  filter.type = "lowpass";

  filter.frequency.value = filterFrequency;

  const gain = ctx.createGain();

  gain.gain.value = volume;

  source.connect(filter).connect(gain).connect(destination);

  source.start();

  ambientNodes.push(source, filter, gain);
}

// ============================================================
// 🛑 STOP AMBIENT SOUND
// ============================================================

function stopAmbientSound() {
  ambientNodes.forEach((node) => {
    try {
      if (typeof node.stop === "function") {
        node.stop();
      }
    } catch {
      // Already stopped.
    }

    try {
      if (typeof node.disconnect === "function") {
        node.disconnect();
      }
    } catch {
      // Already disconnected.
    }
  });

  ambientNodes = [];
}

// ============================================================
// 🔔 COMPLETION CHIME
// ============================================================

function playCompletionChime() {
  const ctx = ensureAudioContext();

  if (!ctx) {
    return;
  }

  const oscillator = ctx.createOscillator();

  const gain = ctx.createGain();

  oscillator.type = "sine";

  oscillator.frequency.setValueAtTime(523.25, ctx.currentTime);

  oscillator.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15);

  gain.gain.setValueAtTime(0.0001, ctx.currentTime);

  gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.02);

  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);

  oscillator.connect(gain);

  gain.connect(ctx.destination);

  oscillator.start();

  oscillator.stop(ctx.currentTime + 0.65);
}

// ============================================================
// 🛑 STOP POMODORO
// ============================================================

function stopPomodoro() {
  clearInterval(pomoInterval);

  pomoInterval = null;

  isPomoRunning = false;

  timerCard?.classList.remove("timer-running");

  stopAmbientSound();
}

// ============================================================
// 🧹 FULL ENGINE CLEANUP
// ============================================================

function shutdownPomoEngines() {
  stopPomodoro();

  stopBreathing();

  stopAmbientSound();
}

// ============================================================
// ⌨️ KEYBOARD SHORTCUTS
// ============================================================

/*
Hinglish:

Escape = edit cancel

Space = timer start/pause
sirf jab user input/textarea/select mein na ho.
*/

document.addEventListener("keydown", (event) => {
  // ESCAPE
  if (event.key === "Escape") {
    if (EditTodoID !== null) {
      resetFormState();
    }
  }

  // SPACE
  if (event.code === "Space") {
    const tag = document.activeElement?.tagName?.toLowerCase();

    const typing = tag === "input" || tag === "textarea" || tag === "select";

    if (!typing && !pomodoroView?.classList.contains("hidden")) {
      event.preventDefault();

      if (isPomoRunning) {
        pausePomodoro();
      } else {
        startPomodoro();
      }
    }
  }
});

// ============================================================
// ⏳ DEADLINE AUTO REFRESH
// ============================================================

/*
Hinglish:

Har 30 seconds task deadlines refresh hoti hain.

Original code mein 60 seconds tha.
30 seconds karne se countdown zyada responsive dikhega.
*/

clearInterval(deadlineRefreshInterval);

deadlineRefreshInterval = setInterval(() => {
  rendertodo();
}, 30000);

// ============================================================
// 🌐 PAGE VISIBILITY
// ============================================================

/*
Hinglish:

Browser tab background mein hone par audio/timer state
ko unnecessarily disturb nahi karte.

Timer actual setInterval ke through continue karta hai.
*/

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    rendertodo();

    updateClockDisplay();
  }
});

// ============================================================
// 🧹 PAGE CLOSE CLEANUP
// ============================================================

window.addEventListener("beforeunload", () => {
  clearInterval(pomoInterval);

  clearInterval(breathingInterval);

  clearInterval(deadlineRefreshInterval);

  stopAmbientSound();
});

// ============================================================
// 🚀 APPLICATION BOOTSTRAP
// ============================================================

/*
Hinglish:

Page load hote hi:

1. Tasks render
2. Timer setup
3. Session number setup
4. Mood setup
5. Sound button setup

sab execute hota hai.
*/

function initializeApp() {
  // Default Pomodoro duration
  const selectedDuration = Number(pomoDurationSelect?.value || 25);

  pomoInitialTime = selectedDuration * 60;

  pomoTimeLeft = pomoInitialTime;

  updateClockDisplay();

  updateSessionCounter();

  updateSoundButton();

  rendertodo();

  syncEnvironmentalMode(currentActiveMode);

  showToast("Workspace Flow ready. ✨", "success");
}

// ============================================================
// 🚀 START APPLICATION
// ============================================================

initializeApp();
