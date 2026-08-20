// INVITRO Marketplace v0.6
// Confirmed after owner sync: current B2B directions + small-purchase marketplace,
// B2C catalog as the source/reference, cart before registration, B2C price reference
// with potential corporate reduction, PDF corporate docs, handoff to a unified DKP front.

const v06Routes = [
  {id:'medical',title:'Медицинским организациям',badge:'B2B',desc:'Лабораторный аутсорсинг и сотрудничество с медицинскими организациями.',url:'https://www.invitro.ru/medical/'},
  {id:'nonmedical',title:'Немедицинским организациям',badge:'B2B',desc:'Программы обследования и лабораторные решения для сотрудников компаний.',url:'https://www.invitro.ru/non-medical/'},
  {id:'small',title:'Малые закупки',badge:'B2B / B2G',desc:'Выбрать исследования и программы, собрать корзину и отправить корпоративную заявку.',marketplace:true},
  {id:'franchise',title:'Франчайзинг',badge:'Партнёрство',desc:'Открытие медицинского офиса и развитие бизнеса под брендом INVITRO.',url:'https://www.invitro.ru/franchize/'},
  {id:'suppliers',title:'Поставщикам',badge:'Партнёрство',desc:'Закупки INVITRO, предложения поставщиков и участие в закупочных процедурах.',url:'https://www.invitro.ru/about/tender/'}
];

const v06Products = [
  {id:'cbc1515',code:'1515',name:'Клинический анализ крови: общий анализ, лейкоформула, СОЭ',type:'Исследование',category:'individual',group:'Общеклинические',material:'Кровь',price:650,desc:'Общий анализ крови с лейкоформулой и СОЭ.',industries:['education','transport','food','social','culture','security','sports']},
  {id:'cbc5',code:'5',name:'Общий анализ крови без лейкоцитарной формулы и СОЭ',type:'Исследование',category:'individual',group:'Общеклинические',material:'Кровь',price:255,desc:'Базовое исследование показателей клеточного состава крови.',industries:['education','transport','food','social','culture','security','sports']},
  {id:'urine116',code:'116',name:'Анализ мочи общий',type:'Исследование',category:'individual',group:'Общеклинические',material:'Моча',price:405,desc:'Общий анализ мочи с микроскопией осадка.',industries:['education','transport','food','social','culture','security','sports']},
  {id:'biochem154',code:'ОБС154',name:'Биохимия крови: базовый профиль',type:'Комплекс анализов',category:'package',group:'Биохимия',material:'Кровь',price:2290,desc:'Готовый комплекс биохимических исследований крови.',industries:['education','transport','food','social','culture','security','sports']},
  {id:'tsh',code:'56',name:'Тиреотропный гормон (ТТГ)',type:'Исследование',category:'individual',group:'Гормоны',material:'Кровь',price:690,desc:'Исследование уровня тиреотропного гормона.',industries:['education','social','culture','sports']},
  {id:'t4',code:'55',name:'Тироксин свободный (Т4 свободный)',type:'Исследование',category:'individual',group:'Гормоны',material:'Кровь',price:740,desc:'Исследование свободного тироксина.',industries:['education','social','culture','sports']},
  {id:'t3',code:'53',name:'Трийодтиронин свободный (Т3 свободный)',type:'Исследование',category:'individual',group:'Гормоны',material:'Кровь',price:745,desc:'Исследование свободного трийодтиронина.',industries:['education','social','culture','sports']},
  {id:'atpo',code:'58',name:'Антитела к тиреоидной пероксидазе (АТ-ТПО)',type:'Исследование',category:'individual',group:'Гормоны',material:'Кровь',price:885,desc:'Лабораторное исследование антител к тиреоидной пероксидазе.',industries:['education','social','culture','sports']},
  {id:'glucoseUrine',code:'',name:'Глюкоза (суточная моча)',type:'Исследование',category:'individual',group:'Биохимия',material:'Моча',price:270,desc:'Определение глюкозы в суточной моче.',industries:['social','culture']},
  {id:'biochem74',code:'ОБС74',name:'Биохимия крови: минимальный профиль',type:'Комплекс анализов',category:'package',group:'Биохимия',material:'Кровь',price:3630,desc:'Комплекс биохимических исследований.',industries:['education','transport','food','social','culture','security','sports']},
  {id:'office',code:'',name:'Программа обследования для офисных сотрудников',type:'Программа',category:'program',group:'Корпоративные программы',material:'Кровь / моча',price:null,desc:'Готовая программа из каталога INVITRO для обследования офисных сотрудников.',industries:['culture','education']},
  {id:'homeStaff',code:'',name:'Обследование домашнего персонала',type:'Программа',category:'program',group:'Корпоративные программы',material:'Разные типы',price:null,desc:'Готовая программа обследования персонала.',industries:['social']},
  {id:'longevity',code:'',name:'Пакет «Долголетие»',type:'Корпоративная программа',category:'program',group:'Корпоративные программы',material:'Разные типы',price:null,desc:'Корпоративная программа. Полный состав должен подгружаться из подтверждённой карточки программы INVITRO.',industries:['social','education']},
  {id:'dors',code:'',name:'Пакет «ДОРС»',type:'Корпоративная программа',category:'program',group:'Корпоративные программы',material:'Разные типы',price:null,desc:'Корпоративная программа. Состав и базовая цена требуют подтверждённого источника INVITRO.',industries:['transport','food','security']},
  {id:'hazard',code:'',name:'Вредные и опасные производства',type:'Корпоративная программа',category:'program',group:'Профосмотры и производство',material:'Разные типы',price:null,desc:'Подбор лабораторной программы по параметрам предприятия и контингента.',industries:['transport','food']}
];

