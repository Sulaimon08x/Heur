const foodPhotos={"Meal Deal 1": {"src": "images/food-01.jpg", "ai": false}, "Meal Deal 2": {"src": "images/food-02.jpg", "ai": false}, "Meal Deal 3": {"src": "images/food-03.jpg", "ai": false}, "Meal Deal 5": {"src": "images/food-04.jpg", "ai": false}, "Meal Deal 6": {"src": "images/food-05.jpg", "ai": false}, "Meal Deal 7": {"src": "images/food-06.jpg", "ai": false}, "Meal Deal 12": {"src": "images/food-07.jpg", "ai": false}, "Meal Deal 13": {"src": "images/food-08.jpg", "ai": false}, "Veggie Supreme": {"src": "images/food-09.jpg", "ai": true}, "Veggie Hot": {"src": "images/food-10.jpg", "ai": true}, "BBQ Feast": {"src": "images/food-11.jpg", "ai": true}, "Meat Feast": {"src": "images/food-12.jpg", "ai": true}, "Chicken Supreme": {"src": "images/food-13.jpg", "ai": true}, "Hot and Spicy": {"src": "images/food-14.jpg", "ai": true}, "Classic Pizza": {"src": "images/food-15.jpg", "ai": true}, "American Hot": {"src": "images/food-16.jpg", "ai": true}, "Cheese and Tomato": {"src": "images/food-17.jpg", "ai": true}, "Pepperoni Passion": {"src": "images/food-18.jpg", "ai": false}, "Hoxton Favourite Pizza": {"src": "images/food-19.jpg", "ai": true}, "Hawaiian": {"src": "images/food-20.jpg", "ai": true}, "Beef Eater": {"src": "images/food-21.jpg", "ai": true}, "BBQ Original Pizza": {"src": "images/food-22.jpg", "ai": true}, "9 Wings": {"src": "images/food-23.jpg", "ai": false}, "7UP 1.5 Litres": {"src": "images/food-24.jpg", "ai": false}, "Pepsi 330ml 0.33L": {"src": "images/food-25.jpg", "ai": false}, "Coca-Cola Original Taste 1.5L Bottle": {"src": "images/food-26.jpg", "ai": false}, "Diet Coke Cola 1.5L Bottle": {"src": "images/food-27.jpg", "ai": false}, "Fanta Lemon 330ml Can": {"src": "images/food-28.jpg", "ai": false}, "Dip": {"src": "images/food-29.jpg", "ai": false}, "Red Bull Energy Drink 250ml": {"src": "images/food-30.jpg", "ai": false}, "Quarter Pound Burger": {"src": "images/food-31.jpg", "ai": false}};
const menu = window.HOXTON_MENU || {};
const categoryNames = Object.keys(menu);
const tabs = document.getElementById('categoryTabs');
const grid = document.getElementById('menuGrid');
const search = document.getElementById('menuSearch');
const count = document.getElementById('menuCount');
const empty = document.getElementById('emptyState');
let activeCategory = categoryNames[0] || 'Pizzas';
let searchTerm = '';
const money = n => '£' + Number(n).toFixed(2);

function renderTabs(){
  tabs.innerHTML = categoryNames.map(name => `<button class="category-tab ${name===activeCategory?'active':''}" type="button" data-category="${escapeHTML(name)}">${escapeHTML(name)}</button>`).join('');
}
function renderMenu(){
 const entries=(searchTerm?categoryNames:[activeCategory]).flatMap(cat=>(menu[cat]||[]).map((item,i)=>({...item,cat,i}))).filter(item=>(item.name+' '+item.description).toLowerCase().includes(searchTerm));
 const groups=new Map();for(const item of entries){const match=item.cat==='Pizzas'&&item.name.match(/^(.*?)\s+(09|9|12|15)"$/);const name=match?match[1]:item.name;const key=match?name:item.cat+item.i;if(!groups.has(key))groups.set(key,{name,items:[]});groups.get(key).items.push(item)}
 count.textContent=`${groups.size} menu choices`;
 grid.innerHTML=[...groups.values()].map(g=>{const item=g.items[0];const photo=foodPhotos[g.name];return `<article class="menu-card ${photo?'has-photo':''}">${photo?`<figure class="listing-photo"><img loading="lazy" src="${photo.src}" alt="${escapeHTML(g.name)} listing image">${photo.ai?'<figcaption>AI listing image</figcaption>':''}</figure>`:''}<div class="menu-card-top"><h3>${escapeHTML(g.name)}</h3></div><p>${escapeHTML(item.description)}</p><div class="menu-card-foot">${g.items.length>1?`<select aria-label="Pizza size" class="size-choice">${g.items.map(v=>`<option value="${v.i}">${escapeHTML(v.name.match(/(09|9|12|15)"$/)[0])} · ${money(v.price)}</option>`).join('')}</select>`:`<strong>${money(item.price)}</strong>`}<button class="add-item" data-cat="${escapeHTML(item.cat)}" data-add="${item.i}">+ Add</button></div></article>`}).join('');empty.hidden=entries.length!==0;
}
function escapeHTML(value){return String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));}
tabs.addEventListener('click', e => {const button=e.target.closest('[data-category]');if(!button)return;activeCategory=button.dataset.category;renderTabs();renderMenu();});
search.addEventListener('input',()=>{searchTerm=search.value.trim().toLowerCase();renderMenu();});
document.querySelectorAll('[data-category-link]').forEach(link=>link.addEventListener('click',()=>{const wanted=link.dataset.categoryLink;if(menu[wanted]){activeCategory=wanted;renderTabs();renderMenu();}}));
renderTabs();renderMenu();

