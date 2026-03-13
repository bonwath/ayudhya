document.addEventListener("DOMContentLoaded", () => {
  // Mobile hamburger (works on ALL pages)
  const mobileMenu = document.getElementById("mobileMenu");
const navMenu = document.querySelector(".nav");

if (mobileMenu && navMenu) {

  // open / close hamburger
  mobileMenu.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });

  // close menu when clicking a link
  navMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
    });
  });

}
document.querySelectorAll(".toggleBtn").forEach(btn => {

    btn.addEventListener("click", function(){

      const content = this.closest(".card").querySelector(".toggleContent");

      content.classList.toggle("active");

      this.textContent =
        content.classList.contains("active")
        ? "View less"
        : "View more";

    });
  });

  /* ===== MOBILE BACK TO TOP ===== */

const backTop = document.getElementById("backTop");

if(backTop){

  window.addEventListener("scroll", () => {

    if(window.innerWidth <= 768 && window.scrollY > 400){
      backTop.style.display = "flex";
    } else {
      backTop.style.display = "none";
    }

  });

  backTop.addEventListener("click", () => {
    window.scrollTo({
      top:0,
      behavior:"smooth"
    });
  });

}

// Stats counter animation
document.querySelectorAll('[data-count]').forEach(el => {
  const target = Number(el.getAttribute('data-count'));
  if (!Number.isFinite(target)) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasPlus = el.textContent.includes('+');

  if (prefersReduced) {
    el.textContent = hasPlus ? `${target}+` : `${target}`;
    return;
  }

  let started = false;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;

        let n = 0;
        const steps = 40;
        const inc = Math.max(1, Math.ceil(target / steps));

        const t = setInterval(() => {
          n += inc;

          if (n >= target) {
            n = target;
            clearInterval(t);
          }

          el.textContent = hasPlus ? `${n}+` : `${n}`;
        }, 20);
      }
    });
  }, { threshold: 0.4 });

  io.observe(el);
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

if(rightBtn){
  rightBtn.addEventListener("click", ()=>{
    current = (current + 1) % slides.length;
    updateSlider();
  });
}

if(leftBtn){
  leftBtn.addEventListener("click", ()=>{
    current = (current - 1 + slides.length) % slides.length;
    updateSlider();
  });
}

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

    /* restart animation */
    card.classList.remove("page-animate");
    void card.offsetWidth;

    card.classList.add("page-animate");
    card.style.animationDelay = `${(index - start) * 0.09}s`;

  }
});

  renderPagination(totalPages);

const endMessage = document.getElementById("endMessage");

if(endMessage){

  const searchActive = searchInput && searchInput.value.trim() !== "";
  const ministryActive = ministryFilter && ministryFilter.value !== "";
  const yearActive = yearFilter && yearFilter.value !== "";

  if(page === totalPages && !searchActive && !ministryActive && !yearActive){
    endMessage.style.display = "block";
  } else {
    endMessage.style.display = "none";
  }

}

}

const pagination = document.getElementById("pagination");
let cardsPerPage = window.innerWidth <= 768 ? 5 : 4;
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
if (searchInput) {
  searchInput.addEventListener("keyup", filterProjects);
}

if (ministryFilter) {
  ministryFilter.addEventListener("change", function(){

    if(this.value === "clear"){
      this.selectedIndex = 0;
      filterProjects();
      return;
    }

    filterProjects();
  });
}

if (yearFilter) {
  yearFilter.addEventListener("change", function(){

    if(this.value === "clear"){
      this.selectedIndex = 0;
      filterProjects();
      return;
    }

    filterProjects();
  });
}

if (searchInput || ministryFilter || yearFilter){
  filterProjects();
}

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

document.querySelectorAll(".recordMedia").forEach(media => {

  media.addEventListener("click", function(){

    const card = media.closest(".projectCard");
    const slides = card.querySelectorAll(".slide");

    images = Array.from(slides).map(img => img.src);

    index = 0;

    updateViewer();

    viewer.style.display = "flex";

  });

});

if(viewerNext){
  viewerNext.onclick = () => {
    index = (index + 1) % images.length;
    updateViewer();
  };
}

if(viewerPrev){
  viewerPrev.onclick = () => {
    index = (index - 1 + images.length) % images.length;
    updateViewer();
  };
}

if(viewerClose){
  viewerClose.onclick = () => {
    viewer.style.display = "none";
  };
}

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

});
