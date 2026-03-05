// Small progressive enhancement: animate the "Projects delivered" number.
(function () {
  const el = document.querySelector('[data-count]');
  if (!el) return;

  const target = Number(el.getAttribute('data-count'));
  if (!Number.isFinite(target)) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    el.textContent = `${target}+`;
    return;
  }

  let started = false;
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting && !started) {
        started = true;
        let n = 0;
        const steps = 40;
        const inc = Math.max(1, Math.floor(target / steps));
        const t = setInterval(() => {
          n += inc;
          if (n >= target) {
            n = target;
            clearInterval(t);
          }
          el.textContent = `${n}+`;
        }, 20);
      }
    }
  }, { threshold: 0.4 });

  io.observe(el);
})();
document.querySelectorAll(".toggleBtn").forEach(btn => {

  btn.addEventListener("click", function () {

    const content = this.closest(".card").querySelector(".toggleContent");

    content.classList.toggle("active");

    this.textContent =
      content.classList.contains("active")
        ? "View less"
        : "View more";

  });

});

document.querySelectorAll('.recordMedia').forEach(media => {

  const slides = media.querySelectorAll('.slide');
  const leftBtn = media.querySelector('.left');
  const rightBtn = media.querySelector('.right');
  const counter = media.querySelector('.slideCounter');

  let current = 0;

  function updateSlider(){
    slides.forEach((slide,i)=>{
      slide.classList.toggle("active", i === current);
    });

    if(counter){
      counter.textContent = `${current+1}/${slides.length}`;
    }
  }

  rightBtn.addEventListener("click", ()=>{
    current = (current + 1) % slides.length;
    updateSlider();
  });

  leftBtn.addEventListener("click", ()=>{
    current = (current - 1 + slides.length) % slides.length;
    updateSlider();
  });

  updateSlider(); // IMPORTANT: initialize slider
});

const searchInput = document.getElementById("searchInput");
const ministryFilter = document.getElementById("ministryFilter");
const yearFilter = document.getElementById("yearFilter");
const cards = Array.from(document.querySelectorAll(".projectCard"));
const noResults = document.getElementById("noResults");

function filterProjects() {
  const searchTerm = searchInput.value.toLowerCase();

  let ministry = ministryFilter.value;
  let year = yearFilter.value;

  // If user picked Clear All, reset dropdown back to placeholder and clear filter value
  if (ministry === "clear") {
    ministryFilter.selectedIndex = 0;
    ministry = "";
  }
  if (year === "clear") {
    yearFilter.selectedIndex = 0;
    year = "";
  }

  let matchCount = 0;

  cards.forEach(card => {

  const text = card.innerText.toLowerCase();
  const cardMinistry = card.dataset.ministry;
  const cardYear = card.dataset.year;

  const matchesSearch = text.includes(searchTerm);
  const matchesMinistry = !ministry || cardMinistry === ministry;
  const matchesYear = !year || cardYear === year;

  const isMatch = matchesSearch && matchesMinistry && matchesYear;

  card.dataset.match = isMatch ? "1" : "0";
  matchCount += isMatch ? 1 : 0;

});

  if (noResults) {
    noResults.style.display = matchCount === 0 ? "block" : "none";
  }

  showPage(1); // reset to page 1 after every filter/search
}

function showPage(page) {
  const matchedCards = cards.filter(c => c.dataset.match !== "0");
  const totalPages = Math.max(1, Math.ceil(matchedCards.length / cardsPerPage));

  if (page < 1) page = 1;
  if (page > totalPages) page = totalPages;

  currentPage = page;

  // Hide everything first
  cards.forEach(card => (card.style.display = "none"));

  // Show only the matched cards for this page
  const start = (page - 1) * cardsPerPage;
  const end = start + cardsPerPage;

  matchedCards.forEach((card, index) => {
    if (index >= start && index < end) {
      card.style.display = "flex";
    }
  });

  renderPagination(totalPages);
}

const pagination = document.getElementById("pagination");
const cardsPerPage = 3;
let currentPage = 1;

function renderPagination(totalPages){

  pagination.innerHTML = "";

  const prev = document.createElement("button");
  prev.innerHTML = "<";
  prev.className = "page-nav";
  prev.onclick = () => showPage(currentPage - 1);
  pagination.appendChild(prev);

  for(let i = 1; i <= totalPages; i++){

    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = "page-btn";

    if(i === currentPage){
      btn.classList.add("active");
    }

    btn.onclick = () => showPage(i);

    pagination.appendChild(btn);
  }

  const next = document.createElement("button");
  next.innerHTML = ">";
  next.className = "page-nav";
  next.onclick = () => showPage(currentPage + 1);
  pagination.appendChild(next);
}
searchInput.addEventListener("keyup", filterProjects);

ministryFilter.addEventListener("change", function(){

  if(this.value === "clear"){
    this.selectedIndex = 0;
    filterProjects();
    return;
  }

  filterProjects();
});

yearFilter.addEventListener("change", function(){

  if(this.value === "clear"){
    this.selectedIndex = 0;
    filterProjects();
    return;
  }

  filterProjects();
});
 filterProjects();

 const viewer = document.getElementById("imageViewer");
const viewerImg = document.getElementById("viewerImg");
const viewerCounter = document.getElementById("viewerCounter");

const viewerClose = document.querySelector(".viewerClose");
const viewerPrev = document.querySelector(".viewerPrev");
const viewerNext = document.querySelector(".viewerNext");

let images = [];
let index = 0;

function updateViewer(){
  viewerImg.src = images[index];
  viewerCounter.textContent = `${index+1} / ${images.length}`;
}

document.querySelectorAll(".viewImage").forEach(btn => {

  btn.addEventListener("click", function(e){

    e.preventDefault();

    const card = btn.closest(".projectCard");
    const slides = card.querySelectorAll(".slide");

    images = Array.from(slides).map(img => img.src);

    index = 0;

    updateViewer();

    viewer.style.display = "flex";

  });

});

viewerNext.onclick = () => {
  index = (index + 1) % images.length;
  updateViewer();
};

viewerPrev.onclick = () => {
  index = (index - 1 + images.length) % images.length;
  updateViewer();
};

viewerClose.onclick = () => {
  viewer.style.display = "none";
};

viewer.onclick = (e)=>{
  if(e.target === viewer){
    viewer.style.display = "none";
  }
};

document.addEventListener("keydown", (e)=>{

  if(viewer.style.display !== "flex") return;

  if(e.key === "Escape"){
    viewer.style.display = "none";
  }

  if(e.key === "ArrowRight"){
    viewerNext.click();
  }

  if(e.key === "ArrowLeft"){
    viewerPrev.click();
  }

});
