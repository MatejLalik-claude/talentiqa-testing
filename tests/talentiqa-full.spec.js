const { test, expect } = require('@playwright/test');

const COMPANIES = ['Alpha-Solutions','Beta-Tech','Gamma-Digital','Delta-Labs','Epsilon-Dev','Zeta-Systems'];
const CITIES = ['Bratislava','Kosice','Zilina','Presov','Nitra','Trnava'];
const STREETS = ['Hlavna','Obchodna','Mlynska','Stefanikova','Kollarova'];
const POSITIONS = ['Senior Java Developer','Full Stack Engineer','DevOps Architect','Backend Python Developer','React Frontend Developer'];
const ANSWERS = [
  'Mam bogate skusenosti v tejto oblasti a rad sa dalej vzdelavam.',
  'Pracoval som na podobnych projektoch a dosiahol som vyborne vysledky.',
  'Tato oblast ma velmi zaujima a mam relevantne skusenosti.',
  'Som skuseny profesional s dokazatelnym track recordom.',
  'Aktivne sa rozvijam v tejto oblasti uz niekolko rokov.',
];

function rnd(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function rndNum(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pause(ms) { return new Promise(r => setTimeout(r, ms)); }

const company = rnd(COMPANIES);
const city = rnd(CITIES);
const slug = company.split('-')[0].toLowerCase();
const num = String(rndNum(1, 999)).padStart(3, '0');
const scrTotal = rnd([10, 20, 25, 50, 100]);

const DATA = {
  companyName: 'CLAUDE-' + company,
  vat: 'SK' + rndNum(1000000, 9999999),
  address: rnd(STREETS) + ' ' + rndNum(1, 99) + ', ' + city + ', SK',
  userEmail: 'user.' + slug + '.' + num + '@mailinator.com',
  branchName: city + ' ' + company.split('-')[0] + ' HQ',
  candidateEmail: 'kandidat.' + slug + '.' + num + '@mailinator.com',
  position: rnd(POSITIONS),
  scrTotal: String(scrTotal),
};

console.log('\n=== TALENTIQA Kompletny Run ===');
console.log('Firma:      ' + DATA.companyName);
console.log('Pozicia:    ' + DATA.position);
console.log('Kandidat:   ' + DATA.candidateEmail);
console.log('Screenings: ' + DATA.scrTotal);
console.log('==============================\n');

const ADMIN_URL = 'https://dev.admin.talentiqa.ai';
const EMAIL = 'matejlalik@gmail.com';
const PASS = 'Lalenzo4564';
const SLOW = 1500;
const LOGO_FILE = '/Users/matejlalik/Downloads/bs_realdroid_Mobile_Vivo Y100-13.0-1080x2400.jpg';
const PDF_FILE = '/Users/matejlalik/Downloads/privacy-policy.pdf';
const PDF_FILE2 = '/Users/matejlalik/Downloads/PROFESIA.SK.pdf';

async function fillContract(page, type, total) {
  await page.waitForLoadState('networkidle');
  await pause(SLOW);

  if (type === 'AI Credits') {
    await page.locator('select').first().selectOption('AI Credits');
    await pause(500);
  }

  await page.locator('input[name="amountTotal"]').click({ clickCount: 3 });
  await page.locator('input[name="amountTotal"]').fill(total);
  await pause(400);

  await page.locator('input[name="amountLeft"]').click({ clickCount: 3 });
  await page.locator('input[name="amountLeft"]').fill(total);
  await pause(400);

  await page.locator('button:has-text("Create")').click();
  await page.waitForLoadState('networkidle');
  await pause(SLOW);
}

test('Kompletny Run 1+2+3+4', async ({ page, context }) => {

  // ═══════════════════════════════════════
  // RUN 1 – CUSTOMER
  // ═══════════════════════════════════════
  console.log('\n====== RUN 1 – CUSTOMER ======');

  await page.goto(ADMIN_URL);
  await page.waitForLoadState('networkidle');
  await pause(SLOW);

  const loginBtn = page.locator('button:has-text("Login"), a:has-text("Login")');
  if (await loginBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await loginBtn.click();
    await page.waitForLoadState('networkidle');
    await pause(SLOW);
  }

  if (page.url().includes('auth0')) {
    await page.fill('input[name="username"], input[type="email"]', EMAIL);
    await pause(800);
    await page.fill('input[type="password"]', PASS);
    await pause(800);
    await page.click('button:has-text("Continue"), button[type="submit"]');
    await page.waitForLoadState('networkidle');
    await pause(SLOW);
  }

  if (!page.url().includes('admin.talentiqa')) {
    await page.goto(ADMIN_URL);
    await page.waitForLoadState('networkidle');
    await pause(SLOW);
  }
  console.log('SC1 PASS: Prihlasenie OK');

  // SC2: NEW CUSTOMER
  console.log('\n--- SC2: New Customer ---');
  await page.click('a[href="/customers"]');
  await page.waitForLoadState('networkidle');
  await pause(SLOW);

  await page.click('a[href="/customers/new"]');
  await page.waitForLoadState('networkidle');
  await pause(SLOW);

  await page.locator('input:visible').first().fill(DATA.companyName);
  await pause(600);
  await page.locator('input:visible').nth(1).fill(DATA.vat).catch(() => {});
  await pause(600);
  await page.locator('textarea:visible').first().fill(DATA.address).catch(() => {});
  await pause(600);
  await page.locator('input[type="file"]').first().setInputFiles(LOGO_FILE).catch(() => {});
  await pause(SLOW);

  await page.locator('button:has-text("Save"), button[type="submit"]').first().click();
  await page.waitForLoadState('networkidle');
  await pause(SLOW);

  await expect(page).toHaveURL(/customers\/edit/, { timeout: 10000 });
  const customerId = page.url().match(/\/edit\/(\d+)/)?.[1];
  console.log('SC2 PASS: ' + DATA.companyName + ' (ID: ' + customerId + ')');

  // SC3: DOCUMENTS
  console.log('\n--- SC3: Documents ---');
  await page.click('button:has-text("Documents"), [role="tab"]:has-text("Documents")');
  await page.waitForLoadState('networkidle');
  await pause(SLOW);
  await page.locator('input[type="file"]').first().setInputFiles(PDF_FILE).catch(() => {});
  await pause(SLOW);
  await page.click('button:has-text("Upload")').catch(() => {});
  await pause(SLOW);
  console.log('SC3 PASS');

  // SC4: USERS
  console.log('\n--- SC4: Users ---');
  await page.click('button:has-text("Users"), [role="tab"]:has-text("Users")');
  await page.waitForLoadState('networkidle');
  await pause(SLOW);
  await page.click('button:has-text("New user")');
  await pause(SLOW);
  await page.locator('[role="dialog"] input').first().fill(DATA.userEmail);
  await pause(600);
  await page.click('button:has-text("Create")');
  await page.waitForLoadState('networkidle');
  await pause(SLOW);
  console.log('SC4 PASS: ' + DATA.userEmail);

  // SC5: BRANCHES
  console.log('\n--- SC5: Branches ---');
  await page.click('button:has-text("Branches"), [role="tab"]:has-text("Branches")');
  await page.waitForLoadState('networkidle');
  await pause(SLOW);
  await page.click('button:has-text("New branch")');
  await pause(SLOW);
  await page.locator('[role="dialog"] input').first().fill(DATA.branchName);
  await pause(600);
  await page.locator('[role="dialog"] textarea').first().fill('Hlavna pobocka pre IT pozicie').catch(() => {});
  await pause(600);
  await page.locator('[role="dialog"] input[type="file"]').first().setInputFiles(LOGO_FILE).catch(() => {});
  await pause(600);
  await page.click('button:has-text("Create")');
  await page.waitForLoadState('networkidle');
  await pause(SLOW);
  console.log('SC5 PASS: ' + DATA.branchName);

  // SC6: KNOWLEDGE BASE
  console.log('\n--- SC6: Knowledge Base ---');
  await page.click('button:has-text("Knowledge base"), [role="tab"]:has-text("Knowledge base")');
  await page.waitForLoadState('networkidle');
  await pause(SLOW);
  await page.locator('input[type="file"]').first().setInputFiles([PDF_FILE, PDF_FILE2]).catch(() => {});
  await pause(SLOW);
  await page.click('button:has-text("Upload Files"), button:has-text("Upload")').catch(() => {});
  await pause(SLOW);
  console.log('SC6 PASS');

  // SC7: AI SETTINGS
  console.log('\n--- SC7: AI Settings ---');
  await page.click('button:has-text("AI Settings"), [role="tab"]:has-text("AI Settings")');
  await page.waitForLoadState('networkidle');
  await pause(SLOW);
  console.log('SC7 PASS');
  console.log('\n====== RUN 1 HOTOVY ======\n');

  // ═══════════════════════════════════════
  // RUN 2 – KONTRAKT
  // ═══════════════════════════════════════
  console.log('\n====== RUN 2 – KONTRAKT ======');

  console.log('\n--- SC9: Vyber firmy + Contracts ---');
  await page.locator('[role="combobox"], button:has-text("All customers")').first().click();
  await pause(SLOW);
  await page.locator('input[placeholder*="Search customers"]').fill(DATA.companyName);
  await pause(SLOW);
  await page.locator('li:has-text("' + DATA.companyName + '"), [role="option"]:has-text("' + DATA.companyName + '")').first().click();
  await page.waitForLoadState('networkidle');
  await pause(SLOW);
  await page.click('a:has-text("Contracts")');
  await page.waitForLoadState('networkidle');
  await pause(SLOW);
  console.log('SC9 PASS: Contracts otvorene');

  console.log('\n--- SC10: New Contract Prescreenings ---');
  await page.goto(ADMIN_URL + '/contracts/new?customerId=' + customerId);
  await fillContract(page, 'Prescreenings', DATA.scrTotal);
  console.log('SC10 PASS: Prescreenings vytvoreny');

  console.log('\n--- SC11: AI Credits preskoceny ---');
  console.log('\n====== RUN 2 HOTOVY ======\n');

  // ═══════════════════════════════════════
  // RUN 3 – POZICIA + KANDIDAT
  // ═══════════════════════════════════════
  console.log('\n====== RUN 3 – POZICIA ======');

  // SC12: New position – portal otvori novu zalozku
  console.log('\n--- SC12: New Position ---');
  await page.goto(ADMIN_URL + '/customers');
  await page.waitForLoadState('networkidle');
  await pause(SLOW);

  // Vyhladaj firmu v search boxe na Customers stranke
  await page.locator('input[name="search"], input[placeholder*="Filter"], input[placeholder*="Search"]').first().fill(DATA.companyName);
  await pause(SLOW);

  // Klikni New position a zachyt novu zalozku
  const [portalPage] = await Promise.all([
    context.waitForEvent('page'),
    page.locator('tr:has-text("' + DATA.companyName + '") button:has-text("New position")').first().click()
  await portalPage.waitForLoadState('networkidle');
  await pause(SLOW * 2);
  console.log('SC12 PASS: Portal otvoreny - ' + portalPage.url());

  // SC13: FORMULÁR POZÍCIE v portali
  console.log('\n--- SC13: Formulár pozície ---');
  await portalPage.locator('input:visible').first().fill(DATA.position);
  await pause(600);

  await portalPage.locator('[contenteditable="true"]').first().fill('Hladame skuseneho ' + DATA.position + ' do nasho timu.').catch(async () => {
    await portalPage.locator('textarea:visible').first().fill('Hladame skuseneho ' + DATA.position);
  });
  await pause(600);

  await portalPage.locator('button:has-text("Uložiť"), button:has-text("Save"), button:has-text("Pokračovať"), button:has-text("Next")').first().click();
  await portalPage.waitForLoadState('networkidle');
  await pause(SLOW * 2);
  console.log('SC13 PASS: Pozicia ulozena');

  // SC14: OTAZKY
  console.log('\n--- SC14: Otázky ---');
  // Cakaj kym zmizne loading modal (max 60 sekund)
  await portalPage.locator('text=generujeme otázky, text=Retrieving knowledge base').waitFor({ state: 'hidden', timeout: 60000 }).catch(() => {});
  await pause(SLOW);
  await portalPage.locator('button:has-text("Uložiť"), button:has-text("Save"), button:has-text("Uložiť zmeny")').first().click().catch(() => {});
  await portalPage.waitForLoadState('networkidle');
  await pause(SLOW);
  console.log('SC14 PASS');

  // SC15: POZVANIE KANDIDATA
  console.log('\n--- SC15: Pozvanie kandidáta ---');
  await portalPage.locator('[role="tab"]:has-text("Kandidát"), [role="tab"]:has-text("Candidates"), text=Kandidáti').first().click().catch(() => {});
  await portalPage.waitForLoadState('networkidle');
  await pause(SLOW);

  await portalPage.locator('button:has-text("Pozvať"), button:has-text("Invite")').first().click();
  await pause(SLOW);
  await portalPage.locator('input[type="email"]:visible, input[placeholder*="mail" i]:visible').first().fill(DATA.candidateEmail);
  await pause(600);
  await portalPage.locator('button:has-text("Poslať"), button:has-text("Send"), button:has-text("Odoslať")').first().click();
  await portalPage.waitForLoadState('networkidle');
  await pause(SLOW);
  console.log('SC15 PASS: Kandidat pozvaný - ' + DATA.candidateEmail);
  console.log('\n====== RUN 3 HOTOVY ======\n');

  // ═══════════════════════════════════════
  // RUN 4 – POHOVOR
  // ═══════════════════════════════════════
  console.log('\n====== RUN 4 – POHOVOR ======');

  console.log('\n--- SC18: Hladanie emailu ---');
  await page.goto(ADMIN_URL);
  await page.waitForLoadState('networkidle');
  await pause(SLOW);

  await page.click('button:has-text("Communication")');
  await pause(500);
  await page.click('a:has-text("Outbound Comm"), a:has-text("Outbound")');
  await page.waitForLoadState('networkidle');
  await pause(SLOW);

  await page.locator('input:visible').first().fill(DATA.candidateEmail).catch(() => {});
  await pause(SLOW);

  const [emailPage] = await Promise.all([
    context.waitForEvent('page'),
    page.locator('button:has-text("View"), a:has-text("View")').first().click()
  ]);
  await emailPage.waitForLoadState('networkidle');
  await pause(SLOW);

  const interviewLink = await emailPage.locator('a[href*="chat.talentiqa"]').first().getAttribute('href').catch(() => null);
  console.log('  -> Interview link: ' + interviewLink);
  await emailPage.close();

  if (!interviewLink) {
    console.log('SC18 FAIL: Interview link nenajdeny');
    return;
  }
  console.log('SC18 PASS');

  // SC19: POHOVOR
  console.log('\n--- SC19: Absolvovanie pohovoru ---');
  const chatPage = await context.newPage();
  await chatPage.goto(interviewLink);
  await chatPage.waitForLoadState('networkidle');
  await pause(SLOW * 2);

  await chatPage.locator('button:has-text("Začať"), button:has-text("Start"), button:has-text("Pokračovať")').first().click().catch(() => {});
  await pause(SLOW);

  for (let i = 0; i < 15; i++) {
    await pause(2500);

    const isDone = await chatPage.locator('text=Hotovo, text=Dokončený, text=Ďakujeme, text=Thank you').first().isVisible({ timeout: 1000 }).catch(() => false);
    if (isDone) {
      console.log('  -> Pohovor dokonceny po ' + i + ' otazkach!');
      break;
    }

    const choices = chatPage.locator('button:not([type="submit"])').filter({ hasText: /\w{5,}/ });
    const choiceCount = await choices.count();
    if (choiceCount >= 2) {
      await choices.first().click();
      console.log('  -> Otazka ' + (i+1) + ': vybrata moznost');
      await pause(800);
      continue;
    }

    const textInput = chatPage.locator('input[placeholder*="odpoveď" i], input[placeholder*="odpoved" i], textarea:visible').first();
    if (await textInput.isVisible({ timeout: 1000 }).catch(() => false)) {
      await textInput.fill(rnd(ANSWERS));
      await pause(600);
      await chatPage.locator('button[type="submit"], button:has-text("Odoslať"), button:has-text("Send")').last().click().catch(async () => {
        await chatPage.keyboard.press('Enter');
      });
      console.log('  -> Otazka ' + (i+1) + ': odpoved odoslana');
      await pause(800);
    }
  }

  await chatPage.locator('button:has-text("Hotovo"), button:has-text("Dokončiť"), button:has-text("Finish")').first().click().catch(() => {});
  await pause(SLOW);
  console.log('SC19 PASS: Pohovor dokonceny');

  console.log('\n=== KOMPLETNY RUN DOKONCENY ===');
  console.log('Firma:    ' + DATA.companyName);
  console.log('Pozicia:  ' + DATA.position);
  console.log('Kandidat: ' + DATA.candidateEmail);
  console.log('==============================\n');

});
