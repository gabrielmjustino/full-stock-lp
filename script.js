// Script unificado e robusto: menu mobile + smooth scroll + carrossel fluido
(function () {
  // ---------- MENU e SMOOTH SCROLL (DOM pronto) ----------
  document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const mobileMenu = document.querySelector('.mobile-menu');
    const navUl = document.querySelector('nav ul');

    // cria overlay se não existir
    let overlay = document.querySelector('.mobile-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'mobile-overlay';
      document.body.appendChild(overlay);
    }

    function closeMenu() {
      if (!navUl) return;
      navUl.classList.remove('show', 'active');
      mobileMenu && mobileMenu.classList.remove('active');
      overlay.classList.remove('active');
      body.style.overflow = '';
    }

    function openMenu() {
      if (!navUl) return;
      navUl.classList.add('show', 'active');
      mobileMenu && mobileMenu.classList.add('active');
      overlay.classList.add('active');
      body.style.overflow = 'hidden';
    }

    function toggleMenu() {
      if (!navUl) return;
      if (navUl.classList.contains('active')) closeMenu();
      else openMenu();
    }

    if (mobileMenu) mobileMenu.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', closeMenu);

    if (navUl) {
      navUl.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => closeMenu());
      });
    }

    // smooth scroll (considera header fixo se houver)
    const header = document.querySelector('header');
    const headerHeight = header ? header.offsetHeight : 0;

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - headerHeight - 12);
        window.scrollTo({ top, behavior: 'smooth' });
        closeMenu();
      });
    });

    // fechar menu quando passar para desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) closeMenu();
    });
  });

  // ---------- CARROSSEL ROBUSTO COM RESET AUTOMÁTICO ----------
  window.addEventListener('load', () => {
    const slide = document.querySelector('.logos-slide');
    if (!slide) return;

    // Evita rodar múltiplas vezes
    if (slide.dataset.carouselInit === 'true') return;
    slide.dataset.carouselInit = 'true';

    const originals = Array.from(slide.children);
    if (originals.length === 0) return;

    // Remove clones existentes
    const existingClones = slide.querySelectorAll('[data-clone="true"]');
    existingClones.forEach(clone => clone.remove());

    // Calcula a largura total do conteúdo original
    let originalWidth = 0;
    originals.forEach(item => {
      originalWidth += item.offsetWidth + parseInt(getComputedStyle(item).marginLeft || 0) + parseInt(getComputedStyle(item).marginRight || 0);
    });

    // Função para duplicar conteúdo
    function duplicateContent() {
      originals.forEach(node => {
        const clone = node.cloneNode(true);
        clone.setAttribute('data-clone', 'true');
        clone.setAttribute('aria-hidden', 'true');
        slide.appendChild(clone);
      });
    }

    // Verifica se é iOS para aplicar correções específicas
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    // Sistema de animação com reset
    function startCarousel() {
      duplicateContent();
      
      const allImages = Array.from(slide.querySelectorAll('img'));
      const loadPromises = allImages.map(img => {
        if (img.complete && img.naturalWidth !== 0) return Promise.resolve();
        return new Promise(resolve => {
          const onFinish = () => {
            img.removeEventListener('load', onFinish);
            img.removeEventListener('error', onFinish);
            resolve();
          };
          img.addEventListener('load', onFinish);
          img.addEventListener('error', onFinish);
        });
      });

      Promise.all(loadPromises).then(() => {
        // Força hardware acceleration
        slide.style.transform = 'translate3d(0,0,0)';
        
        // Configura a animação
        const animationDuration = 20; // segundos
        slide.style.animation = `scroll ${animationDuration}s linear infinite`;
        slide.style.webkitAnimation = `scroll ${animationDuration}s linear infinite`;
        
        console.log('Carrossel iniciado - Largura original:', originalWidth);
        
        // Reset automático da animação para evitar paradas
        let resetCount = 0;
        const resetInterval = setInterval(() => {
          resetCount++;
          
          // A cada 5 ciclos (100 segundos), força um reset suave
          if (resetCount >= 5) {
            resetCount = 0;
            slide.style.animation = 'none';
            slide.style.webkitAnimation = 'none';
            
            requestAnimationFrame(() => {
              setTimeout(() => {
                slide.style.animation = `scroll ${animationDuration}s linear infinite`;
                slide.style.webkitAnimation = `scroll ${animationDuration}s linear infinite`;
                console.log('Reset suave do carrossel aplicado');
              }, 50);
            });
          }
        }, animationDuration * 1000); // Verifica a cada ciclo completo
      });
    }

    // Inicia o carrossel
    if (isIOS) {
      requestAnimationFrame(() => {
        startCarousel();
      });
    } else {
      startCarousel();
    }

    // Otimização para resize com debounce
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        // Pausa temporariamente
        slide.style.animationPlayState = 'paused';
        slide.style.webkitAnimationPlayState = 'paused';
        
        // Recálcula após resize
        setTimeout(() => {
          slide.style.animationPlayState = 'running';
          slide.style.webkitAnimationPlayState = 'running';
        }, 100);
      }, 250);
    });

    // Pausa animação quando não visível (Performance)
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          slide.style.animationPlayState = 'running';
          slide.style.webkitAnimationPlayState = 'running';
        } else {
          slide.style.animationPlayState = 'paused';
          slide.style.webkitAnimationPlayState = 'paused';
        }
      });
    }, { threshold: 0.1 });

    observer.observe(slide);

    // CSS dinâmico para a animação
    if (!document.querySelector('#carousel-styles')) {
      const style = document.createElement('style');
      style.id = 'carousel-styles';
      style.textContent = `
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% / 2));
          }
        }
        
        .logos-slide {
          animation: scroll 20s linear infinite;
          display: flex;
          align-items: center;
        }
        
        .logos-slide:hover {
          animation-play-state: paused;
        }
      `;
      document.head.appendChild(style);
    }
  });
})();