Vue.component('notebutton',{
	props:['note','id'],
	methods:{
		toggle(){
			this.show=!this.show;
		}
	},
	data(){
		return {show:false} 
	},
	render(h) {
		if (this.show) {
			return h('span',{class:'inlinenote',on:{click:this.toggle}},this.note);
		} else{
			return h('span',{class:'notebutton',on:{click:this.toggle}},this.id);
		}
	}
})
const {SEGSEP}=require("dengine");
Vue.component('xrefbutton',{
	props:['xref','openxref'],
	methods:{
		open(){
			const a=this.xref.split(SEGSEP+SEGSEP);
			this.openxref(a[0],a[1]);
		}
	},
	render(h) {
		const a=this.xref.split(SEGSEP+SEGSEP);
		return h('span',{class:'xrefbutton',on:{click:this.open}},a[1]);

	}
})

Vue.component('maintext', { 
	props:['rawtext','xref','openxref'],
	methods:{
		onnote(note){
			alert(note)
		}
	},
	render(h){
		const notes={};
		this.rawtext.map(item=>{
			if (item[2]) { //has note
				let ns=item[2].split("^^");
				for (var i=0;i<ns.length;i++){
					const m=ns[i].match(/^\d+\^/);
					notes[m[0].substr(0,m[0].length-1)]=ns[i].substr(m[0].length);		
				}
			} 
		})

		let text=this.rawtext.map(item=>{
			let extra='';
			if (this.xref[item[0]]) { //link to parallel corpus by vol:page
				extra="<"+this.xref[item[0]]+">";
			}
			return item[1]+extra;
		}).join("<br>");


		//render xref at the line
		text=text.replace(/\^\d+/g,(m,m1)=>"<"+m.substr(1)+">" );

		const children=[];
		let p=0;
		text.replace(/<(.+?)>/g,(m,m1,p1)=>{
			const t=text.substring(p,p1);
			if (t) children.push( h('span',t));
			if (m1=="br") {
				children.push(h('br'));
			} else {
				const note=notes[m1];
				if (note) {
					children.push(h('notebutton',{props:{id:m1,note}}));
				} else {
					children.push(h('xrefbutton',{props:{xref:m1,openxref:this.openxref}}))
				}
			}
			p=p1+m.length;
		})
		children.push(h('span',text.substr(p)));


		return h("div",{class:"maintext"},children);
	}
})