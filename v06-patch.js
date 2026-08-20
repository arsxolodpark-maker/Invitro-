// v0.6 safeguards: show only B2C price references verified from a current official source.
// Other demo products keep the catalog mechanics without asserting an unverified current price.
for (const p of v06Products) p.price = null;
const biochem154 = v06Products.find(p=>p.id==='biochem154');
if (biochem154) biochem154.price = 2890; // Moscow B2C reference published by INVITRO 20.04.2026.

catalogTabs = function(){
  const tabs=[['services','Услуги'],['material','По биоматериалу'],['tests','По тестам'],['programs','Программы'],['industry','По деятельности · гипотеза']];
  return `<div class="v06-tabs">${tabs.map(([id,label])=>`<button class="${state.catalogMode===id?'active':''}" onclick="setCatalogMode('${id}')">${label}</button>`).join('')}</div>`;
};

corporatePriceNote = function(){
  return `<div class="price-disclaimer"><b>*Базовый ориентир берём из B2C-каталога.</b> Корпоративная цена может снижаться в зависимости от количества сотрудников, набора услуг и региона. В прототипе показываем цену только там, где текущий B2C-ориентир подтверждён.</div>`;
};
render();