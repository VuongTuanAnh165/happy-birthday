// Data & Config
const LOCAL_ASSETS = [
    'assets/images/1.webp',
    'assets/images/2.webp',
    'assets/images/3.webp',
    'assets/images/4.webp',
    'assets/images/5.webp',
    'assets/images/6.webp',
    'assets/images/7.webp',
    'assets/images/8.webp',
    'assets/images/9.webp',
    'assets/images/10.webp',
    'assets/images/11.webp',
    'assets/images/12.webp',
    'assets/images/13.webp',
    'assets/images/14.webp',
    'assets/images/18.webp',
    'assets/images/19.webp',
    'assets/images/20.webp',
    'assets/images/21.webp',
    'assets/images/22.webp',
    'assets/images/23.webp',
    'assets/videos/1.mp4',
    'assets/videos/2.mp4',
    'assets/videos/3.mp4',
    'assets/videos/4.mp4',
    'assets/videos/5.mp4',
    'assets/videos/6.mp4',
    'assets/videos/7.mp4',
    'assets/videos/8.mp4',
    'assets/videos/9.mp4',
    'assets/videos/10.mp4',
    'assets/videos/11.mp4',
    'assets/videos/12.mp4',
    'assets/videos/13.mp4',
    'assets/videos/14.mp4',
    'assets/videos/15.mp4',
    'assets/videos/16.mp4',
    'assets/videos/17.mp4',
    'assets/videos/18.mp4',
    'assets/videos/19.mp4',
    'assets/videos/20.mp4'
];

const WISH_MESSAGE = "Sinh nhật hạnh phúc nha! ✨";

const POLAROID_CAPTIONS = [
    "😊", "❤️", "✨", "🌸", "🌻", 
    "🥰", "💖", "🎂", "🎉", "🎈",
    "😘", "🧸", "🎀", "💕"
];

// DOM Elements
const scene1 = document.getElementById('scene-1');
const scene2 = document.getElementById('scene-2');
const btnOpenGift = document.getElementById('btn-open-gift');
const btnInvite = document.getElementById('btn-invite');
const bgMusic = document.getElementById('bg-music');
const wishGlassPanel = document.querySelector('.wish-glass-panel');
const wishTextEl = document.getElementById('wish-text');
const cursorEl = document.getElementById('cursor');
const cakeContainer = document.getElementById('cake-container');
const candleFlame = document.getElementById('candle-flame');
const candleHalo = document.getElementById('candle-halo');
const btnBlowCandle = document.getElementById('btn-blow-candle');
const btnMoreMagic = document.getElementById('btn-more-magic');
const canvas = document.getElementById('fireworks-canvas');
const polaroidContainer = document.getElementById('polaroid-container');

const ctx = canvas.getContext('2d');
let canvasWidth, canvasHeight;

