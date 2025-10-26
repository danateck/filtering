import { createElement } from "./utils/createElement.js"
import { SELECTORS } from "./constants/selectors.js"
import { meregedArr } from "./utils/helper.js";


export const renderJobs = (jobData, clickItemList, renderFilterItem) => {
    let jobListingCardContent = `
            <div class="job-listing-card__details">
                <div class="company-logo">
                    <img src="${jobData.logo.replace(".", "")}" alt="${jobData.company}">
                </div>
                <div class="company-details">
                    <p class="company-name">
                        <span class="name text-primary-green">${jobData.company}</span>
                        ${(jobData.new)
            ? '<span class="new bg-primary-green">New</span>'
            : ""
        }

                       ${(jobData.featured)
            ? `<span class="featured bg-green-900">Featured</span>`
            : ""
        }
                    </p>
                    <h1 class="position text-green-900">${jobData.position}</h1>
                    <ul>
                        <li class="postedAt">${jobData.postedAt}</li>
                        <li class="contract">${jobData.contract}</li>
                        <li class="location">${jobData.location}</li>
                    </ul>
                </div>
            </div>
            <hr>
            <div class="job-listing-card__filter">

            </div>
   `;

    const jobListingCard = createElement("div", "job-listing-card", jobListingCardContent);
    SELECTORS.jobListContainer.appendChild(jobListingCard);

    //skills container
    const skillsContainer = createElement("div", "filter-list-container");
    jobListingCard.appendChild(skillsContainer);

    // merge skills
    const jobSkillsList = meregedArr(jobData.languages, jobData.tools, jobData.level);

    // create skill paragraphs
    jobSkillsList.forEach((jobSkill) => {
        const jobListingSkill = createElement("p", "skills", jobSkill);
        skillsContainer.appendChild(jobListingSkill);
    });

    skillsContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("skills")) {
            const clickSkills = e.target.textContent;
           clickItemList.push(clickSkills);
           renderFilterItem();
           console.log(clickItemList)
        }
    });

    return jobListingCard;
}