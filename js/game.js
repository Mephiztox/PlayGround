import { portraitSVG, HAIR_COLORS, EYE_COLORS, OUTFIT_COLORS, HAIR_STYLES, OUTFITS, ACCESSORIES } from './portraits.js';

const SAVE_KEY = 'sakura-house-save-v1';
const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const seedResidents = [
  { id: 'aiko', name: 'Aiko', age: 22, role: 'The cheerful cook', tagline: 'A warm smile, and something delicious.', bio: 'A bright-hearted home cook who believes every problem feels smaller after a good meal. She loves trying new recipes with you.', style: { hairStyle: 'twintails', hairColor: 'strawberry', eyeColor: 'ruby', outfitColor: 'navy', outfit: 'sailor', accessory: 'ribbon' }, affection: 28, mood: 78, energy: 83, comfort: 72, messages: [{ from: 'her', text: 'Good morning! I made extra pancakes in case you were hungry. Want to help me pick tonight’s dessert?', time: '8:12 AM' }] },
  { id: 'miyu', name: 'Miyu', age: 23, role: 'Your thoughtful planner', tagline: 'A little plan can make room for joy.', bio: 'Gentle and organized, Miyu is happiest when the household is running smoothly. She always remembers to leave room for a spontaneous treat.', style: { hairStyle: 'long', hairColor: 'sakura', eyeColor: 'emerald', outfitColor: 'cream', outfit: 'dress', accessory: 'flower' }, affection: 18, mood: 67, energy: 64, comfort: 79, messages: [{ from: 'her', text: 'I put together a small plan for the day, but there’s plenty of room to change it. How are you feeling?', time: '8:20 AM' }] },
  { id: 'rin', name: 'Rin', age: 21, role: 'The quiet night owl', tagline: 'Soft music, honest words, no rush.', bio: 'A creative soul who likes peaceful evenings and meaningful conversations. She may be reserved at first, but she notices the little things.', style: { hairStyle: 'long', hairColor: 'midnight', eyeColor: 'violet', outfitColor: 'charcoal', outfit: 'hoodie', accessory: 'clip' }, affection: 22, mood: 61, energy: 54, comfort: 68, messages: [{ from: 'her', text: 'I saved you a seat by the window. The rain sounds nice today, doesn’t it?', time: '8:34 AM' }] },
];
const tasks = [
  { id: 'breakfast', time: '8:00 AM', icon: '🥞', title: 'Share a slow breakfast', detail: 'Start the day around the kitchen table.', reward: '+4 closeness', resident: 'aiko', delta: { mood: 8, comfort: 5, energy: 3 } },
  { id: 'checkin', time: '10:30 AM', icon: '💌', title: 'Check in with a housemate', detail: 'A few kind words can go a long way.', reward: '+5 closeness', resident: 'miyu', delta: { mood: 7, comfort: 8 } },
  { id: 'chores', time: '1:00 PM', icon: '🧺', title: 'Tidy up together', detail: 'Make the shared spaces feel welcoming.', reward: '+3 comfort', resident: 'rin', delta: { comfort: 12, mood: 4 } },
  { id: 'tea', time: '4:00 PM', icon: '🍵', title: 'Take a proper tea break', detail: 'Pause, breathe, and enjoy a little treat.', reward: '+4 energy', resident: 'miyu', delta: { energy: 12, mood: 5 } },
  { id: 'evening', time: '7:30 PM', icon: '🌙', title: 'Wind down together', detail: 'Choose a cozy activity for tonight.', reward: '+5 closeness', resident: 'rin', delta: { mood: 9, comfort: 5, energy: 4 } },
];

