const pat1=/(\d+):(\d+)/
const volname={
	vin:1,	v:1,
	d:6,	m:9,	s:12,	a:17,
}
const romanvol={
	"i":1,"ii":2,"iii":3,"iv":4,"v":5,"vi":6,"vii":7,"viii":8,"ix":9,"x":10
}
const pat2=/([a-zA-Z]+)\.([ivxIVX]+)[,\.](\d+)/
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
		const start=volname[m[1].toLowerCase()]
		if (!start) return null;

		const rv=romanvol[m[2].toLowerCase()];
		if (!rv)return null;
		return [start+rv-1,m[3]]
	}
	return null;
}