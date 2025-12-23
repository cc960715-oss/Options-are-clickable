// --- 1. 全域變數宣告 ---
let sheet1, sheet2, sheet3, sheet4, sheet5, sheet6;
let bulletImgR, bulletImgL;
let sheetNPC_sequence, backgroundImg;

let idleFrames = [], walkFrames = [], jumpFrames = [], flyFrames = [], attackFramesR = [], attackFramesL = [];
let npcIdleImg, npcInjuredImg, npcCryingImg, npcDeadImg;
let npc3Img, npc4Img, npc5Img; 

let gameState = "START"; 
let worldX = 0; 
let playerHealth = 100, maxHealth = 100;
let showHelp = false;

let npcX_orig = 600, npc3X_orig = 1200, npc4X_orig = 2200, npc5X_orig = 3200; 
let npcX, npcY, npc3X, npc3Y, npc4X, npc4Y, npc5X, npc5Y; 
let npcDamageStage = 0;

let showDialogue = false, dialogueText = "勇士您的名字叫什麼？";
let interactionDistance = 150, isNameEntered = false;
let npcReplyText = "", npcReplyTimer = 0;

let showQuiz = false, currentQuiz = null;
let quizResultText = "", quizResultTimer = 0;
let showHint = false, hintText = "";
let quizLocked = false; 

// 原始題庫備份
const originalNpc3 = [
  { q: "地球上最大的陸地面積是？\n(1) 非洲 (2) 亞洲 (3) 歐洲 (4) 北美洲", a: "2", note: "正確答案：(2) 亞洲", hint: "這塊大陸包含台灣、日本與泰國。" },
  { q: "水的化學式是什麼？\n(1) H2O (2) CO2 (3) O2 (4) H2SO4", a: "1", note: "正確答案：(1) H2O", hint: "它由兩個氫原子和一個氧原子組成。" },
  { q: "哪一位科學家提出了相對論？\n(1) 艾薩克·牛頓 (2) 亞歷山大·弗萊明 \n(3) 阿爾伯特·愛因斯坦 (4) 伽利略", a: "3", note: "正確答案：(3) 阿爾伯特·愛因斯坦", hint: "他是20世紀最著名的物理學家。" },
  { q: "世界上最長的河流是哪一條？\n(1) 長江 (2) 亞馬遜河 (3) 尼羅河 (4) 密西西比河", a: "3", note: "正確答案：(3) 尼羅河", hint: "它流經埃及，是非洲的母親河。" },
  { q: "人類登上月球的首次任務是哪一年？\n(1) 1963年 (2) 1969年 (3) 1972年 (4) 1980年", a: "2", note: "正確答案：(2) 1969年", hint: "這是在美國阿波羅計畫中實現的。" }
];

const originalNpc4 = [
  { q: "哪一顆行星因為大氣層中含有大量的甲烷，\n同時它是唯一一顆「躺著轉」的行星？\n(1) 海王星 (2) 天王星 (3) 土星 (4) 木星", a: "2", note: "答案：(2) 天王星", hint: "它是太陽系由內向外的第七顆行星。" },
  { q: "下列哪一種動物是哺乳類？\n(1) 鯊魚 (2) 海豚 (3) 烏龜 (4) 鱷魚", a: "2", note: "答案：(2) 海豚", hint: "牠們是高度智慧的海洋生物，能夠使用聲納定位。" },
  { q: "光年是用來測量什麼的單位？\n(1) 時間 (2) 距離 (3) 速度 (4) 質量", a: "2", note: "答案：(2) 距離", hint: "它表示光在一年中所行進的距離。" },
  { q: "下列哪一個元素在常溫下是液態？\n(1) 銀 (2) 汞 (3) 鉛 (4) 鋁", a: "2", note: "答案：(2) 汞", hint: "它常被用於溫度計中。" },
  { q: "世界上最大的沙漠是？\n(1) 撒哈拉沙漠 (2) 阿拉伯沙漠 (3) 戈壁沙漠 (4) 南極沙漠", a: "4", note: "答案：(4) 南極沙漠", hint: "它極寒乾燥。" }
];

let npc3Questions = [...originalNpc3];
let npc4Questions = [...originalNpc4];

