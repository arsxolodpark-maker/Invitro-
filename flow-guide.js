// Guided end-to-end journey layer for the demo prototype.
// The guide must never offer a CTA that simply re-opens the screen the user is already on.

const FLOW_STEPS = [
  ['catalog','Каталог'],
  ['configure','Параметры'],
  ['organization','Организация'],
  ['verification','Проверка ДКП'],
  ['quote','КП'],
  ['contract','Договор / счёт'],
  ['employees','Сотрудники'],
  ['execution','Исполнение'],
  ['closing','Закрытие']
];

function flowStage(){
  if(state.closing==='closed') return 8;
  if(state.execution.status==='active'||state.execution.status==='done'||state.closing==='ready') return 7;
  if(state.roster==='ready'||state.payment==='paid') return 6;
  if(state.contract==='signed'||state.invoice==='issued'||state.quote.status==='accepted') return 5;
  if(state.quote.status!=='none') return 4;
  if(state.verification==='pending'||state.verification==='verified'||state.verification==='fix') return 3;
  if(state.org||state.docs||state.clientPage==='organization') return 2;
  if(state.product||state.clientPage==='configure') return 1;
  return 0;
}

function flowAction(label,code,kind='primary'){
  return `<button class="btn btn-${kind}" type="button" onclick="${code}">${label}</button>`;
}

function switchToClient(page='order',tab='overview'){
  state.role='client';state.clientPage=page;if(tab)state.orderTab=tab;save();render();
}
function switchToDkp(page='queue'){
  state.role='dkp';state.dkpPage=page;save();render();
}