function resizeCanvas() {
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// ==========================================
// PHASE 0: Preload Assets (chạy ngay từ đầu)
// ==========================================
function preloadAssets() {
    const videoAssets = [];
    
    LOCAL_ASSETS.forEach(src => {
        if (src.endsWith('.webp') || src.endsWith('.jpg') || src.endsWith('.png')) {
            const img = new Image();
            img.src = src;
        } else if (src.endsWith('.mp4') || src.endsWith('.webm') || src.endsWith('.mov')) {
            videoAssets.push(src);
        }
    });

    // Preload video ngầm tuần tự (sau khi trang đã render UI đầu) để không ảnh hưởng hiệu năng
    if (videoAssets.length > 0) {
        setTimeout(() => {
            preloadVideosSequentially(videoAssets, 0);
        }, 1500); // Đợi 1.5s để các animation khởi tạo đầu trang không bị giật
    }
}

function preloadVideosSequentially(videos, index) {
    if (index >= videos.length) return;
    
    fetch(videos[index], { cache: 'force-cache' })
        .then(() => {
            preloadVideosSequentially(videos, index + 1);
        })
        .catch(() => {
            // Bỏ qua lỗi và tiếp tục load video khác
            preloadVideosSequentially(videos, index + 1);
        });
}

preloadAssets();

// ==========================================
// V4: Cinematic Dust & Hologram Box
// ==========================================
function createDust() {
    const container = document.getElementById('dust-container');
    if (!container) return;
    for(let i=0; i<40; i++) {
        const dust = document.createElement('div');
        dust.className = 'dust';
        dust.style.left = `${Math.random() * 100}%`;
        dust.style.top = `${Math.random() * 100}%`;
        const size = Math.random() * 3 + 1;
        dust.style.width = `${size}px`;
        dust.style.height = `${size}px`;
        dust.style.animationDelay = `${Math.random() * 5}s`;
        dust.style.animationDuration = `${5 + Math.random() * 5}s`;
        container.appendChild(dust);
    }
}
createDust();

const giftBox = document.getElementById('btn-open-gift');
const glare = document.querySelector('.hologram-glare');

giftBox.addEventListener('mousemove', (e) => {
    const rect = giftBox.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const tiltX = (y - centerY) / centerY * -15; // Âm để nghiêng tự nhiên
    const tiltY = (centerX - x) / centerX * -15;
    
    giftBox.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.1)`;
    
    if (glare) {
        const glareX = (x / rect.width) * 100;
        const glareY = (y / rect.height) * 100;
        glare.style.backgroundPosition = `${glareX}% ${glareY}%`;
    }
});

giftBox.addEventListener('mouseleave', () => {
    giftBox.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
    if (glare) glare.style.backgroundPosition = `-100% -100%`;
});

// V5: Interactive Spotlight ở Scene 1
document.addEventListener('mousemove', (e) => {
    if (scene1.classList.contains('active')) {
        const spotlight = document.querySelector('.spotlight');
        if (spotlight) {
            // Giới hạn biên độ di chuyển
            const x = (e.clientX / window.innerWidth - 0.5) * 40; 
            spotlight.style.transform = `translateX(-50%) skewX(-20deg) translateX(${x}px)`;
        }
    }
});

// ==========================================
// PHASE 1: Mở quà Cinematic (Nâng cấp v4)
// ==========================================
function openGift() {
    // Phát nhạc ngay lập tức khi click
    bgMusic.play().catch(e => console.log("Audio play prevented", e));
    
    // 1. Nắp bật tung lên cao + fade [0ms]
    const lid = document.querySelector('.gift-lid');
    lid.style.transform = 'translateY(-120px) rotate(25deg) scale(1.1)';
    lid.style.opacity = '0';
    btnInvite.style.opacity = '0';
    btnInvite.style.pointerEvents = 'none';
    
    // 2. Light burst + particles [200ms]
    setTimeout(() => {
        const lightBurst = document.querySelector('.gift-light-burst');
        if (lightBurst) lightBurst.classList.add('active');
        createGiftParticles();
    }, 200);
    
    // 3. Flash IN [1400ms] — 0.25s để đạt peak trắng
    const flash = document.getElementById('screen-flash');
    setTimeout(() => {
        if (flash) flash.classList.add('active');
    }, 1400);
    
    // 4. Scene swap TẠI ĐỈNH flash [1650ms] — bị che hoàn toàn bởi màn trắng
    setTimeout(() => {
        scene1.classList.remove('active');
        // Scene 2 xuất hiện NGAY LẬP TỨC (không fade 2.5s)
        scene2.style.transition = 'none';
        scene2.classList.add('active');
        scene2.offsetHeight; // Force reflow để apply instant
        scene2.style.transition = ''; // Restore cho lần sau
        cakeContainer.classList.remove('hidden');
    }, 1650);
    
    // 5. Flash OUT [1900ms] — 0.6s fade nhẹ nhàng, lộ dần scene 2 đã sẵn sàng
    setTimeout(() => {
        if (flash) flash.classList.remove('active');
    }, 1900);
    
    // 6. Setup post-transition [2200ms]
    setTimeout(() => {
        createFireflies();
        createSprinkles();
        document.addEventListener('mousemove', handleMeshGradientMove);
        cleanupScene1();
        
        // Bắt đầu gõ lời chúc
        setTimeout(typeWriterWish, 1500);
    }, 2200);
}

// Tạo particles nổ tỏa từ hộp quà khi mở
function createGiftParticles() {
    const container = document.getElementById('gift-particles');
    if (!container) return;
    const colors = ['#ffd700', '#ffb300', '#ff6b9d', '#ff4d6d', '#fff'];
    for (let i = 0; i < 12; i++) {
        const p = document.createElement('div');
        p.className = 'gift-particle';
        const size = 6 + Math.random() * 8;
        p.style.width = p.style.height = size + 'px';
        p.style.background = colors[Math.floor(Math.random() * colors.length)];
        p.style.color = p.style.background; // Cho box-shadow currentColor hoạt động
        p.style.setProperty('--fly-y', (-80 - Math.random() * 120) + 'px');
        p.style.setProperty('--fly-x', (Math.random() - 0.5) * 200 + 'px');
        p.style.animationDelay = Math.random() * 0.3 + 's';
        container.appendChild(p);
        setTimeout(() => p.remove(), 1500);
    }
}

// Dọn dẹp Scene 1 DOM để giải phóng memory
function cleanupScene1() {
    const dustContainer = document.getElementById('dust-container');
    if (dustContainer) dustContainer.innerHTML = '';
    const giftParticles = document.getElementById('gift-particles');
    if (giftParticles) giftParticles.innerHTML = '';
    const lightBurst = document.querySelector('.gift-light-burst');
    if (lightBurst) lightBurst.classList.remove('active');
}

btnOpenGift.addEventListener('click', openGift);
btnInvite.addEventListener('click', openGift);

function createFireflies() {
    const container = document.querySelector('.fireflies');
    for (let i = 0; i < 20; i++) {
        const firefly = document.createElement('div');
        firefly.classList.add('firefly');
        firefly.style.left = `${Math.random() * 100}%`;
        firefly.style.top = `${Math.random() * 100}%`;
        firefly.style.animationDuration = `${5 + Math.random() * 8}s`;
        firefly.style.animationDelay = `${Math.random() * 5}s`;
        container.appendChild(firefly);
    }
}

function createSprinkles() {
    const container = document.querySelector('.sprinkles-container');
    const colors = ['#ff7675', '#74b9ff', '#55efc4', '#ffeaa7', '#a29bfe'];
    for (let i = 0; i < 40; i++) {
        const sprinkle = document.createElement('div');
        sprinkle.classList.add('sprinkle');
        sprinkle.style.left = `${Math.random() * 100}%`;
        sprinkle.style.top = `${Math.random() * -100}%`;
        sprinkle.style.background = colors[Math.floor(Math.random() * colors.length)];
        sprinkle.style.transform = `rotate(${Math.random() * 360}deg)`;
        sprinkle.style.animationDelay = `${Math.random() * 2}s`;
        container.appendChild(sprinkle);
    }
}

function handleMeshGradientMove(e) {
    const blobs = document.querySelectorAll('.blob');
    const x = (e.clientX / window.innerWidth - 0.5) * 40;
    const y = (e.clientY / window.innerHeight - 0.5) * 40;
    
    blobs.forEach((blob, index) => {
        const multiplier = (index + 1) * 1.5;
        blob.style.transform = `translate(${x * multiplier}px, ${y * multiplier}px)`;
    });
}

// ==========================================
// PHASE 2: Lời chúc & Thổi nến (Apple-style Blur Reveal)
// ==========================================
function typeWriterWish() {
    wishTextEl.innerHTML = '';
    cursorEl.classList.add('hidden'); // Không cần cursor nữa
    
    const words = WISH_MESSAGE.split(' ');
    let charDelay = 0;
    
    words.forEach((word) => {
        const wordSpan = document.createElement('span');
        wordSpan.style.display = 'inline-block';
        wordSpan.style.marginRight = '12px'; // Khoảng cách giữa các chữ
        
        const chars = word.split('');
        chars.forEach((char) => {
            const charSpan = document.createElement('span');
            charSpan.className = 'char-reveal';
            charSpan.innerText = char;
            charSpan.style.animationDelay = `${charDelay * 0.08}s`; // 80ms cho mỗi chữ
            wordSpan.appendChild(charSpan);
            charDelay++;
        });
        
        wishTextEl.appendChild(wordSpan);
    });
    
    // Chờ text chạy xong thì bật nến
    const totalTime = charDelay * 80 + 1000;
    setTimeout(() => {
        btnBlowCandle.classList.remove('hidden');
        initMicrophone();
        
        // Kích hoạt bóng đổ động cho bánh
        const shadow = document.querySelector('.cake-shadow');
        if (shadow) shadow.classList.add('flicker');
    }, totalTime);
}

// ==========================================
// PHASE 3: Thổi nến + Moment of Darkness (v4)
// ==========================================
function triggerBlowCandle() {
    if (candleFlame.classList.contains('out')) return; // Ngăn thổi nhiều lần
    
    candleFlame.classList.remove('flickering-hard');
    candleFlame.classList.add('out');
    candleHalo.classList.add('out');
    btnBlowCandle.classList.add('hidden');
    
    // Tắt bóng đổ động
    const shadow = document.querySelector('.cake-shadow');
    if (shadow) shadow.classList.remove('flicker');
    
    if (micStream) {
        micStream.getTracks().forEach(track => track.stop());
    }
    
    // Multi-particle smoke (v4)
    createSmoke(candleFlame.getBoundingClientRect());
    
    // Haptic feedback trên mobile
    if (navigator.vibrate) navigator.vibrate(100);

    // === MOMENT OF DARKNESS ===
    const meshBg = document.querySelector('.mesh-bg');
    
    // 1. Dim background xuống tối (sau 500ms — để khói bay lên trước)
    setTimeout(() => meshBg.classList.add('dimmed'), 500);
    
    // 2. Bánh kem biến mất TRONG BÓNG TỐI (1500ms — khi đã tối hẳn)
    //    Để khi pháo hoa nổ, sân khấu đã trống — không bị cạnh tranh
    setTimeout(() => {
        cakeContainer.classList.add('slide-down');
    }, 1500);
    
    // 3. BÙM! Pháo hoa (sau tổng 3s — sân khấu đã sạch)
    setTimeout(() => {
        meshBg.classList.remove('dimmed');
        meshBg.classList.add('undimming'); // Sáng lại từ từ 4s theo nhịp pháo hoa
        shootFireworks();
    }, 3000);
}

btnBlowCandle.addEventListener('click', triggerBlowCandle);

// Nhận diện âm thanh thổi (Web Audio API) + Real-time flame feedback (v4)
let audioContext;
let analyser;
let microphone;
let micStream;

async function initMicrophone() {
    try {
        micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(micStream);
        
        microphone.connect(analyser);
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        let blowFrames = 0;
        
        function detectBlow() {
            if (candleFlame.classList.contains('out')) return;
            
            analyser.getByteFrequencyData(dataArray);
            
            let sum = 0;
            // Tập trung vào các tần số thấp tương ứng với tiếng thổi (gió)
            for (let i = 0; i < bufferLength / 3; i++) {
                sum += dataArray[i];
            }
            const average = sum / (bufferLength / 3);
            
            // v4: REAL-TIME FEEDBACK — ngọn lửa lung lay mạnh khi nghe tiếng thổi nhẹ
            if (average > 30 && average <= 80) {
                candleFlame.classList.add('flickering-hard');
            } else if (average <= 30) {
                candleFlame.classList.remove('flickering-hard');
            }
            
            // Ngưỡng 80, phải kéo dài liên tục ~15 frames (~0.25s)
            if (average > 80) { 
                blowFrames++;
                candleFlame.classList.add('flickering-hard');
                if (blowFrames > 15) {
                    candleFlame.classList.remove('flickering-hard');
                    triggerBlowCandle();
                    return;
                }
            } else {
                blowFrames = 0; // Reset nếu âm thanh bị ngắt quãng
            }
            
            requestAnimationFrame(detectBlow);
        }
        detectBlow();
    } catch (err) {
        console.log("Mic access denied or not supported. Fallback to click button.", err);
    }
}

// Multi-particle smoke (v4 — 10 hạt khói chân thực thay vì 1 khối)
function createSmoke(rect) {
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top;
    
    for (let i = 0; i < 10; i++) {
        const smoke = document.createElement('div');
        const size = 8 + Math.random() * 18;
        
        Object.assign(smoke.style, {
            position: 'fixed',
            left: (centerX - size/2 + (Math.random() - 0.5) * 20) + 'px',
            top: (centerY - size/2) + 'px',
            width: size + 'px',
            height: size + 'px',
            background: `rgba(255,255,255,${0.2 + Math.random() * 0.3})`,
            borderRadius: '50%',
            filter: `blur(${4 + Math.random() * 6}px)`,
            transition: `all ${1.5 + Math.random() * 1}s ease-out`,
            zIndex: '100',
            pointerEvents: 'none'
        });
        
        document.body.appendChild(smoke);
        
        // Mỗi hạt bay lên với tốc độ + drift khác nhau (stagger 50ms)
        setTimeout(() => {
            smoke.style.transform = `translateY(${-80 - Math.random() * 120}px) translateX(${(Math.random() - 0.5) * 60}px) scale(${2 + Math.random() * 2})`;
            smoke.style.opacity = '0';
        }, 30 + i * 50);
        
        setTimeout(() => smoke.remove(), 2500);
    }
}

// ==========================================
// PHASE 4: Pháo hoa & Zero-gravity Polaroids
// ==========================================
let particles = [];
let activePolaroids = [];
let isAnimatingCanvas = false;
let animationFrameId;
let fireworksTimeoutId = null;

function shootFireworks() {
    // Bánh kem đã được hạ trong triggerBlowCandle (ẩn trong bóng tối)
    
    // 1. Thu nhỏ và đưa bảng chữ lên góc trên (Responsive UI)
    wishGlassPanel.classList.add('minimized');
    
    // 3. Bắn pháo hoa SOLO trước (để thưởng thức visual không bị ảnh che)
    startContinuousFireworks();

    // 4. Polaroid xuất hiện SAU 3.5s (stagger entrance — v4)
    setTimeout(() => {
        generatePolaroids(canvasWidth / 2, canvasHeight * 0.3);
    }, 3500);
    
    // 5. Hiển thị nút tráo ảnh sau 6 giây (đợi stagger xong)
    setTimeout(() => {
        btnMoreMagic.classList.remove('hidden');
    }, 6000);
}

// v4: Frequency Decay — pháo hoa dày đặc lúc đầu, thưa dần theo thời gian
function startContinuousFireworks() {
    // Phát nổ đầu tiên rực rỡ ở giữa
    createExplosion(canvasWidth / 2, canvasHeight * 0.3, 150);
    
    const fireStartTime = Date.now();
    
    function scheduleNextFirework() {
        const elapsed = (Date.now() - fireStartTime) / 1000;
        
        let interval;
        if (elapsed < 10)      interval = 1200 + Math.random() * 800;  // 10s đầu: dày đặc (1.2-2s)
        else if (elapsed < 30) interval = 2500 + Math.random() * 1500; // 10-30s: vừa phải (2.5-4s)
        else                   interval = 5000 + Math.random() * 3000; // 30s+: thưa nhẹ nhàng (5-8s)
        
        fireworksTimeoutId = setTimeout(() => {
            // Bỏ qua nếu tab đang ẩn
            if (document.hidden) return scheduleNextFirework();
            
            const numExplosions = elapsed < 10 ? Math.floor(Math.random() * 3) + 1 : 1;
            for (let i = 0; i < numExplosions; i++) {
                setTimeout(() => {
                    const x = canvasWidth * 0.1 + Math.random() * (canvasWidth * 0.8);
                    const y = canvasHeight * 0.1 + Math.random() * (canvasHeight * 0.6);
                    createExplosion(x, y, 40 + Math.random() * 30);
                }, Math.random() * 400);
            }
            scheduleNextFirework();
        }, interval);
    }
    scheduleNextFirework();
}

// Canvas Sparkles logic (v4: thêm particle count limit)
function createExplosion(x, y, count = 80) {
    // Giới hạn tổng particles để tránh tích tụ gây lag
    const maxParticles = window.innerWidth <= 768 ? 250 : 400;
    if (particles.length > maxParticles) return;
    
    for(let i=0; i<count; i++) {
        const hue = Math.random() > 0.5 ? Math.random() * 60 + 300 : Math.random() * 60 + 30; // Pink/Gold tones
        particles.push({
            x: x,
            y: y,
            lastX: x,
            lastY: y,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 10,
            life: 1,
            decay: Math.random() * 0.015 + 0.005,
            color: `hsl(${hue}, 100%, 70%)`,
            size: Math.random() * 2.5 + 1
        });
    }
    if(!isAnimatingCanvas) animateCanvas();
}

function animateCanvas() {
    isAnimatingCanvas = true;
    // Dùng clearRect cực nhanh thay cho destination-out
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    ctx.globalCompositeOperation = 'lighter'; 
    ctx.lineCap = 'round';
    
    for(let i=0; i<particles.length; i++) {
        let p = particles[i];
        
        // Vẽ vệt đuôi bằng lineTo siêu mượt
        ctx.beginPath();
        ctx.moveTo(p.lastX, p.lastY);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.size;
        ctx.globalAlpha = p.life;
        ctx.stroke();
        
        // Cập nhật vị trí cũ trước khi dịch chuyển
        p.lastX = p.x;
        p.lastY = p.y;
        
        // Cập nhật vị trí mới
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05; // Trọng lực rất nhẹ để hạt rơi chậm
        p.vx *= 0.96; // Lực cản không khí
        p.vy *= 0.96;
        p.life -= p.decay;
    }
    
    particles = particles.filter(p => p.life > 0);
    ctx.globalCompositeOperation = 'source-over'; 
    
    if(particles.length > 0) {
        requestAnimationFrame(animateCanvas);
    } else {
        isAnimatingCanvas = false;
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    }
}

// ==========================================
// Polaroid Zero-gravity Logic (v4: Stagger Entrance)
// ==========================================
function generatePolaroids(startX, startY) {
    const windowWidth = window.innerWidth;
    let maxItems;

    if (windowWidth <= 480) {
        maxItems = 12; // Mobile hiển thị 12 ảnh/video
    } else if (windowWidth <= 768) {
        maxItems = 16; // Tablet hiển thị 16
    } else {
        maxItems = Math.min(LOCAL_ASSETS.length, 24); // Desktop tối đa 24
    }

    const itemsToShow = [];
    if (LOCAL_ASSETS.length > 0) {
        // Randomize (Xáo trộn)
        const shuffled = [...LOCAL_ASSETS].sort(() => 0.5 - Math.random());
        itemsToShow.push(...shuffled.slice(0, maxItems));
    } else {
        for(let i=0; i<maxItems; i++) itemsToShow.push('placeholder');
    }

    itemsToShow.forEach((src, index) => {
        const polaroid = document.createElement('div');
        polaroid.className = 'polaroid';
        
        let mediaEl;
        const isVideo = src !== 'placeholder' && (src.endsWith('.mp4') || src.endsWith('.webm') || src.endsWith('.mov'));
        
        if (isVideo) {
            // Nhận diện Zalo / In-App browser trên iOS
            const ua = navigator.userAgent;
            const isIOS = /iPad|iPhone|iPod/.test(ua);
            const isInAppBrowser = /Zalo|FBAN|FBAV|Instagram|Line/i.test(ua);
            const preventAutoPlay = isIOS && isInAppBrowser;
            
            const autoplayAttr = preventAutoPlay ? '' : 'autoplay';
            const preloadAttr = preventAutoPlay ? 'auto' : 'none'; // v4: lazy load video

            // Thủ thuật cho iOS Safari: innerHTML để playsinline nhận diện đúng
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = `<video src="${src}" class="polaroid-media" ${autoplayAttr} loop muted playsinline webkit-playsinline preload="${preloadAttr}"></video>`;
            mediaEl = tempDiv.firstElementChild;
            
            mediaEl.muted = true;
            mediaEl.defaultMuted = true;
        } else {
            mediaEl = document.createElement('img');
            mediaEl.src = src === 'placeholder' ? `https://picsum.photos/300/300?random=${Math.random()}` : src;
            mediaEl.className = 'polaroid-media';
        }
        
        const caption = document.createElement('div');
        caption.className = 'polaroid-caption';
        caption.innerText = POLAROID_CAPTIONS[Math.floor(Math.random() * POLAROID_CAPTIONS.length)];

        polaroid.appendChild(mediaEl);
        polaroid.appendChild(caption);
        
        // v4: Stagger entrance — ẩn ban đầu
        polaroid.style.opacity = '0';

        // Vật lý Zero-gravity: Bắn dạng tỏa tròn (explosion)
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 10 + 5;
        const obj = {
            el: polaroid,
            x: startX,
            y: startY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 5, // Hướng lên trên một chút
            rotation: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 0.8,
            isHovered: false
        };
        
        activePolaroids.push(obj);
        
        // v4: Stagger entrance — mỗi tấm xuất hiện cách nhau 100ms
        setTimeout(() => {
            polaroidContainer.appendChild(polaroid);
            polaroid.style.pointerEvents = 'none';
            
            // Fade in mượt mà
            requestAnimationFrame(() => {
                polaroid.style.transition = 'opacity 0.5s ease';
                polaroid.style.opacity = '1';
            });
            
            // Bật tương tác sau khi fade in xong
            setTimeout(() => {
                polaroid.style.pointerEvents = 'auto';
                polaroid.style.transition = '';
            }, 600);
            
            setupPolaroidInteraction(obj);
        }, index * 100);
    });

    if (!animationFrameId) {
        animateZeroGravity();
    }
}

