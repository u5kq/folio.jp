/* folio. Official — homepage interaction polish */
(() => {
  "use strict";

  const search = document.querySelector("#home-project-search");
  const count = document.querySelector("#home-project-count");
  const filterButtons = [...document.querySelectorAll("[data-home-filter]")];
  const grid = document.querySelector(".project-grid");
  if (!grid || !count || !filterButtons.length) return;

  const cards = [...grid.querySelectorAll(".project-card")];
  const normalize = value => String(value || "")
    .toLocaleLowerCase("ja")
    .normalize("NFKC")
    .replace(/[・._-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  let activeFilter = "all";
  let empty = grid.querySelector(".home-project-empty");
  if (!empty) {
    empty = document.createElement("p");
    empty.className = "home-project-empty";
    empty.setAttribute("role", "status");
    empty.textContent = "該当するプロジェクトがありません。検索語やカテゴリーを変更してください。";
    empty.hidden = true;
    grid.insertAdjacentElement("afterend", empty);
  }

  const apply = () => {
    const query = normalize(search?.value || "");
    let visible = 0;

    cards.forEach(card => {
      const category = normalize(card.querySelector(".project-no")?.textContent.split("/").pop());
      const content = normalize(card.textContent);
      const categoryMatch = activeFilter === "all" || category.includes(normalize(activeFilter));
      const queryMatch = !query || content.includes(query);
      const show = categoryMatch && queryMatch;
      card.hidden = !show;
      if (show) visible += 1;
    });

    count.textContent = String(visible).padStart(2, "0") + " / " +
      String(cards.length).padStart(2, "0") + " PROJECTS";
    empty.hidden = visible !== 0;
  };

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.homeFilter || "all";
      filterButtons.forEach(item => {
        item.setAttribute("aria-pressed", String(item === button));
      });
      apply();
    });
  });

  search?.addEventListener("input", apply);
  search?.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      search.value = "";
      apply();
      search.blur();
    }
  });

  apply();
})();
