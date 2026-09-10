// Data & Config
const LOCAL_ASSETS = [
    // Bạn hãy thay thế bằng các file thực tế trong folder assets
    // Ví dụ:
    // 'assets/images/pic1.jpg',
    // 'assets/videos/vid1.mp4'
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
// PHASE 1 & 2: Mở quà và thắp sáng
// ==========================================
function openGift() {
    // 1. Play music
    bgMusic.play().catch(e => console.log("Audio play prevented", e));
    
    // 2. Animate gift opening
    const lid = document.querySelector('.gift-lid');
    lid.style.transform = 'translateY(-60px) rotate(20deg) scale(1.1)';
    lid.style.opacity = '0';
    btnInvite.style.opacity = '0';
    
    // 3. Transition scenes
    setTimeout(() => {
        scene1.classList.remove('active');
        scene2.classList.add('active');
        cakeContainer.classList.remove('hidden');
        
        // Tạo đom đóm quanh bánh kem
        createFireflies();
        
        // Bắt đầu gõ lời chúc
        setTimeout(typeWriterWish, 2000);
    }, 1200);
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

// ==========================================
// PHASE 3: Lời chúc & Thổi nến
// ==========================================
function typeWriterWish() {
    let i = 0;
    wishTextEl.innerHTML = '';
    cursorEl.classList.remove('hidden');
    const speed = 60; // ms per char

    function type() {
        if (i < WISH_MESSAGE.length) {
            wishTextEl.innerHTML += WISH_MESSAGE.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            // Chớp chớp con trỏ vài giây rồi ẩn
            setTimeout(() => {
                cursorEl.classList.add('hidden');
                btnBlowCandle.classList.remove('hidden');
            }, 1000);
        }
    }
    type();
}

btnBlowCandle.addEventListener('click', () => {
    candleFlame.classList.add('out');
    candleHalo.classList.add('out');
    btnBlowCandle.classList.add('hidden');
    
    createSmoke(candleFlame.getBoundingClientRect());

    // Delay 1.5s rồi bắn pháo hoa
    setTimeout(() => {
        shootFireworks();
    }, 1500);
});

function createSmoke(rect) {
    const smoke = document.createElement('div');
    smoke.style.position = 'absolute';
    smoke.style.left = `${rect.left + rect.width/2 - 15}px`;
    smoke.style.top = `${rect.top - 10}px`;
    smoke.style.width = '30px';
    smoke.style.height = '30px';
    smoke.style.background = 'rgba(255,255,255,0.4)';
    smoke.style.borderRadius = '50%';
    smoke.style.filter = 'blur(8px)';
    smoke.style.transition = 'all 2s ease-out';
    smoke.style.zIndex = '15';
    document.body.appendChild(smoke);

    setTimeout(() => {
        smoke.style.transform = 'translateY(-150px) scale(4)';
        smoke.style.opacity = '0';
    }, 50);

    setTimeout(() => smoke.remove(), 2050);
}

// ==========================================
// PHASE 4: Pháo hoa & Zero-gravity Polaroids
// ==========================================
let particles = [];
let activePolaroids = [];
let isAnimatingCanvas = false;
let animationFrameId;

function shootFireworks() {
    // 1. Hạ bánh kem xuống
    cakeContainer.classList.add('slide-down');
    
    // 2. Thu nhỏ và đưa bảng chữ lên góc trên (Responsive UI)
    wishGlassPanel.classList.add('minimized');

    // 3. Tạo hạt Canvas pháo hoa bay lên
    const x = canvasWidth / 2;
    const y = canvasHeight; // bắn từ dưới lên
    const explodeY = canvasHeight * 0.3; // Nổ ở giữa trên
    createExplosion(x, explodeY);

    // 4. Sinh Polaroids lơ lửng
    setTimeout(() => {
        generatePolaroids(x, explodeY);
    }, 100); 
}

// Canvas Sparkles logic
function createExplosion(x, y) {
    const count = 150; 
    for(let i=0; i<count; i++) {
        const hue = Math.random() > 0.5 ? Math.random() * 60 + 300 : Math.random() * 60 + 30; // Pink/Gold tones
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 12, // Giảm từ 20 xuống 12 để nổ nhẹ nhàng hơn
            vy: (Math.random() - 0.5) * 12,
            life: 1,
            decay: Math.random() * 0.01 + 0.005, // Sống lâu hơn, mờ đi chậm hơn
            color: `hsl(${hue}, 100%, 70%)`,
            size: Math.random() * 3 + 1
        });
    }
    if(!isAnimatingCanvas) animateCanvas();
}

