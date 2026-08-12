import { chromium } from 'playwright';

const baseURL = process.env.BASE_URL || 'http://127.0.0.1:8080/';
const browser = await chromium.launch({headless:true});
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
const errors = [];
page.on('pageerror', e => errors.push(`pageerror: ${e.message}`));
page.on('console', msg => { if (msg.type()==='error') errors.push(`console: ${msg.text()}`); });

async function expectText(text){
  await page.getByText(text,{exact:false}).first().waitFor({state:'visible',timeout:10000});
}
async function click(name){
  const el = page.getByRole('button',{name,exact:true}).first();
  await el.waitFor({state:'visible',timeout:10000});
  await el.click();
}
async function reset(){
  await page.goto(baseURL,{waitUntil:'networkidle'});
  const resetBtn = page.getByRole('button',{name:'Сбросить демо'});
  if(await resetBtn.count()) await resetBtn.click();
}
async function selectLongevity(){
  await click('Выбрать услуги');
  const card = page.locator('article.product').filter({hasText:'Пакет «Долголетие»'}).first();
  await card.getByRole('button',{name:'Настроить заказ'}).click();
  await expectText('Параметры заказа');
}
async function toPendingDkp(){
  await selectLongevity();
  await click('Далее: организация');
  await click('Подставить демо ИНН');
  await click('Подтянуть реквизиты');
  await click('Загрузить демо комплект');
  await click('Отправить на проверку');
  await click('Далее: проверка ДКП');
  await expectText('Карточка заказа');
}
async function toQuoteV1Client(){
  await toPendingDkp();
  await click('Подтвердить организацию');
  await click('Сформировать и отправить демо КП');
  await click('Далее: клиент смотрит КП');
  await expectText('КП v1');
}

async function happyPath(){
  await reset();
  await toQuoteV1Client();
  await click('Принять КП');
  await click('Подтвердить договор');
  await click('Отметить демо-оплату');
  await click('Далее: сотрудники');
  await click('Загрузить демо список');
  await click('Далее: исполнение');
  await click('Передать в исполнение');
  await click('Обновить статус');
  await click('Обновить статус');
  await click('Закрыть заказ');
  await expectText('Сценарий завершён');
  console.log('PASS happy path');
}

async function returnedDocs(){
  await reset();
  await toPendingDkp();
  await click('Вернуть на доработку');
  await click('Исправить документы');
  await expectText('Документы возвращены на доработку');
  await click('Загрузить исправленный комплект');
  await click('Отправить на проверку');
  await click('Далее: проверка ДКП');
  await click('Подтвердить организацию');
  await expectText('Сформируйте и отправьте коммерческое предложение');
  console.log('PASS returned documents');
}

async function quoteV2(){
  await reset();
  await toQuoteV1Client();
  await click('Запросить изменение');
  await click('Далее: новая версия КП');
  await click('Создать КП v2');
  await click('Далее: клиент смотрит КП');
  await expectText('КП v2');
  await click('Принять КП');
  await expectText('КП принято');
  console.log('PASS quote v1 -> v2');
}

let failed = false;
for (const [name,fn] of [['happy path',happyPath],['returned documents',returnedDocs],['quote v2',quoteV2]]){
  try { await fn(); }
  catch(e){ failed=true; console.error(`FAIL ${name}:`,e.message); await page.screenshot({path:`qa-fail-${name.replaceAll(' ','-')}.png`,fullPage:true}); }
}
if(errors.length){ failed=true; console.error('Browser errors:', errors.join('\n')); }
await browser.close();
if(failed) process.exit(1);
console.log('ALL E2E TESTS PASSED');
