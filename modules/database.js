const Connection=require('tedious').Connection;
const WebRes = require('../support/js/webres');
const ConnectionPool=require('./tedious_pool');
const Request=require('tedious').Request;
const TYPES=require('tedious').TYPES;
const sqlite3=require('sqlite3');

const DB_POOL=2;
const DB_NORM=1;
const DB_CONN_TYP=DB_NORM;

class Dbs{setting={schema:"atlascopco",connected:false,error:""};config={server:'localhost',authentication:{type:'default',options:{userName:'sa',password:'Password@123' } },
options:{encrypt:true,enableArithAbort:true,database:'QASUPERVISOR',trustedConnection:true,trustServerCertificate:true,port:49680 } };
mysql=null;res_mssql_1=null;maxCon=10;_que=[];_curQue=false;

nxtQry=()=>{if(!this.mysql)return setTimeout(()=>{this.nxtQry(); },1000);if(this._curQue||this._que.length<=0)return;this._curQue=true;
let cq=this._que.shift();let q=cq.q,clb=cq.clb;let req=new Request(q,function(e){if(e){clb(e); } });let rows=[];
req.on('row',(rw)=>{let row={};rw.forEach((c)=>{if(!c)return;row[c.metadata.colName]=c.value; });rows.push(row); });
req.on('error',(err)=>{clb(WebRes.CCD.DE,rows);this.nxtQry(); });
req.on('doneInProc',()=>{clb(null,rows);setTimeout(()=>{this._curQue=false;this.nxtQry(); },1); });if(this.mysql)this.mysql.execSql(req); }

query=(q,clb=()=>{})=>{if(!this.mysql)return clb("No db connected"),this._que.push({q:q,clb:clb});this._que.push({q:q,clb:clb});this.nxtQry();
/*let req=new Request(q,function(e){if(e){clb(e); } });let rows=[];
req.on('row',(rw)=>{let row={};rw.forEach((c)=>{if(!c)return;row[c.metadata.colName]=c.value; });rows.push(row); });
req.on('doneInProc',()=>{clb(null,rows); });if(this.mysql)this.mysql.execSql(req);*/ }

end_res_mssql_1=()=>{if(this.res_mssql_1)try{this.res_mssql_1.close();this.res_mssql_1=null; }catch(ee){};this.res_mssql_1=null; }

res_query_1=(q,clb=()=>{})=>{let res_mssql_1=this.res_mssql_1=new Connection(this.config);
    res_mssql_1.on('connect',(err)=>{if(err){this.end_res_mssql_1();return clb(WebRes.CCD.DE,err); };
    let req=new Request(q,function(e){if(e){clb(e); } });let rows=[];
    req.on('row',(rw)=>{let row={};rw.forEach((c)=>{if(!c)return;row[c.metadata.colName]=c.value; });rows.push(row); });
    req.on('doneInProc',()=>{clb(null,rows);setTimeout(()=>{this.end_res_mssql_1(); }); });
    req.on('error',(err)=>{clb(WebRes.CCD.DE,rows);this.end_res_mssql_1(); });
    if(this.res_mssql_1)this.res_mssql_1.execSql(req);
});
    try{res_mssql_1.connect(); }catch(ee){}; }

connect_norm=(clb=()=>{})=>{this.mysql=new Connection(this.config);
    this.mysql.on('connect',(err)=>{if(err){this.setting.connected=false;this.setting.error=err;try{this.mysql&&this.mysql.close(); }catch(ee){};clb(false);return; };
    this.setting.connected=true;this.setting.error="";this.nxtQry();console.log("Connected");clb(true); });

    this.mysql.on('error',(err)=>{this._que=[];setTimeout(()=>{if(!this.setting.connected){try{this.mysql.connect(); }catch(ee){}; } },10000);this.setting.connected=false;this.setting.error=err; });
    this.mysql.on('end',()=>{this._que=[];this.setting.connected=false;setTimeout(()=>{if(!this.setting.connected){try{this.mysql.connect(); }catch(ee){}; } },10000); });
    
    try{this.mysql.connect(); }catch(ee){}; }

connect_pool=(clb=()=>{})=>{this.pool=new ConnectionPool({min:0,max:4,log:true},this.config);
    this.pool.acquire((err,connection)=>{if(err){console.error(err);return; };this.mysql=connection; });
    this.pool.on('error',(err)=>{console.log(err);this.setting.connected=false;this.setting.error=err;clb(false); });
 }

constructor(s,clb){if(s&&typeof s=="object"){this.config.authentication.options.userName=s.db_usr||"sa";this.config.authentication.options.password=s.db_pas||"";this.config.options.database=s.db_nme||"";this.config.options.port=(typeof s.db_prt=="string"?parseInt(s.db_prt):s.db_prt)||49680;this.setting.schema=s.db_scm||"atlascopco"; };if(DB_CONN_TYP==DB_NORM)this.connect_norm(clb);else this.connect_pool(clb); }
}