function freshState() {
  return { day: 1, coins: 24, residents: structuredClone(seedResidents), completed: [], activity: [{ icon: '☀️', text: 'A new week begins at Sakura House.', time: 'Today' }], lastSeen: Date.now(), settings: { sound: true } };
}
function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (!saved || !Array.isArray(saved.residents) || !saved.residents.length) return freshState();
    const state = { ...freshState(), ...saved };
    state.residents = state.residents.map(r => ({ ...r, age: Number(r.age) || 20, messages: Array.isArray(r.messages) ? r.messages : [], style: r.style || {} }));
    return state;
  } catch { return freshState(); }
}
let state = loadState();
let currentView = 'home';
let activeChatId = state.residents[0]?.id;
let modalCleanup = null;
let toastTimer;

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clamp = (n, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(n)));
const resident = id => state.residents.find(r => r.id === id) || state.residents[0];
const portrait = (r, opts = {}) => portraitSVG(r, { mood: r.mood, affection: r.affection, ...opts });
const dayName = () => DAYS[(state.day - 1) % DAYS.length];
function save() { state.lastSeen = Date.now(); localStorage.setItem(SAVE_KEY, JSON.stringify(state)); }
function addActivity(icon, text) { state.activity.unshift({ icon, text, time: `Day ${state.day}` }); state.activity = state.activity.slice(0, 8); }
function showToast(message) {
  const root = $('#toast-root'); root.innerHTML = `<div class="toast">${esc(message)}</div>`;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { root.innerHTML = ''; }, 2500);
}
function setView(view) {
  currentView = view;
  $$('.nav-link[data-view],.mobile-nav-btn[data-view]').forEach(b => b.classList.toggle('active', b.dataset.view === view));
  const labels = { home: 'Overview', chat: 'Heart to heart', residents: 'Housemates', day: 'Daily rhythm' };
  $('#crumb-title').textContent = labels[view] || 'Overview';
  render();
  if (view === 'chat') setTimeout(() => $('#chat-input')?.focus(), 50);
}
function updateChrome() {
  $('#top-day').textContent = `${dayName()} · DAY ${String(state.day).padStart(2, '0')}`;
  const list = $('#resident-list');
  list.innerHTML = state.residents.map(r => `<button class="resident-item ${activeChatId === r.id && currentView === 'chat' ? 'selected' : ''}" data-chat-to="${esc(r.id)}"><span class="resident-thumb">${portrait(r)}</span><span class="resident-info"><b>${esc(r.name)}</b><small>${esc(r.role)}</small></span><span class="resident-heart">♡</span></button>`).join('');
  $$('[data-chat-to]', list).forEach(btn => btn.addEventListener('click', () => openChat(btn.dataset.chatTo)));
}
function render() {
  updateChrome();
  const root = $('#view-container');
  if (currentView === 'chat') root.innerHTML = renderChat();
  else if (currentView === 'residents') root.innerHTML = renderResidents();
  else if (currentView === 'day') root.innerHTML = renderDay();
  else root.innerHTML = renderHome();
  bindView();
}
function bindView() {
  $$('[data-action]').forEach(btn => btn.addEventListener('click', () => handleAction(btn.dataset.action, btn.dataset.id)));
  $$('[data-chat-id]').forEach(btn => btn.addEventListener('click', () => openChat(btn.dataset.chatId)));
  $$('[data-chat-prompt]').forEach(btn => btn.addEventListener('click', () => sendMessage(btn.dataset.chatPrompt)));
  $('#chat-form')?.addEventListener('submit', event => { event.preventDefault(); const input = $('#chat-input'); sendMessage(input.value); });
  $('#chat-input')?.addEventListener('keydown', event => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); $('#chat-form').requestSubmit(); } });
  if ($('#message-list')) $('#message-list').scrollTop = $('#message-list').scrollHeight;
}

