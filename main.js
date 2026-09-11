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

// ==========================================
// PHASE 2: Mở quà và thắp sáng
// ==========================================
function openGift() {
    // Phát nhạc ngay lập tức khi click
    bgMusic.play().catch(e => console.log("Audio play prevented", e));
    
    // 2. Animate gift opening
    const lid = document.querySelector('.gift-lid');
    lid.style.transform = 'translateY(-60px) rotate(20deg) scale(1.1)';
    lid.style.opacity = '0';
    btnInvite.style.opacity = '0';
    
        // 3. Transition scenes (Circle Reveal)
        scene1.style.clipPath = 'circle(0% at 50% 50%)';
        setTimeout(() => {
            scene1.classList.remove('active');
            scene2.classList.add('active');
            cakeContainer.classList.remove('hidden');
            
            // Tạo đom đóm quanh bánh kem
            createFireflies();
            
            // Tạo kẹo cốm rắc
            createSprinkles();

            // Lắng nghe chuột để di chuyển Mesh Gradient
            document.addEventListener('mousemove', handleMeshGradientMove);
            
            // Bắt đầu gõ lời chúc
            setTimeout(typeWriterWish, 2000);
        }, 800); // Đợi clip-path chạy xong
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
// PHASE 3: Lời chúc & Thổi nến (Apple-style Blur Reveal)
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

function triggerBlowCandle() {
    if (candleFlame.classList.contains('out')) return; // Ngăn thổi nhiều lần
    
    candleFlame.classList.add('out');
    candleHalo.classList.add('out');
    btnBlowCandle.classList.add('hidden');
    
    // Tắt bóng đổ động
    const shadow = document.querySelector('.cake-shadow');
    if (shadow) shadow.classList.remove('flicker');
    
    if (micStream) {
        micStream.getTracks().forEach(track => track.stop());
    }
    
    createSmoke(candleFlame.getBoundingClientRect());

    // Delay 1.5s rồi bắn pháo hoa
    setTimeout(() => {
        shootFireworks();
    }, 1500);
}

btnBlowCandle.addEventListener('click', triggerBlowCandle);

// Nhận diện âm thanh thổi (Web Audio API)
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
            
            // Ngưỡng 80, nhưng phải kéo dài liên tục khoảng 15 frames (~0.25s) 
            // để phân biệt tiếng thổi với các tiếng động ngắn/tiếng ồn nền
            if (average > 80) { 
                blowFrames++;
                if (blowFrames > 15) {
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
            // Nhận diện Zalo / In-App browser trên iOS (những app cố tình chặn phát video thu nhỏ)
            const ua = navigator.userAgent;
            const isIOS = /iPad|iPhone|iPod/.test(ua);
            const isInAppBrowser = /Zalo|FBAN|FBAV|Instagram|Line/i.test(ua);
            const preventAutoPlay = isIOS && isInAppBrowser;
            
            const autoplayAttr = preventAutoPlay ? '' : 'autoplay';
            const preloadAttr = preventAutoPlay ? 'auto' : 'metadata';

            // Thủ thuật kinh điển cho iOS Safari: Tạo thẻ video bằng innerHTML 
            // để trình duyệt biên dịch thuộc tính playsinline ngay từ lúc sinh ra (tránh bị nhảy Fullscreen)
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = `<video src="${src}" class="polaroid-media" ${autoplayAttr} loop muted playsinline webkit-playsinline preload="${preloadAttr}"></video>`;
            mediaEl = tempDiv.firstElementChild;
            
            // Đảm bảo property javascript cũng nhận diện đúng
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
        polaroidContainer.appendChild(polaroid);

        // Ngăn chặn lỗi "Click-through" trên iOS: Tạm thời vô hiệu hóa tương tác 
        // để ảnh không vô tình nhận sự kiện chạm khi người dùng vừa bấm nút "Thêm phép màu"
        polaroid.style.pointerEvents = 'none';
        setTimeout(() => {
            polaroid.style.pointerEvents = 'auto';
        }, 1000);

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
        
        // Focus mode: làm mờ background
        document.body.classList.add('focus-mode');
        
        // Thêm shadow nổi bật hơn khi hover
        obj.el.style.boxShadow = "0 30px 60px rgba(0,0,0,0.5), 0 0 40px rgba(255,255,255,0.4)";
        
        // Thêm hiệu ứng di chuột lật 3D (Tilt effect) cho bức ảnh này
        obj.el.addEventListener('mousemove', obj.tiltHandler);
        
        if (videoEl) {
            videoEl.muted = false;
            bgMusic.pause();
            // Tránh gọi play() liên tục trên iOS nếu video đang chạy (nguyên nhân gây full màn hình)
            if (videoEl.paused) {
                videoEl.play().catch(e => console.log('Video play prevented', e));
            }
        }
    };

    const handleUnhover = () => {
        obj.isHovered = false;
        obj.el.style.zIndex = "10";
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
        
        // Tái sử dụng scale Hover 
        const scaleHover = window.innerWidth <= 768 ? 2.2 : 2.8;
        obj.el.style.transform = `translate3d(${obj.x}px, ${obj.y}px, 0) scale(${scaleHover}) perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        
        // Cập nhật lóa sáng (glare)
        let glare = obj.el.querySelector('.glare');
        if (!glare) {
            glare = document.createElement('div');
            glare.className = 'glare';
            obj.el.appendChild(glare);
        }
        const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI) - 90;
        glare.style.background = `linear-gradient(${angle}deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 80%)`;
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
