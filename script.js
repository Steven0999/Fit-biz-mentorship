// Generate 20 lessons with 10 chapters each
const lessons = Array.from({ length: 20 }, (_, i) => ({
  title: `Lesson ${i + 1}: Step ${i + 1} to 7-Figure Biz`,
  chapters: Array.from({ length: 10 }, (_, j) => `Chapter ${j + 1}: Task ${j + 1}`),
  badge: `🏅 Badge ${i + 1}`
}));

let xp = parseInt(localStorage.getItem("xp")) || 0;
let level = parseInt(localStorage.getItem("level")) || 1;
let streak = parseInt(localStorage.getItem("streak")) || 0;
let lastVisit = localStorage.getItem("lastVisit");
let completedChapters = JSON.parse(localStorage.getItem("completedChapters") || "{}");
let badges = JSON.parse(localStorage.getItem("badges") || "[]");

const today = new Date().toDateString();
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

// Handle streaks
if (lastVisit !== today) {
  streak = (lastVisit === yesterday.toDateString()) ? streak + 1 : 1;
  if (streak === 3) xp += 15;
  if (streak === 7) xp += 30;
  if (streak === 14) xp += 75;

  localStorage.setItem("lastVisit", today);
  localStorage.setItem("streak", streak);
  localStorage.setItem("xp", xp);
}

// Update UI
document.getElementById("streakCount").textContent = streak;
document.getElementById("xpCount").textContent = xp;
document.getElementById("levelCount").textContent = level;
document.getElementById("badgeList").textContent = badges.length ? badges.join(", ") : "None";

// Lessons rendering
const lessonContainer = document.getElementById("lessonContainer");
lessons.forEach((lesson, index) => {
  const div = document.createElement("div");
  div.className = "lesson" + (completedChapters[index]?.length === 10 ? " completed" : "");
  div.innerHTML = `<strong>${lesson.title}</strong>`;
  div.onclick = () => openModal(index);
  lessonContainer.appendChild(div);
});

// Modal logic
const chapterModal = document.getElementById("chapterModal");
const chapterTitle = document.getElementById("chapterTitle");
const chapterList = document.getElementById("chapterList");

function openModal(lessonIndex) {
  chapterModal.classList.remove("hidden");
  chapterTitle.textContent = lessons[lessonIndex].title;
  chapterList.innerHTML = "";

  lessons[lessonIndex].chapters.forEach((chapter, chapterIndex) => {
    const li = document.createElement("li");
    const isDone = completedChapters[lessonIndex]?.includes(chapterIndex);
    li.innerHTML = `
      <span>${chapter}</span>
      <button ${isDone ? "disabled" : ""} onclick="completeChapter(${lessonIndex}, ${chapterIndex})">
        ${isDone ? "✅ Done" : "Complete"}
      </button>
    `;
    chapterList.appendChild(li);
  });
}

function closeModal() {
  chapterModal.classList.add("hidden");
}

function completeChapter(lessonIndex, chapterIndex) {
  completedChapters[lessonIndex] = completedChapters[lessonIndex] || [];
  if (!completedChapters[lessonIndex].includes(chapterIndex)) {
    completedChapters[lessonIndex].push(chapterIndex);
    xp += 5;
    if (xp >= level * 50) level += 1;

    if (completedChapters[lessonIndex].length === 10 && !badges.includes(lessons[lessonIndex].badge)) {
      badges.push(lessons[lessonIndex].badge);
    }

    localStorage.setItem("xp", xp);
    localStorage.setItem("level", level);
    localStorage.setItem("badges", JSON.stringify(badges));
    localStorage.setItem("completedChapters", JSON.stringify(completedChapters));
    location.reload();
  }
}

// Daily mission generator
const missionPools = {
  content: ["🎥 Make a Reel", "📝 Draft a post", "📷 Shoot a client win"],
  sales: ["📞 DM 5 leads", "📧 Send sales email", "🤝 Follow up with client"],
  mindset: ["📖 Read 5 mins", "🧘 Meditate 3 mins", "📓 Write biz affirmations"],
  marketing: ["📈 Analyze IG insights", "🗣 Comment on 3 posts", "📊 Review funnel"]
};

function generateMissions() {
  return Object.values(missionPools).map(pool => {
    const task = pool[Math.floor(Math.random() * pool.length)];
    return { text: task, xp: 5 };
  });
}

const todayMissions = localStorage.getItem("missionDate") === today
  ? JSON.parse(localStorage.getItem("dailyMissions"))
  : generateMissions();

localStorage.setItem("missionDate", today);
localStorage.setItem("dailyMissions", JSON.stringify(todayMissions));

const missionProgress = JSON.parse(localStorage.getItem("missionProgress") || "[]");

const missionList = document.getElementById("missionList");
todayMissions.forEach((mission, index) => {
  const li = document.createElement("li");
  const done = missionProgress.includes(index);
  li.innerHTML = `
    <span>${mission.text}</span>
    <button ${done ? "disabled" : ""} onclick="completeMission(${index}, ${mission.xp})">
      ${done ? "✅ Done" : "Do"}
    </button>`;
  missionList.appendChild(li);
});

function completeMission(index, xpGain) {
  if (!missionProgress.includes(index)) {
    missionProgress.push(index);
    xp += xpGain;
    if (xp >= level * 50) level += 1;

    localStorage.setItem("xp", xp);
    localStorage.setItem("level", level);
    localStorage.setItem("missionProgress", JSON.stringify(missionProgress));
    location.reload();
  }
}

// Progress bar update
const totalChapters = lessons.length * 10;
const completed = Object.values(completedChapters).reduce((acc, arr) => acc + arr.length, 0);
document.getElementById("progressBar").value = (completed / totalChapters) * 100;
