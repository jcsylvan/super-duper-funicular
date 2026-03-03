(function () {
  "use strict";

  const STORAGE_KEY = "college_applications";

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

  const DEFAULT_COLLEGES = [
    {
      id: "seed01", addedAt: 1,
      name: "Massachusetts Institute of Technology", location: "Cambridge, MA",
      type: "Regular Decision", deadline: "2026-01-01", status: "Submitted",
      decisionDate: "2026-03-14", portal: "", fee: 75,
      notes: "Submitted supplemental essays on research experience",
      checklist: { essay: true, lor: true, transcript: true, scores: true, financial: true, interview: true },
    },
    {
      id: "seed02", addedAt: 2,
      name: "Stanford University", location: "Stanford, CA",
      type: "Regular Decision", deadline: "2026-01-02", status: "Submitted",
      decisionDate: "2026-04-01", portal: "", fee: 90,
      notes: "Wrote about community impact for short essays",
      checklist: { essay: true, lor: true, transcript: true, scores: true, financial: true, interview: false },
    },
    {
      id: "seed03", addedAt: 3,
      name: "Harvard University", location: "Cambridge, MA",
      type: "Regular Decision", deadline: "2026-01-01", status: "Submitted",
      decisionDate: "2026-03-28", portal: "", fee: 85,
      notes: "Optional interview completed in December",
      checklist: { essay: true, lor: true, transcript: true, scores: true, financial: true, interview: true },
    },
    {
      id: "seed04", addedAt: 4,
      name: "Yale University", location: "New Haven, CT",
      type: "Regular Decision", deadline: "2026-01-02", status: "Submitted",
      decisionDate: "2026-03-28", portal: "", fee: 80,
      notes: "Highlighted interest in humanities program",
      checklist: { essay: true, lor: true, transcript: true, scores: true, financial: true, interview: true },
    },
    {
      id: "seed05", addedAt: 5,
      name: "Princeton University", location: "Princeton, NJ",
      type: "Regular Decision", deadline: "2026-01-01", status: "Submitted",
      decisionDate: "2026-03-28", portal: "", fee: 70,
      notes: "Graded written paper submitted",
      checklist: { essay: true, lor: true, transcript: true, scores: true, financial: true, interview: true },
    },
    {
      id: "seed06", addedAt: 6,
      name: "University of Chicago", location: "Chicago, IL",
      type: "Early Action", deadline: "2025-11-01", status: "Accepted",
      decisionDate: "2026-01-15", portal: "", fee: 75,
      notes: "Accepted! Need to compare financial aid package",
      checklist: { essay: true, lor: true, transcript: true, scores: true, financial: true, interview: false },
    },
    {
      id: "seed07", addedAt: 7,
      name: "Georgia Institute of Technology", location: "Atlanta, GA",
      type: "Early Action", deadline: "2025-11-01", status: "Accepted",
      decisionDate: "2026-01-20", portal: "", fee: 75,
      notes: "Accepted into College of Engineering",
      checklist: { essay: true, lor: true, transcript: true, scores: true, financial: true, interview: false },
    },
    {
      id: "seed08", addedAt: 8,
      name: "University of Michigan", location: "Ann Arbor, MI",
      type: "Early Action", deadline: "2025-11-01", status: "Deferred",
      decisionDate: "", portal: "", fee: 75,
      notes: "Deferred to regular decision pool. Sent LOCI in January",
      checklist: { essay: true, lor: true, transcript: true, scores: true, financial: true, interview: false },
    },
    {
      id: "seed09", addedAt: 9,
      name: "University of California, Berkeley", location: "Berkeley, CA",
      type: "Regular Decision", deadline: "2025-11-30", status: "Submitted",
      decisionDate: "2026-03-25", portal: "", fee: 80,
      notes: "Applied to College of Letters & Science",
      checklist: { essay: true, lor: false, transcript: true, scores: true, financial: true, interview: false },
    },
    {
      id: "seed10", addedAt: 10,
      name: "University of California, Los Angeles", location: "Los Angeles, CA",
      type: "Regular Decision", deadline: "2025-11-30", status: "Submitted",
      decisionDate: "2026-03-20", portal: "", fee: 80,
      notes: "Used same personal insight questions as Berkeley",
      checklist: { essay: true, lor: false, transcript: true, scores: true, financial: true, interview: false },
    },
    {
      id: "seed11", addedAt: 11,
      name: "Columbia University", location: "New York, NY",
      type: "Regular Decision", deadline: "2026-01-01", status: "Submitted",
      decisionDate: "2026-03-28", portal: "", fee: 85,
      notes: "Focused on core curriculum appeal in essays",
      checklist: { essay: true, lor: true, transcript: true, scores: true, financial: true, interview: false },
    },
    {
      id: "seed12", addedAt: 12,
      name: "Duke University", location: "Durham, NC",
      type: "Regular Decision", deadline: "2026-01-04", status: "Submitted",
      decisionDate: "2026-03-28", portal: "", fee: 85,
      notes: "Wrote optional \"Why Duke\" essay",
      checklist: { essay: true, lor: true, transcript: true, scores: true, financial: true, interview: true },
    },
    {
      id: "seed13", addedAt: 13,
      name: "Northwestern University", location: "Evanston, IL",
      type: "Regular Decision", deadline: "2026-01-03", status: "Submitted",
      decisionDate: "2026-03-28", portal: "", fee: 75,
      notes: "Applied to Weinberg College of Arts & Sciences",
      checklist: { essay: true, lor: true, transcript: true, scores: true, financial: true, interview: false },
    },
    {
      id: "seed14", addedAt: 14,
      name: "Carnegie Mellon University", location: "Pittsburgh, PA",
      type: "Regular Decision", deadline: "2026-01-03", status: "Submitted",
      decisionDate: "2026-03-28", portal: "", fee: 75,
      notes: "Applied to School of Computer Science",
      checklist: { essay: true, lor: true, transcript: true, scores: true, financial: true, interview: false },
    },
    {
      id: "seed15", addedAt: 15,
      name: "University of Virginia", location: "Charlottesville, VA",
      type: "Early Action", deadline: "2025-11-01", status: "Accepted",
      decisionDate: "2026-01-25", portal: "", fee: 70,
      notes: "In-state safety school. Accepted into honors program!",
      checklist: { essay: true, lor: true, transcript: true, scores: true, financial: true, interview: false },
    },
    {
      id: "seed16", addedAt: 16,
      name: "Rice University", location: "Houston, TX",
      type: "Regular Decision", deadline: "2026-01-04", status: "Submitted",
      decisionDate: "2026-03-28", portal: "", fee: 75,
      notes: "Mentioned residential college system in \"Why Rice\" essay",
      checklist: { essay: true, lor: true, transcript: true, scores: true, financial: true, interview: true },
    },
    {
      id: "seed17", addedAt: 17,
      name: "Brown University", location: "Providence, RI",
      type: "Regular Decision", deadline: "2026-01-05", status: "Submitted",
      decisionDate: "2026-03-28", portal: "", fee: 75,
      notes: "Open curriculum was a big draw. Wrote about interdisciplinary interests",
      checklist: { essay: true, lor: true, transcript: true, scores: true, financial: true, interview: true },
    },
    {
      id: "seed18", addedAt: 18,
      name: "University of Wisconsin-Madison", location: "Madison, WI",
      type: "Rolling", deadline: "2026-02-01", status: "Accepted",
      decisionDate: "2026-02-15", portal: "", fee: 60,
      notes: "Rolling admission, accepted quickly. Good backup option",
      checklist: { essay: true, lor: true, transcript: true, scores: true, financial: true, interview: false },
    },
    {
      id: "seed19", addedAt: 19,
      name: "Boston University", location: "Boston, MA",
      type: "Regular Decision", deadline: "2026-01-04", status: "Submitted",
      decisionDate: "2026-03-15", portal: "", fee: 80,
      notes: "Applied to College of Engineering",
      checklist: { essay: true, lor: true, transcript: true, scores: true, financial: true, interview: false },
    },
    {
      id: "seed20", addedAt: 20,
      name: "University of Southern California", location: "Los Angeles, CA",
      type: "Regular Decision", deadline: "2026-01-15", status: "Submitted",
      decisionDate: "2026-04-01", portal: "", fee: 85,
      notes: "Applied for merit scholarship consideration",
      checklist: { essay: true, lor: true, transcript: true, scores: true, financial: true, interview: false },
    },
  ];

  let applications = loadApplications();
  if (applications.length === 0) {
    applications = DEFAULT_COLLEGES;
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
    notes: document.getElementById("app-notes"),
    chkEssay: document.getElementById("chk-essay"),
    chkLor: document.getElementById("chk-lor"),
    chkTranscript: document.getElementById("chk-transcript"),
    chkScores: document.getElementById("chk-scores"),
    chkFinancial: document.getElementById("chk-financial"),
    chkInterview: document.getElementById("chk-interview"),
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

  // --- Render ---
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
        case "added":
        default:
          return (b.addedAt || 0) - (a.addedAt || 0);
      }
    });

    return list;
  }

  function renderTable() {
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

      tr.innerHTML = `
        <td class="col-name">
          <strong>${escapeHtml(app.name)}</strong>
          ${app.location ? '<span class="college-location">' + escapeHtml(app.location) + "</span>" : ""}
          ${app.portal ? '<a class="portal-link" href="' + escapeHtml(app.portal) + '" target="_blank" rel="noopener noreferrer">Portal</a>' : ""}
        </td>
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
      fields.notes.value = app.notes || "";
      fields.chkEssay.checked = app.checklist?.essay || false;
      fields.chkLor.checked = app.checklist?.lor || false;
      fields.chkTranscript.checked = app.checklist?.transcript || false;
      fields.chkScores.checked = app.checklist?.scores || false;
      fields.chkFinancial.checked = app.checklist?.financial || false;
      fields.chkInterview.checked = app.checklist?.interview || false;
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
      notes: fields.notes.value.trim(),
      checklist: {
        essay: fields.chkEssay.checked,
        lor: fields.chkLor.checked,
        transcript: fields.chkTranscript.checked,
        scores: fields.chkScores.checked,
        financial: fields.chkFinancial.checked,
        interview: fields.chkInterview.checked,
      },
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
      applications.push(data);
    }

    saveApplications(applications);
    renderTable();
    closeModal();
  }

  function deleteApplication(id) {
    applications = applications.filter((a) => a.id !== id);
    saveApplications(applications);
    renderTable();
    closeDeleteModal();
  }

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
    }
  });

  $searchInput.addEventListener("input", renderTable);
  $filterStatus.addEventListener("change", renderTable);
  $sortBy.addEventListener("change", renderTable);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
      closeDeleteModal();
    }
  });

  // --- Init ---
  renderTable();
})();
