import { SELECTORS } from "./constants/selectors.js";
import { renderJobs } from "./renderJobs.js";
import { createElement } from "./utils/createElement.js";
import { fetchData } from "./utils/fetchData.js";

let clickItemList = [];
let allJobsData = [];

const renderFilterItem = () => {
    SELECTORS.filterItemContainer.innerHTML = "";

    if (clickItemList.length === 0) {
        SELECTORS.filterItemContainer.classList.add("empty");
        renderJobCards(allJobsData); 
        return;
    }

    SELECTORS.filterItemContainer.classList.remove("empty");

    clickItemList.forEach((item, index) => {
        const filterItemContent = `
           <p>${item}</p>
           <div class="remove-icon-container">
              <img src="/images/icon-remove.svg" />
           </div>
        `;

        const filterItem = createElement("div", "filter-item", filterItemContent);
        SELECTORS.filterItemContainer.appendChild(filterItem);

        
        filterItem.querySelector(".remove-icon-container").addEventListener("click", () => {
            clickItemList.splice(index, 1);
            renderFilterItem();
        });
    });

    // ✅ Re-render jobs based on filters
    const filtered = allJobsData.filter(job => {
        // Get all tags (role + level + languages + tools)
        const tags = [job.role, job.level, ...job.languages, ...job.tools];
        // Check if all filter items are included
        return clickItemList.every(filter => tags.includes(filter));
    });

    renderJobCards(filtered);
};

// 🧠 Renders job cards to UI
const renderJobCards = (jobs) => {
    SELECTORS.jobListContainer.innerHTML = "";
    jobs.forEach(jobData => renderJobs(jobData, clickItemList, renderFilterItem));
};

// 🌐 Step 1: Fetch data
const data = await fetchData("/API/data.json");
allJobsData = data;


renderJobCards(allJobsData);
renderFilterItem();
