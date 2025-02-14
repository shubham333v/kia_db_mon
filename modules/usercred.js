const {WebSocketServer} = require('ws');
const {v4:uuidv4,v1:uuidv1,v5:uuidv5,v3:uuidv3,validate}=require("uuid");

class UserCred{#user={name:"",psw:null,sid:""};#tuser=[];mysql;

constructor(){this.mysql=global.dbs.mysql; }

allUser=(callback)=>{this.mysql.query("SELECT*FROM creds",(a,b)=>callback&&callback(a,b)); }

ckLoggedin(dat,callback){CredDB.getInfos(["name","psw","sid"],(e,js)=>{if(dat.name==js.name&&dat.psw==js.psw)return callback&&callback(true);if(e==Result.noFound)callback&&callback(false);else callback&&callback(false); }); }

chnSid(req,res,a,bx){let uid=uuidv4()+uuidv1()+uuidv4()+uuidv1()+uuidv1()+uuidv4();
    if(a)return res.end(JSON.stringify({"res":a,data:bx}));
    if(bx.length<=0)return res.end(JSON.stringify({"res":"session expired",data:[]})); 
    global.dbs.mysql.query("UPDATE creds SET sid='"+uid+"' WHERE id='"+bx[0].id+"';SELECT rwmod FROM division WHERE id='"+bx[0].did+"'",(a,b)=>{if(a)return res.end(JSON.stringify({"res":a,data:b}));return res.end(JSON.stringify({"res":a,data:[{id:uid,did:bx[0].did,uid:bx[0].id}],data1:b} )); });
}

lcredin(req,res){let bdy=req.body;//32079af0-502d-4a0d-8efa-1fe0f6c554c2
    if(typeof bdy.sid==="string"){let uid=uuidv4()+uuidv1()+uuidv4()+uuidv1()+uuidv1()+uuidv4();
    global.dbs.mysql.query("SELECT id,did FROM creds WHERE sid='"+bdy.sid+"' AND back=false;",(a,b)=>this.chnSid(req,res,a,b));return; }

    if(typeof bdy.usrid!="string"||typeof bdy.pass!=="string")return res.end(JSON.stringify({res:"invallied parameter",data:[]}));
    global.dbs.mysql.query("SELECT id,did FROM creds WHERE usrid='"+bdy.usrid+"' AND pass='"+bdy.pass+"' AND back=false;",(a,b)=>{
     if(!a){this.chnSid(req,res,a,b); }else res.end(JSON.stringify({res:a,data:b})); }); }

lcredcnp(a,callback){
    if(!(this.#user.sid&&a.sid==this.#user.sid))return callback&&callback({res:Result.session_expired});
    if(!(this.#user.psw&&a.psw==this.#user.psw))return callback&&callback({res:Result.wrongPass});
    if(this.#user.sid&&a.sid==this.#user.sid&&this.#user.psw&&this.#user.psw==a.psw){this.#user.psw=a.pswn;
        let uid=uuidv4()+uuidv1()+uuidv4()+uuidv1()+uuidv1()+uuidv4();this.#user.sid=uid;
    CredDB.onReady(()=>{CredDB.setInfos(this.#user,(r,i)=>{callback&&callback({res:Result.ok,sid:uid}); }); }); } }

lcred(a,callback){if(this.#user.psw==null||this.#user.psw==a.psw){let uid=uuidv4()+uuidv1()+uuidv4()+uuidv1()+uuidv1()+uuidv4();this.#user.sid=uid;
    CredDB.onReady(()=>{CredDB.setInfos(this.#user,(r,i)=>{callback&&callback({res:Result.ok,sid:uid}); }); }); }else return callback&&callback({res:Result.noMatch,sid:null}); }

//deleteUser(){}
}

module.exports={UserCred};