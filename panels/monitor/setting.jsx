///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
//                    MON SET
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
class MonSet extends Panel{constructor(){super();this.sspRef=React.createRef();this.olpRef=React.createRef();this.nwpRef=React.createRef();
  this.dbNmeRef=React.createRef();this.dbScmRef=React.createRef();this.dbUsrRef=React.createRef();this.dbPasRef=React.createRef();this.dbPrtRef=React.createRef();
  this.mtypRef=React.createRef();this.shf_1Ref=React.createRef();this.shf_2Ref=React.createRef();this.shf_3Ref=React.createRef();
  this.shf_1iRef=React.createRef();this.shf_2iRef=React.createRef();this.shf_3iRef=React.createRef(); };

_paslis(d){let r=d.res;
  if(r==WebRes.CCD.LCN)return this.showToast("Old or New password length should be more than 6","error");
  if(r==WebRes.CCD.MCN)return this.showToast("Old or New password length should be less than 11","error");
  if(r==WebRes.CCD.WP)return this.showToast("Password not matched with your account details","error");
  if(r==WebRes.CCD.INP)return this.showToast("Something issue with login data","error");
  if(r==WebRes.CCD.UNF)return this.showToast("User Not found Or Password Not match","error");
  if(r)return this.showToast("Something Issue","error");
  this.showToast("Password changed","success"); }

_dstlis(d){let r=d.res,q=d.query;
  if(r==WebRes.CCD.DE){return this.showToast("Database Error : "+((q&&q.code&&q.code=="ELOGIN")?"Mismatched Database setting or password,username or database name":"")); }
  if(r)return this.showToast("Something Issue","error");
  this.showToast("Database setting Saved","success"); }

_dsglis(d){let r=d.res;let q=d.query;
  if(r==WebRes.CCD.DE)return this.showToast("Database Error");
  if(r)return this.showToast("Something Issue","error");
  let elm={db_nme:this.dbNmeRef.current,db_scm:this.dbScmRef.current,db_usr:this.dbUsrRef.current,db_pas:this.dbPasRef.current,db_prt:this.dbPrtRef.current};
  if(q&&typeof q=="object")for(let i=0;i<q.length;i++){let qi=q[i];if(qi&&qi.keynme){if(elm[qi.keynme])elm[qi.keynme].value=qi.keyval; } }; }

_msglis(d){let r=d.res;let q=d.query;console.log(r,q);
  if(r==WebRes.CCD.DE)return this.showToast("Database Error");
  if(r)return this.showToast("Something Issue","error");
  let elm={mn_typ:this.mtypRef.current,mn_shf_1:this.shf_1iRef.current,mn_shf_2:this.shf_2iRef.current,mn_shf_3:this.shf_3iRef.current };
  if(q&&typeof q=="object")for(let i=0;i<q.length;i++){let qi=q[i];if(qi&&qi.keynme){if(elm[qi.keynme])elm[qi.keynme].value=qi.keyval; } };this.mtypChange({target:elm.mn_typ}); }

_mstlis(d){let r=d.res,q=d.query;
  if(r==WebRes.CCD.DE){return this.showToast("Database Error : "); }
  if(r)return this.showToast("Something Issue","error");
  this.showToast("Database setting Saved","success"); }

render(){return(
<div className="mainMonPan">
  <div className="pure-g pure-u-1-2 setPanArr">
    <div className="setPanArr-slot">
      <div className="pure-u-1-1"><label className="pure-u-1-2">Old password : </label><span className="pure-u-1-2"><input ref={this.olpRef} type="text" maxLength={10}/></span></div>
      <div className="pure-u-1-1"><label className="pure-u-1-2">New password : </label><span className="pure-u-1-2"><input ref={this.nwpRef} type="text" maxLength={10}/></span></div>
      <div className="pure-u-1-1 sv_psw_but_p" onClick={()=>{let npval=this.nwpRef.current.value,opval=this.olpRef.current.value;if(npval.length<6)return this.showToast("new password length should be greator than 6","warning");this.callReqs("pass",{nPass:npval,oPass:opval}); }}>
        <span className="pure-u-7-8 sv_psw_but"><i className="fa-solid fa-key"></i> Save Password</span>
      </div>
    </div>

    <div className="setPanArr-slot">
      <div className="pure-u-1-1"><label className="pure-u-1-2">Database Name : </label><span className="pure-u-1-2"><input ref={this.dbNmeRef} maxLength={100}/></span></div>
      <div className="pure-u-1-1"><label className="pure-u-1-2">Port : </label><span className="pure-u-1-2"><input ref={this.dbPrtRef} maxLength={5}/></span></div>
      <div className="pure-u-1-1"><label className="pure-u-1-2">Schema : </label><span className="pure-u-1-2"><input ref={this.dbScmRef} maxLength={100}/></span></div>
      <div className="pure-u-1-1"><label className="pure-u-1-2">User Name : </label><span className="pure-u-1-2"><input ref={this.dbUsrRef} maxLength={100}/></span></div>
      <div className="pure-u-1-1"><label className="pure-u-1-2">Password : </label><span className="pure-u-1-2"><input ref={this.dbPasRef} maxLength={100}/></span></div>

      <div className="pure-u-1-1 sv_psw_but_p" onClick={()=>{
        let dbnme=this.dbNmeRef.current.value,dbscm=this.dbScmRef.current.value,dbusr=this.dbUsrRef.current.value,dbpas=this.dbPasRef.current.value,dbprt=this.dbPrtRef.current.value;
        if(dbpas.length<4)return this.showToast("Password should be more than 4 charactor");this.callReqs("dbs_update",{db_nme:dbnme,db_scm:dbscm,db_usr:dbusr,db_pas:dbpas,db_prt:dbprt}); }}>
        <span className="pure-u-7-8 sv_psw_but"><i className="fa-solid fa-gear"></i> Save Database Settings</span>
      </div>
    </div>

    {<div className="setPanArr-slot">
      <div className="pure-u-1-1">
        <label className="pure-u-1-2">Monitoring Type : </label>
        <span className="pure-u-1-2">
          <select ref={this.mtypRef} onChange={(e)=>this.mtypChange(e)}>
            <option value="day">Day</option>
            <option value="shift_2">Shift 2</option>
            <option value="shift_3">Shift 3</option>
          </select>
        </span>
      </div>
      <div className="pure-u-1-1" ref={this.shf_1Ref}><label className="pure-u-1-2">Shift 1 : </label><span className="pure-u-1-2"><pick-time ref={this.shf_1iRef}/></span></div>
      <div className="pure-u-1-1" ref={this.shf_2Ref}><label className="pure-u-1-2">Shift 2 : </label><span className="pure-u-1-2"><pick-time ref={this.shf_2iRef}/></span></div>
      <div className="pure-u-1-1" ref={this.shf_3Ref}><label className="pure-u-1-2">Shift 3 : </label><span className="pure-u-1-2"><pick-time ref={this.shf_3iRef}/></span></div>

      <div className="pure-u-1-1 sv_psw_but_p" onClick={()=>{
        let mn_typ=this.mtypRef.current.value,mn_shf_1=this.shf_1iRef.current.value,mn_shf_2=this.shf_2iRef.current.value,mn_shf_3=this.shf_3iRef.current.value;
        this.callReqs("mon_update",{mn_typ:mn_typ,mn_shf_1:mn_shf_1,mn_shf_2:mn_shf_2,mn_shf_3:mn_shf_3}); }}>
        <span className="pure-u-7-8 sv_psw_but"><i className="fa-solid fa-gear"></i> Save Monitoring Settings</span>
      </div>
    </div>}

  </div>
</div>); }

mtypChange=(e)=>{if(e&&e.target){let t=e.target;let sh1=this.shf_1Ref.current,sh2=this.shf_2Ref.current,sh3=this.shf_3Ref.current;let v=t.value;
  if(v=="day"){sh1.style.display=sh2.style.display=sh3.style.display="none"; }else 
  if(v=="shift_2"){sh1.style.display=sh2.style.display="block";sh3.style.display="none"; }else 
  if(v=="shift_3"){sh1.style.display=sh2.style.display=sh3.style.display="block"; }; } }

componentDidMount(){
  let mtypRef=this.mtypRef.current;this.mtypChange({target:mtypRef});
  this.updtReqs("pass","/usr/password/update",this._paslis.bind(this));
  this.updtReqs("dbs_get","/dbs/settings",this._dsglis.bind(this));
  this.updtReqs("dbs_update","/dbs/settings/update",this._dstlis.bind(this));

  this.updtReqs("mon_get","/mon/settings",this._msglis.bind(this));
  this.updtReqs("mon_update","/mon/settings/update",this._mstlis.bind(this));
  this.initReqs();this.callReqs("dbs_get");this.callReqs("mon_get");
  }
}