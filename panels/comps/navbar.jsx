class Nav extends React.Component{

constructor(a){super(); }

render(){return(<div className='navbar'> <img src="/cont/logo.png"/> <span className='title'>ERGEN</span>
 <i className="fa-solid fa-right-from-bracket" onClick={()=>{localStorage.setItem("sid","");localStorage.setItem("rwmod","");window.location.reload(); }}></i></div> ); }
}