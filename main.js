
const {Dbs,LDbs}=require("./modules/database");
const express=require('express');
const app=express();
const port=3000;
const {v4:uuidv4,v1:uuidv1,validate}=require("uuid");
const WebRes=require("./support/js/webres");
const cron=require('node-cron');

app.use(express.json());
app.use("/support",express.static(__dirname+"/support"));
app.use("/panels",express.static(__dirname+"/panels"));
app.use("/cont",express.static(__dirname+"/cont"));
app.use("/tpanels",express.static(__dirname+"/panels/custumer/"));
app.use("/module",express.static(__dirname+"/node_modules/"));

app.use(function(req, res, next){
  res.header('Access-Control-Allow-Origin',"*");
  res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
  res.header('reqid',req.headers.reqid);
  res.header('path',req.headers.path);
  let rpp=req._parsedUrl.pathname;
  let rwmod=req.headers.rwmod||"P";
  if(valAuth(rwmod,rpp))return next();
});
/////////////////////////////////////////////
/////////////////////////////////////////////
//            DATABASE init
/////////////////////////////////////////////
/////////////////////////////////////////////
global.ldbs=new LDbs();

global.ldbs.addEventListener("onReady",()=>{global.ldbs.query("SELECT*FROM dbsset;",(a,b)=>{if(a)return;let setg={db_nme:"",db_scm:"",db_usr:"",db_pas:"",db_prt:""};
  if(b&&typeof b=="object")for(let i=0;i<b.length;i++){let bi=b[i];if(bi&&bi.keynme){setg[bi.keynme]=bi.keyval; } };global.dbs=new Dbs(setg); },global.ldbs._ALL); });
/////////////////////////////////////////////
/////////////////////////////////////////////
//            CONSTANTS
/////////////////////////////////////////////
/////////////////////////////////////////////
const MON_SET={mn_typ:"day",mn_shf_1:"6:30:0",mn_shf_2:"03:30:0",mn_shf_3:"22:30:0",fr:"",to:""}
const CUR_REP={rows:[],err:null};
/////////////////////////////////////////////
/////////////////////////////////////////////
//            FUNCTIONS
/////////////////////////////////////////////
/////////////////////////////////////////////
function valAuth(rwm,url){if(rwm=="X")return true;
  let PAuth=["/","/favicon.ico","/lcredin"];
  if(rwm=="P"){for(let i=0;i<PAuth.length;i++)if(PAuth[i]==url)return true;return false; }//public
}
function failAuth(req,res,rgn,typ){res.set("auth",false);res.set("authtype",typ);res.set("reasion",rgn);res.end(); }
function parseSend(a,b,c){return JSON.stringify({"res":a,data:b,extra:c}); }

function isString(a){return typeof a=="string"; }
function areStrings(a){for(let i=0;i<a.length;i++){if(typeof a[i]!="string")return false; }return true; }
function randomString(l){let ca="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ~`!@#$%^&*()_+-={}[]:\";\'<>?,./|\\";let r='';for(let i=l;i>0;--i)r+=ca[Math.floor(Math.random()*ca.length)];return r; }

function genSid(){return uuidv4()+uuidv1()+uuidv4()+uuidv1()+uuidv1()+uuidv4(); }
function addZero(str){return str<10?('0'+str):str; }
function getCrTimDt(d){let cdt=d||new Date();return addZero(cdt.getFullYear())+"-"+addZero(cdt.getMonth()+1)+"-"+addZero(cdt.getDate())+" "+addZero(cdt.getHours())+":"+addZero(cdt.getMinutes())+":"+addZero(cdt.getSeconds()); }
function getCrDt(d){let cdt=d||new Date();return addZero(cdt.getFullYear())+"-"+addZero(cdt.getMonth()+1)+"-"+addZero(cdt.getDate()); }
function getDfDt(dt2,dt1){let diff=(dt2-dt1)/1000;diff/=(60*60*24);return Math.abs(Math.round(diff)); }
function DtToInt(a){return parseInt(a.replace(/[:.\-Zz\s]+/g,"")); }
//////////////////////////////////////////////////////////////////////
///////////// ARRAY END
/////////////////////////////////////////////////////////////////////
function chnSid(req,res,ax,bx,atp="login"){let sid=genSid();if(ax)return failAuth(req,res,ax,atp);if(!bx)return failAuth(req,res,"session expired",atp);let cb=bx;
let uid=cb.uid;global.ldbs.query("UPDATE creds SET sid='"+sid+"' WHERE id='"+cb.id+"';",(a2,b2)=>{if(a2)return failAuth(req,res,a2,atp);res.set("sid",sid);res.set("auth",true);res.set("nme",cb.nme);res.set("uid",uid+"");res.set("rwmod",cb.rwmod);res.set("authtype",atp);return res.end(JSON.stringify({"res":null,data:[] }) );} );}

