/* ============================================================
   Pathology Connections — gameplay
   Pure browser JS. Loads puzzles.json, runs one puzzle at a time.
   No build step, no server logic — works as static files on GitHub Pages.
   ============================================================ */

(function () {
  "use strict";

  var MAX_MISTAKES = 4;
  var TIER_EMOJI = { 1: "🟨", 2: "🟩", 3: "🟦", 4: "🟫" }; // 🟨🟩🟦🟫
  var STORE_KEY = "pathconn_v1";

  // ---- element refs ----
  var $ = function (id) { return document.getElementById(id); };
  var el = {
    title: $("puzzleTitle"), sub: $("puzzleSub"),
    loading: $("loading"), error: $("error"), game: $("game"),
    solved: $("solved"), grid: $("grid"), dots: $("dots"),
    controls: $("controls"), finished: $("finishedControls"),
    takeaways: $("takeawaysBtn"), finishedArchive: $("finishedArchiveBtn"),
    shuffle: $("shuffleBtn"), deselect: $("deselectBtn"), submit: $("submitBtn"),
    toast: $("toast"),
    reviewOverlay: $("reviewOverlay"), reviewClose: $("reviewClose"),
    resultLine: $("resultLine"), resultSquares: $("resultSquares"), resultCap: $("resultCap"),
    reviewGroups: $("reviewGroups"), share: $("shareBtn"), reviewArchive: $("reviewArchiveBtn"),
    archiveOverlay: $("archiveOverlay"), archiveBtn: $("archiveBtn"),
    archiveCloseBtn: $("archiveCloseBtn"), archiveList: $("archiveList"),
    howOverlay: $("howOverlay"), howBtn: $("howBtn"), howCloseBtn: $("howCloseBtn"),
    lightbox: $("lightbox"), lbClose: $("lbClose"), lbImg: $("lbImg"), lbCap: $("lbCap")
  };

  // ---- state ----
  var allPuzzles = [];   // sorted newest-first
  var puzzle = null;     // active puzzle
  var tiles = [];        // {id, text, image, alt, group}
  var order = [];        // tile ids still on the board, in display order
  var selected = [];     // tile ids currently selected
  var solvedOrder = [];  // group indices solved, in order
  var guessRows = [];    // each: array of 4 tier numbers
  var remaining = MAX_MISTAKES;
  var over = false;
  var gameWon = false;
  var busy = false;

  // ============================================================
  // load
  // ============================================================
  fetch("puzzles.json", { cache: "no-store" })
    .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
    .then(function (data) {
      allPuzzles = (data.puzzles || []).slice().sort(function (a, b) {
        return (b.date || "").localeCompare(a.date || "");
      });
      if (!allPuzzles.length) throw new Error("No puzzles found.");
      startPuzzle(allPuzzles[0], true);
      maybeFirstVisit();
    })
    .catch(function (err) {
      el.loading.style.display = "none";
      el.error.style.display = "block";
      el.error.textContent = "Could not load the puzzle (" + err.message +
        "). If you opened the file directly, it needs to be served over the web. That's how GitHub Pages runs it.";
    });

  // ============================================================
  // start / reset a puzzle
  // ============================================================
  function startPuzzle(p, resume) {
    puzzle = p;
    tiles = [];
    var id = 0;
    p.groups.forEach(function (g, gi) {
      g.tiles.forEach(function (t) {
        tiles.push({ id: id++, text: t.text || "", image: t.image || "", alt: t.alt || "", group: gi });
      });
    });
    order = tiles.map(function (t) { return t.id; });
    shuffleArray(order);
    selected = [];
    solvedOrder = [];
    guessRows = [];
    remaining = MAX_MISTAKES;
    over = false;
    gameWon = false;

    el.loading.style.display = "none";
    el.error.style.display = "none";
    el.game.style.display = "block";
    el.title.textContent = "Pathology Connections";
    el.sub.textContent = (p.title || "") + (p.author ? "  ·  " + p.author : "");
    el.solved.innerHTML = "";
    showPlayingControls();

    // Resume a saved in-progress (or finished) game for this puzzle.
    if (resume) {
      var saved = loadState();
      if (validSaved(saved)) {
        order = saved.order;
        selected = (saved.selected || []).filter(function (i) { return order.indexOf(i) >= 0; });
        solvedOrder = saved.solvedOrder || [];
        guessRows = saved.guessRows || [];
        remaining = typeof saved.remaining === "number" ? saved.remaining : MAX_MISTAKES;
        over = !!saved.over;
        gameWon = !!saved.won;
        solvedOrder.forEach(function (gi) { renderSolvedRow(gi, false); });
        renderDots();
        renderGrid();
        if (over) {
          showFinishedControls();
        } else {
          updateControls();
          if (solvedOrder.length || guessRows.length) toast("Picking up where you left off.");
        }
        return;
      }
    } else {
      clearState();
    }

    renderDots();
    renderGrid();
    updateControls();

    var done = getStore().done || {};
    if (done[p.date]) {
      toast("You've played this one. Here's a fresh board.");
    }
  }

  // ============================================================
  // rendering
  // ============================================================
  function tileById(id) { for (var i = 0; i < tiles.length; i++) if (tiles[i].id === id) return tiles[i]; return null; }
  function groupOf(id) { return puzzle.groups[tileById(id).group]; }

  function renderGrid() {
    el.grid.innerHTML = "";
    order.forEach(function (id) {
      var t = tileById(id);
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "tile" + (t.image ? " has-image" : "") + (selected.indexOf(id) >= 0 ? " selected" : "");
      btn.setAttribute("data-id", id);

      if (t.image) {
        var img = document.createElement("img");
        img.className = "tile-img";
        img.src = t.image; img.alt = t.alt || t.text || "";
        btn.appendChild(img);
        if (t.text) {
          var cap = document.createElement("span");
          cap.className = "tile-caption";
          cap.textContent = t.text;
          btn.appendChild(cap);
        }
        var zoom = document.createElement("button");
        zoom.type = "button";
        zoom.className = "zoom-btn";
        zoom.setAttribute("aria-label", "Enlarge image");
        zoom.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="21" y2="21"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>';
        zoom.addEventListener("click", function (e) {
          e.stopPropagation();
          openLightbox(t.image, t.alt || t.text || "");
        });
        btn.appendChild(zoom);
      } else {
        btn.appendChild(document.createTextNode(t.text));
      }

      btn.addEventListener("click", function () { onTileClick(id, btn); });
      el.grid.appendChild(btn);
    });
  }

  function renderSolvedRow(gi, animate) {
    var g = puzzle.groups[gi];
    var row = document.createElement("div");
    row.className = "solved-row t" + g.tier;
    if (!animate) row.style.animation = "none";
    var members = g.tiles.map(function (t) { return t.text || (t.alt || "image"); }).join("  ·  ");
    row.innerHTML =
      '<div class="cat"><span class="dot"></span>' + escapeHtml(g.name) + '</div>' +
      '<div class="members">' + escapeHtml(members) + '</div>';
    el.solved.appendChild(row);
  }

  function renderDots() {
    el.dots.innerHTML = "";
    for (var i = 0; i < MAX_MISTAKES; i++) {
      var d = document.createElement("span");
      d.className = "dot" + (i >= remaining ? " spent" : "");
      el.dots.appendChild(d);
    }
  }

  function updateControls() {
    el.submit.disabled = selected.length !== 4 || over;
    el.deselect.disabled = selected.length === 0 || over;
    el.shuffle.disabled = over;
  }

  // ============================================================
  // interaction
  // ============================================================
  function onTileClick(id, btn) {
    if (over || busy) return;
    var idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
      btn.classList.remove("selected");
    } else {
      if (selected.length >= 4) return;
      selected.push(id);
      btn.classList.add("selected");
      btn.classList.add("pop");
      setTimeout(function () { btn.classList.remove("pop"); }, 240);
    }
    updateControls();
    // Accelerator: once four are picked, move focus to Submit so Enter fires it.
    if (selected.length === 4) el.submit.focus();
    saveState();
  }

  el.shuffle.addEventListener("click", function () {
    if (over) return;
    shuffleArray(order);
    renderGrid();
    saveState();
  });

  el.deselect.addEventListener("click", function () {
    selected = [];
    renderGrid();
    updateControls();
    saveState();
  });

  el.submit.addEventListener("click", function () {
    if (selected.length !== 4 || over || busy) return;
    submitGuess();
  });

  function submitGuess() {
    var picks = selected.slice();
    var groups = picks.map(function (id) { return tileById(id).group; });
    var tiersRow = picks.map(function (id) { return groupOf(id).tier; });
    guessRows.push(tiersRow);

    // count per group
    var counts = {};
    groups.forEach(function (g) { counts[g] = (counts[g] || 0) + 1; });
    var maxCount = Math.max.apply(null, Object.keys(counts).map(function (k) { return counts[k]; }));

    if (maxCount === 4) {
      solveGroup(groups[0]);
    } else {
      remaining--;
      renderDots();
      shakeSelected();
      toast(maxCount === 3 ? "One away…" : "Not a group. Try again.");
      if (remaining <= 0) {
        setTimeout(loseGame, 650);
      }
      updateControls();
      saveState();
    }
  }

  function solveGroup(gi) {
    busy = true;
    var picks = selected.slice();
    // pop animation
    picks.forEach(function (id) {
      var b = el.grid.querySelector('.tile[data-id="' + id + '"]');
      if (b) b.classList.add("pop");
    });
    setTimeout(function () {
      solvedOrder.push(gi);
      order = order.filter(function (id) { return picks.indexOf(id) < 0; });
      selected = [];
      renderSolvedRow(gi, true);
      renderGrid();
      busy = false;
      updateControls();
      saveState();
      if (solvedOrder.length === 4) {
        setTimeout(function () { winGame(); }, 350);
      }
    }, 280);
  }

  function shakeSelected() {
    selected.forEach(function (id) {
      var b = el.grid.querySelector('.tile[data-id="' + id + '"]');
      if (b) { b.classList.add("shake"); setTimeout(function () { b.classList.remove("shake"); }, 400); }
    });
  }

  // ============================================================
  // end states
  // ============================================================
  function winGame() {
    over = true;
    gameWon = true;
    persistResult(true);
    saveState();
    showFinishedControls();
    showReview(true);
  }

  function loseGame() {
    over = true;
    gameWon = false;
    // reveal remaining groups in tier order
    var remainingGroups = [];
    for (var gi = 0; gi < puzzle.groups.length; gi++) {
      if (solvedOrder.indexOf(gi) < 0) remainingGroups.push(gi);
    }
    remainingGroups.sort(function (a, b) { return puzzle.groups[a].tier - puzzle.groups[b].tier; });
    var i = 0;
    (function revealNext() {
      if (i >= remainingGroups.length) {
        persistResult(false);
        saveState();
        showFinishedControls();
        setTimeout(function () { showReview(false); }, 450);
        return;
      }
      var gi = remainingGroups[i++];
      solvedOrder.push(gi);
      var picks = tiles.filter(function (t) { return t.group === gi; }).map(function (t) { return t.id; });
      order = order.filter(function (id) { return picks.indexOf(id) < 0; });
      renderSolvedRow(gi, true);
      renderGrid();
      setTimeout(revealNext, 420);
    })();
    selected = [];
    updateControls();
  }

  // ============================================================
  // review screen
  // ============================================================
  function showReview(won, opts) {
    opts = opts || {};
    var mistakes = MAX_MISTAKES - remaining;
    el.resultLine.textContent = opts.archiveView
      ? "Takeaways for this puzzle."
      : (won
          ? (mistakes === 0 ? "Perfect. Solved with no mistakes." : "Solved with " + mistakes + " mistake" + (mistakes === 1 ? "" : "s") + ".")
          : "Out of guesses. Here's the full breakdown.");

    // on-screen squares (styled blocks, not emoji)
    el.resultSquares.innerHTML = "";
    if (!opts.archiveView && guessRows.length) {
      el.resultSquares.innerHTML = guessRows.map(function (row) {
        return row.map(function (tier) {
          return '<span style="color:' + tierColor(tier) + '">█</span>';
        }).join("");
      }).join("\n");
    }
    el.resultCap.style.display = (!opts.archiveView && guessRows.length) ? "block" : "none";

    // group cards in tier order
    var giOrder = puzzle.groups.map(function (_, i) { return i; })
      .sort(function (a, b) { return puzzle.groups[a].tier - puzzle.groups[b].tier; });
    el.reviewGroups.innerHTML = "";
    giOrder.forEach(function (gi) {
      var g = puzzle.groups[gi];
      var card = document.createElement("div");
      card.className = "review-group t" + g.tier;
      var thumbs = g.tiles.filter(function (t) { return t.image; });
      var thumbHtml = "";
      if (thumbs.length) {
        thumbHtml = '<div class="review-thumbs">' + thumbs.map(function (t) {
          return '<img src="' + encodeURI(t.image) + '" alt="' + escapeAttr(t.alt || t.text || "") +
                 '" data-img="' + escapeAttr(t.image) + '" data-cap="' + escapeAttr(t.alt || t.text || "") + '">';
        }).join("") + '</div>';
      }
      var members = g.tiles.map(function (t) { return t.text || (t.alt || "image"); }).join("  ·  ");
      card.innerHTML =
        '<div class="cat"><span class="dot"></span>' + escapeHtml(g.name) + '</div>' +
        '<div class="terms">' + escapeHtml(members) + '</div>' +
        thumbHtml +
        (g.explanation ? '<div class="why">' + escapeHtml(g.explanation) + '</div>' : '');
      el.reviewGroups.appendChild(card);
    });

    // thumbnail zoom
    Array.prototype.forEach.call(el.reviewGroups.querySelectorAll("img[data-img]"), function (img) {
      img.addEventListener("click", function () { openLightbox(img.getAttribute("data-img"), img.getAttribute("data-cap")); });
    });

    openOverlay(el.reviewOverlay);
  }

  // ============================================================
  // share
  // ============================================================
  el.share.addEventListener("click", function () {
    var lines = [];
    lines.push("Pathology Connections: " + (puzzle.title || ""));
    var mistakes = MAX_MISTAKES - remaining;
    lines.push(solvedOrder.length === 4 && remaining > 0
      ? (mistakes === 0 ? "Solved, no mistakes" : "Solved, " + mistakes + " mistake" + (mistakes === 1 ? "" : "s"))
      : "Did not solve");
    guessRows.forEach(function (row) {
      lines.push(row.map(function (t) { return TIER_EMOJI[t]; }).join(""));
    });
    lines.push(stripHash(location.href));
    copyText(lines.join("\n"));
  });

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { toast("Result copied."); },
        function () { fallbackCopy(text); });
    } else { fallbackCopy(text); }
  }
  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); toast("Result copied."); }
    catch (e) { toast("Copy failed. Select and copy manually."); }
    document.body.removeChild(ta);
  }

  // ============================================================
  // archive
  // ============================================================
  function openArchive() {
    el.archiveList.innerHTML = "";
    allPuzzles.forEach(function (p, idx) {
      var item = document.createElement("div");
      item.className = "archive-item";
      item.innerHTML =
        '<div class="meta"><div class="a-title">' + escapeHtml(p.title || p.date) +
          (idx === 0 ? '<span class="badge">This week</span>' : '') + '</div>' +
        '<div class="a-date">' + escapeHtml(p.date || "") + '</div></div>' +
        '<div class="a-actions">' +
          '<button class="btn" data-act="play">Play</button>' +
          '<button class="btn" data-act="takeaways">Takeaways</button>' +
        '</div>';
      item.querySelector('[data-act="play"]').addEventListener("click", function () {
        closeOverlay(el.archiveOverlay);
        startPuzzle(p, false);
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
      item.querySelector('[data-act="takeaways"]').addEventListener("click", function () {
        closeOverlay(el.archiveOverlay);
        puzzle = p;
        showReview(true, { archiveView: true });
      });
      el.archiveList.appendChild(item);
    });
    openOverlay(el.archiveOverlay);
  }

  // ============================================================
  // lightbox
  // ============================================================
  function openLightbox(src, cap) {
    el.lbImg.src = src; el.lbImg.alt = cap || "";
    el.lbCap.textContent = cap || "";
    el.lightbox.classList.add("show");
  }
  var BLANK_PX = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
  function closeLightbox() { el.lightbox.classList.remove("show"); el.lbImg.src = BLANK_PX; }
  el.lbClose.addEventListener("click", closeLightbox);
  el.lightbox.addEventListener("click", function (e) { if (e.target === el.lightbox) closeLightbox(); });

  // ============================================================
  // overlays / wiring
  // ============================================================
  function openOverlay(o) { o.classList.add("show"); }
  function closeOverlay(o) { o.classList.remove("show"); }

  el.reviewClose.addEventListener("click", function () { closeOverlay(el.reviewOverlay); });
  el.reviewArchive.addEventListener("click", function () { closeOverlay(el.reviewOverlay); openArchive(); });
  el.takeaways.addEventListener("click", function () { showReview(gameWon); });
  el.finishedArchive.addEventListener("click", openArchive);
  el.archiveBtn.addEventListener("click", openArchive);
  el.archiveCloseBtn.addEventListener("click", function () { closeOverlay(el.archiveOverlay); });
  el.howBtn.addEventListener("click", function () { openOverlay(el.howOverlay); });
  el.howCloseBtn.addEventListener("click", function () { closeOverlay(el.howOverlay); });

  [el.reviewOverlay, el.archiveOverlay, el.howOverlay].forEach(function (o) {
    o.addEventListener("click", function (e) { if (e.target === o) closeOverlay(o); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeLightbox();
      [el.reviewOverlay, el.archiveOverlay, el.howOverlay].forEach(closeOverlay);
    }
  });

  // ============================================================
  // persistence (local only)
  // ============================================================
  function getStore() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }
    catch (e) { return {}; }
  }
  function persistResult(won) {
    try {
      var s = getStore();
      s.done = s.done || {};
      if (!s.done[puzzle.date]) {
        s.done[puzzle.date] = { won: won, mistakes: MAX_MISTAKES - remaining };
        s.streak = won ? (s.streak || 0) + 1 : 0;
      }
      localStorage.setItem(STORE_KEY, JSON.stringify(s));
    } catch (e) { /* private mode — ignore */ }
  }

  // Per-puzzle in-progress state, so a reload or interruption doesn't restart the board.
  function gameKey() { return STORE_KEY + "_game_" + (puzzle ? puzzle.date : ""); }
  function loadState() {
    try { return JSON.parse(localStorage.getItem(gameKey())); } catch (e) { return null; }
  }
  function saveState() {
    if (!puzzle) return;
    try {
      localStorage.setItem(gameKey(), JSON.stringify({
        order: order, selected: selected, solvedOrder: solvedOrder,
        guessRows: guessRows, remaining: remaining, over: over, won: gameWon
      }));
    } catch (e) { /* private mode — ignore */ }
  }
  function clearState() { try { localStorage.removeItem(gameKey()); } catch (e) {} }
  function validSaved(s) {
    if (!s || !Array.isArray(s.order)) return false;
    for (var i = 0; i < s.order.length; i++) {
      if (typeof s.order[i] !== "number" || s.order[i] < 0 || s.order[i] >= tiles.length) return false;
    }
    if (s.solvedOrder) {
      for (var j = 0; j < s.solvedOrder.length; j++) {
        if (s.solvedOrder[j] < 0 || s.solvedOrder[j] >= puzzle.groups.length) return false;
      }
    }
    return true;
  }

  function showPlayingControls() { el.controls.style.display = "flex"; el.finished.style.display = "none"; }
  function showFinishedControls() { el.controls.style.display = "none"; el.finished.style.display = "flex"; }

  // First-ever visit: open How-to once so Connections newcomers aren't lost.
  function maybeFirstVisit() {
    var s = getStore();
    var played = s.done && Object.keys(s.done).length;
    if (!s.seenHowto && !played) {
      openOverlay(el.howOverlay);
      try { s.seenHowto = true; localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch (e) {}
    }
  }

  // ============================================================
  // helpers
  // ============================================================
  function shuffleArray(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }
  function tierColor(t) {
    return ({ 1: "#b07d22", 2: "#2f7d5b", 3: "#1f5562", 4: "#b0432f" })[t] || "#565d68";
  }
  var toastTimer = null;
  function toast(msg) {
    el.toast.textContent = msg;
    el.toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.toast.classList.remove("show"); }, 1900);
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c];
    });
  }
  function escapeAttr(s) { return escapeHtml(s); }
  function stripHash(u) { return u.split("#")[0]; }
})();
