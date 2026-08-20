// Guided journey for Marketplace v0.6.
const FLOW_STEPS=[['catalog','Каталог'],['cart','Корзина'],['organization','Регистрация'],['verification','ДКП'],['quote','КП'],['execution','Исполнение'],['closing','Закрытие']];
function flowStage(){
 if(state.closing==='closed')return FLOW_STEPS.length;
 if(state.execution.status==='active'||state.execution.status==='done'||state.closing==='ready')return 5;
 if(state.quote.status!=='none'||state.contract==='signed'||state.invoice==='issued'||state.payment==='paid'||state.roster==='ready')return 4;
 if(state.verification==='pending'||state.verification==='verified'||state.verification==='fix')return 3;
 if(state.org||state.docs||state.clientPage==='organization')return 2;
 if(state.cart.length)return 1;
 return 0;
}
function flowAction(label,code,kind='primary'){return `<button class="btn btn-${kind}" type="button" onclick="${code}">${label}</button>`}
function switchToClient(page='order',tab='overview'){state.role='client';state.clientPage=page;if(tab)state.orderTab=tab;save();render()}
function switchToDkp(page='queue'){state.role='dkp';state.dkpPage=page;save();render()}
function nextFlowInfo(){
 if(state.closing==='closed')return{text:'Заказ завершён.',actions:flowAction('Начать заново','resetDemo()','outline')};
 if(!state.cart.length)return{text:'Выберите исследования или программу и добавьте их в корзину.',actions:state.role==='client'&&state.clientPage==='catalog'?'':flowAction('Открыть каталог',"switchToClient('catalog',null)")};
 if(!state.org){
  if(state.role==='client'&&state.clientPage==='cart')return{text:'Корзина собрана. Укажите параметры и переходите к регистрации организации.',actions:flowAction('Продолжить: регистрация',"switchToClient('organization',null)")};
  if(state.role==='client'&&state.clientPage==='organization'){
   if(!state.inn)return{text:'Введите ИНН организации.',actions:flowAction('Подставить демо ИНН','demoInn()','outline')};
   return{text:'Подтяните реквизиты по ИНН.',actions:flowAction('Подтянуть реквизиты','loadOrg()')};
  }
  return{text:'Следующий шаг — регистрация организации.',actions:flowAction('К регистрации',"switchToClient('organization',null)")};
 }
 if(state.verification==='fix'&&!state.docs)return{text:'ДКП вернул документы. Загрузите исправленные PDF.',actions:state.role==='client'&&state.clientPage==='organization'?flowAction('Загрузить исправленные PDF','uploadDocs()','secondary'):flowAction('Исправить документы',"switchToClient('organization',null)")};
 if(!state.docs)return{text:'Загрузите PDF-документы организации.',actions:state.role==='client'&&state.clientPage==='organization'?flowAction('Загрузить демо PDF','uploadDocs()','secondary'):flowAction('К документам',"switchToClient('organization',null)")};
 if(state.verification==='none')return{text:'Корзина, реквизиты и документы готовы. Отправьте заявку в ДКП.',actions:state.role==='client'&&state.clientPage==='organization'?flowAction('Отправить заявку в ДКП','sendVerify()'):flowAction('К заявке',"switchToClient('organization',null)")};
 if(state.verification==='pending'){
  if(state.role==='client')return{text:'Заявка передана в единый фронт ДКП.',actions:flowAction('Открыть единый фронт ДКП',"switchToDkp('case')")};
  if(state.dkpPage==='case')return{text:'Проверьте организацию и документы.',actions:flowAction('Подтвердить организацию','verify(true)','ok')+flowAction('Вернуть на доработку','verify(false)','warn')};
  return{text:'Откройте карточку задачи.',actions:flowAction('Открыть карточку',"go('case')")};
 }
 if(state.verification==='verified'&&state.quote.status==='none'){
  if(state.role==='client')return{text:'Организация проверена. ДКП готовит коммерческое предложение.',actions:flowAction('Открыть единый фронт ДКП',"switchToDkp('case')")};
  return{text:'Сформируйте коммерческое предложение.',actions:flowAction('Сформировать и отправить демо КП','createQuote()')};
 }
 if(state.quote.status==='change'){
  if(state.role==='client')return{text:'Клиент запросил корректировку КП.',actions:flowAction('Открыть единый фронт ДКП',"switchToDkp('case')")};
  return{text:`Создайте новую версию КП.`,actions:flowAction(`Создать КП v${state.quote.version+1}`,'createQuote()')};
 }
 if(state.quote.status==='sent'){
  if(state.role==='dkp')return{text:`КП v${state.quote.version} отправлено.`,actions:flowAction('Открыть КП как клиент',"switchToClient('order','quote')")};
  if(state.clientPage==='order'&&state.orderTab==='quote')return{text:`КП v${state.quote.version} готово.`,actions:flowAction('Принять КП','acceptQuote()','ok')+flowAction('Запросить изменение','requestChange()','outline')};
  return{text:`КП v${state.quote.version} готово.`,actions:flowAction('Открыть КП',"switchToClient('order','quote')")};
 }
 if(state.quote.status==='accepted'&&state.contract!=='signed')return{text:'КП принято. Следующий шаг — договор и счёт.',actions:state.role==='client'&&state.clientPage==='order'&&state.orderTab==='quote'?flowAction('Подтвердить договор','signContract()'):flowAction('К договору',"switchToClient('order','quote')")};
 if(state.invoice==='issued'&&state.payment!=='paid')return{text:'Счёт выставлен.',actions:state.role==='client'&&state.clientPage==='order'&&state.orderTab==='quote'?flowAction('Отметить демо-оплату','pay()'):flowAction('К оплате',"switchToClient('order','quote')")};
 if(state.payment==='paid'&&state.roster!=='ready')return{text:'Оплата подтверждена. Нужен список сотрудников.',actions:flowAction('Далее: сотрудники',"switchToClient('order','employees')")};
 if(state.roster==='ready'&&state.execution.status==='none')return{text:'Заказ готов к исполнению.',actions:flowAction('Далее: исполнение',"switchToClient('order','execution')")};
 if(state.execution.status==='active')return{text:`Заказ исполняется — ${state.execution.progress}%.`,actions:state.role==='client'&&state.clientPage==='order'&&state.orderTab==='execution'?flowAction('Обновить статус','advance()','secondary'):flowAction('Открыть исполнение',"switchToClient('order','execution')")};
 if(state.execution.status==='done'&&state.closing==='ready')return{text:'Исполнение завершено.',actions:state.role==='client'&&state.clientPage==='order'&&state.orderTab==='execution'?flowAction('Закрыть заказ','closeOrder()','ok'):flowAction('К закрытию',"switchToClient('order','execution')")};
 return{text:'Продолжите текущий этап.',actions:''};
}
function flowGuide(){const current=flowStage();const steps=FLOW_STEPS.map(([,label],i)=>`<div class="flow-step ${i<current?'done':i===current?'current':''}">${label}</div>`).join('');const n=nextFlowInfo();return `<section class="flow-guide"><div class="flow-guide-head"><div><div class="flow-guide-title">Оформление корпоративного заказа</div><div class="flow-guide-sub">Показываем путь только после начала работы с маркетплейсом</div></div><div class="flow-wait"><span class="flow-wait-dot"></span>Шаг ${Math.min(current+1,FLOW_STEPS.length)} из ${FLOW_STEPS.length}</div></div><div class="flow-steps">${steps}</div><div class="flow-next"><div class="flow-next-copy"><div class="flow-next-kicker">Следующий шаг</div><div class="flow-next-text">${n.text}</div></div><div class="flow-next-actions">${n.actions}</div></div></section>`}
const baseRender=render;
render=function(){baseRender();const host=document.getElementById('content');const showClient=state.role==='client'&&['catalog','cart','organization','order'].includes(state.clientPage);if(host&&(showClient||state.role==='dkp'))host.insertAdjacentHTML('afterbegin',flowGuide())};
render();