app.post("/lcredin",(req,res)=>{let bdy=req.body;let uid=bdy.uid,sid=bdy.sid,pass=bdy.pass;if(typeof uid!="string")return failAuth(req,res,"invallied parameter","login");
  if(typeof sid=="string"){global.ldbs.query("SELECT*FROM creds WHERE uid='"+uid+"' AND sid='"+sid+"';",(a,b)=>chnSid(req,res,a,b,"session"),global.ldbs._GET);return; };
  if(typeof pass=="string"){global.ldbs.query("SELECT*FROM creds WHERE uid='"+uid+"' AND pass='"+pass+"';",(a,b)=>{chnSid(req,res,a,b,"login"); },global.ldbs._GET);return; }
  return failAuth(req,res,"invallied parameter","login"); });

app.post("/usr/password/update",(req,res)=>{let bdy=req.body;let uid=req.headers.uid,nPass=bdy.nPass,oPass=bdy.oPass;
  if(!areStrings([uid,nPass]))return res.end(parseSend(WebRes.CCD.INP,null));if(nPass.length<6)return res.end(WebRes.CCD.LCN);if(nPass.length>11)return res.end(WebRes.CCD.MCN);
global.ldbs.query("SELECT*FROM creds WHERE uid='"+uid+"' AND pass='"+oPass+"';",(a,b)=>{if(a)return res.end(parseSend(WebRes.CCD.DE));if(!b)return res.end(parseSend(WebRes.CCD.UNF));
global.ldbs.query("UPDATE creds SET pass='"+nPass+"' WHERE uid='"+uid+"' AND pass='"+oPass+"';",(aa,bb)=>{if(aa)return res.end(parseSend(WebRes.CCD.DE));res.end(parseSend(null,null)); },global.ldbs._RUN);},global.ldbs._GET);return; });
/*
///////////////////////////////////////////////////////
//                  database setting
///////////////////////////////////////////////////////
*/
app.post("/dbs/settings",(req,res)=>{global.ldbs.query("SELECT*FROM dbsset WHERE keynme!='db_pas';",(a,b)=>{if(a)return res.end(parseSend(WebRes.CCD.DE));return res.end(parseSend(null,b)); },global.ldbs._ALL);try{global.dbs.close(); }catch(ee){};return; });

app.post("/dbs/settings/update",(req,res)=>{let body=req.body;let db_nme=body.db_nme,db_scm=body.db_scm,db_usr=body.db_usr,db_pas=body.db_pas,db_prt=body.db_prt;
  if(!areStrings([db_nme,db_scm,db_usr,db_pas,db_prt]))return res.end(parseSend(WebRes.CCD.INP,null));
  let q=`UPDATE dbsset SET keyval=CASE WHEN keynme='db_nme' THEN '`+db_nme+`' WHEN keynme='db_scm' THEN '`+db_scm+`' WHEN keynme='db_usr' THEN '`+db_usr+`' WHEN keynme='db_pas' THEN '`+db_pas+`' WHEN keynme='db_prt' THEN '`+db_prt+`' END;`;
  global.ldbs.query(q,(a,b)=>{if(a)return res.end(parseSend(WebRes.CCD.DE,a));global.dbs=new Dbs(req.body,(rx)=>{if(!rx)return res.end(parseSend(WebRes.CCD.DE,global.dbs.setting.error));else return res.end(parseSend(null,b)); }); },global.ldbs._RUN);return; });
/*
///////////////////////////////////////////////////////
//                  monitoring setting
///////////////////////////////////////////////////////
*/
app.post("/mon/settings",(req,res)=>{global.ldbs.query("SELECT*FROM monset;",(a,b)=>{if(a)return res.end(parseSend(WebRes.CCD.DE));return res.end(parseSend(null,b)); },global.ldbs._ALL);try{global.dbs.close(); }catch(ee){};return; });

