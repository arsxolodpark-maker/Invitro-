// v0.6 client-facing polish. Internal demo mechanics stay functional but are not shown as product copy.

Object.assign(v06Routes.find(x=>x.id==='medical')||{}, {badge:'Медицинские организации'});
Object.assign(v06Routes.find(x=>x.id==='nonmedical')||{}, {badge:'Компании'});
Object.assign(v06Routes.find(x=>x.id==='small')||{}, {badge:'Бизнес и госорганизации'});

const descriptions={
  longevity:'Программа лабораторных исследований для комплексного обследования сотрудников.',
  dors:'Корпоративная программа лабораторных исследований для сотрудников организации.',
  hazard:'Лабораторные исследования для сотрудников с учётом условий труда и параметров предприятия.'
};
for(const [id,desc] of Object.entries(descriptions)){const p=v06Products.find(x=>x.id===id);if(p)p.desc=desc;}

routeCards = function(){
  return `<div class="v06-route-grid">${v06Routes.map(x=>`<article class="v06-route ${x.marketplace?'featured':''}"><div class="coop-top"><span class="tag">${x.badge}</span></div><h3>${x.title}</h3><p>${x.desc}</p>${x.marketplace?btn('Перейти в каталог','chooseSmallProcurement()'):`<a class="btn btn-outline" href="${x.url}" target="_blank" rel="noopener">Подробнее</a>`}</article>`).join('')}</div>`;
};

home = function(){
  return `<section class="hero v06-home-hero"><div class="hero-copy"><div class="eyebrow">Для организаций</div><h2>Лабораторные решения для бизнеса и государственных организаций</h2><p>Выберите подходящее направление сотрудничества с INVITRO. Для малых закупок можно подобрать исследования и программы, собрать корзину и оформить корпоративную заявку онлайн.</p><div class="actions">${btn('Малые закупки','chooseSmallProcurement()')}${btn('Все направления',"go('cooperation')",'outline')}</div></div><div class="v06-home-side"><span class="tag">Онлайн-заказ</span><h3>Соберите услуги до регистрации организации</h3><p>Сначала выберите исследования и программы, затем укажите параметры заказа и данные организации.</p><div class="v06-mini-steps"><span>Каталог</span><span>Корзина</span><span>Организация</span><span>Заявка</span></div></div></section><section class="section"><div class="section-head"><div><h2>Направления для организаций</h2><div class="section-sub">Корпоративные услуги и партнёрские форматы INVITRO для разных задач бизнеса и государственных организаций.</div></div></div>${routeCards()}</section>`;
};

cooperation = function(){
  return `<section class="section section-tight"><div class="section-head"><div><div class="eyebrow">Для организаций</div><h2>Направления сотрудничества</h2><div class="section-sub">Выберите подходящий формат работы с INVITRO. Для малых закупок доступен онлайн-каталог и оформление корпоративной заявки.</div></div></div>${routeCards()}</section>`;
};

catalogTabs = function(){
  const tabs=[['services','Услуги'],['material','По биоматериалу'],['tests','По тестам'],['programs','Программы']];
  return `<div class="v06-tabs">${tabs.map(([id,label])=>`<button class="${state.catalogMode===id?'active':''}" onclick="setCatalogMode('${id}')">${label}</button>`).join('')}</div>`;
};

corporatePriceNote = function(){
  return `<div class="price-disclaimer"><b>Корпоративные условия рассчитываются индивидуально.</b> Итоговая стоимость зависит от количества сотрудников, состава услуг и региона. Цена в каталоге используется как базовый ориентир.</div>`;
};

priceBlock = function(p){
  return p.price?`<div class="v06-price"><b>от ${money(p.price)}</b><small>Базовая стоимость</small></div>`:`<div class="v06-price"><b>По запросу</b><small>Стоимость рассчитывается индивидуально</small></div>`;
};

const originalCatalogPolished = catalog;
catalog = function(){
  const html = originalCatalogPolished();
  return html
    .replace('Для прототипа используем структуру и примеры из B2C-каталога INVITRO. В рабочей версии каталог должен синхронизироваться полностью, без ручного ведения.','Подберите исследования и программы для сотрудников организации. Корпоративные условия рассчитываются с учётом объёма заказа и региона.')
    .replaceAll('ДЕМО','')
    .replaceAll('демо ','')
    .replaceAll('Демо ','');
};

const originalProductDetailPolished = productDetailView;
productDetailView = function(p){
  return originalProductDetailPolished(p)
    .replace('В рабочей версии здесь подгружается полный состав программы из подтверждённой карточки INVITRO. Для корпоративных программ без подтверждённого состава данные в прототипе не выдумываем.','Подробный состав программы и условия её применения будут указаны в карточке программы.')
    .replaceAll('ДЕМО','');
};

const originalOrganizationPolished = organization;
organization = function(){
  return originalOrganizationPolished()
    .replace('Для отправки корпоративной заявки укажите ИНН, подтяните реквизиты и загрузите документы в PDF.','Укажите ИНН организации, проверьте реквизиты и загрузите необходимые документы в PDF.')
    .replace('В прототипе показываем загрузку PDF: устав и документ о полномочиях представителя. Финальный обязательный перечень должен задаваться правилами ДКП.','Загрузите документы организации, необходимые для проверки корпоративной заявки.')
    .replace('Подставить демо ИНН','Заполнить пример')
    .replace('Загрузить демо PDF','Загрузить PDF')
    .replace('Заявка передана в единый фронт ДКП.','Заявка отправлена корпоративному менеджеру.')
    .replace('Дальше менеджер проверяет организацию и готовит коммерческие условия.','Менеджер проверит данные организации и подготовит коммерческие условия.')
    .replace('Открыть единый фронт ДКП','Перейти к обработке заявки')
    .replaceAll('ДЕМО','');
};

const originalNextFlowInfoPolished = nextFlowInfo;
nextFlowInfo = function(){
  const x=originalNextFlowInfoPolished();
  if(!x||!x.text)return x;
  x.text=x.text
    .replace('Заявка передана в единый фронт ДКП.','Заявка отправлена корпоративному менеджеру.')
    .replace('ДКП готовит коммерческое предложение.','Корпоративный менеджер готовит коммерческое предложение.')
    .replace('ДКП вернул документы.','Документы возвращены на уточнение.')
    .replace('Корзина, реквизиты и документы готовы. Отправьте заявку в ДКП.','Корзина, реквизиты и документы готовы. Отправьте корпоративную заявку.');
  x.actions=(x.actions||'')
    .replaceAll('Открыть единый фронт ДКП','Перейти к обработке заявки')
    .replaceAll('Отправить заявку в ДКП','Отправить заявку')
    .replaceAll('Подставить демо ИНН','Заполнить пример')
    .replaceAll('Загрузить демо PDF','Загрузить PDF');
  return x;
};

const clientTitleDataPolished = titleData;
titleData = function(){
  const d=clientTitleDataPolished();
  if(state.role==='client' && d){
    if(d[0]==='Малые закупки' && d[1]==='Каталог') return ['Для организаций','Малые закупки'];
    if(d[0]==='Корпоративная заявка') return ['Для организаций','Оформление заявки'];
  }
  return d;
};

render();
