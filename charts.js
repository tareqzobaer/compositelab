'use strict';
// SVG chart drawing.
function plot(el,series,xmax,ymax,marker,xlabel){const W=620,H=el.viewBox.baseVal.height,L=52,R=20,T=20,B=40,pw=W-L-R,ph=H-T-B;let svg='';for(let i=0;i<=4;i++){let y=T+ph*i/4,v=ymax*(1-i/4);svg+='<line class="grid" x1="'+L+'" y1="'+y+'" x2="'+(W-R)+'" y2="'+y+'"/><text x="'+(L-9)+'" y="'+(y+4)+'" text-anchor="end">'+fmt(v,1)+'</text>'}for(let i=0;i<=6;i++){let x=L+pw*i/6;svg+='<text x="'+x+'" y="'+(H-17)+'" text-anchor="middle">'+fmt(xmax*i/6,0)+'</text>'}svg+='<line class="axis" x1="'+L+'" y1="'+(T+ph)+'" x2="'+(W-R)+'" y2="'+(T+ph)+'"/>';for(const s of series){const pts=Array.from({length:181},(_,i)=>{const x=xmax*i/180;return [L+pw*x/xmax,T+ph-ph*s.fn(x)/ymax]});svg+='<path class="'+s.cls+'" d="'+pts.map((p,i)=>(i?'L':'M')+p.map(v=>v.toFixed(2)).join(',')).join('')+'"/>'}if(marker!==undefined){const x=L+pw*marker/xmax;svg+='<line x1="'+x+'" y1="'+T+'" x2="'+x+'" y2="'+(T+ph)+'" stroke="#8a9683" stroke-dasharray="4 4"/>';series.forEach(s=>svg+='<circle cx="'+x+'" cy="'+(T+ph-ph*s.fn(marker)/ymax)+'" r="4.5" fill="'+(s.cls==='long'?'#c34e2b':'#256957')+'" stroke="white" stroke-width="2"/>')}svg+='<text x="'+(W-R)+'" y="'+(H-2)+'" text-anchor="end">'+xlabel+'</text>';el.innerHTML=svg}
function niceTicks(lo,hi,n=5){
  const raw=(hi-lo)/n,mag=10**Math.floor(Math.log10(raw)),f=raw/mag,step=(f<1.5?1:f<3?2:f<7?5:10)*mag,out=[];
  for(let v=Math.ceil(lo/step-1e-9)*step;v<=hi+step*1e-9;v+=step)out.push(Math.abs(v)<step*1e-6?0:v);
  return out;
}
// Failure boundaries in the local sigma1-sigma2 plane. curves: [{n:1..4,pts}], pt: [sigma1,sigma2] or null.
function envelopeChart(el,curves,st,pt){
  const W=620,H=340,L=58,R=18,T=14,B=38,pw=W-L-R,ph=H-T-B;
  let xmin=-1.12*st.Xc,xmax=1.12*st.Xt,ymin=-1.12*st.Yc,ymax=1.12*st.Yt;
  if(pt){xmin=Math.min(xmin,pt[0]*1.1);xmax=Math.max(xmax,pt[0]*1.1);ymin=Math.min(ymin,pt[1]*1.1);ymax=Math.max(ymax,pt[1]*1.1)}
  const X=v=>(L+pw*(v-xmin)/(xmax-xmin)).toFixed(2),Y=v=>(T+ph*(1-(v-ymin)/(ymax-ymin))).toFixed(2);
  let s='<clipPath id="envclip"><rect x="'+L+'" y="'+T+'" width="'+pw+'" height="'+ph+'"/></clipPath>';
  niceTicks(ymin,ymax,6).forEach(v=>s+='<line class="grid" x1="'+L+'" x2="'+(W-R)+'" y1="'+Y(v)+'" y2="'+Y(v)+'"/><text x="'+(L-8)+'" y="'+(+Y(v)+4)+'" text-anchor="end">'+fmt(v,0)+'</text>');
  niceTicks(xmin,xmax,6).forEach(v=>s+='<line class="grid" x1="'+X(v)+'" x2="'+X(v)+'" y1="'+T+'" y2="'+(T+ph)+'"/><text x="'+X(v)+'" y="'+(H-20)+'" text-anchor="middle">'+fmt(v,0)+'</text>');
  s+='<line class="zero" x1="'+X(0)+'" x2="'+X(0)+'" y1="'+T+'" y2="'+(T+ph)+'"/><line class="zero" x1="'+L+'" x2="'+(W-R)+'" y1="'+Y(0)+'" y2="'+Y(0)+'"/><g clip-path="url(#envclip)">';
  curves.forEach(c=>{if(c.pts)s+='<path class="env env'+c.n+'" d="'+c.pts.map((p,i)=>(i?'L':'M')+X(p[0])+','+Y(p[1])).join('')+'Z"/>'});
  if(pt)s+='<line class="guide" x1="'+X(0)+'" y1="'+Y(0)+'" x2="'+X(pt[0])+'" y2="'+Y(pt[1])+'"/><circle class="pt" cx="'+X(pt[0])+'" cy="'+Y(pt[1])+'" r="5" stroke-width="2"/>';
  s+='</g><text x="'+(W-R)+'" y="'+(H-4)+'" text-anchor="end">σ₁ (MPa)</text><text transform="translate(12 '+(T+ph/2)+') rotate(-90)" text-anchor="middle">σ₂ (MPa)</text>';
  el.innerHTML=s;
}
// Local ply stress through the laminate thickness. segs: [{z0,z1,v0,v1}], top of the laminate at the top of the chart.
function profileChart(el,segs,title,cls){
  const W=220,H=250,L=42,R=10,T=26,B=28,pw=W-L-R,ph=H-T-B,zmin=segs[0].z0,zmax=segs[segs.length-1].z1;
  let vmax=Math.max(...segs.flatMap(g=>[Math.abs(g.v0),Math.abs(g.v1)]));if(vmax<1e-9)vmax=1;vmax*=1.1;
  const X=v=>(L+pw*(v+vmax)/(2*vmax)).toFixed(2),Y=z=>(T+ph*(z-zmin)/(zmax-zmin)).toFixed(2);
  let s='<text class="title" x="'+L+'" y="14">'+title+'</text>';
  segs.forEach(g=>s+='<line class="grid" x1="'+L+'" x2="'+(W-R)+'" y1="'+Y(g.z0)+'" y2="'+Y(g.z0)+'"/>');
  s+='<line class="grid" x1="'+L+'" x2="'+(W-R)+'" y1="'+(T+ph)+'" y2="'+(T+ph)+'"/><line class="zero" x1="'+X(0)+'" x2="'+X(0)+'" y1="'+T+'" y2="'+(T+ph)+'"/>';
  segs.forEach(g=>s+='<path class="'+cls+'" d="M'+X(g.v0)+','+Y(g.z0)+'L'+X(g.v1)+','+Y(g.z1)+'"/>');
  s+='<text x="'+(L-5)+'" y="'+(T+4)+'" text-anchor="end">'+fmt(zmin,2)+'</text><text x="'+(L-5)+'" y="'+(T+ph+4)+'" text-anchor="end">'+fmt(zmax,2)+'</text><text x="'+(L-5)+'" y="'+(T+ph/2+4)+'" text-anchor="end">z</text>';
  s+='<text x="'+L+'" y="'+(H-10)+'" text-anchor="start">'+fmt(-vmax,0)+'</text><text x="'+X(0)+'" y="'+(H-10)+'" text-anchor="middle">0</text><text x="'+(W-R)+'" y="'+(H-10)+'" text-anchor="end">'+fmt(vmax,0)+'</text>';
  el.innerHTML=s;
}
// Slide-style figure: hatched lamina, global x-y axes and local 1-2 axes rotated by theta (degrees, counterclockwise).
function axesFigure(el,angle){
  const cx=150,cy=130,th=angle*Math.PI/180,P=(r,a)=>[cx+r*Math.cos(a),cy-r*Math.sin(a)].map(v=>v.toFixed(1)).join(','),
    xy=(r,a)=>[cx+r*Math.cos(a),cy-r*Math.sin(a)];
  let s='<defs><pattern id="fibs" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate('+(-angle)+')"><path class="fib" d="M0 5H10"/></pattern>'+
    '<marker id="arrG" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path class="mg" d="M0 0L7 3.5 0 7Z"/></marker>'+
    '<marker id="arrL" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path class="ml" d="M0 0L7 3.5 0 7Z"/></marker></defs>'+
    '<rect class="lam" x="55" y="60" width="190" height="130"/><rect x="55" y="60" width="190" height="130" fill="url(#fibs)"/>'+
    '<path class="gl" d="M26,'+cy+'H284" marker-end="url(#arrG)"/><path class="gl" d="M'+cx+',206V16" marker-end="url(#arrG)"/>'+
    '<path class="lc" d="M'+cx+','+cy+'L'+P(104,th)+'" marker-end="url(#arrL)"/><path class="lc" d="M'+cx+','+cy+'L'+P(80,th+Math.PI/2)+'" marker-end="url(#arrL)"/>';
  if(Math.abs(angle)>=3)s+='<path class="arc" d="M'+P(44,0)+' A44 44 0 0 '+(angle>0?0:1)+' '+P(44,th)+'" marker-end="url(#arrL)"/>';
  const t=xy(58,th/2),l1=xy(116,th),l2=xy(93,th+Math.PI/2);
  s+='<circle class="dot" cx="'+cx+'" cy="'+cy+'" r="2.6"/>';
  if(Math.abs(angle)>=3)s+='<text x="'+t[0].toFixed(1)+'" y="'+(t[1]+4).toFixed(1)+'" text-anchor="middle">θ</text>';
  s+='<text class="g" x="288" y="'+(cy-6)+'" text-anchor="end">x</text><text class="g" x="'+(cx+8)+'" y="20">y</text>'+
    '<text class="n" x="'+l1[0].toFixed(1)+'" y="'+(l1[1]+4).toFixed(1)+'" text-anchor="middle">1</text><text class="n" x="'+l2[0].toFixed(1)+'" y="'+(l2[1]+4).toFixed(1)+'" text-anchor="middle">2</text>';
  el.innerHTML=s;
}
// Side cross-section of the laminate, after the lecture 9 slide "Laminated plate geometry and ply numbering system".
// Plies are numbered top to bottom, z points down from the middle surface, z_k is the lower face of ply k.
function sideFigure(el,plies,r,first){
  // Ply heights are drawn in proportion to their thickness; the overall height depends only on the ply count.
  const N=plies.length,avg=N<=8?40:N<=16?26:Math.max(7,Math.floor(330/N)),top=34,L=100,Wb=240,W=450,body=N*avg,H=top*2+body,mid=top+body/2,h=r.h,R=L+Wb,
    zk=k=>k<N?r.plies[k].z0:r.plies[N-1].z1,Y=z=>top+body*(z+h/2)/h,yk=k=>Y(zk(k)),sub=(k,v)=>'z<tspan class="sub" dy="3">'+k+'</tspan><tspan dy="-3"> = '+v+'</tspan>';
  let s='<defs><marker id="dimarr" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto-start-reverse"><path class="ml" d="M0 0L7 3.5 0 7Z"/></marker></defs>';
  plies.forEach((pl,i)=>{
    const a=pl.a,cls=a===0?'p0':Math.abs(a)===90?'p90':a>0?'ppos':'pneg',y=yk(i),ph=yk(i+1)-y;
    s+='<rect class="sp '+cls+(i===first?' first':'')+'" x="'+L+'" y="'+y+'" width="'+Wb+'" height="'+ph+'"/>';
    if(ph>=14){
      if(a===0)for(let yy=y+6;yy<y+ph-3;yy+=7)s+='<line class="fibl" x1="'+L+'" x2="'+R+'" y1="'+yy+'" y2="'+yy+'"/>';
      else if(Math.abs(a)===90)for(let yy=y+7;yy<y+ph-3;yy+=9)for(let xx=L+12;xx<R-4;xx+=15)s+='<circle class="fibd" cx="'+xx+'" cy="'+yy+'" r="2.2"/>';
      else{const rx=(3+9*Math.abs(Math.cos(a*Math.PI/180))).toFixed(1);for(let yy=y+7;yy<y+ph-3;yy+=9)for(let xx=L+18;xx<R-8;xx+=30)s+='<ellipse class="fibd" cx="'+xx+'" cy="'+yy+'" rx="'+rx+'" ry="2.2"/>'}
    }
  });
  s+='<rect class="bodyline" x="'+L+'" y="'+top+'" width="'+Wb+'" height="'+body+'"/>';
  plies.forEach((pl,i)=>{
    const ph=yk(i+1)-yk(i);
    if(ph<11)return;
    const t=(i+1)+' · '+pl.a+'°'+(pl.mat?' '+MAT_SHORT[pl.mat]:''),y=yk(i)+ph/2,small=ph<18,pw=t.length*(small?5:6.2)+8,pH=small?ph-2:16;
    s+='<rect class="pill" x="'+(L+5)+'" y="'+(y-pH/2)+'" width="'+pw+'" height="'+pH+'" rx="2"/><text'+(small?' style="font-size:9px"':'')+' x="'+(L+9)+'" y="'+(y+(small?3:4))+'">'+t+'</text>';
  });
  s+='<line class="midl" x1="'+(L-14)+'" x2="'+(R+4)+'" y1="'+mid+'" y2="'+mid+'"/><rect class="pill" x="'+(L+Wb/2-6)+'" y="'+(mid-9)+'" width="88" height="18" rx="3"/><text class="mid" x="'+(L+Wb/2-2)+'" y="'+(mid+4)+'">Middle surface</text>';
  // coordinate axes on the middle surface: x to the right, z down
  const gx=R-30,zl=Math.max(10,Math.min(40,body/2-6));
  s+='<line class="gz" x1="'+gx+'" y1="'+mid+'" x2="'+(R-4)+'" y2="'+mid+'" marker-end="url(#dimarr)"/><line class="gz" x1="'+gx+'" y1="'+mid+'" x2="'+gx+'" y2="'+(mid+zl)+'" marker-end="url(#dimarr)"/>'+
    '<text class="ax" x="'+(R-12)+'" y="'+(mid-6)+'">x</text><text class="ax" x="'+(gx+6)+'" y="'+(mid+zl-2)+'">z</text>';
  // thickness dimensions on the left
  const d1=26,d2=64,tk=(h<1?h.toFixed(3):h.toFixed(2)).replace(/\.?0+$/,'');
  s+='<line class="ext" x1="'+(d1-6)+'" x2="'+L+'" y1="'+top+'" y2="'+top+'"/><line class="ext" x1="'+(d1-6)+'" x2="'+L+'" y1="'+(top+body)+'" y2="'+(top+body)+'"/>'+
    '<line class="dim" x1="'+d1+'" y1="'+top+'" x2="'+d1+'" y2="'+(top+body)+'" marker-start="url(#dimarr)" marker-end="url(#dimarr)"/>'+
    '<text class="ax" transform="translate(16 '+mid+') rotate(-90)" text-anchor="middle">t = '+tk+' mm</text>'+
    '<line class="dim" x1="'+d2+'" y1="'+top+'" x2="'+d2+'" y2="'+mid+'" marker-start="url(#dimarr)" marker-end="url(#dimarr)"/><line class="dim" x1="'+d2+'" y1="'+mid+'" x2="'+d2+'" y2="'+(top+body)+'" marker-start="url(#dimarr)" marker-end="url(#dimarr)"/>'+
    '<text class="ax" x="'+(d2+5)+'" y="'+(top+body/4+4)+'">t/2</text><text class="ax" x="'+(d2+5)+'" y="'+(top+body*3/4+4)+'">t/2</text>';
  // z_k on the right
  const step=Math.ceil(N/10);
  for(let k=0;k<=N;k++){
    if(k%step&&k!==N)continue;
    const y=yk(k);
    s+='<line class="ext" x1="'+R+'" x2="'+(R+10)+'" y1="'+y+'" y2="'+y+'"/><text x="'+(R+14)+'" y="'+(y+4)+'">'+sub(k,fmt(zk(k),3))+'</text>';
  }
  s+='<text class="note" x="'+(L+Wb/2)+'" y="16" text-anchor="middle">Top ply (1)</text><text class="note" x="'+(L+Wb/2)+'" y="'+(H-8)+'" text-anchor="middle">Bottom ply ('+N+')</text>';
  el.innerHTML='<svg class="chart sidefig" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Side view of the laminate showing ply numbers, the middle surface, thickness and z coordinates">'+s+'</svg>';
}
