// JS BigNumber Utilities uses BigNumber 9.0.2,
// Dr Ron Knott version of 20 Aug 2023:  ronknott AT mac DOT com

var 
BNversion="9.1.1";
BN1=new BigNumber(1),
BN0=new BigNumber(0),
BNm1=new BigNumber(-1),
BN2=new BigNumber(2),
BN3=new BigNumber(3),
BN4=new BigNumber(4),
BN5=new BigNumber(5),
BN10=new BigNumber(10),
BNinf=new BigNumber(Infinity);  
BNminf=new BigNumber(-Infinity);
BNpi=new BigNumber("3.14159265358979323846264338327950288419716939937510582097494459230781640628620899862803482534211706798214808651328230664709384460955058223172535940812848111745028410270193852110555964462294895493038196"),
BNe=new BigNumber("2.718281828459045235360287471352662497757247093699959574966967627724076630353547594571382178525166427427466391932003059921817413596629043572900334295260595630738132328627943490763233829880753195251019011"),
BNEulerGamma=new BigNumber("0.577215664901532860606512090082402431042159335939923598805767234884867726777664670936947063291746749515"),
ln10=2.30258509299404568401799145,
BNln10=new BigNumber("2.30258509299404568401799145468436420760110148862877297603332790096757260967735248023599720508959829834196778392"),
BNPhi=new BigNumber("1.618033988749894848204586834365638117720309179805762862135448622705260462818902449707207204189391137484754088075386891752126633862223536931793180060766726354433389086595939582905638322661319928290267880675208766892501711696207032221043216269548626296313614"),
MAXINT=9007199254740991;

function typ(x){return (
          typeof x=="number"?"num":
          typeof RKNS!=="undefined"     &&x instanceof RKNS     ?"RKNS":
          typeof BigNumber!=="undefined"&&x instanceof BigNumber?"BigNumber":
          typeof RATbn!="undefined"     &&x instanceof RATbn    ?"RATbn":
          typeof PHIC!="undefined"      &&x instanceof PHIC     ?"PHIC":
          typeof PHICBN!="undefined"    &&x instanceof PHICBN   ?"PHICBN":
          typeof BASEDIGS!="undefined"  &&x instanceof BASEDIGS ?"BASEDIGS":
          typeof x=="undefined"                                 ?"undefined":
          x instanceof Array                                    ?"Array"+(x.slice(1).every(e=>typ(e)==typ(x[0]))?"["+typ(x[0])+"]":""):
          typeof(typeof x)=="string"                            ?typeof x
          :"?typ?")};
          
function BNdps(){return BigNumber.config().DECIMAL_PLACES};
function BNsetdps(nbdps){
  if(nbdps<0)HALT("nb dps cannot be negative: "+nbdps);
  if(! isInt(nbdps))HALT("nb dps must be a (JS) integer: "+nbdps);
  BigNumber.config({ //EXPONENTIAL_AT: ndps,  //Keep all output to max nb digits
       DECIMAL_PLACES:nbdps, POW_PRECISION:nbdps+5});
 return BNdps()
};
function HALT(msg){if(msg!="")alert("**Problem** "+msg);//self.onerror=resetERROR;
   STOP()};

BigNumber.prototype.inc=function(){return this.plus(1)};

function fw(n,fwd){ 
   if(arguments.length<2)HALT("Function fw needs a second argument");
   if(!isInt(fwd)||fwd<=0)HALT("Function fw needs a positive whole number for the second argument");
   var s=(typeof n == "string"?n:n.toString());
   while(s.length<fwd)s=" "+s;  return s};

function BNegcd(x,y){
  if(typeof x=="number")x=new BigNumber(x);
  if(typeof y=="number")y=new BigNumber(y);
   if(x instanceof BigNumber&&y instanceof BigNumber){}else HALT("BNegcd called on non-BigNumber");
  var a0=BN1,a1=BN0,b0=BN0,b1=BN1,a2=x,b2=y,q,z;
  while(!(b2.isZero()))
     {q=a2.idiv(b2);
      z=a0.minus(q.times(b0));a0=b0;b0=z;
      z=a1.minus(q.times(b1));a1=b1;b1=z;
      z=a2.minus(q.times(b2));a2=b2;b2=z
   // putmsg([a0,a1,a2]+" "+[b0,b1,b2]+" q="+q);
     };
  if(a2.lte(0)){a1=a1.negated(),a2=a2.negated()};
 // putmsg("egcd "+x+" "+y+" "+[a0,a1,a2]+" CHECK:"+(a0*x+a1*y)+"="+a2);
  return [a0,a1,a2] // ASSERT a0*x+a1*y==g==a2
};
function BNgcd3(a,b,c){ 
  if(typeof a == "number")a=new BigNumber(a);
  if(typeof b == "number")b=new BigNumber(b);
  if(typeof c == "number")c=new BigNumber(c);
  return BNegcd(BNegcd(a.abs(),b.abs())[2],c.abs())[2]}

function BNgcd(a,b){   if(typeof a == "number")a=new BigNumber(a);
        if(typeof b == "number")b=new BigNumber(b);
        if(!a.isInteger())HALT("GCD arguments must be whole numbers: "+a);
        if(!b.isInteger())HALT("GCD arguments must be whole numbers: "+b);
return BNegcd((a.eq(0)?BN1:a.abs()),(b.eq(0)?BN1:b.abs())) [2] 
};

