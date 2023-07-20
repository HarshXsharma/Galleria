const apikey = "wDJ413q2UifPEt2bDzLMXGXSkt83T0hIiUkR8VMXAx8oEzICQAbnpiva";
const loadMoreBtn = document.querySelector(".load");
const searchInput = document.querySelector(".search-box input");
const imagewrapper = document.querySelector(".images");
const modal = document.querySelector( ".modal" );
const overlay = document.querySelector( ".overlay" );
const closeBtn = document.querySelector( ".fa-x" );
const downloadImgBtn = document.querySelector( ".fa-download" );

let currentPage = 19;
let searchTerm = null;
let apiUrl = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=20`;

const removeOverlay = () => {
    modal.classList.remove("show");
    overlay.classList.remove("show");
    document.body.style.overflow = "auto";

}

const downloadImg = (url) => {
  fetch(url)
    .then((res) => res.blob())
    .then((file) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(file);
      a.download = new Date().getTime();
      a.click();
    })
    .catch(() => alert("Failed to Download Image"));
};

const showModal = ( name, img ) => {
    modal.querySelector( "img" ).src = img;
    modal.querySelector( "span" ).innerText = name;
    downloadImgBtn.setAttribute( "data-img", img );
    modal.classList.add("show");
    overlay.classList.add("show");
    document.body.style.overflow = "hidden";
}

const generateHtml = (images) => {
  imagewrapper.innerHTML += images
    .map(
      (img) =>
        `<li class="card" onclick="showModal( '${img.photographer}', '${img.src.large}' )" >
            <img src="${img.src.large}" alt="img" />
            <div class="details">
                <div class="photographer">
                    <i class="fa-solid fa-camera"></i>
                    <span>${img.photographer}</span>
                </div>
                <button class = "download" onclick = "downloadImg('${img.src.large}'); event.stopPropagation();">
                    <i class="fa-solid fa-download"></i>
                </button>
            </div>
        </li>`
    )
    .join("");
};

async function curatephotos(apiUrl) {
  loadMoreBtn.innerText = "Loading...";
  loadMoreBtn.classList.add("disabled");
  const dataFetch = await fetch(apiUrl, {
    method: "GET",
    headers: { authorization: apikey, Accept: "application/json" },
  }).catch(() => alert("Failed to load images"));

  const data = await dataFetch.json();
  console.log(data);
  generateHtml(data.photos);
  loadMoreBtn.innerText = "Load More";
  loadMoreBtn.classList.remove("disabled");
}

function loadMoreImages() {
  currentPage++;
  let url = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=20`;
  url = searchTerm
    ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=20`
    : url;
  curatephotos(url);
}

function loadSearchImages(e) {
  if (e.target.value == "") return (searchTerm = null);

  if (e.key === "Enter") {
    currentPage = 1;
    searchTerm = e.target.value;
    imagewrapper.innerHTML = "";
    curatephotos(
      `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=20`
    );
  }
}

curatephotos(apiUrl);
closeBtn.addEventListener("click", removeOverlay);
downloadImgBtn.addEventListener("click", (e) => downloadImg( e.target.dataset.img ));
loadMoreBtn.addEventListener("click", loadMoreImages);
searchInput.addEventListener("keyup", loadSearchImages);
