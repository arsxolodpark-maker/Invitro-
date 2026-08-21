// v0.6 client-facing copy polish. Internal demo mechanics stay functional but are not shown as product copy.

const polishedHome = home;
home = function(){
  return `<section class="hero v06-home-hero"><div class="hero-copy"><div class="eyebrow">Для организаций</div><h2>Лабораторные решения для бизнеса и государственных организаций</h2><p>Выберите подходящее направление сотрудничества с INVITRO. Для малых закупок можно подобрать исследования и программы, собрать корзину и оформить корпоративную заявку онлайн.</p><div class="actions">${btn('Малые закупки','chooseSmallProcurement()')}${btn('Все направления',"go('cooperation')",'outline')}</div></div><div class="v06-home-side"><span class="tag">Онлайн-заказ</span><h3>Соберите услуги до регистрации организации</h3><p>Сначала выберите исследования и программы, затем укажите параметры заказа и данные организации.</p><div class="v06-mini-steps"><span>Каталог</span><span>Корзина</span><span>Организация</span><span>Заявка</span></div></div></section><section class="section"><div class="section-head"><div><h2>Направления для организаций</h2><div class="section-sub">Корпоративные услуги и партнёрские форматы INVITRO для разных задач бизнеса и государственных организаций.</div></div></div>${routeCards()}</section>`;
};

cooperation = function(){
  return `<section class="section section-tight"><div class="section-head"><div><div class="eyebrow">Для организаций</div><h2>Направления сотрудничества</h2><div class="section-sub">Выберите подходящий формат работы с INVITRO. Для малых закупок доступен онлайн-каталог и оформление корпоративной заявки.</div></div></div>${routeCards()}</section>`;
};

const originalCatalogPolished = catalog;
catalog = function(){
  const html = originalCatalogPolished();
  return html
    .replace('Для прототипа используем структуру и примеры из B2C-каталога INVITRO. В рабочей версии каталог должен синхронизироваться полностью, без ручного ведения.','Подберите исследования и программы для сотрудников организации. Стоимость в каталоге используется как базовый ориентир; корпоративные условия рассчитываются отдельно.')
    .replaceAll('ДЕМО','')
    .replaceAll('демо ','')
    .replaceAll('Демо ','');
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
    .replaceAll('Отправить заявку в ДКП','Отправить заявку');
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
