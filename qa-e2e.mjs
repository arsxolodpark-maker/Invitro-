import { chromium } from 'playwright';
const baseURL=process.env.BASE_URL||'http://127.0.0.1:8080/';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1100}});
const errors=[];page.on('pageerror',e=>errors.push(`pageerror: ${e.message}`));page.on('console',m=>{if(m.type()==='error')errors.push(`console: ${m.text()}`)});
async function click(name){const el=page.getByRole('button',{name,exact:true}).first();await el.waitFor({state:'visible',timeout:10000});await el.click()}
async function expectText(text){await page.getByText(text,{exact:false}).first().waitFor({state:'visible',timeout:10000})}
async function reset(){await page.goto(baseURL,{waitUntil:'networkidle'});const r=page.getByRole('button',{name:'Сбросить демо'});if(await r.count())await r.click()}
async function addByText(text){const card=page.locator('article.product').filter({hasText:text}).first();await card.getByRole('button',{name:/В корзину|Добавить ещё/}).click()}
async function toPending(){
 await click('Малые закупки');
 await addByText('Биохимия крови: базовый профиль');
 await click('Перейти в корзину');
 await click('Продолжить: регистрация');
 await click('Подставить демо ИНН');await click('Подтянуть реквизиты');await click('Загрузить демо PDF');await click('Отправить заявку в ДКП');
 await expectText('Заявка передана в единый фронт ДКП');
 await click('Открыть единый фронт ДКП');await expectText('Карточка');
}
async function toQuoteV1(){await toPending();await click('Подтвердить организацию');await click('Сформировать и отправить демо КП');await click('Открыть КП как клиент');await expectText('КП v1')}
async function happy(){await reset();await toQuoteV1();await click('Принять КП');await click('Подтвердить договор');await click('Отметить демо-оплату');await page.getByRole('button',{name:'Сотрудники',exact:true}).first().click();await click('Загрузить демо список');await page.getByRole('button',{name:'Исполнение',exact:true}).first().click();await click('Передать в исполнение');await click('Обновить статус');await click('Обновить статус');await click('Закрыть заказ');await expectText('Заказ завершён');await page.screenshot({path:'qa-success-desktop-final.png',fullPage:true});console.log('PASS happy path')}
async function returnedDocs(){await reset();await toPending();await click('Вернуть на доработку');await click('Исправить документы');await expectText('вернул документы');await click('Загрузить исправленные PDF');await click('Отправить заявку в ДКП');await click('Открыть единый фронт ДКП');await click('Подтвердить организацию');await expectText('Сформируйте коммерческое предложение');console.log('PASS returned documents')}
async function quoteV2(){await reset();await toQuoteV1();await click('Запросить изменение');await click('Открыть единый фронт ДКП');await click('Создать КП v2');await click('Открыть КП как клиент');await expectText('КП v2');await click('Принять КП');console.log('PASS quote v1 -> v2')}
async function cartBeforeRegistration(){await reset();await click('Малые закупки');await addByText('Биохимия крови: базовый профиль');await addByText('Тиреотропный гормон');await click('Перейти в корзину');await expectText('Регистрация начинается только после сформированной корзины');await page.locator('select').last().selectOption('regulated');await expectText('регулируемой закупки');console.log('PASS cart before registration + regulated')}
async function catalogModes(){await reset();await click('Малые закупки');await click('По биоматериалу');await click('Моча');await expectText('Анализ мочи общий');await click('Программы');await expectText('Пакет «Долголетие»');console.log('PASS catalog modes')}
async function desktopVisual(){await reset();await expectText('Решения INVITRO для бизнеса');await page.screenshot({path:'qa-success-desktop-home.png',fullPage:true});console.log('PASS desktop visual smoke')}
async function mobileSmoke(){
 const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true});
 const mobileErrors=[];mobile.on('pageerror',e=>mobileErrors.push(`pageerror: ${e.message}`));mobile.on('console',m=>{if(m.type()==='error')mobileErrors.push(`console: ${m.text()}`)});
 await mobile.goto(baseURL,{waitUntil:'networkidle'});
 const resetBtn=mobile.getByRole('button',{name:'Сбросить демо'});if(await resetBtn.count())await resetBtn.click();
 await mobile.getByText('Решения INVITRO для бизнеса',{exact:false}).first().waitFor({state:'visible',timeout:10000});
 await mobile.getByRole('button',{name:'Малые закупки',exact:true}).first().click();
 await mobile.getByText('Каталог исследований и программ',{exact:false}).first().waitFor({state:'visible',timeout:10000});
 await mobile.getByRole('button',{name:'По биоматериалу',exact:true}).click();
 await mobile.getByRole('button',{name:'Моча',exact:true}).click();
 await mobile.getByText('Анализ мочи общий',{exact:false}).first().waitFor({state:'visible',timeout:10000});
 await mobile.screenshot({path:'qa-success-mobile-catalog.png',fullPage:true});
 if(mobileErrors.length)throw new Error(mobileErrors.join('\n'));
 await mobile.close();console.log('PASS mobile smoke');
}
let failed=false;
for(const [name,fn] of [['desktop-visual',desktopVisual],['happy',happy],['returned-docs',returnedDocs],['quote-v2',quoteV2],['cart-before-registration',cartBeforeRegistration],['catalog-modes',catalogModes],['mobile-smoke',mobileSmoke]]){try{await fn()}catch(e){failed=true;console.error(`FAIL ${name}:`,e.message);await page.screenshot({path:`qa-fail-${name}.png`,fullPage:true})}}
if(errors.length){failed=true;console.error('Browser errors:',errors.join('\n'))}
await browser.close();if(failed)process.exit(1);console.log('ALL E2E TESTS PASSED');