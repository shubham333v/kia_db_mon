const Dbs=require("./modules/database");
const express=require('express');
const app=express();
const port=3000;
const WebRes=require("./support/js/webres.js");
const LogCred=require("./modules/logcred.js");
const LOGCRED=new LogCred();
const {v4:uuidv4,v1:uuidv1,v5:uuidv5,v3:uuidv3,validate}=require("uuid");
const bcrypt=require('bcrypt');

const DOMNAME="qa.ergen";
const APPNAME="qa_ergen";

global.DOMNAME=DOMNAME;
global.APPNAME=APPNAME;


app.use(express.json());
app.use("/support",express.static(__dirname+"/support"));
app.use("/panels",express.static(__dirname+"/panels"));
app.use("/cont",express.static(__dirname+"/cont"));
app.use("/tpanels",express.static(__dirname+"/panels/custumer/"));

app.use(function(req, res, next){
  res.header('Access-Control-Allow-Origin',"*");
  res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');next();
/*  let rpp=req._parsedUrl.pathname;
  if(rpp=="/tmp"||rpp=="/countdown"||rpp=="/lcredin"||rpp=="/mcredin")return next();
  if(valAuth("P",rpp))return next();
  if(req.headers.rwmod=="C"&&valAuth("C",rpp))return next();
  if(req.headers.rwmod=="M"&&valAuth("M",rpp))return next();
  if(!req.headers.sid){res.set("auth",false);res.set("reasion","no auth parameters session");return res.end(); }
  if(!req.headers.uid){res.set("auth",false);res.set("reasion","no auth parameters user");return res.end(); }

  global.dbs.mysql.query("SELECT creds.id as uid,creds.sid,creds.did,creds.nme,division.rwmod FROM creds JOIN division ON division.id=creds.did WHERE creds.sid='"+req.headers.sid+"' AND creds.id='"+req.headers.uid+"' AND creds.back=false;",(a,b)=>{if(a)return failAuth(req,res,a,"request");if(b.length<1)return failAuth(req,res,"session expired","request");
  if(!valAuth(b[0].rwmod,req.url))return failAuth(req,res,"no authorize access","request");req.body.usr={};res.set("sid",req.headers.sid);res.set("uid",b[0].uid);
  req.body.usr.did=b[0].did;req.body.usr.uid=b[0].uid;req.body.usr.rwmod=b[0].rwmod;res.set("nme",b[0].nme);res.set("auth",true);res.set("rwmod",b[0].rwmod);res.set("authtype","request");return next(); });return;*/
});

function genSid(){return uuidv4()+uuidv1()+uuidv4()+uuidv1()+uuidv1()+uuidv4(); }
/////////////////////////////////////////////
/////////////////////////////////////////////
//            FUNCTIONS
/////////////////////////////////////////////
/////////////////////////////////////////////
function valAuth(rwm,url){
  let CAuth=["/devs/spec","/trp","/labs","/","/repreq/update","/warreq","/repreq","/repreq/c"];
  let MAuth=["/devs","/mon","/devs/mon/seq/targ","/devs/seq/targ","/parm/r","/divs/w","/report/mon/day","/report/bcdid","/notif","/targs/tarid","/targs/mo_num","/usr/password/update","/stacks/count"];
  let PAuth=["/","/trp","/mon","/favicon.ico","/lcredin","/devs/qrcd","/devs/qrpr","/rep/res"];
  if(rwm=="C"){for(let i=0;i<CAuth.length;i++)if(CAuth[i]==url)return true;return false; }//customer
  if(rwm=="M"){for(let i=0;i<MAuth.length;i++)if(MAuth[i]==url)return true;return false; }//monitor
  if(rwm=="P"){for(let i=0;i<PAuth.length;i++)if(PAuth[i]==url)return true;return false; }//public
}
function failAuth(req,res,rgn,typ){res.set("auth",false);res.set("authtype",typ);res.set("reasion",rgn);res.end(); }
function parseSend(a,b,c){return JSON.stringify({"res":a,data:b,extra:c}); }
function demerge(a){let al={};for(let i=0;i<a.length;i++){al[a[i].did]=al[a[i].did]||[];al[a[i].did].push(a[i]); };return al; }
function demergeByNme(a){let al={};for(let i=0;i<a.length;i++){al[a[i].divnme]=al[a[i].divnme]||[];al[a[i].divnme].push(a[i]); };return al; }