let xPos, yPos, groundY, imgScale = 3, moveSpeed = 6, gravity = 0.5, jumpForce = -10, jumpVelocity = 0;
let isJumping = false, isFlying = false, state = 'idle', currentFrame = 0, facingDirection = 1;
let bullets = [], clouds = [], inputBox;

function preload() {
  sheet1 = loadImage('1020004-removebg-preview.png');
  sheet2 = loadImage('1020005-removebg-preview.png');
  sheet3 = loadImage('1110006-removebg-preview.png');
  sheet4 = loadImage('11120009-removebg-preview.png');
  sheet5 = loadImage('23051-removebg-preview.png');
  sheet6 = loadImage('230X51-removebg-preview.png');
  bulletImgR = loadImage('16-removebg-preview.png');
  bulletImgL = loadImage('24-removebg-preview.png');
  backgroundImg = loadImage('背景.jpg');
  sheetNPC_sequence = loadImage('33652-removebg-preview.png');
  npcIdleImg = loadImage('45X52-removebg-preview.png');
  npcInjuredImg = loadImage('4846_2-removebg-preview.png');
  npcCryingImg = loadImage('4846_1-removebg-preview.png');
  npcDeadImg = loadImage('4846-removebg-preview.png');
  npc3Img = loadImage('人物三.png');
  npc4Img = loadImage('人物四.png');
  npc5Img = loadImage('人物五.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  let groundLineY = height * 0.75;
  groundY = groundLineY - (60 * imgScale / 2);
  xPos = width * 0.25; yPos = groundY;
  
  npcY = groundLineY - (51 * imgScale / 2);
  npc3Y = groundLineY - (40 * imgScale / 2);
  npc4Y = groundLineY - (40 * imgScale / 2);
  npc5Y = groundLineY - (150 / 2);

  idleFrames = [{ img: sheet2, x: 0, y: 0, w: 50, h: 60 }];
  walkFrames = [{ img: sheet4, x: 0, y: 0, w: 47, h: 60 }, { img: sheet4, x: 47, y: 0, w: 47, h: 60 }];
  jumpFrames = [{ img: sheet3, x: 94, y: 0, w: 47, h: 60 }, { img: sheet3, x: 141, y: 0, w: 47, h: 60 }];
  flyFrames = [{ img: sheet1, x: 0, y: 0, w: 55, h: 60 }, { img: sheet1, x: 110, y: 0, w: 55, h: 60 }];

  inputBox = createInput('');
  inputBox.size(150, 30);
  inputBox.hide();
  for (let i = 0; i < 8; i++) clouds.push({ x_orig: random(0, 5000), y: random(height/2), s: random(0.5, 2) });
}

function draw() {
  if (gameState === "START") drawStartScreen();
  else if (gameState === "SUMMARY") drawSummaryScreen();
  else runGame();
}

function drawStartScreen() {
  background(30, 30, 50);
  textAlign(CENTER, CENTER);
  fill(255); textSize(40); text("冒險者指南", width/2, height * 0.15);
  fill(255, 20); rectMode(CENTER); rect(width/2, height/2, 600, 400, 20);
  fill(255); textSize(22); textAlign(LEFT);
  let startX = width/2 - 250;
  text("【移動】 A / D 或 左右方向鍵 (測驗中可移動)", startX, height/2 - 120);
  text("【跳躍】 空白鍵 (Space)", startX, height/2 - 80);
  text("【飛行】 長按 Shift 鍵", startX, height/2 - 40);
  text("【攻擊】 滑鼠左鍵點擊 (測驗中點選項回答)", startX, height/2);
  text("【作答】 點擊畫面按鈕 或 數字鍵 1-4", startX, height/2 + 40);
  text("【提示】 靠近綠衣女孩 (人物五)", startX, height/2 + 80);
  fill(255, 200, 0); textAlign(CENTER); textSize(24);
  text("點擊滑鼠或按任意鍵開始遊戲", width/2, height * 0.85);
}

function drawSummaryScreen() {
  background(20, 40, 60);
  fill(255, 240, 200, 30); rectMode(CENTER); rect(width/2, height/2, 600, 450, 30);
  textAlign(CENTER, CENTER); fill(255, 215, 0); textSize(50); text("冒險完成！", width/2, height/2 - 160);
  fill(255); textSize(28); text("最終健康狀態: " + playerHealth + " / 100", width/2, height/2 - 60);
  let rank = playerHealth >= 100 ? "傳奇賢者" : (playerHealth >= 80 ? "資深冒險者" : "普通勇者");
  fill(100, 255, 100); text("榮譽稱號: " + rank, width/2, height/2);
  fill(200); textSize(20); text("您已成功回答完所有挑戰題！", width/2, height/2 + 60);
  let btnX = width/2, btnY = height/2 + 150, btnW = 200, btnH = 60;
  if (mouseX > btnX - btnW/2 && mouseX < btnX + btnW/2 && mouseY > btnY - btnH/2 && mouseY < btnY + btnH/2) fill(255, 180, 0);
  else fill(180, 130, 0);
  rect(btnX, btnY, btnW, btnH, 15); fill(255); textSize(24); text("再次挑戰", btnX, btnY);
}

function resetGame() {
  playerHealth = 100; worldX = 0; yPos = groundY; jumpVelocity = 0; isJumping = false;
  gameState = "PLAY"; npcDamageStage = 0; quizLocked = false; showQuiz = false; currentQuiz = null;
  quizResultText = ""; quizResultTimer = 0; showHint = false; bullets = [];
  npc3Questions = [...originalNpc3]; npc4Questions = [...originalNpc4];
}

function runGame() {
  if (playerHealth <= 0) {
    background(0, 180); push();
    fill(255, 0, 0); textAlign(CENTER, CENTER); textSize(50); text("GAME OVER", width/2, height/2 - 50);
    let btnX = width/2, btnY = height/2 + 40, btnW = 150, btnH = 50;
    if (mouseX > btnX - btnW/2 && mouseX < btnX + btnW/2 && mouseY > btnY - btnH/2 && mouseY < btnY + btnH/2) fill(255, 200, 0);
    else fill(200, 150, 0);
    rectMode(CENTER); rect(btnX, btnY, btnW, btnH, 10); fill(0); textSize(24); text("重新挑戰", btnX, btnY); pop(); return;
  }
  if (npc3Questions.length === 0 && npc4Questions.length === 0 && !showQuiz && quizResultTimer === 0) { gameState = "SUMMARY"; return; }

  let bgX = - (worldX % width);
  imageMode(CORNER); image(backgroundImg, bgX, 0, width, height); image(backgroundImg, bgX + width, 0, width, height); imageMode(CENTER);
  for (let c of clouds) {
    let cx = (c.x_orig - worldX * 0.5) % width; if (cx < 0) cx += width;
    fill(255, 200); noStroke(); ellipse(cx, c.y, 60, 40);
  }
  npcX = npcX_orig - worldX; npc3X = npc3X_orig - worldX; npc4X = npc4X_orig - worldX; npc5X = npc5X_orig - worldX;
  handleKeyboardInput(); applyPhysics(); handleNPCInteractions(); animateSprite(); moveBullets(); drawNPCs(); drawSprite(); drawBullets(); drawUI();
}

function handleKeyboardInput() {
  // 修改：移除 showQuiz 鎖定，讓玩家在答題時也能去找人物五
  if (showDialogue || showHelp || playerHealth <= 0) return;
  let isMoving = false;
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) { 
    worldX -= moveSpeed; facingDirection = -1; state = 'walk'; isMoving = true;
  } else if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) { 
    worldX += moveSpeed; facingDirection = 1; state = 'walk'; isMoving = true;
  } 
  if (!isMoving) state = 'idle';
  if (keyIsDown(32) && !isJumping) { isJumping = true; jumpVelocity = jumpForce; }
  isFlying = !!keyIsDown(SHIFT);
}

