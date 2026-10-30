'use strict';
// "Show the working": each tool's solution written out with the numbers filled in, in the order of the lecture solutions.
// Output is HTML with $$...$$ blocks that the page typesets with KaTeX.

// Number for TeX: 4 significant figures, scientific form outside 1e-3..1e6.
function tn(v,sig=4){
  if(!Number.isFinite(v))return v>0?'\\infty':'-\\infty';
  if(Math.abs(v)<1e-300)return '0';
  let e=Math.floor(Math.log10(Math.abs(v))),m=Number((v/10**e).toPrecision(sig));
  if(Math.abs(m)>=10){m/=10;e++}
  if(e<-3||e>5)return m+'\\times10^{'+e+'}';
  return String(Number(v.toPrecision(sig)));
}
// Matrix and column vector. Entries far below the largest one are round-off and print as 0.
function texM(m,sig){
  const mx=Math.max(...m.flat().map(Math.abs));
  return '\\begin{bmatrix}'+m.map(r=>r.map(v=>tn(Math.abs(v)<mx*1e-10?0:v,sig)).join('&')).join('\\\\')+'\\end{bmatrix}';
}
const texV=(v,sig)=>texM(v.map(x=>[x]),sig);
const stepBox=(title,body)=>'<div class="step"><h4>'+title+'</h4>'+body+'</div>';
const disp=tex=>'<div class="steq">$$'+tex+'$$</div>';
const note=t=>'<p>'+t+'</p>';
// Units go in \text{}, except ·, μ and °, which KaTeX can only set in math mode.
const unit=u=>'\\;\\text{'+u.replace(/·/g,'}\\cdot\\text{').replace(/μ/g,'}\\mu\\text{').replace(/°/g,'}^\\circ\\text{')+'}';