// Theme chooser — saves the selected theme on this device.
const themes=[
 {id:'original',name:'Original',colors:['#ffffff','#142b69','#b91c32']},
  {id:'vice',name:'Vice City',colors:['#68234f','#ff65ad','#ffad72']},
  {id:'sunset',name:'Sunset Glow',colors:['#a94d3e','#ed7045','#ffc16e']},
  {id:'chroma',name:'Chroma Glow',colors:['#55218a','#9b55e9','#e178e8']},
  {id:'mint',name:'Mint Apple',colors:['#075b49','#159b76','#7de0b6']},
  {id:'midnight',name:'Midnight Sky',colors:['#173d61','#4b9fe0','#91aaff']},
  {id:'crimson',name:'Crimson Ember',colors:['#6d202a','#d94343','#ff9866']},
  {id:'dark',name:'Classic Dark',colors:['#24262a','#777980','#c7c8ce']},
  {id:'light',name:'Clean Light',colors:['#f2f4fa','#ffffff','#c8d5f2']}
];
const themeOptions=document.getElementById('themeOptions');
const panel=document.getElementById('themePanel');
const backdrop=document.getElementById('themeBackdrop');
const launcher=document.getElementById('themeLauncher');
const closeButton=document.getElementById('themeClose');
let currentTheme=localStorage.getItem('hoxton-theme')||'original';
function applyTheme(id){document.body.dataset.theme=id;currentTheme=id;localStorage.setItem('hoxton-theme',id);themeOptions.querySelectorAll('button').forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.theme===id)));}
function renderThemes(){themeOptions.innerHTML=themes.map(t=>`<button class="theme-option" type="button" data-theme="${t.id}" aria-pressed="${t.id===currentTheme}"><span class="swatch" style="background:linear-gradient(135deg,${t.colors.join(',')})"></span><span>${t.name}</span><span class="check">✓</span></button>`).join('');}
function openThemes(){panel.hidden=false;backdrop.hidden=false;launcher.setAttribute('aria-expanded','true');closeButton.focus();}
function closeThemes(){panel.hidden=true;backdrop.hidden=true;launcher.setAttribute('aria-expanded','false');launcher.focus();}
themeOptions.addEventListener('click',e=>{const btn=e.target.closest('[data-theme]');if(btn)applyTheme(btn.dataset.theme);});
launcher.addEventListener('click',openThemes);closeButton.addEventListener('click',closeThemes);backdrop.addEventListener('click',closeThemes);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden)closeThemes();});
renderThemes();applyTheme(themes.some(t=>t.id===currentTheme)?currentTheme:'original');

// Small-screen navigation.
const mobileMenu=document.getElementById('mobileMenu');
const nav=document.querySelector('.main-nav');
mobileMenu.addEventListener('click',()=>{const open=nav.classList.toggle('open');mobileMenu.setAttribute('aria-expanded',String(open));mobileMenu.textContent=open?'×':'☰';});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');mobileMenu.setAttribute('aria-expanded','false');mobileMenu.textContent='☰';}));

let basket={};try{basket=JSON.parse(localStorage.getItem('hoxton-basket')||'{}')||{}}catch(e){};
function updateBasket(){const box=document.getElementById('basketItems');box.replaceChildren();let total=0,qty=0;for(const [key,n] of Object.entries(basket)){const [cat,i]=JSON.parse(key);const item=menu[cat]?.[i];if(!item||n<=0)continue;total+=item.price*n;qty+=n;const row=document.createElement('div');row.className='basket-row';const title=document.createElement('strong');title.textContent=item.name+' · '+money(item.price*n);row.append(title);for(const delta of [-1,1]){const b=document.createElement('button');b.type='button';b.textContent=delta<0?'−':'+';b.setAttribute('aria-label',(delta<0?'Remove one ':'Add one ')+item.name);b.onclick=()=>{basket[key]=(basket[key]||0)+delta;if(basket[key]<=0)delete basket[key];updateBasket()};if(delta===1)row.append(document.createTextNode(String(n)));row.append(b)}box.append(row)}if(!qty)box.textContent='Your basket is empty.';document.getElementById('basketCount').textContent=qty;document.getElementById('basketTotal').textContent=money(total);localStorage.setItem('hoxton-basket',JSON.stringify(basket));document.getElementById('orderPreview').hidden=true;}
grid.addEventListener('click',e=>{const b=e.target.closest('[data-add]');if(!b)return;const key=JSON.stringify([b.dataset.cat,Number(b.closest("article").querySelector("select")?.value ?? b.dataset.add)]);basket[key]=(basket[key]||0)+1;updateBasket()});
document.getElementById('checkoutForm').addEventListener('submit',e=>{e.preventDefault();const preview=document.getElementById('orderPreview');const items=Object.entries(basket).map(([key,n])=>{const [cat,i]=JSON.parse(key);return n+' × '+menu[cat][i].name});preview.textContent=items.length?'ORDER PREVIEW — NOT SENT\n'+document.getElementById('orderType').value+'\n'+items.join('\n')+'\nSubtotal: '+document.getElementById('basketTotal').textContent+'\nNotes: '+document.getElementById('orderNotes').value+'\nDelivery fees and availability not confirmed.':'Add an item first.';preview.hidden=false});updateBasket();