var BNGCD=BNgcd;

function BNlcm(a,b){
    if(typeof a == "number")a=new BigNumber(a);
   if(typeof b == "number")b=new BigNumber(b);
   return a.times(b).div(BNgcd(a,b))
};

function BNsqrfactor(n){var N=n;if(n.eq(0))return BN1;
  if(n.lt(0))n=n.negated();
  var f=BN1,lim=n.sqrt();
  //if(debug)DBG("\rsqrfactor of "+n+ " lim="+lim);
  //if(lim>100000)
  //   if(!confirm("To simplify the fraction may take a while - do you still want simplification?"))
  //       {return 1};
   while(n.mod(4).eq(0)){f=f.times(4);n=n.idiv(4)};
  //if(n<9)return f;
  for(var i=new BigNumber(3),ii=new BigNumber(9);n.gte(ii) && i.lte(lim);i=i.plus(2),ii=i.times(i))
     {//if(debug)DBG("sqrf i="+i+" ii="+ii+" n="+n);
      while(n.gte(ii) && n.mod(ii).eq(0)){f=f.times(ii);n=n.idiv(ii)
      //if(debug)DBG(" ..f="+f+" n="+n)
     }};
  //if(debug)DBG("sqrfactor of "+N+" = "+f+" *"+n);
  return f
};


function BNrandomInt(lo,hi,width){ //all ints in range lo..hi inclusive are equally likely
  if(typeof lo=="number")lo=new BigNumber(lo);
  if(typeof hi=="number")hi=new BigNumber(hi);
  if(arguments.length<3)width=20;
  if(hi.le(lo))HALT("Random int arguments: lo must be less than hi");
   do{var r=BigNumber.random(width).times(hi.minus(lo).plus(1)).plus(lo).floor()}
    while(r.gt(hi));  //random can return 1.00!!
   return r   
}    


BigNumber.prototype.ne=function(x){return ! this.eq(x)};
BigNumber.prototype.le=BigNumber.prototype.lte;
BigNumber.prototype.ge=BigNumber.prototype.gte;

function BNmax(BNrow){
  if(arguments.length==1&& !isArray(BNrow))HALT("?? BNmax expects an array of BN");
  var row=BNrow;
  if(row.length==0)HALT("?? BNmax given empty Array");
  for(var i=1,maxi=0;i<row.length;i++)
    if(row[i].gt(row[maxi]))maxi=i;
   // putmsg("BNmax of "+BNrow+" is@"+maxi+" = "+BNrow[maxi]);
  return row[maxi]
};

function BNmaxabs(BNrow){ //return the element with max ABS value, may be -ve
  if(arguments.length!=1 || !isArray(BNrow))HALT("?? BNmax expects an array of BN");
  var row=(arguments.length==1?BNrow:arguments);
  if(row.length==0)HALT("?? BNmax given empty Array");
  for(var i=1,maxi=0;i<row.length;i++)
    if(row[i].abs().gt(row[maxi].abs()))maxi=i;
   // putmsg("BNmax of "+BNrow+" is@"+maxi+" = "+BNrow[maxi]);
  return row[maxi]
};

function BNeq(a,b,eps){
 if(typeof a=="number"||typeof a=="string")a=new BigNumber(a);
 if(typeof b=="number"||typeof b=="string")b=new BigNumber(b);
// putmsg("test "+echotypeBN(a)+" =?= "+echotypeBN(b)+" err="+nb(eps));
 if(arguments.length<3)eps=BN0;
 if(a instanceof BigNumber)
   {if(b instanceof BigNumber) return a.minus(b).abs().le(eps)
     else HALT("BNeq given non-BN arg: "+typeof a)}
  else HALT("BNeq given a non BN argument: "+typeof b)};
  
BigNumber.prototype.sqr=function(){return this.times(this) };

//BigNumber.max(bn1,bn2, ... ) and BigNumber.min(bn1,bn2,...) are built-in
//ALSO can have 1 arg which is an Array

function BNln(x){ 
  function rawln(x){// X=(x-1)/(x+1) then ln(x) = 2 Sum(x^(2i+1)/(2i+1), {i,0,inf}) for x>0
    var X=x.minus(1).div(x.plus(1)); 
    var Xsqrd=X.times(X);
   // write("X = "+X);
    var Sum=X,p=1,xpow=X,term;
    for(p=3,term=X;term.gt(0);p+=2)
      { X=X.times(Xsqrd);
         term=X.div(p);
         Sum=Sum.plus(term)
      };
    return Sum.plus(Sum)
  };
   if(typeof x =="number")x=new BigNumber(x);
   if(x.isNegative())HALT("Cannot take the log of negative numbers: "+x);
  var ch=x.e;
  var man=x.div("1e"+ch); //1<=man<10
  var ln10=(BNdps()<100?BNln10:rawln(BN10));
  return ln10.times(ch).plus(rawln(man))
};


