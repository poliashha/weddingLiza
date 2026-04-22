
const TELEGRAM_BOT_TOKEN =
  "vk1.a.KVlhuEkokxON5mbZjulmq2_FQ-QCO_voY-GD_b7_INDlTyVKohXvbq5rtRkslt69YoP1MT5S39eLddFK0XgYDRVDRtlTwMGCIdRwzkSlotx4veTAkpuN928yR6KE4cq-h1zFPd64WINmHERHjF9ZDiKxkyNwukRM5zV3-6N2W56W9xbNA-CzfWaqhTaMV3SgHp7z6luoeIoUoDcEPDez9w";
const TELEGRAM_CHAT_ID = "224996524";
const API = `https://api.vk.com/method/messages.send`;

async function sendQuestionnaire(event) {
  event.preventDefault();
  const form = event.target;
  const formBth = document.querySelector(".button");
  const formSendResult = document.querySelector(".form-send");
  formSendResult.textContent = "";

  const formData = new FormData(form);

  const name = formData.get("name");
  const presence = formData.get("presence");
  const drinks = formData.getAll("drinks");

  const text = `Гость: ${name},\nбудет присутствовать: ${presence},\nнапитки: ${drinks.join(", ")}`;

  try {
    formBth.textContent = "Отправка...";
    const response = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        user_id: TELEGRAM_CHAT_ID,
        random_id: Date.now(),
        message: text,
        access_token: TELEGRAM_BOT_TOKEN,
        v: "5.131",
      }),
    });

    if (response.ok) {
      formSendResult.textContent = "Спасибо! Анкета отправлена.";

      form.reset();
    } else {
      throw new Error(response.statusText);
    }
  } catch (error) {
    console.error(error);
    formSendResult.textContent = "Спасибо! Анкета отправлена.";
  } finally {
    formBth.textContent = "Подтверидить присутсвие";
  }
}

const nameInput = document.getElementById("name");
const errorElement = document.getElementById("error-text");

nameInput.addEventListener("invalid", function (event) {
  event.preventDefault();
  if (this.validity.valueMissing) {
    errorElement.classList.add("show");
  }
});

nameInput.addEventListener("input", function () {
  if (this.value.trim() !== "") {
    errorElement.classList.remove("show");
  }
});

document.querySelectorAll('input[name="presence"]').forEach((radio) => {
  radio.addEventListener("invalid", function (e) {
    e.preventDefault();
    document.getElementById("presenceError").classList.add("show");
    return false;
  });
});

document.querySelectorAll('input[name="presence"]').forEach((radio) => {
  radio.addEventListener("change", function () {
    document.getElementById("presenceError").classList.remove("show");
  });
});

const audioBtn = document.getElementById("audioBtn");

function handleScroll() {
  // Получаем позицию кнопки относительно документа
  const btnRect = audioBtn.getBoundingClientRect();
  const scrollY = window.scrollY;

  // Исходная позиция кнопки (запоминаем при первом вызове)
  if (!audioBtn.dataset.originalTop) {
    audioBtn.dataset.originalTop = btnRect.top + scrollY;
  }

  const originalTop = parseFloat(audioBtn.dataset.originalTop);

  // Если докрутили до кнопки или ниже
  if (scrollY >= originalTop) {
    audioBtn.classList.add("fixed");
  } else {
    audioBtn.classList.remove("fixed");
  }
}

// Слушаем событие прокрутки
window.addEventListener("scroll", handleScroll);
// Вызываем один раз при загрузке, чтобы установить начальное состояние
handleScroll();

function startCountdown(targetDate) {
  function updateTimer() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      document.getElementById("timer").style.display = "none";
      document.getElementById("datetime").textContent = "Мы стали семьей!";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").textContent = days;
    document.getElementById("hours").textContent = hours;
    document.getElementById("minutes").textContent = minutes;
    document.getElementById("seconds").textContent = seconds;
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

const newYear = new Date(2026, 7, 7, 16, 0, 0).getTime();
startCountdown(newYear);

const audio = new Audio("./audio/love.mp3");
audio.loop = true;
audio.volume = 0.5;

const btn = document.getElementById("audioBtn");
const img = btn.querySelector(".music");
let isPlaying = false;

// Пытаемся запустить музыку при загрузке
audio
  .play()
  .then(() => {
    isPlaying = true;
  })
  .catch(() => {
    img.data = "./img/off.svg";
  });

// Управление по клику
btn.addEventListener("click", () => {
  if (isPlaying) {
    audio.pause();
    isPlaying = false;
    img.data = "./img/off.svg";
  } else {
    audio.play();
    isPlaying = true;
    img.data = "./img/on.svg";
  }
});

// Если автовоспроизведение заблокировано - запускаем по первому клику в любом месте
document.body.addEventListener(
  "click",
  function firstClick() {
    if (!isPlaying && audio.paused) {
      audio.play();
      isPlaying = true;
      img.data = "./img/on.svg";
    }
    document.body.removeEventListener("click", firstClick);
  },
  { once: true },
);

const button = document.querySelector(".button");
button.addEventListener("touchstart", function (e) {
  this.classList.add("touch-pressed");
});

button.addEventListener("touchend", function (e) {
  this.classList.remove("touch-pressed");
});

function initScrollAnimation() {
  const containers = document.querySelectorAll(".first");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  });
  containers.forEach((container) => {
    observer.observe(container);
  });
}
document.addEventListener("DOMContentLoaded", initScrollAnimation);

const urlParams = new URLSearchParams(window.location.search);
const nameParam = urlParams.get("name");
const arr = ["Мама", "Любовь", "Лариса", "Екатерина", "Полина"];
if (nameParam) {
  const decodedName = decodeURIComponent(nameParam.replace(/\+/g, " "));

  

  if (decodedName.includes(" ")) {
    document.getElementById("greeting").textContent =
      `Уважаемые ${decodedName},`;
  } else {
    if (arr.includes(decodedName)) {
      document.getElementById("greeting").textContent =
        `Уважаемая ${decodedName},`;
    } else
      document.getElementById("greeting").textContent =
        `Уважаемый ${decodedName},`;
  }
} else {
  document.getElementById("greeting").textContent = `Дорогие гости!`;
}
