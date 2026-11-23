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
});