class LDbs extends EventTarget{dbReady=false;_onReady=new CustomEvent("onReady");_GET=1;_RUN=2;_ALL=3;

constructor(){super();this.query();this.db=new sqlite3.Database(__dirname+'/dblog/creds.db');this.dbReady=true;setTimeout(()=>{this.dispatchEvent(this._onReady);
    //this.initTables((e,d)=>{console.log(e,d); });
 },1); }

query(q="",clb=(e)=>{},t=this._RUN){let db=this.db;
    let qfun=()=>{db=this.db;switch(t){case this._GET:db.get(q,clb);break;case this._RUN:db.run(q,clb);break;case this._ALL:db.all(q,clb);break;default:db.run(q,clb); } };
    if(!this.dbReady||!db){this.addEventListener("onReady",qfun); }else qfun(); }

initTables(clb=(e)=>{}){let db=this.db;if(!db)return clb("Db not started");
    db.serialize(()=>{
        db.run("DROP TABLE IF EXISTS creds;",clb);
        db.run("CREATE TABLE creds([id] INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,[uid] NVARCHAR(120) UNIQUE,[pass] NVACHAR(20),[sid] NVARCHAR(32) NULL,[rwmod] NVARCHAR(1));",clb);
        db.run("INSERT INTO creds(uid,pass,rwmod)VALUES('admin','1111','X');",clb);

        db.run("DROP TABLE IF EXISTS dbsset;",clb);
        db.run("CREATE TABLE dbsset([keynme] NVARCHAR[100] PRIMARY KEY NOT NULL UNIQUE,[keyval] NVARCHAR(120));",clb);
        db.run("INSERT INTO dbsset(keynme,keyval)VALUES('db_nme','QASUPERVISOR');",clb);
        db.run("INSERT INTO dbsset(keynme,keyval)VALUES('db_hst','localhost');",clb);
        db.run("INSERT INTO dbsset(keynme,keyval)VALUES('db_prt','49680');",clb);
        db.run("INSERT INTO dbsset(keynme,keyval)VALUES('db_scm','atlascopco');",clb);
        db.run("INSERT INTO dbsset(keynme,keyval)VALUES('db_usr','sa');",clb);
        db.run("INSERT INTO dbsset(keynme,keyval)VALUES('db_pas','password');",clb);

        db.run("DROP TABLE IF EXISTS monset;",clb);
        db.run("CREATE TABLE monset([keynme] NVARCHAR[100] PRIMARY KEY NOT NULL UNIQUE,[keyval] NVARCHAR(120));",clb);
        db.run("INSERT INTO monset(keynme,keyval)VALUES('mn_typ','day');",clb);
        db.run("INSERT INTO monset(keynme,keyval)VALUES('mn_shf_1','06:30:00');",clb);
        db.run("INSERT INTO monset(keynme,keyval)VALUES('mn_shf_2','14:30:00');",clb);
        db.run("INSERT INTO monset(keynme,keyval)VALUES('mn_shf_3','22:30:00');",clb);
    }); }
}

module.exports={Dbs,LDbs};