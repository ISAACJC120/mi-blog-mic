/**
 * INTERACTIVE LOGIC & PEDAGOGICAL BLOG ANIMATIONS
 * MIC Quito - Frontend Programming
 */

const initBlog = () => {
    // --- 1. CORE VARIABLES ---
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navbar = document.getElementById('navbar');
    const progressBar = document.getElementById('progress-bar');
    const header = document.getElementById('main-header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section, main');

    // --- 2. THEME TOGGLER (DARK / LIGHT MODE) ---
    // Check local storage or system default
    const savedTheme = localStorage.getItem('mic-blog-theme');
    if (savedTheme) {
        body.classList.remove('dark-theme', 'light-theme');
        body.classList.add(savedTheme);
    } else {
        // Default to dark theme as requested by style specs
        body.classList.add('dark-theme');
    }

    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark-theme')) {
            body.classList.replace('dark-theme', 'light-theme');
            localStorage.setItem('mic-blog-theme', 'light-theme');
        } else {
            body.classList.replace('light-theme', 'dark-theme');
            localStorage.setItem('mic-blog-theme', 'dark-theme');
        }
    });

    // --- 3. RESPONSIVE MOBILE MENU ---
    const toggleMenu = () => {
        const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
        mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
        mobileMenuToggle.classList.toggle('active');
        navbar.classList.toggle('active');
    };

    mobileMenuToggle.addEventListener('click', toggleMenu);

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbar.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // --- 4. INTERACTIVE TABS (PEDAGOGICAL MODELS) ---
    const tabContainers = document.querySelectorAll('.experiment-info');

    tabContainers.forEach(container => {
        const tabs = container.querySelectorAll('.tab-btn');
        const panels = container.querySelectorAll('.tab-panel');

        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const targetId = tab.getAttribute('data-target');

                // Update active state of tabs
                tabs.forEach(t => {
                    t.classList.remove('active');
                    t.setAttribute('aria-selected', 'false');
                });
                tab.classList.add('active');
                tab.setAttribute('aria-selected', 'true');

                // Update active state of panels with transition
                panels.forEach(panel => {
                    if (panel.id === targetId) {
                        panel.style.display = 'block';
                        // Short delay to allow display change to register before animation triggers
                        setTimeout(() => {
                            panel.classList.add('active');
                        }, 20);
                    } else {
                        panel.style.display = 'none';
                        panel.classList.remove('active');
                    }
                });
            });
        });
    });

    // --- 5. READING PROGRESS & HEADER SHADOW ON SCROLL ---
    window.addEventListener('scroll', () => {
        // Calculate scroll percentage
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';

        // Toggle header scrolled class
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active Navigation Link on Scroll
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= (sectionTop - 120)) {
                currentSection = section.getAttribute('id');
            }
        });

        // Corner case: at the bottom of the page
        if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 50) {
            currentSection = 'referencias';
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });

    // --- 6. SCROLL REVEAL (ENTRANCE ANIMATION) ---
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        root: null, // viewport
        threshold: 0.15, // 15% of element visible
        rootMargin: '0px 0px -50px 0px' // offset bottom triggers slightly earlier
    });

    const revealElements = document.querySelectorAll('.scroll-reveal');
    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // ==========================================================================
    // HISTORIA, JUEGO PARCHE VERDE & TRIVIA DIDÁCTICA
    // ==========================================================================

    // --- AUDIO SYSTEM (Web Audio API) ---
    let audioCtx = null;
    let soundEnabled = true;
    const soundToggleBtn = document.getElementById('sound-toggle-btn');

    function initAudio() {
        if (!audioCtx) {
            try {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                console.warn('AudioContext constructor is blocked or not supported:', e);
            }
        }
    }

    // Sound toggle
    if (soundToggleBtn) {
        soundToggleBtn.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            if (soundEnabled) {
                soundToggleBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
                initAudio();
                playTone(440, 'sine', 0.05);
            } else {
                soundToggleBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
            }
        });
    }

    function playTone(freq, type, duration) {
        if (!soundEnabled) return;
        try {
            initAudio();
            if (!audioCtx) return;
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

            gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch (e) {
            console.warn('Audio play failed:', e);
        }
    }

    function playSlideSound() {
        playTone(180, 'triangle', 0.25);
    }

    function playVictorySound() {
        if (!soundEnabled) return;
        try {
            initAudio();
            if (!audioCtx) return;
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            const now = audioCtx.currentTime;
            
            // Note 1 (C5)
            const osc1 = audioCtx.createOscillator();
            const gain1 = audioCtx.createGain();
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(523.25, now);
            gain1.gain.setValueAtTime(0.1, now);
            gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
            osc1.connect(gain1);
            gain1.connect(audioCtx.destination);
            osc1.start(now);
            osc1.stop(now + 0.3);

            // Note 2 (G5)
            const osc2 = audioCtx.createOscillator();
            const gain2 = audioCtx.createGain();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(783.99, now + 0.15);
            gain2.gain.setValueAtTime(0.12, now + 0.15);
            gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
            osc2.connect(gain2);
            gain2.connect(audioCtx.destination);
            osc2.start(now + 0.15);
            osc2.stop(now + 0.6);
        } catch (e) {
            console.warn('Victory sound failed:', e);
        }
    }

    // --- GAME LOGIC: CREA UN PARCHE VERDE ---
    const blocks = document.querySelectorAll('.sliding-block');
    const greenPatch = document.getElementById('green-patch');
    const victoryCard = document.getElementById('victory-card');
    const resetBtn = document.getElementById('reset-game-btn');
    let gameSolved = false;

    // Define coordinates and axis for each block
    // block-top/bottom move vertically (Y axis), block-left/right move horizontally (X axis)
    const blockData = {
        'block-top': { axis: 'y', x: 90, minY: 20, maxY: 85, inY: 85, outY: 20, currentY: 20 },
        'block-bottom': { axis: 'y', x: 90, minY: 165, maxY: 230, inY: 165, outY: 230, currentY: 165 },
        'block-left': { axis: 'x', y: 125, minX: 10, maxX: 90, inX: 90, outX: 10, currentX: 10 },
        'block-right': { axis: 'x', y: 125, minX: 90, maxX: 170, inX: 90, outX: 170, currentX: 170 }
    };

    // Apply coordinate positions to elements
    function updateBlockPositions() {
        Object.keys(blockData).forEach(id => {
            const block = document.getElementById(id);
            if (block) {
                const data = blockData[id];
                if (data.axis === 'y') {
                    block.style.left = data.x + 'px';
                    block.style.top = data.currentY + 'px';
                    const isOut = Math.abs(data.currentY - data.outY) < Math.abs(data.currentY - data.inY);
                    block.setAttribute('data-pos', isOut ? 'out' : 'in');
                } else {
                    block.style.top = data.y + 'px';
                    block.style.left = data.currentX + 'px';
                    const isOut = Math.abs(data.currentX - data.outX) < Math.abs(data.currentX - data.inX);
                    block.setAttribute('data-pos', isOut ? 'out' : 'in');
                }
            }
        });
    }

    // Set initial layout positions
    updateBlockPositions();

    // Check Win Condition
    function checkWin() {
        const allOut = Object.keys(blockData).every(id => {
            const data = blockData[id];
            if (data.axis === 'y') {
                return data.currentY === data.outY;
            } else {
                return data.currentX === data.outX;
            }
        });

        if (allOut && !gameSolved) {
            gameSolved = true;
            greenPatch.classList.add('solved');
            victoryCard.classList.add('show');
            playVictorySound();
        } else if (!allOut && gameSolved) {
            gameSolved = false;
            greenPatch.classList.remove('solved');
            victoryCard.classList.remove('show');
        }
    }

    // Pointer-based Drag & Drop Logic (Mouse + Touch)
    let activeDragBlock = null;
    let dragStartPos = 0;
    let dragBlockStartPos = 0;

    blocks.forEach(block => {
        block.addEventListener('pointerdown', (e) => {
            initAudio();
            activeDragBlock = block.id;
            const data = blockData[activeDragBlock];
            
            if (data.axis === 'y') {
                dragStartPos = e.clientY;
                dragBlockStartPos = data.currentY;
            } else {
                dragStartPos = e.clientX;
                dragBlockStartPos = data.currentX;
            }
            
            block.style.transition = 'none'; // Disable transition for real-time drag
            block.classList.add('active-block');
            block.setPointerCapture(e.pointerId);
            playSlideSound();
        });

        block.addEventListener('pointermove', (e) => {
            if (activeDragBlock !== block.id) return;
            const data = blockData[activeDragBlock];
            
            if (data.axis === 'y') {
                const deltaY = e.clientY - dragStartPos;
                let newY = dragBlockStartPos + deltaY;
                newY = Math.max(data.minY, Math.min(data.maxY, newY));
                data.currentY = newY;
                block.style.top = newY + 'px';
                
                const isOut = Math.abs(data.currentY - data.outY) < Math.abs(data.currentY - data.inY);
                block.setAttribute('data-pos', isOut ? 'out' : 'in');
            } else {
                const deltaX = e.clientX - dragStartPos;
                let newX = dragBlockStartPos + deltaX;
                newX = Math.max(data.minX, Math.min(data.maxX, newX));
                data.currentX = newX;
                block.style.left = newX + 'px';
                
                const isOut = Math.abs(data.currentX - data.outX) < Math.abs(data.currentX - data.inX);
                block.setAttribute('data-pos', isOut ? 'out' : 'in');
            }
        });

        block.addEventListener('pointerup', (e) => {
            if (activeDragBlock !== block.id) return;
            const data = blockData[activeDragBlock];
            block.releasePointerCapture(e.pointerId);
            
            if (data.axis === 'y') {
                const distIn = Math.abs(data.currentY - data.inY);
                const distOut = Math.abs(data.currentY - data.outY);
                block.style.transition = 'top 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)';
                
                if (distOut < distIn) {
                    data.currentY = data.outY;
                    block.setAttribute('data-pos', 'out');
                } else {
                    data.currentY = data.inY;
                    block.setAttribute('data-pos', 'in');
                }
                block.style.top = data.currentY + 'px';
            } else {
                const distIn = Math.abs(data.currentX - data.inX);
                const distOut = Math.abs(data.currentX - data.outX);
                block.style.transition = 'left 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)';
                
                if (distOut < distIn) {
                    data.currentX = data.outX;
                    block.setAttribute('data-pos', 'out');
                } else {
                    data.currentX = data.inX;
                    block.setAttribute('data-pos', 'in');
                }
                block.style.left = data.currentX + 'px';
            }
            
            block.classList.remove('active-block');
            activeDragBlock = null;

            playTone(200, 'triangle', 0.12); // Snapping click sound
            checkWin();
        });
    });

    // Reset Game
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            initAudio();
            blockData['block-top'].currentY = blockData['block-top'].outY;
            blockData['block-left'].currentX = blockData['block-left'].outX;
            blockData['block-right'].currentX = blockData['block-right'].outX;
            blockData['block-bottom'].currentY = blockData['block-bottom'].inY;

            blocks.forEach(block => {
                block.style.transition = 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)';
            });

            updateBlockPositions();
            gameSolved = false;
            greenPatch.classList.remove('solved');
            victoryCard.classList.remove('show');
            playTone(330, 'triangle', 0.15);
        });
    }

    // --- TRIVIA QUIZ LOGIC ---
    const triviaQuestions = document.querySelectorAll('.trivia-card-question');

    triviaQuestions.forEach(card => {
        const buttons = card.querySelectorAll('.option-btn');
        const feedbackBox = card.querySelector('.feedback-box');
        const feedbackText = card.querySelector('.feedback-text');

        buttons.forEach(button => {
            button.addEventListener('click', () => {
                initAudio();
                const isCorrect = button.getAttribute('data-correct') === 'true';
                
                // Disable all buttons in this question card
                buttons.forEach(btn => {
                    btn.disabled = true;
                    if (btn.getAttribute('data-correct') === 'true') {
                        btn.classList.add('selected-correct');
                    }
                });

                if (isCorrect) {
                    button.classList.add('selected-correct');
                    feedbackBox.classList.add('show', 'correct');
                    feedbackText.innerHTML = '<strong>¡Correcto!</strong> ' + getPedagogicalFeedback(card.getAttribute('data-question'));
                    playTone(660, 'sine', 0.15);
                } else {
                    button.classList.add('selected-incorrect');
                    feedbackBox.classList.add('show', 'incorrect');
                    feedbackText.innerHTML = '<strong>Incorrecto.</strong> ' + getPedagogicalFeedback(card.getAttribute('data-question'));
                    playTone(220, 'sawtooth', 0.15);
                }
            });
        });
    });

    function getPedagogicalFeedback(questionNumber) {
        if (questionNumber === '1') {
            return 'Piaget sostiene que cuando nuestras ideas previas no coinciden con la realidad del entorno, se produce un <em>conflicto cognitivo</em>. Para superarlo, el sujeto debe realizar un proceso de asimilación y acomodación, reestructurando sus esquemas mentales.';
        } else if (questionNumber === '2') {
            return 'Vygotsky postula que las funciones psicológicas superiores se originan en las interacciones sociales. En el MIC, cooperar con otros actúa como un <em>andamiaje</em> dentro de la Zona de Desarrollo Próximo (ZDP), permitiendo realizar tareas complejas en conjunto.';
        } else if (questionNumber === '3') {
            return 'Jerome Bruner defendió el <em>aprendizaje por descubrimiento activo</em> y el andamiaje enactivo. Él sostenía que el alumno aprende de manera mucho más significativa cuando manipula las cosas por sí mismo, pasando de lo concreto a lo simbólico.';
        }
        return '';
    }

    // --- GLOSARIO INTERACTIVO (TOOLTIPS) ---
    const tooltipTerms = document.querySelectorAll('.tooltip-term');
    const tooltipBox = document.createElement('div');
    tooltipBox.className = 'pedagogical-tooltip';
    document.body.appendChild(tooltipBox);

    tooltipTerms.forEach(term => {
        const showTooltip = () => {
            const defText = term.getAttribute('data-def');
            if (!defText) return;

            tooltipBox.innerHTML = defText;
            tooltipBox.classList.add('show');

            const rect = term.getBoundingClientRect();
            
            // Initial positioning (above the term, centered horizontally)
            let tooltipTop = rect.top + window.scrollY - tooltipBox.offsetHeight - 10;
            let tooltipLeft = rect.left + window.scrollX + (rect.width / 2) - (tooltipBox.offsetWidth / 2);

            // Boundaries protection
            const padding = 10;
            const viewportWidth = document.documentElement.clientWidth;

            if (tooltipLeft < padding) {
                tooltipLeft = padding;
            } else if ((tooltipLeft + tooltipBox.offsetWidth) > (viewportWidth - padding)) {
                tooltipLeft = viewportWidth - tooltipBox.offsetWidth - padding;
            }

            // If it goes above the viewport top, display it below the term instead
            if (rect.top - tooltipBox.offsetHeight - 15 < 0) {
                tooltipTop = rect.bottom + window.scrollY + 10;
            }

            tooltipBox.style.top = tooltipTop + 'px';
            tooltipBox.style.left = tooltipLeft + 'px';
        };

        const hideTooltip = () => {
            tooltipBox.classList.remove('show');
        };

        term.addEventListener('mouseenter', showTooltip);
        term.addEventListener('mouseleave', hideTooltip);

        // Mobile touch support
        term.addEventListener('touchstart', (e) => {
            e.preventDefault();
            showTooltip();
        }, { passive: false });

        term.addEventListener('touchend', hideTooltip);
    });

    // Hide tooltip on global scroll or document click (good for mobile)
    window.addEventListener('scroll', () => {
        tooltipBox.classList.remove('show');
    });
    document.addEventListener('pointerdown', (e) => {
        if (!e.target.classList.contains('tooltip-term')) {
            tooltipBox.classList.remove('show');
        }
    });

    // --- LUPA DE EVIDENCIAS (LIGHTBOX) ---
    const lightboxOverlay = document.getElementById('lightbox-overlay');
    const lightboxImg = lightboxOverlay.querySelector('.lightbox-image');
    const lightboxCaption = lightboxOverlay.querySelector('.lightbox-caption');
    const lightboxClose = lightboxOverlay.querySelector('.lightbox-close');
    const hoverableImages = document.querySelectorAll('.exp-img, .exhibit-img');

    hoverableImages.forEach(img => {
        img.addEventListener('click', () => {
            initAudio();
            const captionText = getCaptionText(img);
            
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightboxCaption.textContent = captionText;

            lightboxOverlay.style.display = 'flex';
            // Trigger browser paint to transition opacity smoothly
            setTimeout(() => {
                lightboxOverlay.classList.add('show');
                lightboxOverlay.setAttribute('aria-hidden', 'false');
            }, 10);

            playTone(400, 'sine', 0.08); // satisfying click chime
        });
    });

    function getCaptionText(img) {
        const visualCaption = img.closest('.experiment-visual, .exhibit-reference-card')?.querySelector('.visual-caption p, .exhibit-caption p');
        if (visualCaption) {
            return visualCaption.textContent;
        }
        return img.alt || 'Evidencia fotográfica del Museo Interactivo de Ciencias.';
    }

    const closeLightbox = () => {
        lightboxOverlay.classList.remove('show');
        lightboxOverlay.setAttribute('aria-hidden', 'true');
        setTimeout(() => {
            lightboxOverlay.style.display = 'none';
        }, 350); // wait for fade transition to end
    };

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    // Close on backdrop click
    lightboxOverlay.addEventListener('click', (e) => {
        if (e.target === lightboxOverlay) {
            closeLightbox();
        }
    });

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightboxOverlay.classList.contains('show')) {
            closeLightbox();
        }
    });

    // --- PEDAGOGICAL FILTER BAR (CASCADING SYNCHRONIZATION) ---
    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const theory = btn.getAttribute('data-theory');
            
            // Update active state of filter buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            if (theory === 'all') {
                playTone(300, 'sine', 0.08);
                return;
            }

            // Sync all experiment tabs matching the theory
            const targetTabs = document.querySelectorAll(`.tab-btn[id$="-${theory}"]`);
            targetTabs.forEach(tab => {
                if (!tab.classList.contains('active')) {
                    tab.click();
                }
            });

            // Trigger visual pulse glow on synchronized panels
            const targetPanels = document.querySelectorAll(`.tab-panel[id$="-${theory}"]`);
            targetPanels.forEach(panel => {
                panel.classList.add('active-glow');
                setTimeout(() => {
                    panel.classList.remove('active-glow');
                }, 1200);
            });

            // Play nice feedback tone
            const toneFreq = theory === 'cog' ? 440 : theory === 'con' ? 523 : 587;
            playTone(toneFreq, 'sine', 0.1);
        });
    });

    // --- COMPARISON CARDS INTERACTIVE ACCORDION ---
    const compCards = document.querySelectorAll('.comparison-card');

    compCards.forEach(card => {
        const toggleBtn = card.querySelector('.comp-toggle-btn');
        
        const toggleCard = (e) => {
            e.stopPropagation();
            initAudio();

            const isExpanded = card.classList.contains('expanded');
            
            // Close other cards first for a clean accordion behavior
            compCards.forEach(c => {
                if (c !== card) c.classList.remove('expanded');
            });

            card.classList.toggle('expanded');

            if (!isExpanded) {
                playTone(350, 'triangle', 0.12);
            } else {
                playTone(250, 'triangle', 0.08);
            }
        };

        card.addEventListener('click', toggleCard);
        if (toggleBtn) {
            toggleBtn.addEventListener('click', toggleCard);
        }
    });

    // ==========================================================================
    // LÓGICA DE SIMULADORES INTERACTIVOS Y CONECTIVIDAD PEDAGÓGICA
    // ==========================================================================

    // --- 1. LÓGICA DEL LABORATORIO DE POLEAS ---
    const ropePullSlider = document.getElementById('rope-pull-slider');
    const setupBtns = document.querySelectorAll('.setup-btn');
    const effortValue = document.getElementById('effort-value');
    const effortBar = document.getElementById('effort-bar');
    const cuerdaValue = document.getElementById('cuerda-value');
    const cuerdaBar = document.getElementById('cuerda-bar');
    const ropePath = document.getElementById('rope-path');
    const svgPulleys = document.getElementById('svg-pulleys');
    const svgWeight = document.getElementById('svg-weight');
    const svgHandle = document.getElementById('svg-handle');

    let currentSetup = 1; // 1, 2, 3, 4 poleas
    let pullPercent = 0;   // 0 a 100%

    function updatePulleySim() {
        if (!svgWeight || !svgPulleys || !ropePath) return;

        const pullFraction = pullPercent / 100;
        const n = parseInt(currentSetup); // 1, 2, 3, 4

        // Relaciones físicas reales:
        // Cuerda jalada en metros va de 0 a N metros
        const cuerdaTirada = pullFraction * n;
        // La altura del peso sube en función de la cuerda dividida por el factor N
        const pesoSubida = pullFraction * 100; // De 0 a 100 px máximo

        const weightY = 160 - (pesoSubida / n);
        const pulleyMobileY = weightY - 14;

        // Mover la carga de peso
        svgWeight.setAttribute('transform', `translate(150, ${weightY})`);

        let pulleysHTML = '';
        let ropeD = '';

        if (n === 1) {
            // --- 1 POLEA FIJA ---
            // Polea fija superior en X=150, Y=35 (R=14)
            pulleysHTML += `<circle cx="150" cy="35" r="14" fill="#313d52" stroke="#718096" stroke-width="2"/>`;
            pulleysHTML += `<circle cx="150" cy="35" r="3" fill="#cbd5e0"/>`;
            pulleysHTML += `<line x1="150" y1="12" x2="150" y2="21" stroke="#cbd5e0" stroke-width="2"/>`;

            const handleY = 90 + (pullPercent * 0.9); // baja al jalar
            svgHandle.setAttribute('transform', `translate(60, ${handleY})`);

            // Cable: Del tirador, sube por la izquierda de la polea, da la vuelta arriba y baja al peso
            ropeD = `M 60 ${handleY} L 136 35 A 14 14 0 0 1 164 35 L 164 ${weightY + 10}`;
        } else if (n === 2) {
            // --- 2 POLEAS (1 Fija, 1 Móvil) ---
            // Fija superior: X=135 Y=35 (R=12)
            pulleysHTML += `<circle cx="132" cy="35" r="12" fill="#313d52" stroke="#718096" stroke-width="2"/>`;
            pulleysHTML += `<circle cx="132" cy="35" r="3" fill="#cbd5e0"/>`;
            pulleysHTML += `<line x1="132" y1="12" x2="132" y2="23" stroke="#cbd5e0" stroke-width="2"/>`;

            // Móvil inferior: X=160 Y=pulleyMobileY (R=12)
            pulleysHTML += `<circle cx="160" cy="${pulleyMobileY}" r="12" fill="#2d3748" stroke="#00f5a0" stroke-width="2"/>`;
            pulleysHTML += `<circle cx="160" cy="${pulleyMobileY}" r="3" fill="#00f5a0"/>`;
            pulleysHTML += `<line x1="160" y1="${pulleyMobileY}" x2="150" y2="${weightY + 10}" stroke="#00f5a0" stroke-width="2"/>`;

            const handleY = 90 + (pullPercent * 1.1);
            svgHandle.setAttribute('transform', `translate(60, ${handleY})`);

            // Cable: Anclaje viga superior en X=172 Y=12. Baja a la móvil (entra por X=172 Y=pulleyMobileY, gira y sale por X=148 Y=pulleyMobileY).
            // Sube a la fija (entra por X=144, sale por X=120 Y=35), y baja a la mano
            ropeD = `M 172 12 L 172 ${pulleyMobileY} A 12 12 0 0 1 148 ${pulleyMobileY} L 144 35 A 12 12 0 0 0 120 35 L 60 ${handleY}`;
        } else if (n === 3) {
            // --- 3 POLEAS (2 Fijas, 1 Móvil) ---
            // Fijas superiores: X=120 Y=35 y X=152 Y=35
            pulleysHTML += `<circle cx="120" cy="35" r="11" fill="#313d52" stroke="#718096" stroke-width="2"/>`;
            pulleysHTML += `<line x1="120" y1="12" x2="120" y2="24" stroke="#cbd5e0" stroke-width="2"/>`;

            pulleysHTML += `<circle cx="152" cy="35" r="11" fill="#313d52" stroke="#718096" stroke-width="2"/>`;
            pulleysHTML += `<line x1="152" y1="12" x2="152" y2="24" stroke="#cbd5e0" stroke-width="2"/>`;

            // Móvil inferior: X=136 Y=pulleyMobileY
            pulleysHTML += `<circle cx="136" cy="${pulleyMobileY}" r="11" fill="#2d3748" stroke="#00f5a0" stroke-width="2"/>`;
            pulleysHTML += `<line x1="136" y1="${pulleyMobileY}" x2="150" y2="${weightY + 10}" stroke="#00f5a0" stroke-width="2"/>`;

            const handleY = 90 + (pullPercent * 1.3);
            svgHandle.setAttribute('transform', `translate(60, ${handleY})`);

            // Cable: Anclaje en el peso (X=150, weightY+10). Sube a la fija derecha (X=163 Y=35), gira a X=141 Y=35.
            // Baja a la móvil (X=147 Y=pulleyMobileY), gira a X=125 Y=pulleyMobileY. Sube a fija izquierda (X=131 Y=35), gira a X=109 y baja a la mano.
            ropeD = `M 150 ${weightY + 10} L 163 35 A 11 11 0 0 0 141 35 L 147 ${pulleyMobileY} A 11 11 0 0 1 125 ${pulleyMobileY} L 131 35 A 11 11 0 0 0 109 35 L 60 ${handleY}`;
        } else if (n === 4) {
            // --- 4 POLEAS (2 Fijas, 2 Móviles) ---
            // Fijas superiores: X=115 Y=35 y X=145 Y=35
            pulleysHTML += `<circle cx="115" cy="35" r="11" fill="#313d52" stroke="#718096" stroke-width="2"/>`;
            pulleysHTML += `<line x1="115" y1="12" x2="115" y2="24" stroke="#cbd5e0" stroke-width="2"/>`;

            pulleysHTML += `<circle cx="145" cy="35" r="11" fill="#313d52" stroke="#718096" stroke-width="2"/>`;
            pulleysHTML += `<line x1="145" y1="12" x2="145" y2="24" stroke="#cbd5e0" stroke-width="2"/>`;

            // Móviles inferiores: X=130 Y=pulleyMobileY, X=160 Y=pulleyMobileY
            pulleysHTML += `<circle cx="130" cy="${pulleyMobileY}" r="11" fill="#2d3748" stroke="#00f5a0" stroke-width="2"/>`;
            pulleysHTML += `<line x1="130" y1="${pulleyMobileY}" x2="150" y2="${weightY + 10}" stroke="#00f5a0" stroke-width="2"/>`;

            pulleysHTML += `<circle cx="160" cy="${pulleyMobileY}" r="11" fill="#2d3748" stroke="#00f5a0" stroke-width="2"/>`;
            pulleysHTML += `<line x1="160" y1="${pulleyMobileY}" x2="150" y2="${weightY + 10}" stroke="#00f5a0" stroke-width="2"/>`;

            const handleY = 90 + (pullPercent * 1.4);
            svgHandle.setAttribute('transform', `translate(60, ${handleY})`);

            // Cable completo polipasto
            ropeD = `M 171 12 L 171 ${pulleyMobileY} A 11 11 0 0 1 149 ${pulleyMobileY} L 156 35 A 11 11 0 0 0 134 35 L 141 ${pulleyMobileY} A 11 11 0 0 1 119 ${pulleyMobileY} L 126 35 A 11 11 0 0 0 104 35 L 60 ${handleY}`;
        }

        svgPulleys.innerHTML = pulleysHTML;
        ropePath.setAttribute('d', ropeD);

        // Actualizar Métricas en Interfaz
        const esfuerzoKGF = Math.round(100 / n);
        const esfuerzoN = Math.round(esfuerzoKGF * 9.8);
        effortValue.textContent = `${esfuerzoKGF} kgf (${esfuerzoN} N)`;

        // Colores y barra de progreso de esfuerzo
        const effortPercent = (100 / n);
        effortBar.style.width = `${effortPercent}%`;
        if (effortPercent <= 25) {
            effortBar.style.backgroundColor = '#00f5a0'; // Verde
        } else if (effortPercent <= 50) {
            effortBar.style.backgroundColor = '#00f2fe'; // Cyan
        } else {
            effortBar.style.backgroundColor = '#ef4444'; // Rojo esfuerzo máximo
        }

        // Cuerda
        cuerdaValue.textContent = `${cuerdaTirada.toFixed(1)} m`;
        cuerdaBar.style.width = `${(cuerdaTirada / 4) * 100}%`;
    }

    if (ropePullSlider) {
        ropePullSlider.addEventListener('input', (e) => {
            initAudio();
            pullPercent = parseInt(e.target.value);
            updatePulleySim();
            // Efecto de sonido por fricción física intermitente
            if (pullPercent % 6 === 0) {
                playTone(150 + (pullPercent * 1.5), 'sine', 0.02);
            }
        });
    }

    setupBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            initAudio();
            setupBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentSetup = parseInt(btn.getAttribute('data-setup'));
            
            // Reiniciar estado para consistencia didáctica
            if (ropePullSlider) ropePullSlider.value = 0;
            pullPercent = 0;
            updatePulleySim();
            
            playTone(320 + (currentSetup * 60), 'sine', 0.08);
        });
    });


    // --- 2. LÓGICA DEL SIMULADOR DEL LUDIÓN DE DESCARTES ---
    const ludionPressureSlider = document.getElementById('ludion-pressure-slider');
    const ludionGotero = document.getElementById('ludion-gotero');
    const goteroAirBubble = document.getElementById('gotero-air-bubble');
    const goteroWaterFill = document.getElementById('gotero-water-fill');
    const ludionPressureVal = document.getElementById('ludion-pressure-val');
    const ludionPressureBar = document.getElementById('ludion-pressure-bar');
    const ludionAirVal = document.getElementById('ludion-air-val');
    const ludionAirBar = document.getElementById('ludion-air-bar');
    const ludionDensityVal = document.getElementById('ludion-density-val');
    const ludionDensityBar = document.getElementById('ludion-density-bar');

    function updateLudionSim(pressurePercent) {
        if (!ludionGotero || !goteroAirBubble || !goteroWaterFill) return;

        // Presión en atmósferas (1 atm a 4 atm)
        const presionAtm = 1 + (pressurePercent / 100) * 3;
        ludionPressureVal.textContent = `${pressurePercent}% (${presionAtm.toFixed(2)} atm)`;
        ludionPressureBar.style.width = `${pressurePercent}%`;

        // Ley de Boyle-Mariotte (P1 * V1 = P2 * V2 -> V2 = V1 / P2)
        const airVolumePercent = Math.round(100 / presionAtm);
        ludionAirVal.textContent = `${airVolumePercent}%`;
        ludionAirBar.style.width = `${airVolumePercent}%`;

        // Ajustar visualmente el volumen de aire y el agua del gotero
        goteroAirBubble.style.height = `${airVolumePercent}%`;
        goteroWaterFill.style.height = `${100 - airVolumePercent}%`;

        // Cálculo de Densidad: a menor volumen de aire, entra agua líquida y aumenta la densidad del gotero
        // Rango de densidad: 0.95 g/cm³ (flota) a 1.15 g/cm³ (se hunde)
        const densidad = 0.95 + ((100 - airVolumePercent) / 100) * 0.25;
        ludionDensityVal.textContent = `${densidad.toFixed(2)} g/cm³`;

        // Barra de densidad
        const densityBarPercent = 20 + ((densidad - 0.95) / 0.20) * 80;
        ludionDensityBar.style.width = `${Math.min(100, densityBarPercent)}%`;

        if (densidad > 1.00) {
            ludionDensityBar.style.backgroundColor = '#ef4444'; // Se hunde
        } else {
            ludionDensityBar.style.backgroundColor = '#00f5a0'; // Flota
        }

        // Posición física del gotero en la botella
        // Densidad <= 1.00: flota en el tope (top de 18% a 24%)
        // Densidad > 1.00: se hunde progresivamente (top de 24% a 70%)
        let topPos = 18;
        if (densidad > 1.00) {
            const sinkFactor = (densidad - 1.00) / 0.15; // Rango de 0 a 1
            topPos = 24 + (sinkFactor * 46); // Baja hasta el 70% de la botella
        } else {
            const floatFactor = (densidad - 0.95) / 0.05; // Rango de 0 a 1
            topPos = 18 + (floatFactor * 6);
        }
        ludionGotero.style.top = `${topPos}%`;
    }

    if (ludionPressureSlider) {
        ludionPressureSlider.addEventListener('input', (e) => {
            initAudio();
            const pressure = parseInt(e.target.value);
            updateLudionSim(pressure);
            // Sonido interactivo simulando compresión de aire
            if (pressure % 5 === 0) {
                playTone(120 + (pressure * 2.2), 'triangle', 0.03);
            }
        });
    }


    // --- 3. CONECTIVIDAD DIDÁCTICA CRUZADA (TEXTO A SIMULADORES) ---
    const inlineBtns = document.querySelectorAll('.inline-demo-btn');

    inlineBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Evitar colapsar/desplegar acordeones de tarjetas si están contenidos
            initAudio();
            playTone(420, 'sine', 0.08);

            const targetDemo = btn.getAttribute('data-demo');
            const targetVal = parseInt(btn.getAttribute('data-val'));

            if (targetDemo === 'poleas') {
                const simElement = document.getElementById('poleas-simulator');
                if (simElement) {
                    simElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

                    // Simular click en la configuración correcta de poleas
                    if (targetVal >= 1 && targetVal <= 4) {
                        const setupBtn = document.querySelector(`.setup-btn[data-setup="${targetVal}"]`);
                        if (setupBtn) {
                            setupBtn.click();
                        }
                    }

                    // Efecto destello visual de activación
                    simElement.style.borderColor = '#00f2fe';
                    setTimeout(() => {
                        simElement.style.borderColor = '';
                    }, 1500);
                }
            } else if (targetDemo === 'ludion') {
                const simElement = document.getElementById('ludion-simulator');
                if (simElement) {
                    simElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

                    // Ajustar presión en el slider y correr simulación
                    if (ludionPressureSlider) {
                        ludionPressureSlider.value = targetVal;
                        updateLudionSim(targetVal);
                    }

                    // Efecto destello visual de activación
                    simElement.style.borderColor = '#00f2fe';
                    setTimeout(() => {
                        simElement.style.borderColor = '';
                    }, 1500);
                }
            }
        });
    });

    // --- INICIALIZACIONES DE SIMULADORES ---
    updatePulleySim();
    updateLudionSim(0);
};

if (document.readyState !== 'loading') {
    initBlog();
} else {
    document.addEventListener('DOMContentLoaded', initBlog);
}

