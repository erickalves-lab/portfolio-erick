const root = document.documentElement;
const header = document.querySelector('.site-header');
const themeToggle = document.querySelector('.theme-toggle');
const themeLabel = document.querySelector('.theme-toggle__label');
const year = document.querySelector('#year');
const modal = document.querySelector('.project-modal');
const modalTitle = document.querySelector('#modal-title');
const modalMeta = document.querySelector('#modal-meta');
const modalSubtitle = document.querySelector('#modal-subtitle');
const modalBody = document.querySelector('#modal-body');
const modalTags = document.querySelector('#modal-tags');
const modalPanel = document.querySelector('.project-modal__panel');
const carousel = document.querySelector('.project-carousel');

year.textContent = new Date().getFullYear();

function syncThemeUI() {
  const dark = root.dataset.theme === 'dark';
  themeLabel.textContent = dark ? 'LIGHT' : 'DARK';
  themeToggle.setAttribute('aria-pressed', String(dark));
}
syncThemeUI();

themeToggle.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  localStorage.setItem('portfolio-theme', next);
  syncThemeUI();
});

function updateHeader() {
  header.classList.toggle('is-scrolled', window.scrollY > 28);
}
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const revealTargets = [
  ...document.querySelectorAll('.hero-stack, .section-kicker, .section-title, .about-copy, .about-points, .service-row, .work-head, .project-card, .experience-stack, .testimonial-card, .contact-grid, .contact-links')
];

revealTargets.forEach(el => el.dataset.reveal = '');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });

revealTargets.forEach(el => observer.observe(el));

const projectData = {
  'ilhéus': {
    meta: '01 / SEMANA DE INOVAÇÃO DE ILHÉUS',
    title: 'Semana de Inovação de Ilhéus',
    subtitle: 'Uma nova narrativa para um evento sobre transformação.',
    body: [
      'A Semana de Inovação de Ilhéus já vinha de outras edições, mas buscava uma comunicação que traduzisse com mais clareza o que o evento realmente queria provocar em quem participava.',
      'O trabalho começou antes da escrita do site: partimos do briefing e da leitura dos diferentes públicos para construir o conceito, o território de comunicação e o tom de voz da edição.',
      'A ideia central nasceu de uma percepção simples: algumas pessoas chegariam ao evento sabendo exatamente o que buscavam; outras, sem nem imaginar o que poderiam encontrar. Mas todas deveriam sair de lá diferentes de como entraram.'
    ],
    tags: ['ESTRATÉGIA CRIATIVA', 'CONCEITO', 'TOM DE VOZ', 'COPY']
  },
  'lapa-doce': {
    meta: '02 / GRUTA DA LAPA DOCE',
    title: 'Gruta da Lapa Doce',
    subtitle: 'Mais do que um destino. Uma história que precisava ser bem contada.',
    body: [
      'A Gruta da Lapa Doce já tinha tudo para ser um destino marcante: história, preservação, legado e uma relação profunda com a Chapada Diamantina.',
      'O desafio era fazer a comunicação transmitir tudo isso sem apresentar o lugar apenas como mais um ponto turístico.',
      'Em parceria com o Estúdio 071, o trabalho passou pela construção de conceito, tom de voz, estratégia de comunicação e copy do site, criando uma base que também pudesse orientar os demais conteúdos da marca.'
    ],
    tags: ['ESTRATÉGIA CRIATIVA', 'CONCEITO', 'TOM DE VOZ', 'COPY']
  },
  'veritek': {
    meta: '03 / VERITEK',
    title: 'Veritek',
    subtitle: 'Construindo uma marca antes de colocá-la no mercado.',
    body: [
      'A Veritek nasceu como uma solução voltada a operações portuárias, com a proposta de tornar processos mais eficientes e reduzir falhas em uma área de alta complexidade operacional.',
      'Entrei no projeto ainda antes do lançamento e da construção do MVP, quando praticamente toda a comunicação da marca ainda precisava ser definida.',
      'O trabalho envolveu pesquisa de mercado, posicionamento, conceito da marca, tom de voz, playbook e a estrutura inicial de marketing — criando uma base para produto, comercial e comunicação falarem a mesma língua.'
    ],
    tags: ['PESQUISA', 'POSICIONAMENTO', 'CONCEITO', 'PLAYBOOK', 'ESTRATÉGIA DE MARKETING']
  },
  'raizes': {
    meta: '04 / RAÍZES EM FLOR',
    title: 'Raízes em Flor',
    subtitle: 'Um documentário para transformar memória em narrativa.',
    body: [
      'Projeto documental desenvolvido para contar a história de Várzea Paulista a partir de diferentes vozes, memórias e acontecimentos da cidade.',
      'O trabalho passou pela construção do roteiro, definição da estrutura narrativa e elaboração das perguntas que orientaram as entrevistas.',
      'Depois da captação, também houve curadoria do material, organização dos depoimentos e construção da linha narrativa que guiou o documentário até a versão final, hoje integrante do acervo da cidade.'
    ],
    tags: ['ROTEIRO', 'PESQUISA', 'ENTREVISTAS', 'CURADORIA', 'ESTRUTURA NARRATIVA']
  }
};

let lastFocusedProject = null;

function openProject(key, trigger) {
  const data = projectData[key];
  if (!data) return;
  lastFocusedProject = trigger;
  modalMeta.textContent = data.meta;
  modalTitle.textContent = data.title;
  modalSubtitle.textContent = data.subtitle;
  modalBody.innerHTML = data.body.map(p => `<p>${p}</p>`).join('');
  modalTags.innerHTML = data.tags.map(tag => `<li>${tag}</li>`).join('');
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => {
    modal.querySelector('.project-modal__close').focus();
  });
}

function closeProject() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lastFocusedProject) lastFocusedProject.focus();
}

document.querySelectorAll('.project-card').forEach(card => {
  const open = () => openProject(card.dataset.project, card);
  card.addEventListener('click', open);
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      open();
    }
  });
});

document.querySelectorAll('[data-close-modal]').forEach(el => {
  el.addEventListener('click', closeProject);
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modal.classList.contains('is-open')) closeProject();
});

document.querySelector('.project-next').addEventListener('click', () => {
  carousel.scrollBy({ left: carousel.clientWidth * 0.8, behavior: 'smooth' });
});

document.querySelector('.project-prev').addEventListener('click', () => {
  carousel.scrollBy({ left: -carousel.clientWidth * 0.8, behavior: 'smooth' });
});

modal.addEventListener('keydown', e => {
  if (e.key !== 'Tab' || !modal.classList.contains('is-open')) return;
  const focusables = [...modalPanel.querySelectorAll('button, a, [tabindex]:not([tabindex="-1"])')].filter(el => !el.hasAttribute('disabled'));
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
});
