const pat1=/(\d+):(\d+)/

const volsname={
	vin:1,	v:1,
	d:6,dn:6,m:9,mn:9,s:12,sn:12,a:17,an:17,
	ja:30,
	pts: 38,//Paṭis
}

/* snp.經集號 dhp */
//PED citation
const volname={
"khp": 22,   "ud": 24,  "iti": 25,
  'vv': 27,  'pv': 28,  'thag': 29,  'thig': 29,
  'mnd': 36,
  'cnd': 37,
  'ap': 40,
  'bv': 41,
  'dhs': 43,
  'vb': 44,
  'Dhātuk': 45, //from 1~113
  'DhkA': 45,   //from pg114
  'Pp': 46,
  'Kv': 47, //論事
  'Yam': 48,//雙論
  'Paṭṭh': 50,
}
const romanvol={
	"i":1,"ii":2,"iii":3,"iv":4,"v":5,"vi":6,"vii":7,"viii":8,"ix":9,"x":10
}
const pat2=/([a-zA-Z]+)\.([ivxIVX]+)[,\.](\d+)/ //multi volumn bookname
const pat3=/(\S+)\.(\d+)/ //single volumn bookname
/*
 Vin.II,237
*/
module.exports=str=>{
	if ( parseInt(str).toString()==str ) {
		return [str,1];
	}
	let m=str.match(pat1);
	if (m) {
		return [m[1],m[2]];
	}

	m=str.match(pat2);
	if (m){
		const start=volsname[m[1].toLowerCase()]
		if (!start) return null;

		const rv=romanvol[m[2].toLowerCase()];
		if (!rv)return null;
		return [start+rv-1,m[3]]
	}

	m=str.match(pat3);
	if (m) {

		const start=volname[m[1].toLowerCase()]
		if (!start) return null;
		return [start,m[2]]
	}
	return null;
}