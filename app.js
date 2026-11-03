const demos={
 input:`<div class="demo-stage"><div class="demo-panel wide"><small>INBOX / 12 ITEMS</small><h4>自動接收與分類新資料</h4><p>信件、表單、文件或系統資料進入後，先依內容判斷類型與優先級。</p><div class="demo-lines"><i></i><i></i><i></i></div></div><div class="demo-panel"><small>分類完成</small><h4>客戶需求</h4><div class="demo-meter"><i style="width:92%"></i></div></div><div class="demo-panel"><small>需要人工確認</small><h4>例外案件</h4><div class="demo-meter"><i style="width:24%;background:#ff7548"></i></div></div></div>`,
 think:`<div class="demo-stage"><div class="demo-panel"><small>AI PROCESSING</small><h4>理解內容</h4><p>擷取關鍵欄位、比對企業知識並套用規則。</p><div class="demo-meter"><i style="width:86%"></i></div></div><div class="demo-panel"><small>KNOWLEDGE</small><h4>查找來源</h4><p>回傳參考文件與版本，避免只給無來源答案。</p><div class="demo-meter"><i style="width:74%"></i></div></div><div class="demo-panel wide"><small>DRAFT READY</small><h4>產生可編輯的處理草稿</h4><div class="demo-lines"><i></i><i></i><i></i></div></div></div>`,
 review:`<div class="demo-stage"><div class="demo-panel wide"><small>HUMAN IN THE LOOP</small><h4>重要結果由人員確認</h4><p>在送出、寫入或執行前，保留人工審核節點。系統標示 AI 建議、引用來源與需注意事項。</p></div><div class="demo-panel"><small>建議動作</small><h4>核准並執行</h4><div class="demo-meter"><i style="width:100%"></i></div></div><div class="demo-panel"><small>替代動作</small><h4>退回修改</h4><div class="demo-meter"><i style="width:42%;background:#ff7548"></i></div></div></div>`,
 sync:`<div class="demo-stage"><div class="demo-panel"><small>SYSTEM UPDATE</small><h4>回寫既有系統</h4><p>將確認結果更新至 CRM、表單、資料庫或指定工具。</p><div class="demo-meter"><i style="width:100%"></i></div></div><div class="demo-panel"><small>NOTIFICATION</small><h4>通知負責人</h4><p>成功、失敗與例外狀態皆有明確通知。</p><div class="demo-meter"><i style="width:100%"></i></div></div><div class="demo-panel wide"><small>AUDIT LOG</small><h4>完整保留執行紀錄</h4><div class="demo-lines"><i></i><i></i><i></i></div></div></div>`
};
const demoContent=document.querySelector('#demo-content');if(demoContent)demoContent.innerHTML=demos.input;
document.querySelectorAll('[data-demo]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-demo]').forEach(b=>b.classList.remove('active'));button.classList.add('active');demoContent.innerHTML=demos[button.dataset.demo]}));
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
const form=document.querySelector('#intake-form'),summaryCard=document.querySelector('#summary-card'),summaryText=document.querySelector('#summary-text');
function buildSummary(){const date=new Intl.DateTimeFormat('zh-TW',{dateStyle:'long'}).format(new Date());return`企業 AI 流程健檢摘要\n建立日期：${date}\n優惠方案：限時免費企業健檢\n\n一、想盤點的流程\n${document.querySelector('#need').value}\n\n二、目前主要卡點\n${document.querySelector('#pain').value}\n\n三、預計使用規模\n${document.querySelector('#team').value}\n\n四、希望開始時間\n${document.querySelector('#timing').value}\n\n健檢前準備\n1. 指定一位熟悉流程的窗口\n2. 準備實際紙本、表單或資料範例\n3. 列出流程的開始、處理與完成方式\n4. 標記最常等待、重做或人工搬資料的環節\n\n預期健檢輸出\n・流程卡點圖\n・優化優先順序\n・自動化與 AI 可行性建議`}
const MAIL_TO='toget300@gmail.com',formStatus=document.querySelector('#form-status');
function contactBlock(){const v=id=>document.querySelector(id).value.trim()||'（未填）';return`聯絡人：${v('#c-name')}
公司／單位：${v('#c-company')}
Email：${v('#c-email')}
電話或 LINE：${v('#c-phone')}

需求說明：
${v('#c-message')}

`}
form.addEventListener('submit',async e=>{e.preventDefault();if(document.querySelector('#c-honey').value)return;const button=form.querySelector('button[type=submit]'),text=contactBlock()+buildSummary();summaryText.textContent=buildSummary();button.disabled=true;formStatus.textContent='送出中…';
 try{const res=await fetch('https://formsubmit.co/ajax/'+MAIL_TO,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({_subject:'【順流官網】新的需求諮詢：'+document.querySelector('#c-name').value.trim(),_template:'box',_replyto:document.querySelector('#c-email').value.trim(),姓名:document.querySelector('#c-name').value.trim(),公司:document.querySelector('#c-company').value.trim(),Email:document.querySelector('#c-email').value.trim(),電話或LINE:document.querySelector('#c-phone').value.trim(),需求說明:document.querySelector('#c-message').value.trim(),健檢摘要:text})});const data=await res.json();if(!res.ok||data.success==='false'||data.success===false)throw new Error(data.message||'send failed');
  formStatus.textContent='已送出！我們會在 1 個工作天內與你聯繫，下方是你的健檢準備清單。';form.reset();summaryCard.classList.add('show');summaryCard.scrollIntoView({behavior:'smooth',block:'center'})}
 catch(err){const href='mailto:'+MAIL_TO+'?subject='+encodeURIComponent('【順流官網】需求諮詢')+'&body='+encodeURIComponent(text);formStatus.innerHTML='自動送出失敗，請改用 <a href="'+href+'">寄信給我們</a>（內容已帶入），或直接寄到 '+MAIL_TO+'。';summaryCard.classList.add('show')}
 finally{button.disabled=false}});
document.querySelector('#close-summary').addEventListener('click',()=>summaryCard.classList.remove('show'));
const toast=document.querySelector('#toast');function showToast(message){toast.textContent=message;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),1800)}
document.querySelector('#copy-summary').addEventListener('click',async()=>{await navigator.clipboard.writeText(summaryText.textContent);showToast('需求摘要已複製')});
document.querySelector('#download-summary').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([summaryText.textContent],{type:'text/plain;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download='企業AI流程健檢摘要.txt';a.click();URL.revokeObjectURL(url);showToast('健檢摘要已下載')});
document.querySelectorAll('details').forEach(item=>item.addEventListener('toggle',()=>{if(item.open)document.querySelectorAll('details').forEach(other=>{if(other!==item)other.open=false})}));
const menu=document.querySelector('.menu-button'),nav=document.querySelector('.site-header nav');menu.addEventListener('click',()=>{const open=nav.classList.toggle('mobile-open');if(open){Object.assign(nav.style,{display:'grid',position:'absolute',top:'65px',left:'0',right:'0',padding:'20px',background:'#f2f2ec',borderBottom:'1px solid #d7d9d2'})}else nav.removeAttribute('style')});
document.querySelector('#year').textContent=new Date().getFullYear();