function handleNPCInteractions() {
  if (abs(xPos - npcX) < interactionDistance && !isNameEntered) {
    showDialogue = true; inputBox.show(); inputBox.position(xPos - 75, yPos - 180); 
  } else { showDialogue = false; inputBox.hide(); }

  // 人物五提示邏輯
  if (abs(xPos - npc5X) < interactionDistance) {
    showHint = true;
    hintText = quizLocked ? "提示：" + (currentQuiz ? currentQuiz.hint : "") : "去找挑戰者觸發題目！";
  } else showHint = false;

  if (quizLocked) return;

  let nearNPC3 = abs(xPos - npc3X) < interactionDistance;
  let nearNPC4 = abs(xPos - npc4X) < interactionDistance;
  if (nearNPC3 && npc3Questions.length > 0) { showQuiz = true; quizLocked = true; currentQuiz = npc3Questions.shift(); }
  else if (nearNPC4 && npc4Questions.length > 0) { showQuiz = true; quizLocked = true; currentQuiz = npc4Questions.shift(); }
}

function checkAnswer(ans) {
  if (ans === currentQuiz.a) { 
    quizResultText = "正確！血量 +10 " + currentQuiz.note; playerHealth = min(playerHealth + 10, maxHealth);
  } else { 
    quizResultText = "錯誤！扣除 20 點血量。"; playerHealth -= 20; 
  }
  quizResultTimer = 120; showQuiz = false; 
}