function animateZeroGravity() {
    activePolaroids.forEach(obj => {
        if (obj.isHovered) return; // Nếu đang hover thì dừng trôi
        if (!obj.el.parentNode) return; // v4: Skip nếu chưa append vào DOM (stagger)

        // Phanh dần lực đẩy ban đầu để đạt tốc độ trôi lơ lửng êm ái
        const currentSpeed = Math.sqrt(obj.vx * obj.vx + obj.vy * obj.vy);
        if (currentSpeed > 1.0) {
            obj.vx *= 0.96; 
            obj.vy *= 0.96;
        }

        obj.x += obj.vx;
        obj.y += obj.vy;
        obj.rotation += obj.rotSpeed;

        // Bouncing edge detection (đụng tường bật lại)
        const margin = 70;
        const limitX = canvasWidth - margin;
        const limitY = canvasHeight - margin;

        if (obj.x < margin) { obj.x = margin; obj.vx *= -1; }
        if (obj.x > limitX) { obj.x = limitX; obj.vx *= -1; }
        if (obj.y < margin) { obj.y = margin; obj.vy *= -1; }
        if (obj.y > limitY) { obj.y = limitY; obj.vy *= -1; }

        obj.el.style.transform = `translate3d(${obj.x}px, ${obj.y}px, 0) rotate(${obj.rotation}deg)`;
    });

    animationFrameId = requestAnimationFrame(animateZeroGravity);
}

