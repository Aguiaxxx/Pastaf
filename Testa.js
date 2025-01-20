const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  // Carrega as ações gravadas
  const actions = JSON.parse(fs.readFileSync('actions-login.json', 'utf-8'));

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Abre a página de login
  await page.goto('https://pasino.com/page/login'); // Substitua pela mesma URL gravada

  // Reproduz as ações
  for (const action of actions) {
    if (action.type === 'click') {
      console.log(`Reproduzindo clique no seletor: ${action.selector}`);
      await page.click(action.selector);
    } else if (action.type === 'input') {
      console.log(`Reproduzindo entrada no seletor: ${action.selector}, valor: ${action.value}`);
      await page.fill(action.selector, action.value);
    } else if (action.type === 'scroll') {
      console.log(`Reproduzindo scroll em: (${action.x}, ${action.y})`);
      await page.evaluate(([x, y]) => {
        window.scrollTo(x, y);
      }, [action.x, action.y]);
    }
  }

  // Fecha o navegador
  await browser.close();
})();
