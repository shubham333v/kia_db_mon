function resizableGrid(table){let row=table.getElementsByTagName('tr')[0],cols=row?row.children:undefined;if(!cols)return;
for(var i=0;i<cols.length;i++){let c=cols[i];let div=createDiv();c.appendChild(div);c.style.position='relative';setListeners(div,table);
let cc=c.children;if(cc.length>0){let sc=c.getElementsByTagName("input");if(sc.length>0){let sc0=sc[0];sc0.index=i;
sc0.oninput=()=>{let rws=table.getElementsByTagName('tr');let sci=sc0.index;let scv=sc0.value;
  for(let j=0;j<rws.length;j++){let rj=rws[j];if(j==0||j==1)continue;let rjc=rj&&rj.children;let rjci=rjc[sci];if(rjci&&rjci.tagName=="TD"){
    let nrg=new RegExp(scv.toLowerCase(),"g");if(nrg.test(rjci.textContent.toLowerCase()))rj.style.display="table-row";else rj.style.display="none"; }} };}; };}

function setListeners(div,table){let pageX,curCol,nxtCol,curColWidth,nxtColWidth,tableWidth,mouseDown=false,mouseTarget=null;
 div.addEventListener('mousedown',function(e){mouseDown=true;mouseTarget=e.target;tableWidth=table.offsetWidth;curCol=e.target.parentElement;nxtCol=curCol.nextElementSibling;pageX=e.pageX;let padding=paddingDiff(curCol);curColWidth=curCol.offsetWidth-padding;e.target.style.borderRight='2px solid dodgerblue'; });

 div.addEventListener('mouseover',function(e){e.target.style.borderRight='4px solid dodgerblue'; });
 div.addEventListener('mouseout',function(e){if(!mouseDown)e.target.style.borderRight=''; })

 document.addEventListener('mousemove',function(e){if(curCol){let diffX=e.pageX-pageX;curCol.style.width=(curColWidth+diffX)+'px';table.style.width=tableWidth+diffX+"px"; } });

 document.addEventListener('mouseup',function(e){mouseDown=false;curCol=undefined;nxtCol=undefined;pageX=undefined;nxtColWidth=undefined;curColWidth=undefined;if(mouseTarget)mouseTarget.style.borderRight='';mouseTarget=null; }); }

function createDiv(){let d=document.createElement('div');d.style.top=0;d.style.right=0;d.style.width='5px';d.style.position='absolute';d.style.cursor='col-resize';d.style.userSelect='none';d.style.height='100%';return d; }

function paddingDiff(col){if(getStyleVal(col,'box-sizing')=='border-box'){return 0; };let padLeft=getStyleVal(col,'padding-left');let padRight=getStyleVal(col,'padding-right');return(parseInt(padLeft)+parseInt(padRight)); }

function getStyleVal(elm, css) {return (window.getComputedStyle(elm, null).getPropertyValue(css)); } };

function exportToExcel(table) {let uri='data:application/vnd.ms-excel;base64,';let template='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>';let base64=(s)=>window.btoa(unescape(encodeURIComponent(s)));let format=function(template,context){return template.replace(/{(\w+)}/g,(m,p)=>context[p]); };let html=table.innerHTML;let ctx={worksheet:'Worksheet',table:html };let link=document.createElement("a");link.download="export.xls";link.href=uri+base64(format(template,ctx));link.click(); }

function exportToPdf(table){let pdf=new jsPDF('p','pt','a4');pdf.fromHTML(table.outerHTML,10,10,{'width':522 },function(dispose){pdf.save('export.pdf'); }); }