const v06Industries = [
  ['education','Образование'],['transport','Транспорт'],['food','Пищевые производства'],['culture','Культура / наука / НИИ'],['social','Социальные учреждения'],['security','Силовые ведомства'],['sports','Спортшколы / секции']
];

productById = function(id){ return v06Products.find(x=>x.id===id) || products.find(x=>x.id===id); };

function v06InitState(){
  if(!state.catalogMode) state.catalogMode='services';
  if(!state.catalogSubfilter) state.catalogSubfilter='all';
  if(!state.productDetail) state.productDetail=null;
}
v06InitState();

function setCatalogMode(mode){state.catalogMode=mode;state.catalogSubfilter='all';state.productDetail=null;save();render()}
function setCatalogSubfilter(value){state.catalogSubfilter=value;state.productDetail=null;save();render()}
function openProduct(id){state.productDetail=id;state.clientPage='catalog';save();render()}
function closeProduct(){state.productDetail=null;save();render()}
function goCatalog(){state.productDetail=null;state.clientPage='catalog';save();render()}

function referenceTotal(){return cartLines().reduce((sum,x)=>sum+((x.product.price||0)*x.qty),0)}
function priceBlock(p){return p.price?`<div class="v06-price"><b>${money(p.price)}</b><small>Базовый ориентир B2C*</small></div>`:`<div class="v06-price"><b>Цена уточняется</b><small>После подтверждения состава программы</small></div>`}
function corporatePriceNote(){return `<div class="price-disclaimer"><b>*Корпоративная цена может быть ниже.</b> Итог зависит от количества сотрудников, состава услуг и региона исполнения.</div>`}

clientNav = function(){
  return [['home','Для организаций'],['cooperation','Направления'],['catalog','Малые закупки'],['cart',`Корзина${state.cart.length?' · '+state.cart.length:''}`],['order','Мой заказ']].map(([id,label])=>navBtn(id,label)).join('');
};
mobileNav = function(){
  const items=state.role==='client'?[['home','Главная'],['cooperation','Направления'],['catalog','Каталог'],['cart','Корзина']]:[['queue','Очередь'],['case','Заявка'],['execution','Исполнение'],['audit','Журнал']];
  const cur=state.role==='client'?state.clientPage:state.dkpPage;
  return items.map(([id,label])=>`<button class="${cur===id?'active':''}" type="button" onclick="go('${id}')">${label}</button>`).join('');
};

