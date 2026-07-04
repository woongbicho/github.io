const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      nav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

const filterButtons = document.querySelectorAll("[data-filter]");
const publicationList = document.querySelector("[data-publication-list]");
const publications = Array.from(document.querySelectorAll("[data-publication-list] .publication"));
const publicationSearch = document.querySelector("[data-publication-search]");
let activePublicationFilter = "all";

publications
  .map((publication, index) => {
    const year = Number.parseInt(publication.querySelector(".pub-year")?.textContent || "0", 10);
    const type = publication.dataset.type || "article";
    const isHighlighted = type === "article" && publication.classList.contains("featured");

    publication.dataset.year = String(year);
    publication.dataset.originalIndex = String(index);
    publication.dataset.highlight = String(isHighlighted);
    publication.classList.toggle("highlighted-paper", isHighlighted);

    return { publication, year, index };
  })
  .sort((a, b) => b.year - a.year || a.index - b.index)
  .forEach(({ publication }, index) => {
    const yearElement = publication.querySelector(".pub-year");
    const year = publication.dataset.year || yearElement?.textContent.trim() || "";

    if (yearElement) {
      yearElement.innerHTML = `<span class="pub-rank">#${index + 1}</span><span>${year}</span>`;
    }

    publicationList?.appendChild(publication);
  });

function applyPublicationFilters() {
  const query = publicationSearch?.value.trim().toLowerCase() || "";

  publications.forEach((publication) => {
    const type = publication.dataset.type || "article";
    const matchesType =
      activePublicationFilter === "all" ||
      (activePublicationFilter === "highlighted" && publication.dataset.highlight === "true") ||
      type === activePublicationFilter;
    const matchesSearch = !query || publication.textContent.toLowerCase().includes(query);
    publication.hidden = !matchesType || !matchesSearch;
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activePublicationFilter = button.dataset.filter || "all";

    filterButtons.forEach((item) => {
      item.classList.toggle("active", item === button);
    });

    applyPublicationFilters();
  });
});

publicationSearch?.addEventListener("input", applyPublicationFilters);
