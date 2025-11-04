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

  // ---------- CARROSSEL (aguarda carregamento completo) ----------
window.addEventListener('load', () => {
  const slide = document.querySelector('.logos-slide');
  if (!slide) return;

  // evita rodar múltiplas vezes
  if (slide.dataset.carouselInit === 'true') return;
  slide.dataset.carouselInit = 'true';

  // guarda os filhos originais
  const originals = Array.from(slide.children);
  if (originals.length === 0) return;

  // LIMPA quaisquer clones existentes
  const existingClones = slide.querySelectorAll('[data-clone="true"]');
  existingClones.forEach(clone => clone.remove());

  // Duplica o conteúdo APENAS UMA VEZ
  originals.forEach(node => {
    const clone = node.cloneNode(true);
    clone.setAttribute('data-clone', 'true');
    clone.setAttribute('aria-hidden', 'true');
    slide.appendChild(clone);
  });

  // Aguarda todas as imagens carregarem
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
    // Configuração final
    slide.style.willChange = 'transform';
    
    // Garante que a animação está rodando
    slide.style.animation = 'scroll 20s linear infinite';
    
    console.log('Carrossel iniciado com', originals.length, 'itens originais e', originals.length, 'clones');
  });

  // Previne duplicação múltipla no resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Apenas reinicia a animação, não duplica novamente
      slide.style.animation = 'none';
      setTimeout(() => {
        slide.style.animation = 'scroll 20s linear infinite';
      }, 10);
    }, 250);
  });
});