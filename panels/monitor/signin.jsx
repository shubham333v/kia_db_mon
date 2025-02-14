class Signin extends React.Component {

ckandupdt(ck){HTTP.post({url:"/lcredin",success:(a,b)=>{if(a.auth=="false")return this.props.onSubmit(false);this.props.onSubmit(true); },
error:(a)=>console.log(a),data:JSON.stringify(ck?{sid:localStorage.getItem("sid"),uid:localStorage.getItem("uid")}:{uid:this.usrid.value,pass:this.pass.value}) }); }

render(){return(
<div className="loginPanel">
<div className="login">
  <h4>Login</h4>
  <div className='form'>
    <div className="text_area">
      <input type="text" id="userid" name="userid" defaultValue="" placeholder='userid' className="text_input" required autoComplete="off"/>
    </div>
    <div className="text_area">
      <input type="password" id="password" name="password" defaultValue="" placeholder='password' className="text_input" required autoComplete="off"/>
    </div>
    <input type="submit" value="LOGIN" className="btn" onClick={()=>this.ckandupdt()}/>
  </div>
</div></div>); }

componentDidMount(){POPPROG.hide();
    this.usrid=document.getElementById("userid");
    this.pass=document.getElementById("password");
    let sid=localStorage.getItem("sid");
    let uid=localStorage.getItem("uid");
    if(sid&&sid!="undefined"&&uid&&uid!="undefined")this.ckandupdt(true);else this.props.onSubmit(false);
  }
}