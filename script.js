/* ================================================================
   WEDDING INVITATION - تقوي & محمد
   JavaScript: Envelope, Particles, Countdown, Maze Game
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {
    initEnvelopeSparkles();
    initEnvelope();
});

/* ================================================================
   ENVELOPE SPARKLES (Background particles on envelope screen)
   ================================================================ */
function initEnvelopeSparkles() {
    const canvas = document.getElementById('envelope-sparkles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Sparkle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedY = -(Math.random() * 0.5 + 0.2);
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.6 + 0.2;
            this.opacityDir = Math.random() > 0.5 ? 0.005 : -0.005;
            this.hue = Math.random() > 0.7 ? 340 : 42; // gold or pink
        }
        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.opacity += this.opacityDir;
            if (this.opacity > 0.8 || this.opacity < 0.1) this.opacityDir *= -1;
            if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) this.reset();
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = `hsl(${this.hue}, 70%, 70%)`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            // glow
            ctx.shadowColor = `hsl(${this.hue}, 70%, 70%)`;
            ctx.shadowBlur = 10;
            ctx.fill();
            ctx.restore();
        }
    }

    for (let i = 0; i < 60; i++) {
        particles.push(new Sparkle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        animId = requestAnimationFrame(animate);
    }
    animate();

    // Expose stop function
    window._stopEnvelopeSparkles = () => {
        cancelAnimationFrame(animId);
    };
}

/* ================================================================
   ENVELOPE INTERACTION
   ================================================================ */
function initEnvelope() {
    const overlay = document.getElementById('envelope-overlay');
    const envelope = document.getElementById('envelope');
    const mainContent = document.getElementById('main-content');
    if (!overlay || !envelope || !mainContent) return;

    let opened = false;

    overlay.addEventListener('click', () => {
        if (opened) return;
        opened = true;

        // Play background music
        const bgMusic = document.getElementById('bg-music');
        if (bgMusic) {
            bgMusic.volume = 0.5;
            bgMusic.play().catch(() => {
                // Autoplay may be blocked, try again on next interaction
                document.addEventListener('click', () => {
                    bgMusic.play().catch(() => {});
                }, { once: true });
            });
        }

        // Open envelope
        envelope.classList.add('open');

        // Hide hint
        const hint = document.getElementById('envelope-hint');
        if (hint) {
            hint.style.opacity = '0';
            hint.style.transition = 'opacity 0.3s';
        }

        // After envelope animation, transition to main content
        setTimeout(() => {
            overlay.classList.add('closing');
        }, 1400);

        setTimeout(() => {
            overlay.style.display = 'none';
            mainContent.classList.remove('hidden');
            if (window._stopEnvelopeSparkles) window._stopEnvelopeSparkles();
            // Start main content features
            initParticles();
            initCountdown();
            initMaze();
            initScrollAnimations();
        }, 2200);
    });
}

/* ================================================================
   BACKGROUND PARTICLES (Main content - hearts & sparkles)
   ================================================================ */
