
(function(){
  const toggle=document.querySelector('.menu-toggle');
  const menu=document.querySelector('.menu');
  if(toggle&&menu){toggle.addEventListener('click',()=>{menu.classList.toggle('open');toggle.setAttribute('aria-expanded',menu.classList.contains('open')?'true':'false')})}
  function track(name,params){try{if(typeof gtag==='function')gtag('event',name,params||{})}catch(e){}}
  document.addEventListener('click',function(e){const a=e.target.closest&&e.target.closest('a,button');if(!a)return;const href=a.getAttribute('href')||'';const label=(a.textContent||'').trim().slice(0,80);if(href.includes('wa.me'))track('whatsapp_click',{event_category:'lead',event_label:label,link_url:href});if(href.includes('/custom-order'))track('custom_order_click',{event_category:'lead',event_label:label,link_url:href});if(href.includes('pricing-process'))track('pricing_process_click',{event_category:'decision_support',event_label:label,link_url:href})},true);
  const form=document.getElementById('budgetRequestForm');
  if(!form)return;
  let started=false;
  form.addEventListener('input',()=>{if(!started){started=true;track('budget_form_started',{event_category:'lead_form'})}updatePreview()});
  form.addEventListener('change',updatePreview);
  const $=id=>document.getElementById(id);
  function v(id){const el=$(id);return el?String(el.value||'').trim():''}
  function message(){
    return [
      'Hi Auralis Jewelry, I would like help choosing a crystal bracelet based on my budget.',
      '',
      'Preferred budget: '+(v('budget')||'Not provided'),
      'Preferred colors or style: '+(v('style')||'Not provided'),
      'Wrist size: '+(v('wrist')||'Not provided'),
      'For myself or as a gift: '+(v('purpose')||'Not provided'),
      'Delivery country: '+(v('country')||'Not provided'),
      'Preferred direction: '+(v('route')||'Let Auralis recommend'),
      'Reference photo or link: '+(v('reference')||'I will attach it in WhatsApp / None yet'),
      'Birth date or Five Elements request: '+(v('birth')||'No / Not provided'),
      'Quantity: '+(v('quantity')||'1 / Not provided'),
      'Needed-by date: '+(v('deadline')||'Not provided'),
      'Name: '+(v('name')||'Not provided'),
      'Email: '+(v('email')||'Not provided'),
      'Other notes: '+(v('notes')||'None'),
      '',
      'Please recommend a suitable ready-to-ship, simple personalization, or fully custom option. I understand the quote is confirmed before payment.'
    ].join('\n');
  }
  function updatePreview(){const p=$('requestPreview');if(p)p.textContent=message()}
  function valid(){if(!form.reportValidity())return false;return true}
  const wa=$('sendWhatsApp');if(wa)wa.addEventListener('click',function(){if(!valid())return;const url='https://wa.me/8618357590167?text='+encodeURIComponent(message());track('budget_recommendation_submit',{event_category:'lead',method:'whatsapp',budget:v('budget'),route:v('route')});window.open(url,'_blank','noopener')});
  const email=$('sendEmail');if(email)email.addEventListener('click',function(){if(!valid())return;const subject='Auralis budget-based bracelet recommendation request';track('budget_recommendation_submit',{event_category:'lead',method:'email',budget:v('budget'),route:v('route')});window.location.href='mailto:hello@auralisgems.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(message())});
  const copy=$('copyRequest');if(copy)copy.addEventListener('click',async function(){if(!valid())return;try{await navigator.clipboard.writeText(message());const s=$('formStatus');s.textContent='Request copied. Paste it into WhatsApp or email, then attach your reference photo if you have one.';s.classList.add('show');track('request_copy',{event_category:'lead_form'})}catch(e){const s=$('formStatus');s.textContent='Copy was blocked by the browser. Select the preview text below and copy it manually.';s.classList.add('show')}});
  updatePreview();
})();
