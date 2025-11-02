// Menu mobile toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const nav = document.querySelector('nav ul');
    const body = document.body;
    
    // Criar overlay
    const overlay = document.createElement('div');
    overlay.className = 'mobile-overlay';
    document.body.appendChild(overlay);
    
    function toggleMenu() {
        const isActive = nav.classList.contains('active');
        
        if (isActive) {
            // Fechar menu
            nav.classList.remove('active');
            overlay.classList.remove('active');
            mobileMenu.classList.remove('active');
            body.style.overflow = 'auto';
        } else {
            // Abrir menu
            nav.classList.add('show', 'active');
            overlay.classList.add('active');
            mobileMenu.classList.add('active');
            body.style.overflow = 'hidden';
        }
    }
    
    // Event listeners
    mobileMenu.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);
    
    // Fechar menu ao clicar em um link
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            overlay.classList.remove('active');
            mobileMenu.classList.remove('active');
            body.style.overflow = 'auto';
        });
    });
    
    // Smooth scroll para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Fechar menu ao redimensionar a tela para desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            nav.classList.remove('show', 'active');
            overlay.classList.remove('active');
            mobileMenu.classList.remove('active');
            body.style.overflow = 'auto';
        }
    });
});

// Carrossel infinito suave
function initSmoothCarousel() {
    const carouselTrack = document.querySelector('.carousel-track');
    if (!carouselTrack) return;
    
    let animationId;
    let position = 0;
    const speed = 1; // pixels por frame (ajuste conforme necessidade)
    
    function animate() {
        position -= speed;
        
        // Quando chegar no final do primeiro conjunto, reseta suavemente
        const slideWidth = 300 + 30; // largura + margem
        const totalWidth = slideWidth * 7; // 7 imagens
        
        if (Math.abs(position) >= totalWidth) {
            position = 0;
        }
        
        carouselTrack.style.transform = `translateX(${position}px)`;
        animationId = requestAnimationFrame(animate);
    }
    
    // Inicia a animação
    animate();
    
    // Limpa a animação quando a página for fechada
    window.addEventListener('beforeunload', () => {
        cancelAnimationFrame(animationId);
    });
}

// Inicializa quando a página carrega
document.addEventListener('DOMContentLoaded', initSmoothCarousel);