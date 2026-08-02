(function () {
    'use strict';

    let isCubesGenerated = false;
    let currentPhotoTracker = 0;
    const totalPhotos = 80;

    // --- NÚT CHÚC MỪNG ---
    window.celebrateClick = function () {
        window.openCardModal();
    };

    // --- MỞ/ĐÓNG THIỆP CHÚC MỪNG ---
    window.openCardModal = function () {
        const cardModal = document.getElementById('cardModal');
        if (cardModal) {
            cardModal.classList.add('show');
        } else {
            console.error('Không tìm thấy element #cardModal');
        }
    };

    window.closeCardModal = function () {
        const cardModal = document.getElementById('cardModal');
        if (cardModal) {
            cardModal.classList.remove('show');
        }
    };

    // --- MỞ ALBUM, PHÁT NHẠC & TẠO CUBES ---
    window.openAlbum = function () {
        // Tự động phát nhạc nền khi bấm vào nút
        const audio = document.getElementById('birthdayAudio');
        if (audio) {
            audio.play().catch(error => {
                console.log("Không thể tự động phát nhạc do chính sách trình duyệt hoặc lỗi file:", error);
            });
        }

        const album = document.getElementById('photo-album');
        if (album) {
            album.style.display = 'block';
        }

        if (!isCubesGenerated) {
            generateCubes();
            isCubesGenerated = true;
        }
    };

    // --- TẠO CÁC KHỐI CUBE 3D ---
    function generateCubes() {
        const container = document.getElementById('cubes-container');
        if (!container) return;
        container.innerHTML = '';

        const cubeConfigs = [
            { top: '15%', left: '10%', duration: '5.5s', delay: '0s' },
            { top: '18%', right: '10%', duration: '6.5s', delay: '1.2s' },
            { top: '65%', left: '8%', duration: '5.8s', delay: '2.5s' },
            { top: '68%', right: '8%', duration: '6.0s', delay: '0.8s' },
            { top: '38%', left: '5%', duration: '5.2s', delay: '3.5s' },
            { top: '40%', right: '5%', duration: '5.6s', delay: '4.2s' },
            { top: '82%', left: '38%', duration: '6.2s', delay: '1.8s' },
            { top: '8%', left: '42%', duration: '5.9s', delay: '3.0s' }
        ];

        cubeConfigs.forEach((cfg) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'cube-wrapper';
            wrapper.style.top = cfg.top;
            if (cfg.left) wrapper.style.left = cfg.left;
            if (cfg.right) wrapper.style.right = cfg.right;

            wrapper.style.animationDuration = cfg.duration;
            wrapper.style.animationDelay = cfg.delay;

            const cube = document.createElement('div');
            cube.className = 'cube';

            const faces = ['front', 'back', 'right', 'left', 'top', 'bottom'];
            faces.forEach((faceClass) => {
                const face = document.createElement('div');
                face.className = `face ${faceClass}`;

                const photoNum = (currentPhotoTracker % totalPhotos) + 1;
                currentPhotoTracker++;

                const imgSrc = `/images/${photoNum}.jpg`;
                face.style.backgroundImage = `url('${imgSrc}')`;
                face.setAttribute('data-img-src', imgSrc);

                face.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const src = face.getAttribute('data-img-src') || imgSrc;
                    window.openModal(src);
                });

                cube.appendChild(face);
            });

            wrapper.appendChild(cube);
            container.appendChild(wrapper);

            wrapper.addEventListener('animationiteration', () => {
                const faceNodes = cube.querySelectorAll('.face');
                faceNodes.forEach((f) => {
                    const newPhotoNum = (currentPhotoTracker % totalPhotos) + 1;
                    currentPhotoTracker++;
                    const newImgSrc = `/images/${newPhotoNum}.jpg`;

                    f.style.backgroundImage = `url('${newImgSrc}')`;
                    f.setAttribute('data-img-src', newImgSrc);
                });
            });
        });
    }

    // --- ĐÓNG ALBUM ---
    window.closeAlbum = function () {
        const album = document.getElementById('photo-album');
        if (album) {
            album.style.display = 'none';
        }
    };

    // --- MODAL PHÓNG TO ẢNH ---
    window.openModal = function (src) {
        const modal = document.getElementById('imageModal');
        const modalImg = document.getElementById('modalImg');
        if (modal && modalImg) {
            modalImg.src = src;
            modal.classList.add('show');
        }
    };

    window.closeModal = function () {
        const modal = document.getElementById('imageModal');
        if (modal) {
            modal.classList.remove('show');
        }
    };

    // --- HÀM TẠO HẠT KIM TUYẾN LẤP LÁNH ---
    function createSparkles() {
        const containers = [
            document.getElementById('heartsBgContainer'),
            document.querySelector('.scene-container')
        ];

        containers.forEach((container) => {
            if (!container) return;

            const sparklesWrapper = document.createElement('div');
            sparklesWrapper.className = 'sparkles-container';

            const sparkleCount = 80;
            for (let i = 0; i < sparkleCount; i++) {
                const sparkle = document.createElement('div');
                sparkle.className = 'sparkle';

                const size = Math.random() * 3 + 2;
                sparkle.style.width = `${size}px`;
                sparkle.style.height = `${size}px`;

                sparkle.style.top = `${Math.random() * 100}%`;
                sparkle.style.left = `${Math.random() * 100}%`;

                const duration = Math.random() * 3 + 1.5;
                const delay = Math.random() * 4;
                sparkle.style.animationDuration = `${duration}s`;
                sparkle.style.animationDelay = `${delay}s`;

                sparklesWrapper.appendChild(sparkle);
            }

            container.appendChild(sparklesWrapper);
        });
    }

    // --- HIỆU ỨNG TIM BAY NỀN ---
    function initFloatingHearts() {
        const container = document.getElementById('heartsBgContainer');
        if (!container) return;
        const heartIcons = ['💖', '💗', '💓', '💕', '❤️', '🌸', '✨'];

        setInterval(() => {
            const heart = document.createElement('div');
            heart.classList.add('bg-heart');
            heart.innerHTML = heartIcons[Math.floor(Math.random() * heartIcons.length)];
            heart.style.left = `${Math.random() * 100}vw`;
            heart.style.fontSize = `${Math.random() * 16 + 12}px`;

            const duration = Math.random() * 6 + 7;
            heart.style.animationDuration = `${duration}s`;
            container.appendChild(heart);

            setTimeout(() => {
                heart.remove();
            }, duration * 1000);
        }, 350);
    }

    // --- KHỞI TẠO BẮT SỰ KIỆN ---
    document.addEventListener('DOMContentLoaded', () => {
        const imageModal = document.getElementById('imageModal');
        if (imageModal) {
            imageModal.addEventListener('click', (e) => {
                if (e.target === imageModal) window.closeModal();
            });
        }

        const cardModal = document.getElementById('cardModal');
        if (cardModal) {
            cardModal.addEventListener('click', (e) => {
                if (e.target === cardModal) window.closeCardModal();
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                window.closeModal();
                window.closeCardModal();
            }
        });

        initFloatingHearts();
        createSparkles();
    });

})();