///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
//             Analytics     ANALYSIS
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
class Analytics extends ListPanel{constructor(){super();this.itemMod=StkProdRec;this.charRef=React.createRef();this.empcRef=React.createRef();this.filYr=React.createRef();
  this.filDateFr=React.createRef();this.filDateTo=React.createRef();this.filMn=React.createRef();this.filDy=React.createRef();this.filNm=React.createRef();this.state.dsbMn=false;this.state.dsbYr=false;this.state.dsbDy=false; };_lbwin={comp:<BarWinPan onReady={(a)=>{this._lbwin.comc=a; }}/>};

render(){return(
<div className="analysPan">
  <div className="an_prod_sid">
    <div className="an_prod_pan"><label><i className="fa-solid fa-circle-check"></i> Production Approved <span className="indicCir hrAprStp">{this.state.prdApr}</span></label><div className="an_prod_itm listPanel">{this.state.list.map((d,i)=>{return(d.comp); }) }</div> </div>
    <div className="an_prod_pan"><label><i className="fa-solid fa-circle-xmark"></i> Production Rejected <span className="indicCir hrRejStp">{this.state.prdRej}</span></label><div className="an_prod_itm listPanel">{this.state.listn.map((d,i)=>{return(d.comp); }) }</div> </div>
  </div>
  <div className="an_prod_sidr">
    <div className="an_prod_sup">
      <div className="an_prod_bpe">
        <div className="an_prod_apl">
          <label><i className="fa-solid fa-podcast"></i> Production Completed</label>
          <div><canvas ref={this.charRef} ></canvas></div>
        </div>
        <div className="an_prod_emp">
          <label><i className="fa-solid fa-users-gear"></i> Production by Employee</label>
          <div><canvas ref={this.empcRef} ></canvas></div>
        </div>
      </div>
      <div className="an_prod_sfl">
        <label><i className="fa-solid fa-filter"></i> Filter</label>
        <div>
          <select className="an_fil_sel" ref={this.filNm} >
            <option value={1}>day</option>
            <option value={2}>month</option>
            <option value={3}>year</option>
            <option value={4}>from to</option>
            <option value={5}>Mo/Batch</option>
            <option value={6}>Target</option>
          </select>
          <select className="an_fil_sel" ref={this.filYr} disabled={this.state.dsbYr}></select>
          <select className="an_fil_sel" ref={this.filMn} disabled={this.state.dsbMn}></select>
          <select className="an_fil_sel" ref={this.filDy} disabled={this.state.dsbDy}></select>
          <div className="an_fil_pic">
            <div><label>FR : </label><input type="date" ref={this.filDateFr}></input></div>
            <div><label>TO : </label><input type="date" ref={this.filDateTo}></input></div>
          </div>
        </div>
        <div className="aply_filt" onClick={()=>{this._reqlis(); }}>Apply</div>
      </div>
    </div>
    <div className="an_prod_sdw">
      <div className="an_prod_dep">
        <label><i className="fa-solid fa-ranking-star"></i> Production by Department</label>
        <div>{this._lbwin.comp}</div>
      </div>
    </div>
  </div>
</div>); }

_lislis(a){let d=a.detail;this.req.listing.reqid=null;this.setState({list:[],listn:[]});this._lbwin.comc.clrPan();setTimeout(()=>{
if(d.res)return this.showToast(d.res,"error");let q=d.query||[];let rd=q[0];let emps=q[1]||{};let prdApr={total:0},prdRej={total:0},prdCmp={total:0};
let prdEmp={};let glp={};let prdApra={total:{}},prdReja={total:{}},prdCmpa={total:{}};
for(let i=0;i<rd.length;i++){let crp=(rd[i]&&rd[i].repdata)||{};if(typeof crp=="string"){crp=JSON.parse(crp); };let ck=Object.keys(crp);
for(let j=0;j<ck.length;j++){let ckj=ck[j];let ckv=crp[ckj];let cb=glp[ckj]=glp[ckj]||{};cb.dep=cb.dep||{};cb.emp=cb.emp||{}; let dk=Object.keys(ckv.dep);
 for(let m=0;m<dk.length;m++){let dkm=dk[m];cb.dep[dkm]=cb.dep[dkm]||{apr:0,rej:0,apra:{},reja:{}};cb.dep[dkm].depnme=ckv.dep[dkm].depnme; cb.dep[dkm].seq=ckv.dep[dkm].seq;
 let oap=Object.keys(ckv.dep[dkm].apra);for(let ai=0;ai<oap.length;ai++){cb.dep[dkm].apra[oap[ai]]=1;prdApra[ckj]=prdApra[ckj]||{};prdApra[ckj][oap[ai]]=1;prdApra.total[oap[ai]]=1; };
 let orj=Object.keys(ckv.dep[dkm].reja);for(let ai=0;ai<orj.length;ai++){cb.dep[dkm].reja[orj[ai]]=0;prdReja[ckj]=prdReja[ckj]||{};prdReja[ckj][orj[ai]]=1;prdReja.total[orj[ai]]=1; };

 if(dk.length-1==m){for(let ai=0;ai<oap.length;ai++){prdCmpa[ckj]=prdCmpa[ckj]||{};prdCmpa[ckj][oap[ai]]=1;prdCmpa.total[oap[ai]]=1; }; };
 cb.dep[dkm].apr+=ckv.dep[dkm].apr;cb.dep[dkm].rej+=ckv.dep[dkm].rej; };let ek=Object.keys(ckv.emp);
 for(let m=0;m<ek.length;m++){let ekm=ek[m];cb.emp[ekm]=cb.emp[ekm]||0;cb.emp[ekm]+=ckv.emp[ekm]||0; } } };let ck=Object.keys(glp);
//Deparmental
for(let j=0;j<ck.length;j++){let ckj=ck[j];let ckv=glp[ckj];let dk=Object.keys(ckv.dep);glp[ckj]=glp[ckj]||ckv;let ds=new Array(dk.length);
for(let m=0;m<dk.length;m++){let dkm=dk[m];let dkv=ckv.dep[dkm];let dn=dkv.depnme||"NaN";ds[dkv.seq]={did:dkm,divnme:dn,dur:0,targ:dkv.apr>dkv.apr,aprvd:dkv.apr,rjctd:dkv.rej}; };
  let ek=Object.keys(ckv.emp)||[];for(let m=0;m<ek.length;m++){let ekm=ek[m];let ekv=ckv.emp[ekm];prdEmp[ekm]=prdEmp[ekm]||0;prdEmp[ekm]+=ekv; };      
  let cp=new Prod({prodNme:ckj,prodBcd:ckj,divseq:ds});this._lbwin.comc.addPan(cp,generateUUID()); }
//approve rejection
let pa=Object.keys(prdApra);
for(let i=0;i<pa.length;i++){let ckj=pa[i],apc=0;if(!prdApra[ckj]){apc=prdApr[ckj]=0;continue; };apc=prdApr[ckj]=Object.keys(prdApra[ckj]).length||0;
if(ckj=="total"){this.state.prdApr=apc;continue; };this.addPan({count:apc,name:ckj,type:"hrApr",perc:(apc/prdApr.total)*100},"list"); }
let pc=Object.keys(prdCmpa);
for(let i=0;i<pc.length;i++){let ckj=pc[i],apc=0;if(!prdCmpa[ckj]){apc=prdCmp[ckj]=0;continue; };apc=prdCmp[ckj]=Object.keys(prdCmpa[ckj]).length||0;if(ckj=="total"){continue; }; }
let pr=Object.keys(prdReja);
for(let i=0;i<pr.length;i++){let ckj=pr[i],apc=0;if(!prdReja[ckj]){apc=prdRej[ckj]=0;continue; };apc=prdRej[ckj]=Object.keys(prdReja[ckj]).length||0;
if(ckj=="total"){this.setState({prdRej:apc});continue; };this.addPan({count:apc,name:ckj,type:"hrRej",perc:(apc/prdRej.total)*100},"listn"); }

//completed prod
let pra=[],pna=[],prk=Object.keys(prdCmp);for(let i=0;i<prk.length;i++){if(prk[i]=="total")continue;pna.push(prk[i]);pra.push(prdCmp[prk[i]]); };
let colp=generateColorSeq(prk.length);this.graphPrp.data.labels=pna;this.graphPrp.data.datasets[0].data=pra;this.graphPrp.data.datasets[0].backgroundColor=colp.back;
this.graphPrp.options.plugins.datalabels.color=colp.front;this.graphPrp.update();
//employee
let era=[],ena=[],erk=Object.keys(prdEmp);for(let i=0;i<erk.length;i++){if(erk[i]=="total")continue;let n=getItmByPar(emps,"id",erk[i]).nme||"UNKNOWN";ena.push(n);era.push(prdEmp[erk[i]]); };let cole=generateColorSeq(erk.length);this.graphEmp.data.labels=ena;this.graphEmp.data.datasets[0].data=era;
this.graphEmp.data.datasets[0].backgroundColor=cole.back;this.graphEmp.options.plugins.datalabels.color=cole.front;this.graphEmp.update();
},1); };

_reqlis(){let filYr=this.filYr.current;let filMn=this.filMn.current;let filDy=this.filDy.current;let filNm=this.filNm.current;let seldte=filYr.value+"-"+filMn.value+"-"+filDy.value;let dtfr=this.filDateFr.current.value;let dtto=this.filDateTo.current.value;this.callReqs("listing",{date:seldte,wise:filNm.value,dtfr:dtfr,dtto:dtto}); }

componentDidMount(){let filYr=this.filYr.current;let filMn=this.filMn.current;let filDy=this.filDy.current;let filNm=this.filNm.current;let d=new Date();let cy=d.getFullYear();
let cny=cy-2023;let mna=["January","February","March","April","May","June","July","August","September","October","November","December"];
let mnv=["01","02","03","04","05","06","07","08","09","10","11","12"];this.state.prdApr=0;this.state.prdRej=0;
for(var y=0;y<cny;y++){let ye=document.createElement("option");ye.value=cy;ye.textContent=cy;filYr.appendChild(ye);cy--; };

let cmonth=mnv[d.getMonth()];let cyear=d.getFullYear();d.setDate(d.getDate());let cday=d.getDate();

filYr.addEventListener("change",AdjustMonth);filMn.addEventListener("change",AdjustDays);AdjustMonth();filMn.val=cyear;filMn.value=cmonth;AdjustDays();filDy.value=cday;

filNm.addEventListener("change",()=>{let fv=filNm.value;if(fv==2)this.setState({dsbDy:true,dsbMn:false,dsbYr:false});if(fv==3)this.setState({dsbDy:true,dsbMn:true,dsbYr:false});if(fv==1)this.setState({dsbDy:false,dsbMn:false,dsbYr:false}); });

function AdjustMonth(){filMn.innerHTML="";let sy=filYr.value;for(var y=0;y<12;y++){if(sy==cyear&&y>=cmonth)continue;let mn=document.createElement("option");mn.value=mnv[y];
mn.textContent=mna[y];filMn.appendChild(mn); };AdjustDays(); }

function AdjustDays(){filDy.innerHTML="";let sy=filYr.value;let sm=filMn.value;let days=new Date(sy,sm,0).getDate();for(let d=1;d<=days;d++){if(sy==cyear&&sm==cmonth&&d>cday)continue;let nd=document.createElement("option");nd.value=d;nd.textContent=d;filDy.appendChild(nd); } };let brc=getCssProp("--border-color");this.initPrp(brc);this.initEmp(brc);
document.addEventListener("themechange",this.changeTheme);this.updtReqs("listing","/report/mon/day",this._lislis.bind(this));this.initReqs();this._reqlis(); }

initPrp(brc){this.graphPrp=new Chart(this.charRef.current,{type:'polarArea',data:{labels:[],datasets:[{data:[],backgroundColor:[],borderColor:"transparent" }] },options:{responsive:true,maintainAspectRatio:false,scales:{r:{grid:{color:brc }} }} }); }

initEmp(brc){this.graphEmp=new Chart(this.empcRef.current,{type:'polarArea',data:{labels:[],datasets:[{data:[],backgroundColor:[],borderColor:"transparent" }] },options:{responsive:true,maintainAspectRatio:false,scales:{r:{grid:{color:brc }} }} }); }

changeTheme=(a)=>{let brc=getCssProp("--border-color");let tc=getCssProp("--text-color");let tci=getCssProp("--text-icolor");
this.graphPrp.options.scales.r.grid={color:brc};this.graphPrp.options.scales.r.ticks.color=tc;this.graphPrp.update();
this.graphEmp.options.scales.r.grid={color:brc};this.graphEmp.options.scales.r.ticks.color=tc;this.graphEmp.update(); }

componentWillUnmount(){document.removeEventListener("themechange",this.changeTheme); }

 }