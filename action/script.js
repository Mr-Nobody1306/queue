
(function(){
  const CAPACITY = 8;
  let queue = [
    {id:101, rider:"Ama Serwaa", pickup:"Airport", dropoff:"Osu"},
    {id:102, rider:"Kwame Mensah", pickup:"Legon", dropoff:"Makola"},
    {id:103, rider:"Auntie Efya", pickup:"Tema", dropoff:"Airport"},
    {id:104, rider:"Yaw Darko", pickup:"Osu", dropoff:"Legon"},
    {id:105, rider:"Mama Akos", pickup:"Makola", dropoff:"Tema"},
  ];
  let nextId = 106, served = 0, trips = [], flashId = -1, toastT = null;
  const ICON_X = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
  const ICON_PIN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>';
  const ICON_CLOCK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>';
  const ICON_CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
  const listCtn=document.getElementById('queueListCtn');
  const tripsCtn=document.getElementById('tripsCtn');
  const toastEl=document.getElementById('toastEl');
  const $=id=>document.getElementById(id);
  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
  function hue(id){return (id*47)%360;}
  function toast(msg){
    toastEl.textContent=msg; toastEl.classList.add('show');
    clearTimeout(toastT); toastT=setTimeout(()=>toastEl.classList.remove('show'),2200);
  }
  function render(){
    if(queue.length){
      $('nextNameEl').textContent='#'+queue[0].id+' '+queue[0].rider;
      $('nextRouteEl').textContent=queue[0].pickup+' → '+queue[0].dropoff;
    } else {
      $('nextNameEl').textContent='No riders waiting';
      $('nextRouteEl').textContent='queue empty — request a ride';
    }
    tripsCtn.innerHTML='';
    if(!trips.length){ tripsCtn.innerHTML='<div class="emptyNote">No active trips — dispatch the front rider.</div>'; }
    trips.forEach((t,ti)=>{
      const r=document.createElement('div'); r.className='tripRow';
      r.innerHTML='<svg class="car" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:19px;height:19px;color:#047857;flex-shrink:0"><path d="M5 11l1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11"/><rect x="3" y="11" width="18" height="6" rx="2"/><circle cx="7.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/></svg><b>'+esc(t.rider)+' · '+esc(t.driver)+'</b><button class="doneBtn">'+ICON_CHECK+'Done</button>';
      r.querySelector('.doneBtn').onclick=()=>{ trips.splice(ti,1); served++; toast('Trip complete — '+served+' served'); render(); };
      tripsCtn.appendChild(r);
    });
    $('tripCntEl').textContent=trips.length;
    $('waitCntEl').textContent=queue.length;
    listCtn.innerHTML='';
    queue.forEach((r,k)=>{
      const row=document.createElement('div'); row.className='qRow'+(r.id===flashId?' flash':'');
      const h=hue(r.id), initial=(r.rider.trim()[0]||'?').toUpperCase();
      row.innerHTML='<span class="posBadge'+(k===0?' front':'')+'">'+(k===0?'#1 FRONT':'#'+(k+1))+'</span><div class="avatar" style="background:linear-gradient(135deg,hsl('+h+',70%,55%),hsl('+((h+40)%360)+',70%,45%))">'+esc(initial)+'</div><div class="qInfo"><b>#'+r.id+' '+esc(r.rider)+'</b><span>'+ICON_PIN+esc(r.pickup)+' → '+esc(r.dropoff)+'</span></div><span class="eta">'+ICON_CLOCK+(k*3)+' min</span><button class="delBtn" title="Cancel booking">'+ICON_X+'</button>';
      row.querySelector('.delBtn').onclick=()=>{
        const gone=queue[k];
        for(let i=k;i+1<queue.length;++i) queue[i]=queue[i+1];
        queue.pop();
        toast('Booking cancelled'); render();
      };
      listCtn.appendChild(row);
    });
    if(!queue.length) listCtn.innerHTML='<div class="emptyNote">Line is empty — FIFO idle.</div>';
    flashId=-1;
    $('countEl').textContent=queue.length+' / '+CAPACITY+' • FIFO dispatch queue';
    const fill=$('loadFillEl'); fill.style.width=Math.round(queue.length/CAPACITY*100)+'%';
    fill.style.background=queue.length>=CAPACITY?'#ef4444':(queue.length>=6?'#f59e0b':'#22c55e');
  }
  function openRequest(){ $('sheetMsgEl').textContent=''; $('addSheetCtn').hidden=false; setTimeout(()=>$('nameInput').focus(),50); }
  $('tabQueueBtn').onclick=()=>{ document.getElementById('boardCtn').scrollTo({top:0,behavior:'smooth'}); };
  $('tabAddBtn').onclick=openRequest;
  $('reqBtn2').onclick=openRequest;
  $('cancelSheetBtn').onclick=()=>{$('addSheetCtn').hidden=true;};
  $('saveRideBtn').onclick=()=>{
    const nm=$('nameInput').value.trim(), pk=$('pickupInput').value.trim()||'Downtown', dp=$('dropoffInput').value.trim()||'Airport';
    if(!nm){$('sheetMsgEl').textContent='rider name required';return;}
    if(queue.length>=CAPACITY){$('sheetMsgEl').textContent='Line full (8/8) — dispatch first'; toast('Line is full'); return;}
    queue.push({id:nextId++, rider:nm.slice(0,29), pickup:pk.slice(0,29), dropoff:dp.slice(0,29)});
    flashId=nextId-1;
    $('addSheetCtn').hidden=true; $('nameInput').value='';$('pickupInput').value='';$('dropoffInput').value='';
    toast('Ride requested — last in line'); render();
  };
  function dispatch(){
    if(!queue.length){ toast('No riders waiting'); return; }
    const r=queue.shift();
    const driver='Driver-'+((served+trips.length)%3+1);
    trips.push({id:r.id, rider:r.rider, driver});
    toast(r.rider+' → '+driver); render();
  }
  $('dispatchBtn').onclick=dispatch;
  $('tabDispatchBtn').onclick=dispatch;
  async function getCpp(){
    if(typeof EMBEDDED_CPP==='string'&&EMBEDDED_CPP.includes('int main'))return EMBEDDED_CPP;
    for(const u of ['src/ridequeue.cpp','ridequeue.cpp']){try{const r=await fetch(u);if(r.ok){const t=await r.text();if(t.includes('int main'))return t;}}catch(e){}}
    return '';
  }
  function openPdf(){
    (async()=>{
      for(const u of ['src/ridequeue-guide.pdf','ridequeue-guide.pdf']){try{const r=await fetch(u,{method:'HEAD'});if(r.ok){window.open(u,'_blank');return;}}catch(e){}}
      window.open('src/ridequeue-guide.pdf','_blank');
    })();
  }
  $('pdfBtn').onclick=openPdf;
  $('cppBtn').onclick=async()=>{const t=await getCpp();if(!t){toast('C++ not loaded');return;}const b=new Blob([t],{type:'text/x-c++src'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='ridequeue.cpp';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),2000);};
  render();
})();