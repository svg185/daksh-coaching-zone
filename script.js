const menuBtn = document.getElementById("menuBtn");
const mainNav = document.getElementById("mainNav");

if (menuBtn && mainNav) {
  menuBtn.addEventListener("click", () => {
    mainNav.classList.toggle("open");
  });
}

const counters = document.querySelectorAll("[data-count]");
const observer = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const el = entry.target;
      const target = Number(el.getAttribute("data-count"));
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 40));

      const tick = () => {
        current += step;
        if (current >= target) {
          el.textContent = `${target}+`;
          return;
        }

        el.textContent = `${current}+`;
        requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  },
  { threshold: 0.4 }
);

counters.forEach((counter) => observer.observe(counter));

const openSeatFormBtn = document.getElementById("openSeatForm");
const closeSeatFormBtn = document.getElementById("closeSeatForm");
const seatModal = document.getElementById("seatModal");
const seatModalBackdrop = document.getElementById("seatModalBackdrop");
const seatForm = document.getElementById("seatForm");
const seatSubmitBtn = document.getElementById("seatSubmitBtn");

const toggleSeatModal = (isOpen) => {
  if (!seatModal) {
    return;
  }

  seatModal.classList.toggle("open", isOpen);
  seatModal.setAttribute("aria-hidden", String(!isOpen));
  document.body.classList.toggle("modal-open", isOpen);
};

if (openSeatFormBtn && closeSeatFormBtn && seatModal && seatModalBackdrop) {
  openSeatFormBtn.addEventListener("click", (event) => {
    event.preventDefault();
    toggleSeatModal(true);
  });

  closeSeatFormBtn.addEventListener("click", () => toggleSeatModal(false));
  seatModalBackdrop.addEventListener("click", () => toggleSeatModal(false));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      toggleSeatModal(false);
    }
  });
}

if (seatForm && seatSubmitBtn) {
  seatForm.addEventListener("submit", () => {
    seatSubmitBtn.textContent = "Submitting...";
    seatSubmitBtn.disabled = true;
  });
}

const notesModal = document.getElementById("notesModal");
const notesModalBackdrop = document.getElementById("notesModalBackdrop");
const closeNotesFormBtn = document.getElementById("closeNotesForm");
const notesAccessForm = document.getElementById("notesAccessForm");
const notesAccessSubmitBtn = document.getElementById("notesAccessSubmitBtn");
const selectedNoteTitleInput = document.getElementById("selectedNoteTitle");
const selectedNoteUrlInput = document.getElementById("selectedNoteUrl");
const selectedNoteLabel = document.getElementById("selectedNoteLabel");
const notesPasswordInput = document.getElementById("notesPassword");
const notesFormError = document.getElementById("notesFormError");
const noteAccessButtons = document.querySelectorAll(".note-access-btn");

const NOTES_PASSWORD = "Dakshians@123";
const NOTES_NOTIFICATION_EMAIL = "kumarkartik2146@gmail.com";
const INVALID_NOTE_URLS = ["", "#"];

const toggleNotesModal = (isOpen) => {
  if (!notesModal) {
    return;
  }

  notesModal.classList.toggle("open", isOpen);
  notesModal.setAttribute("aria-hidden", String(!isOpen));
  document.body.classList.toggle("modal-open", isOpen);
};

const resetNotesFormState = () => {
  if (notesFormError) {
    notesFormError.textContent = "";
  }

  if (notesAccessSubmitBtn) {
    notesAccessSubmitBtn.textContent = "Verify & Open Notes";
    notesAccessSubmitBtn.disabled = false;
  }

  if (notesPasswordInput) {
    notesPasswordInput.value = "";
  }
};

if (noteAccessButtons.length > 0) {
  noteAccessButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const noteTitle = button.getAttribute("data-note-title") || "Untitled Note";
      const noteUrl = button.getAttribute("data-note-url") || "#";

      if (selectedNoteTitleInput) {
        selectedNoteTitleInput.value = noteTitle;
      }

      if (selectedNoteUrlInput) {
        selectedNoteUrlInput.value = noteUrl;
      }

      if (selectedNoteLabel) {
        selectedNoteLabel.textContent = `Selected: ${noteTitle}`;
      }

      resetNotesFormState();
      toggleNotesModal(true);
    });
  });
}

if (closeNotesFormBtn && notesModalBackdrop) {
  closeNotesFormBtn.addEventListener("click", () => {
    toggleNotesModal(false);
  });
  notesModalBackdrop.addEventListener("click", () => {
    toggleNotesModal(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      toggleNotesModal(false);
    }
  });
}

if (notesAccessForm && notesAccessSubmitBtn) {
  notesAccessForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(notesAccessForm);
    const enteredPassword = notesPasswordInput ? notesPasswordInput.value.trim() : "";

    if (enteredPassword !== NOTES_PASSWORD) {
      if (notesFormError) {
        notesFormError.textContent = "Wrong password. Access denied.";
      }
      return;
    }

    if (notesFormError) {
      notesFormError.textContent = "";
    }

    notesAccessSubmitBtn.textContent = "Verifying...";
    notesAccessSubmitBtn.disabled = true;

    const noteTitle = String(formData.get("Selected Note Title") || "Untitled Note");
    const noteUrl = String(formData.get("Selected Note Url") || "#");
    const studentName = String(formData.get("Student Name") || "");
    const className = String(formData.get("Class Name") || "");
    const email = String(formData.get("E-mail") || "");

    const isInvalidUrl = INVALID_NOTE_URLS.includes(noteUrl);

    if (isInvalidUrl) {
      if (notesFormError) {
        notesFormError.textContent =
          "Notes link missing hai. data-note-url me actual file link update karein.";
      }
      notesAccessSubmitBtn.textContent = "Verify & Open Notes";
      notesAccessSubmitBtn.disabled = false;
      return;
    }

    const noteWindow = window.open("", "_blank", "noopener,noreferrer");

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${NOTES_NOTIFICATION_EMAIL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: "Notes Access Alert - Daksh Coaching Zone",
          "Student Name": studentName,
          "Class Name": className,
          "E-mail": email,
          "Selected Note Title": noteTitle,
          "Selected Note Url": noteUrl,
          "Access Time": new Date().toLocaleString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Form submit failed");
      }

      if (noteWindow) {
        noteWindow.location.href = noteUrl;
      } else {
        window.location.href = noteUrl;
      }
      notesAccessForm.reset();
      toggleNotesModal(false);
    } catch (error) {
      if (noteWindow) {
        noteWindow.close();
      }
      if (notesFormError) {
        notesFormError.textContent = "Unable to verify right now. Please try again.";
      }
      notesAccessSubmitBtn.textContent = "Verify & Open Notes";
      notesAccessSubmitBtn.disabled = false;
    }
  });
}
