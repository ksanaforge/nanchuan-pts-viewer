Vue.component('xref',{
	props:{
		'text':{required:true}
	},

	methods:{
	},
	render(h){
		const children=[];
		this.text.map(item=>{
			children.push( h("tr"),[h("td",item[0]) ,h("td",{"class":"xreftext"},item[1])]);
		})
		return h('table',{},children)
	}
});