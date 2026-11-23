const liked = JSON.parse(localStorage.getItem("liked") || "[]");
function saveLiked() {
    localStorage.setItem("liked", JSON.stringify(liked));
}

function sortBy(list, key, desc) {
    const sign = desc ? -1 : 1;
    return [...list].sort((a, b) => {
        if (typeof a[key] === "string") {
            return a[key].localeCompare(b[key]) * sign;
        }
        return (a[key] - b[key]) * sign;
    });
}

function search(list, keyword) {
    const clean = keyword.trim().toLowerCase();
    return list.filter((m) => m.title.toLowerCase().includes(clean));
}

const posterUrl = (path, size) => {
    return "https://image.tmdb.org/t/p/" + size + path;
}

function renderCards(list) {
    const board = document.querySelector(".board");
    board.innerHTML = "";
    for (const m of list) {
        const card = document.createElement("article");
        card.className = "card";
        card.setAttribute("data-type", m.type);
        card.setAttribute("data-title", m.title);
        if (m.rating >= 8) {
            card.classList.add("hot");
        }
        const isLiked = liked.includes(m.title);
        let posterHtml = "";
        if (m.poster === null) {
            card.classList.add("no-poster");
            posterHtml = `<div class="poster-fallback">${m.title[0]}</div>`;
        } else {
            posterHtml = `<img class="poster" src="${posterUrl(m.poster, "w342")}" alt="${m.title} 포스터">`;
        }

        const rankHtml = m.type === "boxoffice" ? `<span class="rank">${m.rank}</span>` : "";

        card.innerHTML = `
    ${posterHtml}
    ${rankHtml}
    <span class="badge">${m.rating}</span>
    <div class="info">
        <h3>${m.title}</h3>
        <p class="year">${m.year}</p>
        <button class="like ${isLiked ? "liked" : ""}" type="button">♥</button>
    </div>`;
        board.appendChild(card);
    }
    document.getElementById("count").textContent = list.length + "편";
    document.getElementById("likeCount").textContent = liked.length; if (list.length === 0) {
        board.classList.add("is-empty");
    } else {
        board.classList.remove("is-empty");
    }
}

function getView() {
    const keyword = document.getElementById("q").value;
    const type = document.querySelector('input[name="type"]:checked').value;
    const key = document.getElementById("sort").value;

    let result = search(movies, keyword);
    if (type !== "all") {
        result = result.filter((m) => m.type === type);
    }
    return sortBy(result, key, key !== "title");
}

function refresh() {
    renderCards(getView());
}

document.getElementById("q").addEventListener("input", refresh);
document.getElementById("sort").addEventListener("change", refresh);
document.getElementById("typeFilter").addEventListener("change", refresh);
refresh();

document.querySelector(".board").addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (!card) return;
    const title = card.getAttribute("data-title");

    if (e.target.closest(".like")) {
        const i = liked.indexOf(title);
        if (i === -1) {
            liked.push(title);
        } else {
            liked.splice(i, 1);
        }
        saveLiked();
        refresh();
        return;
    }
    openDetail(title);
});

const dialog = document.getElementById("detail");

function openDetail(title) {
    const m = movies.find((item) => item.title === title);
    if (!m) return;

    const posterHtml = m.poster === null
        ? `<div class="poster-fallback">${m.title[0]}</div>`
        : `<img src="${posterUrl(m.poster, "w342")}" alt="${m.title} 포스터">`;

    const extraInfo = m.type === "boxoffice"
        ? `<p>박스오피스 ${m.rank}위 · 누적 관객 ${m.audience.toLocaleString()}명</p>`
        : "";

    document.getElementById("detailBody").innerHTML = `
        ${posterHtml}
        <div>
            <h2>${m.title} (${m.year})</h2>
            <p>개봉일: ${m.date} · 평점: ★ ${m.rating}</p>
            ${extraInfo}
            <p>${m.overview}</p>
        </div>
    `;
    dialog.showModal();
}

document.getElementById("closeDetail").addEventListener("click", () => {
    dialog.close();
});

// searchTMDB : 검색어 => TMDB 검색 결과 5건
async function searchTMDB(keyword) {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${KEYS.TMDB_KEY}&language=ko-KR&query=${encodeURIComponent(keyword)}`;
    const res = await fetch(url);
    const data = await res.json();

    return data.results.slice(0, 5).map((r) => ({
        title: r.title,
        year: r.release_date ? Number(r.release_date.slice(0, 4)) : 0,
        date: r.release_date || "",
        rating: Math.round(r.vote_average * 10) / 10,
        poster: r.poster_path,
        overview: r.overview || "줄거리 정보가 없습니다.",
        type: "tmdb",
        rank: null
    }));
}

document.getElementById("q").addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
        const keyword = e.target.value.trim();
        if (!keyword) return;
        const results = await searchTMDB(keyword);
        renderCards(results);
    }
});