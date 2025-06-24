// LESSON DATA
const lessons = [
  { title: "Lesson 1: Pick Your Niche", content: "Choose a profitable niche. Ex: Weight loss for busy moms.", badge: "🎯 Niche Ninja" },
  { title: "Lesson 2: Create Your Offer", content: "Design a result-driven offer. Ex: 90-day transformation.", badge: "💰 Offer Architect" },
  { title: "Lesson 3: Build Your Brand", content: "Create a memorable brand & messaging.", badge: "🧠 Brand Builder" },
  { title: "Lesson 4: Launch Funnel", content: "Setup sales pages, email flows & freebies.", badge: "🚀 Funnel Pro" },
  { title: "Lesson 5: Ads & Scaling", content: "Use Facebook/Instagram ads to scale.", badge: "📈 Ad Master" }
];

// STORAGE STATE
let xp = parseInt(localStorage.getItem("xp")) || 0;
let level = parseInt(localStorage.getItem("level")) || 1;
let streak = parseInt(localStorage.getItem("streak")) || 0;
let lastVisit = localStorage.getItem("lastVisit");
let completedLessons = JSON.parse(localStorage.getItem("completedLessons")) || [];
let badges = JSON.parse(localStorage.getItem("badges")) || [];

const today = new Date().toDateString();
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

// STREAK SYSTEM
if (lastVisit !== today) {
  if (lastVisit === yesterday.toDateString()) {
    streak += 1;
  } else {
    streak = 1;
  }

  localStorage.setItem("lastVisit", today);
  localStorage.setItem("streak", streak);

  // STREAK REWARDS
  if (streak === 3) xp += 15;
  if (streak === 7) xp += 30;
  if (streak === 14) xp += 75;

  localStorage.setItem("xp", xp);
}

// MISSION AI-LIKE GENERATOR
const missionPools = {
  content: ["🎥 Record a quick reel", "📝 Draft a carousel post", "📷 Take progress photo"],
  sales: ["💬 DM 3 new leads", "📞 Follow up with old client", "✉️ Send 1 pitch email"],
  mindset: ["📖 Read 5 mins of biz book", "🧠 Do visualization", "📒 Write 3 wins from yesterday"],
  marketing: ["📢 Comment on 5 niche posts", "🔍 Check competitor content", "📊 Analyze story views"]
};

function generateMissions() {
  return Object.values(missionPools).map(pool => {
    const randomTask = pool[Math.floor(Math.random() * pool.length)];
    return { text: randomTask, xp: 5 };
  });
}

const missionDate = localStorage.getItem("missionDate");
let missionProgress = missionDate === today
  ? JSON.parse(localStorage.getItem("missionProgress")) || []
  : [];

if (missionDate !== today) {
  const newMissions = generateMissions();
  localStorage.setItem("dailyMissions", JSON.stringify(newMissions));
  localStorage.setItem("missionProgress", JSON.stringify([]));
  localStorage.setItem("missionDate", today);
  missionProgress = [];
}

const dailyMissions = JSON.parse(localStorage.getItem("dailyMissions"));

// UI UPDATES
document.getElementById("streakCount").textContent = streak;
document.getElementById("xpCount").textContent = xp;
document.getElementById("levelCount").textContent = level;
document.getElementById("badgeList").textContent = badges.length ? badges.join(", ") : "None";

// RENDER LESSONS
const container = document.getElementById("lessonContainer");
lessons.forEach((lesson, index) => {
  const isUnlocked = index === 0 || completedLessons.includes(index - 1);
  const isComplete = completedLessons.includes(index);

  const section = document.createElement("section");
  section.className = `lesson ${!isUnlocked ? "locked" : ""}`;
  section.innerHTML = `
    <h2>${lesson.title}</h2>
    <p>${lesson.content}</p>
    <button ${isComplete ? "disabled" : ""} onclick="completeLesson(${index})">
      ${isComplete ? "Completed" : "Mark Complete"}
    </button>
  `;
  container.appendChild(section);
});

// RENDER MISSIONS
const missionList = document.getElementById("missionList");
dailyMissions.forEach((mission, index) => {
  const li = document.createElement("li");
  const isDone = missionProgress.includes(index);

  li.innerHTML = `
    <span>${mission.text}</span>
    <button ${isDone ? "disabled" : ""} onclick="completeMission(${index}, ${mission.xp})">
      ${isDone ? "Done" : "Do"}
    </button>
  `;
  missionList.appendChild(li);
});

// PROGRESS BAR
const progressPercent = (completedLessons.length / lessons.length) * 100;
document.getElementById("progressBar").value = progressPercent;

// COMPLETE LESSON
function completeLesson(index) {
  if (completedLessons.includes(index)) return;

  xp += 10;
  if (xp >= level * 50) level += 1;

  completedLessons.push(index);
  badges.push(lessons[index].badge);

  localStorage.setItem("xp", xp);
  localStorage.setItem("level", level);
  localStorage.setItem("completedLessons", JSON.stringify(completedLessons));
  localStorage.setItem("badges", JSON.stringify(badges));

  location.reload();
}

// COMPLETE MISSION
function completeMission(index, xpReward) {
  if (!missionProgress.includes(index)) {
    missionProgress.push(index);
    xp += xpReward;

    if (xp >= level * 50) level += 1;

    localStorage.setItem("xp", xp);
    localStorage.setItem("level", level);
    localStorage.setItem("missionProgress", JSON.stringify(missionProgress));

    document.getElementById("xpCount").textContent = xp;
    document.getElementById("levelCount").textContent = level;

    location.reload();
  }
}

// OPTIONAL REMINDER
if (Notification && Notification.permission !== "denied") {
  Notification.requestPermission().then((perm) => {
    if (perm === "granted") {
      new Notification("🔥 Keep your streak alive today!");
    }
  });
}
