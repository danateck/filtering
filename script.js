// ========= STATE =========
let allJobs = [];
let activeFilters = new Set();

// DOM refs
const jobListEl = document.getElementById("jobList");
const filterBarEl = document.getElementById("filterBar");
const activeFiltersEl = document.getElementById("activeFilters");
const clearBtn = document.getElementById("clearBtn");

// ========= INIT =========
fetch("./data.json")
  .then((res) => res.json())
  .then((data) => {
    allJobs = data;
    render();
  })
  .catch((err) => {
    console.error("Failed to load data.json", err);
  });

// ========= RENDER ROOT =========
function render() {
  renderJobCards();
  renderFilterBar();
}

// ========= RENDER CARDS =========
function renderJobCards() {
  jobListEl.innerHTML = "";

  const filters = [...activeFilters];

  // Filter jobs: keep only those where the set of tags contains all active filters
  const filteredJobs = allJobs.filter((job) => {
    if (filters.length === 0) return true;

    const tags = collectJobTags(job);
    return filters.every((f) => tags.includes(f));
  });

  filteredJobs.forEach((job) => {
    const card = buildJobCard(job);
    jobListEl.appendChild(card);
  });
}

// ========= RENDER FILTER BAR =========
function renderFilterBar() {
  activeFiltersEl.innerHTML = "";

  if (activeFilters.size === 0) {
    filterBarEl.hidden = true;
    return;
  }

  filterBarEl.hidden = false;

  activeFilters.forEach((filter) => {
    const pill = document.createElement("div");
    pill.className = "active-filter";

    const label = document.createElement("span");
    label.className = "active-filter__label";
    label.textContent = filter;

    const removeBtn = document.createElement("button");
    removeBtn.className = "active-filter__remove";
    removeBtn.setAttribute("aria-label", `Remove filter ${filter}`);
    removeBtn.textContent = "✕";
    removeBtn.addEventListener("click", () => {
      activeFilters.delete(filter);
      render();
    });

    pill.appendChild(label);
    pill.appendChild(removeBtn);

    activeFiltersEl.appendChild(pill);
  });
}

// clear all
clearBtn.addEventListener("click", () => {
  activeFilters.clear();
  render();
});

// ========= HELPERS =========

// Build a <article> job card
function buildJobCard(job) {
  const {
    company,
    logo,
    new: isNew,
    featured,
    position,
    postedAt,
    contract,
    location,
    role,
    level,
    languages,
    tools,
  } = job;

  const tags = collectJobTags(job);

  const card = document.createElement("article");
  card.className = "job-card";
  if (featured) card.classList.add("job-card--featured");

  // LEFT SIDE (logo + info)
  const top = document.createElement("div");
  top.className = "job-card__top";

  const logoWrapper = document.createElement("div");
  logoWrapper.className = "job-card__logo";
  const img = document.createElement("img");
  img.src = logo;
  img.alt = `${company} logo`;
  logoWrapper.appendChild(img);

  const main = document.createElement("div");
  main.className = "job-card__main";

  // company row
  const companyRow = document.createElement("div");
  companyRow.className = "job-card__company-row";

  const companyEl = document.createElement("span");
  companyEl.className = "job-card__company";
  companyEl.textContent = company;
  companyRow.appendChild(companyEl);

  if (isNew) {
    const badgeNew = document.createElement("span");
    badgeNew.className = "badge";
    badgeNew.textContent = "NEW!";
    companyRow.appendChild(badgeNew);
  }

  if (featured) {
    const badgeFeat = document.createElement("span");
    badgeFeat.className = "badge badge--dark";
    badgeFeat.textContent = "FEATURED";
    companyRow.appendChild(badgeFeat);
  }

  // position
  const positionEl = document.createElement("div");
  positionEl.className = "job-card__position";
  positionEl.textContent = position;

  // meta row (postedAt • contract • location)
  const metaRow = document.createElement("ul");
  metaRow.className = "job-card__meta";

  const liPosted = document.createElement("li");
  liPosted.textContent = postedAt;
  metaRow.appendChild(liPosted);

  const liContract = document.createElement("li");
  liContract.className = "job-card__meta-dot";
  liContract.textContent = contract;
  metaRow.appendChild(liContract);

  const liLocation = document.createElement("li");
  liLocation.className = "job-card__meta-dot";
  liLocation.textContent = location;
  metaRow.appendChild(liLocation);

  main.appendChild(companyRow);
  main.appendChild(positionEl);
  main.appendChild(metaRow);

  top.appendChild(logoWrapper);
  top.appendChild(main);

  card.appendChild(top);

  // RIGHT SIDE (tags)
  const tagsRow = document.createElement("div");
  tagsRow.className = "job-card__tags";

  tags.forEach((tag) => {
    const tagBtn = document.createElement("button");
    tagBtn.className = "tag-pill";
    tagBtn.textContent = tag;
    tagBtn.addEventListener("click", () => {
      activeFilters.add(tag);
      render();
    });
    tagsRow.appendChild(tagBtn);
  });

  card.appendChild(tagsRow);

  return card;
}

// Every selectable tag that should appear on the right side
function collectJobTags(job) {
  // role, level, languages[], tools[]
  const arr = [job.role, job.level, ...(job.languages || []), ...(job.tools || [])];
  // We keep them as-is (Frontend, Junior, React...) to match the screenshot
  return arr;
}