app.post("/mon/settings/update",(req,res)=>{let body=req.body;let mn_typ=body.mn_typ,mn_shf_1=body.mn_shf_1,mn_shf_2=body.mn_shf_2,mn_shf_3=body.mn_shf_3;
  if(!areStrings([mn_shf_1,mn_shf_2,mn_shf_3,mn_typ]))return res.end(parseSend(WebRes.CCD.INP,null));
  let q=`UPDATE monset SET keyval=CASE WHEN keynme='mn_typ' THEN '`+mn_typ+`' WHEN keynme='mn_shf_1' THEN '`+mn_shf_1+`' WHEN keynme='mn_shf_2' THEN '`+mn_shf_2+`' WHEN keynme='mn_shf_3' THEN '`+mn_shf_3+`' END;`;global.ldbs.query(q,(a,b)=>{updateTasks(mn_typ,mn_shf_1,mn_shf_2,mn_shf_3);
    if(a)return res.end(parseSend(WebRes.CCD.DE,a));res.end(parseSend(null,b)); },global.ldbs._RUN);return; });
/*
///////////////////////////////////////////////////////
//                 Report functions
///////////////////////////////////////////////////////
*/
/////////////////////////////////////////////
/////////////////////////////////////////////
//            REPORT INTERV
/////////////////////////////////////////////
/////////////////////////////////////////////
function repInterv(fr,to,clb=()=>{}){if(!global.dbs.setting.connected)return res.end(parseSend(WebRes.CCD.DE,global.dbs.setting.error));let scm=global.dbs.setting.schema||"atlascopco";let to1m=new Date(to);to1m.setMonth(to1m.getMonth()-1);to1m=getCrDt(to1m);
if(getDfDt(new Date(fr),new Date(to))>28)to1m=fr;
  global.dbs.res_query_1(`select
  `+scm+`.EXECUTIONMEASURE.ID as ID,
  `+scm+`.INSPECTIONHISTORY.NAME as Inspection,
  `+scm+`.ROUTE.CURRENTNAME as Route,
  `+scm+`.EXECUTION.RESULTSTATUS as 'Result Status',
  `+scm+`.EXECUTION.EXECUTIONDATE as 'Result Date',
  `+scm+`.JOINTSTATUSVIEW.JOINT_NAME as 'Target Object',
  `+scm+`.EXECUTIONMEASURE.MEASUREDATE as Date,
  `+scm+`.MEASUREMENTUNIT.NAME as 'Measurement Unit',
  `+scm+`.MEASUREMENTUNIT.COEFFICIENT as '_coieff',
  `+scm+`.MEASUREMENTUNIT.DECIMALS as '_decim',
  `+scm+`.EXECUTIONMEASURE.TORQUE as Torque,
  `+scm+`.JOINTHISTORY.TORQUETOLERANCELIMITS as '_torqtol',
  `+scm+`.JOINTHISTORY.TIGHTENINGTORQUE as 'Torque target'
  from `+scm+`.EXECUTIONMEASURE
  LEFT JOIN `+scm+`.EXECUTION ON `+scm+`.EXECUTION.id=`+scm+`.EXECUTIONMEASURE.EXECUTION
  LEFT JOIN `+scm+`.MEASURINGINSTRUMENT ON `+scm+`.MEASURINGINSTRUMENT.id=`+scm+`.EXECUTION.MEASURINGINSTRUMENT
  LEFT JOIN `+scm+`.INSPECTIONHISTORY ON `+scm+`.INSPECTIONHISTORY.id=`+scm+`.EXECUTION.INSPECTIONHISTORY
  LEFT JOIN `+scm+`.ROUTE ON `+scm+`.ROUTE.id=`+scm+`.EXECUTION.ROUTE
  LEFT JOIN `+scm+`.JOINTSTATUSVIEW ON `+scm+`.JOINTSTATUSVIEW.INSPECTION_ID=`+scm+`.INSPECTIONHISTORY.INSPECTION
  LEFT JOIN `+scm+`.JOINT ON `+scm+`.JOINT.ID=`+scm+`.INSPECTIONHISTORY.JOINT
  LEFT JOIN `+scm+`.JOINTHISTORY ON `+scm+`.JOINTHISTORY.ID=`+scm+`.JOINT.HISTCURRENT
  LEFT JOIN `+scm+`.MEASUREMENTUNIT ON `+scm+`.MEASUREMENTUNIT.ID=`+scm+`.JOINTHISTORY.MEASUREMENTUNIT
  WHERE (EXECUTIONDATE >='`+to1m+`' AND EXECUTIONDATE<='`+to+`')
  ORDER BY EXECUTIONDATE DESC;`,clb); 
   }
