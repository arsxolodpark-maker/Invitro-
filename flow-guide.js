// Guided end-to-end journey for Marketplace v0.5.
const FLOW_STEPS=[
 ['cooperation','Формат'],['catalog','Каталог'],['cart','Спецификация'],['configure','Параметры'],['organization','Организация'],['verification','Проверка ДКП'],['quote','КП'],['contract','Договор / счёт'],['employees','Сотрудники'],['execution','Исполнение'],['closing','Закрытие']
];
function flowStage(){
 if(state.closing==='closed')return FLOW_STEPS.length;
 if(state.execution.status==='active'||state.execution.status==='done'||state.closing==='ready')return 9;
 if(state.roster==='ready'||state.payment==='paid')return 8;
 if(state.contract==='signed'||state.invoice==='issued'||state.quote.status==='accepted')return 7;
 if(state.quote.status!=='none')return 6;
 if(state.verification==='pending'||state.verification==='verified'||state.verification==='fix')return 5;
 if(state.org||state.docs||state.clientPage==='organization')return 4;
 if(state.clientPage==='configure')return 3;
 if(state.cart.length)return 2;
 if(state.clientPage==='catalog')return 1;
 return 0;
}
function flowAction(label,code,kind='primary'){return `<button class="btn btn-${kind}" type="button" onclick="${code}">${label}</button>`}
function switchToClient(page='order',tab='overview'){state.role='client';state.clientPage=page;if(tab)state.orderTab=tab;save();render()}
function switchToDkp(page='queue'){state.role='dkp';state.dkpPage=page;save();render()}
function nextFlowInfo(){
 if(state.closing==='closed')return{text:'Сценарий завершён. Заказ закрыт документально и финансово.',actions:flowAction('Начать заново','resetDemo()','outline')};
 if(!state.cart.length){
  if(state.role==='client'&&state.clientPage==='cooperation')return{text:'Выберите «Малые закупки» как первый цифровой сценарий.',actions:flowAction('Открыть малые закупки','chooseSmallProcurement()')};
  if(state.role==='client'&&state.clientPage==='catalog')return{text:'Добавьте хотя бы одну программу или исследование в спецификацию.',actions:''};
  return{text:'Начните с выбора формата сотрудничества.',actions:flowAction('Форматы сотрудничества',"switchToClient('cooperation',null)")};
 }
 if(state.clientPage==='catalog')return{text:`В спецификации ${state.cart.length} позиций. Можно добавить ещё или продолжить.`,actions:flowAction('Далее: спецификация',"switchToClient('cart',null)")};
 if(state.clientPage==='cart')return{text:'Проверьте состав спецификации и переходите к параметрам заказа.',actions:flowAction('Далее: параметры',"switchToClient('configure',null)")};
 if(state.clientPage==='configure'&&!state.org)return{text:'Уточните сотрудников, город, формат и тип закупки.',actions:flowAction('Далее: организация',"switchToClient('organization',null)")};
 if(!state.org){
  if(state.role==='client'&&state.clientPage==='organization'){
   if(!state.inn)return{text:'Начните с ИНН организации.',actions:flowAction('Подставить демо ИНН','demoInn()','outline')};
   return{text:'ИНН указан. Подтяните реквизиты.',actions:flowAction('Подтянуть реквизиты','loadOrg()')};
  }
  return{text:'Следующий шаг — оформить организацию.',actions:flowAction('К организации',"switchToClient('organization',null)")};
 }
 if(state.verification==='fix'&&!state.docs){
  if(state.role==='client'&&state.clientPage==='organization')return{text:'ДКП вернул комплект. Загрузите исправленные документы.',actions:flowAction('Загрузить исправленный комплект','uploadDocs()','secondary')};
  return{text:'ДКП вернул документы на доработку.',actions:flowAction('Исправить документы',"switchToClient('organization',null)")};
 }
 if(!state.docs){
  if(state.role==='client'&&state.clientPage==='organization')return{text:'Реквизиты готовы. Загрузите комплект документов.',actions:flowAction('Загрузить демо комплект','uploadDocs()','secondary')};
  return{text:'Нужно загрузить документы организации.',actions:flowAction('К документам',"switchToClient('organization',null)")};
 }
 if(state.verification==='none'){
  if(state.role==='client'&&state.clientPage==='organization')return{text:'Реквизиты и документы готовы. Отправьте их на проверку ДКП.',actions:flowAction('Отправить на проверку','sendVerify()')};
  return{text:'Отправьте организацию на проверку ДКП.',actions:flowAction('К проверке',"switchToClient('organization',null)")};
 }
 if(state.verification==='fix')return{text:'Документы возвращены на доработку.',actions:flowAction('Исправить документы',"switchToClient('organization',null)")};
 if(state.verification==='pending'){
  if(state.role==='client')return{text:'Заявка ждёт проверки ДКП.',actions:flowAction('Далее: проверка ДКП',"switchToDkp('case')")};
  if(state.dkpPage==='case')return{text:'Проверьте организацию и документы.',actions:flowAction('Подтвердить организацию','verify(true)','ok')+flowAction('Вернуть на доработку','verify(false)','warn')};
  return{text:'Откройте карточку заявки.',actions:flowAction('Открыть карточку',"go('case')")};
 }
 if(state.verification==='verified'&&state.quote.status==='none'){
  if(state.role==='client')return{text:'Организация проверена. Следующий шаг у ДКП — сформировать КП.',actions:flowAction('Далее: сформировать КП',"switchToDkp('case')")};
  if(state.dkpPage==='case')return{text:'Организация подтверждена. Сформируйте коммерческое предложение.',actions:flowAction('Сформировать и отправить демо КП','createQuote()')};
  return{text:'Нужно сформировать КП.',actions:flowAction('К карточке',"go('case')")};
 }
 if(state.quote.status==='change'){
  if(state.role==='client')return{text:'Запрошена корректировка КП. Следующее действие у ДКП.',actions:flowAction('Далее: новая версия КП',"switchToDkp('case')")};
  if(state.dkpPage==='case')return{text:`Создайте новую версию после замечаний к КП v${state.quote.version}.`,actions:flowAction(`Создать КП v${state.quote.version+1}`,'createQuote()')};
  return{text:'Клиент запросил изменение КП.',actions:flowAction('К карточке',"go('case')")};
 }
 if(state.quote.status==='sent'){
  if(state.role==='dkp')return{text:`КП v${state.quote.version} отправлено клиенту.`,actions:flowAction('Далее: клиент смотрит КП',"switchToClient('order','quote')")};
  if(state.clientPage==='order'&&state.orderTab==='quote')return{text:`КП v${state.quote.version} открыто.`,actions:flowAction('Принять КП','acceptQuote()','ok')+flowAction('Запросить изменение','requestChange()','outline')};
  return{text:`КП v${state.quote.version} готово.`,actions:flowAction('Открыть КП',"switchToClient('order','quote')")};
 }
 if(state.quote.status==='accepted'&&state.contract!=='signed'){
  if(state.role==='client'&&state.clientPage==='order'&&state.orderTab==='quote')return{text:'КП принято. Подтвердите договор.',actions:flowAction('Подтвердить договор','signContract()')};
  return{text:'Следующий шаг — договор и счёт.',actions:flowAction('Договор и счёт',"switchToClient('order','quote')")};
 }
 if(state.invoice==='issued'&&state.payment!=='paid'){
  if(state.role==='client'&&state.clientPage==='order'&&state.orderTab==='quote')return{text:'Счёт выставлен. В демо подтвердите оплату.',actions:flowAction('Отметить демо-оплату','pay()')};
  return{text:'Следующий шаг — оплата.',actions:flowAction('К оплате',"switchToClient('order','quote')")};
 }
 if(state.payment==='paid'&&state.roster!=='ready'){
  if(state.role==='client'&&state.clientPage==='order'&&state.orderTab==='employees')return{text:'Оплата подтверждена. Загрузите список сотрудников.',actions:flowAction('Загрузить демо список','roster()')};
  return{text:'Оплата подтверждена. Нужен список сотрудников.',actions:flowAction('Далее: сотрудники',"switchToClient('order','employees')")};
 }
 if(state.roster==='ready'&&state.execution.status==='none'){
  if(state.role==='client'&&state.clientPage==='order'&&state.orderTab==='execution')return{text:'Список принят. Передайте заказ в исполнение.',actions:flowAction('Передать в исполнение','startExec()')};
  return{text:'Заказ готов к исполнению.',actions:flowAction('Далее: исполнение',"switchToClient('order','execution')")};
 }
 if(state.execution.status==='active'){
  if(state.role==='client'&&state.clientPage==='order'&&state.orderTab==='execution')return{text:`Заказ исполняется — ${state.execution.progress}%.`,actions:flowAction('Обновить статус','advance()','secondary')};
  return{text:`Заказ исполняется — ${state.execution.progress}%.`,actions:flowAction('Открыть исполнение',"switchToClient('order','execution')")};
 }
 if(state.execution.status==='done'&&state.closing==='ready'){
  if(state.role==='client'&&state.clientPage==='order'&&state.orderTab==='execution')return{text:'Исполнение завершено. Осталось закрыть документы.',actions:flowAction('Закрыть заказ','closeOrder()','ok')};
  return{text:'Исполнение завершено. Последний шаг — закрывающие документы.',actions:flowAction('Далее: закрытие',"switchToClient('order','execution')")};
 }
 return{text:'Продолжите текущий этап.',actions:''};
}
function flowGuide(){const current=flowStage();const steps=FLOW_STEPS.map(([,label],i)=>`<div class="flow-step ${i<current?'done':i===current?'current':''}">${label}</div>`).join('');const n=nextFlowInfo();return `<section class="flow-guide"><div class="flow-guide-head"><div><div class="flow-guide-title">Путь малого заказа</div><div class="flow-guide-sub">От формата сотрудничества до закрытия заказа</div></div><div class="flow-wait"><span class="flow-wait-dot"></span>Шаг ${Math.min(current+1,FLOW_STEPS.length)} из ${FLOW_STEPS.length}</div></div><div class="flow-steps">${steps}</div><div class="flow-next"><div class="flow-next-copy"><div class="flow-next-kicker">Следующий шаг</div><div class="flow-next-text">${n.text}</div></div><div class="flow-next-actions">${n.actions}</div></div></section>`}
const baseRender=render;
render=function(){baseRender();const host=document.getElementById('content');if(host&&((state.role==='client'&&!['home'].includes(state.clientPage))||state.role==='dkp'))host.insertAdjacentHTML('afterbegin',flowGuide())};
render();