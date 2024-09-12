const accordionBtns = document.querySelectorAll(".item-header");
const cards = document.querySelectorAll(".card");
const resultsSearchTerm = document.getElementById("resultsSearchTerm");

accordionBtns.forEach((accordion) => {
  accordion.onclick = function () {
    this.classList.toggle("active");
    let content = this.nextElementSibling;
    //  console.log(content);

    if (content.style.maxHeight) {
      //this is if the accordion is open
      content.style.maxHeight = null;
      content.style.visibility = "hidden";
      this.setAttribute("aria-expanded", "false");
    } else {
      //if the accordion is currently closed
      content.style.maxHeight = content.scrollHeight + "px";
      content.style.visibility = "visible";
      this.setAttribute("aria-expanded", "true");
    }
  };
});

function mySearch() {
  const input = document.getElementById("cardSearch").value.toUpperCase();
  const cardContainer = document.getElementById("cards");
  const cards = document.querySelectorAll(".card");

  [...cards].map((card) => {
    const noResults = document.getElementById("no-results");
    const title = card
      .querySelector("div.card-content")
      .innerText.toUpperCase();
    title.includes(input)
      ? card.classList.remove("display-none")
      : card.classList.add("display-none");
    checkDisplay(input);
  });

  function checkDisplay(input) {
    const noResults = document.getElementById("no-results");
    const result = [...cards].filter((card) =>
      card.classList.contains("display-none")
    );
    if (cards.length === result.length) {
      resultsSearchTerm.innerHTML = `<p style="font-size: 1.5rem; margin-bottom: .5rem; font-weight: 600">Hmmm...</p>
      <p style="font-size: 1.2rem">We couldn't find any matches for "<span class="highlight">${input.toLowerCase()}</span>".</p>`;
      noResults.classList.remove("display-none");
    } else {
      noResults.classList.add("display-none");
    }
  }
}

const forms = document.getElementById("forms");
const integration = document.getElementById("integration");
const photography = document.getElementById("photography");
const socialMedia = document.getElementById("socialMedia");
const websites = document.getElementById("websites");
const advertising = document.getElementById("advertising");
const design = document.getElementById("design");

function clickFilter(url) {
  switch (url) {
    case "#forms":
      forms.click();
      return `${url}`;
    case "#integratons":
      integrations.click();
      return `${url}`;
    case "#photography":
      photography.click();
      return `${url}`;
    case "#socialMedia":
      socialMedia.click();
      return `${url}`;
    case "#Websites":
      websites.click();
      return `${url}`;
    case "#advertising":
      advertising.click();
      return `${url}`;
    case "#design":
      design.click();
      return `${url}`;
  }
  
}

window.onload = clickFilter(window.location.hash);