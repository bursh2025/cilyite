const {chromium}=require(process.env.TEMP+'/gallery-qa/node_modules/playwright-core');
(async()=>{const b=await chromium.launch({executablePath:process.env.LOCALAPPDATA+'/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-win64/chrome-headless-shell.exe'});try{
const p=await b.newPage({viewport:{width:1440,height:960}});
for(const [slug,id] of [['siluet','plan'],['kulman-1-4','photos']]){
await p.goto('http://localhost:3100/obekty/'+slug+'/');
await p.waitForLoadState('networkidle');
const g=p.locator('#'+id+' .property-carousel');const first=g.locator('.photo-cell').first();await first.scrollIntoViewIfNeeded();
const r=await first.boundingBox(),x=r.x+r.width*.68,y=r.y+r.height*.5;
console.log(r,await p.evaluate(([x,y])=>document.elementFromPoint(x,y)?.outerHTML.slice(0,130),[x,y]));
await p.mouse.move(x,y);await p.mouse.down();await p.mouse.move(x-130,y,{steps:12});await p.mouse.up();
await g.locator('.carousel-bottom [aria-live]').filter({hasText:'2 /'}).waitFor();
await g.locator('.photo-cell[tabindex="0"]').first().click();const dialog=g.locator('dialog[open]');await dialog.waitFor();
if(id==='photos'){await dialog.getByRole('button',{name:'Оригинал снимка'}).click();
const img=dialog.locator('.photo-cell[tabindex="0"] img');await img.evaluate(i=>i.decode());if(!/original-/.test(await img.getAttribute('src')))throw Error('original');
await dialog.getByRole('button',{name:'Оригинал снимка'}).click();if(!/facade-/.test(await img.getAttribute('src')))throw Error('processed');}
await p.keyboard.press('Escape');console.log(slug+' OK');}
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