function routeCards(){
  return `<div class="v06-route-grid">${v06Routes.map(x=>`<article class="v06-route ${x.marketplace?'featured':''}"><div class="coop-top"><span class="tag">${x.badge}</span></div><h3>${x.title}</h3><p>${x.desc}</p>${x.marketplace?btn('Открыть маркетплейс','chooseSmallProcurement()'):`<a class="btn btn-outline" href="${x.url}" target="_blank" rel="noopener">Открыть раздел</a>`}</article>`).join('')}</div>`;
}

home = function(){
  return `<section class="hero v06-home-hero"><div class="hero-copy"><div class="eyebrow">Для организаций</div><h2>Решения INVITRO для бизнеса и государственных организаций</h2><p>Выберите подходящее направление сотрудничества. Новый сценарий малых закупок позволяет сначала собрать корзину исследований и программ, а зарегистрировать организацию уже перед отправкой заявки.</p><div class="actions">${btn('Малые закупки','chooseSmallProcurement()')}${btn('Все направления',"go('cooperation')",'outline')}</div></div><div class="v06-home-side"><span class="tag">Новый цифровой маршрут</span><h3>Сначала каталог и корзина — регистрация потом</h3><p>Пользователь видит услуги, ориентир B2C-цены и программы до ввода реквизитов компании.</p><div class="v06-mini-steps"><span>Каталог</span><span>Корзина</span><span>Регистрация</span><span>Заявка ДКП</span></div></div></section><section class="section"><div class="section-head"><div><h2>Направления для организаций</h2><div class="section-sub">Сохраняем существующие B2B-направления INVITRO и добавляем маркетплейс малых закупок.</div></div></div>${routeCards()}</section>`;
};

cooperation = function(){
  return `<section class="section section-tight"><div class="section-head"><div><div class="eyebrow">Для организаций</div><h2>Направления сотрудничества</h2><div class="section-sub">Существующие корпоративные направления остаются самостоятельными маршрутами. «Малые закупки» открывают новый каталог и корзину.</div></div></div>${routeCards()}</section>`;
};

function catalogTabs(){
  const tabs=[['services','Услуги'],['material','По биоматериалу'],['tests','По тестам'],['programs','Программы'],['industry','По деятельности']];
  return `<div class="v06-tabs">${tabs.map(([id,label])=>`<button class="${state.catalogMode===id?'active':''}" onclick="setCatalogMode('${id}')">${label}</button>`).join('')}</div>`;
}
function subfilters(){
  let list=[];
  if(state.catalogMode==='material') list=['Кровь','Моча','Разные типы'];
  if(state.catalogMode==='tests') list=['Общеклинические','Биохимия','Гормоны'];
  if(state.catalogMode==='industry') list=v06Industries.map(x=>x[0]);
  if(!list.length)return '';
  return `<div class="filters v06-subfilters"><button class="filter-chip ${state.catalogSubfilter==='all'?'active':''}" onclick="setCatalogSubfilter('all')">Все</button>${list.map(v=>{const label=state.catalogMode==='industry'?(v06Industries.find(x=>x[0]===v)||[])[1]:v;return `<button class="filter-chip ${state.catalogSubfilter===v?'active':''}" onclick="setCatalogSubfilter('${v}')">${label}</button>`}).join('')}</div>`;
}
function filteredCatalog(){
  const q=(state.search||'').trim().toLowerCase();
  return v06Products.filter(p=>{
    const text=(p.name+' '+p.type+' '+p.group+' '+p.material+' '+(p.code||'')).toLowerCase();
    if(q&&!text.includes(q))return false;
    if(state.catalogMode==='programs'&&p.category!=='program'&&p.category!=='package')return false;
    if(state.catalogMode==='material'&&state.catalogSubfilter!=='all'&&p.material!==state.catalogSubfilter)return false;
    if(state.catalogMode==='tests'&&state.catalogSubfilter!=='all'&&p.group!==state.catalogSubfilter)return false;
    if(state.catalogMode==='industry'&&state.catalogSubfilter!=='all'&&!p.industries.includes(state.catalogSubfilter))return false;
    return true;
  });
}