BigNumber.prototype.powmod=function(Pow,Mod){ //works on larger Powers than built-in BN.pow
    //pow::int|BN, mod::BN
  if(isInteger(Pow))Pow=new BigNumber(Pow);
  var pm;
       if(Pow.lt(9007199254740991))pm=this.pow(Pow,Mod)
 // else if(Pow.isZero())pm= BN1
 // else if(Pow.eq(1))pm= this.mod(Mod)
  else if(Pow.gt(1))
       {var pmod2=Pow.mod(2);
       var s=this.powmod(Pow.idiv(2),Mod);
        var ss=s.sqr().mod(Mod);
       // if(isInteger(ss))ss=ss%Mod
       // else {//putmsg(s+"^2="+ss);
       //      halt("Sorry - the numbers have become too large for this calculator")};
        pm= (pmod2.isZero()? ss : this.times(ss).mod(Mod ) ) } ;
  //putmsg('BN powmod '+this+'^'+Pow+"%"+Mod+" <- "+pm)
  return pm
};
BigNumber.prototype.log=function(base){ 
 return arguments.length==0? BNln(this):BNln(this).div(BNln(base)) 
};


BigNumber.prototype.exp=function(){ //e^this for any value of this
    if(this.isInteger()) return BNe.pow(this) 
    var sum=BN1,x=this,term=BN1,zero=new BigNumber("1e-"+(BNdps()+5)),den=0,sgn1;
    if(this.isZero())return BN1;
    if(this.isNegative())x=this.negated();
    // ASSERT x is +ve, use e^x = 1+x+x^2/2!+x^3/3!+...
    while(term.abs().gt(zero)&&den<500)
    {den++;term=term.times(x).div(den);
    sum=sum.plus(term)};
  //  putmsg("nbterms="+den);
    if(this.isNegative())sum=BN1.div(sum);
    return sum
 };

 function BNpow(b,p){//BigNumber.pow only accepts integer powers!
  if(typeof b=="number"||typeof b=="string")b=new BigNumber(b);
   if(!(b instanceof BigNumber)) HALT("To-Power has wrong type of base value "+typeof(b));
   if(typeof p=="number"||typeof p=="string")p=new BigNumber(p);
  // if(!(p instanceof BigNumber)) HALT("To-power has wrong type of power value "+typeof(p));
  var ans;
  if(p.isInteger())ans=b.pow(p)
  else ans=BNln(b).times(p).exp();
  //if(p.isNegative())ans=BN1.div(ans);
 // putmsg(b+"^"+p+"="+Math.pow(b.toNumber(),p.toNumber()))
  return ans
 };

BigNumber.prototype.topow=function(p){  return BNpow(this,p) };


BigNumber.prototype.floor=function(){return this.integerValue(3)}
BigNumber.prototype.round=function(){return this.integerValue(6)};
BigNumber.prototype.ceil=function(){return this.integerValue(2)};

BigNumber.prototype.degtorad=function(){
  return this.div(45).times(BN1.arctan())};
BigNumber.prototype.radtodeg=function(){
  return this.div(BN1.arctan()).times(45)};
