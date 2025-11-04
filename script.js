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