function isString(a){return typeof a=="string"; }
function areStrings(a){for(let i=0;i<a.length;i++){if(typeof a[i]!="string")return false; }return true; }
function randomString(l){let ca="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ~`!@#$%^&*()_+-={}[]:\";\'<>?,./|\\";let r='';
for(let i=l;i>0;--i)r+=ca[Math.floor(Math.random()*ca.length)];return r; }
function addZero(str){return str<10?('0'+str):str; }
function getCrTimDt(){let cdt= new Date();return addZero(cdt.getFullYear())+"-"+addZero(cdt.getMonth()+1)+"-"+addZero(cdt.getDate())+" "+addZero(cdt.getHours())+":"+addZero(cdt.getMinutes())+":"+addZero(cdt.getSeconds()); }
function getCrDt(d){let cdt=d||new Date();return addZero(cdt.getFullYear())+"-"+addZero(cdt.getMonth()+1)+"-"+addZero(cdt.getDate()); }

//////////////////////////////////////////////////////////////////////
///////////// ARRAY END
/////////////////////////////////////////////////////////////////////
function chnSid(req,res,a,bx,atp="login"){let sid=genSid();if(a)return failAuth(req,res,a,atp);if(bx.length<=0)return failAuth(req,res,"session expired",atp);let cb=bx[0];
let uid=cb.id;global.dbs.mysql.query("UPDATE creds SET sid='"+sid+"' WHERE id='"+cb.id+"';",(a2,b2)=>{if(a2)return failAuth(req,res,a2,atp);res.set("sid",sid);res.set("auth",true);res.set("nme",cb.nme);res.set("uid",uid+"");res.set("rwmod",cb.rwmod);res.set("authtype",atp);return res.end(JSON.stringify({"res":null,data:[] }) );} ); }

function chnMSid(req,res,a,bx,atp="login",p){let sid=genSid();if(a)return failAuth(req,res,a,atp);if(bx.length<=0)return failAuth(req,res,"No user found",atp);let cb=bx[0];
let uid=cb.id;if(atp=="login"&&!bcrypt.compareSync(p,cb.pass))return failAuth(req,res,"Wrong password",atp);
global.dbs.mysql.query("UPDATE mailgrp SET sid='"+sid+"' WHERE id='"+cb.id+"';",(a2,b2)=>{if(a2)return failAuth(req,res,a2,atp);res.set("sid",sid);res.set("auth",true);res.set("authtype",atp);res.set("uid",uid+"");return res.end(JSON.stringify({"res":null,data:[] }) );} ); }

app.post("/lcredin",(req,res)=>{let bdy=req.body;if(typeof bdy.sid==="string"&&typeof bdy.uid=="string"){global.dbs.mysql.query("SELECT creds.id,did,creds.nme,rwmod,division.nme as divnme FROM creds LEFT JOIN division ON division.id=did  WHERE sid='"+bdy.sid+"' AND creds.id='"+bdy.uid+"' AND creds.back=false;",(a,b)=>chnSid(req,res,a,b,"session"));return; };if(typeof bdy.usrid!="string"||typeof bdy.pass!=="string")return failAuth(req,res,"invallied parameter","login");global.dbs.mysql.query("SELECT creds.id,did,creds.nme,rwmod,division.nme as divnme FROM creds LEFT JOIN division ON division.id=did  WHERE usrid='"+bdy.usrid.toUpperCase()+"' AND pass='"+bdy.pass+"' AND creds.back=false;",(a,b)=>{chnSid(req,res,a,b,"login"); }); });
/////////////////////////////////////////////
/////////////////////////////////////////////
//            EXTRA
/////////////////////////////////////////////
/////////////////////////////////////////////
app.get('/favicon.ico',(req,res)=>{res.sendFile(__dirname+'/cont/logo.png'); });
app.get('/',(req,res)=>{res.sendFile(__dirname+"/panels/monitor/index.html"); });