'use strict';
// Pure math: transformations, lamina stiffness, laminate (CLT), failure criteria. No DOM access.
function transpose(a){return a[0].map((_,j)=>a.map(r=>r[j]))}
function mv(a,b){return a.map(r=>r.reduce((s,v,i)=>s+v*b[i],0))}
function solve(a,b){const n=b.length,m=a.map((r,i)=>[...r,b[i]]);for(let j=0;j<n;j++){let p=j;for(let i=j+1;i<n;i++)if(Math.abs(m[i][j])>Math.abs(m[p][j]))p=i;[m[p],m[j]]=[m[j],m[p]];const d=m[j][j];if(!Number.isFinite(d)||Math.abs(d)<1e-18)throw new Error('Stiffness matrix is singular. Check material constants and thickness.');for(let k=j;k<=n;k++)m[j][k]/=d;for(let i=0;i<n;i++)if(i!==j){const f=m[i][j];for(let k=j;k<=n;k++)m[i][k]-=f*m[j][k]}}return m.map(r=>r[n])}
function inverse(a){return transpose(a.map((_,i)=>solve(a,a.map((_,j)=>+(i===j)))))}
function qmatrix(p){const E1=p.E1*1000,E2=p.E2*1000,G=p.G*1000,d=1-p.nu*p.nu*E2/E1;return [[E1/d,p.nu*E2/d,0],[p.nu*E2/d,E2/d,0],[0,0,G]]}
function qbar(p,angle){const Q=qmatrix(p),a=angle*Math.PI/180,m=Math.cos(a),n=Math.sin(a),m2=m*m,n2=n*n,m4=m2*m2,n4=n2*n2,mn=m*n,A=Q[0][0],B=Q[1][1],C=Q[0][1],D=Q[2][2];const a11=A*m4+2*(C+2*D)*m2*n2+B*n4,a22=A*n4+2*(C+2*D)*m2*n2+B*m4,a12=(A+B-4*D)*m2*n2+C*(m4+n4),a16=(A-C-2*D)*m2*mn-(B-C-2*D)*n2*mn,a26=(A-C-2*D)*n2*mn-(B-C-2*D)*m2*mn,a66=(A+B-2*C-2*D)*m2*n2+D*(m4+n4);return [[a11,a12,a16],[a12,a22,a26],[a16,a26,a66]]}
function localStress(s,angle){const a=angle*Math.PI/180,m=Math.cos(a),n=Math.sin(a);return [m*m*s[0]+n*n*s[1]+2*m*n*s[2],n*n*s[0]+m*m*s[1]-2*m*n*s[2],-m*n*s[0]+m*n*s[1]+(m*m-n*n)*s[2]]}
function localStrain(s,p){return [(s[0]-p.nu*s[1])/(p.E1*1000),s[1]/(p.E2*1000)-p.nu*s[0]/(p.E1*1000),s[2]/(p.G*1000)]}
function expansion(a1,a2,angle){const a=angle*Math.PI/180,m=Math.cos(a),n=Math.sin(a);return [a1*m*m+a2*n*n,a1*n*n+a2*m*m,2*m*n*(a1-a2)]}
function microCalc(c,v,model,xi){const w=1-v,E1=c.Ef*v+c.Em*w,eta=(c.Ef/c.Em-1)/(c.Ef/c.Em+xi),E2=model==='ht'?c.Em*(1+xi*eta*v)/(1-eta*v):1/(v/c.Ef+w/c.Em),G=1/(v/c.Gf+w/c.Gm),nu=c.nuf*v+c.num*w,rho=c.rhof*v+c.rhom*w,a1=(c.af*c.Ef*v+c.am*c.Em*w)/E1,a2=(1+c.nuf)*c.af*v+(1+c.num)*c.am*w-a1*nu;return {E1,E2,G,nu,rho,a1,a2,wf:c.rhof*v/rho,load:c.Ef*v/E1}}
function failureCalc(p,strength,l,interaction){const {Xt,Xc,Yt,Yc,S}=strength,e=localStrain(l,p),X=l[0]>=0?Xt:Xc,Y=l[1]>=0?Yt:Yc,ms=Math.max(Math.abs(l[0])/X,Math.abs(l[1])/Y,Math.abs(l[2])/S),me=Math.max(Math.abs(e[0])/( (e[0]>=0?Xt:Xc)/(p.E1*1000)),Math.abs(e[1])/((e[1]>=0?Yt:Yc)/(p.E2*1000)),Math.abs(e[2])/(S/(p.G*1000))),th=l[0]**2/Xt**2-l[0]*l[1]/Xt**2+l[1]**2/Yt**2+l[2]**2/S**2,mth=l[0]**2/X**2-l[0]*l[1]/X**2+l[1]**2/Y**2+l[2]**2/S**2,H1=1/Xt-1/Xc,H2=1/Yt-1/Yc,H11=1/(Xt*Xc),H22=1/(Yt*Yc),H12=interaction==='hill'?-1/(2*Xt*Xt):-.5*Math.sqrt(H11*H22),linear=H1*l[0]+H2*l[1],quadratic=H11*l[0]**2+H22*l[1]**2+2*H12*l[0]*l[1]+l[2]**2/S**2;let twR=Infinity;if(quadratic>1e-30){const disc=Math.sqrt(linear*linear+4*quadratic);twR=linear>=0?2/(linear+disc):(disc-linear)/(2*quadratic)}else if(linear>0)twR=1/linear;return [{name:'Maximum stress',index:ms,ratio:ms?1/ms:Infinity},{name:'Maximum strain',index:me,ratio:me?1/me:Infinity},{name:'Tsai–Hill',index:th,ratio:th>0?1/Math.sqrt(th):Infinity},{name:'Modified Tsai–Hill',index:mth,ratio:mth>0?1/Math.sqrt(mth):Infinity},{name:'Tsai–Wu',index:linear+quadratic,ratio:twR}]}
const MAT_TAGS={g:'graphite',gr:'graphite',e:'glass',gl:'glass',b:'boron'};
const FAIL_CRITERIA=['Maximum stress','Maximum strain','Tsai–Hill','Modified Tsai–Hill','Tsai–Wu'];
const SEQ_HELP='Write the code as on the slides, for example [0/±45/90₂]s, [(0/90)₂]s or [0/-45/\\bar{60}]s. Set a material with 45^Gr, 45^Gl, 45^B (or 45g, 45e, 45b) and a thickness in mm with 45:0.25.';
// Laminate code -> expanded ply list, top ply first: [{a, mat?, t?}].
// Accepts slide notation: ± and ∓, repeat subscripts (90_2, 90₂, (0/90)_2), [ ]s and [ ]_ns, an overbar on the
// middle ply of an odd symmetric laminate, superscript materials (0^Gr) and per-ply thickness (0:0.25).
// Without [ ], the mirror flag decides symmetry, as the plain 0/45/-45/90 input always did.
function parseSequence(raw,mirror){
  const sub={'₀':'0','₁':'1','₂':'2','₃':'3','₄':'4','₅':'5','₆':'6','₇':'7','₈':'8','₉':'9'};
  let s=raw.trim().replace(/[₀-₉]+/g,m=>'_'+[...m].map(c=>sub[c]).join('')).replace(/ₛ/g,'s').replace(/[−–]/g,'-')
    .replace(/\+\/-|\+-/g,'±').replace(/-\+/g,'∓').replace(/\\(?:bar|overline)\{([^}]*)\}/g,'$1~').replace(/(\d)[̄̅]/g,'$1~');
  if(!s)throw new Error('Enter at least one ply angle.');
  let useMirror=mirror,repeat=1;
  const br=/^\[(.*)\]\s*(?:_?\{?\s*(\d*)\s*([sS]?)\s*\}?)\s*[tT]?$/.exec(s);
  if(br){s=br[1];repeat=br[2]?+br[2]:1;useMirror=!!br[3]}
  else if(/[\[\]]/.test(s))throw new Error('Close the brackets, as in [0/90]s. '+SEQ_HELP);
  let i=0;
  const bad=tok=>new Error('Cannot read “'+tok+'”. '+SEQ_HELP);
  const count=()=>{const m=/^_\{?(\d+)\}?/.exec(s.slice(i));if(!m)return 1;i+=m[0].length;if(+m[1]<1)throw new Error('Repeat counts must be 1 or more.');return +m[1]};
  function list(close){
    const out=[];
    while(i<s.length){
      const c=s[i];
      if(c===close){i++;return out}
      if(/[\/,\s]/.test(c)){i++;continue}
      if(c==='('){i++;const g=list(')'),n=count();for(let k=0;k<n;k++)out.push(...g.map(p=>({...p})));continue}
      let j=i;while(j<s.length&&!/[\/,\s()]/.test(s[j]))j++;
      const tok=s.slice(i,j);i=j;
      const m=/^([±∓+-]?)(\d+(?:\.\d*)?|\.\d+)(~?)(?:\^\{?(gr|gl|b|g|e)\}?|(gr|gl|[geb]))?(~?)(?::(\d*\.?\d+))?(?:_\{?(\d+)\}?)?$/i.exec(tok);
      if(!m)throw bad(tok);
      const a=Number(m[2]),mat=(m[4]||m[5])?MAT_TAGS[(m[4]||m[5]).toLowerCase()]:undefined,t=m[7]?Number(m[7]):undefined,n=m[8]?+m[8]:1;
      if(a>90)throw new Error('Ply angles must lie between −90° and 90°.');
      if(t!==undefined&&!(t>0))throw new Error('Ply thickness must be positive.');
      const one=sg=>({a:sg*a+0,mat,t,bar:!!(m[3]||m[6])}),grp=m[1]==='±'?[one(1),one(-1)]:m[1]==='∓'?[one(-1),one(1)]:[one(m[1]==='-'?-1:1)];
      for(let k=0;k<n;k++)out.push(...grp.map(p=>({...p})));
    }
    if(close)throw new Error('Close the bracket “(”. '+SEQ_HELP);
    return out;
  }
  let plies=list(null);
  if(!plies.length)throw new Error('Enter at least one ply angle.');
  const base=plies;plies=[];for(let k=0;k<repeat;k++)plies.push(...base.map(p=>({...p})));
  const barred=plies.findIndex(p=>p.bar);
  if(barred>=0&&(barred!==plies.length-1||!useMirror||repeat>1))throw new Error('An overbar marks the middle ply of an odd symmetric laminate, so it must be the last ply inside [ ]s, as in [0/-45/\\bar{60}]s.');
  if(useMirror)plies.push(...plies.slice(0,barred>=0?-1:undefined).reverse().map(p=>({...p})));
  plies.forEach(p=>{delete p.bar;if(p.mat===undefined)delete p.mat;if(p.t===undefined)delete p.t});
  if(plies.length>64)throw new Error('Use no more than 64 expanded plies.');
  return plies;
}
// p is the default lamina; a ply with .mat uses that preset and its own thermal and moisture coefficients.
// t is the default ply thickness; a ply with .t keeps its own.
function laminateCalc(p,list,t,loads,env){
  const items=list.map(x=>typeof x==='number'?{a:x}:x),th=items.map(x=>x.t||t),h=th.reduce((s,v)=>s+v,0),
    zeros=()=>Array.from({length:3},()=>[0,0,0]),A=zeros(),B=zeros(),D=zeros(),N=[0,0,0],M=[0,0,0],plies=[];
  let z0=-h/2;
  items.forEach((pl,k)=>{
    const a=pl.a,mp=pl.mat?presets[pl.mat]:p,e=pl.mat?mp:env;
    const z1=z0+th[k],q=qbar(mp,a),free=expansion(e.a1*1e-6*env.dt+e.b1*env.dc,e.a2*1e-6*env.dt+e.b2*env.dc,a),stress=mv(q,free);
    for(let i=0;i<3;i++){
      N[i]+=stress[i]*(z1-z0);M[i]+=stress[i]*(z1*z1-z0*z0)/2;
      for(let j=0;j<3;j++){A[i][j]+=q[i][j]*(z1-z0);B[i][j]+=q[i][j]*(z1*z1-z0*z0)/2;D[i][j]+=q[i][j]*(z1**3-z0**3)/3}
    }
    plies.push({a,z0,z1,q,free,p:mp,mat:pl.mat});
    z0=z1;
  });
  const abd=Array.from({length:6},(_,i)=>Array.from({length:6},(_,j)=>i<3?(j<3?A[i][j]:B[i][j-3]):j<3?B[i-3][j]:D[i-3][j-3])),
    effective=loads.map((v,i)=>v+(i<3?N[i]:M[i-3])),response=solve(abd,effective);
  return {A,B,D,h,plies,response,N,M,abd};
}
// Local (1-2) stress in a ply at height z for a laminate result r.
function plyStress(r,pl,z){
  const e=r.response.slice(0,3).map((v,k)=>v+z*r.response[k+3]-pl.free[k]);
  return localStress(mv(pl.q,e),pl.a);
}
function strengthOf(p){return {Xt:p.Xt,Xc:p.Xc,Yt:p.Yt,Yc:p.Yc,S:p.S}}
// Smallest factor on the mechanical loads that fails each ply surface. Stress is linear in the factor,
// so stress(lam) = environmental + lam * mechanical, and every index is convex in lam.
function firstPlyFailure(p,list,t,loads,env,interaction,crit){
  const total=laminateCalc(p,list,t,loads,env),envOnly=laminateCalc(p,list,t,[0,0,0,0,0,0],env),rows=[];
  total.plies.forEach((pl,i)=>{
    [pl.z0,pl.z1].forEach((z,j)=>{
      const lt=plyStress(total,pl,z),le=plyStress(envOnly,envOnly.plies[i],z),lm=lt.map((v,k)=>v-le[k]),st=strengthOf(pl.p);
      const at=lam=>le.map((v,k)=>v+lam*lm[k]),idx=lam=>failureCalc(pl.p,st,at(lam),interaction)[crit].index;
      let lam;
      if(idx(0)>=1)lam=0;
      else if(lm.every(v=>Math.abs(v)<1e-12))lam=Infinity;
      else{
        let hi=1;while(idx(hi)<1&&hi<1e9)hi*=2;
        if(hi>=1e9)lam=Infinity;
        else{let lo=0;for(let k=0;k<60;k++){const mid=(lo+hi)/2;if(idx(mid)<1)lo=mid;else hi=mid}lam=hi}
      }
      let mode='—';
      if(Number.isFinite(lam)){
        const l=at(lam),r=[Math.abs(l[0])/(l[0]>=0?st.Xt:st.Xc),Math.abs(l[1])/(l[1]>=0?st.Yt:st.Yc),Math.abs(l[2])/st.S],k=r.indexOf(Math.max(...r));
        mode=['Fiber '+(l[0]>=0?'tension':'compression'),'Matrix '+(l[1]>=0?'tension':'compression'),'Shear'][k];
      }
      rows.push({ply:i,a:pl.a,mat:pl.mat,surface:j,z,lam,mode});
    });
  });
  const governing=rows.reduce((b,r)=>r.lam<b.lam?r:b,{lam:Infinity,ply:-1});
  return {rows,governing};
}
// Failure boundary in the sigma1-sigma2 plane at fixed tau12. Returns null if tau12 alone already fails the ply.
// Rays are sampled in stress normalized by the largest strength on each axis, because X and Y differ by ~40x.
function envelopePoints(p,st,tau,interaction,crit,n=240){
  const pts=[],X0=Math.max(st.Xt,st.Xc),Y0=Math.max(st.Yt,st.Yc),rmax=3;
  for(let i=0;i<=n;i++){
    const phi=2*Math.PI*i/n,u=Math.cos(phi)*X0,v=Math.sin(phi)*Y0,idx=r=>failureCalc(p,st,[r*u,r*v,tau],interaction)[crit].index;
    if(idx(0)>=1)return null;
    if(idx(rmax)<1){pts.push([rmax*u,rmax*v]);continue}
    let lo=0,hi=rmax;
    for(let k=0;k<32;k++){const m=(lo+hi)/2;if(idx(m)<1)lo=m;else hi=m}
    pts.push([hi*u,hi*v]);
  }
  return pts;
}
