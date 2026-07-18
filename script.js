/* ============================================================
   App logic for the research survey
   Depends on: config.js (SUPABASE_URL / SUPABASE_ANON_KEY),
               mhls-questions.js (MHLS_QUESTIONS)
   ============================================================ */

(function () {
  "use strict";

  // ---- Supabase client -------------------------------------------------
  // window.supabase comes from the Supabase JS CDN script tag in index.html
  const supabaseClient = window.supabase.createClient(
    window.SUPABASE_URL,
    window.SUPABASE_ANON_KEY
  );

  // ---- Elements ----------------------------------------------------------
  const steps = {
    consent: document.getElementById("step-consent"),
    declined: document.getElementById("step-declined"),
    demographics: document.getElementById("step-demographics"),
    mhls: document.getElementById("step-mhls"),
    thankyou: document.getElementById("step-thankyou")
  };
  const progressSteps = document.querySelectorAll(".progress-step");
  const statusBanner = document.getElementById("statusBanner");

  function showStep(stepKey, progressIndex) {
    Object.values(steps).forEach(el => el.classList.add("hidden"));
    steps[stepKey].classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (progressIndex) {
      progressSteps.forEach((el, i) => {
        el.classList.toggle("active", i < progressIndex);
      });
    } else {
      document.getElementById("progressTrack").classList.add("hidden");
    }
  }

  function showBanner(message, isError) {
    statusBanner.textContent = message;
    statusBanner.className = "status-banner" + (isError ? " error" : "");
    statusBanner.classList.remove("hidden");
  }

  function hideBanner() {
    statusBanner.classList.add("hidden");
  }

  // ---- STEP 1: Consent -----------------------------------------------
  const consentOptions = document.getElementById("consentOptions");
  const consentContinueBtn = document.getElementById("consentContinueBtn");
  const consentHint = document.getElementById("consentHint");

  consentOptions.addEventListener("change", () => {
    const selected = consentOptions.querySelector('input[name="consentChoice"]:checked');
    consentContinueBtn.disabled = !selected;
    consentHint.style.visibility = selected ? "hidden" : "visible";
  });

  consentContinueBtn.addEventListener("click", () => {
    const selected = consentOptions.querySelector('input[name="consentChoice"]:checked');
    if (!selected) return; // safety guard, button is disabled anyway

    if (selected.value === "agree") {
      showStep("demographics", 2);
    } else {
      // Participant disagreed: stop immediately, nothing is recorded or submitted.
      showStep("declined", null);
    }
  });

  // ---- STEP 2: Demographics --------------------------------------------
  const demographicsForm = document.getElementById("demographicsForm");
  const toQuestionnaireBtn = document.getElementById("toQuestionnaireBtn");

  // Show/hide "please specify" follow-up fields
  const genderSelect = document.getElementById("gender");
  const genderOtherField = document.getElementById("genderOtherField");
  genderSelect.addEventListener("change", () => {
    genderOtherField.classList.toggle("hidden", genderSelect.value !== "Other");
  });

  const mhIllnessSelect = document.getElementById("mh_illness_experience");
  const mhIllnessSpecifyField = document.getElementById("mhIllnessSpecifyField");
  mhIllnessSelect.addEventListener("change", () => {
    mhIllnessSpecifyField.classList.toggle("hidden", mhIllnessSelect.value !== "Yes");
  });

  function validateDemographics() {
    let valid = true;
    const fields = demographicsForm.querySelectorAll("input[required], select[required]");
    fields.forEach(field => {
      const wrapper = field.closest(".field");
      const isEmpty = !field.value || field.value.trim() === "";
      wrapper.classList.toggle("invalid", isEmpty);
      if (isEmpty) valid = false;
    });
    return valid;
  }

  toQuestionnaireBtn.addEventListener("click", () => {
    if (!validateDemographics()) {
      showBanner("Please answer all background questions before continuing.", true);
      setTimeout(hideBanner, 3000);
      return;
    }
    showStep("mhls", 3);
  });

  // ---- STEP 3: Render MHLS questions ------------------------------------
  const mhlsListEl = document.getElementById("mhlsQuestionList");

  function renderMhlsQuestions() {
    const html = MHLS_QUESTIONS.map((q, index) => {
      const optionsHtml = q.scale.map(opt => `
        <label class="likert-option" data-question="${q.id}" data-value="${opt.value}">
          <input type="radio" name="${q.id}" value="${opt.value}" required />
          ${opt.label}
        </label>
      `).join("");

      return `
        <div class="mhls-item" data-item="${q.id}">
          <div class="mhls-item-number">Question ${index + 1} of ${MHLS_QUESTIONS.length}</div>
          <p class="mhls-item-text">${q.text}</p>
          <div class="likert-options">${optionsHtml}</div>
        </div>
      `;
    }).join("");

    mhlsListEl.innerHTML = html;

    // Click-to-select styling (radio input stays the source of truth)
    mhlsListEl.querySelectorAll(".likert-option").forEach(optionEl => {
      optionEl.addEventListener("click", () => {
        const questionId = optionEl.dataset.question;
        mhlsListEl
          .querySelectorAll(`.likert-option[data-question="${questionId}"]`)
          .forEach(el => el.classList.remove("selected"));
        optionEl.classList.add("selected");
        optionEl.querySelector("input").checked = true;
      });
    });
  }

  renderMhlsQuestions();

  // ---- STEP 3: Submit -----------------------------------------------------
  const mhlsForm = document.getElementById("mhlsForm");
  const submitBtn = document.getElementById("submitBtn");
  const submitError = document.getElementById("submitError");

  function collectMhlsAnswers() {
    const answers = {};
    let allAnswered = true;

    MHLS_QUESTIONS.forEach(q => {
      const checked = mhlsForm.querySelector(`input[name="${q.id}"]:checked`);
      if (checked) {
        answers[q.id] = Number(checked.value);
      } else {
        allAnswered = false;
      }
    });

    return { answers, allAnswered };
  }

  mhlsForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    submitError.classList.add("hidden");

    const { answers, allAnswered } = collectMhlsAnswers();
    if (!allAnswered) {
      submitError.classList.remove("hidden");
      submitError.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const demographicsData = {
      age: Number(document.getElementById("age").value),
      gender: document.getElementById("gender").value,
      gender_other_specify: document.getElementById("gender_other_specify").value || null,
      academic_degree: document.getElementById("academic_degree").value,
      teaching_experience: document.getElementById("teaching_experience").value,
      mh_seminar_participation: document.getElementById("mh_seminar_participation").value,
      mh_illness_experience: document.getElementById("mh_illness_experience").value,
      mh_illness_experience_specify: document.getElementById("mh_illness_experience_specify").value || null
    };

    const payload = {
      consent_given: true,
      ...demographicsData,
      mhls_responses: answers,
      raw_payload: { demographics: demographicsData, mhls: answers }
    };

    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";
    showBanner("Submitting your responses...", false);

    try {
      const { error } = await supabaseClient.from("responses").insert([payload]);

      if (error) throw error;

      hideBanner();
      showStep("thankyou", 4);
    } catch (err) {
      console.error("Submission failed:", err);
      showBanner("Something went wrong submitting your response. Please try again.", true);
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit";
    }
  });

})();