/////////////////////////////////////////////
/////////////////////////////////////////////
//            REPORT TWO
/////////////////////////////////////////////
/////////////////////////////////////////////
app.post("/report/two",(req,res)=>{let date=req.body.date;let fr=date.fr,to=date.to;if(!global.dbs.setting.connected)return res.end(parseSend(WebRes.CCD.DE,global.dbs.setting.error));let scm=global.dbs.setting.schema||"atlascopco";let to1m=new Date(to);to1m.setMonth(to1m.getMonth()-1);to1m=getCrDt(to1m);
if(getDfDt(new Date(fr),new Date(to))>28)to1m=fr;
  global.dbs.query(`select 
  `+scm+`.EXECUTIONMEASURE.ID as ID,
  `+scm+`.INSPECTIONHISTORY.NAME as Inspection,
  `+scm+`.ROUTE.CURRENTNAME as Route,
  `+scm+`.EXECUTION.RESULTSTATUS as 'Result Status',
  `+scm+`.EXECUTION.EXECUTIONDATE as 'Result Date',
  `+scm+`.JOINTSTATUSVIEW.JOINT_NAME as 'Target Object',
  `+scm+`.EXECUTIONMEASURE.MEASUREDATE as Date,
  `+scm+`.MEASUREMENTUNIT.NAME as 'Measurement Unit',
  `+scm+`.MEASUREMENTUNIT.COEFFICIENT as '_coieff',
  `+scm+`.MEASUREMENTUNIT.DECIMALS as '_decim',
  `+scm+`.EXECUTIONMEASURE.TORQUE as Torque,
  `+scm+`.JOINTHISTORY.TORQUETOLERANCELIMITS as '_torqtol',
  `+scm+`.JOINTHISTORY.TIGHTENINGTORQUE as 'Torque target'
  from `+scm+`.EXECUTIONMEASURE
  LEFT JOIN `+scm+`.EXECUTION ON `+scm+`.EXECUTION.id=`+scm+`.EXECUTIONMEASURE.EXECUTION
  LEFT JOIN `+scm+`.MEASURINGINSTRUMENT ON `+scm+`.MEASURINGINSTRUMENT.id=`+scm+`.EXECUTION.MEASURINGINSTRUMENT
  LEFT JOIN `+scm+`.INSPECTIONHISTORY ON `+scm+`.INSPECTIONHISTORY.id=`+scm+`.EXECUTION.INSPECTIONHISTORY
  LEFT JOIN `+scm+`.ROUTE ON `+scm+`.ROUTE.id=`+scm+`.EXECUTION.ROUTE
  LEFT JOIN `+scm+`.JOINTSTATUSVIEW ON `+scm+`.JOINTSTATUSVIEW.INSPECTION_ID=`+scm+`.INSPECTIONHISTORY.INSPECTION
  LEFT JOIN `+scm+`.JOINT ON `+scm+`.JOINT.ID=`+scm+`.INSPECTIONHISTORY.JOINT
  LEFT JOIN `+scm+`.JOINTHISTORY ON `+scm+`.JOINTHISTORY.ID=`+scm+`.JOINT.HISTCURRENT
  LEFT JOIN `+scm+`.MEASUREMENTUNIT ON `+scm+`.MEASUREMENTUNIT.ID=`+scm+`.JOINTHISTORY.MEASUREMENTUNIT
  WHERE (EXECUTIONDATE >='`+to1m+`' AND EXECUTIONDATE<='`+to+`')
  ORDER BY EXECUTIONDATE DESC;`,(e,rw)=>{if(e)return res.send(parseSend(e));res.send(parseSend(null,rw)); }); 
   });
