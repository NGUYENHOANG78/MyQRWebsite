function celebrateClick() {
    alert('Chúc mừng sinh nhật em! Chúc em luôn rạng rỡ, hạnh phúc và gặp nhiều may mắn nhé! 🎂🎉✨');
}

let isCreated = false;
let rotX = 0, rotY = 0;
let scale3D = 1; // Biến quản lý Zoom Trái Tim
let isDragging = false;
let startX, startY;
let dragDistance = 0; // Phân biệt Click chọn ảnh vs Vuốt xoay
let autoRotateTimer;
let initialPinchDistance = null;

// --- MỞ / ĐÓNG ALBUM ---
function openAlbum() {
    const album = document.getElementById('photo-album');
    if (album) album.style.display = 'flex';

    if (!isCreated) {
        create3DHeart();
        isCreated = true;
    }
    startAutoRotate();
}

function closeAlbum() {
    const album = document.getElementById('photo-album');
    if (album) album.style.display = 'none';
    stopAutoRotate();
}

function create3DHeart() {
    const world = document.getElementById('world3d');
    if (!world) return;
    world.innerHTML = '';

    const total = 80; // 80 tấm ảnh
    const isMobile = window.innerWidth <= 768;
    const scale = isMobile ? 9 : 14;
    const zSpacing = isMobile ? 25 : 40; // Độ dày lớp 3D trước - sau

    for (let i = 0; i < total; i++) {
        const card = document.createElement('div');
        card.className = 'photo-3d-card';

        const imgSrc = `/images/${i + 1}.jpg`;
        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = `Ảnh ${i + 1}`;
        card.appendChild(img);

        // Bắt sự kiện click mở ảnh
        card.addEventListener('pointerdown', () => { dragDistance = 0; });
        card.addEventListener('click', (e) => {
            e.stopPropagation();
            if (dragDistance < 8) openModal(imgSrc);
        });

        // 1. Góc t quét từ 0 đến 2*PI (phủ kín 360 độ xung quanh trái tim)
        const t = (i / total) * Math.PI * 2;

        // 2. Chia thành các lớp độ sâu Z (mặt trước / mặt sau)
        const layer = (i % 5) - 2; // Phân bổ ra 5 tầng độ sâu (-2, -1, 0, 1, 2)

        // Công thức tạo hình Trái Tim 3D
        const x = scale * 16 * Math.pow(Math.sin(t), 3);
        const y = -scale * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        const z = layer * zSpacing;

        // Xoay mặt ảnh hướng ra ngoài theo đường cong
        const ry = (t * 180 / Math.PI) - 90;

        card.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateY(${ry}deg)`;
        world.appendChild(card);
    }
}

// --- XOAY TỰ ĐỘNG 3D XOAY TRÒN ĐẦY ĐỦ CÁC GÓC ---
let animationFrameId = null;

function startAutoRotate() {
    stopAutoRotate();

    function loop() {
        if (!isDragging) {
            rotY += 0.4; // Xoay quanh trục Y (trái/phải)

            // Cập nhật lại transform cho cả khối 3D
            updateTransform();
        }
        animationFrameId = requestAnimationFrame(loop);
    }

    animationFrameId = requestAnimationFrame(loop);
}

function stopAutoRotate() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
}

// --- HÀM CẬP NHẬT GÓC XOAY TRONG KHÔNG GIAN 3D ---
function updateTransform() {
    const world = document.getElementById('world3d');
    if (world) {
        // Giữ rotX ở khoảng 10 ~ 15 độ nghiêng nhẹ để nhìn rõ độ sâu 3D cả mặt trước & mặt sau
        world.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    }
}

// --- HÀM MỞ / ĐÓNG MODAL PHÓNG TO ẢNH ---
// --- MỞ MODAL VỚI HIỆU ỨNG LÓE SÁNG & NẢY 3D ---
function openModal(src) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImg');
    if (modal && modalImg) {
        modalImg.src = src;

        // Gỡ bỏ trạng thái đóng cũ nếu có
        modal.classList.remove('closing');
        modal.classList.add('show');

        // Kích hoạt class 'active' sau 30ms để hiệu ứng nảy 3D và phát sáng chạy mượt
        setTimeout(() => {
            modal.classList.add('active');
        }, 30);
    }
}

// --- ĐÓNG MODAL VỚI HIỆU ỨNG RƠI 3D & THU NHỎ ---
function closeModal() {
    const modal = document.getElementById('imageModal');
    if (modal && modal.classList.contains('show')) {
        // Thêm class 'closing' để chạy animation rơi ảnh
        modal.classList.add('closing');
        modal.classList.remove('active');

        // Chờ 300ms cho hiệu ứng biến mất chạy xong mới ẩn khỏi màn hình
        setTimeout(() => {
            modal.classList.remove('show');
            modal.classList.remove('closing');
        }, 300);
    }
}

// --- BẮT SỰ KIỆN XOAY VÀ ZOOM (PC & MOBILE) ---
document.addEventListener('DOMContentLoaded', () => {
    const scene = document.getElementById('scene3d');
    if (!scene) return;

    // 1. Zoom trái tim bằng Con lăn chuột (Desktop)
    scene.addEventListener('wheel', (e) => {
        e.preventDefault();
        if (e.deltaY < 0) {
            scale3D = Math.min(scale3D + 0.1, 2.5); // Max zoom 2.5x
        } else {
            scale3D = Math.max(scale3D - 0.1, 0.4); // Min zoom 0.4x
        }
        updateTransform();
    }, { passive: false });

    // 2. Kéo xoay bằng Chuột
    scene.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        dragDistance = 0;
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        dragDistance += Math.abs(deltaX) + Math.abs(deltaY);

        rotY += deltaX * 0.4;
        rotX -= deltaY * 0.4;
        rotX = Math.max(-60, Math.min(60, rotX));

        startX = e.clientX;
        startY = e.clientY;

        updateTransform();
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // 3. Cảm ứng Cầm tay (Mobile: 1 ngón xoay, 2 ngón chụm Zoom)
    scene.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            isDragging = true;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            dragDistance = 0;
        } else if (e.touches.length === 2) {
            isDragging = false;
            initialPinchDistance = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
        }
    }, { passive: true });

    scene.addEventListener('touchmove', (e) => {
        if (e.touches.length === 1 && isDragging) {
            const deltaX = e.touches[0].clientX - startX;
            const deltaY = e.touches[0].clientY - startY;

            dragDistance += Math.abs(deltaX) + Math.abs(deltaY);

            rotY += deltaX * 0.4;
            rotX -= deltaY * 0.4;
            rotX = Math.max(-60, Math.min(60, rotX));

            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;

            updateTransform();
        } else if (e.touches.length === 2 && initialPinchDistance) {
            const currentDistance = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            const diff = (currentDistance - initialPinchDistance) * 0.005;
            scale3D = Math.min(Math.max(scale3D + diff, 0.4), 2.5);
            initialPinchDistance = currentDistance;
            updateTransform();
        }
    }, { passive: true });

    scene.addEventListener('touchend', () => {
        isDragging = false;
        initialPinchDistance = null;
    });

    // Bấm ra ngoài ảnh hoặc phím ESC để đóng Modal
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // --- KHỞI TẠO HIỆU ỨNG TIM BAY NỀN ---
    initFloatingHearts();
});

function initFloatingHearts() {
    const container = document.getElementById('heartsBgContainer');
    if (!container) return;

    const heartIcons = ['💖', '💗', '💓', '💕', '❤️', '🌸', '✨'];

    function createHeart() {
        const heart = document.createElement('div');
        heart.classList.add('bg-heart');
        heart.innerHTML = heartIcons[Math.floor(Math.random() * heartIcons.length)];

        heart.style.left = Math.random() * 100 + 'vw';
        const size = Math.random() * 16 + 12;
        heart.style.fontSize = size + 'px';

        const duration = Math.random() * 6 + 7;
        heart.style.animationDuration = duration + 's';

        container.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, duration * 1000);
    }

    setInterval(createHeart, 350);
}