BigNumber.prototype.sin=function(){
  var x=new BigNumber(this),sign=1,piover4=BN1.arctan();
  var twopi=piover4.times(8),halfpi=piover4.times(2),pi=piover4.times(4);
  if(x.isNegative()){sign=-1;x=x.negated()}// 0<=x since sin(-x)=-sin(x)
  x=x.minus(x.idiv(twopi).floor().times(twopi)); // 0<=x<=TwoPi
  if(x.gte(pi)){x=x.minus(pi);sign*=-1}; // 0<=x<Pi  since sin(x+Pi)=-sin(x)
  if(x.gte(halfpi)){x=pi.minus(x)}; //0<=x<Pi/2 since sin(x+Pi/2)=sin(Pi/2-x)
  //if(x.gte(Piover4)){return Piover2.minus(x).cos()}
  // 0<x<Pi/4<1
  var term=x,xsqr=x.sqr(),sum=x,i=1,zero=new BigNumber("1e-"+(BNdps()+5));
  //putmsg("sin of "+x);
  while(term.abs().gt(zero)){term=term.times(xsqr).div((i+1)*(i+2)).negated();sum=sum.plus(term);i+=2;};
  //putmsg("sin "+i+" terms, final term is "+term+"="+term.toPrecision(ndps)+" sum="+sum.toPrecision(ndps,4)+"("+ndps+")");
  var ans=(sign<0?sum.negated():sum);
  //putmsg("SIN="+ans);
  return ans //.precision(BNdps(),4)
};
BigNumber.prototype.sec=function(){   return BN1.div(this.cos())  };
BigNumber.prototype.cos=function(){
  var x=new BigNumber(this),sign=1,piover4=BN1.arctan();
  var halfpi=piover4.times(2),twopi=piover4.times(8),pi=piover4.times(4);
  if(x.isNegative()){x=x.negated()};  // 0<=x since cos(-x)=cos(x)

  x=x.minus(x.div(twopi).floor().times(twopi)); // 0<=x<=TwoPi
  if(x.gte(pi)){x=twopi.minus(x)} //0<=x<Pi since cos(x)=cos(2PI-x)
  if(x.gte(halfpi)){x=pi.minus(x);sign*=-1} //0<=x<Pi/2 since cos(x)=-cos(Pi-x)
  return (sign<0?halfpi.minus(x).sin().negated(): halfpi.minus(x).sin()) //since cos(x)=sin(Pi/2-x)
};
BigNumber.prototype.cosec=function(){ return BN1.div(this.sin()) };
BigNumber.prototype.tan=function(){ // up to about 250 dps
  BNsetdps(BNdps()+9);
  var pi=BN1.arctan().times(4);
  var a=this.mod(pi),sgn;
  if(a.isNegative()){a=a.negated();sgn=-1}else{sgn=1};
  // ASSERT 0<=a<Pi
  var t=BN0,i,asq=a.sqr();
  for(i=181;i>1;i=i-2){t=asq.div(t.minus(i).negated())};
  t= a.div(BN1.minus(t));
  if(sgn<0)t=t.negated();
  BNsetdps(BNdps()-9);
  return t
};
BigNumber.prototype.cot=function(){ return BN1.div(this.tan()) };
BigNumber.prototype.arctan=function(){
  //arctan(-t)=-arctan(t); arctan(t>1)=Pi/2-arctan(1/t) !!this==1???
//From Mathworld, Euler's formula:  SLOW as x nears 1 so use half-angle formula!
   var delta=new BigNumber("1.0e-"+(BNdps()+2).toString()),sgn,x=this;
   if(x.isNegative()){sgn=-1;x=x.negated()}else{sgn=1};
   if(x.gt(1)){s= BN1.arctan().times(2).minus(BN1.div(x).arctan())}
  // else if(x.gt(0.5))s=this.div(this.sqr().plus(1).sqrt().plus(1)).arctan().times(2)
   else{var y=x.sqr().div(x.sqr().plus(1)),s=x.div(x.sqr().plus(1)),k=1,lastt=BN0;
 	  var t=s;
 	  while(lastt.minus(t).abs().gt(delta))
 	     {lastt=t;t=t.times(2*k).div(2*k+1).times(y);s=s.plus(t);k++}
 	  };
   return (sgn<0?s.negated():s)
};
BigNumber.prototype.arccot=function(){  return BN1.div(this).arctan() };
BigNumber.prototype.arcsin=function(){
	if(this.abs().gt(1))HALT("arcsin was given an argument outside the range -1..1: "+this);
	return this.div(BN1.minus(this.sqr()).sqrt()).arctan()};
BigNumber.prototype.arccos=function(){
 	if(this.abs().gt(1))HALT("arccos was given an argument outside the range -1..1): "+this);
	var ans= BN1.minus(this.sqr()).sqrt().div(this).arctan();
	return ans.isNegative()?ans.plus(BN1.arctan().times(4)):ans};
 
BigNumber.prototype.sinh=function(){ return (this.exp().minus(this.negated().exp())).div(2)};
BigNumber.prototype.cosh=function(){  //result is >=1
  return (this.exp().plus(this.negated().exp())).div(2);
 // var ex=this.exp();
 // return ex.minus(BN1.div(ex)).div(2)
};
BigNumber.prototype.tanh=function(){  //returns a value in range -1..1
  var e2=this.times(2).exp();
  return e2.minus(BN1).div(e2.plus(BN1))
 //  var et=this.exp(),emt=this.negated().exp();
 //  return et.minus(emt).div(et.plus(emt))
 //OR
//    var t=BN0,i,thissq=this.sqr();
//  for(i=181;i>1;i=i-2){t=thissq.div(t.plus(i))};
//  t= this.div(BN1.plus(t));
//  return t
};
BigNumber.prototype.arcsinh=function(){
  return this.plus(this.sqr().plus(1).sqrt()).log() };
BigNumber.prototype.arccosh=function(){// 'this' must be >=1
  return (this.lt(1)? HALT("arccosh was given an argument <1:"+this)
         : this.sqr().minus(1).sqrt().plus(this).log() ) };
BigNumber.prototype.arctanh=function(){ //'this' must be in range -1..1
  if(this.lt(-1)||this.gt(1))HALT("arctanh was given an argument not in range -1..1:"+this)
  else if(this.eq(BN1))return BNinf
  else if(this.eq(BNm1))return BNminf;
  BNsetdps(BNdps()+5);
  var ans= this.plus(1).div(this.negated().plus(1)).log().div(2) ;
  BNsetdps(BNdps()-5);
  return ans};
  

BigNumber.prototype.factorial=function(){
  if(this.isNegative())HALT("Cannot take the factorial of a negative number");
  if(!this.isInteger())HALT("Factorial is only defined for whole numbers: "+this);
  var f=BN1;
  for(var i=1;this.ge(i);i++)f=f.times(i);
  return f
};
  
BigNumber.prototype.factorialNbDigits=function(Base){
  if(arguments.length==0)Base=10;
   return this.times(BNpi).times(2).sqrt().times(this.div(BNe).pow(this)).log(Base).plus(1).floor()
};
  