/////////////////////////////////////////////
/////////////////////////////////////////////
//            REPORT THREE
/////////////////////////////////////////////
/////////////////////////////////////////////
app.post("/report/three",(req,res)=>{let lim=req.body.lim||{curr:0,inc:25};let date=req.body.date;let fr=date.fr,to=date.to;let filt=req.body.filt;let stt=(filt&&filt.status)||3;
if(!global.dbs.setting.connected)return res.end(parseSend(WebRes.CCD.DE,global.dbs.setting.error));let scm=global.dbs.setting.schema||"atlascopco";let aq=stt<3?"ANd "+scm+".EXECUTION.RESULTSTATUS='"+stt+"' ":"";
  global.dbs.query(`select 
  `+scm+`.EXECUTIONMEASURE.ID as ID,
  `+scm+`.INSPECTIONHISTORY.NAME as Inspection,
  `+scm+`.ROUTE.CURRENTNAME as Route,
  `+scm+`.EXECUTION.STATUS as Status,
  `+scm+`.EXECUTION.RESULTSTATUS as 'Result Status',
  `+scm+`.EXECUTION.EXECUTIONDATE as 'Result Date',
  `+scm+`.MEASURINGINSTRUMENT.NAME as 'Measuring Device',
  `+scm+`.JOINTSTATUSVIEW.JOINT_NAME as 'Target Object',
  NULL as #Type,
  NULL as #Method,
  `+scm+`.EXECUTIONMEASURE.BATCHPOSITION as #Seq,
  `+scm+`.EXECUTIONMEASURE.STEPNUMBER as Step,
  `+scm+`.EXECUTIONMEASURE.MEASUREDATE as Date,
  `+scm+`.MEASUREMENTUNIT.NAME as 'Measurement Unit',
  `+scm+`.MEASUREMENTUNIT.COEFFICIENT as '_coieff',
  `+scm+`.MEASUREMENTUNIT.DECIMALS as '_decim',
  `+scm+`.EXECUTIONMEASURE.TORQUE as Torque,
  `+scm+`.JOINTHISTORY.TORQUETOLERANCELIMITS as '_torqtol',
  `+scm+`.JOINTHISTORY.TIGHTENINGTORQUE as 'Torque target',
  NULL as 'Torque min',
  NULL as 'Torque max',
  `+scm+`.EXECUTIONMEASURE.ANGLE as Angle,
  NULL as '#Angle Min',
  NULL as '#Angle Max',
  `+scm+`.JOINTHISTORY.TORSIONANGLE as '#Angle Target',
  `+scm+`.EXECUTIONMEASURE.TORQUEPEAK as 'Torque Peak',
  `+scm+`.EXECUTIONMEASURE.ANGLEATTORQUEPEAK 'Angle at Torque Peak',
  NULL as '#Delta []',
  NULL as '#Ref',
  `+scm+`.EXECUTIONMEASURE.TORQUETOOL as 'Tool',
  `+scm+`.EXECUTIONMEASURE.TORQUENORMALIZED as 'Normalized',
  `+scm+`.EXECUTIONMEASURE.TORQUEDEVIATION as 'Dev [%]',
  NULL as '#Err [%]',
  NULL as '#Ref Ang []',
  `+scm+`.EXECUTIONMEASURE.ANGLETOOL as 'Tool Ang []',
  `+scm+`.EXECUTIONMEASURE.ANGLEDEVIATION as 'Ang.Dev [%]',
  `+scm+`.EXECUTIONMEASURE.DIMENSION as 'Dimension',
  NULL as '#Dimensional Min',
  NULL as '#Dimensional Max',
  NULL as '#Dimensional Nominal',
  `+scm+`.EXECUTIONMEASURE.VALUE as 'Value',
  `+scm+`.EXECUTIONMEASURE.DELETED as Deleted,
  `+scm+`.EXECUTIONMEASURE.NOTDETECTED as 'Not Detected',
  `+scm+`.EXECUTIONMEASURE.NOTE as 'Notes',
  `+scm+`.EXECUTIONMEASURE.OPERATOR as 'Operator',
  NULL as '#Route',
  `+scm+`.TRACEABILITYTAGRESULT.NAME as 'Inspection Name',
  `+scm+`.TRACEABILITYTAGRESULT.VALUE as 'Inspection Value',
  NULL as '#Part',
  NULL as '#Sample',
  NULL as '#Assignable Cause',
  NULL as '#Corrective Action'
  from `+scm+`.EXECUTIONMEASURE
    LEFT JOIN `+scm+`.EXECUTION ON `+scm+`.EXECUTION.id=`+scm+`.EXECUTIONMEASURE.EXECUTION
    LEFT JOIN `+scm+`.MEASURINGINSTRUMENT ON `+scm+`.MEASURINGINSTRUMENT.id=`+scm+`.EXECUTION.MEASURINGINSTRUMENT
    LEFT JOIN `+scm+`.INSPECTIONHISTORY ON `+scm+`.INSPECTIONHISTORY.id=`+scm+`.EXECUTION.INSPECTIONHISTORY
    LEFT JOIN `+scm+`.ROUTE ON `+scm+`.ROUTE.id=`+scm+`.EXECUTION.ROUTE
    LEFT JOIN `+scm+`.JOINTSTATUSVIEW ON `+scm+`.JOINTSTATUSVIEW.INSPECTION_ID=`+scm+`.INSPECTIONHISTORY.INSPECTION
    LEFT JOIN `+scm+`.TRACEABILITYTAGRESULT ON `+scm+`.TRACEABILITYTAGRESULT.EXECUTIONMEASURE=`+scm+`.EXECUTIONMEASURE.ID
    LEFT JOIN `+scm+`.JOINT ON `+scm+`.JOINT.ID=`+scm+`.INSPECTIONHISTORY.JOINT
    LEFT JOIN `+scm+`.JOINTHISTORY ON `+scm+`.JOINTHISTORY.ID=`+scm+`.JOINT.HISTCURRENT
    LEFT JOIN `+scm+`.MEASUREMENTUNIT ON `+scm+`.MEASUREMENTUNIT.ID=`+scm+`.JOINTHISTORY.MEASUREMENTUNIT
    WHERE (EXECUTIONDATE >='`+fr+`' AND EXECUTIONDATE<='`+to+`') `+aq+`
    ORDER BY EXECUTIONDATE DESC OFFSET `+(lim.curr||0)+` ROWS FETCH NEXT `+(lim.inc||25)+` ROWS ONLY;`,(e,rw)=>{if(e)try{return res.send(parseSend(null,rw)); }catch(ee){return; }
      try{res.send(parseSend(null,rw)); }catch(ee){} }); 
   });