function initParticles() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const particles = [];
    const particleCount = 50;

    class Particle {
        constructor() {
            this.reset();
            this.y = Math.random() * canvas.height;
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + 20;
            this.size = Math.random() * 4 + 1;
            this.speedY = -(Math.random() * 1 + 0.3);
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.4 + 0.1;
            this.type = Math.random() > 0.75 ? 'heart' : 'circle';
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.02;
            this.wobble = Math.random() * Math.PI * 2;
            this.wobbleSpeed = Math.random() * 0.02 + 0.01;
        }
        update() {
            this.y += this.speedY;
            this.wobble += this.wobbleSpeed;
            this.x += this.speedX + Math.sin(this.wobble) * 0.3;
            this.rotation += this.rotationSpeed;
            if (this.y < -20) this.reset();
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);

            if (this.type === 'heart') {
                this.drawHeart(ctx, 0, 0, this.size * 2.5);
            } else {
                ctx.fillStyle = `rgba(212, 175, 55, 1)`;
                ctx.shadowColor = 'rgba(212, 175, 55, 0.5)';
                ctx.shadowBlur = 8;
                ctx.beginPath();
                ctx.arc(0, 0, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }
        drawHeart(ctx, x, y, size) {
            ctx.fillStyle = 'rgba(201, 83, 122, 0.8)';
            ctx.shadowColor = 'rgba(201, 83, 122, 0.4)';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            const s = size / 2;
            ctx.moveTo(x, y + s / 4);
            ctx.bezierCurveTo(x, y - s / 2, x - s, y - s / 2, x - s, y + s / 8);
            ctx.bezierCurveTo(x - s, y + s / 2, x, y + s * 0.8, x, y + s);
            ctx.bezierCurveTo(x, y + s * 0.8, x + s, y + s / 2, x + s, y + s / 8);
            ctx.bezierCurveTo(x + s, y - s / 2, x, y - s / 2, x, y + s / 4);
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();
}

/* ================================================================
   COUNTDOWN TIMER
   ================================================================ */
function initCountdown() {
    const weddingDate = new Date('2026-06-11T17:00:00+03:00');
    const daysEl = document.getElementById('count-days');
    const hoursEl = document.getElementById('count-hours');
    const minutesEl = document.getElementById('count-minutes');
    const secondsEl = document.getElementById('count-seconds');

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    let prevValues = { days: '', hours: '', minutes: '', seconds: '' };

    function updateCountdown() {
        const now = new Date();
        const diff = weddingDate - now;

        if (diff <= 0) {
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const dStr = String(days).padStart(2, '0');
        const hStr = String(hours).padStart(2, '0');
        const mStr = String(minutes).padStart(2, '0');
        const sStr = String(seconds).padStart(2, '0');

        // Update with tick animation
        if (dStr !== prevValues.days) {
            daysEl.textContent = dStr;
            tickAnim(daysEl);
        }
        if (hStr !== prevValues.hours) {
            hoursEl.textContent = hStr;
            tickAnim(hoursEl);
        }
        if (mStr !== prevValues.minutes) {
            minutesEl.textContent = mStr;
            tickAnim(minutesEl);
        }
        if (sStr !== prevValues.seconds) {
            secondsEl.textContent = sStr;
            tickAnim(secondsEl);
        }

        prevValues = { days: dStr, hours: hStr, minutes: mStr, seconds: sStr };
    }

    function tickAnim(el) {
        el.classList.remove('tick');
        void el.offsetWidth; // force reflow
        el.classList.add('tick');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

/* ================================================================
   SCROLL ANIMATIONS (data-aos attribute)
   ================================================================ */
function initScrollAnimations() {
    const elements = document.querySelectorAll('[data-aos]');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15 });

    elements.forEach(el => observer.observe(el));
}

/* ================================================================
   MAZE GAME - وصل العريس بالعروسة
   ================================================================ */
function initMaze() {
    const canvas = document.getElementById('maze-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Maze config
    const GRID_SIZE = 15; // Odd number for maze generation
    const MAZE_ROWS = GRID_SIZE;
    const MAZE_COLS = GRID_SIZE;

    // Canvas sizing
    function setupCanvasSize() {
        const container = canvas.parentElement;
        const maxSize = Math.min(container.clientWidth - 10, 520);
        canvas.width = maxSize;
        canvas.height = maxSize;
        canvas.style.width = maxSize + 'px';
        canvas.style.height = maxSize + 'px';
    }
    setupCanvasSize();
    window.addEventListener('resize', () => {
        setupCanvasSize();
        renderMaze();
    });

    let maze = [];
    let playerPos = { r: 1, c: 1 };
    let endPos = { r: MAZE_ROWS - 2, c: MAZE_COLS - 2 };
    let isDragging = false;
    let hasWon = false;
    let trail = []; // Player trail for visual effect

    // ========== MAZE GENERATION (Recursive Backtracking) ==========
    function generateMaze() {
        // Init all walls
        maze = Array.from({ length: MAZE_ROWS }, () => Array(MAZE_COLS).fill(1));

        function carve(r, c) {
            maze[r][c] = 0;
            const dirs = [[0, 2], [2, 0], [0, -2], [-2, 0]];
            shuffle(dirs);
            for (const [dr, dc] of dirs) {
                const nr = r + dr;
                const nc = c + dc;
                if (nr > 0 && nr < MAZE_ROWS - 1 && nc > 0 && nc < MAZE_COLS - 1 && maze[nr][nc] === 1) {
                    maze[r + dr / 2][c + dc / 2] = 0; // Carve wall between
                    carve(nr, nc);
                }
            }
        }

        carve(1, 1);

        // Ensure start and end are open
        maze[1][1] = 0;
        maze[MAZE_ROWS - 2][MAZE_COLS - 2] = 0;
    }

    function shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }

    // ========== BFS PATHFINDING (for smooth drag) ==========
    function bfsPath(from, to, maxDepth) {
        if (from.r === to.r && from.c === to.c) return [];
        if (maze[to.r] === undefined || maze[to.r][to.c] === 1) return null;

        const queue = [{ pos: { ...from }, path: [] }];
        const visited = new Set();
        visited.add(`${from.r},${from.c}`);

        while (queue.length > 0) {
            const { pos, path } = queue.shift();
            if (path.length >= maxDepth) continue;

            for (const [dr, dc] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
                const nr = pos.r + dr;
                const nc = pos.c + dc;
                const key = `${nr},${nc}`;

                if (nr >= 0 && nr < MAZE_ROWS && nc >= 0 && nc < MAZE_COLS
                    && maze[nr][nc] === 0 && !visited.has(key)) {
                    const newPath = [...path, { r: nr, c: nc }];
                    if (nr === to.r && nc === to.c) return newPath;
                    visited.add(key);
                    queue.push({ pos: { r: nr, c: nc }, path: newPath });
                }
            }
        }
        return null;
    }

    // ========== RENDERING ==========
    function renderMaze() {
        const cellW = canvas.width / MAZE_COLS;
        const cellH = canvas.height / MAZE_ROWS;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Background
        ctx.fillStyle = '#0d0d24';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw cells
        for (let r = 0; r < MAZE_ROWS; r++) {
            for (let c = 0; c < MAZE_COLS; c++) {
                const x = c * cellW;
                const y = r * cellH;

                if (maze[r][c] === 1) {
                    // Wall
                    const gradient = ctx.createLinearGradient(x, y, x + cellW, y + cellH);
                    gradient.addColorStop(0, '#2a1a3a');
                    gradient.addColorStop(1, '#1a0a2a');
                    ctx.fillStyle = gradient;
                    ctx.fillRect(x, y, cellW, cellH);

                    // Wall border glow
                    ctx.strokeStyle = 'rgba(100, 60, 140, 0.3)';
                    ctx.lineWidth = 0.5;
                    ctx.strokeRect(x, y, cellW, cellH);
                } else {
                    // Path
                    ctx.fillStyle = '#141428';
                    ctx.fillRect(x, y, cellW, cellH);
                }
            }
        }

        // Draw trail
        trail.forEach((t, i) => {
            const x = t.c * cellW + cellW / 2;
            const y = t.r * cellH + cellH / 2;
            const alpha = 0.15 + (i / trail.length) * 0.3;
            ctx.fillStyle = `rgba(212, 175, 55, ${alpha})`;
            ctx.beginPath();
            ctx.arc(x, y, cellW * 0.15, 0, Math.PI * 2);
            ctx.fill();
        });

        // Draw end (Bride) with glow
        const brideX = endPos.c * cellW + cellW / 2;
        const brideY = endPos.r * cellH + cellH / 2;
        ctx.shadowColor = 'rgba(201, 83, 122, 0.6)';
        ctx.shadowBlur = 15;
        ctx.font = `${cellW * 0.7}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('👰', brideX, brideY);
        ctx.shadowBlur = 0;

        // Draw player (Groom) with glow
        if (!hasWon) {
            const groomX = playerPos.c * cellW + cellW / 2;
            const groomY = playerPos.r * cellH + cellH / 2;

            // Glow circle
            ctx.shadowColor = 'rgba(212, 175, 55, 0.6)';
            ctx.shadowBlur = 15;
            ctx.fillStyle = 'rgba(212, 175, 55, 0.1)';
            ctx.beginPath();
            ctx.arc(groomX, groomY, cellW * 0.4, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            ctx.font = `${cellW * 0.7}px serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('🤵', groomX, groomY);
        }

        // Draw border overlay
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
    }

    // ========== PLAYER MOVEMENT ==========
    function getEventPos(e) {
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches ? e.touches[0] : e;
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return {
            x: (touch.clientX - rect.left) * scaleX,
            y: (touch.clientY - rect.top) * scaleY
        };
    }

    function posToCell(pos) {
        const cellW = canvas.width / MAZE_COLS;
        const cellH = canvas.height / MAZE_ROWS;
        return {
            r: Math.floor(pos.y / cellH),
            c: Math.floor(pos.x / cellW)
        };
    }

    function isPlayerCell(cell) {
        return cell.r === playerPos.r && cell.c === playerPos.c;
    }

    function isNearPlayer(pos) {
        const cellW = canvas.width / MAZE_COLS;
        const cellH = canvas.height / MAZE_ROWS;
        const playerX = playerPos.c * cellW + cellW / 2;
        const playerY = playerPos.r * cellH + cellH / 2;
        const dist = Math.hypot(pos.x - playerX, pos.y - playerY);
        return dist < cellW * 1.2;
    }

    function movePlayerToward(targetCell) {
        if (hasWon) return;
        if (targetCell.r < 0 || targetCell.r >= MAZE_ROWS || targetCell.c < 0 || targetCell.c >= MAZE_COLS) return;

        // Use BFS to find short path to target
        const path = bfsPath(playerPos, targetCell, 4);
        if (path && path.length > 0) {
            // Move one step at a time
            const nextStep = path[0];
            if (!trail.some(t => t.r === playerPos.r && t.c === playerPos.c)) {
                trail.push({ ...playerPos });
            }
            playerPos = { ...nextStep };

            // Keep trail reasonable length
            if (trail.length > 100) trail = trail.slice(-80);

            renderMaze();
            checkWin();
        }
    }

    function checkWin() {
        if (playerPos.r === endPos.r && playerPos.c === endPos.c) {
            hasWon = true;
            renderMaze();
            setTimeout(() => {
                showWinScreen();
            }, 300);
        }
    }

    function showWinScreen() {
        // Just launch confetti - no overlay screen
        launchConfetti();
        // Re-render maze to show both emojis together
        renderWinState();
    }

    function renderWinState() {
        // Redraw maze with both groom and bride together at end position
        renderMaze();
        const cellW = canvas.width / MAZE_COLS;
        const cellH = canvas.height / MAZE_ROWS;
        const endX = endPos.c * cellW + cellW / 2;
        const endY = endPos.r * cellH + cellH / 2;

        // Draw celebration glow
        ctx.save();
        ctx.shadowColor = 'rgba(212, 175, 55, 0.8)';
        ctx.shadowBlur = 25;
        ctx.fillStyle = 'rgba(212, 175, 55, 0.15)';
        ctx.beginPath();
        ctx.arc(endX, endY, cellW * 0.8, 0, Math.PI * 2);
        ctx.fill();

        // Draw groom next to bride
        ctx.shadowBlur = 0;
        ctx.font = `${cellW * 0.55}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🤵', endX - cellW * 0.25, endY);
        ctx.fillText('👰', endX + cellW * 0.25, endY);

        // Draw heart above them
        ctx.font = `${cellW * 0.4}px serif`;
        ctx.fillText('💕', endX, endY - cellW * 0.45);
        ctx.restore();

        // Show "مبروك" text on canvas
        ctx.save();
        ctx.font = `bold ${cellW * 0.8}px 'Cairo', sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'rgba(212, 175, 55, 0.9)';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
        ctx.shadowBlur = 10;
        ctx.fillText('🎉 مبروك! 🎉', canvas.width / 2, cellW * 1.5);
        ctx.restore();
    }

    // ========== EVENT HANDLERS ==========
    function handleStart(e) {
        if (hasWon) return;
        e.preventDefault();
        const pos = getEventPos(e);
        if (isNearPlayer(pos)) {
            isDragging = true;
            canvas.style.cursor = 'grabbing';
        }
    }

    function handleMove(e) {
        if (!isDragging || hasWon) return;
        e.preventDefault();
        const pos = getEventPos(e);
        const targetCell = posToCell(pos);
        movePlayerToward(targetCell);
    }

    function handleEnd(e) {
        isDragging = false;
        canvas.style.cursor = 'grab';
    }

    // Mouse events
    canvas.addEventListener('mousedown', handleStart);
    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('mouseup', handleEnd);
    canvas.addEventListener('mouseleave', handleEnd);

    // Touch events
    canvas.addEventListener('touchstart', handleStart, { passive: false });
    canvas.addEventListener('touchmove', handleMove, { passive: false });
    canvas.addEventListener('touchend', handleEnd);
    canvas.addEventListener('touchcancel', handleEnd);

    // ========== RESET & PLAY AGAIN ==========
    function resetMaze() {
        hasWon = false;
        playerPos = { r: 1, c: 1 };
        trail = [];
        generateMaze();
        renderMaze();
        // Remove confetti canvas if exists
        const confettiCanvas = document.getElementById('confetti-canvas');
        if (confettiCanvas) confettiCanvas.remove();
    }

    const resetBtn = document.getElementById('maze-reset');
    if (resetBtn) resetBtn.addEventListener('click', resetMaze);

    // ========== INITIAL SETUP ==========
    generateMaze();
    renderMaze();
}

/* ================================================================
   CONFETTI CELEBRATION
   ================================================================ */
function launchConfetti() {
    // Remove existing confetti canvas
    let existing = document.getElementById('confetti-canvas');
    if (existing) existing.remove();

    const canvas = document.createElement('canvas');
    canvas.id = 'confetti-canvas';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confettiPieces = [];
    const colors = [
        '#D4AF37', '#FFD700', '#F5E6C8', '#C9537A',
        '#FF69B4', '#FF1493', '#B8860B', '#FFC0CB',
        '#FF6B6B', '#FFEAA7', '#DDA0DD', '#FF85A2'
    ];

    class Confetti {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = -20 - Math.random() * 200;
            this.size = Math.random() * 10 + 5;
            this.speedY = Math.random() * 3 + 2;
            this.speedX = (Math.random() - 0.5) * 4;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = (Math.random() - 0.5) * 10;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.shape = Math.random() > 0.5 ? 'rect' : 'circle';
            this.wobble = Math.random() * Math.PI * 2;
            this.wobbleSpeed = Math.random() * 0.1 + 0.05;
            this.opacity = 1;
        }
        update() {
            this.y += this.speedY;
            this.wobble += this.wobbleSpeed;
            this.x += this.speedX + Math.sin(this.wobble) * 0.5;
            this.rotation += this.rotationSpeed;
            this.speedY += 0.02; // gravity
            if (this.y > canvas.height + 20) {
                this.opacity -= 0.02;
            }
        }
        draw() {
            if (this.opacity <= 0) return;
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.fillStyle = this.color;

            if (this.shape === 'rect') {
                ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
            } else {
                ctx.beginPath();
                ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }
    }

    // Create confetti pieces in bursts
    for (let i = 0; i < 150; i++) {
        confettiPieces.push(new Confetti());
    }

    let frameCount = 0;
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let alive = false;
        confettiPieces.forEach(p => {
            p.update();
            p.draw();
            if (p.opacity > 0) alive = true;
        });

        frameCount++;

        // Add more confetti in first 2 seconds
        if (frameCount < 120 && frameCount % 4 === 0) {
            confettiPieces.push(new Confetti());
        }

        if (alive && frameCount < 500) {
            requestAnimationFrame(animate);
        } else {
            canvas.remove();
        }
    }
    animate();
}