catalogCard = function(p){
  const inCart=state.cart.find(x=>x.id===p.id);
  return `<article class="product v06-product"><div class="product-topline"><span class="tag">${p.type}</span>${p.code?`<span class="product-code">№ ${p.code}</span>`:''}</div><h3>${p.name}</h3><p>${p.desc}</p><div class="product-facts"><span>${p.material}</span><span>${p.group}</span></div>${priceBlock(p)}<div class="actions">${btn('Подробнее',`openProduct('${p.id}')`,'outline')}${btn(inCart?'Добавить ещё':'В корзину',`addToCart('${p.id}')`,inCart?'outline':'primary')}${inCart?status(`В корзине: ${inCart.qty}`,'ok'):''}</div></article>`;
};

function productDetailView(p){
  const inCart=state.cart.find(x=>x.id===p.id);
  return `<div class="v06-detail"><button class="back-link" onclick="closeProduct()">← Назад в каталог</button><div class="grid"><div class="span8"><div class="card"><div class="product-topline"><span class="tag">${p.type}</span>${p.code?`<span class="product-code">№ ${p.code}</span>`:''}</div><h2>${p.name}</h2><p class="detail-lead">${p.desc}</p><div class="v06-detail-facts"><div><small>Биоматериал</small><b>${p.material}</b></div><div><small>Категория</small><b>${p.group}</b></div></div>${p.category==='program'?`<div class="program-contents"><h3>Состав программы</h3><p>В рабочей версии здесь подгружается полный состав программы из подтверждённой карточки INVITRO. Для корпоративных программ без подтверждённого состава данные в прототипе не выдумываем.</p></div>`:''}<div class="actions">${btn(inCart?'Добавить ещё':'Добавить в корзину',`addToCart('${p.id}')`)}</div></div></div><aside class="span4"><div class="summary-card">${priceBlock(p)}${corporatePriceNote()}<div class="divider"></div><div class="summary-row"><span>В корзине</span><b>${inCart?inCart.qty:0}</b></div>${state.cart.length?`<div class="actions">${btn('Перейти в корзину',"go('cart')")}</div>`:''}</div></aside></div></div>`;
}

catalog = function(){
  if(state.productDetail){const p=productById(state.productDetail);if(p)return productDetailView(p);state.productDetail=null;}
  const list=filteredCatalog();
  return `<div class="catalog-toolbar card soft"><div><div class="eyebrow">Малые закупки</div><h2>Каталог исследований и программ</h2><p class="section-sub">Для прототипа используем структуру и примеры из B2C-каталога INVITRO. В рабочей версии каталог должен синхронизироваться полностью, без ручного ведения.</p></div><button class="cart-pill" onclick="go('cart')"><span>Корзина</span><b>${state.cart.length} поз.</b></button></div>${catalogTabs()}<div class="card soft v06-search"><div class="search-row"><input class="search-input" value="${esc(state.search||'')}" placeholder="Название, код исследования или программа" oninput="setSearch(this.value)" onkeydown="if(event.key==='Enter')render()">${btn('Найти','render()')}</div>${subfilters()}</div><div class="catalog">${list.map(catalogCard).join('')}</div>${!list.length?`<div class="card empty">По выбранным параметрам ничего не найдено.</div>`:''}${corporatePriceNote()}${state.cart.length?`<div class="sticky-cart"><div><b>В корзине: ${state.cart.length} позиций</b><span>Регистрация пока не нужна</span></div>${btn('Перейти в корзину',"go('cart')")}</div>`:''}`;
};