// Lamina: lecture 5, problems 1 and 2 (SI units, as in the lecture solutions).
function stepsLamina(p,angle,s){
  const E1=p.E1*1e9,E2=p.E2*1e9,G=p.G*1e9,n12=p.nu,n21=n12*E2/E1,den=1-n12*n21,
    S=[[1/E1,-n12/E1,0],[-n12/E1,1/E2,0],[0,0,1/G]],Q=[[E1/den,n12*E2/den,0],[n12*E2/den,E2/den,0],[0,0,G]],
    th=angle*Math.PI/180,c=Math.cos(th),sn=Math.sin(th),T=[[c*c,sn*sn,2*sn*c],[sn*sn,c*c,-2*sn*c],[-sn*c,sn*c,c*c-sn*sn]],
    sx=s.map(v=>v*1e6),s12=mv(T,sx),e12=mv(S,s12),Qb=qbar(p,angle).map(r=>r.map(v=>v*1e6)),Sb=inverse(Qb),exy=mv(Sb,sx);
  let h='';
  h+=stepBox('1. Compliance matrix [S]',disp('[S]=\\begin{bmatrix}\\frac{1}{E_1}&-\\frac{\\nu_{12}}{E_1}&0\\\\-\\frac{\\nu_{12}}{E_1}&\\frac{1}{E_2}&0\\\\0&0&\\frac{1}{G_{12}}\\end{bmatrix}='+texM(S)+unit('Pa')+'^{-1}')+
    note('With $E_1 = '+tn(E1)+'$ Pa, $E_2 = '+tn(E2)+'$ Pa, $\\nu_{12} = '+tn(n12)+'$ and $G_{12} = '+tn(G)+'$ Pa.'));
  h+=stepBox('2. Minor Poisson’s ratio',disp('\\nu_{21}=\\nu_{12}\\,\\frac{E_2}{E_1}='+tn(n12)+'\\times\\frac{'+tn(p.E2)+'}{'+tn(p.E1)+'}='+tn(n21)));
  h+=stepBox('3. Reduced stiffness matrix [Q]',disp('Q_{11}=\\frac{E_1}{1-\\nu_{12}\\nu_{21}},\\quad Q_{12}=\\frac{\\nu_{12}E_2}{1-\\nu_{12}\\nu_{21}},\\quad Q_{22}=\\frac{E_2}{1-\\nu_{12}\\nu_{21}},\\quad Q_{66}=G_{12}')+
    disp('1-\\nu_{12}\\nu_{21}='+tn(den,5)+',\\qquad [Q]='+texM(Q)+unit('Pa')));
  h+=stepBox('4. Transformation matrix [T]',disp('c=\\cos'+tn(angle)+'^\\circ='+tn(c)+',\\qquad s=\\sin'+tn(angle)+'^\\circ='+tn(sn))+
    disp('[T]=\\begin{bmatrix}c^2&s^2&2sc\\\\s^2&c^2&-2sc\\\\-sc&sc&c^2-s^2\\end{bmatrix}='+texM(T)));
  h+=stepBox('5. Local stresses',disp('\\begin{Bmatrix}\\sigma_1\\\\\\sigma_2\\\\\\tau_{12}\\end{Bmatrix}=[T]\\begin{Bmatrix}\\sigma_x\\\\\\sigma_y\\\\\\tau_{xy}\\end{Bmatrix}='+texM(T)+texV(s)+'='+texV(s12.map(v=>v/1e6))+unit('MPa')));
  h+=stepBox('6. Local strains',disp('\\begin{Bmatrix}\\varepsilon_1\\\\\\varepsilon_2\\\\\\gamma_{12}\\end{Bmatrix}=[S]\\begin{Bmatrix}\\sigma_1\\\\\\sigma_2\\\\\\tau_{12}\\end{Bmatrix}='+texV(e12))+
    note('Stresses in Pa here. $\\gamma_{12}$ is the engineering shear strain.'));
  h+=stepBox('7. Transformed matrices',disp('[\\bar Q]=[T]^{-1}[Q][R][T][R]^{-1}='+texM(Qb)+unit('Pa'))+disp('[\\bar S]=[\\bar Q]^{-1}='+texM(Sb)+unit('Pa')+'^{-1}'));
  h+=stepBox('8. Global strains and off-axis modulus',disp('\\begin{Bmatrix}\\varepsilon_x\\\\\\varepsilon_y\\\\\\gamma_{xy}\\end{Bmatrix}=[\\bar S]\\begin{Bmatrix}\\sigma_x\\\\\\sigma_y\\\\\\tau_{xy}\\end{Bmatrix}='+texV(exy))+
    disp('E_x=\\frac{1}{\\bar S_{11}}='+tn(1/Sb[0][0]/1e9)+unit('GPa')+',\\qquad E_y=\\frac{1}{\\bar S_{22}}='+tn(1/Sb[1][1]/1e9)+unit('GPa')));
  return h;
}

