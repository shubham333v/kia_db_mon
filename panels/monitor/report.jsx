class ReportPanel extends Panel{LIM={curr:0,inc:25,count:1,total:0,end:false,dir:0,Ctotal:0,curAN:"0000"};cells={data:{},count:0,head:React.createRef(),headv:React.createRef(),headd:React.createRef()};datRefRef=React.createRef();filDateFr=React.createRef();filDateTo=React.createRef();datFiltRef=React.createRef();
bufferData=[];

getCellIndex(a){if(this.cells.data[a]){return this.cells.data[a]; }else{let ch=this.cells.head.current;let chv=this.cells.headv.current;
let nc=ch.insertCell();let ncv=chv.insertCell();nc.innerHTML=`<input placeholder="`+a+`"/><i class="fa-solid fa-magnifying-glass"></i>`;
ncv.innerHTML=a;this.cells.count=nc.cellIndex;this.cells.data[a]=nc.cellIndex;return this.cells.data[a]; } }

setCellIndex(rw,ii,h){let l=rw.cells.length;if(l<(ii+1))for(let i=l;i<=ii;i++)rw.insertCell();rw.cells[ii].innerHTML=h;return rw.cells[ii]; }
clrCellIndex(){this.cells.data={};this.cells.head.current.innerHTML=`<th><input placeholder="Sr"/><i className="fa-solid fa-magnifying-glass"></i></th>`;this.cells.headv.current.innerHTML=`<th>Sr</th>`; }

constructor(){super();this.datcRef=React.createRef();this.state.divli=[];this.depRef=React.createRef();this.datInpRef=React.createRef();this.datInpRef1=React.createRef();
this.datTypRef=React.createRef();this.datLmtRef=React.createRef();this.datPreRef=React.createRef();this.datNxtRef=React.createRef();this.datCntRef=React.createRef();
this.idName="Report"; }

_lispar(a){let d=a;let res=d.res,q=d.query;
  if(res==WebRes.CCD.DE){return this.showToast("Database Error : "+((q&&q.code&&q.code=="ELOGIN")?"Mismatched Database setting or password,username or database name":"")); };
  if(d.res){return this.showToast(d.res,"error"); };let dv=d.query;if(!dv)return;this._parseData(dv); }

_parseData(dv){if(!dv)return;if(!this.cells.headd)return;this.bufferData=dv;let row={};let cod=Object.keys((dv&&dv[0]&&dv[0])||"{}");row[0]={cells:{}};let colum=[{field:"sr",cellClass:"rep-tbl-cell-sr",headerClass:"rep-tbl-head"}];

for(let i=0;i<cod.length;i++){let co=cod[i];if(co=="_coieff"||co=="_decim"||co=="_torqtol"||co=="ID"){continue; };
colum.push({field:co,filter:true,cellClass:"rep-tbl-cell",headerClass:"rep-tbl-head",suppressSizeToFit:true});row[0].cells[i]={text:co,bold:true,align:"center"}; }
for(let i=0,ix=1;i<dv.length;i++,ix++){row[ix]={cells:{}};let dvi=dv[i];let dvk=Object.keys(dvi);dvi.sr=(this.LIM.curr+i+1);
for(let j=0;j<dvk.length;j++){let cell=row[ix].cells;let co=dvk[j];let cv=dvi[co];
  if(co=="_coieff"||co=="_decim"||co=="_torqtol"){continue; };
  if(co=="Torque"){let ce=dvi["_coieff"];let dec=dvi["_decim"]||3;if(cv>0&&ce>0){cv*=ce;cv=cv.toFixed(dec);dvi[co]=cv; } }else
  if(co=="Result Status"){dvi[co]=cv;cv=cv==1?"OK":"NOK";dvi[co]=cv; }else
  if(co=="Deleted"||co=="Not Detected"){dvi[co]=cv;cv=cv==1?"Yes":"No";dvi[co]=cv; }else
  if(co=="Status"){dvi[co]=cv;cv=cv==2?"completed":"No";dvi[co]=cv; }else
  if(co=="Torque target"){let ce=dvi["_coieff"];let dec=dvi["_decim"]||3;cv=cv||"0";if(cv>0&&ce>0){cv*=ce; };let ttl=dvi["_torqtol"]||"0";ttl=(cv*ttl)/10.1972;if(ttl>0&&ce>0){ttl*=ce; };cv=parseFloat(cv)||0;ttl=parseFloat(ttl)||0;dvi["Torque min"]=(cv-ttl).toFixed(dec);dvi["Torque max"]=(cv+ttl).toFixed(dec);cv=cv.toFixed(dec);dvi[co]=cv; }else
  if(co=="Angle"){cv=Math.round(cv*10)/10;dvi[co]=cv; };cell[j]={text:cv}; }; };

 this.grid.setGridOption('columnDefs',colum);setTimeout(()=>{this.grid.setGridOption('rowData',dv); },1);
 if(dv.length<1)this.LIM.end=true;this.LIM.Ctotal=dv.length;if(this.LIM.dir==1)this.LIM.total+=dv.length;let ccn=Math.ceil(this.LIM.total/this.LIM.inc);
 this.LIM.count=ccn<=this.LIM.inc?ccn:ccn+1;this.datCntRef.current.innerText=(this.LIM.count);this.LIM.dir=0; }

render(){return(
<div className={this.idName+"Panel"}>
  <div className='main-panel-head'>
    <samp>
      <tog-opt showvalue="false">
        <li className="opt-head"><i className="fa-solid fa-file-export"></i> Export</li>
        <li onClick={()=>{let bd=this.bufferData;if(bd.length<1)return this.showToast("No Rows");let d1=this.filDateFr.current.value;let d2=this.filDateTo.current.value;d1=d1.replace(/[:.\-Zz\s]+/g,"");d2=d2.replace(/[:.\-Zz\s]+/g,"");console.log("rep"+d1+"To"+d2);let ws=XLSX.utils.json_to_sheet(bd);let wb=XLSX.utils.book_new();
        let fn="rep_"+d1+"_"+d2+".xlsx";XLSX.utils.book_append_sheet(wb,ws,"Report");XLSX.writeFile(wb,fn); } }><i className="fa-regular fa-file-excel"></i> Excel </li>
      </tog-opt>
    </samp>

    <div className="an_fil_pic">
      <samp><label>Fr : </label><pick-datetime ref={this.filDateFr}/></samp>
      <samp><label>TO : </label><pick-datetime ref={this.filDateTo}/></samp>
    </div>

    <samp className="an_fil_dte">
      <tog-opt showvalue="true" value={3} ref={this.datFiltRef}>
        <li className="opt-head"><i class="fa-solid fa-filter"></i> : </li>
        <li value={3}>Both </li>
        <li value={1}>OK </li>
        <li value={2}>NOK </li>
      </tog-opt>
    </samp>

    <samp className="pageCtrl">
      <span className="datRef" ref={this.datRefRef}><i class="fa-solid fa-retweet"></i></span>
      <span className="datCnt"><i className="fa-solid fa-toilet-paper"></i><i ref={this.datCntRef}>{this.LIM.count}</i></span>
      <span className="datLmt"><i className="fa-solid fa-stopwatch-20"></i> : <input placeholder="25" maxLength={4} ref={this.datLmtRef}/></span>
      <span className="datNxt" ref={this.datPreRef}><i className="fa-solid fa-left-long"></i></span>
      <span className="datPre" ref={this.datNxtRef}><i className="fa-solid fa-right-long"></i></span>
    </samp>

  </div>

  <div className="main-panel-cont">
    <div style={{width:"100%",overflow:"none",paddingBottom:"0",height:"100%"}}>
      <div className="table-view" id="tablex"></div>
    </div>
  </div>
</div>); }

componentDidMount(){let td=new Date();let filt=this.datFiltRef.current;

  let fri=this.filDateFr.current;
  let toi=this.filDateTo.current;
  let gelm=document.getElementById("tablex");this.grid=agGrid.createGrid(gelm,{rowData:[],columnDefs:[]});

  if(TABWINDOW&&TABWINDOW.extDat.share){
    if(TABWINDOW.extDat.share.fri instanceof Date)fri.updateVal(TABWINDOW.extDat.share.fri);
    if(TABWINDOW.extDat.share.toi instanceof Date)toi.updateVal(TABWINDOW.extDat.share.toi); }

  fri.onchanged=(a)=>{if(TABWINDOW)TABWINDOW.extDat.share=TABWINDOW.extDat.share||{};TABWINDOW.extDat.share.fri=fri.realDate; }
  toi.onchanged=(a)=>{if(TABWINDOW)TABWINDOW.extDat.share=TABWINDOW.extDat.share||{};TABWINDOW.extDat.share.toi=toi.realDate; }
  
  this.updtReqs("listingrepone","/report/three",this._lispar.bind(this));this.initReqs();
  //this.callReqs("listingrepone",{lim:{curr:this.LIM.curr,inc:this.LIM.inc},date:{fr:fri.value,to:toi.value},filt:{status:filt.value}});

  let datLmtRef=this.datLmtRef.current;datLmtRef.oninput=()=>{datLmtRef.value=datLmtRef.value.replace(/\D/g,"");if(datLmtRef.value>=1000)datLmtRef.value=9999;this.LIM.inc=parseInt(datLmtRef.value)||25;this.LIM.curr=0; }

  this.datNxtRef.current.onclick=()=>{if(this.LIM.end)return;this.LIM.dir=1;this.LIM.curr+=this.LIM.inc;this.bufferData=[];
    this.callReqs("listingrepone",{lim:{curr:this.LIM.curr,inc:this.LIM.inc},date:{fr:fri.value,to:toi.value},filt:{status:filt.value}}); }

  this.datPreRef.current.onclick=()=>{if(this.LIM.end)this.LIM.end=false;this.LIM.dir=0;this.bufferData=[];
    if(this.LIM.curr>1){if(this.LIM.curr>this.LIM.inc){this.LIM.curr-=this.LIM.inc;this.LIM.total-=this.LIM.Ctotal; }else{this.LIM.curr=0;this.LIM.total=0; } };
    this.LIM.count=Math.ceil(this.LIM.total/this.LIM.inc)+1;this.callReqs("listingrepone",{lim:{curr:this.LIM.curr,inc:this.LIM.inc},date:{fr:fri.value,to:toi.value},filt:{status:filt.value}}); }

  let datRefRef=this.datRefRef.current;
  datRefRef.onclick=()=>{this.setState({list:[]});this.LIM.dir=1;this.LIM.end=false;this.LIM.curr=0;this.LIM.count=1;this.LIM.total=0;this.bufferData=[];setTimeout(()=>{this.callReqs("listingrepone",{lim:{curr:this.LIM.curr,inc:this.LIM.inc},date:{fr:fri.value,to:toi.value},filt:{status:filt.value}}); },1); }

  document.addEventListener("themechange",()=>{let bg=getCssProp("--priBg"); });
  }
}