function keyPressed() {
  if (gameState === "START") { gameState = "PLAY"; return; }
  if (gameState === "SUMMARY") return;
  if (showDialogue && keyCode === ENTER) {
    let n = inputBox.value().trim();
    if (n !== "") { isNameEntered = true; npcReplyText = n + " 歡迎！"; npcReplyTimer = 120; showDialogue = false; }
  }
  if (showQuiz && !quizResultText) { if (["1", "2", "3", "4"].includes(key)) checkAnswer(key); }
}

function mousePressed() {
  if (playerHealth <= 0 || gameState === "SUMMARY") {
    let btnX = width/2, btnY = (gameState === "SUMMARY") ? height/2 + 150 : height/2 + 40;
    let btnW = 200, btnH = 60;
    if (mouseX > btnX - btnW/2 && mouseX < btnX + btnW/2 && mouseY > btnY - btnH/2 && mouseY < btnY + btnH/2) { resetGame(); return; }
  }
  if (showQuiz && currentQuiz && !quizResultText) {
    for (let i = 1; i <= 4; i++) {
      let bx = width/2 - 150 + (i > 2 ? 300 : 0), by = 230 + (i % 2 === 0 ? 70 : 0);
      if (mouseX > bx - 70 && mouseX < bx + 70 && mouseY > by - 25 && mouseY < by + 25) { checkAnswer(i.toString()); return; }
    }
  }
  if (showHelp) { showHelp = false; return; }
  if (dist(mouseX, mouseY, 40, 40) < 20) { showHelp = true; return; }
  if (gameState === "START") { gameState = "PLAY"; return; }
  if (showDialogue || showQuiz) return;
  state = 'attack'; bullets.push({ sx: xPos, y: yPos, dir: facingDirection, img: facingDirection === 1 ? bulletImgR : bulletImgL });
  setTimeout(() => state = 'idle', 200);
}

