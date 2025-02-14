///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
//                    NAVBAR
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
class NavSide extends React.Component{constructor(){super();this.navRef=React.createRef();this.actRef=React.createRef();this.pasRef=React.createRef();this.modRef=React.createRef(); }
slideState=false;extDat={val:{bcdid:"",divid:null}};TabNme={DevStt:2};

state={nlb:[{comp:<div><i className="fa-solid fa-chalkboard"></i><span className="link-name">Dahsboard</span></div>,fun:(a)=>{this.props.parent.loadDash(a)} },
{comp:<div><i className="fa-solid fa-file-lines"></i><span className="link-name">Report</span></div>,fun:(a)=>this.props.parent.loadRep(a) },
{comp:<div><i className="fa-solid fa-screwdriver-wrench"></i><span className="link-name">Setting</span></div>,fun:(a)=>this.props.parent.loadSet(a) }
],cTab:0};

render(){return(
<nav ref={this.navRef}>
  <div className="logo-name">
    <span className="logo_name">Monitor</span>
  </div>
  <div className="menu-items">
    <ul className="nav-links">
      {this.state.nlb.map((a,i)=>{return(<li data-tabid={i} className={i==this.state.cTab?"active":""} key={"nav_"+i} onClick={this.listTab.bind(this)}>{a.comp}</li>); }) }
    </ul>
    <ul className="logout-mode">
      <li  onClick={()=>{localStorage.setItem("sid","");localStorage.setItem("rwmod","");window.location.reload(); }}>
        <div><i className="fa-regular fa-right-from-bracket"></i><span className="link-name">Logout</span></div>
      </li>
      <li className="mode">
        <div>
          <i className="fa-regular fa-moon"></i>
          <div className="link-name">Dark Mode</div>
          <div className="mode-toggle" ref={this.modRef} style={{width:"60px",marginRight:"10px"}}>
            <span className="switch"></span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</nav>); }

fireChange(a){let f=new CustomEvent("themechange",{"detail":a });document.dispatchEvent(f); };

listTab(e){let ct=e.target.parentElement;ct=ct.tagName=="LI"?ct:ct.parentElement;let ind=(ct&&ct.dataset&&parseInt(ct.dataset.tabid));ind=ind>=0?ind:this.state.cTab;
this.setState({cTab:ind});this.state.nlb[ind].fun&&this.state.nlb[ind].fun();COOKIE.set("monit_tab_current",ind); }

renTab=(ct,ed)=>{this.extDat.val=ed;setTimeout(()=>{this.state.nlb[ct]&&this.state.nlb[ct].fun&&this.state.nlb[ct].fun(this.extDat);this.setState({cTab:ct}); });COOKIE.set("monit_tab_current",ct);return; }

componentDidMount(){TABWINDOW=this;let monit_tab_current=COOKIE.get("monit_tab_current")||0;if(monit_tab_current){let mti=parseInt(monit_tab_current);let ts=this.state.nlb.length;if(mti>=ts){mti=ts-1; };if(mti)this.renTab(mti); }
  
let n=this.navRef.current;let m=this.modRef.current;document.onkeyup=(e)=>{let kc=e.keyCode||e.which;
switch(kc){case 27:n.classList.toggle("close");if(n.classList.contains("close")){localStorage.setItem("status","close");this.slideState=false; }else{localStorage.setItem("status","open");this.slideState=true; };this.props.parent.onSlide&&this.props.parent.onSlide(this.slideState);break; } };

m.addEventListener("click",()=>{let db=document.body;document.theme=document.theme=="dark"?"light":"dark";db.classList.toggle("dark");
if(document.theme=="dark"){document.theme="dark";localStorage.setItem("mode","dark");this.fireChange("dark"); }else{document.theme="light";localStorage.setItem("mode", "light");this.fireChange("light"); }; });

let lm=localStorage.getItem("mode"),ls=localStorage.getItem("status");
if(lm&&lm==="dark"){document.theme="dark";document.body.classList.toggle("dark");this.fireChange("dark"); }else{document.theme="light";this.fireChange("light"); }
if(ls&&ls==="close"){this.slideState=false;n.classList.toggle("close"); }else{this.slideState=true; };this.props.parent.onSlide&&this.props.parent.onSlide(this.slideState);

this.state.nlb[this.state.cTab].fun&&this.state.nlb[this.state.cTab].fun(); }

}
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
//                    APP
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
class App extends Panel{state={stk:[],changed:false,dispspl:"flex",cntnt:"",dispcnt:"none",navside:null,slideState:false};scroll={stn:0,ban:0};datInterv=null;

constructor(){super();this.dashRef=React.createRef(); }

shoHid(e,sh){if(sh){e.classList.remove("hidPan");e.classList.add("shoPan"); }else{e.classList.add("hidPan");e.classList.remove("shoPan"); } }

onSlide=(a)=>{this.setState({slideState:a}); }

render(){return(
<div className="App">
  <div className='conatiner' style={{display:this.state.dispcnt}}>{this.state.navside}<div className={"tabPanel "+(this.state.slideState?"opentab":"closetab") }>{this.state.cntnt}</div></div>
</div>); }

htpOut(){setTimeout(()=>{this.setState({dispspl:"none",dispcnt:"block"});GLOBSERV.addEventListener("changedHtrq",()=>{if(!GLOBSERV._hrq)this.setState({dispspl:"none",dispcnt:"block"});else this.setState({dispspl:"flex",dispcnt:"none"}); }); },1); }

datRefr=(sldDir=1)=>{let c=this.dashRef.current;if(c&&c.constructor&&c.constructor.name=="Dashboard"){
let vw=Math.max(document.documentElement.clientWidth||0,window.innerWidth||0);if(this.state.slideState)vw=vw-250;
let sw=document.getElementsByClassName("stkWinPan");let swc=sw[0].children;if(sldDir){this.scroll.stn++; }else this.scroll.stn--;
if(this.scroll.stn<0)this.scroll.stn=swc.length-1;if(this.scroll.stn>=swc.length||this.scroll.stn<0)this.scroll.stn=0;
let bw=document.getElementsByClassName("barWinPan");let bwc=bw[0].children;if(sldDir){this.scroll.ban++; }else this.scroll.ban--;
if(this.scroll.ban<0)this.scroll.ban=bwc.length-1;if(this.scroll.ban>=bwc.length||this.scroll.ban<0)this.scroll.ban=0;
let scw=document.getElementsByClassName("scrollWin")[0];let bcw=document.getElementsByClassName("scrollWin")[1];
for(let i=0;i<swc.length;i++){if(i==this.scroll.stn){this.shoHid(swc[i],true);continue; };this.shoHid(swc[i],false); };
for(let i=0;i<bwc.length;i++){if(i==this.scroll.ban){this.shoHid(bwc[i],true);continue; };this.shoHid(bwc[i],false); };
scw.scrollTo(this.scroll.ban*vw,0);bcw.scrollTo(this.scroll.stn*vw,0); } }

aftMountdMount(){}

loadDash=(a)=>{this.setState({cntnt:<Dashboard ref={this.dashRef} extDat={a} parent={this}/>}); }
loadRep=(a)=>{this.setState({cntnt:<ReportPanel extDat={a}/>}); }
loadSet=(a)=>{this.setState({cntnt:<MonSet extDat={a}/>}); }

componentDidMount(){this.extDat={val:{bcdid:"",divid:null}};this.setState({cntnt:(<Signin onSubmit={(a)=>{if(!a)return this.htpOut();this.setState({navside:<NavSide parent={this}/>});setTimeout(()=>this.aftMountdMount(),1);this.htpOut(); }}></Signin>) }); };

componentWillUnmount(){super.componentWillUnmount(); }

}

const orig=ReactDOM.createRoot(document.getElementById('root'));orig.render(<App/>);