// Micromechanics: lecture 7 (strength of materials and Halpin–Tsai) and lecture 8 (tensile strength, thermal expansion).
function stepsMicro(c,v,model,xi,r){
  const w=1-v;let h='';
  h+=stepBox('1. Volume fractions',disp('V_f='+tn(v)+',\\qquad V_m=1-V_f='+tn(w)));
  h+=stepBox('2. Longitudinal modulus (rule of mixtures)',disp('E_1=E_fV_f+E_mV_m='+tn(c.Ef)+'('+tn(v)+')+'+tn(c.Em)+'('+tn(w)+')='+tn(r.E1)+unit('GPa')));
  if(model==='ht'){
    const eta=(c.Ef/c.Em-1)/(c.Ef/c.Em+xi);
    h+=stepBox('3. Transverse modulus (Halpin–Tsai)',disp('\\eta=\\frac{E_f/E_m-1}{E_f/E_m+\\xi}=\\frac{'+tn(c.Ef/c.Em)+'-1}{'+tn(c.Ef/c.Em)+'+'+tn(xi)+'}='+tn(eta))+
      disp('E_2=E_m\\,\\frac{1+\\xi\\eta V_f}{1-\\eta V_f}='+tn(c.Em)+'\\times\\frac{1+'+tn(xi)+'('+tn(eta)+')('+tn(v)+')}{1-'+tn(eta)+'('+tn(v)+')}='+tn(r.E2)+unit('GPa')));
  }else h+=stepBox('3. Transverse modulus (inverse rule of mixtures)',disp('\\frac{1}{E_2}=\\frac{V_f}{E_f}+\\frac{V_m}{E_m}=\\frac{'+tn(v)+'}{'+tn(c.Ef)+'}+\\frac{'+tn(w)+'}{'+tn(c.Em)+'}='+tn(1/r.E2)+unit('GPa')+'^{-1}\\;\\Rightarrow\\;E_2='+tn(r.E2)+unit('GPa')));
  h+=stepBox('4. Major Poisson’s ratio and shear modulus',disp('\\nu_{12}=\\nu_fV_f+\\nu_mV_m='+tn(c.nuf)+'('+tn(v)+')+'+tn(c.num)+'('+tn(w)+')='+tn(r.nu))+
    disp('\\frac{1}{G_{12}}=\\frac{V_f}{G_f}+\\frac{V_m}{G_m}=\\frac{'+tn(v)+'}{'+tn(c.Gf)+'}+\\frac{'+tn(w)+'}{'+tn(c.Gm)+'}\\;\\Rightarrow\\;G_{12}='+tn(r.G)+unit('GPa')));
  h+=stepBox('5. Density and mass fraction',disp('\\rho_c=\\rho_fV_f+\\rho_mV_m='+tn(c.rhof)+'('+tn(v)+')+'+tn(c.rhom)+'('+tn(w)+')='+tn(r.rho)+'\\;\\text{kg/m}^3')+
    disp('W_f=\\frac{\\rho_f}{\\rho_c}V_f=\\frac{'+tn(c.rhof)+'}{'+tn(r.rho)+'}('+tn(v)+')='+tn(r.wf)+',\\qquad W_m=1-W_f='+tn(1-r.wf)));
  h+=stepBox('6. Load carried by the fibers',disp('\\frac{F_f}{F_c}=\\frac{E_fV_f}{E_1}=\\frac{'+tn(c.Ef)+'('+tn(v)+')}{'+tn(r.E1)+'}='+tn(r.load)));
  h+=stepBox('7. Thermal expansion',disp('\\alpha_1=\\frac{\\alpha_fE_fV_f+\\alpha_mE_mV_m}{E_1}=\\frac{'+tn(c.af)+'('+tn(c.Ef)+')('+tn(v)+')+'+tn(c.am)+'('+tn(c.Em)+')('+tn(w)+')}{'+tn(r.E1)+'}='+tn(r.a1)+unit('μstrain/°C'))+
    disp('\\alpha_2=(1+\\nu_f)\\alpha_fV_f+(1+\\nu_m)\\alpha_mV_m-\\alpha_1\\nu_{12}='+tn(r.a2)+unit('μstrain/°C')));
  const ef=c.sf/(c.Ef*1000),em=c.sm/(c.Em*1000),b=c.Em*1000*ef;
  if(ef<em){
    h+=stepBox('8. Longitudinal tensile strength',disp('\\varepsilon_{f,\\text{ult}}=\\frac{\\sigma_{f,\\text{ult}}}{E_f}=\\frac{'+tn(c.sf)+'}{'+tn(c.Ef*1000)+'}='+tn(ef)+',\\qquad E_m\\varepsilon_{f,\\text{ult}}='+tn(b)+unit('MPa'))+
      disp('\\sigma_{1,\\text{first}}=\\sigma_{f,\\text{ult}}V_f+E_m\\varepsilon_{f,\\text{ult}}(1-V_f)='+tn(c.sf)+'('+tn(v)+')+'+tn(b)+'('+tn(w)+')='+tn(c.sf*v+b*w)+unit('MPa'))+
      disp('V_{f,\\min}=\\frac{\\sigma_{m,\\text{ult}}-E_m\\varepsilon_{f,\\text{ult}}}{\\sigma_{f,\\text{ult}}-E_m\\varepsilon_{f,\\text{ult}}+\\sigma_{m,\\text{ult}}}='+tn((c.sm-b)/(c.sf-b+c.sm))+',\\qquad V_{f,\\text{crit}}=\\frac{\\sigma_{m,\\text{ult}}-E_m\\varepsilon_{f,\\text{ult}}}{\\sigma_{f,\\text{ult}}-E_m\\varepsilon_{f,\\text{ult}}}='+tn((c.sm-b)/(c.sf-b))));
  }else h+=stepBox('8. Longitudinal tensile strength',note('The fiber failure strain is not below the matrix failure strain, so the fiber-first model does not apply.'));
  return h;
}