function drawUI() {
  let hpWidth = 80, hpHeight = 10, hpX = xPos, hpY = yPos - 100; 
  push(); rectMode(CENTER); fill(50, 150); noStroke(); rect(hpX, hpY, hpWidth, hpHeight, 5); 
  if (playerHealth > 60) fill(0, 255, 0); else if (playerHealth > 30) fill(255, 165, 0); else fill(255, 0, 0); 
  rectMode(CORNER); let currentHpWidth = map(max(playerHealth, 0), 0, 100, 0, hpWidth);
  rect(hpX - hpWidth/2, hpY - hpHeight/2, currentHpWidth, hpHeight, 5);
  fill(0); textSize(14); textAlign(CENTER, CENTER); text("HP: " + playerHealth, xPos, hpY - 15); pop();
  push(); stroke(255); strokeWeight(2); fill(50, 150); ellipse(40, 40, 40); fill(255); noStroke(); textAlign(CENTER, CENTER); textSize(24); text("?", 40, 40); pop();

  if (showHelp) {
    push(); fill(255); rectMode(CENTER); rect(width/2, height/2, 400, 350, 20);
    fill(0); textAlign(LEFT); textSize(20); let sx = width/2 - 150;
    text("【鍵位說明】", width/2 - 60, height/2 - 120); text("• 移動: A / D 或 左右鍵", sx, height/2 - 70);
    text("• 跳躍: 空白鍵", sx, height/2 - 30); text("• 飛行: 長按 Shift", sx, height/2 + 10);
    text("• 攻擊: 滑鼠左鍵", sx, height/2 + 50); textAlign(CENTER); fill(200, 0, 0); text("( 點擊任意處關閉 )", width/2, height/2 + 140); pop();
  }
  if (showDialogue) { fill(0); textAlign(CENTER); textSize(20); text(dialogueText, npcX, npcY - 140); }
  if (npcReplyTimer > 0) { fill(0, 120, 0); textAlign(CENTER); text(npcReplyText, npcX, npcY - 140); npcReplyTimer--; }
  if (showQuiz && currentQuiz) {
    push(); rectMode(CENTER); fill(255, 250); stroke(0); strokeWeight(2); rect(width/2, 200, 640, 320, 15);
    noStroke(); fill(0); textAlign(CENTER, CENTER); textSize(22); text(currentQuiz.q, width/2, 110);
    for (let i = 1; i <= 4; i++) {
      let bx = width/2 - 150 + (i > 2 ? 300 : 0), by = 230 + (i % 2 === 0 ? 70 : 0);
      if (mouseX > bx - 70 && mouseX < bx + 70 && mouseY > by - 25 && mouseY < by + 25) fill(200, 230, 255); else fill(240);
      stroke(0); rect(bx, by, 140, 50, 10); fill(0); noStroke(); textSize(18); text(" (" + i + ")", bx, by + 5);
    } pop();
  }
  if (quizResultTimer > 0) {
    push(); rectMode(CENTER); fill(255, 255, 0); stroke(0); strokeWeight(2); rect(width/2, height/2, 550, 60, 5); 
    noStroke(); fill(200, 0, 0); textAlign(CENTER, CENTER); textSize(20); text(quizResultText, width/2, height/2); pop();
    quizResultTimer--; if (quizResultTimer === 0) { quizResultText = ""; quizLocked = false; currentQuiz = null; }
  }
  if (showHint) { fill(255, 150, 0); stroke(0); textAlign(CENTER); textSize(20); text(hintText, npc5X, npc5Y - 130); }
}

function drawNPCs() {
  push(); translate(npcX, npcY); scale(-1, 1);
  let img = [npcIdleImg, npcInjuredImg, npcCryingImg, npcDeadImg][npcDamageStage];
  image(img, 0, 0, 45 * imgScale, 52 * imgScale); pop();
  image(npc3Img, npc3X, npc3Y, 40 * imgScale, 40 * imgScale);
  image(npc4Img, npc4X, npc4Y, 40 * imgScale, 40 * imgScale);
  image(npc5Img, npc5X, npc5Y, 100, 150);
}

function drawSprite() {
  let f = state === 'walk' ? walkFrames[currentFrame] : idleFrames[0];
  if (isJumping) f = jumpFrames[0];
  push(); translate(xPos, yPos); scale(facingDirection, 1);
  image(f.img, 0, 0, f.w * imgScale, f.h * imgScale, f.x, f.y, f.w, f.h); pop();
}

function moveBullets() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    let b = bullets[i]; b.sx += b.dir * 15;
    if (dist(b.sx, b.y, npcX, npcY) < 50) { bullets.splice(i, 1); if (npcDamageStage < 3) npcDamageStage++; } 
    else if (b.sx < 0 || b.sx > width) bullets.splice(i, 1);
  }
}

function drawBullets() { for (let b of bullets) image(b.img, b.sx, b.y, 24 * imgScale, 10 * imgScale); }
function applyPhysics() {
  if (isJumping || isFlying || yPos < groundY) {
    jumpVelocity += gravity; if (isFlying) jumpVelocity = -2;
    yPos += jumpVelocity; if (yPos >= groundY) { yPos = groundY; jumpVelocity = 0; isJumping = false; }
  }
}
function animateSprite() { if (frameCount % 10 === 0) currentFrame = (currentFrame + 1) % 2; }