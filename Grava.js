const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const actions = []; // Array para armazenar ações

  const browser = await chromium.launch({ headless: false }); // Modo com interface
  const context = await browser.newContext();
  const page = await context.newPage();

  // Adiciona funções para gravar cliques, scrolls e inputs
  await page.exposeFunction('recordClick', (selector) => {
    actions.push({ type: 'click', selector });
    console.log(`Clique registrado no seletor: ${selector}`);
  });

  await page.exposeFunction('recordInput', (selector, value) => {
    actions.push({ type: 'input', selector, value });
    console.log(`Entrada registrada no seletor: ${selector}, valor: ${value}`);
  });

  await page.exposeFunction('recordScroll', (x, y) => {
    actions.push({ type: 'scroll', x, y });
    console.log(`Scroll registrado em: (${x}, ${y})`);
  });

  // Injeta scripts na página para capturar eventos
  await page.evaluate(() => {
    document.addEventListener('click', (e) => {
      const selector = e.target.outerHTML.split(' ')[0]; // Captura seletor simples
      window.recordClick(selector);
    });

    document.addEventListener('input', (e) => {
      const selector = e.target.outerHTML.split(' ')[0];
      window.recordInput(selector, e.target.value);
    });

    document.addEventListener('scroll', () => {
      window.recordScroll(window.scrollX, window.scrollY);
    });
  });

  // Abra a página de login para gravar
  await page.goto('https://pasino.com/page/login'); // Substitua pela URL de login

  console.log('Gravação iniciada. Complete o login e feche o navegador para salvar.');

  // Aguarda o usuário completar as interações e fechar o navegador
  await browser.close();

  // Salva as ações em um arquivo
  fs.writeFileSync('actions-login.json', JSON.stringify(actions, null, 2));
  console.log('Ações gravadas no arquivo "actions-login.json".');
})();
