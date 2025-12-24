const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

let W, H, stars;

function resize(){
  W = canvas.width = Math.floor(window.innerWidth * devicePixelRatio);
  H = canvas.height = Math.floor(window.innerHeight * devicePixelRatio);
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";

  // generate stars
  const count = Math.floor((window.innerWidth * window.innerHeight) / 9000);
  stars = Array.from({length: count}, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: (Math.random() * 1.4 + 0.2) * devicePixelRatio,
    a: Math.random() * 0.8 + 0.2,
    tw: Math.random() * 0.02 + 0.005,
    vy: (Math.random() * 0.15 + 0.05) * devicePixelRatio
  }));
}
window.addEventListener("resize", resize);
resize();

function tick(){
  ctx.clearRect(0,0,W,H);

  // small vignette
  const grad = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W,H)/1.2);
  grad.addColorStop(0, "rgba(0,0,0,0)");
  grad.addColorStop(1, "rgba(0,0,0,0.35)");
  ctx.fillStyle = grad;
  ctx.fillRect(0,0,W,H);

  for(const s of stars){
    s.a += s.tw * (Math.random() > 0.5 ? 1 : -1);
    s.a = Math.max(0.15, Math.min(1, s.a));

    s.y += s.vy;
    if(s.y > H) s.y = 0;

    ctx.beginPath();
    ctx.fillStyle = `rgba(255,255,255,${s.a})`;
    ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
    ctx.fill();
  }

  requestAnimationFrame(tick);
}
tick();

// ===== Music controls =====
const audio = document.getElementById("bgm");
const toggleBtn = document.getElementById("toggleBtn");
const vol = document.getElementById("vol");
const statusEl = document.getElementById("status");

audio.volume = Number(vol.value);

// Autoplay note: browsers require user gesture, so we start on first click anywhere
let started = false;
function ensureStart(){
  if(started) return;
  started = true;
  audio.play().catch(()=>{});
  window.removeEventListener("click", ensureStart);
}
window.addEventListener("click", ensureStart);

toggleBtn.addEventListener("click", async () => {
  if(audio.paused){
    await audio.play().catch(()=>{});
  }else{
    audio.pause();
  }
  renderStatus();
});

vol.addEventListener("input", () => {
  audio.volume = Number(vol.value);
});

function renderStatus(){
  const on = !audio.paused;
  statusEl.textContent = on ? "Music ON" : "Music OFF";
  toggleBtn.textContent = on ? "🔊" : "🔇";
}
renderStatus();