function renderHome() {
  const lead = resident('aiko') || state.residents[0];
  const done = state.completed.length;
  const needs = [
    { icon: '♡', label: 'Household harmony', hint: 'Everyone feeling at home', value: Math.round(state.residents.reduce((n, r) => n + r.comfort, 0) / state.residents.length) },
    { icon: '☼', label: 'Good energy', hint: 'A little rest goes a long way', value: Math.round(state.residents.reduce((n, r) => n + r.energy, 0) / state.residents.length) },
    { icon: '✧', label: 'Happy hearts', hint: 'Your connections are growing', value: Math.round(state.residents.reduce((n, r) => n + r.mood, 0) / state.residents.length) },
  ];
  const upcoming = tasks.filter(t => !state.completed.includes(t.id)).slice(0, 3);
  return `<section class="welcome-row"><div><div class="eyebrow">A PLACE TO CALL YOUR OWN</div><h1 class="page-title">Good morning, welcome home.</h1><p class="page-subtitle">Make a little room for connection, comfort, and the everyday things that matter.</p></div><div class="date-tag"><span>☼</span><span>${dayName().toLowerCase()}, day ${state.day}</span></div></section>
    <section class="hero-card"><div class="hero-orb"></div><span class="hero-sparkle">✦</span><div class="quick-stats"><span class="stat-chip">✧ <b>${state.coins}</b> petals</span><span class="stat-chip">♡ <b>${state.residents.length}</b> housemates</span></div><div class="hero-copy"><div class="hero-greeting">A little note from ${esc(lead.name)}</div><h2 class="hero-title">“Home feels brighter when we’re all together.”</h2><p class="hero-description">Take today at your own pace. Your housemates are here to share the little things with you.</p><div class="hero-actions"><button class="primary-btn" data-action="open-chat" data-id="${esc(lead.id)}">♡ &nbsp; Say hello</button><button class="secondary-btn" data-action="view-day">See today’s plans &nbsp; →</button></div></div><div class="hero-art">${portrait(lead, { expression: 'smile' })}</div></section>
    <div class="dashboard-grid"><section class="panel panel-pad"><div class="panel-head"><div><h2 class="panel-title">How everyone’s doing</h2><span class="panel-kicker">A gentle check-in, no pressure</span></div><button class="text-link" data-action="view-residents">Meet the housemates →</button></div><div class="needs-list">${needs.map(n => `<div class="need-row"><div class="need-icon">${n.icon}</div><div><span class="need-label">${n.label}</span><small class="need-hint">${n.hint}</small></div><div class="need-meter"><div class="meter-track"><div class="meter-fill" style="width:${n.value}%"></div></div><div class="meter-value">${n.value}%</div></div></div>`).join('')}</div></section>
    <section class="panel panel-pad"><div class="panel-head"><div><h2 class="panel-title">A few little things</h2><span class="panel-kicker">Your day, your way</span></div><button class="text-link" data-action="view-day">View all →</button></div><div class="task-list">${upcoming.length ? upcoming.map(t => `<div class="task-row"><span class="task-icon">${t.icon}</span><span class="task-copy"><b>${t.title}</b><small>${t.time} · with ${esc(resident(t.resident)?.name || 'everyone')}</small></span><span class="task-reward">${t.reward}</span></div>`).join('') : `<div class="empty-state" style="padding:16px">You’ve made space for everything today. Lovely work! 🌸</div>`}</div></section></div>
    <div class="overview-bottom"><section class="panel panel-pad"><div class="panel-head"><div><h2 class="panel-title">Your housemates</h2><span class="panel-kicker">${state.residents.length} lovely people, one cozy home</span></div><button class="text-link" data-action="view-residents">See all →</button></div><div class="housemates-grid">${state.residents.slice(0, 3).map(r => miniResidentCard(r)).join('')}</div></section>
    <section class="panel panel-pad"><div class="panel-head"><div><h2 class="panel-title">A note for you</h2><span class="panel-kicker">${state.activity[0]?.time || 'Today'}</span></div><button class="text-link" data-action="open-chat" data-id="${esc(lead.id)}">Messages →</button></div><div class="chat-mini"><div class="chat-mini-avatar">${portrait(lead)}</div><div><div class="chat-bubble">${esc(lead.messages.at(-1)?.text || 'I’m glad you’re home. Want to spend a little time together?')}</div><div class="chat-mini-meta">${esc(lead.name)} · Just now</div></div></div><div class="activity-list" style="margin-top:12px">${state.activity.slice(0, 2).map(a => `<div class="activity-item"><span class="activity-emoji">${a.icon}</span><div><div class="activity-text">${esc(a.text)}</div><div class="activity-time">${esc(a.time)}</div></div></div>`).join('')}</div></section></div>`;
}

