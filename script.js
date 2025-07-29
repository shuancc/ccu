const nicknameSection = document.getElementById("nicknameSection");
const bingoSection = document.getElementById("bingoSection");
const nicknameInput = document.getElementById("nicknameInput");
const confirmBtn = document.getElementById("confirmNicknameBtn");
const resetBtn = document.getElementById("resetBtn");
const displayNickname = document.getElementById("displayNickname");
const bingoCard = document.getElementById("bingoCard");

let card = [];
let marked = [];

function generateBingoCard() {
  card = [];
  marked = [];

  // 範圍分配：1–12, 13–24, 25–37, 38–48
  const ranges = [
    [1, 12],
    [13, 24],
    [25, 37],
    [38, 48]
  ];

  for (let col = 0; col < 4; col++) {
    let nums = [];
    while (nums.length < 4) {
      let n = Math.floor(Math.random() * (ranges[col][1] - ranges[col][0] + 1)) + ranges[col][0];
      if (!nums.includes(n)) nums.push(n);
    }
    card.push(nums);
  }

  // 轉置成 row 優先陣列，並建立 marked 狀態
  let transposed = [[], [], [], []];
  for (let i = 0; i < 4; i++) {
    marked[i] = [];
    for (let j = 0; j < 4; j++) {
      transposed[i][j] = card[j][i];
      marked[i][j] = false;
    }
  }

  return transposed;
}

function renderCard(data) {
  bingoCard.innerHTML = "";
  data.forEach((row, rowIndex) => {
    const tr = document.createElement("tr");
    row.forEach((num, colIndex) => {
      const td = document.createElement("td");
      td.textContent = num;
      td.classList.add("cell");
      if (marked[rowIndex][colIndex]) td.classList.add("marked");

      td.addEventListener("click", () => {
        marked[rowIndex][colIndex] = !marked[rowIndex][colIndex];
        td.classList.toggle("marked");

        const lines = countBingoLines(marked);
        document.getElementById("line-count").textContent = `你目前有 ${lines} 條賓果線`;
      });

      tr.appendChild(td);
    });
    bingoCard.appendChild(tr);
  });
}

function countBingoLines(marked) {
  let lines = 0;

  // 檢查橫列
  for (let i = 0; i < 4; i++) {
    if (marked[i].every(cell => cell)) lines++;
  }

  // 檢查直行
  for (let j = 0; j < 4; j++) {
    if (marked.every(row => row[j])) lines++;
  }

  // 檢查對角線
  if ([0,1,2,3].every(i => marked[i][i])) lines++;
  if ([0,1,2,3].every(i => marked[i][3 - i])) lines++;

  return lines;
}

// 處理暱稱確認
confirmBtn.addEventListener("click", () => {
  const nickname = nicknameInput.value.trim();
  if (!nickname) return;

  // 存暱稱 & 卡片
  localStorage.setItem("nickname", nickname);
  const generatedCard = generateBingoCard();
  localStorage.setItem("bingoCard", JSON.stringify(generatedCard));

  displayNickname.textContent = nickname;
  nicknameSection.style.display = "none";
  bingoSection.style.display = "block";
  renderCard(generatedCard);
});

// 重設
resetBtn.addEventListener("click", () => {
  localStorage.clear();
  location.reload();
});

// 初始載入：如果 localStorage 有資料就自動載入
window.addEventListener("DOMContentLoaded", () => {
  const savedNickname = localStorage.getItem("nickname");
  const savedCard = localStorage.getItem("bingoCard");

  if (savedNickname && savedCard) {
    displayNickname.textContent = savedNickname;
    card = JSON.parse(savedCard);

    // 初始化 marked
    marked = Array(4).fill(null).map(() => Array(4).fill(false));

    nicknameSection.style.display = "none";
    bingoSection.style.display = "block";
    renderCard(card);
  }
});