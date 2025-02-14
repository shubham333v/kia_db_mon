Chart.register(ChartDataLabels);
Chart.register('chartjs-plugin-datalabels');
//////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
//                    DASHBOARD
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
class Dashboard extends Panel{constructor(){super(); };datag={mwo:{apr:[],rej:[],mods:[] },mwi:{apr:[],mods:[],cls:{front:[],back:[]}},lwi:{apr:[],mods:[] },TOTAL:0,OK:0,NG:0};tblRef=React.createRef();filDateFr=React.createRef();filDateTo=React.createRef();datRefRef=React.createRef();

addRow(a=[]){let tbl=this.tblRef.current;let r=tbl.insertRow(-1);for(let i=0;i<a.length;i++){let cl=r.insertCell(-1);let ct=a[i];if(i==8&&ct){let nr=ReactDOM.createRoot(cl);nr.render(<LineWindow mods={["A","B"]} high={ct.high||[]} low={ct.low||[]} act={ct.act||[]}/>);continue; };cl.innerHTML=ct; }}

render(){let datag=this.datag;return(
<div style={{height:"inherit"}} className="dash-1-pan">
<div className='main-panel-head'>
    <div className="an_fil_pic">
      <samp><label>Fr : </label><pick-datetime ref={this.filDateFr}/></samp>
      <samp><label>TO : </label><pick-datetime ref={this.filDateTo}/></samp>
      <samp className="pageCtrl"><span className="datRef" ref={this.datRefRef}><i class="fa-solid fa-retweet"></i></span></samp>
    </div>
  </div>
  <div className="dash-pan-main-label">◾ DCM Torque Audit Dashoard Report <div className="dash-pan-main-logo"><img src="/cont/kia_lgo.png"/></div></div>
  <div className="dash-pan-top">
    <samp className="dash-pan-top-tars">
      <div className="dash-pan-label">1. Trends and Result Status</div>
      <samp className="dash-pan-top-tars-mwo"><BarWindow prodNme="Model Wise Over All Check Points" apr={datag.mwo.apr} rej={datag.mwo.rej} mods={datag.mwo.mods} sgl={false} legend={[{col:"#156082",label:"OK",nme:"apr",show:true,dls:{align:'start',anchor:'end',offset:10,color:"#fff"}},{col:"#de7036",label:"NOK",nme:"rej",show:true,dls:{align:'start',anchor:'end',offset:-10}}]}/></samp>
      <samp className="dash-pan-top-tars-mwi"><PieWindow prodNme="Model Wise Issue Split up" apr={datag.mwi.apr} mods={datag.mwi.mods} cls={datag.mwi.cls}/></samp>
      <samp className="dash-pan-top-tars-lwi"><BarWindow prodNme="Line Wise Issue Split up" apr={datag.lwi.apr} mods={datag.lwi.mods} sgl={true} legend={[{col:"#cfc8ee",label:"",show:true,nme:"apr",dls:{align:'start',anchor:'end',offset:-10}}]}/></samp>
    </samp>
    <samp className="dash-pan-top-cps">
      <div className="dash-pan-label"> 2. Check Point Summary</div>
      <div className="dash-pan-top-cps-table">
        <table>
          <tr><td>TOTAL</td><td>{datag.TOTAL}</td></tr>
          <tr><td>OK</td><td>{datag.OK}</td></tr>
          <tr><td>NG</td><td>{datag.NG}</td></tr>
        </table>
      </div>
    </samp>
  </div>
  <div className="dash-pan-bot">
    <div className="dash-pan-label"> 3. Major Issue Points</div>
    <div className="dash-pan-bot-table">
      <table ref={this.tblRef}>
        <tr>
          <th>No</th>
          <th>Model</th>
          <th>Line</th>
          <th>Issue</th>
          <th>Type</th>
          <th>Spec</th>
          <th>Act</th>
          <th>Repeated</th>
          <th>SPC</th>
          <th>Reported</th>
        </tr>
      </table>
    </div>
  </div>
</div>); }

componentDidMount(){
  let fri=this.filDateFr.current;
  let toi=this.filDateTo.current;

  if(TABWINDOW&&TABWINDOW.extDat.share){
    if(TABWINDOW.extDat.share.fri instanceof Date)fri.updateVal(TABWINDOW.extDat.share.fri);
    if(TABWINDOW.extDat.share.toi instanceof Date)toi.updateVal(TABWINDOW.extDat.share.toi); }

  fri.onchanged=(a)=>{if(TABWINDOW)TABWINDOW.extDat.share=TABWINDOW.extDat.share||{};TABWINDOW.extDat.share.fri=fri.realDate; }
  toi.onchanged=(a)=>{if(TABWINDOW)TABWINDOW.extDat.share=TABWINDOW.extDat.share||{};TABWINDOW.extDat.share.toi=toi.realDate; }

this.updtReqs("listingrepone","/report/two",this._lispar.bind(this));this.initReqs();
let datRefRef=this.datRefRef.current;datRefRef.onclick=()=>{this.setState({list:[]});setTimeout(()=>{this.callReqs("listingrepone",{date:{fr:fri.value,to:toi.value}}); },1); }
}

_lispar(a){let d=a;let res=d.res,q=d.query;
  if(res==WebRes.CCD.DE){return this.showToast("Database Error : "+((q&&q.code&&q.code=="ELOGIN")?"Mismatched Database setting or password,username or database name":"")); };
  if(d.res){return this.showToast(d.res,"error"); };let dv=d.query;if(!dv)return;this._parseData(dv); }

_parseData(dv){if(!dv)return;let m_wise={};let l_wise={};let datag=this.datag;datag.TOTAL=0;datag.OK=0;datag.NG=0;
for(let i=0;i<dv.length;i++){let di=dv[i];let cm=(di.Route||"").split("_")[0];let cl=di.Inspection.split(" ")[0];let cr=di["Result Status"]==1;let iss=di["Target Object"];
let date=di["Result Date"];let act=di["Torque"];let ttg=di["Torque target"],ce=di["_coieff"],dec=di["_decim"]||3;ttg=ttg||"0";let ttl=di["_torqtol"]||"0";if(ttl>0&&ce>0){ttl*=ce; };
if(ttg>0&&ce>0){ttg*=ce; };if(act>0&&ce>0){act*=ce; };ttl=(ttg*ttl)/10.1972;ttg=parseFloat(ttg)||0;ttl=parseFloat(ttl)||0;let tMax=(ttg+ttl).toFixed(dec),tMin=(ttg-ttl).toFixed(dec);ttg=ttg.toFixed(dec);let typ=null;if(act>tMax)typ="High";if(act<tMin)typ="Low";
let rd=parseInt(date.replace(/[\:\\\-TzZ\s]/g,"")),bd=parseInt(this.req.listingrepone.buf.date.fr.replace(/[\:\\\-TzZ\s]/g,""));
if(bd>=rd){m_wise[cm]&&m_wise[cm].issue&&m_wise[cm].issue[iss]&&m_wise[cm].issue[iss].g_act&&(m_wise[cm].issue[iss].g_act.push(act));continue; }

if(cm){m_wise[cm]=m_wise[cm]||{ok:0,nok:0,issue:{},date:"",act:""};if(cr){m_wise[cm].ok++;datag.TOTAL++;datag.OK++ }else{m_wise[cm].nok++;datag.NG++;datag.TOTAL++;m_wise[cm].issue[iss]=m_wise[cm].issue[iss]||{cnt:0,chn:"",date:"",act:"",low:"",high:"",target:"",g_act:[],g_low:[],g_high:[]};m_wise[cm].issue[iss].date=date;m_wise[cm].issue[iss].act=act;m_wise[cm].issue[iss].tMax=tMax;m_wise[cm].issue[iss].tMin=tMin;m_wise[cm].issue[iss].typ=typ;m_wise[cm].issue[iss].cnt++;m_wise[cm].issue[iss].chn=(di.Inspection.split(" ")[0]||"").split("-")[0]||"";m_wise[cm].issue[iss].g_act.push(act);m_wise[cm].issue[iss].g_low.push(tMin);m_wise[cm].issue[iss].g_high.push(tMax); } };if(cl){cl=cl.split("-")[0];l_wise[cl]=l_wise[cl]||{ok:0,nok:0};if(cr){l_wise[cl].ok++; }else l_wise[cl].nok++; } }

let t=this.tblRef.current;if(!t)return;while(t.children[1]){t.removeChild(t.children[1]); }
let mk=Object.keys(m_wise);let lk=Object.keys(l_wise);
let mods=this.datag.mwo.mods;mods.splice(0,mods.length);
let mods_p=this.datag.mwi.mods;mods_p.splice(0,mods_p.length);
let apr=this.datag.mwo.apr;apr.splice(0,apr.length);
let rej=this.datag.mwo.rej;rej.splice(0,rej.length);
let apr_p=this.datag.mwi.apr;apr.splice(0,apr_p.length);

for(let i=0;i<mk.length;i++){mods_p[i]=mods[i]=mk[i];apr[i]=(m_wise[mk[i]].ok);apr_p[i]=rej[i]=(m_wise[mk[i]].nok);let iss=m_wise[mk[i]].issue;let karr=Object.keys(iss);let varr=[];for(let j=0;j<karr.length;j++){varr.push(iss[karr[j]].cnt); };let mi=varr.indexOf(Math.max(...varr));if(mi>=0){let ck=karr[mi];let cb=iss[ck];this.addRow([i,mods_p[i],cb.chn,ck,cb.typ,cb.tMin+"~"+cb.tMax,cb.act.toFixed(2),cb.cnt,{high:cb.g_high,low:cb.g_low,act:cb.g_act},cb.date.replace(/[TZ]/g,"\n")]); }; };

let cs=generateColorSeq(mk.length);this.datag.mwi.cls.back.splice(0,this.datag.mwi.cls.back.length);this.datag.mwi.cls.front.splice(0,this.datag.mwi.cls.front.length);for(let j=0;j<cs.back.length;j++){this.datag.mwi.cls.back.push(cs.back[j]);this.datag.mwi.cls.front.push(cs.front[j]); }

let mods_l=this.datag.lwi.mods;let apr_l=this.datag.lwi.apr;mods_l.splice(0,mods_l.length);apr_l.splice(0,apr_l.length);for(let i=0;i<lk.length;i++){let lki=lk[i];mods_l[i]=lki;apr_l[i]=l_wise[lki].nok; };this.changed(); }

componentWillUnmount(){super.componentWillUnmount(); }
 }
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
//                    BarWindow
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
class BarWindow extends React.Component{uuid=generateUUID();state={prodNme:"NO NAME",total:"0"};mount=false;

constructor(a){super(); }

render(){if(this.graph)this.graph.update();return(<React.Fragment><div className="header">{this.props.prodNme}</div>
<div className="graph"><canvas id={this.uuid+"_chart"}></canvas></div></React.Fragment> ); }

componentDidMount(){this.chart=document.getElementById(this.uuid+"_chart");this.mount=true;let dls=[{align:'start',anchor:'end',offset:10,color:"#fff"},{align:'start',anchor:'end',offset:-10}];let mods=this.props.mods||[];let dst=[];let leg=this.props.legend;for(let i=0;i<leg.length;i++){let cll=leg[i];dst.push({label:cll.label,data:this.props[cll.nme],backgroundColor:cll.col,datalabels:cll.dls,stack:"a" }); };this.graph=new Chart(this.chart,{type:"bar",data:{labels:mods,datasets:dst},options:{responsive:true,layout:{padding:{top:20}},plugins:{datalabels:{color:'#fff',font:{size:12,weight:"1000",lineHeight:1},padding:{left:10,right:10,bottom:-10},borderRadius:10,backgroundColor:"transparent" },legend:{labels:{color:"#333"},position:'bottom' }},scales:{x:{ticks:{font:{size:12},color:"#000"},stacked:true} },datasets:{bar:{barPercentage:0.8 }}} });this.changeTheme({detail:document.theme});document.removeEventListener("themechange",this.changeTheme);document.addEventListener("themechange",this.changeTheme); };

componentWillUnmount(){document.removeEventListener("themechange",this.changeTheme); }

changeTheme=(a)=>{let tc="transparent";let tci=getCssProp("--text-color");this.graph.options.scales.x.ticks.color=tci;let brc=getCssProp("--border-color");
this.graph.options.scales.x.grid={color:"transparent"};this.graph.options.scales.y.grid={color:"transparent"};this.graph.options.scales.y.color=tc;
this.graph.options.plugins.datalabels.color=tci;this.graph.options.plugins.datalabels.backgroundColor=tc;this.graph.update(); }
}
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
//                    PIEWINDOW
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
class PieWindow extends React.Component{uuid=generateUUID();state={prodNme:"NO NAME",total:"0"};mount=false;

constructor(a){super(); }

render(){if(this.graph)this.graph.update();return(<React.Fragment><div className="header">{this.props.prodNme}</div>
<div className="graph"><canvas id={this.uuid+"_chart"}></canvas></div></React.Fragment> ); }

componentDidMount(){this.chart=document.getElementById(this.uuid+"_chart");this.mount=true;
let mods=this.props.mods||[];let apr=this.props.apr||[];let cls=this.props.cls;
this.graph=new Chart(this.chart,{type:'doughnut',data:{labels:mods,datasets:[{data:apr,backgroundColor:cls.back}] },
    options:{cutout:30,responsive:true,layout:{padding:20},plugins:{datalabels:{color:cls.front,font:{size:"14px",weight:"800",lineHeight:1},
    formatter:(val, ctx)=>{let lb=ctx.chart.data.labels[ctx.dataIndex];let dps=ctx.chart.data.datasets[0].data;let ttl=dps.reduce((ttl,dp)=>ttl+dp,0);let p=val/ttl*100;
      let fv=p.toFixed(2)+ "%";return`${lb}\n${fv}`; }},legend:{position:'top',display:false },title:{display:false },annotation:{annotations:{dLabel:{type:'doughnutLabel',content:({chart})=>{return chart.getDatasetMeta(0).total; },color:"black",font:{size:"18px",weight:"1000"} }} } }} });

this.changeTheme({detail:document.theme});document.removeEventListener("themechange",this.changeTheme);document.addEventListener("themechange",this.changeTheme); };

componentWillUnmount(){document.removeEventListener("themechange",this.changeTheme); }

changeTheme=(a)=>{let tc=getCssProp("--text-color");this.graph.options.plugins.annotation.annotations.dLabel.color=tc;this.graph.update(); }
}
//////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
//                   LINE WINDOW
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
class LineWindow extends React.Component{uuid=generateUUID();state={prodNme:"NO NAME",total:"0"};mount=false;

constructor(a){super(); }

render(){return(<React.Fragment><div className="lin-win-graph"><canvas id={this.uuid+"_chart"}></canvas></div></React.Fragment> ); }

componentDidMount(){this.chart=document.getElementById(this.uuid+"_chart");this.mount=true;let mods=this.props.mods||[];
let high=this.props.high,low=this.props.low,act=this.props.act;if(high.length==1)high.push(high[0]);if(low.length==1)low.push(low[0]);if(act.length==1)act.push(act[0]);
this.graph=new Chart(this.chart,{type:"line",data:{labels:mods,datasets:[{label:"Low",data:low,borderColor:"dodgerblue",fill:false },{label:"Act",data:act,borderColor:"green",fill:false },{label:"Target",data:high,borderColor:"#7B3F00",fill:false }] },
  options:{responsive:false,layout:{padding:{top:20}},plugins:{datalabels:{color:'transparent',font:{size:0},backgroundColor:"transparent" },legend:{labels:{color:"#555"},position:'bottom' }},scales:{x:{ticks:{font:{size:12},color:"transparent"},stacked:true},y:{ticks:{font:{size:0},color:"transparent"}} }} });
this.changeTheme({detail:document.theme});document.removeEventListener("themechange",this.changeTheme);document.addEventListener("themechange",this.changeTheme); };

componentWillUnmount(){document.removeEventListener("themechange",this.changeTheme); }

changeTheme=(a)=>{let tc="transparent";let tci=getCssProp("--text-color");let brc=getCssProp("--border-color");this.graph.options.plugins.legend.labels.color=tci;
this.graph.options.scales.x.grid={color:"transparent"};this.graph.options.scales.y.grid={color:"transparent"};this.graph.update(); }
}