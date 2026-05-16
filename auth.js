(function () {
  "use strict";

  // SHA-256 hex digest of the access password.
  // To change the password, run this in any browser console and paste the result:
  //   crypto.subtle.digest("SHA-256", new TextEncoder().encode("YOUR_PASSWORD"))
  //     .then(b => console.log([...new Uint8Array(b)].map(x => x.toString(16).padStart(2,"0")).join("")))
  // Note: a client-side gate deters casual access only; the page source is still public.
  const PASSWORD_HASH = "7b2e9f882fb00c76d3863ad4d12a8254bc146fdcf8934dfb20322f6598f03e0c";

  const SESSION_KEY = "college_tracker_auth";

  const gate = document.getElementById("auth-gate");
  const form = document.getElementById("auth-form");
  const input = document.getElementById("auth-input");
  const error = document.getElementById("auth-error");

  function unlock() {
    document.body.classList.remove("locked");
    if (gate) gate.remove();
  }

  if (sessionStorage.getItem(SESSION_KEY) === "1") {
    unlock();
    return;
  }

  if (input) input.focus();

  async function sha256Hex(text) {
    const data = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    error.hidden = true;
    const hash = await sha256Hex(input.value);
    if (hash === PASSWORD_HASH) {
      sessionStorage.setItem(SESSION_KEY, "1");
      unlock();
    } else {
      error.hidden = false;
      input.value = "";
      input.focus();
    }
  });
})();