cart = function(){
  const lines=cartLines();
  if(!lines.length)return `<div class="card empty"><h2>Корзина пока пустая</h2><p>Сначала выберите исследования или программы. Регистрировать организацию до этого не нужно.</p><div class="actions" style="justify-content:center">${btn('Открыть каталог','goCatalog()')}</div></div>`;
  const ref=referenceTotal();
  return `<div class="grid"><div class="span8"><div class="card"><div class="section-head"><div><div class="eyebrow">Малые закупки</div><h2>Корзина</h2><div class="section-sub">Проверьте услуги и сразу укажите параметры, которые влияют на корпоративный расчёт.</div></div></div><div class="spec-list">${lines.map(x=>`<div class="spec-row"><div><b>${x.product.name}</b><div class="help">${x.product.type}${x.product.price?' · '+money(x.product.price)+' B2C':''}</div></div><div class="spec-controls"><input type="number" min="1" value="${x.qty}" onchange="setCartQty('${x.id}',this.value)"><button class="text-button" onclick="removeFromCart('${x.id}')">Удалить</button></div></div>`).join('')}</div><div class="divider"></div><h3>Параметры для расчёта</h3><div class="form-grid"><div class="field"><label>Количество сотрудников</label><input type="number" min="1" value="${state.employees}" oninput="setNumber('employees',this.value)"></div><div class="field"><label>Регион / город</label><select onchange="setValue('city',this.value)"><option ${state.city==='Москва'?'selected':''}>Москва</option><option ${state.city==='Санкт-Петербург'?'selected':''}>Санкт-Петербург</option><option ${state.city==='Другой регион'?'selected':''}>Другой регион</option></select></div><div class="field"><label>Формат оказания</label><select onchange="setValue('fulfilment',this.value)"><option ${state.fulfilment==='Выездная бригада'?'selected':''}>Выездная бригада</option><option ${state.fulfilment==='В медицинских офисах'?'selected':''}>В медицинских офисах</option></select></div><div class="field"><label>Тип организации / закупки</label><select onchange="setValue('procurement',this.value)"><option value="commercial" ${state.procurement==='commercial'?'selected':''}>Коммерческая / прямой маршрут</option><option value="regulated" ${state.procurement==='regulated'?'selected':''}>Государственная / регулируемая</option></select></div></div>${state.procurement==='regulated'?`<div class="notice warn">Для регулируемой закупки точный юридический маршрут определяется отдельно. Маркетплейс собирает корзину и данные для корпоративной заявки.</div>`:''}<div class="actions">${btn('Продолжить: регистрация',"go('organization')")}${btn('Добавить ещё','goCatalog()','outline')}</div></div></div><aside class="span4"><div class="summary-card"><h3 style="margin-top:0">Предварительно</h3><div class="summary-row"><span>Позиций</span><b>${state.cart.length}</b></div><div class="summary-row"><span>Сотрудников</span><b>${state.employees}</b></div>${ref?`<div class="summary-row"><span>Ориентир B2C</span><b>${money(ref)}</b></div>`:''}${corporatePriceNote()}<div class="notice blue" style="margin-top:14px">Регистрация начинается только после сформированной корзины.</div></div></aside></div>`;
};

configure = function(){return cart()};