/////////////////////////////////////////////
/////////////////////////////////////////////
//            REPORT
/////////////////////////////////////////////
/////////////////////////////////////////////
app.post("/report/curr",(req,res)=>{res.send(parseSend(CUR_REP.err,CUR_REP.rows,{fr:MON_SET.fr,to:MON_SET.to})); });
/////////////////////////////////////////////
/////////////////////////////////////////////
//            EXTRAS
/////////////////////////////////////////////
/////////////////////////////////////////////
const TASKS={_tls:["day","mn_shf_1","mn_shf_2","mn_shf_3"],
  day:cron.schedule('* * * * * *',()=> {console.log('will execute every minute until stopped'); }),
  mn_shf_1:cron.schedule('* * * * * *',()=> {console.log('will execute every minute until stopped'); }),
  mn_shf_2:cron.schedule('* * * * * *',()=> {console.log('will execute every minute until stopped'); }),
  mn_shf_3:cron.schedule('* * * * * *',()=> {console.log('will execute every minute until stopped'); }),
  upFrtDay:()=>{let nd=new Date();nd.setHours(0 ),nd.setMinutes(0 ),nd.setSeconds(0 );MON_SET.fr=getCrTimDt(nd);
                    nd=new Date();nd.setHours(23),nd.setMinutes(59),nd.setSeconds(59);MON_SET.to=getCrTimDt(nd); },
  upFrtShf:(fr="",to="",m=false)=>{let fs=fr.split(":"),ts=to.split(":");
                let nd=new Date();nd.setHours(fs[0]||0),nd.setMinutes(fs[1]||0),nd.setSeconds(fs[2]||0);MON_SET.fr=getCrTimDt(nd);
                let nd_n=new Date();if(m)nd_n.setDate(nd_n.getDate()+1);nd_n.setHours(ts[0]||6),nd_n.setMinutes(ts[1]||0);nd_n.setSeconds(ts[2]||0);MON_SET.to=getCrTimDt(nd_n); },
  getCurShf(){let mn_shf_1=MON_SET.mn_shf_1,mn_shf_2=MON_SET.mn_shf_2,mn_shf_3=MON_SET.mn_shf_3;
    let fs=mn_shf_1.split(":"),ss=mn_shf_2.split(":"),ts=mn_shf_3.split(":");
    let fd=new Date(),sd=new Date(),td=new Date(),cd=new Date();let ccd=DtToInt(getCrTimDt(cd))
    fd.setHours(fs[0]||0),fd.setMinutes(fs[1]||0),fd.setSeconds(fs[2]||0);let rfd=getCrTimDt(fd);let cfd=DtToInt(rfd);
    sd.setHours(ss[0]||0),sd.setMinutes(ss[1]||0),sd.setSeconds(ss[2]||0);let rsd=getCrTimDt(sd);let csd=DtToInt(rsd);
    td.setHours(ts[0]||0),td.setMinutes(ts[1]||0),td.setSeconds(ts[2]||0);let rtd=getCrTimDt(td);let ctd=DtToInt(rtd);
    if(cfd<=ccd&&csd>ccd)return{fr:rfd,to:rsd};
    if(csd<=ccd&&ctd>ccd)return{fr:rsd,to:rtd};
      fd.setDate(fd.getDate()+1);cfd=getCrTimDt(fd);
    if(ctd<=ccd&&cfd>ccd)return{fr:rtd,to:rfd};
  },
  stopAll(){for(let i=0;i<this._tls.length;i++){let ct=this._tls[i];if(this[ct])this[ct].stop(); }; }
};

