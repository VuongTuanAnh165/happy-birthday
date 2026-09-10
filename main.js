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
    'assets/videos/13.mp4'
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
    let maxItems;

    if (windowWidth <= 480) {
        maxItems = 12; // Mobile hiển thị 12 ảnh/video
    } else if (windowWidth <= 768) {
        maxItems = 16; // Tablet hiển thị 16
    } else {
        maxItems = Math.min(LOCAL_ASSETS.length, 24); // Desktop hiển thị tối đa 24 để UI mượt và đẹp nhất
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
            mediaEl = document.createElement('video');
            mediaEl.src = src;
            mediaEl.autoplay = true;
            mediaEl.loop = true;
            mediaEl.muted = true;
            mediaEl.defaultMuted = true;
            mediaEl.playsInline = true;
            mediaEl.setAttribute('playsinline', 'playsinline');
            mediaEl.setAttribute('webkit-playsinline', 'webkit-playsinline');
            mediaEl.setAttribute('muted', 'muted');
            mediaEl.preload = 'metadata'; // Giúp load frame đầu tiên để không bị viền đen trên iOS
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

        if (isVideo) {
            // Tối ưu iOS: Gọi load() và play() SAU KHI đã chèn vào DOM
            mediaEl.load();
            setTimeout(() => {
                const playPromise = mediaEl.play();
                if (playPromise !== undefined) {
                    playPromise.catch(e => console.log('Video autoplay prevented on iOS:', e));
                }
            }, 100);
        }

        // Vật lý Zero-gravity: Bắn dạng tỏa tròn (explosion) đẹp hơn
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 10 + 5; // Tốc độ bắn ban đầu từ 5 đến 15
        const obj = {
            el: polaroid,
            x: startX,
            y: startY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 5, // Hướng lên trên một chút
            rotation: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 1.5,
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
        // Vì ảnh đã thu nhỏ lại để hiển thị nhiều, khi hover sẽ phóng to nhiều hơn
        const scaleHover = window.innerWidth <= 768 ? 2.2 : 2.8;
        obj.el.style.transform = `translate3d(${obj.x}px, ${obj.y}px, 0) scale(${scaleHover}) rotate(0deg)`;
        
        // Thêm shadow nổi bật hơn khi hover
        obj.el.style.boxShadow = "0 30px 60px rgba(0,0,0,0.5), 0 0 40px rgba(255,255,255,0.4)";
        
        if (videoEl) {
            videoEl.muted = false;
            bgMusic.pause();
            // Đảm bảo video play nếu nó bị dừng trên mobile
            videoEl.play().catch(e => console.log('Video play prevented', e));
        }
    };

    const handleUnhover = () => {
        obj.isHovered = false;
        obj.el.style.zIndex = "10";
        obj.el.style.boxShadow = ""; // Phục hồi shadow ban đầu
        
        if (videoEl) {
            videoEl.muted = true;
            bgMusic.play().catch(e => console.log("Audio play prevented", e));
        }
    };

    obj.unhover = handleUnhover;

    // Support cả chuột và cảm ứng
    obj.el.addEventListener('mouseenter', handleHover);
    obj.el.addEventListener('mouseleave', handleUnhover);
}

// Global listener để tắt hover khi click/tap ra ngoài màn hình trên mobile/tablet
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
