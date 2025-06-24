const lessons = [
  { title: "Define Your Niche" },
  { title: "Create Your Offer" },
  { title: "Build Your Website" },
  { title: "Marketing Strategy" },
  { title: "Sales Funnel Setup" },
  { title: "Lead Magnet Creation" },
  { title: "Email Campaigns" },
  { title: "Social Media Branding" },
  { title: "Client Onboarding" },
  { title: "Scale With Ads" }
];

const lessonContainer = document.getElementById("lessonContainer");
const progressBar = document.getElementById("progressBar");
const xpCount = document.getElementById("xpCount");
const levelCount = document.getElementById("levelCount");
const streakCount = document.getElementById("streakCount");
const badgeList = document.getElementById("badgeList");

let completedChapters = {};
let streak = parseInt(localStorage.getItem("streak")) || 0;

function renderLessons() {
  lessonContainer.innerHTML = "";
  lessons.forEach((lesson, index) => {
    const div = document.createElement("div");
    div.className = "lesson" + (completedChapters[index]?.length === 10 ? " completed" : "");
    div.innerHTML = `
      <strong>${lesson.title}</strong>
      <div>
        <button onclick="openModal(${index})">📘 View Chapters</button>
        <button onclick="openScriptModal(${index})">📄 View Training Script</button>
      </div>
    `;
    lessonContainer.appendChild(div);
  });
}

function openModal(index) {
  const modal = document.getElementById("chapterModal");
  const chapterTitle = document.getElementById("chapterTitle");
  const chapterList = document.getElementById("chapterList");

  chapterTitle.textContent = lessons[index].title;
  chapterList.innerHTML = "";

  if (!completedChapters[index]) completedChapters[index] = [];

  for (let i = 1; i <= 10; i++) {
    const li = document.createElement("li");
    li.textContent = `Chapter ${i}`;
    li.style.cursor = "pointer";
    if (completedChapters[index].includes(i)) li.style.textDecoration = "line-through";

    li.onclick = () => {
      if (!completedChapters[index].includes(i)) {
        completedChapters[index].push(i);
        updateStats();
        openModal(index);
      }
    };
    chapterList.appendChild(li);
  }

  modal.classList.remove("hidden");
}

function closeModal() {
  document.getElementById("chapterModal").classList.add("hidden");
}

function updateStats() {
  let totalChapters = 10 * lessons.length;
  let completed = Object.values(completedChapters).reduce((acc, arr) => acc + arr.length, 0);
  progressBar.value = (completed / totalChapters) * 100;
  xpCount.textContent = completed * 10;
  levelCount.textContent = Math.floor((completed * 10) / 100);
  streakCount.textContent = ++streak;
  localStorage.setItem("streak", streak);

  if (completed === totalChapters) {
    badgeList.textContent = "💼 Master Trainer, 🧗‍♂️ Business Climber";
  }
}

function generateScriptPages(index) {
  const title = lessons[index].title;
  const detailedScripts = {
    "Define Your Niche": [
      `📄 Page 1: Your niche defines WHO you serve. Focus on a specific audience: busy moms, athletes, over-50s, etc. The tighter the niche, the stronger the appeal.`,
      `⚙️ Page 2: Create a mission statement: \"I help [niche] achieve [result] using [method].\" Validate it via social media or SEO tools.`,
      `❌ Page 3: Mistakes: Too broad or choosing a niche with no demand. Tip: Use Reddit, Quora, and FB groups to validate interest.`
    ],
    "Create Your Offer": [
      `📄 Page 1: Your offer is your packaged transformation. It's more than workouts — it's value, method, promise.`,
      `⚙️ Page 2: Define your core outcome, program structure, bonuses (e.g. meal guides), and price.`,
      `❌ Page 3: Mistake: Selling sessions, not results. Tip: Sell the \"before & after\" transformation story.`
    ],
    "Build Your Website": [
      `📄 Page 1: A website builds trust and authority. It’s your 24/7 business card.`,
      `⚙️ Page 2: Include homepage, about, services, testimonials, contact, and lead magnet form.`,
      `❌ Page 3: Mistake: Overdesigning or not having a CTA. Tip: Use simple drag-drop builders like Carrd, Wix, or Webflow.`
    ],
    "Marketing Strategy": [
      `📄 Page 1: Marketing attracts attention. It’s how people find you.`,
      `⚙️ Page 2: Choose your main channels: IG, TikTok, YouTube. Publish helpful, story-driven content.`,
      `❌ Page 3: Mistake: Posting randomly. Tip: Use a weekly content calendar and batch creation.`
    ],
    "Sales Funnel Setup": [
      `📄 Page 1: Funnels turn traffic into clients using a structured path: Freebie > Nurture > Offer.`,
      `⚙️ Page 2: Create a landing page, thank-you email sequence, and offer delivery.`,
      `❌ Page 3: Mistake: Not nurturing leads. Tip: Automate using MailerLite or ConvertKit.`
    ],
    "Lead Magnet Creation": [
      `📄 Page 1: A lead magnet gives value in exchange for email/contact info.`,
      `⚙️ Page 2: Offer a free PDF, checklist, or 5-day challenge relevant to your niche.`,
      `❌ Page 3: Mistake: Generic titles. Tip: Use specific, urgent benefits like \"Lose 5lbs in 10 Days—Meal Blueprint\".`
    ],
    "Email Campaigns": [
      `📄 Page 1: Emails nurture trust and build long-term clients.`,
      `⚙️ Page 2: Set up welcome sequences, weekly tips, and pitch emails.`,
      `❌ Page 3: Mistake: Only selling. Tip: Follow 3:1 value-to-pitch ratio.`
    ],
    "Social Media Branding": [
      `📄 Page 1: Consistent visual & message branding builds recognition.`,
      `⚙️ Page 2: Use a color palette, font style, and clear bio. Share wins, stories, and tips.`,
      `❌ Page 3: Mistake: Looking like everyone else. Tip: Use Canva to create unique post styles.`
    ],
    "Client Onboarding": [
      `📄 Page 1: Onboarding sets the tone for success.`,
      `⚙️ Page 2: Send welcome email, client intake form, and orientation video.`,
      `❌ Page 3: Mistake: Confusing first week. Tip: Create a simple Day 1 checklist.`
    ],
    "Scale With Ads": [
      `📄 Page 1: Ads multiply results when organic works.`,
      `⚙️ Page 2: Start with $5/day on Meta ads to lead magnet. Use Lookalike audiences.`,
      `❌ Page 3: Mistake: Selling cold. Tip: Warm them up with your lead magnet first.`
    ]
  };

  return detailedScripts[title] || [`Page 1`, `Page 2`, `Page 3`];
}

function openScriptModal(index) {
  const scriptModal = document.getElementById("trainingScriptModal");
  const scriptTitle = document.getElementById("scriptTitle");
  const scriptPages = document.getElementById("scriptPages");

  scriptTitle.textContent = `Training Script: ${lessons[index].title}`;
  scriptPages.innerHTML = "";

  const pages = generateScriptPages(index);
  pages.forEach(content => {
    const div = document.createElement("div");
    div.className = "script-page";
    div.textContent = content;
    scriptPages.appendChild(div);
  });

  scriptModal.classList.remove("hidden");
}

function closeScriptModal() {
  document.getElementById("trainingScriptModal").classList.add("hidden");
}

renderLessons();
updateStats();