BigNumber.prototype.factorialApprox=function(){
  var dps=BNdps();
  putmsg("dps was "+dps);
  BNsetdps(30);
 // putmsg(this.times(BNpi).times(2).sqrt());
 // putmsg(this.div(BNe).pow(this));
  var f= this.times(BNpi).times(2).sqrt().times(this.div(BNe).pow(this))
 // putmsg(f);
  //this.times(BNpi).times(2).sqrt().times(this.div(BNe).pow(this))
  BNsetdps(dps);
  putmsg("dps is now "+BNdps());
  return f};

function BNbincoeff(r,c){ //n and r are int, return BN
    var ans=BN1,
     rr=(typeof r == "number"?new BigNumber(r):r),
     cc=(typeof c == "number"?new BigNumber(c):c);
     if(rr.isNegative()||cc.isNegative()||cc.gt(rr))ans= BN0
   else if(cc.isZero()||cc.eq(rr))ans=BN1
   else{if(r-c<c)c=r-c;
        //for(var i=r;i>=r-c+1;i--)ans=ans.times(i);
       // ans=rr.factorial().div(rr.minus(cc).factorial().times(cc.factorial()))}
         for(var i=0;i<c;i++)ans=ans.times(r-i).div(i+1);
      };
//write("bnbincoeff "+r+"C"+c+" = "+ans+" top="+rr+".."+(r-c+1)+" bot="+cc.factorial());
   return ans
};
var BNbinomial=BNbincoeff;

// function bnbincoeffApprox(r,c){
//   var rf=r.factorialApprox(),
//       rcf=r.minus(c).factorialApprox(),
//       cf=c.factorialApprox();
//       putmsg([rf,rcf,cf].join("<br>"));
//   return rf.div(rcf).div(cf)};

function getBNdps(fld){  // reads input fld and return a JS number 
  if(arguments.length==0)HALT("!! reading DP from input: missing  field id");
  var dps=document.getElementById(fld).value;
  if(dps==""){dps=30;document.getElementById(fld).value="30"};
  try{dps=eval(dps)}
  catch(e){put("!! dps field error: "+e)};
  if(!isInt(dps))HALT("!! dps field must be whole number: "+dps);
  if(dps<0)HALT("!! dps field must be a positive value: "+dps);
 // put("dps input "+dps);
  return dps
};

BigNumber.prototype.toBase=function(b){
  if(b instanceof BigNumber)
  { b=b.toNumber(); if(!isInt(b))HALT("BigNumber tobase: base is too large")};
  if(!isInt(b)||b<2||b>36)HALT("The base "+b+" is not an integer in range 2..35");
  return this.toString(b)
};

BigNumber.prototype.toBaseDigits=function(b){
// return a ROW of ints, the digits of THIS in base b
  var ds=new Array(), BigNumberBaseChrs="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_";
  if(b instanceof BigNumber)
    { b=b.toNumber(); if(!isInteger(b))HALT("BigNumber tobase: base is too large")};
  if(b==0||b==-1||b==1)HALT("BigNumber toBaseNbs cannot have base "+base);
  else if(1<b&&b<=64) ds=map(this.toString(b).split(""),function(b){return BigNumberBaseChrs.indexOf(b)})
  else {var r,bn=new BigNumber(this);
        while(!bn.isZero())
		{  r=bn.mod(b);bn=bn.idiv(b); ds.unshift(r.toNumber());
		   //putmsg("push "+r.toNumber());
		 };};
	return ds
};

function BNstr(bn,base){ // replace "e" notation by 10^
  if(bn instanceof BigNumber)bn=bn.toString(base);
  if(typeof bn == "string"){}else{HALT("BNstr called on non BigNumber")};
  if(arguments.length==1)base=10;
  var s=bn.toString(base);
  if(s.indexOf("e")!=-1)
    s=s.replace("e","&times;"+base+"<sup>")+"</sup>";
  return s
};


// ---------- Some other utility functions --------
/* isInteger built-in for BigNumber
function isInt(i){  //is a JS value an integer?
   if(typeof i!="number"&&typeof i!="string")return false;
   var s=i.toString().toLowerCase().replace(/\s/g,"");
   return !isNaN(i) && isFinite(i) && s!="" && s.indexOf(".")==-1  && s.indexOf("e")==-1  &&  i<=MAXINT
}  ;
*/


function getBN(id,descript,opts){
// OPTS O - can be empty, N = integer, + = pos only
  if(arguments.length<3)opts="";
  var n=document.getElementById(id),N;
  if(!n)HALT("?bug? getBN cannot find "+id);
  n=n.value.replace(/\s/g,"");
  var x=n.replace(/[0-9\.eE\+\-]/g,"");
  if(x!="")HALT("Illegal characters in input for "+descript+": "+x);
  if(opts.indexOf("O")==-1&&n=="") HALT("Input for "+descript+" is empty!")
  else if(n=="")N=""
  else {try{N= new BigNumber(n)}
        catch(e){HALT("Input for "+descript+" is not a number")};
       if(opts.indexOf("N")>-1&&!N.isInteger())HALT("Input for "+descript+" must be a whole number");
       if((opts.indexOf("+")>-1||opts.indexOf("N")>-1)&&N.isNegative())HALT("Input for "+descript+" cannot be negative")
       };
  if(opts.indexOf("?")>-1)putmsg("getBN "+descript+"|"+n+"| << "+N);
  return N  //"" or BigNumber
};

