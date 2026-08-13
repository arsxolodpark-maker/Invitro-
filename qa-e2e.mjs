import { chromium } from 'playwright';
const baseURL=process.env.BASE_URL||'http://127.0.0.1:8080/';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1100}});
const errors=[]; page.on('pageerror',e=>errors.push(`pageerror: ${e.message}`)); page.on('console',m=>{if(m.type()==='error')errors.push(`console: ${m.text()}`)});
async function click(name){const el=page.getByRole('button',{name,exact:true}).first();await el.waitFor({state:'visible',timeout:10000});await el.click()}
async function expectText(text){await page.getByText(text,{exact:false}).first().waitFor({state:'visible',timeout:10000})}
async function reset(){await page.goto(baseURL,{waitUntil:'networkidle'});const r=page.getByRole('button',{name:'Сбросить демо'});if(await r.count())await r.click()}
async function toPending(){
 await click('Выбрать формат сотрудничества'); await click('Перейти к малым закупкам');
 const card=page.locator('article.product').filter({hasText:'Пакет «Долголетие»'}).first(); await card.getByRole('button',{name:'Добавить в спецификацию'}).click();
 await click('Далее: спецификация'); await click('Далее: параметры'); await click('Далее: организация');
 await click('Подставить демо ИНН'); await click('Подтянуть реквизиты'); await click('Загрузить демо комплект'); await click('Отправить на проверку'); await click('Далее: проверка ДКП'); await expectText('Карточка заказа');
}
async function toQuoteV1(){await toPending();await click('Подтвердить организацию');await click('Сформировать и отправить демо КП');await click('Далее: клиент смотрит КП');await expectText('КП v1')}
async function happy(){await reset();await toQuoteV1();await click('Принять КП');await click('Подтвердить договор');await click('Отметить демо-оплату');await click('Далее: сотрудники');await click('Загрузить демо список');await click('Далее: исполнение');await click('Передать в исполнение');await click('Обновить статус');await click('Обновить статус');await click('Закрыть заказ');await expectText('Сценарий завершён');console.log('PASS happy path')}
async function returnedDocs(){await reset();await toPending();await click('Вернуть на доработку');await click('Исправить документы');await expectText('Документы возвращены');await click('Загрузить исправленный комплект');await click('Отправить на проверку');await click('Далее: проверка ДКП');await click('Подтвердить организацию');await expectText('Сформируйте коммерческое предложение');console.log('PASS returned documents')}
async function quoteV2(){await reset();await toQuoteV1();await click('Запросить изменение');await click('Далее: новая версия КП');await click('Создать КП v2');await click('Далее: клиент смотрит КП');await expectText('КП v2');await click('Принять КП');console.log('PASS quote v1 -> v2')}
async function multiCartRegulated(){await reset();await click('Выбрать формат сотрудничества');await click('Перейти к малым закупкам');await page.locator('article.product').filter({hasText:'Пакет «Долголетие»'}).getByRole('button',{name:'Добавить в спецификацию'}).click();await page.locator('article.product').filter({hasText:'Глюкоза'}).getByRole('button',{name:'Добавить в спецификацию'}).click();await click('Далее: спецификация');await click('Далее: параметры');await page.locator('select').nth(2).selectOption('regulated');await expectText('Гипотеза для валидации');console.log('PASS multi-item + regulated branch')}
let failed=false;
for(const [name,fn] of [['happy',happy],['returned-docs',returnedDocs],['quote-v2',quoteV2],['multi-cart-regulated',multiCartRegulated]]){try{await fn()}catch(e){failed=true;console.error(`FAIL ${name}:`,e.message);await page.screenshot({path:`qa-fail-${name}.png`,fullPage:true})}}
if(errors.length){failed=true;console.error('Browser errors:',errors.join('\n'))}
await browser.close();if(failed)process.exit(1);console.log('ALL E2E TESTS PASSED');