const prompts = [
  { key: 'day', label: 'How was your day?', response: 'It’s been a little better now that we’ve had a chance to talk. Thanks for asking.' },
  { key: 'help', label: 'Need a hand with anything?', response: 'That’s sweet of you. I think a little company is all I need right now.' },
  { key: 'hobby', label: 'What do you like doing?', response: 'I like finding small things to look forward to—good food, a favorite song, and time with kind people.' },
];
function renderChat() {
  const r = resident(activeChatId);
  if (!r) return `<div class="empty-state">Invite a housemate to start a conversation.</div>`;
  const messages = r.messages || [];
  return `<section class="chat-layout"><aside class="chat-list-panel"><div class="chat-list-heading"><b>Conversations</b><small>Your housemates are always happy to hear from you.</small></div>${state.residents.map(person => `<button class="chat-person ${person.id === r.id ? 'active' : ''}" data-chat-to="${esc(person.id)}"><span class="chat-person-avatar">${portrait(person)}</span><span><b>${esc(person.name)}</b><small>${esc(person.role)}</small></span><i>♡</i></button>`).join('')}</aside><div class="chat-area"><header class="chat-header"><div class="chat-header-avatar">${portrait(r)}</div><div class="chat-header-copy"><b>${esc(r.name)}</b><small><i></i> Around the house · ${esc(r.role)}</small></div><button class="outline-btn chat-profile-btn" data-action="view-resident" data-id="${esc(r.id)}">View profile</button></header><div class="chat-note">A kind, unhurried conversation. Everyone’s boundaries matter. 🌷</div><div class="message-list" id="message-list">${messages.map(m => `<div class="message-row ${m.from === 'you' ? 'you' : 'them'}">${m.from !== 'you' ? `<span class="message-avatar">${portrait(r)}</span>` : ''}<div class="message-content"><div class="message-bubble">${esc(m.text)}</div><small>${esc(m.time || 'Today')}</small></div></div>`).join('')}</div><div class="suggested-prompts">${prompts.map(p => `<button data-chat-prompt="${p.key}">${p.label}</button>`).join('')}</div><form class="chat-compose-wrap" id="chat-form"><label class="sr-only" for="chat-input">Write a message</label><textarea id="chat-input" rows="1" maxlength="400" placeholder="Write a kind message…" required></textarea><button class="send-btn" type="submit" aria-label="Send message">➤</button></form></div></section>`;
}
function nowTime() { return new Intl.DateTimeFormat([], { hour: 'numeric', minute: '2-digit' }).format(new Date()); }
function sendMessage(text) {
  const r = resident(activeChatId);
  const message = String(text || '').trim();
  if (!r || !message) return;
  r.messages.push({ from: 'you', text: message.slice(0, 400), time: nowTime() });
  const reply = prompts.find(p => p.key === message)?.response || [
    'I’m glad you told me. It’s nice to share the little things with someone.',
    'That sounds lovely. Thanks for taking a moment to talk with me. What would you like to do next?',
    'I appreciate you checking in. Let’s make today a little gentler, one step at a time.',
  ][(r.messages.length + state.day) % 3];
  r.messages.push({ from: 'her', text: reply, time: nowTime() });
  r.affection = clamp(r.affection + 2); r.mood = clamp(r.mood + 2);
  state.coins += 1;
  addActivity('💌', `Shared a thoughtful conversation with ${r.name}.`);
  save(); render(); showToast(`A lovely moment with ${r.name} · +1 petal`);
}
function openChat(id) { activeChatId = id || state.residents[0]?.id; setView('chat'); }
function openModal(title, content, wide = false) {
  closeModal();
  const root = $('#modal-root');
  root.innerHTML = `<div class="modal-backdrop" data-modal-dismiss><section class="game-modal ${wide ? 'modal-wide' : ''}" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button class="modal-close" type="button" data-modal-close aria-label="Close">×</button><h2 id="modal-title">${esc(title)}</h2>${content}</section></div>`;
  const backdrop = $('.modal-backdrop', root);
  backdrop.addEventListener('click', event => { if (event.target === backdrop || event.target.closest('[data-modal-close]')) closeModal(); });
  modalCleanup = event => { if (event.key === 'Escape') closeModal(); };
  document.addEventListener('keydown', modalCleanup);
  root.querySelector('input,select,button')?.focus();
}
function closeModal() {
  if (modalCleanup) document.removeEventListener('keydown', modalCleanup);
  modalCleanup = null;
  $('#modal-root').innerHTML = '';
}
const optionsHTML = (items, selected) => items.map(item => `<option value="${esc(item.id)}" ${item.id === selected ? 'selected' : ''}>${esc(item.name)}</option>`).join('');
function customizeResident(id) {
  const r = resident(id);
  if (!r) return;
  const form = `<form id="customize-form" class="modal-form"><input type="hidden" name="id" value="${esc(r.id)}"><div class="customize-layout"><div class="customize-preview" id="customize-preview">${portrait(r)}</div><div class="customize-fields"><label>Name<input name="name" maxlength="24" value="${esc(r.name)}" required></label><div class="form-grid"><label>Hair style<select name="hairStyle">${optionsHTML(HAIR_STYLES, r.style.hairStyle)}</select></label><label>Hair color<select name="hairColor">${optionsHTML(HAIR_COLORS, r.style.hairColor)}</select></label><label>Eye color<select name="eyeColor">${optionsHTML(EYE_COLORS, r.style.eyeColor)}</select></label><label>Outfit<select name="outfit">${optionsHTML(OUTFITS, r.style.outfit)}</select></label><label>Outfit color<select name="outfitColor">${optionsHTML(OUTFIT_COLORS, r.style.outfitColor)}</select></label><label>Accessory<select name="accessory">${optionsHTML(ACCESSORIES, r.style.accessory)}</select></label></div><label>About her<textarea name="bio" rows="3" maxlength="180">${esc(r.bio || '')}</textarea></label><button class="primary-btn" type="submit">Save changes</button></div></div></form>`;
  openModal(`Make ${r.name} feel like herself`, form, true);
  const formEl = $('#customize-form');
  const updatePreview = () => { const data = new FormData(formEl); const copy = { ...r, name: data.get('name') || r.name, style: Object.fromEntries(['hairStyle','hairColor','eyeColor','outfit','outfitColor','accessory'].map(key => [key, data.get(key)])) }; $('#customize-preview').innerHTML = portrait(copy); };
  formEl.addEventListener('input', updatePreview); formEl.addEventListener('change', updatePreview);
  formEl.addEventListener('submit', event => { event.preventDefault(); const data = new FormData(formEl); r.name = String(data.get('name')).trim().slice(0, 24) || r.name; r.bio = String(data.get('bio')).trim(); r.style = Object.fromEntries(['hairStyle','hairColor','eyeColor','outfit','outfitColor','accessory'].map(key => [key, data.get(key)])); save(); closeModal(); render(); showToast(`${r.name}’s new look is saved.`); });
}
function inviteResident() {
  if (state.residents.length >= 8) { showToast('Your home is full for now.'); return; }
  const form = `<form id="invite-form" class="modal-form"><p class="panel-kicker">Create an adult housemate and choose her style. You can edit her details later.</p><div class="customize-layout"><div class="customize-preview" id="invite-preview">${portrait({name:'New friend',style:{hairStyle:'wavy',hairColor:'mint',eyeColor:'teal',outfitColor:'blush',outfit:'dress',accessory:'flower'}})}</div><div class="customize-fields"><div class="form-grid"><label>Name<input name="name" maxlength="24" placeholder="e.g. Hikari" required></label><label>Age<input name="age" type="number" min="20" max="99" value="22" required></label><label>Role<input name="role" maxlength="36" placeholder="A new friend" value="A new friend"></label><label>Hair style<select name="hairStyle">${optionsHTML(HAIR_STYLES, 'wavy')}</select></label><label>Hair color<select name="hairColor">${optionsHTML(HAIR_COLORS, 'mint')}</select></label><label>Eye color<select name="eyeColor">${optionsHTML(EYE_COLORS, 'teal')}</select></label><label>Outfit<select name="outfit">${optionsHTML(OUTFITS, 'dress')}</select></label><label>Outfit color<select name="outfitColor">${optionsHTML(OUTFIT_COLORS, 'blush')}</select></label><label>Accessory<select name="accessory">${optionsHTML(ACCESSORIES, 'flower')}</select></label></div><label>About her<textarea name="bio" maxlength="180" rows="2" placeholder="A little about her personality…"></textarea></label><button class="primary-btn" type="submit">Invite her home</button></div></div></form>`;
  openModal('Welcome a new housemate', form, true);
  const formEl = $('#invite-form');
  const updatePreview = () => { const data = new FormData(formEl); const person = { name: data.get('name') || 'New friend', style: Object.fromEntries(['hairStyle','hairColor','eyeColor','outfit','outfitColor','accessory'].map(key => [key, data.get(key)])) }; $('#invite-preview').innerHTML = portrait(person); };
  formEl.addEventListener('input', updatePreview); formEl.addEventListener('change', updatePreview);
  formEl.addEventListener('submit', event => { event.preventDefault(); const data = new FormData(formEl); const name = String(data.get('name')).trim().slice(0, 24); if (!name) return; const id = `friend-${Date.now()}`; state.residents.push({ id, name, age: clamp(Number(data.get('age')), 20, 99), role: String(data.get('role') || 'A new friend').slice(0, 36), tagline: 'A new chapter in a shared home.', bio: String(data.get('bio') || 'Looking forward to getting to know everyone.').slice(0, 180), style: Object.fromEntries(['hairStyle','hairColor','eyeColor','outfit','outfitColor','accessory'].map(key => [key, data.get(key)])), affection: 10, mood: 70, energy: 75, comfort: 65, messages: [{ from: 'her', text: 'Thank you for making me feel welcome. I’m looking forward to sharing this home with you.', time: nowTime() }] }); addActivity('🌸', `${name} moved into Sakura House.`); save(); closeModal(); render(); showToast(`${name} is home!`); });
}
function showSettings() {
  const content = `<div class="settings-content"><p>Progress is saved in this browser on this device.</p><div class="settings-row"><div><b>Petals</b><small>Your shared household activity earns petals.</small></div><strong>✧ ${state.coins}</strong></div><div class="settings-actions"><button class="outline-btn" type="button" data-settings="export">Download save</button><button class="outline-btn" type="button" data-settings="reset">Start fresh</button></div><p class="panel-kicker">Starting fresh erases this local save and cannot be undone.</p></div>`;
  openModal('House settings', content);
  $$('[data-settings]', $('#modal-root')).forEach(button => button.addEventListener('click', () => {
    if (button.dataset.settings === 'export') {
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'sakura-house-save.json'; link.click(); URL.revokeObjectURL(url); showToast('Your save file is ready.');
    } else openModal('Start a fresh home?', `<p>This will permanently replace your current save on this device.</p><div class="modal-actions"><button class="outline-btn" data-modal-close type="button">Keep playing</button><button class="primary-btn" id="confirm-reset" type="button">Start fresh</button></div>`);
    $('#confirm-reset')?.addEventListener('click', () => { localStorage.removeItem(SAVE_KEY); state = freshState(); activeChatId = state.residents[0].id; closeModal(); setView('home'); showToast('A fresh week begins at home.'); });
  }));
}
function handleAction(action, id) {
  if (action === 'open-chat') return openChat(id);
  if (action === 'view-day') return setView('day');
  if (action === 'view-residents') return setView('residents');
  if (action === 'add-resident') return inviteResident();
  if (action === 'customize') return customizeResident(id);
  if (action === 'view-resident') return setView('residents');
  if (action === 'complete-task') {
    const task = tasks.find(item => item.id === id); if (!task || state.completed.includes(id)) return;
    const r = resident(task.resident); state.completed.push(id); state.coins += 3;
    if (r) { r.affection = clamp(r.affection + (id === 'breakfast' || id === 'checkin' || id === 'evening' ? 4 : 1)); for (const [key, amount] of Object.entries(task.delta)) r[key] = clamp((r[key] || 0) + amount); }
    addActivity(task.icon, `${task.title}${r ? ` with ${r.name}` : ''}.`); save(); render(); showToast(`${task.title} · +3 petals`); return;
  }
  if (action === 'next-day') {
    if (!state.completed.length) { showToast('Take a moment together, or end the day whenever you like.'); }
    state.day += 1; state.completed = [];
    state.residents.forEach(r => { r.energy = clamp(r.energy + 16); r.mood = clamp(r.mood + 4); r.comfort = clamp(r.comfort + 2); });
    addActivity('🌙', `Day ${state.day - 1} comes to a gentle close. A new day begins.`); save(); render(); showToast(`Good morning · Day ${state.day}`); return;
  }
}

