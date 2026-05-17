(function () {
  "use strict";

  const STORAGE_KEY = "college_tracker_v2";
  const PROFILE_KEY = "student_profile_v2";

  // Admissions reference data keyed by lowercase college name.
  // 2026-27 cycle estimates: avgGpa (unweighted), satLow/satHigh (mid-50%),
  // acceptRate (%), enrollment (approx. undergraduate headcount).
  const ADMISSIONS_DATA = {
    "harvard university":                    { avgGpa: 3.97, satLow: 1500, satHigh: 1580, acceptRate: 3.5, enrollment: 7300 },
    "yale university":                       { avgGpa: 3.95, satLow: 1500, satHigh: 1560, acceptRate: 3.7, enrollment: 6800 },
    "brown university":                      { avgGpa: 3.94, satLow: 1500, satHigh: 1560, acceptRate: 5.0, enrollment: 7200 },
    "university of california, los angeles": { avgGpa: 3.92, satLow: 1350, satHigh: 1530, acceptRate: 9.0, enrollment: 33000 },
    "swarthmore college":                    { avgGpa: 3.90, satLow: 1450, satHigh: 1550, acceptRate: 7.0, enrollment: 1650 },
    "haverford college":                     { avgGpa: 3.90, satLow: 1410, satHigh: 1530, acceptRate: 14.0, enrollment: 1400 },
    "colgate university":                    { avgGpa: 3.80, satLow: 1380, satHigh: 1520, acceptRate: 12.0, enrollment: 3200 },
    "bowdoin college":                       { avgGpa: 3.91, satLow: 1440, satHigh: 1540, acceptRate: 9.0, enrollment: 1900 },
    "university of vermont":                 { avgGpa: 3.60, satLow: 1230, satHigh: 1410, acceptRate: 62.0, enrollment: 11800 },
    "dartmouth college":                     { avgGpa: 3.95, satLow: 1500, satHigh: 1580, acceptRate: 6.0, enrollment: 4600 },
    "barnard college":                       { avgGpa: 3.90, satLow: 1410, satHigh: 1530, acceptRate: 8.0, enrollment: 3500 },
    "new york university":                   { avgGpa: 3.70, satLow: 1450, satHigh: 1570, acceptRate: 9.0, enrollment: 29000 },
    "wellesley college":                     { avgGpa: 3.90, satLow: 1430, satHigh: 1550, acceptRate: 14.0, enrollment: 2500 },
  };

  // --- Seed data: 2026-27 cycle (entering Fall 2027) ---
  function buildSeed() {
    const rows = [
      { name: "Harvard University", location: "Cambridge, MA", deadline: "2027-01-01", fee: 85, notes: "Restrictive Early Action option closes Nov 1, 2026." },
      { name: "Yale University", location: "New Haven, CT", deadline: "2027-01-02", fee: 80, notes: "Single-Choice Early Action closes Nov 1, 2026." },
      { name: "Brown University", location: "Providence, RI", deadline: "2027-01-01", fee: 75, notes: "Open Curriculum. Early Decision closes Nov 1, 2026." },
      { name: "University of California, Los Angeles", location: "Los Angeles, CA", deadline: "2026-12-02", fee: 80, notes: "UC application; no Early option. File Nov 1 - Dec 2, 2026." },
      { name: "Swarthmore College", location: "Swarthmore, PA", deadline: "2027-01-05", fee: 60, notes: "ED I closes Nov 15, 2026; ED II Jan 5, 2027." },
      { name: "Haverford College", location: "Haverford, PA", deadline: "2027-01-05", fee: 65, notes: "ED I closes Nov 15, 2026; ED II Jan 5, 2027." },
      { name: "Colgate University", location: "Hamilton, NY", deadline: "2027-01-15", fee: 60, notes: "ED I closes Nov 15, 2026; ED II Jan 15, 2027." },
      { name: "Bowdoin College", location: "Brunswick, ME", deadline: "2027-01-05", fee: 65, notes: "Test-optional. ED I Nov 15, 2026; ED II Jan 5, 2027." },
      { name: "University of Vermont", location: "Burlington, VT", deadline: "2027-01-15", fee: 55, notes: "Early Action closes Nov 1, 2026; rolling review after." },
      { name: "Dartmouth College", location: "Hanover, NH", deadline: "2027-01-02", fee: 80, notes: "Early Decision closes Nov 1, 2026." },
      { name: "Barnard College", location: "New York, NY", deadline: "2027-01-01", fee: 75, notes: "Early Decision closes Nov 1, 2026." },
      { name: "New York University", location: "New York, NY", deadline: "2027-01-05", fee: 80, notes: "ED I closes Nov 1, 2026; ED II Jan 1, 2027." },
      { name: "Wellesley College", location: "Wellesley, MA", deadline: "2027-01-08", fee: 60, notes: "ED I closes Nov 1, 2026; ED II Jan 1, 2027." },
    ];
    return rows.map((r, i) => {
      const ref = ADMISSIONS_DATA[r.name.toLowerCase()] || {};
      return {
        id: "seed" + String(i + 1).padStart(2, "0"),
        addedAt: i + 1,
        prefRank: i + 1,
        name: r.name,
        location: r.location,
        type: "Regular Decision",
        deadline: r.deadline,
        status: "Researching",
        decisionDate: "",
        portal: "",
        fee: r.fee,
        visitDate: "",
        visitNotes: "",
        notes: r.notes,
        checklist: { essay: false, lor: false, transcript: false, scores: false, financial: false, interview: false },
        avgGpa: ref.avgGpa ?? null,
        satLow: ref.satLow ?? null,
        satHigh: ref.satHigh ?? null,
        acceptRate: ref.acceptRate ?? null,
        enrollment: ref.enrollment ?? null,
      };
    });
  }

  // --- Data ---
  function loadApplications() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveApplications(apps) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
  }

  let applications = loadApplications();
  if (applications.length === 0) {
    applications = buildSeed();
    saveApplications(applications);
  }
  let editingId = null;
  let deletingId = null;

  // --- DOM refs ---
  const $tbody = document.getElementById("app-tbody");
  const $emptyState = document.getElementById("empty-state");
  const $modalOverlay = document.getElementById("modal-overlay");
  const $modalTitle = document.getElementById("modal-title");
  const $form = document.getElementById("app-form");
  const $searchInput = document.getElementById("search-input");
  const $filterStatus = document.getElementById("filter-status");
  const $sortBy = document.getElementById("sort-by");
  const $deleteOverlay = document.getElementById("delete-modal-overlay");
  const $deleteMsg = document.getElementById("delete-msg");

  // Form fields
  const fields = {
    name: document.getElementById("college-name"),
    location: document.getElementById("college-location"),
    type: document.getElementById("app-type"),
    deadline: document.getElementById("app-deadline"),
    status: document.getElementById("app-status"),
    decisionDate: document.getElementById("decision-date"),
    portal: document.getElementById("app-portal"),
    fee: document.getElementById("app-fee"),
    visitDate: document.getElementById("app-visit-date"),
    visitNotes: document.getElementById("app-visit-notes"),
    notes: document.getElementById("app-notes"),
    chkEssay: document.getElementById("chk-essay"),
    chkLor: document.getElementById("chk-lor"),
    chkTranscript: document.getElementById("chk-transcript"),
    chkScores: document.getElementById("chk-scores"),
    chkFinancial: document.getElementById("chk-financial"),
    chkInterview: document.getElementById("chk-interview"),
    avgGpa: document.getElementById("college-avg-gpa"),
    satLow: document.getElementById("college-sat-low"),
    satHigh: document.getElementById("college-sat-high"),
    acceptRate: document.getElementById("college-accept-rate"),
    enrollment: document.getElementById("college-enrollment"),
  };

  // --- Helpers ---
  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function formatDate(dateStr) {
    if (!dateStr) return "—";
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function formatNumber(n) {
    if (n == null || n === "") return "—";
    return Number(n).toLocaleString("en-US");
  }

  function daysUntil(dateStr) {
    if (!dateStr) return null;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const target = new Date(dateStr + "T00:00:00");
    return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function statusClass(status) {
    return "status-" + status.toLowerCase().replace(/\s+/g, "-");
  }

  // --- Preference ranking ---
  // Renumber prefRank to a contiguous 1..N sequence, preserving current order.
  function normalizePrefRanks() {
    const ranked = [...applications].sort((a, b) => {
      const ra = a.prefRank ?? Infinity;
      const rb = b.prefRank ?? Infinity;
      if (ra !== rb) return ra - rb;
      return (a.addedAt || 0) - (b.addedAt || 0);
    });
    ranked.forEach((app, i) => {
      app.prefRank = i + 1;
    });
  }

  function nextPrefRank() {
    return applications.reduce((max, a) => Math.max(max, a.prefRank || 0), 0) + 1;
  }

  function movePreference(id, delta) {
    normalizePrefRanks();
    const app = applications.find((a) => a.id === id);
    if (!app) return;
    const targetRank = app.prefRank + delta;
    const other = applications.find((a) => a.prefRank === targetRank);
    if (!other) return;
    other.prefRank = app.prefRank;
    app.prefRank = targetRank;
    saveApplications(applications);
    refresh();
  }

  // --- Profile ---
  function loadProfile() {
    try {
      return JSON.parse(localStorage.getItem(PROFILE_KEY)) || {};
    } catch {
      return {};
    }
  }

  function saveProfile(p) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
  }

  let profile = loadProfile();

  // --- Fit Scoring ---
  // Returns { label, cls, score, tooltip } or null if not enough data
  function computeFit(app) {
    const p = profile;
    if (!p.gpa && !p.sat && !p.act) return null;

    const ref = ADMISSIONS_DATA[app.name.toLowerCase()] || {};
    const avgGpa = app.avgGpa ?? ref.avgGpa;
    const satLow = app.satLow ?? ref.satLow;
    const satHigh = app.satHigh ?? ref.satHigh;
    const acceptRate = app.acceptRate ?? ref.acceptRate;

    if (avgGpa == null && satLow == null && acceptRate == null) return null;

    let totalWeight = 0;
    let totalScore = 0;
    const tips = [];

    if (p.gpa && avgGpa) {
      const diff = p.gpa - avgGpa;
      const gpaScore = Math.max(0, Math.min(100, 60 + diff * 200));
      totalScore += gpaScore * 35;
      totalWeight += 35;
      tips.push(`GPA: ${p.gpa} vs avg ${avgGpa}`);
    }

    if (p.sat && satLow && satHigh) {
      const mid = (satLow + satHigh) / 2;
      const range = (satHigh - satLow) / 2 || 1;
      const satScore = Math.max(0, Math.min(100, 60 + ((p.sat - mid) / range) * 25));
      totalScore += satScore * 30;
      totalWeight += 30;
      tips.push(`SAT: ${p.sat} vs ${satLow}-${satHigh}`);
    }

    if (p.act && satLow && satHigh && !p.sat) {
      const satEquiv = Math.round((p.act - 1) * 34.3 + 420);
      const mid = (satLow + satHigh) / 2;
      const range = (satHigh - satLow) / 2 || 1;
      const actScore = Math.max(0, Math.min(100, 60 + ((satEquiv - mid) / range) * 25));
      totalScore += actScore * 30;
      totalWeight += 30;
      tips.push(`ACT: ${p.act} (~${satEquiv} SAT) vs ${satLow}-${satHigh}`);
    }

    if (acceptRate != null) {
      const arScore = Math.max(0, Math.min(100, acceptRate * 1.6 + 10));
      totalScore += arScore * 25;
      totalWeight += 25;
      tips.push(`Accept: ${acceptRate}%`);
    }

    if (p.ecStrength && acceptRate != null && acceptRate < 20) {
      const ecBoost = (p.ecStrength - 2) * 5;
      totalScore += ecBoost * totalWeight / 100;
    }

    if (totalWeight === 0) return null;

    const finalScore = Math.round(totalScore / totalWeight);

    let label, cls;
    if (finalScore >= 70) {
      label = "Safety";
      cls = "fit-safety";
    } else if (finalScore >= 50) {
      label = "Match";
      cls = "fit-match";
    } else if (finalScore >= 30) {
      label = "Reach";
      cls = "fit-reach";
    } else {
      label = "Far Reach";
      cls = "fit-far-reach";
    }

    return { label, cls, score: finalScore, tooltip: tips.join(" | ") };
  }

  // --- Stats ---
  function updateStats() {
    document.getElementById("stat-total").textContent = applications.length;
    const counts = { Researching: 0, "In Progress": 0, Submitted: 0, Accepted: 0, Rejected: 0 };
    applications.forEach((a) => {
      if (counts[a.status] !== undefined) counts[a.status]++;
    });
    document.getElementById("stat-researching").textContent = counts["Researching"];
    document.getElementById("stat-in-progress").textContent = counts["In Progress"];
    document.getElementById("stat-submitted").textContent = counts["Submitted"];
    document.getElementById("stat-accepted").textContent = counts["Accepted"];
    document.getElementById("stat-rejected").textContent = counts["Rejected"];
  }

  // --- Render: table ---
  function getFilteredSorted() {
    const search = $searchInput.value.toLowerCase().trim();
    const filterStatus = $filterStatus.value;
    const sortKey = $sortBy.value;

    let list = applications.filter((a) => {
      if (filterStatus !== "all" && a.status !== filterStatus) return false;
      if (search && !a.name.toLowerCase().includes(search) && !(a.location || "").toLowerCase().includes(search)) return false;
      return true;
    });

    list.sort((a, b) => {
      switch (sortKey) {
        case "preference":
          return (a.prefRank || Infinity) - (b.prefRank || Infinity);
        case "deadline":
          if (!a.deadline && !b.deadline) return 0;
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return a.deadline.localeCompare(b.deadline);
        case "name":
          return a.name.localeCompare(b.name);
        case "status": {
          const order = ["Researching", "In Progress", "Submitted", "Waitlisted", "Deferred", "Accepted", "Rejected", "Withdrawn"];
          return order.indexOf(a.status) - order.indexOf(b.status);
        }
        case "fit": {
          const fa = computeFit(a);
          const fb = computeFit(b);
          const sa = fa ? fa.score : -1;
          const sb = fb ? fb.score : -1;
          return sb - sa;
        }
        case "added":
        default:
          return (b.addedAt || 0) - (a.addedAt || 0);
      }
    });

    return list;
  }

  function renderTable() {
    normalizePrefRanks();
    const list = getFilteredSorted();
    $tbody.innerHTML = "";

    if (list.length === 0) {
      $emptyState.style.display = "block";
      document.getElementById("app-table").style.display = "none";
      updateStats();
      return;
    }

    $emptyState.style.display = "none";
    document.getElementById("app-table").style.display = "table";

    const total = applications.length;
    const maxEnroll = applications.reduce((m, a) => Math.max(m, a.enrollment || 0), 0);

    list.forEach((app) => {
      const tr = document.createElement("tr");

      // Deadline urgency
      const days = daysUntil(app.deadline);
      let deadlineHtml = formatDate(app.deadline);
      if (days !== null && app.status !== "Submitted" && app.status !== "Accepted" && app.status !== "Rejected" && app.status !== "Withdrawn") {
        if (days < 0) {
          deadlineHtml += ' <span class="deadline-tag overdue">Overdue</span>';
        } else if (days <= 7) {
          deadlineHtml += ` <span class="deadline-tag urgent">${days}d left</span>`;
        } else if (days <= 30) {
          deadlineHtml += ` <span class="deadline-tag soon">${days}d left</span>`;
        }
      }

      // Checklist summary
      const checkItems = [
        { key: "essay", label: "Es" },
        { key: "lor", label: "LoR" },
        { key: "transcript", label: "Tr" },
        { key: "scores", label: "Sc" },
        { key: "financial", label: "Fi" },
        { key: "interview", label: "In" },
      ];
      const checkHtml = checkItems
        .map((c) => {
          const done = app.checklist && app.checklist[c.key];
          return `<span class="chk-badge ${done ? "chk-done" : ""}" title="${c.label}">${done ? "&#10003;" : "&#10007;"}</span>`;
        })
        .join("");

      const notesPreview = app.notes ? escapeHtml(app.notes.length > 40 ? app.notes.slice(0, 40) + "..." : app.notes) : "—";

      // Campus visit badge
      let visitHtml = "";
      if (app.visitDate || app.visitNotes) {
        const tipParts = [];
        if (app.visitDate) tipParts.push("Visited " + formatDate(app.visitDate));
        if (app.visitNotes) tipParts.push(app.visitNotes);
        visitHtml = '<span class="visit-badge" title="' + escapeHtml(tipParts.join(" — ")) + '">&#9873; Visited</span>';
      }

      // Fit badge
      const fit = computeFit(app);
      let fitHtml = '<span class="fit-badge fit-na" title="Set your profile to see fit">—</span>';
      if (fit) {
        fitHtml = `<span class="fit-badge ${fit.cls}" title="${escapeHtml(fit.tooltip)}">${escapeHtml(fit.label)}<span class="fit-score">${fit.score}</span></span>`;
      }

      // Enrollment cell with a relative-size bar
      let enrollHtml = '<span class="enroll-na">—</span>';
      if (app.enrollment) {
        const pct = maxEnroll ? Math.max(4, Math.round((app.enrollment / maxEnroll) * 100)) : 0;
        enrollHtml =
          '<div class="enroll-wrap" title="' + formatNumber(app.enrollment) + ' undergraduates">' +
          '<span class="enroll-num">' + formatNumber(app.enrollment) + "</span>" +
          '<span class="enroll-bar"><span class="enroll-fill" style="width:' + pct + '%"></span></span>' +
          "</div>";
      }

      const upDisabled = app.prefRank <= 1 ? "disabled" : "";
      const downDisabled = app.prefRank >= total ? "disabled" : "";

      tr.innerHTML = `
        <td class="col-rank">
          <span class="rank-num">#${app.prefRank}</span>
          <span class="rank-control">
            <button class="btn-icon rank-up" data-id="${app.id}" title="Higher preference" ${upDisabled}>&#9650;</button>
            <button class="btn-icon rank-down" data-id="${app.id}" title="Lower preference" ${downDisabled}>&#9660;</button>
          </span>
        </td>
        <td class="col-name">
          <strong>${escapeHtml(app.name)}</strong>
          ${app.location ? '<span class="college-location">' + escapeHtml(app.location) + "</span>" : ""}
          ${app.portal ? '<a class="portal-link" href="' + escapeHtml(app.portal) + '" target="_blank" rel="noopener noreferrer">Portal</a>' : ""}
          ${visitHtml}
        </td>
        <td class="col-fit">${fitHtml}</td>
        <td class="col-enrollment">${enrollHtml}</td>
        <td>${escapeHtml(app.type)}</td>
        <td>${deadlineHtml}</td>
        <td><span class="status-badge ${statusClass(app.status)}">${escapeHtml(app.status)}</span></td>
        <td>${formatDate(app.decisionDate)} <span class="checklist-summary">${checkHtml}</span></td>
        <td class="col-notes" title="${escapeHtml(app.notes || "")}">${notesPreview}</td>
        <td class="col-actions">
          <button class="btn-icon btn-edit" data-id="${app.id}" title="Edit">&#9998;</button>
          <button class="btn-icon btn-delete" data-id="${app.id}" title="Delete">&#128465;</button>
        </td>
      `;
      $tbody.appendChild(tr);
    });

    updateStats();
  }

  // --- Render: preference ranker ---
  const $rankerList = document.getElementById("ranker-list");
  const $rankerBody = document.getElementById("ranker-body");
  const $rankerArrow = document.getElementById("ranker-arrow");
  const $rankerSummary = document.getElementById("ranker-summary");

  function renderRanker() {
    normalizePrefRanks();
    const ranked = [...applications].sort((a, b) => a.prefRank - b.prefRank);
    $rankerList.innerHTML = "";

    ranked.forEach((app, i) => {
      const li = document.createElement("li");
      li.className = "ranker-item";
      li.draggable = true;
      li.dataset.id = app.id;
      li.innerHTML = `
        <span class="ranker-rank">${app.prefRank}</span>
        <span class="ranker-grip" aria-hidden="true">&#8942;&#8942;</span>
        <span class="ranker-name">${escapeHtml(app.name)}<span class="ranker-loc">${escapeHtml(app.location || "")}</span></span>
        <span class="ranker-moves">
          <button class="btn-icon ranker-up" data-id="${app.id}" title="Move up" ${i === 0 ? "disabled" : ""}>&#9650;</button>
          <button class="btn-icon ranker-down" data-id="${app.id}" title="Move down" ${i === ranked.length - 1 ? "disabled" : ""}>&#9660;</button>
        </span>
      `;
      $rankerList.appendChild(li);
    });

    $rankerSummary.textContent = ranked.length
      ? `Top choice: ${ranked[0].name}`
      : "No colleges yet";
  }

  function refresh() {
    renderTable();
    renderRanker();
  }

  // --- Ranker drag & drop ---
  function getDragAfterElement(container, y) {
    const els = [...container.querySelectorAll(".ranker-item:not(.dragging)")];
    return els.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset, element: child };
        }
        return closest;
      },
      { offset: -Infinity, element: null }
    ).element;
  }

  function commitRankerOrder() {
    const ids = [...$rankerList.querySelectorAll(".ranker-item")].map((li) => li.dataset.id);
    ids.forEach((id, i) => {
      const app = applications.find((a) => a.id === id);
      if (app) app.prefRank = i + 1;
    });
    saveApplications(applications);
    refresh();
  }

  $rankerList.addEventListener("dragstart", (e) => {
    const li = e.target.closest(".ranker-item");
    if (li) li.classList.add("dragging");
  });

  $rankerList.addEventListener("dragend", (e) => {
    const li = e.target.closest(".ranker-item");
    if (li) li.classList.remove("dragging");
    commitRankerOrder();
  });

  $rankerList.addEventListener("dragover", (e) => {
    e.preventDefault();
    const dragging = $rankerList.querySelector(".dragging");
    if (!dragging) return;
    const after = getDragAfterElement($rankerList, e.clientY);
    if (after == null) {
      $rankerList.appendChild(dragging);
    } else {
      $rankerList.insertBefore(dragging, after);
    }
  });

  $rankerList.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-id]");
    if (!btn) return;
    if (btn.classList.contains("ranker-up")) {
      movePreference(btn.dataset.id, -1);
    } else if (btn.classList.contains("ranker-down")) {
      movePreference(btn.dataset.id, 1);
    }
  });

  document.getElementById("ranker-toggle").addEventListener("click", () => {
    const hidden = $rankerBody.hidden;
    $rankerBody.hidden = !hidden;
    $rankerArrow.textContent = hidden ? "▲" : "▼";
  });

  // --- Modal ---
  function openModal(app) {
    if (app) {
      editingId = app.id;
      $modalTitle.textContent = "Edit College";
      fields.name.value = app.name;
      fields.location.value = app.location || "";
      fields.type.value = app.type;
      fields.deadline.value = app.deadline || "";
      fields.status.value = app.status;
      fields.decisionDate.value = app.decisionDate || "";
      fields.portal.value = app.portal || "";
      fields.fee.value = app.fee || "";
      fields.visitDate.value = app.visitDate || "";
      fields.visitNotes.value = app.visitNotes || "";
      fields.notes.value = app.notes || "";
      fields.chkEssay.checked = app.checklist?.essay || false;
      fields.chkLor.checked = app.checklist?.lor || false;
      fields.chkTranscript.checked = app.checklist?.transcript || false;
      fields.chkScores.checked = app.checklist?.scores || false;
      fields.chkFinancial.checked = app.checklist?.financial || false;
      fields.chkInterview.checked = app.checklist?.interview || false;
      const ref = ADMISSIONS_DATA[app.name.toLowerCase()] || {};
      fields.avgGpa.value = app.avgGpa ?? ref.avgGpa ?? "";
      fields.satLow.value = app.satLow ?? ref.satLow ?? "";
      fields.satHigh.value = app.satHigh ?? ref.satHigh ?? "";
      fields.acceptRate.value = app.acceptRate ?? ref.acceptRate ?? "";
      fields.enrollment.value = app.enrollment ?? ref.enrollment ?? "";
    } else {
      editingId = null;
      $modalTitle.textContent = "Add College";
      $form.reset();
    }
    $modalOverlay.classList.add("active");
    fields.name.focus();
  }

  function closeModal() {
    $modalOverlay.classList.remove("active");
    editingId = null;
  }

  function openDeleteModal(id) {
    const app = applications.find((a) => a.id === id);
    if (!app) return;
    deletingId = id;
    $deleteMsg.textContent = `Are you sure you want to delete "${app.name}"?`;
    $deleteOverlay.classList.add("active");
  }

  function closeDeleteModal() {
    $deleteOverlay.classList.remove("active");
    deletingId = null;
  }

  // --- CRUD ---
  function saveFromForm() {
    const data = {
      name: fields.name.value.trim(),
      location: fields.location.value.trim(),
      type: fields.type.value,
      deadline: fields.deadline.value,
      status: fields.status.value,
      decisionDate: fields.decisionDate.value,
      portal: fields.portal.value.trim(),
      fee: fields.fee.value ? Number(fields.fee.value) : null,
      visitDate: fields.visitDate.value,
      visitNotes: fields.visitNotes.value.trim(),
      notes: fields.notes.value.trim(),
      checklist: {
        essay: fields.chkEssay.checked,
        lor: fields.chkLor.checked,
        transcript: fields.chkTranscript.checked,
        scores: fields.chkScores.checked,
        financial: fields.chkFinancial.checked,
        interview: fields.chkInterview.checked,
      },
      avgGpa: fields.avgGpa.value ? Number(fields.avgGpa.value) : null,
      satLow: fields.satLow.value ? Number(fields.satLow.value) : null,
      satHigh: fields.satHigh.value ? Number(fields.satHigh.value) : null,
      acceptRate: fields.acceptRate.value ? Number(fields.acceptRate.value) : null,
      enrollment: fields.enrollment.value ? Number(fields.enrollment.value) : null,
    };

    if (!data.name) return;

    if (editingId) {
      const idx = applications.findIndex((a) => a.id === editingId);
      if (idx !== -1) {
        applications[idx] = { ...applications[idx], ...data };
      }
    } else {
      data.id = generateId();
      data.addedAt = Date.now();
      data.prefRank = nextPrefRank();
      applications.push(data);
    }

    normalizePrefRanks();
    saveApplications(applications);
    refresh();
    closeModal();
  }

  function deleteApplication(id) {
    applications = applications.filter((a) => a.id !== id);
    normalizePrefRanks();
    saveApplications(applications);
    refresh();
    closeDeleteModal();
  }

  // --- Bulk Add ---
  const $bulkOverlay = document.getElementById("bulk-modal-overlay");
  const $bulkTextarea = document.getElementById("bulk-textarea");
  const $bulkType = document.getElementById("bulk-type");
  const $bulkStatus = document.getElementById("bulk-status");
  const $bulkPreview = document.getElementById("bulk-preview");

  function parseBulkLines() {
    return $bulkTextarea.value
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => {
        const commaIdx = line.indexOf(",");
        if (commaIdx !== -1) {
          return {
            name: line.slice(0, commaIdx).trim(),
            location: line.slice(commaIdx + 1).trim(),
          };
        }
        return { name: line, location: "" };
      });
  }

  function updateBulkPreview() {
    const entries = parseBulkLines();
    if (entries.length === 0) {
      $bulkPreview.hidden = true;
      return;
    }
    const dupes = entries.filter((e) =>
      applications.some((a) => a.name.toLowerCase() === e.name.toLowerCase())
    );
    let html = `<strong>${entries.length}</strong> college${entries.length !== 1 ? "s" : ""} will be added.`;
    if (dupes.length > 0) {
      html += ` <span class="bulk-warn">${dupes.length} duplicate${dupes.length !== 1 ? "s" : ""} detected: ${dupes.map((d) => d.name).join(", ")}</span>`;
    }
    $bulkPreview.innerHTML = html;
    $bulkPreview.hidden = false;
  }

  function openBulkModal() {
    $bulkTextarea.value = "";
    $bulkType.value = "Regular Decision";
    $bulkStatus.value = "Researching";
    $bulkPreview.hidden = true;
    $bulkOverlay.classList.add("active");
    $bulkTextarea.focus();
  }

  function closeBulkModal() {
    $bulkOverlay.classList.remove("active");
  }

  function submitBulk() {
    const entries = parseBulkLines();
    if (entries.length === 0) return;
    const defaultType = $bulkType.value;
    const defaultStatus = $bulkStatus.value;
    const emptyChecklist = { essay: false, lor: false, transcript: false, scores: false, financial: false, interview: false };

    entries.forEach((entry) => {
      const ref = ADMISSIONS_DATA[entry.name.toLowerCase()] || {};
      applications.push({
        id: generateId(),
        addedAt: Date.now(),
        prefRank: nextPrefRank(),
        name: entry.name,
        location: entry.location,
        type: defaultType,
        deadline: "",
        status: defaultStatus,
        decisionDate: "",
        portal: "",
        fee: null,
        visitDate: "",
        visitNotes: "",
        notes: "",
        checklist: { ...emptyChecklist },
        avgGpa: ref.avgGpa ?? null,
        satLow: ref.satLow ?? null,
        satHigh: ref.satHigh ?? null,
        acceptRate: ref.acceptRate ?? null,
        enrollment: ref.enrollment ?? null,
      });
    });

    normalizePrefRanks();
    saveApplications(applications);
    refresh();
    closeBulkModal();
  }

  $bulkTextarea.addEventListener("input", updateBulkPreview);
  document.getElementById("btn-bulk-add").addEventListener("click", openBulkModal);
  document.getElementById("bulk-modal-close").addEventListener("click", closeBulkModal);
  document.getElementById("bulk-cancel").addEventListener("click", closeBulkModal);
  document.getElementById("bulk-submit").addEventListener("click", submitBulk);
  $bulkOverlay.addEventListener("click", (e) => {
    if (e.target === $bulkOverlay) closeBulkModal();
  });

  // --- Export / Import ---
  function exportData() {
    const payload = {
      version: 2,
      exportedAt: new Date().toISOString(),
      applications,
      profile,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "college-tracker-backup.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function importData(file) {
    const reader = new FileReader();
    reader.onload = () => {
      let parsed;
      try {
        parsed = JSON.parse(reader.result);
      } catch {
        alert("Could not read that file — it is not valid JSON.");
        return;
      }
      if (!parsed || !Array.isArray(parsed.applications)) {
        alert("That file does not look like a College Tracker backup.");
        return;
      }
      if (!confirm("Importing will replace your current colleges and ranking. Continue?")) {
        return;
      }
      applications = parsed.applications;
      if (parsed.profile && typeof parsed.profile === "object") {
        profile = parsed.profile;
        saveProfile(profile);
        populateProfileFields();
      }
      normalizePrefRanks();
      saveApplications(applications);
      refresh();
    };
    reader.readAsText(file);
  }

  const $importFile = document.getElementById("import-file");
  document.getElementById("btn-export").addEventListener("click", exportData);
  document.getElementById("btn-import").addEventListener("click", () => $importFile.click());
  $importFile.addEventListener("change", () => {
    if ($importFile.files && $importFile.files[0]) {
      importData($importFile.files[0]);
    }
    $importFile.value = "";
  });

  // --- Event Listeners ---
  document.getElementById("btn-add").addEventListener("click", () => openModal(null));
  document.getElementById("modal-close").addEventListener("click", closeModal);
  document.getElementById("btn-cancel").addEventListener("click", closeModal);
  document.getElementById("delete-modal-close").addEventListener("click", closeDeleteModal);
  document.getElementById("delete-cancel").addEventListener("click", closeDeleteModal);
  document.getElementById("delete-confirm").addEventListener("click", () => {
    if (deletingId) deleteApplication(deletingId);
  });

  $modalOverlay.addEventListener("click", (e) => {
    if (e.target === $modalOverlay) closeModal();
  });
  $deleteOverlay.addEventListener("click", (e) => {
    if (e.target === $deleteOverlay) closeDeleteModal();
  });

  $form.addEventListener("submit", (e) => {
    e.preventDefault();
    saveFromForm();
  });

  $tbody.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-id]");
    if (!btn) return;
    const id = btn.dataset.id;
    if (btn.classList.contains("btn-edit")) {
      const app = applications.find((a) => a.id === id);
      if (app) openModal(app);
    } else if (btn.classList.contains("btn-delete")) {
      openDeleteModal(id);
    } else if (btn.classList.contains("rank-up")) {
      movePreference(id, -1);
    } else if (btn.classList.contains("rank-down")) {
      movePreference(id, 1);
    }
  });

  $searchInput.addEventListener("input", renderTable);
  $filterStatus.addEventListener("change", renderTable);
  $sortBy.addEventListener("change", renderTable);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
      closeDeleteModal();
      closeBulkModal();
    }
  });

  // --- Profile Panel ---
  const $profileBody = document.getElementById("profile-body");
  const $profileArrow = document.getElementById("profile-arrow");
  const $profileSummary = document.getElementById("profile-summary");
  const profileFields = {
    gpa: document.getElementById("profile-gpa"),
    sat: document.getElementById("profile-sat"),
    act: document.getElementById("profile-act"),
    aps: document.getElementById("profile-aps"),
    ecStrength: document.getElementById("profile-ec-strength"),
  };

  function updateProfileSummary() {
    const parts = [];
    if (profile.gpa) parts.push(`GPA ${profile.gpa}`);
    if (profile.sat) parts.push(`SAT ${profile.sat}`);
    if (profile.act) parts.push(`ACT ${profile.act}`);
    $profileSummary.textContent = parts.length ? parts.join(" / ") : "Not set — click to expand";
  }

  function populateProfileFields() {
    profileFields.gpa.value = profile.gpa || "";
    profileFields.sat.value = profile.sat || "";
    profileFields.act.value = profile.act || "";
    profileFields.aps.value = profile.aps || "";
    profileFields.ecStrength.value = profile.ecStrength || "";
    updateProfileSummary();
  }

  document.getElementById("profile-toggle").addEventListener("click", () => {
    const hidden = $profileBody.hidden;
    $profileBody.hidden = !hidden;
    $profileArrow.textContent = hidden ? "▲" : "▼";
  });

  document.getElementById("profile-save").addEventListener("click", () => {
    profile = {
      gpa: profileFields.gpa.value ? Number(profileFields.gpa.value) : null,
      sat: profileFields.sat.value ? Number(profileFields.sat.value) : null,
      act: profileFields.act.value ? Number(profileFields.act.value) : null,
      aps: profileFields.aps.value ? Number(profileFields.aps.value) : null,
      ecStrength: profileFields.ecStrength.value ? Number(profileFields.ecStrength.value) : null,
    };
    saveProfile(profile);
    updateProfileSummary();
    renderTable();
  });

  populateProfileFields();

  // --- Init ---
  refresh();
})();
