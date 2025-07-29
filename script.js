window.onload = function() {
  // 取得暱稱、卡片、蓋章狀態的 localStorage key
  const STORAGE_KEY = "bingoData";

  const nicknameSection = document.getElementById("nicknameSection");
  const bingoSection = document.getElementById("bingoSection");
  const nicknameInput = document.getElementById("nicknameInput");
  const confirmNicknameBtn = document.getElementById("confirmNicknameBtn");
  const displayNickname = document.getElementById("displayNickname");
  const bingoCard = document.getElementById("bingoCard");
  const resetBtn = document.getElementById("resetBtn");

  let bingoData = null;

  function getRandomNumbers(min, max, count) {
    const nums = [];
    while (nums.length < count) {
      const num = Math.floor(Math.random() * (max - min + 1)) + min;
      if (!nums.includes(num)) nums.push(num);
    }
    return nums;
  }

  function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bingoData));
  }

  function loadData() {
    const dataStr = localStorage.getItem(STORAGE_KEY);
    if (!dataStr) return null;
    try {
      return JSON.parse(dataStr);
    } catch {
      return null;
    }
  }

  function generateCard() {
    return {
      B: getRandomNumbers(1, 12, 4),
      I: getRandomNumbers(13, 24, 4),
      N: getRandomNumbers(25, 36, 4),
      G: getRandomNumbers(37, 48, 4),
    };
  }

  function renderCard() {
    bingoCard.innerHTML = "";
    for (let row = 0; row < 4; row++) {
      const tr = document.createElement("tr");
      for (let col = 0; col < 4; col++) {
        const td = document.createElement("td");
        if (row === 2 && col === 2) {
          td.textContent = "FREE";
          td.className = "free marked";
        } else {
          const val = bingoData.card[["B", "I", "N", "G"][col]][row];
          td.textContent = val;
        }
        if (bingoData.marks[row][col]) {
          td.classList.add("marked");
        }

        td.addEventListener("click", () => {
          if (row === 2 && col === 2) return; // FREE格不取消蓋章
          bingoData.marks[row][col] = !bingoData.marks[row][col];
          renderCard();
          saveData();
        });
        tr.appendChild(td);
      }
      bingoCard.appendChild(tr);
    }
  }

  function init() {
    bingoData = loadData();
    if (bingoData && bingoData.nickname) {
      nicknameSection.style.display = "none";
      bingoSection.style.display = "block";
      displayNickname.textContent = bingoData.nickname;
      renderCard();
    } else {
      nicknameSection.style.display = "block";
      bingoSection.style.display = "none";
    }
  }

  confirmNicknameBtn.addEventListener("click", () => {
    const name = nicknameInput.value.trim();
    if (!name) {
      alert("請輸入暱稱");
      return;
    }
    bingoData = {
      nickname: name,
      card: generateCard(),
      marks: Array(4).fill(null).map(() => Array(4).fill(false)),
    };
    bingoData.marks[2][2] = true; // FREE格預設蓋章
    saveData();
    init();
  });

  resetBtn.addEventListener("click", () => {
    if (confirm("確定要重置暱稱和賓果卡嗎？")) {
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    }
  });

  init();
};