function nextFlowInfo(){
  if(state.closing==='closed') return {text:'Сценарий завершён. Заказ закрыт документально и финансово.',actions:flowAction('Начать сценарий заново','resetDemo()','outline')};

  if(!state.product){
    if(state.role==='client' && state.clientPage==='catalog') return {text:'Выберите услугу или программу в каталоге ниже.',actions:''};
    return {text:'Выберите услугу или программу — после этого откроются параметры заказа.',actions:flowAction('Перейти в каталог',"switchToClient('catalog',null)")};
  }

  if(state.clientPage==='configure' && !state.org){
    return {text:'Проверьте количество сотрудников, город и формат оказания, затем переходите к организации.',actions:flowAction('Далее: организация',"switchToClient('organization',null)")};
  }

  if(!state.org){
    if(state.role==='client' && state.clientPage==='organization'){
      if(!state.inn) return {text:'Начните с ИНН организации.',actions:flowAction('Подставить демо ИНН','demoInn()','outline')};
      return {text:'ИНН указан. Подтяните реквизиты организации.',actions:flowAction('Подтянуть реквизиты','loadOrg()')};
    }
    return {text:'Введите ИНН и подтяните реквизиты организации.',actions:flowAction('Оформить организацию',"switchToClient('organization',null)")};
  }

  if(!state.docs){
    if(state.role==='client' && state.clientPage==='organization') return {text:'Реквизиты готовы. Теперь загрузите комплект документов.',actions:flowAction(state.verification==='fix'?'Загрузить исправленный комплект':'Загрузить демо комплект','uploadDocs()','secondary')};
    return {text:'Загрузите комплект документов организации.',actions:flowAction('Перейти к документам',"switchToClient('organization',null)")};
  }

  if(state.verification==='none'){
    if(state.role==='client' && state.clientPage==='organization') return {text:'Реквизиты и документы готовы. Отправьте заявку на проверку ДКП.',actions:flowAction('Отправить на проверку','sendVerify()')};
    return {text:'Реквизиты и документы готовы. Следующий шаг — отправить заявку на проверку ДКП.',actions:flowAction('К проверке организации',"switchToClient('organization',null)")};
  }

  if(state.verification==='fix'){
    return {text:'ДКП вернул документы на доработку. Загрузите исправленный комплект и отправьте повторно.',actions:flowAction('Исправить документы',"switchToClient('organization',null)")};
  }

  if(state.verification==='pending'){
    if(state.role==='client') return {text:'Заявка ждёт проверки ДКП. В демо можно сразу перейти в рабочее место менеджера.',actions:flowAction('Далее: проверка ДКП',"switchToDkp('case')")};
    if(state.dkpPage==='case') return {text:'Проверьте организацию и документы и примите решение.',actions:flowAction('Подтвердить организацию','verify(true)','ok')+flowAction('Вернуть на доработку','verify(false)','warn')};
    return {text:'Проверьте организацию и документы, затем подтвердите или верните заявку.',actions:flowAction('Открыть карточку',"go('case')")};
  }

  if(state.verification==='verified' && state.quote.status==='none'){
    if(state.role==='client') return {text:'Организация проверена. Следующий шаг — ДКП формирует коммерческое предложение.',actions:flowAction('Далее: сформировать КП',"switchToDkp('case')")};
    if(state.dkpPage==='case') return {text:'Организация подтверждена. Сформируйте и отправьте коммерческое предложение.',actions:flowAction('Сформировать и отправить демо КП','createQuote()')};
    return {text:'Организация подтверждена. Теперь сформируйте коммерческое предложение.',actions:flowAction('К карточке заказа',"go('case')")};
  }

  if(state.quote.status==='change'){
    if(state.role==='client') return {text:'Запрошена корректировка КП. Следующее действие у ДКП — создать новую версию.',actions:flowAction('Далее: новая версия КП',"switchToDkp('case')")};
    if(state.dkpPage==='case') return {text:`Клиент запросил изменения в КП v${state.quote.version}. Создайте новую версию.`,actions:flowAction(`Создать КП v${state.quote.version+1}`,'createQuote()')};
    return {text:'Клиент запросил изменения. Откройте карточку заказа для новой версии КП.',actions:flowAction('К карточке заказа',"go('case')")};
  }

  if(state.quote.status==='sent'){
    if(state.role==='dkp') return {text:`КП v${state.quote.version} отправлено. Следующее действие у клиента — принять или запросить изменение.`,actions:flowAction('Далее: клиент смотрит КП',"switchToClient('order','quote')")};
    if(state.clientPage==='order' && state.orderTab==='quote') return {text:`КП v${state.quote.version} открыто. Примите его или запросите изменение.`,actions:flowAction('Принять КП','acceptQuote()','ok')+flowAction('Запросить изменение','requestChange()','outline')};
    return {text:`КП v${state.quote.version} готово. Ознакомьтесь с ним.`,actions:flowAction('Открыть КП',"switchToClient('order','quote')")};
  }

  if(state.quote.status==='accepted' && state.contract!=='signed'){
    if(state.role==='client' && state.clientPage==='order' && state.orderTab==='quote') return {text:'КП принято. Подтвердите договор — после этого будет выставлен счёт.',actions:flowAction('Подтвердить договор','signContract()')};
    return {text:'КП принято. Следующий шаг — договор и счёт.',actions:flowAction('Далее: договор и счёт',"switchToClient('order','quote')")};
  }

  if(state.invoice==='issued' && state.payment!=='paid'){
    if(state.role==='client' && state.clientPage==='order' && state.orderTab==='quote') return {text:'Счёт выставлен. В демо подтвердите получение оплаты.',actions:flowAction('Отметить демо-оплату','pay()')};
    return {text:'Счёт выставлен. Следующий шаг — оплата.',actions:flowAction('Далее: оплата',"switchToClient('order','quote')")};
  }

  if(state.payment==='paid' && state.roster!=='ready'){
    if(state.role==='client' && state.clientPage==='order' && state.orderTab==='employees') return {text:'Оплата подтверждена. Загрузите список сотрудников для исполнения заказа.',actions:flowAction('Загрузить демо список','roster()')};
    return {text:'Оплата подтверждена. Теперь нужен список сотрудников.',actions:flowAction('Далее: сотрудники',"switchToClient('order','employees')")};
  }

  if(state.roster==='ready' && state.execution.status==='none'){
    if(state.role==='client' && state.clientPage==='order' && state.orderTab==='execution') return {text:'Список сотрудников принят. Передайте заказ в исполнение.',actions:flowAction('Передать в исполнение','startExec()')};
    return {text:'Список сотрудников принят. Заказ готов к передаче в исполнение.',actions:flowAction('Далее: исполнение',"switchToClient('order','execution')")};
  }

  if(state.execution.status==='active'){
    if(state.role==='client' && state.clientPage==='order' && state.orderTab==='execution') return {text:`Заказ исполняется — ${state.execution.progress}%. Обновите агрегированный статус.`,actions:flowAction('Обновить статус','advance()','secondary')};
    return {text:`Заказ исполняется — ${state.execution.progress}%.`,actions:flowAction('Открыть исполнение',"switchToClient('order','execution')")};
  }

  if(state.execution.status==='done' && state.closing==='ready'){
    if(state.role==='client' && state.clientPage==='order' && state.orderTab==='execution') return {text:'Исполнение завершено. Последний шаг — закрывающие документы.',actions:flowAction('Закрыть заказ','closeOrder()','ok')};
    return {text:'Исполнение завершено. Последний шаг — закрывающие документы.',actions:flowAction('Далее: закрытие',"switchToClient('order','execution')")};
  }

  return {text:'Продолжите текущий этап заказа.',actions:''};
}

function flowGuide(){
  const current=flowStage();
  const steps=FLOW_STEPS.map(([,label],i)=>`<div class="flow-step ${i<current?'done':i===current?'current':''}">${label}</div>`).join('');
  const n=nextFlowInfo();
  return `<section class="flow-guide" aria-label="Путь заказа">
    <div class="flow-guide-head"><div><div class="flow-guide-title">Путь заказа</div><div class="flow-guide-sub">На каждом этапе показываем, что уже выполнено и куда идти дальше</div></div><div class="flow-wait"><span class="flow-wait-dot"></span>Шаг ${Math.min(current+1,FLOW_STEPS.length)} из ${FLOW_STEPS.length}</div></div>
    <div class="flow-steps">${steps}</div>
    <div class="flow-next"><div class="flow-next-copy"><div class="flow-next-kicker">Следующий шаг</div><div class="flow-next-text">${n.text}</div></div><div class="flow-next-actions">${n.actions}</div></div>
  </section>`;
}

const baseRender = render;
render = function(){
  baseRender();
  const host=document.getElementById('content');
  if((host && state.clientPage!=='home') || (host && state.role==='dkp')) host.insertAdjacentHTML('afterbegin',flowGuide());
};
render();