function animateCanvas() {
    isAnimatingCanvas = true;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    ctx.globalCompositeOperation = 'lighter'; 
    
    for(let i=0; i<particles.length; i++) {
        let p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05; // Trọng lực rất nhẹ để hạt rơi chậm
        p.vx *= 0.96; // Lực cản không khí lớn hơn để pháo hoa tỏa ra rồi phanh lại mượt mà
        p.vy *= 0.96;
        p.life -= p.decay;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
        ctx.fill();
        
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
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

// Polaroid Zero-gravity Logic
function generatePolaroids(startX, startY) {
    const windowWidth = window.innerWidth;
    let minCount, maxCount;

    if (windowWidth <= 480) {
        // Điện thoại (Mobile - dưới 480px): 3 đến 4 ảnh
        minCount = 3;
        maxCount = 4;
    } else if (windowWidth <= 768) {
        // Máy tính bảng (Tablet - từ 480px đến 768px): 5 đến 6 ảnh
        minCount = 5;
        maxCount = 6;
    } else {
        // Máy tính/Laptop (Desktop - trên 768px): 7 đến 8 ảnh
        minCount = 7;
        maxCount = 8;
    }

    const count = Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;
    
    const itemsToShow = [];
    if (LOCAL_ASSETS.length > 0) {
        for(let i=0; i<count; i++) {
            itemsToShow.push(LOCAL_ASSETS[Math.floor(Math.random() * LOCAL_ASSETS.length)]);
        }
    } else {
        for(let i=0; i<count; i++) itemsToShow.push('placeholder');
    }

    itemsToShow.forEach((src, index) => {
        const polaroid = document.createElement('div');
        polaroid.className = 'polaroid';
        
        let mediaEl;
        const isVideo = src !== 'placeholder' && (src.endsWith('.mp4') || src.endsWith('.webm') || src.endsWith('.mov'));
        
        if (isVideo) {
            mediaEl = document.createElement('video');
            mediaEl.src = src;
            mediaEl.autoplay = true;
            mediaEl.loop = true;
            mediaEl.muted = true;
            mediaEl.playsInline = true;
            mediaEl.className = 'polaroid-media';
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
        polaroidContainer.appendChild(polaroid);

        // Vật lý Zero-gravity: Bắn nhẹ ra rồi trôi
        const obj = {
            el: polaroid,
            x: startX,
            y: startY,
            vx: (Math.random() - 0.5) * 10, // Tăng lực đẩy ban đầu lên một chút
            vy: (Math.random() - 0.5) * 10,
            rotation: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 0.8, // Xoay nhanh hơn một xíu
            isHovered: false
        };
        
        activePolaroids.push(obj);
        setupPolaroidInteraction(obj);
    });

    if (!animationFrameId) {
        animateZeroGravity();
    }

    // Nút bắn tiếp hiển thị lại ở trên bảng chữ
    setTimeout(() => {
        btnMoreMagic.classList.remove('hidden');
    }, 4000);
}

function animateZeroGravity() {
    activePolaroids.forEach(obj => {
        if (obj.isHovered) return; // Nếu đang trỏ chuột vào thì dừng trôi

        // Phanh dần lực đẩy ban đầu để đạt tốc độ trôi lơ lửng êm ái (Cruising speed)
        const currentSpeed = Math.sqrt(obj.vx * obj.vx + obj.vy * obj.vy);
        if (currentSpeed > 1.8) { // Tăng giới hạn tốc độ trôi cuối cùng từ 1 lên 1.8
            obj.vx *= 0.98; // Lực cản giảm nhẹ để phanh từ từ hơn
            obj.vy *= 0.98;
        }

        obj.x += obj.vx;
        obj.y += obj.vy;
        obj.rotation += obj.rotSpeed;

        // Bouncing edge detection (đụng tường bật lại siêu êm)
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

function setupPolaroidInteraction(obj) {
    obj.el.addEventListener('mouseenter', () => {
        obj.isHovered = true;
        obj.el.style.zIndex = "100";
        // Lật thẳng và phóng to ngay tại chỗ
        obj.el.style.transform = `translate3d(${obj.x}px, ${obj.y}px, 0) scale(1.5) rotate(0deg)`;
    });

    obj.el.addEventListener('mouseleave', () => {
        obj.isHovered = false;
        obj.el.style.zIndex = "10";
    });
}

// ==========================================
// LOOP: Bắn pháo hoa tiếp
// ==========================================
btnMoreMagic.addEventListener('click', () => {
    btnMoreMagic.classList.add('hidden');
    
    // Mờ lớp polaroid cũ mượt mà tại chính vị trí của nó
    const oldPolaroids = activePolaroids;
    activePolaroids = []; // Dừng vòng lặp requestAnimationFrame cho các ảnh cũ

    oldPolaroids.forEach(obj => {
        obj.el.style.transition = 'transform 1s cubic-bezier(0.4, 0, 0.2, 1), opacity 1s ease';
        obj.el.style.opacity = '0';
        obj.el.style.transform = `translate3d(${obj.x}px, ${obj.y - 100}px, 0) scale(0.5) rotate(${obj.rotation + 15}deg)`;
        setTimeout(() => obj.el.remove(), 1000); 
    });

    // Tạo pháo hoa mới
    createExplosion(canvasWidth / 2, canvasHeight * 0.3);
    setTimeout(() => {
        generatePolaroids(canvasWidth / 2, canvasHeight * 0.3);
    }, 100);
});