global.ldbs.addEventListener("onReady",()=>{global.ldbs.query("SELECT*FROM monset;",(a,b)=>{if(a)return;let ms={};if(b&&typeof b=="object")for(let i=0;i<b.length;i++){let bi=b[i];if(bi&&bi.keynme){ms[bi.keynme]=bi.keyval; }};updateTasks(ms.mn_typ,ms.mn_shf_1,ms.mn_shf_2,ms.mn_shf_3); },global.ldbs._ALL); });

updateTasks=(mn_typ="day",mn_shf_1="6:30:00",mn_shf_2="15:30:00",mn_shf_3="22:30:00")=>{let crsh={};
  MON_SET.mn_typ=mn_typ;MON_SET.mn_shf_1=mn_shf_1;MON_SET.mn_shf_2=mn_shf_2;MON_SET.mn_shf_3=mn_shf_3;

  let t1=mn_shf_1,t_1=[0,0,0];t_1=t1.split(":");t_1=t_1.join(" ");
  let t2=mn_shf_2,t_2=[0,0,0];t_2=t2.split(":");t_2=t_2.join(" ");
  let t3=mn_shf_3,t_3=[0,0,0];t_3=t3.split(":");t_3=t_3.join(" ");

switch(mn_typ){
  case "day":TASKS.stopAll();TASKS.upFrtDay();TASKS.day=cron.schedule('0 0 0 * * *',()=>{TASKS.upFrtDay(); });break;
  case "shift_2":TASKS.stopAll();crsh=TASKS.getCurShf();MON_SET.fr=crsh.fr;MON_SET.to=crsh.to;
        TASKS.mn_shf_1=cron.schedule(t_1+' * * *',()=>{TASKS.upFrtShf(t1,t2); });
        TASKS.mn_shf_2=cron.schedule(t_2+' * * *',()=>{TASKS.upFrtShf(t2,t3); });break;

  case "shift_3":TASKS.stopAll();crsh=TASKS.getCurShf();MON_SET.fr=crsh.fr;MON_SET.to=crsh.to;
        TASKS.mn_shf_1=cron.schedule(t_1+' * * *',()=>{TASKS.upFrtShf(t1,t2); });
        TASKS.mn_shf_2=cron.schedule(t_2+' * * *',()=>{TASKS.upFrtShf(t2,t3); });
        TASKS.mn_shf_3=cron.schedule(t_3+' * * *',()=>{TASKS.upFrtShf(t3,t1,true); });break;
  };
}

cron.schedule('0 * * * * *',()=>{repInterv(MON_SET.fr,MON_SET.to,(e,rw)=>{CUR_REP.rows=rw;CUR_REP.err=e;console.log("REPORT",MON_SET.fr,MON_SET.to); }); });

app.get('/favicon.ico',(req,res)=>{res.sendFile(__dirname+'/cont/logo.png'); });
app.get('/',(req,res)=>{res.sendFile(__dirname+"/panels/monitor/index.html"); });

app.listen(port,()=>{console.log(port); });