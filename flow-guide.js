// Guided end-to-end journey layer for the demo prototype.
// It does not replace business logic; it makes the next step explicit on every key screen.

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
    return {text:'Выберите услугу или программу — после этого откроются параметры заказа.',actions:flowAction('Перейти в каталог',"switchToClient('catalog',null)")};
  }

  if(state.clientPage==='configure' && !state.org){
    return {text:'Проверьте количество сотрудников, город и формат оказания, затем переходите к организации.',actions:flowAction('Далее: организация',"switchToClient('organization',null)")};
  }

  if(!state.org){
    return {text:'Введите ИНН и подтяните реквизиты организации.',actions:flowAction('Оформить организацию',"switchToClient('organization',null)")};
  }
  if(!state.docs){
    return {text:'Загрузите комплект документов организации.',actions:flowAction('Перейти к документам',"switchToClient('organization',null)")};
  }
  if(state.verification==='none'){
    return {text:'Реквизиты и документы готовы. Следующий шаг — отправить заявку на проверку ДКП.',actions:flowAction('Отправить на проверку',"switchToClient('organization',null)")};
  }
  if(state.verification==='fix'){
    return {text:'ДКП вернул документы на доработку. Исправьте комплект и отправьте повторно.',actions:flowAction('Исправить документы',"switchToClient('organization',null)")};
  }
  if(state.verification==='pending'){
    if(state.role==='client') return {text:'Заявка ждёт проверки ДКП. В демо можно сразу перейти в рабочее место менеджера.',actions:flowAction('Далее: проверка ДКП',"switchToDkp('case')")};
    return {text:'Проверьте организацию и документы, затем подтвердите или верните заявку.',actions:flowAction('Открыть карточку',"go('case')")};
  }
  if(state.verification==='verified' && state.quote.status==='none'){
    if(state.role==='client') return {text:'Организация проверена. Следующий шаг — ДКП формирует коммерческое предложение.',actions:flowAction('Далее: сформировать КП',"switchToDkp('case')")};
    return {text:'Организация подтверждена. Теперь сформируйте коммерческое предложение.',actions:flowAction('Открыть блок КП',"go('case')")};
  }
  if(state.quote.status==='change'){
    if(state.role==='client') return {text:'Запрошена корректировка КП. Следующее действие у ДКП — создать новую версию.',actions:flowAction('Далее: новая версия КП',"switchToDkp('case')")};
    return {text:'Клиент запросил изменения. Создайте новую версию коммерческого предложения.',actions:flowAction('Корректировать КП',"go('case')")};
  }
  if(state.quote.status==='sent'){
    if(state.role==='dkp') return {text:`КП v${state.quote.version} отправлено. Следующее действие у клиента — принять или запросить изменение.`,actions:flowAction('Далее: клиент смотрит КП',"switchToClient('order','quote')")};
    return {text:`КП v${state.quote.version} готово. Ознакомьтесь с ним и примите или запросите изменение.`,actions:flowAction('Открыть КП',"setOrderTab('quote')")};
  }
  if(state.quote.status==='accepted' && state.contract!=='signed'){
    return {text:'КП принято. Следующий шаг — подтвердить договор, после чего будет выставлен счёт.',actions:state.role==='client'?flowAction('Далее: договор и счёт',"setOrderTab('quote')"):flowAction('Далее: клиент подтверждает договор',"switchToClient('order','quote')")};
  }
  if(state.invoice==='issued' && state.payment!=='paid'){
    return {text:'Счёт выставлен. В демо следующий шаг — отметить получение оплаты.',actions:state.role==='client'?flowAction('Перейти к оплате',"setOrderTab('quote')"):flowAction('Далее: оплата клиента',"switchToClient('order','quote')")};
  }
  if(state.payment==='paid' && state.roster!=='ready'){
    return {text:'Оплата подтверждена. Теперь загрузите список сотрудников для исполнения заказа.',actions:flowAction('Далее: сотрудники',"switchToClient('order','employees')")};
  }
  if(state.roster==='ready' && state.execution.status==='none'){
    return {text:'Список сотрудников принят. Заказ готов к передаче в исполнение.',actions:flowAction('Далее: исполнение',"switchToClient('order','execution')")};
  }
  if(state.execution.status==='active'){
    return {text:`Заказ исполняется — ${state.execution.progress}%. Обновляйте агрегированный статус до завершения.`,actions:flowAction('Открыть исполнение',state.role==='client'?"setOrderTab('execution')":"go('execution')")};
  }
  if(state.execution.status==='done' && state.closing==='ready'){
    return {text:'Исполнение завершено. Последний шаг — закрывающие документы.',actions:flowAction('Далее: закрыть заказ',"switchToClient('order','execution')")};
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
  if(host && state.clientPage!=='home' || (host && state.role==='dkp')) host.insertAdjacentHTML('afterbegin',flowGuide());
};
render();
