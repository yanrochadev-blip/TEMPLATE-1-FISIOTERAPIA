// ==========================================
// 1. INICIALIZAÇÃO DO LENIS (scroll suave global)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {

    const lenis = new Lenis({
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Navegação suave com âncoras
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#' || targetId === '') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                lenis.scrollTo(target, { offset: 0, duration: 1.2 });
            }
        });
    });


    // ==========================================
    // 2. INTERAÇÃO DOS CARTÕES DE SERVIÇOS
    // ==========================================
    window.activateCard = function(clickedCard) {
        const cards = document.querySelectorAll('.service-card');
        cards.forEach(card => card.classList.remove('active'));
        clickedCard.classList.add('active');
    };


    // ==========================================
    // 3. SLIDER DA EQUIPE
    // ==========================================
    const teamData = [
        {
            name: "Dr. Rafael Souza",
            desc: "Especialista em reabilitação desportiva e biomecânica. O Rafael traz anos de experiência em fisioterapia focada em resultados, com um forte histórico na recuperação de lesões complexas e alívio da dor crónica.",
            tags: ["Fisioterapia Desportiva", "Biomecânica", "Reabilitação"],
            img: "https://images.unsplash.com/photo-1612276529731-4b21494e6d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
        },
        {
            name: "Dra. Camila Alves",
            desc: "Instrutora avançada de Pilates Clínico. A Camila dedica-se a ajudar os pacientes a reconectarem-se com o próprio corpo de forma segura, melhorando drasticamente a postura, a força central e a flexibilidade diária.",
            tags: ["Pilates Clínico", "Correção Postural", "Flexibilidade"],
            img: "https://images.unsplash.com/photo-1594824432258-2936735c3453?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
        },
        {
            name: "Dr. Thiago Mendes",
            desc: "Com foco em encontrar a raiz da dor e não apenas tratar os sintomas, o Thiago utiliza técnicas avançadas de Osteopatia para garantir que o corpo encontre o seu equilíbrio natural. Um corpo alinhado é um corpo livre.",
            tags: ["Osteopatia", "Terapia Manual", "Avaliação Global"],
            img: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
        }
    ];

    let currentTeamIndex = 0;

    window.nextTeamMember = function() {
        const contentBox = document.getElementById('carousel-text-box');
        const imgBox = document.getElementById('carousel-img-wrapper');
        
        contentBox.classList.add('fade-out');
        imgBox.classList.add('img-fade-out');

        setTimeout(() => {
            currentTeamIndex = (currentTeamIndex + 1) % teamData.length;
            const member = teamData[currentTeamIndex];

            document.getElementById('carousel-name').innerText = member.name;
            document.getElementById('carousel-desc').innerText = member.desc;
            document.getElementById('carousel-img').src = member.img;

            const tagsContainer = document.getElementById('carousel-tags');
            tagsContainer.innerHTML = '';
            member.tags.forEach(tag => {
                const span = document.createElement('span');
                span.innerText = tag;
                tagsContainer.appendChild(span);
            });

            contentBox.classList.remove('fade-out');
            imgBox.classList.remove('img-fade-out');
        }, 400);
    };


    // ==========================================
    // FUNÇÃO AUXILIAR: Animar translateX suavemente
    // ==========================================
    function animateTransform(element, from, to, duration, onUpdate) {
        const startTime = performance.now();

        function easeInOutCubic(t) {
            return t < 0.5
                ? 4 * t * t * t
                : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }

        function step(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const value = from + (to - from) * easeInOutCubic(progress);

            element.style.transform = `translateX(${value}px)`;
            if (onUpdate) onUpdate(value);

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }
        requestAnimationFrame(step);
    }


    // ==========================================
    // 4. SLIDER DE DEPOIMENTOS
    // ==========================================
    const testimonialsTrack = document.getElementById('testimonialsGrid');
    const slideLeftBtn = document.getElementById('slideLeft');
    const slideRightBtn = document.getElementById('slideRight');
    const progressFill = document.getElementById('progressFill');

    if (testimonialsTrack && slideLeftBtn && slideRightBtn && progressFill) {
        const step = 340;
        let currentOffset = 0;

        function getMaxOffset() {
            const trackWidth = testimonialsTrack.scrollWidth;
            const wrapperWidth = testimonialsTrack.parentElement.clientWidth;
            return Math.min(0, wrapperWidth - trackWidth);
        }

        function updateProgress(offset) {
            const maxOffset = getMaxOffset();
            if (maxOffset === 0) return;
            const percent = (offset / maxOffset) * 100;
            progressFill.style.width = `${percent}%`;
        }

        slideLeftBtn.addEventListener('click', () => {
            const target = Math.min(0, currentOffset + step);
            const from = currentOffset;
            currentOffset = target;

            animateTransform(testimonialsTrack, from, target, 700, updateProgress);
        });

        slideRightBtn.addEventListener('click', () => {
            const maxOffset = getMaxOffset();
            const target = Math.max(maxOffset, currentOffset - step);
            const from = currentOffset;
            currentOffset = target;

            animateTransform(testimonialsTrack, from, target, 700, updateProgress);
        });

        updateProgress(0);

        window.addEventListener('resize', () => {
            const maxOffset = getMaxOffset();
            if (currentOffset < maxOffset) {
                currentOffset = maxOffset;
                testimonialsTrack.style.transform = `translateX(${currentOffset}px)`;
            }
            updateProgress(currentOffset);
        });
    }


    // ==========================================
    // 5. SLIDER "NOSSO ESPAÇO" + PARALLAX LATERAL
    // ==========================================
    const spaceTrack = document.getElementById('spaceScrollContainer');
    const spaceLeftBtn = document.getElementById('spaceLeft');
    const spaceRightBtn = document.getElementById('spaceRight');
    const spaceProgressFill = document.getElementById('spaceProgressFill');

    if (spaceTrack && spaceLeftBtn && spaceRightBtn && spaceProgressFill) {
        const spaceStep = 630;
        let currentOffset = 0;

        // Fator de intensidade do parallax (quanto maior, mais deslocamento)
        const PARALLAX_INTENSITY = 0.12;

        function getMaxOffset() {
            const trackWidth = spaceTrack.scrollWidth;
            const wrapperWidth = spaceTrack.parentElement.clientWidth;
            return Math.min(0, wrapperWidth - trackWidth);
        }

        function updateProgress(offset) {
            const maxOffset = getMaxOffset();
            if (maxOffset === 0) return;
            const percent = (offset / maxOffset) * 100;
            spaceProgressFill.style.width = `${percent}%`;
        }

        // Parallax lateral: cada imagem se desloca horizontalmente
        // proporcional à distância do centro da tela
        function updateParallax(offset) {
            const images = spaceTrack.querySelectorAll('.parallax-img');
            const wrapperWidth = spaceTrack.parentElement.clientWidth;
            const wrapperCenter = wrapperWidth / 2;

            images.forEach(img => {
                const card = img.closest('.space-card');
                // Posição esquerda do card na tela (relativa ao wrapper)
                const cardLeft = card.offsetLeft + offset;
                const cardCenter = cardLeft + card.offsetWidth / 2;

                // Distância do centro do card ao centro do wrapper
                // Valores positivos = card à esquerda do centro
                // Valores negativos = card à direita do centro
                const distanceFromCenter = wrapperCenter - cardCenter;

                // Deslocamento da imagem: oposto ao movimento do card
                // (a imagem "empurra" para o lado contrário ao scroll)
                const parallaxX = distanceFromCenter * PARALLAX_INTENSITY;

                img.style.transform = `translateX(${parallaxX}px) scale(1.08)`;
            });
        }

        // Aplica parallax também enquanto o usuário rola a página
        // (combinando com o Lenis)
        function updateParallaxOnScroll() {
            updateParallax(currentOffset);
        }

        spaceLeftBtn.addEventListener('click', () => {
            const target = Math.min(0, currentOffset + spaceStep);
            const from = currentOffset;
            currentOffset = target;

            animateTransform(
                spaceTrack,
                from,
                target,
                800,
                (val) => {
                    updateProgress(val);
                    updateParallax(val);
                }
            );
        });

        spaceRightBtn.addEventListener('click', () => {
            const maxOffset = getMaxOffset();
            const target = Math.max(maxOffset, currentOffset - spaceStep);
            const from = currentOffset;
            currentOffset = target;

            animateTransform(
                spaceTrack,
                from,
                target,
                800,
                (val) => {
                    updateProgress(val);
                    updateParallax(val);
                }
            );
        });

        updateProgress(0);
        updateParallax(0);

        // Atualiza parallax durante o scroll vertical da página
        // (o Lenis dispara o evento; nós recalculamos o parallax)
        lenis.on('scroll', () => {
            updateParallaxOnScroll();
        });

        window.addEventListener('resize', () => {
            const maxOffset = getMaxOffset();
            if (currentOffset < maxOffset) {
                currentOffset = maxOffset;
                spaceTrack.style.transform = `translateX(${currentOffset}px)`;
            }
            updateProgress(currentOffset);
            updateParallax(currentOffset);
        });
    }
});
// ==========================================
// 6. CONTROLADOR DO ACORDEÃO DO FAQ
// ==========================================
window.toggleFaq = function(clickedItem) {
    const allFaqItems = document.querySelectorAll('.faq-item');
    
    // Verifica se o item clicado já está ativo
    const isActive = clickedItem.classList.contains('active');
    
    // Fecha todos os itens
    allFaqItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // Se não estava ativo, abre apenas o clicado
    if (!isActive) {
        clickedItem.classList.add('active');
    }
};