// ==========================================
// Polaroid Interaction (v4: Mobile Centered Zoom)
// ==========================================
function setupPolaroidInteraction(obj) {
    const videoEl = obj.el.querySelector('video');

    const handleHover = () => {
        // Tối ưu Touch: Khi click/hover vào một ảnh, tự động unhover các ảnh khác
        activePolaroids.forEach(otherObj => {
            if (otherObj !== obj && otherObj.isHovered && otherObj.unhover) {
                otherObj.unhover();
            }
        });

        obj.isHovered = true;
        obj.el.style.zIndex = "100";
        obj.el.classList.add('active'); // V6 Fix: Thêm class active cho mobile touch
        
        // Focus mode: làm mờ background
        document.body.classList.add('focus-mode');
        
        // Shadow nổi bật hơn khi hover
        obj.el.style.boxShadow = "0 30px 60px rgba(0,0,0,0.5), 0 0 40px rgba(255,255,255,0.4)";
        
        if (window.innerWidth <= 768) {
            // v4 MOBILE: Bay vào giữa viewport (centered zoom — giữ immersion)
            const polaroidRect = obj.el.getBoundingClientRect();
            const centerX = (window.innerWidth / 2) - (polaroidRect.width / 2);
            const centerY = (window.innerHeight / 2) - (polaroidRect.height / 2);
            obj.el.style.transform = `translate3d(${centerX}px, ${centerY}px, 0) scale(2.5) rotate(0deg)`;
        } else {
            // DESKTOP: Zoom tại chỗ + tilt 3D
            obj.el.style.transform = `translate3d(${obj.x}px, ${obj.y}px, 0) scale(2.8) rotate(0deg)`;
            obj.el.addEventListener('mousemove', obj.tiltHandler);
        }
        
        if (videoEl) {
            videoEl.muted = false;
            bgMusic.pause();
            // Tránh gọi play() liên tục trên iOS
            if (videoEl.paused) {
                videoEl.play().catch(e => console.log('Video play prevented', e));
            }
        }
    };

    const handleUnhover = () => {
        obj.isHovered = false;
        obj.el.style.zIndex = "10";
        obj.el.classList.remove('active'); // V6 Fix
        obj.el.style.boxShadow = ""; // Phục hồi shadow ban đầu
        obj.el.style.transform = `translate3d(${obj.x}px, ${obj.y}px, 0) rotate(${obj.rotation}deg)`; // Phục hồi rotation
        
        // Tắt focus mode
        if (activePolaroids.every(p => !p.isHovered)) {
            document.body.classList.remove('focus-mode');
        }
        
        obj.el.removeEventListener('mousemove', obj.tiltHandler);
        obj.el.querySelector('.glare')?.remove();

        if (videoEl) {
            videoEl.muted = true;
            bgMusic.play().catch(e => console.log("Audio play prevented", e));
        }
    };

    obj.tiltHandler = function(e) {
        const rect = obj.el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const tiltX = (y - centerY) / centerY * 15; // Cường độ tilt (độ)
        const tiltY = (centerX - x) / centerX * 15;
        
        const scaleHover = 2.8;
        obj.el.style.transform = `translate3d(${obj.x}px, ${obj.y}px, 0) scale(${scaleHover}) perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        
        // Cập nhật lóa sáng (glare)
        let glareEl = obj.el.querySelector('.glare');
        if (!glareEl) {
            glareEl = document.createElement('div');
            glareEl.className = 'glare';
            obj.el.appendChild(glareEl);
        }
        const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI) - 90;
        glareEl.style.background = `linear-gradient(${angle}deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 80%)`;
    };

    obj.unhover = handleUnhover;

    if (window.innerWidth <= 768) {
        // v4 MOBILE: Touch toggle (tap = zoom, tap lại = thu nhỏ)
        obj.el.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (obj.isHovered) {
                handleUnhover();
            } else {
                handleHover();
            }
        }, { passive: false });
    } else {
        // DESKTOP: Mouse hover
        obj.el.addEventListener('mouseenter', handleHover);
        obj.el.addEventListener('mouseleave', handleUnhover);
    }
}

// Global listener để tắt hover khi click/tap ra ngoài
['touchstart', 'click'].forEach(evt => {
    document.addEventListener(evt, (e) => {
        // Nếu click không trúng bất kỳ tấm polaroid nào
        if (!e.target.closest('.polaroid')) {
            activePolaroids.forEach(obj => {
                if (obj.isHovered && obj.unhover) {
                    obj.unhover();
                }
            });
        }
    }, {passive: true});
});

// ==========================================
// v4: Sparkle Dissolve Helper
// ==========================================
function createSparklesAtPosition(x, y) {
    const colors = ['#ffd700', '#ff6b9d', '#fff', '#a29bfe'];
    for (let i = 0; i < 5; i++) {
        const spark = document.createElement('div');
        const size = 3 + Math.random() * 4;
        const color = colors[Math.floor(Math.random() * colors.length)];
        Object.assign(spark.style, {
            position: 'fixed',
            left: x + 'px',
            top: y + 'px',
            width: size + 'px',
            height: size + 'px',
            background: color,
            borderRadius: '50%',
            boxShadow: `0 0 ${size * 2}px ${color}`,
            pointerEvents: 'none',
            zIndex: '200',
            transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });
        document.body.appendChild(spark);
        setTimeout(() => {
            spark.style.transform = `translate(${(Math.random()-0.5)*80}px, ${(Math.random()-0.5)*80}px) scale(0)`;
            spark.style.opacity = '0';
        }, 30);
        setTimeout(() => spark.remove(), 900);
    }
}

// ==========================================
// LOOP: Tráo ảnh (Nút Thêm phép màu) — v4: Sparkle Dissolve
// ==========================================
btnMoreMagic.addEventListener('click', () => {
    btnMoreMagic.classList.add('hidden');
    
    // Mờ lớp polaroid cũ mượt mà + sparkle dissolve
    const oldPolaroids = activePolaroids;
    activePolaroids = []; // Dừng vòng lặp requestAnimationFrame cho các ảnh cũ

    oldPolaroids.forEach(obj => {
        // v4: Sparkle dissolve tại vị trí ảnh cũ
        const rect = obj.el.getBoundingClientRect();
        createSparklesAtPosition(rect.left + rect.width/2, rect.top + rect.height/2);
        
        obj.el.style.transition = 'transform 1s cubic-bezier(0.4, 0, 0.2, 1), opacity 1s ease';
        obj.el.style.opacity = '0';
        obj.el.style.transform = `translate3d(${obj.x}px, ${obj.y - 100}px, 0) scale(0.3) rotate(${obj.rotation + 20}deg)`;
        setTimeout(() => obj.el.remove(), 1000); 
    });

    // Pháo hoa to nổ ở giữa
    createExplosion(canvasWidth / 2, canvasHeight * 0.3, 150);
    
    // Tráo bộ ảnh mới (stagger entrance — v4)
    setTimeout(() => {
        generatePolaroids(canvasWidth / 2, canvasHeight * 0.3);
    }, 300);
    
    // Hiện lại nút sau 5 giây (đợi stagger + settle)
    setTimeout(() => {
        btnMoreMagic.classList.remove('hidden');
    }, 5000);
});

// ==========================================
// v4: VISIBILITY API — Pause/Resume khi tab ẩn
// ==========================================
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Tab ẩn → dừng mọi thứ để tiết kiệm pin
        bgMusic.pause();
        if (fireworksTimeoutId) {
            clearTimeout(fireworksTimeoutId);
            fireworksTimeoutId = null;
        }
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    } else {
        // Tab hiện lại → resume
        if (scene2.classList.contains('active')) {
            bgMusic.play().catch(() => {});
            // Resume polaroid animation nếu đang ở phase đó
            if (activePolaroids.length > 0 && !animationFrameId) {
                animateZeroGravity();
            }
            // Resume pháo hoa nếu đang chạy
            if (cakeContainer.classList.contains('slide-down') && !fireworksTimeoutId) {
                startContinuousFireworks();
            }
        }
    }
});