//BigNumber.max(bn1,bn2, ... ) and BigNumber.min(bn1,bn2,...) are built-in
//ALSO can have 1 arg which is an Array

function BNprimefactors(N){//SLOW  with JS int it is MUCH faster
    var pfs=new Array();
    if((typeof N=="string"||typeof N=="number")&&isInt(N))N=new BigNumber(N);
    //putmsg("primefactors "+N+" int:"+isInt(N));
    //putmsg("primefs "+N);
    if(!N.isInteger())HALT("Cannot call BNprimefactors on "+N+"::"+telltype(N));
    if(N.eq(BN1))return [[BN1,1]];
	 var  i,inc,II=N,L=N.sqrt(),pct=0;
	 var starttime=performance.now();
	 pct=0;while(II.mod(2).isZero()){pct++;II=II.div(2);L=II.sqrt()};if(pct>0){pfs.push([BN2,pct]);  };
     pct=0;while(II.mod(3).isZero()){pct++;II=II.div(3);L=II.sqrt()};if(pct>0){pfs.push([BN3,pct]);  };
	 for(i=new BigNumber(5),inc=4; i.lte(L); i=i.plus(inc=6-inc))
		 {pct=0;
		  while( II.mod(i).isZero()){pct++;II=II.div(i)};
		  if(pct>0){pfs.push([i,pct]);L=II.sqrt();//putmsg("found "+i+"^"+pct)
					};
		 };
	 if(II.gt(1))pfs.push([II,1]);
	 var endtime=performance.now();
  // putmsg("$BNprimefactors: "+N+" has "+pfs.length+" prime factors "+pfstoString(pfs)+" in "+Math.round(endtime-starttime)+"ms")
    return pfs
};
function BNprimefactorsupto(N,maxfactor,printQ){//N::BN,maxfactor::int 
  // <- row of [prime::int,pow::int] and last is [restOfQuotient::BN,0]
   //SLOW  with JS int it is MUCH faster
 //  putmsg("BNpfut "+N+"::"+(N instanceof BigNumber?"BN":typeof N)+" maxf="+maxfactor);
    var pfs=new Array();
    if(typeof N=="string"||isInt(N))N=new BigNumber(N);
    //putmsg("primefactors "+N+" int:"+isInt(N));
    //putmsg("primefs "+N);
    if(!N.isInteger())HALT("Cannot use primefactors on a non-integer "+N);
    maxfactor=new BigNumber(maxfactor);
    if(N.eq(BN1))return [[BN1,1]];
	 var  i,inc,II=N,L=N.sqrt(),pct=0;
	 var starttime=performance.now();
	 pct=0;while(II.mod(2).isZero()){pct++;II=II.div(2);L=II.sqrt()};if(pct>0){pfs.push([BN2,pct]);  };
     pct=0;while(II.mod(3).isZero()){pct++;II=II.div(3);L=II.sqrt()};if(pct>0){pfs.push([BN3,pct]);  };
	 for(i=5,inc=4; maxfactor.gte(i)&&L.gte(i); i=i+(inc=6-inc))
		 {pct=0;
		  while( !II.isZero()&&II.mod(i).isZero()){pct++;II=II.div(i)};
		  if(pct>0){pfs.push([i,pct]);L=II.sqrt();//putmsg("found "+i+"^"+pct)
					};
		 };
		// putmsg("stopped at i="+i+" lim="+maxfactor+" L="+L.round(1)+" II="+II);
	 if(II.gt(1))
	   {if(L.lt(i)){ pfs.push([II,1]) }  
	    else pfs.push([II,0])};
	 var endtime=performance.now();
   //putmsg("$BNprimefactors: "+N+" has "+pfs.length+" prime factors "+pfstoString(pfs)+" in "+Math.round(endtime-starttime)+"ms")
    return (printQ?pfstoString(pfs,'xnonprime'):pfs)
};

function BNfactors(N){
 if(N.eq(1))return [BN1];
 return BNfactorspfs(BNprimefactors(N));
};

function BNfactorspfs(pfs){  //given pfs list of [BNprime,INTpower], find all the factors
  function cpfrom(PrevAnss,Li,L,F){
   //putmsg("cpfrom ")+L;
   if(L.length==Li)return F(PrevAnss);
   var ans=[],prpow=BN1,pr=L[Li][0],maxpow=L[Li][1];
   for(var i=0;i<=maxpow;i++,prpow=prpow.times(pr))
      {ans=ans.concat(cpfrom(PrevAnss.concat(prpow), Li+1, L, F));
      };
   //putmsg("cpfrom <- "+ans);
   return ans
   };
   if(pfs[0][0].eq(1))pfs=pfs.slice(1);
   var fs= cpfrom([],0,pfs,function(L){return FoldR(BN1,L,function(bn1,bn2){return bn1.times(bn2)})})   //eval(L.join('*'))})
      .sort(function(bn1,bn2){return bn1.cmp(bn2)});
  // putmsg("Factors of "+ZbagtoString(pfs)+" = "+fs);
   return fs
};
function BNEulerPhi(N,Pfs){ //the number of x's in Range[1..N] with gcd(x,N)==1
  //putmsg("Eulerphi "+N);
  var pfs=(arguments.length>=2?Pfs:BNprimefactors(N));
//putmsg("pfs of "+N+": "+pfs);
  var phi=BN1,i=0;
  while(i<pfs.length)  {var pr=pfs[i][0],po=pfs[i][1]; i++; phi=phi.times(pr.pow(po-1)).times(pr.minus(1))};
  //putmsg("Eulerphi <- "+phi);
 if(!phi.isInteger())HALT("BN integer overflow during BNEulerPhi");
 return phi
};
function BNcmp(bn1,bn2){if(isInt(bn1))bn1=new BigNumber(bn1);if(isInteger(bn2))bn2=new BigNumber(bn2);
  return bn1.cmp(bn2)}; //bn1>bn2:1, bn1=bn2:0 bn1<bn2:-1

