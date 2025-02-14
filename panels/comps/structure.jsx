/////////////////////////////////////////////
/////////////////////////////////////////////
//            PANEL
/////////////////////////////////////////////
/////////////////////////////////////////////
class HTPBase extends React.Component{req={};HTP={req:false,serTout:false,Time_interv:300};

constructor(){super(); }

reqImpl(a){let d=a;let rqn=getNmeByVal(this.req,"path",d.path);let rq=this.req[rqn];if(!rq)return null;if(this.req[rqn].reqid!=d.reqid)return;this.req[rqn].reqid=null;
if(this.HTP.serTout){clearTimeout(this.HTP.serTout);this.HTP.serTout=null };POPPROG.hide();this.HTP.req=false;
if(typeof this.req[rqn].fun=="function")this.req[rqn].fun(a); }

initReqs(){let rq=Object.keys(this.req); }
termReqs(){let rq=Object.keys(this.req); }
updtReqs(name=null,path="",fun=()=>{},reqid=null){if(name==null)return;this.req[name]={path:path,fun:fun,reqid:reqid}; }
callReqs(rqn,p){let rq=this.req[rqn];if(!rq)return null;this.req[rqn].buf=p;if(this.req[rqn].reqid!=null)return;let uuid=generateUUID();this.req[rqn].reqid=uuid;
  HTTP.post({url:rq.path,success:this.reqImpl.bind(this),error:(a)=>{},data:p,reqid:uuid});this.HTP.req=true;if(!this.HTP.serTout)this.HTP.serTout=setTimeout(()=>{POPPROG.show(); },this.HTP.Time_interv);return uuid; };
}


