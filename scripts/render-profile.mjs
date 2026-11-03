// Original Upfloor artwork; no external images, fonts, packages, or services.
// Edit the palette/copy here, then run: node scripts/render-profile.mjs
import { mkdir, writeFile } from 'node:fs/promises';

const out = new URL('../assets/', import.meta.url);
await mkdir(out, { recursive: true });
const c = { bg: '#0c151c', panel: '#101e27', line: '#29414b', ink: '#edf4ee', muted: '#9eb1b5', teal: '#65dfcf', amber: '#ffc16e' };
const esc = s => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
const rect = (x,y,w,h,fill,extra='') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" ${extra}/>`;
const line = (x,y,w) => `<path d="M${x} ${y}H${w}" stroke="${c.line}"/>`;
const text = (x,y,value,size=18,fill=c.ink,extra='') => `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" ${extra}>${esc(value)}</text>`;
const mono = 'font-family="Consolas, monospace"';
function svg(w,h,title,body,defs='') {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="title desc">
<title id="title">${esc(title)}</title><desc id="desc">Original Upfloor nightshift artwork in teal and amber.</desc>
<defs>${defs}<pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="#89b5b7" stroke-opacity=".045"/></pattern></defs>
<style>.signal{animation:breathe 4s ease-in-out infinite}.window{animation:breathe 7s ease-in-out infinite}.cursor{animation:blink 1.5s steps(2,end) infinite}@keyframes breathe{50%{opacity:.4}}@keyframes blink{50%{opacity:0}}@media(prefers-reduced-motion:reduce){.signal,.window,.cursor{animation:none}}</style>
<g font-family="Arial, Helvetica, sans-serif">${body}</g></svg>\n`;
}
function shell(w,h) {
  return rect(1,1,w-2,h-2,c.bg,`rx="16" stroke="${c.line}"`) + rect(2,2,w-4,h-4,'url(#grid)','rx="15"');
}

// Decorative skyline: these buildings do not represent contribution statistics.
function city() {
  let s = '<circle cx="306" cy="164" r="110" fill="url(#moon)"/>';
  for (let i=0;i<13;i++) s += rect(190,118+i*12,232,3,c.bg,'opacity=".5"');
  const buildings = [[12,260,62,140],[80,218,54,182],[140,281,52,119],[198,183,64,217],[270,232,48,168],[325,267,72,133],[405,211,57,189]];
  for (const [i,[x,y,w,h]] of buildings.entries()) {
    s += rect(x,y,w,h,i%2?'#1b303a':'#142731') + rect(x,y,w,3,'#355461');
    for(let row=0;row<Math.floor((h-14)/17);row++) for(let col=0;col<Math.floor((w-12)/13);col++) {
      if((row*7+col*3+i*2)%5<2) continue;
      s += rect(x+8+col*13,y+12+row*17,5,7,(row+col+i)%4===0?c.amber:c.teal,`opacity="${(row+col)%3===0?'.8':'.25'}"`);
    }
  }
  // Pixel-grid silhouette of Taichung's bamboo-shoot tower, matching the skyline.
  // Shape reference: https://www.aedas.com/en/project/national-trade-center/
  const ntc='M292 368V336H296V304H300V276H304V248H312V220H320V196H328V172H336V152H344V136H352V120H360V108H364V100H368V104H372V108H376V116H380V128H384V144H388V164H392V192H396V236H400V296H404V368Z';
  s += `<g shape-rendering="crispEdges"><defs><clipPath id="ntc"><path d="${ntc}"/></clipPath></defs>`;
  s += `<path d="${ntc}" fill="#1b303a" stroke="#355461" stroke-width="2"/>`;
  s += '<g clip-path="url(#ntc)">';
  for(let row=0;row<16;row++) {
    const y=116+row*16;
    for(let x=292;x<408;x+=8) {
      const step=x<328?8:x<360?4:0;
      s += rect(x,y+step,8,2,c.amber,'opacity=".6"');
    }
    for(let col=0;col<8;col++) {
      if((row*7+col*3)%5<2) continue;
      s += rect(300+col*13,y+5,5,7,(row+col)%4===0?c.amber:c.teal,`opacity="${(row+col)%3===0?'.65':'.25'}"`);
    }
  }
  s += '</g></g>';
  s += rect(225,213,22,66,'#10252e','rx="2"');
  for(let i=0;i<3;i++) s += rect(230,222+i*19,12,10,c.amber,`opacity="${1-i*.2}"`);
  s += '<path d="M102 218V187m-16 5h31m-25 9h19" stroke="#718c90" fill="none"/>';
  s += rect(0,367,478,50,'#091119') + rect(0,367,478,3,c.teal,'opacity=".65"');
  s += `<g transform="translate(363 319) scale(3)" shape-rendering="crispEdges"><path d="M0 4V0h3v3h5V0h3v4h2v7h-2v5H1v-4h-3V7h2Z" fill="${c.amber}"/><path d="M11 14h6v-5h3v8h-9Z" fill="${c.amber}"/>${rect(1,6,2,2,c.bg)}${rect(8,6,2,2,c.bg)}${rect(4,9,2,1,'#b8794e')}</g>`;
  s += '<g stroke="#b5dee0" opacity=".14"><path d="M37 115v20m24 32v12m99-70v19m-10 53v13m275-88v20m-12 35v14M287 69v15m-177 3v19"/></g>';
  return s;
}
const moon = '<linearGradient id="moon" x2="0" y2="1"><stop stop-color="#ffc16e" stop-opacity=".3"/><stop offset="1" stop-color="#ffc16e" stop-opacity="0"/></linearGradient>';
function hero(mobile) {
  const w=mobile?600:1080,h=mobile?830:548;
  let s=shell(w,h)+rect(24,24,7,7,c.amber)+rect(37,24,7,7,c.teal,'opacity=".55"');
  s+=text(58,32,'UPFLOOR / NIGHTSHIFT',mobile?17:15,c.muted,mono)+text(w-28,32,'01',15,c.amber,`${mono} text-anchor="end"`)+line(24,51,w-24);
  const y=mobile?94:114;
  s+=text(40,y,'FRONTEND × AI TOOLS',mobile?19:17,c.teal,`${mono} letter-spacing="2"`);
  s+=text(35,y+(mobile?86:98),'UPFLOOR',mobile?83:92,c.ink,'font-weight="800" letter-spacing="-5"');
  s+=rect(40,y+(mobile?107:122),46,4,c.amber);
  s+=text(40,y+(mobile?150:170),'Small tools.',mobile?31:36,c.ink,'font-weight="600"')+text(40,y+(mobile?190:214),'Better workflows.',mobile?31:36,c.ink,'font-weight="600"');
  if(mobile) {
    s+=`<g transform="translate(54 330) scale(1.05)">${city()}</g>`;
    s+=text(40,786,'TAIWAN / UTC+08',17,c.muted,mono)+text(560,786,'KEEP BUILDING ↑',17,c.amber,`${mono} text-anchor="end"`);
  } else {
    s+=`<g transform="translate(575 70)">${city()}</g>`;
    s+=text(40,412,'> interfaces, agents, everyday ideas',17,c.muted,mono)+text(40,443,'> one floor up',17,c.amber,mono)+rect(199,428,9,19,c.amber,'class="cursor"');
    s+=text(1040,105,'夜 航 工 作 站',17,c.muted,'text-anchor="end" font-family="sans-serif"')+line(24,488,1056);
    s+=`<circle cx="43" cy="516" r="4" fill="${c.teal}" class="signal"/>`;
    s+=text(57,521,'CURIOUS BY DEFAULT',14,c.muted,mono)+text(1040,521,'TAIWAN / UTC+08   ·   FLOOR 01 ↑',14,c.muted,`${mono} text-anchor="end"`);
  }
  return svg(w,h,'Upfloor — Frontend developer & AI tool builder',s,moon);
}

function icon(type,accent) {
  let s=rect(0,0,88,88,c.panel,`rx="10" stroke="${c.line}"`);
  const paths={
    memory:'M24 21h30l10 10v36H24Z M54 21v12h10M33 44h22m-22 9h22m-22 9h13',
    keyboard:'M15 27h58v36H15Z M23 36h5m7 0h5m7 0h5m7 0h5M23 45h5m7 0h5m7 0h5m7 0h5M26 54h35',
    kart:'M19 52h50l-7-17H29Z M25 35l5-10h22l8 10 M31 28h21 M34 35v17m-15-8h50 M24 53v10m40-10v10',
    chart:'M20 20v48h50 M28 53l12-13 10 5 17-19 M56 26h11v11',
    plugin:'M24 36h11v-8a9 9 0 0 1 18 0v8h11v28H24Z M35 64v8m18-8v8',
  };
  if(type==='pet') return s+`<g transform="translate(21 24) scale(3)" shape-rendering="crispEdges"><path d="M0 4V0h3v3h5V0h3v4h2v7h-2v4H1v-4h-3V7h2Z" fill="${accent}"/>${rect(1,6,2,2,c.bg)}${rect(8,6,2,2,c.bg)}${rect(4,10,2,1,c.bg)}</g>`;
  return s+`<path d="${paths[type]}" fill="none" stroke="${accent}" stroke-width="3" stroke-linejoin="round"/>`;
}
const projects=[
  {file:'squirrel',repo:'Squirrel',name:'Squirrel',label:'INPUT',icon:'keyboard',accent:c.teal,
    desktop:'Traditional Chinese input, simplified setup, and a personal touch.',
    mobile:['Rime · Traditional Chinese input'],tags:'RIME  /  TRADITIONAL CHINESE'},
  {file:'mario-kart',repo:'MarioKartWorldParams',name:'Mario Kart World Params',label:'PLAY',icon:'kart',accent:c.amber,
    desktop:'A reference web app for Mario Kart World players.',
    mobile:['Mario Kart World reference'],tags:'WEB APP  /  GAME REFERENCE'},
  {file:'lucky50',repo:'Lucky50',name:'Lucky50',label:'FINANCE',icon:'chart',accent:c.teal,
    desktop:'A dashboard for exploring 0050 ETF investment insights.',
    mobile:['0050 ETF dashboard'],tags:'0050 ETF  /  DASHBOARD'},
  {file:'agent-pets',repo:'agent-pets',name:'Agent Pets',label:'COMPANION',icon:'pet',accent:c.amber,
    desktop:'A desktop companion that shows what your AI coding agents are doing.',
    mobile:['AI agent desktop companion'],tags:'DESKTOP  /  AI AGENTS'},
  {file:'work-intelligence',repo:'WorkLog.Ai',name:'Work Intelligence',label:'MEMORY',icon:'memory',accent:c.teal,
    desktop:'Local-first work memory. Sessions, decisions, and reports in one place.',
    mobile:['Local-first work memory'],tags:'LOCAL-FIRST  /  DEVELOPER TOOLS'},
  {file:'pet-plugins',repo:'agent-pets-plugins',name:'Agent Pets Plugins',label:'EXTEND',icon:'plugin',accent:c.amber,
    desktop:'The online plugin catalog for Agent Pets.',
    mobile:['Agent Pets plugin catalog'],tags:'PLUGINS  /  AGENT PETS'},
];
function card(p,mobile,index) {
  const w=mobile?600:1080,h=mobile?108:82,n=String(index+1).padStart(2,'0');
  let s=shell(w,h)+rect(1,14,3,h-28,p.accent);
  if(mobile) {
    s+=`<g transform="translate(20 30) scale(.55)">${icon(p.icon,p.accent)}</g>`;
    s+=text(88,35,p.name,p.name.length>20?26:28,c.ink,'font-weight="700"');
    s+=text(88,77,p.mobile[0],22,c.muted)+text(574,36,'↗',24,p.accent,'text-anchor="end"');
  } else {
    s+=`<g transform="translate(24 17) scale(.55)">${icon(p.icon,p.accent)}</g>`;
    s+=text(94,31,p.name,26,c.ink,'font-weight="700"')+text(94,62,p.desktop,18,c.muted);
    s+=text(1048,30,`${n} ↗`,17,p.accent,`${mono} text-anchor="end"`);
  }
  return svg(w,h,`${p.name}: ${p.desktop}`,s);
}
function footer(mobile) {
  const w=mobile?600:1080,h=mobile?210:136;
  let s=shell(w,h)+`<g transform="translate(${mobile?29:32} ${mobile?36:39})">${rect(0,36,12,20,c.amber)}${rect(16,24,12,32,c.amber)}${rect(32,12,12,44,c.amber)}${rect(48,0,12,56,c.amber)}</g>`;
  s+=text(mobile?116:122,mobile?61:60,'Always a learner.',mobile?28:25,c.ink,'font-weight="600"')+text(mobile?116:122,mobile?100:94,'Always one floor up.',mobile?28:25,c.amber,'font-weight="600"');
  s+=text(mobile?30:1048,mobile?174:76,'UPFLOOR / PONPON55837',mobile?17:14,c.muted,`${mono} ${mobile?'':'text-anchor="end"'}`);
  return svg(w,h,'Always a learner. Always one floor up.',s);
}
const files=[['nightshift.svg',hero(false)],['nightshift-mobile.svg',hero(true)],['next-floor.svg',footer(false)],['next-floor-mobile.svg',footer(true)],
  ...projects.flatMap((p,i)=>[[`${p.file}.svg`,card(p,false,i)],[`${p.file}-mobile.svg`,card(p,true,i)]])];
for(const [name,content] of files) await writeFile(new URL(name,out),content);
console.log(`Rendered ${files.length} original profile assets.`);