organization = function(){
  return `<div class="grid"><div class="span8"><div class="card"><div class="eyebrow">После корзины</div><h2>Регистрация организации</h2><p class="section-sub">Для отправки корпоративной заявки укажите ИНН, подтяните реквизиты и загрузите документы в PDF.</p><div class="field"><label>ИНН</label><input value="${esc(state.inn)}" placeholder="Введите ИНН" oninput="state.inn=this.value;save()"></div><div class="actions">${btn('Подставить демо ИНН','demoInn()','outline')}${btn('Подтянуть реквизиты','loadOrg()','primary',!state.inn)}</div>${state.org?`<div class="divider"></div><div class="summary-row"><span>Организация</span><b>АО «СеверПром»</b></div><div class="summary-row"><span>ИНН</span><b>${esc(state.inn)}</b></div><div class="summary-row"><span>КПП</span><b>770101001 ${status('ДЕМО','info')}</b></div>`:''}</div><div class="card" style="margin-top:18px"><h2>Документы организации</h2><p class="section-sub">В прототипе показываем загрузку PDF: устав и документ о полномочиях представителя. Финальный обязательный перечень должен задаваться правилами ДКП.</p><div class="filebox"><div><div class="file-name">Устав / учредительный документ</div><div class="file-meta">${state.docs?'demo_ustav.pdf · PDF':'PDF не загружен'}</div></div>${state.docs?status('Загружен','ok'):status('Нужен','warn')}</div><div class="filebox"><div><div class="file-name">Полномочия представителя</div><div class="file-meta">${state.docs?'demo_authority.pdf · PDF':'PDF не загружен'}</div></div>${state.docs?status('Загружен','ok'):status('Нужен','warn')}</div><div class="actions">${btn(state.verification==='fix'?'Загрузить исправленные PDF':'Загрузить демо PDF','uploadDocs()','secondary',!state.org)}</div></div><div class="card" style="margin-top:18px"><h2>Отправка заявки</h2>${state.verification==='pending'?`<div class="notice green"><b>Заявка передана в единый фронт ДКП.</b><br>Дальше менеджер проверяет организацию и готовит коммерческие условия.</div><div class="integration-note">Целевая интеграция с Битрикс обсуждается и требует подтверждения технической схемы.</div>`:state.verification==='verified'?`<div class="notice green">Организация подтверждена ДКП. Следующий этап — коммерческое предложение.</div>`:state.verification==='fix'?`<div class="notice warn">ДКП вернул документы на доработку. Загрузите исправленные PDF и отправьте заявку повторно.</div>`:btn('Отправить заявку в ДКП','sendVerify()','primary',!(state.org&&state.docs))}</div></div><aside class="span4"><div class="summary-card"><h3 style="margin-top:0">Ваша корзина</h3>${cartLines().map(x=>`<div class="summary-row"><span>${x.product.name}</span><b>× ${x.qty}</b></div>`).join('')}<div class="divider"></div><div class="summary-row"><span>Сотрудники</span><b>${state.employees}</b></div><div class="summary-row"><span>Регион</span><b>${state.city}</b></div></div></aside></div>`;
};

// Unified DKP front is cross-product. Marketplace is only one source of incoming work.
dkpNav = function(){return [['queue','Общая очередь'],['case','Карточка задачи'],['quotes','КП и документы'],['execution','Исполнение'],['audit','Журнал']].map(([id,label])=>navBtn(id,label)).join('')};

const v06BaseTitleData = titleData;
titleData = function(){
  if(state.role==='client'){
    const map={home:['Для организаций','Решения для организаций'],cooperation:['Для организаций','Направления сотрудничества'],catalog:['Малые закупки','Каталог'],cart:['Малые закупки','Корзина'],organization:['Корпоративная заявка','Регистрация организации'],order:['Личный кабинет','Мой заказ']};
    if(map[state.clientPage])return map[state.clientPage];
  } else {
    const map={queue:['Единый фронт ДКП','Общая очередь'],case:['Единый фронт ДКП','Карточка задачи'],quotes:['Единый фронт ДКП','КП и документы'],execution:['Единый фронт ДКП','Исполнение'],audit:['Единый фронт ДКП','Журнал действий']};
    if(map[state.dkpPage])return map[state.dkpPage];
  }
  return v06BaseTitleData();
};
pageActions = function(){if(state.role==='client'&&state.clientPage==='catalog')return btn(`Корзина · ${state.cart.length}`,"go('cart')",'outline');if(state.role==='dkp'&&state.dkpPage!=='queue')return btn('В общую очередь',"go('queue')",'outline');return ''};

render();