class Panel extends HTPBase{state={list:[],changed:false,listn:[],saved:false};store={};uuid=generateUUID();idName="panel";
showToast(a,b){if(typeof a=="object")a=JSON.stringify(a);if(typeof b=="string")b=TOASTBOX.type[b];TOASTBOX.toast(a,b); }

changed(){this.setState({changed:!this.state.changed}); }

constructor(a){super();if(!a)return;let k=Object.keys(a);for(let i=0;i<k.length;i++)this[k[i]]=a[k[i]]; }

_delRq(){if(!this.devId)return this.parent.remPan(this.uuid);this.callReqs("delete",{devid:this.devId}); }
_rinRq(){if(!this.devId)return this.parent.remPan(this.uuid);this.callReqs("reinit",{devid:this.devId}); }
_savRq(){if(this.req.update.reqid!=null)return;let p={};this.bufrStor();let sr=Object.keys(this.store);for(let i=0;i<sr.length;i++){let ts=this.store[sr[i]];if(ts.send)p[sr[i]]=ts.buf; };p.devid=this.devId;this.callReqs("update",p); }

_updlis(a){let d=a.detail;if(d.reqid!=this.req.update.reqid)return;this.req.update.reqid=null;if(d.res)return this.showToast(d.res,"error");this.devId=d.query.id;this.memoStor();this.isChange(); };

render(){return(<div></div>); }

updtStor(name=null,elm=null,val="",buf="",check=true,match=false,type="value",send=true){if(name==null||elm==null)return;this.store[name]={elm:elm,val:val,buf:buf,check:check,match:match,type:type,send:send};elm.oninput=this.isChange.bind(this); }
bufrStor(){let sr=Object.keys(this.store);for(let i=0;i<sr.length;i++){let ts=this.store[sr[i]];ts.buf=ts.elm[ts.type]; }; }
memoStor(){let sr=Object.keys(this.store);for(let i=0;i<sr.length;i++){let ts=this.store[sr[i]];ts.val=ts.buf; }; }
initStor(){let sr=Object.keys(this.store);for(let i=0;i<sr.length;i++){let ts=this.store[sr[i]];ts.elm[ts.type]=ts.buf=ts.val; };this.isChange(); }

isChange(){let sr=Object.keys(this.store);this.setState({saved:true});for(let i=0;i<sr.length;i++){let ts=this.store[sr[i]];if(ts.elm[ts.type]!=ts.val){return this.setState({saved:false}); } }; }

initPageCtrl(){return(<samp className="pageCtrl">
<span className="datRef" ref={this.datRefRef}><i class="fa-solid fa-retweet"></i></span>
<span className="datCnt"><i className="fa-solid fa-toilet-paper"></i><i ref={this.datCntRef}>{this.LIM.count}</i></span>
<span className="datLmt"><i className="fa-solid fa-stopwatch-20"></i> : <input placeholder="25" maxLength={2} ref={this.datLmtRef}/></span>
<span className="datNxt" ref={this.datPreRef}><i className="fa-solid fa-left-long"></i></span>
<span className="datPre" ref={this.datNxtRef}><i className="fa-solid fa-right-long"></i></span>
</samp>); }

componentWillUnmount(){this.termReqs(); }
}
/////////////////////////////////////////////
/////////////////////////////////////////////
//            LISTPANEL
/////////////////////////////////////////////
/////////////////////////////////////////////
class ListPanel extends HTPBase{LIM={curr:0,inc:25,count:1,total:0,end:false,dir:0,Ctotal:0};state={list:[],changed:false,listn:[],renBoth:false};_idName="div";itemMod=null;
_itmHead=null;_itmMids=null;_itmFoot=null;_enbItmHead=true;_enbItmMids=true;_enbItmFoot=true;req={};uuid=generateUUID();back=false;

showToast(a,b){if(typeof a=="object")a=JSON.stringify(a);if(typeof b=="string")b=TOASTBOX.type[b];TOASTBOX.toast(a,b); }

set idName(a){this._idName=a;this.listClass=a+"ListPanel";this.itemClass=a+"ListItem";this.panelClass=a+"Panel"; }
get idName(){return this._idName; }

get itemHead(){if(this._itmHead!=null)return this._itmHead;return(<div className="listItemHead">Deleted : <span><input type="checkbox" onChange={(e)=>this._lisReq(e)} data-tooltiptext="Show Hide Deleted"/></span></div>); }
set itemHead(a){this._itmHead=a; }

get itemMids(){if(this._itmMids!=null)return this._itmMids;return(<div className='divListItemHead listItemHead'><span>Name</span><span>Type</span><i></i><i></i></div>); }
set itemMids(a){this._itmMids=a; }

get itemFoot(){if(this._itmFoot!=null)return this._itmFoot;return(<div className={'listItem adder listFoot '+this.itemClass} onClick={()=>this.newPan()}><span><i className="fa-solid fa-square-plus" style={{border:"none"}}></i></span></div>); }
set itemFoot(a){this._itmFoot=a; }

getItemMids(a){return(<div className={'listItemMids listItem '+this.itemClass}>{a}</div>); }
getItemHead(a){return(<div className={'listItemHead listItem '+this.itemClass}>{a}</div>); }
getItemFoot(a=null){return(<div className={'listItem adder listFoot '+this.itemClass} onClick={()=>this.newPan()}>{a?a:<span><i className="fa-solid fa-square-plus" style={{border:"none"}}></i></span>}</div>); }

_lisReq(e){let d;if(!e){d=this.back; }else{d=e.target.checked;this.back=d; };this.callReqs(d?"listingback":"listing"); }

changed(){this.setState({changed:!this.state.changed}); }
clrActive(){for(let i=0;i<this.state.list.length;i++){this.state.list[i].class.setActive(false); }; }

changedList(){}

remPan(uid,pn="list"){let d=this.state[pn];for(let i=0;i<d.length;i++){let ci=d[i];if(ci.uuid==uid){this.state[pn].splice(i,1);this.changed();return i; }; };setTimeout(()=>{this.changedList(); },1); }
addPan(iprp,pn="list",im=this.itemMod){let uid=generateUUID();iprp.key=iprp.uid=iprp.uuid=uid;iprp.parent=this;iprp.onInit=(a)=>{cmp.class=a; };let itm=React.createElement(im,iprp);let cmp={};cmp.uuid=uid;cmp.comp=itm;this.state[pn].push(cmp);this.changed();setTimeout(()=>{this.changedList(); },1); }
newPan(pn="list"){this.addPan({name:""},pn);setTimeout(()=>{this.changedList(); },1); }

subing(uid){let d=this.state.list;for(let i=0;i<d.length;i++){let ci=d[i];if(ci.uuid==uid){let sd=this.state.list.splice(i,1)[0];this.state.listn.push(sd);this.changed();
  setTimeout(()=>{sd.class.setBack(true);this.changedList(); });return; }; };  }

adding(uid){let d=this.state.listn;for(let i=0;i<d.length;i++){let ci=d[i];if(ci.uuid==uid){let sd=this.state.listn.splice(i,1)[0];this.state.list.push(sd);this.changed();
  setTimeout(()=>{sd.class.setBack(false);this.changedList(); });return; }; }; }

findPos(a){let d=this.state.list;for(let i=0;i<d.length;i++){let ci=d[i];if(ci.uuid==a){return i} };return-1; }
movedwn(a){let oi=this.findPos(a);let ni=oi+1;let d=this.state.list;if(ni>=d.length)ni=0;d.splice(ni,0,d.splice(oi,1)[0]);this.changed();setTimeout(()=>{this.changedList(); },1); }
moveup(a){let oi=this.findPos(a);let ni=oi-1;let d=this.state.list;if(oi<0)return;if(ni<0)ni+=d.length;if(ni>=d.length)return;d.splice(ni,0,d.splice(oi,1)[0]);this.changed();setTimeout(()=>{this.changedList(); },1); }

constructor(a){super();if(!a)return;let k=Object.keys(a);for(let i=0;i<k.length;i++)this[k[i]]=a[k[i]]; }

render(){let ec=(this._enbItmHead&&this._enbItmMids)?"listPanel-head-2 ":((this._enbItmHead||this._enbItmMids)?"listPanel-head-1 ":"");
return(
<div className={"listPPanel "+this.panelClass}>
  {this._enbItmHead?this.itemHead:null}
  {this._enbItmMids?this.itemMids:null}
  <div className={"listPanel "+ec+this.listClass}>
    {this.state.list.map((d,i)=>{return(d.comp); })}
    {this.state.renBoth&&this.state.listn.map((d,i)=>{return(d.comp); })}
    {this._enbItmFoot?this.itemFoot:null}
  </div>
</div>); }

componentWillUnmount(){this.termReqs(); }
}
/////////////////////////////////////////////
/////////////////////////////////////////////
//            LISTITEM
/////////////////////////////////////////////
/////////////////////////////////////////////
class ListItem extends Panel{state={saved:true,active:false,back:false};parent={};store={};req={};reqs={delete:null,update:null};

menuUpDw=<i className='updwnArr'><i className="fa-solid fa-sort-up up" onClick={()=>{this.setActive(true);this.parent.moveup(this.uuid); }}></i>
<i className="fa-solid fa-sort-down dwn" onClick={()=>{this.setActive(true);this.parent.movedwn(this.uuid); }}></i></i>;

showToast(a,b){if(typeof a=="object")a=JSON.stringify(a);if(typeof b=="string")b=TOASTBOX.type[b];TOASTBOX.toast(a,b); }

changed(){this.setState({change:!this.state.change}); }

constructor(a){super();this.req={delete:{path:"/lcred/delete",fun:this._dellis.bind(this),reqid:null},update:{path:"/lcred/update",fun:this._updlis.bind(this),reqid:null},reinit:{path:"/lcred/reinit",fun:this._dellis.bind(this)}};if(!a)return;let k=Object.keys(a);for(let i=0;i<k.length;i++)this[k[i]]=a[k[i]];this.onInit&this.onInit(this);this.listItemMenu=React.createRef(); }

setActive(a){if(a)this.parent.clrActive();this.setState({active:a});if(!a)this.setActiveMenu(false); }
setActiveMenu(e,a){let c=this.listItemMenu.current;if(!c)return;let cc=c.children;if(!cc)return;for(let i=0;i<cc.length;i++)cc[i].classList.remove("activeMenu");
if(a&&e&&e.target)e.target.classList.add("activeMenu"); }
setBack(a){this.setState({back:a}); }

_dellis(a){let d=a.detail;if(d.reqid!=this.req.delete.reqid)return;if(d.res)return this.showToast(d.res,"error");this.req.delete.reqid=null;if(d.query&&d.query.id&&d.query.id==this.devId){this.parent.remPan(this.uuid); } };
_updlis(a){let d=a.detail;if(d.reqid!=this.req.update.reqid)return;this.req.update.reqid=null;if(d.res)return this.showToast(typeof d.res=="string"?d.res:JSON.stringify(d.res),"error");this.devId=d.query.id;this.memoStor();this.isChange(); };

render(a=null){return(<div className={"listItem "+this.props.parent.itemClass}>{a}</div>); }

}
/////////////////////////////////////////////
/////////////////////////////////////////////
//            LISTITEMPANEL
/////////////////////////////////////////////
/////////////////////////////////////////////
class ListPanelItem extends ListPanel{LIM={curr:0,inc:25,count:1,total:0,end:false,dir:0,Ctotal:0};

constructor(a){super(a);this.req={delete:{path:"/lcred/delete",fun:this._dellis.bind(this),reqid:null},update:{path:"/lcred/update",fun:this._updlis.bind(this),reqid:null},reinit:{path:"/lcred/reinit",fun:this._dellis.bind(this)}};this.onInit&this.onInit(this); }

setActive(a){if(a)this.parent.clrActive();this.setState({active:a}); }
setBack(a){this.setState({back:a}); }

_dellis(a){let d=a.detail;if(d.res)return;if(d.reqid!=this.req.delete.reqid)return;this.req.delete.reqid=null;if(d.query&&d.query.id&&d.query.id==this.devId){this.parent.remPan(this.uuid); } };
_updlis(a){let d=a.detail;if(d.res)return;if(d.reqid!=this.req.update.reqid)return;this.req.update.reqid=null;this.devId=d.query.id;this.memoStor();this.isChange(); };

isChange(){let sr=Object.keys(this.store);this.setState({saved:true});for(let i=0;i<sr.length;i++){let ts=this.store[sr[i]];if(ts.elm[ts.type]!=ts.val){return this.setState({saved:false}); } }; }

componentWillUnmount(){this.termReqs(); }
}