function BNEulerPhiPfs(N,Pfs){ //the size of { x in Range[1..N]  | gcd(x,N)==1 }
//N::BN, Pfs ::row [BN,int] Prime factors and powers of N
 // putmsg("EulerphiPfs "+ZbagtoString(Pfs));
  var efs=new Array([BN1,1]),i=0;
  while(i<Pfs.length)  {var CMP=(BNpr instanceof BigNumber?BNcmp:cmp);
      var BNpr=Pfs[i][0],po=Pfs[i][1]; i++;
       efs=(po>1?Zbagunion(efs,[[BNpr,po-1]],CMP):efs);
       if(isInteger(BNpr)){BNpr=new BigNumber(BNpr)};
       efs=Zbagunion(efs,BNprimefactors(BNpr.minus(1)),CMP)
     //phi=phi*Math.pow(pr,po-1)*(pr-1)
     };
  //putmsg("EulerphiPfs <- "+ZbagtoString(efs));
 return efs
};

function BNpfsmod(pfs,m){ var i,p,ans=BN1;
  for(var i=0;i<pfs.length;i++)
  {p=pfs[i][0].mod(m);
   ans=ans.times(p.pow(pfs[i][1],m)).mod(m)
  };
  return ans
};


function BNorderBASE(D,B,Dpfs){ //D::BN,B(ase)::int, Dpfs row of [pr::BN|int,pow::int] <- int
  //putmsg("BNorderBASE "+D+"::"+(isInt(D)?"N":D instanceof BigNumber?"BN":"?")+"   "+echotype(B)+"  "+(arguments.length>2&&Dpfs.length>50?Dpfs.length+" fctrs":Dpfs));
  if(D.eq(1))return BN0;
  if(!D.isInteger())HALT("BNorderBASE  arg 1 is not an integer: "+D);
  if(BNgcd(D,B).ne(1))HALT("BNorderBASE called on  numbers with a common factor: "+D+" "+B)
 // putmsg("BNorderBASE Dpfs "+pfstoString(Dpfs));
  var fs=(arguments.length==3?BNfactorspfs(BNEulerPhiPfs(D,Dpfs)):BNfactors(BNEulerPhi(D))),    i,ans;
  //for(var i=0;i<fs.length;i++)while(B%fs[i]==0,B=Math.round(B/fs[i]));
  i=0;if(B instanceof BigNumber){}else{B=new BigNumber(B)};
 // putmsg("$$BNorderBASE on "+D+" with "+Dpfs+" -> "+fs);
 var ok;i=0;
  while(i<fs.length&&(ans=B.powmod(fs[i],D)).ne(1)){i++};   
  // putmsg("BNorderbase <- B^"+BNprimefactors(fs[fs.length-1])+" = "+B.powmod(fs[fs.length-1],D))
  return (i<fs.length?fs[i]:BNm1)
};




BigNumber.prototype.primefactors=function(printQ){//only on JS ints and returns row of  [pr::int,pow::int]
  var pfs;
  if(isInt(this.toNumber()))
    {if(arguments.length==1&&printQ) return pfstoString(GLOBALprimefactors(this.toNumber()),'x')
     else return GLOBALprimefactors(this.toNumber())}
  else HALT(this+" is too big to find its primefactors")
};
BigNumber.prototype.isprime=function(){ var pfs=this.primefactors();
    return pfs.length==1&&pfs[0][1]==1};
BigNumber.prototype.isrect=function(){ return !this.isprime()};

BigNumber.prototype.primefactorsupto=function(maxfactor,printQ){//only try factors up to maxfactor::int
  if(arguments.length<2)printQ=false;
  return BNprimefactorsupto(this,maxfactor,printQ)
};
  
function champ(base,dps){
  if(arguments.length<2)dps=BNdps(); 
// alert(dps+" dps");
  if(base instanceof BigNumber)base=base.toNumber()
  else if(typeof base!="number")HALT("Champ function expected a numerical argument, Found: "+typeof base);
  if(base>1&&base<=10)
  {for(var i=1,ans="0.";ans.length<=dps;i++){ans+=i.toString(base)};
 // pumsg("champ raw "+ans+" "+base);
  return new BigNumber(ans,base)}
  else HALT("Champernowne numbers only available in bases 2 to 10: found base "+b)
};

