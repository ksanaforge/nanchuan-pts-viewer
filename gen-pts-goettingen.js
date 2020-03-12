const fs=require("fs");
const argv=process.argv.slice(2);
let set=argv[0]||"goettingen";

set=set.replace(".lst",""); // remove extension by command line tab key 

const lst=fs.readFileSync(set+".lst","utf8").split(/\r?\n/);
//lst.length=3;

const pagenumexp=/\[page (\d+)\]/;
const filenameexp=/([\d\w_]+)\.htm/ ;
const log=msg=>{
	console.log(msg);
	//process.stdout.write("\r"+msg+"                                         ");
}
const out=[];
const header=[];
const LINESEP="$",SEGSEP=":";
const replaces=[
	[/&#8216;/g ,"‘"],
	[/&nbsp;/g," "],
	[/<BR>/g  ,""],
	[/<i>/g  ,""],
	[/<\/i>/g  ,""],
	[/^<\/span>$/,""],
	[/<\/body><\/html>/g,""],
	[/^<span class="red">--------------------------------------------------------------------------/,""],
	[/<span class="red"><sup>(\d+)<\/sup><\/span>/g,"^$1"],
	[/<\/span>/g,""]

]
const parseLine=L=>{
	let l=L;
	for (var i=0;i<replaces.length;i++){
		l=l.replace( replaces[i][0],replaces[i][1]);
	}
	return l;
}
const parseFile=fn=>{

	let pagenum=0,linenum=0,lastpagenum=0;
	let page=[],infootnode=false;

	const m=fn.match(filenameexp);
	const bookname=file2bookname[m[1]];
	const lines=fs.readFileSync(fn,"utf8").split(/\r?\n/);
	log("processing "+ bookname+" linecount "+lines.length);
	for (let i=0;i<lines.length;i++){
		const L=lines[i];
		let m=L.match(pagenumexp);
		if (m) {
			pagenum=parseInt(m[1]);
			if (pagenum-1!==lastpagenum) {
				log("wrong pagenumber "+pagenum);
			}
			linenum=0;
			lastpagenum=pagenum;
			infootnode=false;
		}
		if (L.substr(0,19)=='<span class="red">-'){
			infootnode=true;
		}
		let l=parseLine(L);
		if (pagenum&&linenum) {
			let id=pagenum+"."+linenum;
			
			if (l) {
				if (linenum==1) {
					header.push([bookname+SEGSEP+pagenum,l]);
				} 
				if (infootnode) l="^^"+l;
				out.push([bookname+SEGSEP+id, l]);
			} else linenum--;
		}
		linenum++;
	}
	
	return out;
}


const main=()=>{
	const raw=lst.forEach(parseFile);
	fs.writeFileSync(set+"-raw.txt",out.join("\n"),"utf8")
	fs.writeFileSync(set+"-header.txt",header.join("\n"),"utf8")
}
const file2vol={
vin1maou:"1",vin2cuou:"2",vin3s1ou:"3",vin4s2ou:"4",vin5paou:"5",
dighn1ou:"6",dighn2ou:"7",dighn3ou:"8",majjn1ou:"9",majjn2ou:"10",majjn3ou:"11",
,samyu1ou:"12",samyu2ou:"13",samyu3ou:"14",samyu4ou:"15",samyu5ou:"16"
,angut1ou:"17",angut2ou:"18",angut3ou:"19",angut4ou:"20",angut5ou:"21"
khudp_ou:'22',dhampdou:'23',udana_ou:'24',itivutou:'25',sutnipou:'26',
vimvatou:'27',petvatou:'28',theragou:'29',therigou:'29',
jatak1ou:'30',jatak2ou:'31',jatak3ou:'32',jatak4ou:'33',jatak5ou:'34',jatak6ou:'35',
nidde1ou:'36',nidde2ou:'37',patis1ou:'38',patis2ou:'39',apadanou:'40',budvmsou:'41',
carpitou:'42',

dhamsgou:'43',vibhanou:'44',dhatukou:'45',pugpan_ou:'46',kathavou:'47',
yamak_1ou:'48',yamak_2ou:'49',patdukou:'50' // last vol 53

}
const file2bookname={
vin1maou:"vin1",vin2cuou:"vin2",vin3s1ou:"vin3",vin4s2ou:"vin4",vin5paou:"vin5",
dighn1ou:"dn1",dighn2ou:"dn2",dighn3ou:"dn3",majjn1ou:"mn1",majjn2ou:"mn2",majjn3ou:"mn3",
,samyu1ou:"sn1",samyu2ou:"sn2",samyu3ou:"sn3",samyu4ou:"sn4",samyu5ou:"sn5"
,angut1ou:"an1",angut2ou:"an2",angut3ou:"an3",angut4ou:"an4",angut5ou:"an5",
khudp_ou:'kp',dhampdou:'dhp',udana_ou:'ud',itivutou:'iti',sutnipou:'snp',
vimvatou:'vv',petvatou:'pv',theragou:'thag',therigou:'thig',
jatak1ou:'ja1',jatak2ou:'ja2',jatak3ou:'ja3',jatak4ou:'ja4',jatak5ou:'ja5',jatak6ou:'ja6',
nidde1ou:'mnd',nidde2ou:'cnd',patis1ou:'ps1',patis2ou:'ps2',apadanou:'ap',budvmsou:'bv',
carpitou:'cp',

dhamsgou:'ds',vibhanou:'vb',dhatukou:'dt',pugpan_ou:'pp',kathavou:'kv',
yamak_1ou:'ya1',yamak_2ou:'ya2',patdukou:'pp'

}

main();