$$('.nav-link[data-view], .mobile-nav-btn[data-view]').forEach(button => button.addEventListener('click', () => setView(button.dataset.view)));
$('#add-resident').addEventListener('click', inviteResident);
$('#settings-btn').addEventListener('click', showSettings);
$('#top-chat').addEventListener('click', () => openChat(activeChatId));
$('#top-avatar')?.addEventListener('click', showSettings);
render();
function miniResidentCard(r) {
  return `<article class="girl-card"><button class="girl-portrait" style="border:0;width:100%;padding:0" data-chat-id="${esc(r.id)}">${portrait(r)}<span class="girl-status"><i></i> Around the house</span></button><div class="girl-card-copy"><div class="girl-card-top"><b>${esc(r.name)}</b><span class="girl-heart">♡ ${r.affection}</span></div><div class="girl-role">${esc(r.role)}</div><div class="girl-card-bottom"><span class="aff-track"><i style="width:${r.affection}%"></i></span><span class="aff-label">closeness</span></div></div></article>`;
}
function renderResidents() {
  return `<section class="residents-head"><div><div class="eyebrow">THE PEOPLE WHO MAKE IT HOME</div><h1 class="page-title">Your housemates</h1><p class="page-subtitle">Everyone here is an adult, with her own rhythm, hopes, and boundaries. Get to know each other one moment at a time.</p></div><button class="primary-btn" data-action="add-resident">＋ &nbsp; Invite someone</button></section><div class="residents-grid">${state.residents.map(r => `<article class="resident-large"><div class="resident-large-portrait">${portrait(r)}<span class="resident-large-badge">✦ ${esc(r.role)}</span></div><div class="resident-large-info"><div class="resident-name-line"><h3>${esc(r.name)}</h3><span class="resident-age">${r.age} · adult</span></div><p class="resident-tagline">${esc(r.tagline || 'A new friend in the house.')}</p><p class="resident-bio">${esc(r.bio || 'Looking forward to getting to know everyone.')}</p><div class="resident-stats">${[['Mood',r.mood],['Energy',r.energy],['Comfort',r.comfort],['Closeness',r.affection]].map(([label,value]) => `<div class="resident-stat"><label>${label}<span>${value}%</span></label><div class="meter-track"><div class="meter-fill" style="width:${value}%"></div></div></div>`).join('')}</div><div class="resident-actions"><button class="soft-btn" data-action="open-chat" data-id="${esc(r.id)}">♡ Talk together</button><button class="outline-btn" data-action="customize" data-id="${esc(r.id)}">✎ Customize</button></div></div></article>`).join('')}</div>`;
}
function renderDay() {
  const done = state.completed.length;
  return `<section class="welcome-row"><div><div class="eyebrow">A GENTLER KIND OF TO-DO LIST</div><h1 class="page-title">Your daily rhythm</h1><p class="page-subtitle">Small shared moments help the house feel like home. Skip anything you don’t feel like doing.</p></div><div class="date-tag"><span>☼</span><span>${dayName()} · Day ${state.day}</span></div></section><section class="day-banner"><div><h2>Today has room to breathe.</h2><p>${done} of ${tasks.length} moments shared · Earn petals and build closeness as you go.</p></div><span class="day-banner-icon">🌸</span></section><div class="schedule-grid"><section class="panel panel-pad"><div class="panel-head"><div><h2 class="panel-title">Today’s little moments</h2><span class="panel-kicker">Pick one whenever it feels right</span></div><span class="task-reward">✧ ${state.coins} petals</span></div><div class="schedule-list">${tasks.map(t => { const complete = state.completed.includes(t.id); const withName = resident(t.resident)?.name || 'everyone'; return `<div class="schedule-item ${complete ? 'done' : ''}"><span class="schedule-time">${t.time}</span><span class="schedule-line"><i class="schedule-dot"></i></span><span class="schedule-copy"><b>${t.icon} &nbsp; ${t.title}</b><small>${t.detail} · ${esc(withName)}</small></span>${complete ? '<span class="task-done">✓ Done</span>' : `<button class="schedule-action" data-action="complete-task" data-id="${t.id}">Share moment</button>`}</div>`; }).join('')}</div><div style="border-top:1px solid #f3edeb;padding-top:13px;margin-top:8px;display:flex;justify-content:space-between;align-items:center"><span class="panel-kicker">A new day resets the routine and restores a little energy.</span><button class="primary-btn" data-action="next-day">🌙 &nbsp; End the day</button></div></section><aside class="panel panel-pad"><div class="panel-head"><div><h2 class="panel-title">A quick check-in</h2><span class="panel-kicker">Who could use a little care?</span></div></div>${state.residents.map(r => `<div class="care-card"><div class="care-avatar">${portrait(r)}</div><div class="care-copy"><b>${esc(r.name)}</b><small>Mood ${r.mood}% · Energy ${r.energy}%</small></div><span class="care-badge">${r.mood < 45 ? 'A kind word?' : r.energy < 45 ? 'Could rest' : 'Doing well'}</span></div>`).join('')}<button class="soft-btn" style="width:100%;margin-top:14px" data-action="open-chat" data-id="${esc(state.residents[0]?.id || '')}">♡ Send a little encouragement</button></aside></div>`;
}