// Failure theories: lecture 6. l is the local stress state in MPa.
function stepsFailure(p,st,s,angle,l,inter,res){
  const {Xt,Xc,Yt,Yc,S}=st,th=angle*Math.PI/180,c=Math.cos(th),sn=Math.sin(th),T=[[c*c,sn*sn,2*sn*c],[sn*sn,c*c,-2*sn*c],[-sn*c,sn*c,c*c-sn*sn]],
    X=l[0]>=0?Xt:Xc,Y=l[1]>=0?Yt:Yc,e=localStrain(l,p),R=x=>'R='+tn(x);
  let h='';
  h+=stepBox('1. Local stresses',disp('\\begin{Bmatrix}\\sigma_1\\\\\\sigma_2\\\\\\tau_{12}\\end{Bmatrix}=[T]\\begin{Bmatrix}\\sigma_x\\\\\\sigma_y\\\\\\tau_{xy}\\end{Bmatrix}='+texM(T)+texV(s)+'='+texV(l)+unit('MPa'))+
    note('$c = \\cos'+tn(angle)+'^\\circ$ and $s = \\sin'+tn(angle)+'^\\circ$. Each allowable is chosen from the sign of its stress.'));
  h+=stepBox('2. Maximum stress',disp('\\frac{|\\sigma_1|}{'+(l[0]>=0?'X_t':'X_c')+'}=\\frac{'+tn(Math.abs(l[0]))+'}{'+tn(X)+'}='+tn(Math.abs(l[0])/X)+',\\quad \\frac{|\\sigma_2|}{'+(l[1]>=0?'Y_t':'Y_c')+'}=\\frac{'+tn(Math.abs(l[1]))+'}{'+tn(Y)+'}='+tn(Math.abs(l[1])/Y)+',\\quad \\frac{|\\tau_{12}|}{S}=\\frac{'+tn(Math.abs(l[2]))+'}{'+tn(S)+'}='+tn(Math.abs(l[2])/S))+
    disp('\\text{index}=\\max(\\cdot)='+tn(res[0].index)+',\\qquad '+R(res[0].ratio)+'=\\frac{1}{\\text{index}}'));
  const eX=(e[0]>=0?Xt:Xc)/(p.E1*1000),eY=(e[1]>=0?Yt:Yc)/(p.E2*1000),eS=S/(p.G*1000);
  h+=stepBox('3. Maximum strain',disp('\\varepsilon_1='+tn(e[0])+',\\quad\\varepsilon_2='+tn(e[1])+',\\quad\\gamma_{12}='+tn(e[2]))+
    disp('\\frac{|\\varepsilon_1|}{'+tn(eX)+'}='+tn(Math.abs(e[0])/eX)+',\\quad\\frac{|\\varepsilon_2|}{'+tn(eY)+'}='+tn(Math.abs(e[1])/eY)+',\\quad\\frac{|\\gamma_{12}|}{'+tn(eS)+'}='+tn(Math.abs(e[2])/eS)+'\\;\\Rightarrow\\;'+R(res[1].ratio))+
    note('The ultimate strains are the strengths divided by $E_1$, $E_2$ and $G_{12}$.'));
  const th2=(a,b)=>'\\frac{'+tn(l[0])+'^2}{'+tn(a)+'^2}-\\frac{('+tn(l[0])+')('+tn(l[1])+')}{'+tn(a)+'^2}+\\frac{'+tn(l[1])+'^2}{'+tn(b)+'^2}+\\frac{'+tn(l[2])+'^2}{'+tn(S)+'^2}';
  h+=stepBox('4. Tsai–Hill',disp(th2(Xt,Yt)+'='+tn(res[2].index))+disp(R(res[2].ratio)+'=\\frac{1}{\\sqrt{'+tn(res[2].index)+'}}')+
    note('Modified Tsai–Hill uses $X = '+tn(X)+'$ and $Y = '+tn(Y)+'$ from the stress signs: index $= '+tn(res[3].index)+'$ and $R = '+tn(res[3].ratio)+'$.'));
  const H1=1/Xt-1/Xc,H2=1/Yt-1/Yc,H11=1/(Xt*Xc),H22=1/(Yt*Yc),H66=1/(S*S),H12=inter==='hill'?-1/(2*Xt*Xt):-.5*Math.sqrt(H11*H22),
    lin=H1*l[0]+H2*l[1],quad=H11*l[0]**2+H22*l[1]**2+2*H12*l[0]*l[1]+H66*l[2]**2;
  h+=stepBox('5. Tsai–Wu',disp('H_1=\\frac{1}{X_t}-\\frac{1}{X_c}='+tn(H1)+',\\quad H_2=\\frac{1}{Y_t}-\\frac{1}{Y_c}='+tn(H2)+',\\quad H_6=0')+
    disp('H_{11}=\\frac{1}{X_tX_c}='+tn(H11)+',\\quad H_{22}=\\frac{1}{Y_tY_c}='+tn(H22)+',\\quad H_{66}=\\frac{1}{S^2}='+tn(H66)+',\\quad H_{12}='+(inter==='hill'?'-\\frac{1}{2X_t^2}':'-\\tfrac12\\sqrt{H_{11}H_{22}}')+'='+tn(H12))+
    disp('\\text{index}=\\underbrace{H_1\\sigma_1+H_2\\sigma_2}_{'+tn(lin)+'}+\\underbrace{H_{11}\\sigma_1^2+H_{22}\\sigma_2^2+2H_{12}\\sigma_1\\sigma_2+H_{66}\\tau_{12}^2}_{'+tn(quad)+'}='+tn(lin+quad))+
    disp('\\text{Strength ratio: }'+tn(quad)+'R^2+'+tn(lin)+'R-1=0\\;\\Rightarrow\\;'+R(res[4].ratio))+note('Units are MPa throughout. The positive root of the quadratic is the strength ratio.'));
  return h;
}

