require("./breadcrumbtoc");
require("./maintext");
require("./bigpopup");
require("./xref");
require("./logger");
const helpmessage=[["","南傳大藏經、PTS 逐頁對讀。"]
                  ,["","版本：2020.3.11"]
                  ,["","https://github.com/ksanaforge/pts-viewer/"]]
const xrefdbname="mul";
const dbname="nanchuan"
const setHash=(newobj)=>{
	let hash=document.location.hash.substr(1);
	const p=new URLSearchParams(hash);
	for (var key in newobj){
		p.delete(key);
		if (newobj[key]) p.append(key,newobj[key]);
	}
	document.location.hash="#"+p.toString();
}
const URLParams=()=>{
	let hash=document.location.hash.substr(1);
	const p=new URLSearchParams(hash);
	const out={};
	p.forEach( (v,k)=>out[k]=v);
	return out;
}
new Vue({
	el:"#app",
	methods:{
		nextpage(){
			const pc=this.rawpagecount;
			this.rawpagecount=1;
			this.fetch(this.pagenum,pc);
		},
		prevpage(){
			this.rawpagecount=1;
			this.fetch(this.pagenum,-1);
		},
		morepage(){
			this.fetch(this.pagenum,0,this.rawpagecount+1);
		},
		openxref(db,vpl){
			Dengine.readpage(db,{prefix:vpl,plusminus:-1,pagecount:2},(res,db)=>{
				this.showpopup=true;
				this.xreftext=res;
			});
		},
		closepopup(){
			console.log("closepopup")
			this.showpopup=false;
		},
		clearlog(){
			this.logmessages=[];
		},
		fetch(pn,plusminus,pagecount){
			let prefix=pn;
			if (typeof prefix!=="string") prefix=this.pagenum;
			const t=(new Date()).getMilliseconds()
			Dengine.readpage(dbname,{prefix,plusminus,pagecount},(res,db)=>{
				const elapse=(new Date()).getMilliseconds()-t;
				setHash({q:prefix});
				const pagenum=res[1][0];
				const xref=db.getxrefofpage(pagenum);
				if (!this.gettoc) this.gettoc=db.gettoc;
				this.rawtext=res;
				this.xref=xref;
				this.rawpagecount=pagecount||1;

				setTimeout((function(){
					this.vpl=pagenum;
					const at=pagenum.lastIndexOf(".");
					this.pagenum=pagenum.substr(0,at);
					this.logmessages.unshift("fetch "+prefix+" elapse"+elapse)
				}).bind(this),200);
			})
		},
		selectsid(sid){
			this.fetch(sid);
		},
		log(msg){
			this.logmessages.unshift((new Date()).toISOString()+":"+msg);
		}
	},

	mounted(){
		Dengine.openSearchable(dbname,function(db){
			const {q,i}=URLParams();
			this.pagenum=q?q:"1:1";
			this.db=db;
			this.log(dbname+" opened, built on "+db.getDate());
			Dengine.openSearchable(xrefdbname,function(db){
				this.xrefdb=db;
				this.log(xrefdbname+" opened, built on "+db.getDate());
			}.bind(this));


		}.bind(this));

		setInterval(()=>{
			this.logmessages.pop();
		},10000);

	},
	data(){
		return {
			db:null,xrefdb:null,
			showpopup:false,
			rawtext:helpmessage,
			rawpagecount:1,
			xreftext:[],
			xref:{},
			gettoc:null,
			pagenum:'',
			logmessages:[],
			vpl:'',xrefvpl:''
		}
	}
});