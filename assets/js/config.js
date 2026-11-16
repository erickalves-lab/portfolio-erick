/* ==========================================================
   CONFIGURAÇÃO DO SITE — é aqui que você edita no dia a dia.
   ========================================================== */

window.SITE_CONFIG = {

  /* Faixa de agenda no topo da home.
     estado:   "aberta" | "fechada"
     mensagem: o texto que aparece na faixa
     ate:      data para a faixa sumir sozinha (AAAA-MM-DD). Deixe "" para não expirar.
     mostrar:  false esconde a faixa */
  agenda: {
    mostrar: true,
    estado: "aberta",
    mensagem: "Agenda aberta para novos projetos.",
    ate: ""
  },

  /* Vídeos da página "Vídeos".
     Para publicar um, copie um bloco, tire "modelo: true" e preencha:
       titulo   nome do vídeo
       cliente  nome do cliente
       perfil   link do perfil do cliente (Instagram, YouTube, LinkedIn)
       papel    o que você fez (ex.: "Roteiro e estratégia")
       youtube  só o código do vídeo (o que vem depois de v= na URL) — toca na própria página
       url      link do vídeo, para quando não for YouTube (abre no site do cliente) */
  videos: [
    { modelo: true, titulo: "Título do vídeo", cliente: "Nome do cliente", papel: "Roteiro e estratégia" },
    { modelo: true, titulo: "Título do vídeo", cliente: "Nome do cliente", papel: "Roteiro e estratégia" },
    { modelo: true, titulo: "Título do vídeo", cliente: "Nome do cliente", papel: "Roteiro e estratégia" }
  ]
};
