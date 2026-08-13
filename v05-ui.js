// Client-facing polish for v0.5: remove internal product-team language from the public B2B entry layer.

home = function(){
  return `<section class="hero v05-hero public-hero">
    <div class="hero-copy">
      <div class="eyebrow">Корпоративным клиентам</div>
      <h2>Лабораторные услуги и партнёрские решения для организаций</h2>
      <p>Выберите подходящий формат работы с INVITRO. Для малых закупок можно собрать перечень исследований и программ, оформить организацию и получить коммерческое предложение в личном кабинете.</p>
      <div class="actions">${btn('Выбрать формат сотрудничества',"go('cooperation')")}${state.cart.length?btn('Продолжить заказ',"go('cart')",'outline'):''}</div>
    </div>
    <div class="v05-hero-panel purchase-entry">
      <div class="eyebrow">Для B2B и B2G</div>
      <h3>Малые закупки лабораторных услуг</h3>
      <p>Соберите нужные исследования и программы в одной спецификации. Дальше корпоративный менеджер проверит данные организации и подготовит индивидуальные условия.</p>
      <div class="purchase-benefits">
        <div class="purchase-benefit"><span class="benefit-mark">01</span><div><b>Каталог и программы</b><small>Выбор лабораторных услуг для сотрудников организации</small></div></div>
        <div class="purchase-benefit"><span class="benefit-mark">02</span><div><b>Единая спецификация</b><small>Несколько исследований и программ в одном заказе</small></div></div>
        <div class="purchase-benefit"><span class="benefit-mark">03</span><div><b>КП и документы</b><small>Коммерческие условия и статусы в личном кабинете</small></div></div>
      </div>
      ${btn('Собрать заказ','chooseSmallProcurement()')}
    </div>
  </section>
  <section class="section">
    <div class="section-head"><div><h2>Форматы сотрудничества</h2><div class="section-sub">Выберите задачу, с которой ваша организация хочет работать с INVITRO.</div></div>${btn('Все форматы',"go('cooperation')",'outline')}</div>
    ${cooperationCards()}
  </section>`;
};

cooperationCards = function(){
  return `<div class="cooperation-grid">${cooperationFormats.map(x=>`<article class="coop-card ${x.active?'active':''}">
    <div class="coop-top"><span class="tag">${x.badge}</span></div>
    <h3>${x.title}</h3>
    <p>${x.desc}</p>
    ${x.active?btn('Перейти к малым закупкам','chooseSmallProcurement()'):`<div class="coop-note">Условия и формат подключения — через корпоративного менеджера</div>`}
  </article>`).join('')}</div>`;
};

cooperation = function(){
  return `<section class="section section-tight">
    <div class="section-head"><div><div class="eyebrow">Корпоративным клиентам</div><h2>Выберите формат сотрудничества</h2><div class="section-sub">Для закупки лабораторных услуг можно сразу перейти в каталог и собрать спецификацию. Другие форматы требуют индивидуального обсуждения.</div></div></div>
    ${cooperationCards()}
  </section>`;
};

render();
