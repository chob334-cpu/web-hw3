const liked = JSON.parse(localStorage.getItem("liked") || "[]");

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
    const card = document.createElement("article");
    card.className = "card";
    card.setAttribute("data-type", m.type);
    card.setAttribute("data-title", m.title);
    const board = document.querySelector(".board");
    board.innerHTML = "";
    for (const m of list) {
        const card = document.createElement("article");
        card.className = "card";
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
    //updateLikeCount();
    if (list.length === 0) {
        board.classList.add("is-empty");
    } else {
        board.classList.remove("is-empty");
    }
}

renderCards(movies);