var fibBNmemo=new Array();
BigNumber.prototype.fib=
//function(){ // depends on getting accuracy of Phi right!!
//    if(!this.isInteger())HALT(".fib cannot be called on a non-integer BigNumber");
//   if(this.isZero())return BN0;
//   if(this.eq(1)||this.eq(2))return BN1;
//   if(this.isNegative())return (this.mod(2).eq(0)?this.negated().fib().negated():this.negated().fib())
//   var BN5root=BN5.sqrt();
//  // write(BN5root);
//   var Phi=BN5root.plus(1).div(2);
//  // write(Phi);
//  // write(this);
//  // write(Phi.topow(this));
//  // write(Phi.topow(this).div(BN5root));
//   return Phi.topow(this).div(BN5root).round();
// };

function(){var x,z;
  if(this.isInteger())
  {  if(x=fibBNmemo[this.toNumber()])return x;
	  if(this.isNegative()){x= this.negated().fib();if(this.negated().mod(2).isZero())x=x.negated();return x}
	  if(this.isZero()){x= BN0}
	  else if(this.eq(1) || this.eq(2) ){x= BN1}
	  else { if(this.mod(2).isZero())
			 {var z=this.div(2).fib();
			   x=z.times(this.div(2).plus(1).fib().times(2).minus(z))}
			 else x=this.minus(1).div(2).fib().sqr().plus(this.minus(1).div(2).plus(1).fib().sqr());
			 fibBNmemo[this.toNumber()]=x;
			 //putmsg("fibmemo("+this+")="+x);
	  }
	  return x
  } else {  HALT("BN.fib() is only defined on integers: "+this);
     //var Phi=BN5.sqrt().plus(1).div(2),phi;phi=Phi.minus(1);
    //return BNpow(Phi,this).minus(BNpow(phi.neg(),this)).div(BN5.sqrt())
     }
};


function fibBN(i){return (new BigNumber(i)).fib()};

BigNumber.prototype.luc=function(){
  if(this.isInteger()) return this.minus(1).fib().plus(this.plus(1).fib())
  else { HALT("Luc() is only defined on integers");
    //var Phi=BN5.sqrt().plus(1).div(2),phi;phi=Phi.minus(1);
   // return BNpow(Phi,this).plus(BNpow(phi.neg(),this))
     }
};

function gfib(a,b,i){
  if(arguments.length<3)HALT("Gfib needs parameters a, b and i");
  return (a==0 && b==0? BN0 :  i.minus(1).fib().times(a).plus(i.fib().times(b)))
};
function polyg(n,r){if(typeof n =="number" && isInt(n))n=new BigNumber(n); 
    if(typeof r== "number"&&isInt(r))r=new BigNumber(r); 
    if(!isInteger(n))HALT("Cannot find polygonal numbers with non-integer sides: "+n);
    if(!isInteger(r))HALT("Cannot find polygonal numbers with non-integer order: "+r);
   return r.times( n.minus(2).times(r).minus (n).plus(4) ).div(2) };

BigNumber.prototype.sqrfactor=function(){
  if(this.isZero())return BN1;
  if(n.isNegative())n=n.negated();
  var f=BN1,lim=n.sqrt();
  //if(debug)DBG("\rsqrfactor of "+n+ " lim="+lim);
  //if(lim>100000)
  //   if(!confirm("To simplify the fraction may take a while - do you still want simplification?"))
  //       {return 1};
   while(n.mod(4).isZero()){f=f.times(4);n=n.div(4)};
  //if(n<9)return f;
  for(var i=3,ii=9;n>=ii && i<=lim;i=i+2,ii=i*i)
     {//if(debug)DBG("sqrf i="+i+" ii="+ii+" n="+n);
      while(n>=ii && n%ii==0){f=f*ii;n=Math.round(n/ii)
      //if(debug)DBG(" ..f="+f+" n="+n)
     }};
  //if(debug)DBG("sqrfactor of "+N+" = "+f+" *"+n);
  return f
};

function BNHarmonic(n)  // Harmonic number approx, By summing recips for n<400
  // by an good approximaator after that..see GKP Page 278  
        // n::string|number|BN --> [H(n)::BN, nbdps accuracy::number]
 {if(typeof n=="string"||typeof n=="number")n=new BigNumber(n);
  if(n.lt(1)||!n.isInteger())HALT("?? (BN) Harmonic Number needs a whole number argument. Found :"+n)
  var sum=BN0;
  if(n<400)
  {for(var i=1;i<=n;i++)sum=sum.plus(BN1.div(i));
   return [sum,BNdps()]}
  else {
   var prevdps=BNdps();
   BNsetdps(50);
   var ans=n.log().plus(BNEulerGamma).plus(BN1.div(n.times(2))).minus(BN1.div(n.sqr().times(12)));
   var err=BN1.div(BN10.times(12).times(n.sqr().sqr()));
   
  // putmsg("err "+err+" "+BNdps()+"dps comp");
   var ndps=err.log(10).negated().plus(2).round().toNumber();
// [ln(n)+EulerGamma+1/(2*n)-1/(12*n*n),1/(120*n*n*n*n)] error <1/(120n^4)
   BNsetdps(prevdps);
  return [ans,err.toFixed(ndps),ndps-2]
  }
};