// Laminate: lecture 9, CLT. Units are N, mm and MPa, the same as the laminate builder.
function stepsLaminate(r,loads,env){
  const P=r.plies,n=P.length,zs=[P[0].z0,...P.map(p=>p.z1)];let h='';
  h+=stepBox('1. Ply coordinates',disp('h=\\sum t_k='+tn(r.h)+unit('mm')+',\\qquad z_0=-\\frac{h}{2}='+tn(zs[0])+unit('mm'))+
    disp(zs.map((z,k)=>'z_{'+k+'}='+tn(z)).slice(0,13).join(',\\;')+(n>12?',\\;\\dots':'')+unit('mm')));
  const seen=new Map();P.forEach(pl=>{const k=pl.a+'|'+(pl.mat||'');if(!seen.has(k))seen.set(k,pl)});
  h+=stepBox('2. Transformed stiffness of each ply orientation',[...seen.values()].map(pl=>disp('[\\bar Q]_{'+tn(pl.a)+'^\\circ'+(pl.mat?'\\,'+MAT_SHORT[pl.mat]:'')+'}='+texM(pl.q)+unit('MPa'))).join(''));
  const show=n<=8,sum=(i,j,f)=>P.map((pl,k)=>'('+tn(pl.q[i][j])+')'+f(zs[k+1],zs[k])).join('+');
  h+=stepBox('3. Extensional, coupling and bending stiffnesses',
    disp('A_{ij}=\\sum_{k=1}^{N}(\\bar Q_{ij})_k(z_k-z_{k-1}),\\quad B_{ij}=\\tfrac12\\sum_{k=1}^{N}(\\bar Q_{ij})_k(z_k^2-z_{k-1}^2),\\quad D_{ij}=\\tfrac13\\sum_{k=1}^{N}(\\bar Q_{ij})_k(z_k^3-z_{k-1}^3)')+
    (show?disp('A_{11}='+sum(0,0,(a,b)=>'('+tn(a-b)+')')+'='+tn(r.A[0][0])+unit('N/mm')):'')+
    disp('[A]='+texM(r.A)+unit('N/mm'))+disp('[B]='+texM(r.B)+unit('N'))+disp('[D]='+texM(r.D)+unit('N·mm')));
  if(env.dt||env.dc)h+=stepBox('4. Hygrothermal resultants',disp('\\{N^{T+C}\\}=\\sum_k[\\bar Q]_k\\{\\bar\\alpha\\Delta T+\\bar\\beta\\Delta C\\}_k(z_k-z_{k-1})='+texV(r.N)+unit('N/mm'))+
    disp('\\{M^{T+C}\\}=\\tfrac12\\sum_k[\\bar Q]_k\\{\\bar\\alpha\\Delta T+\\bar\\beta\\Delta C\\}_k(z_k^2-z_{k-1}^2)='+texV(r.M)+unit('N')));
  const eff=loads.map((v,i)=>v+(i<3?r.N[i]:r.M[i-3]));
  h+=stepBox((env.dt||env.dc?'5':'4')+'. Midplane strains and curvatures',disp('\\begin{Bmatrix}\\varepsilon^0\\\\\\kappa\\end{Bmatrix}=\\begin{bmatrix}A&B\\\\B&D\\end{bmatrix}^{-1}\\begin{Bmatrix}N\\\\M\\end{Bmatrix},\\qquad \\begin{Bmatrix}N\\\\M\\end{Bmatrix}='+texV(eff))+
    disp('\\begin{Bmatrix}\\varepsilon_x^0\\\\\\varepsilon_y^0\\\\\\gamma_{xy}^0\\end{Bmatrix}='+texV(r.response.slice(0,3))+',\\qquad\\begin{Bmatrix}\\kappa_x\\\\\\kappa_y\\\\\\kappa_{xy}\\end{Bmatrix}='+texV(r.response.slice(3))+unit('mm')+'^{-1}'));
  const pl=P[0],z=pl.z0,ez=r.response.slice(0,3).map((v,k)=>v+z*r.response[k+3]),em=ez.map((v,k)=>v-pl.free[k]),sg=mv(pl.q,em),sl=localStress(sg,pl.a);
  h+=stepBox((env.dt||env.dc?'6':'5')+'. Stresses at the top of ply 1 (z = '+fmt(z,3)+' mm)',
    disp('\\{\\varepsilon\\}=\\{\\varepsilon^0\\}+z\\{\\kappa\\}='+texV(ez)+(env.dt||env.dc?',\\qquad \\{\\varepsilon\\}-\\{\\varepsilon^{T+C}\\}='+texV(em):''))+
    disp('\\{\\sigma\\}_{xy}=[\\bar Q]_1\\{\\varepsilon\\}'+(env.dt||env.dc?'_{\\text{mech}}':'')+'='+texV(sg)+unit('MPa')+',\\qquad \\{\\sigma\\}_{12}=[T]\\{\\sigma\\}_{xy}='+texV(sl)+unit('MPa'))+
    note('The ply stress table repeats this at the top and bottom of every ply.'));
  return h;
}
