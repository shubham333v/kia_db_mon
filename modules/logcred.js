class LogCred{_cr={};

constructor(){}

update(a,b){this._cr[a]=b; }
delete(a){delete this._cr[a]; }
select(a){return this._cr[a]; }
get count(){let k=Object.keys(this._cr);return k.length; }
}

module.exports=LogCred;