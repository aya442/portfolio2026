// 星空エフェクト（流れ星＋マウス揺らぎ付き）
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');

let stars = [];
let shootingStars = [];
let mouse = { x: null, y: null };

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function createStars(count) {
  stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.2 + 0.2,
      speed: Math.random() * 0.05 + 0.01,
      baseX: 0,
      baseY: 0,
    });
  }
}

function drawStars() {
  ctx.fillStyle = '#fff';
  for (let star of stars) {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function updateStars() {
  for (let star of stars) {
    star.y += star.speed;
    if (star.y > canvas.height) {
      star.y = 0;
      star.x = Math.random() * canvas.width;
    }
    // マウス揺らぎ効果
    if (mouse.x !== null) {
      let dx = star.x - mouse.x;
      let dy = star.y - mouse.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        star.x += dx / dist * 0.2;
        star.y += dy / dist * 0.2;
      }
    }
  }
}

// ===== 流れ星生成 =====
function createShootingStar() {
  let startX = Math.random() * canvas.width;
  let startY = Math.random() * canvas.height * 0.4;
  let speed = Math.random() * 10 + 10;

  shootingStars.push({
    x: startX,
    y: startY,
    length: Math.random() * 80 + 50,
    speedX: speed,
    speedY: speed / 3,
    opacity: 1,
  });
}

function drawShootingStars() {
  for (let i = shootingStars.length - 1; i >= 0; i--) {
    const s = shootingStars[i];
    ctx.beginPath();
    const gradient = ctx.createLinearGradient(s.x, s.y, s.x - s.length, s.y - s.length / 3);
    gradient.addColorStop(0, `rgba(255,255,255,${s.opacity})`);
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(s.x - s.length, s.y - s.length / 3);
    ctx.stroke();

    s.x += s.speedX;
    s.y += s.speedY;
    s.opacity -= 0.01;

    if (s.opacity <= 0) {
      shootingStars.splice(i, 1);
    }
  }
}

// ===== メインアニメーション =====
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawStars();
  updateStars();
  drawShootingStars();

  // ランダムに流れ星を生成
  if (Math.random() < 0.004) { // 約1〜2秒に1回の確率
    createShootingStar();
  }

  requestAnimationFrame(animate);
}

// ===== マウス効果 =====
canvas.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

canvas.addEventListener('mouseleave', () => {
  mouse.x = null;
  mouse.y = null;
});

// ===== 初期化 =====
createStars(200);
animate();
