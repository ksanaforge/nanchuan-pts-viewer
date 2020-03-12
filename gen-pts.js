const fs=require("fs");
const folder="../pts-dhammakaya/data/";

const dofile=(fn,prefix,breakline,outarr)=>{
	console.log("processing",fn);
	let content=fs.readFileSync(fn,"utf8").split(/\r?\n/);
	for (var i=0;i<content.length;i++) {

		const arr=content[i].split("\t");
		const bseq=arr[0],page=arr[1];
		if (arr.length<3) continue;
		const lines=arr[2].split("\\n");
		if (lines[lines.length-1]=="") lines.pop();
		if (breakline) {
			for (var j=0;j<lines.length;j++){
				outarr.push([ prefix+arr[0]+":"+page+"."+ (j+1),lines[j] ]);
			}
		} else {
			outarr.push([prefix+arr[0]+":"+page,arr[2]]);
		}
	}
}

const out=[],footnote=[];

dofile(folder+'palipg1.tsv','',true,out);
dofile(folder+'footpg1.tsv','',false,footnote);

console.log("writing mula")
fs.writeFileSync('mul-raw.txt',out.join("\n"),"utf8");out.length=0;
console.log("writing mula footnote")
fs.writeFileSync('mulfn-raw.txt',footnote.join("\n"),"utf8");footnote.length=0;

dofile(folder+'palipg2.tsv','',true,out);
dofile(folder+'footpg2.tsv','',false,footnote);

console.log("writing att")
fs.writeFileSync('att-raw.txt',out.join("\n"),"utf8");out.length=0;
console.log("writing att footnote")
fs.writeFileSync('attfn-raw.txt',footnote.join("\n"),"utf8");footnote.length=0;
