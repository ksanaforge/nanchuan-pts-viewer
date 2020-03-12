Vue.component('bigpopup',{
	props:{
		'show':{type:Boolean,default:false}
		,'onclose':{type:Function,required:true}
	},
	template:`<div class="bigpopup" v-show="show">
			<span class="closebigpopup" @click="onclose">╳</span>
			<slot>nothing</slot>
		</div>
	`,
	methods:{
	}
});