'use strict';
// Lecture problems. Choosing one sets the tool's inputs; the answers printed on the slides are then checked
// against the page. slide is the printed value, or null when the slide shows only the formulas.
// get(d) reads the tool's latest result (see toolDone in app.js), so the check follows the inputs.
const setv=(id,v)=>{$(id).value=v};
function setLamina(mat,angle,s){loadPreset(mat);setv('angle',angle);setv('sx',s[0]);setv('sy',s[1]);setv('txy',s[2]);updateAll()}
const failSetup=s=>()=>{setv('twInteraction','mises');setLamina('graphite',60,s)};
const fr=(d,k)=>d.results[k].ratio;
function setMicro(model,xi){$('microReset').onclick();setv('microModel',model);setv('xi',xi);updateMicro()}
function setStack(seq,t,mat,env,loads){
  setv('sequence',seq);setv('plyThickness',t);setv('deltaT',env.dt);setv('deltaC',env.dc);
  ['Nx','Ny','Nxy','Mx','My','Mxy'].forEach((k,i)=>setv(k,loads[i]));
  setv('stackMaterial',mat);
  if(mat==='shared'){['alpha1','alpha2','beta1','beta2'].forEach((k,i)=>setv(k,env.ab[i]));updateStack()}else stackEnvPreset();
}
const NO_LOAD=[0,0,0,0,0,0];
const PROBLEMS=[
// Lamina analysis (lecture 5)
{tool:'lamina',lec:5,num:1,pages:'p. 14',title:'Compliance, stiffness and local strains',
 text:String.raw`Graphite/epoxy unidirectional lamina from Table 2.1 under $\sigma_1 = 2$, $\sigma_2 = -3$ and $\tau_{12} = 4$ MPa. Find $[S]$, $\nu_{21}$, $[Q]$ and the strains in the 1-2 system.`,
 note:'Lecture 5 has no worked answers. The [S] values below are printed in Lecture 6, p. 19.',
 set(){setLamina('graphite',0,[2,-3,4])},
 checks:[
  {q:'S_{11}',u:'Pa⁻¹',slide:0.5525e-11,get:d=>1/(d.p.E1*1e9)},
  {q:'S_{12}',u:'Pa⁻¹',slide:-0.1547e-11,get:d=>-d.p.nu/(d.p.E1*1e9)},
  {q:'S_{22}',u:'Pa⁻¹',slide:0.9709e-10,get:d=>1/(d.p.E2*1e9)},
  {q:'S_{66}',u:'Pa⁻¹',slide:0.1395e-9,get:d=>1/(d.p.G*1e9)},
  {q:'\\nu_{21}',slide:null,get:d=>d.p.nu*d.p.E2/d.p.E1},
  {q:'Q_{11}',u:'Pa',slide:null,get:d=>qmatrix(d.p)[0][0]*1e6},
  {q:'Q_{22}',u:'Pa',slide:null,get:d=>qmatrix(d.p)[1][1]*1e6},
  {q:'\\varepsilon_1',slide:null,get:d=>localStrain(localStress(d.s,d.angle),d.p)[0]},
  {q:'\\varepsilon_2',slide:null,get:d=>localStrain(localStress(d.s,d.angle),d.p)[1]},
  {q:'\\gamma_{12}',slide:null,get:d=>localStrain(localStress(d.s,d.angle),d.p)[2]}]},
{tool:'lamina',lec:5,num:2,pages:'p. 22',title:'60° angle lamina',
 text:String.raw`A $60^\circ$ graphite/epoxy lamina under $\sigma_x = 2$, $\sigma_y = -3$ and $\tau_{xy} = 4$ MPa. Find $[\bar S]$, $[\bar Q]$, the global and local strains and the local stresses.`,
 note:'Lecture 5 has no worked answers. The local stresses below are printed in Lecture 6, p. 11, for the same stress state.',
 set(){setLamina('graphite',60,[2,-3,4])},
 checks:[
  {q:'\\sigma_1',u:'MPa',slide:1.714,get:d=>localStress(d.s,d.angle)[0]},
  {q:'\\sigma_2',u:'MPa',slide:-2.714,get:d=>localStress(d.s,d.angle)[1]},
  {q:'\\tau_{12}',u:'MPa',slide:-4.165,get:d=>localStress(d.s,d.angle)[2]},
  {q:'\\bar S_{11}',u:'Pa⁻¹',slide:null,get:d=>inverse(qbar(d.p,d.angle))[0][0]*1e-6},
  {q:'\\bar Q_{11}',u:'Pa',slide:null,get:d=>qbar(d.p,d.angle)[0][0]*1e6},
  {q:'\\varepsilon_x',slide:null,get:d=>mv(inverse(qbar(d.p,d.angle)),d.s)[0]},
  {q:'\\varepsilon_y',slide:null,get:d=>mv(inverse(qbar(d.p,d.angle)),d.s)[1]},
  {q:'\\gamma_{xy}',slide:null,get:d=>mv(inverse(qbar(d.p,d.angle)),d.s)[2]}]},
// Failure theories (lecture 6). With sigma = (2, -3, 4) x 1 MPa, the strength ratio equals the largest S.
{tool:'failure',lec:6,num:1,pages:'pp. 10–11',title:'Maximum stress: largest S',
 text:String.raw`Find the largest $S > 0$ for $\sigma_x = 2S$, $\sigma_y = -3S$, $\tau_{xy} = 4S$ on a $60^\circ$ graphite/epoxy lamina, by maximum stress. With $S = 1$ MPa entered, the strength ratio is the largest $S$.`,
 set:failSetup([2,-3,4]),
 checks:[
  {q:'\\sigma_1/S',slide:1.714,get:d=>d.l[0]},{q:'\\sigma_2/S',slide:-2.714,get:d=>d.l[1]},{q:'\\tau_{12}/S',slide:-4.165,get:d=>d.l[2]},
  {q:'S_{\\max}',u:'MPa',slide:16.33,get:d=>fr(d,0)}],
 note:'The slide finds that the lamina fails in shear.'},
{tool:'failure',lec:6,num:2,pages:'pp. 12–13',title:'Off-axis shear strength',
 text:String.raw`Find the off-axis shear strength of a $60^\circ$ graphite/epoxy lamina by maximum stress: the smaller magnitude of the largest positive and largest negative $\tau_{xy}$.`,
 set:failSetup([0,0,1]),
 checks:[
  {q:'\\text{largest positive }\\tau_{xy}',u:'MPa',slide:136.0,get:d=>failureCalc(d.p,d.st,localStress([0,0,Math.abs(d.s[2])||1],d.angle),'mises')[0].ratio*(Math.abs(d.s[2])||1)},
  {q:'\\text{largest negative }\\tau_{xy}',u:'MPa',slide:-46.19,get:d=>-failureCalc(d.p,d.st,localStress([0,0,-(Math.abs(d.s[2])||1)],d.angle),'mises')[0].ratio*(Math.abs(d.s[2])||1)}],
 note:'The shear strength is the smaller magnitude, 46.19 MPa. It depends on the sign of the shear stress. The slide states this rule but does not print the single value.'},
{tool:'failure',lec:6,num:3,pages:'pp. 15–16',title:'Maximum stress: strength ratio',
 text:String.raw`Find the strength ratio for $\sigma_x = 2$, $\sigma_y = -3$ and $\tau_{xy} = 4$ MPa on a $60^\circ$ graphite/epoxy lamina, by maximum stress, and the load just before failure.`,
 set:failSetup([2,-3,4]),
 checks:[
  {q:'R',slide:16.33,get:d=>fr(d,0)},
  {q:'R\\,\\sigma_x',u:'MPa',slide:32.66,get:d=>fr(d,0)*d.s[0]},{q:'R\\,\\sigma_y',u:'MPa',slide:-48.99,get:d=>fr(d,0)*d.s[1]},{q:'R\\,\\tau_{xy}',u:'MPa',slide:65.32,get:d=>fr(d,0)*d.s[2]}]},
{tool:'failure',lec:6,num:4,pages:'pp. 18–20',title:'Maximum strain: largest S',
 text:String.raw`Repeat Problem 1 with the maximum strain theory.`,
 set:failSetup([2,-3,4]),
 checks:[
  {q:'(\\varepsilon_1^T)_{ult}',slide:8.287e-3,get:d=>d.st.Xt/(d.p.E1*1000)},{q:'(\\varepsilon_2^T)_{ult}',slide:3.883e-3,get:d=>d.st.Yt/(d.p.E2*1000)},
  {q:'(\\varepsilon_2^C)_{ult}',slide:2.388e-2,get:d=>d.st.Yc/(d.p.E2*1000)},{q:'(\\gamma_{12})_{ult}',slide:9.483e-3,get:d=>d.st.S/(d.p.G*1000)},
  {q:'S_{\\max}',u:'MPa',slide:16.33,get:d=>fr(d,1)}],
 note:'The slide prints the shear modulus in (γ₁₂)ult as 7.17 × 10⁶; it should be 7.17 × 10⁹ Pa. The printed result uses the correct value. Failure mode: shear.'},
{tool:'failure',lec:6,num:5,pages:'pp. 24–26',title:'Tsai–Hill and modified Tsai–Hill',
 text:String.raw`Repeat Problem 1 with Tsai–Hill (p. 24) and modified Tsai–Hill (p. 26).`,
 set:failSetup([2,-3,4]),
 checks:[{q:'S_{\\max}\\text{ (Tsai–Hill)}',u:'MPa',slide:10.94,get:d=>fr(d,2)},{q:'S_{\\max}\\text{ (modified)}',u:'MPa',slide:16.06,get:d=>fr(d,3)}]},
{tool:'failure',lec:6,num:6,pages:'pp. 31–33',title:'Tsai–Wu (Mises–Hencky H₁₂)',
 text:String.raw`Repeat Problem 1 with Tsai–Wu, taking $H_{12}$ from the Mises–Hencky criterion.`,
 set:failSetup([2,-3,4]),
 checks:[
  {q:'H_2',u:'Pa⁻¹',slide:2.093e-8,get:d=>(1/d.st.Yt-1/d.st.Yc)*1e-6},{q:'H_{11}',u:'Pa⁻²',slide:4.444e-19,get:d=>1/(d.st.Xt*d.st.Xc)*1e-12},
  {q:'H_{22}',u:'Pa⁻²',slide:1.0162e-16,get:d=>1/(d.st.Yt*d.st.Yc)*1e-12},{q:'H_{66}',u:'Pa⁻²',slide:2.1626e-16,get:d=>1/(d.st.S**2)*1e-12},
  {q:'H_{12}',u:'Pa⁻²',slide:-3.360e-18,get:d=>-0.5*Math.sqrt(1/(d.st.Xt*d.st.Xc*d.st.Yt*d.st.Yc))*1e-12},
  {q:'S_{\\max}',u:'MPa',slide:22.39,get:d=>fr(d,4)}],
 note:'Two typos on p. 32: the H₂₂ line substitutes H₆₆’s numbers, and H₁₂ is printed without its minus sign. The values above are the ones used on p. 33. Summary on p. 33: 16.33, 16.33, 10.94, 16.06 and 22.39 MPa.'},
// Micromechanics (lectures 7 and 8): 70% glass/epoxy, Tables 3.1 and 3.2
{tool:'micro',lec:7,num:1,pages:'pp. 9–10',title:'Density and mass fractions',
 text:'A 70% glass/epoxy lamina. Find its density, the mass fractions, the volume of a 4 kg lamina, and the volume and mass of glass and epoxy in it.',
 set(){setMicro('rom',2)},
 checks:[{q:'\\rho_c',u:'kg/m³',slide:null,get:d=>d.r.rho},{q:'W_f',slide:null,get:d=>d.r.wf},{q:'W_m',slide:null,get:d=>1-d.r.wf},
  {q:'v_c',u:'m³',slide:null,get:d=>d.mass/d.r.rho},{q:'w_f',u:'kg',slide:null,get:d=>d.mass*d.r.wf},{q:'w_m',u:'kg',slide:null,get:d=>d.mass*(1-d.r.wf)}],
 note:'The slide shows only the formulas.'},
{tool:'micro',lec:7,num:2,pages:'p. 22',title:'Longitudinal modulus and load share',
 text:'Find the longitudinal modulus of a 70% glass/epoxy lamina, and the fraction of the load the fibers carry.',
 set(){setMicro('rom',2)},
 checks:[{q:'E_1',u:'GPa',slide:null,get:d=>d.r.E1},{q:'F_f/F_c',slide:null,get:d=>d.r.load}],note:'The slide shows only the formulas.'},
{tool:'micro',lec:7,num:3,pages:'p. 25',title:'Transverse modulus',
 text:'Find the transverse modulus of a 70% glass/epoxy lamina by the strength of materials approach.',
 set(){setMicro('rom',2)},
 checks:[{q:'E_2',u:'GPa',slide:10.37,get:d=>d.r.E2}],note:'The result is printed later, on p. 42.'},
{tool:'micro',lec:7,num:4,pages:'p. 34',title:'Poisson’s ratios',
 text:'Find the major and minor Poisson’s ratios of a 70% glass/epoxy lamina.',
 set(){setMicro('rom',2)},
 checks:[{q:'\\nu_{12}',slide:null,get:d=>d.r.nu},{q:'\\nu_{21}',slide:null,get:d=>d.r.nu*d.r.E2/d.r.E1}],note:'The slide shows only the formulas.'},
{tool:'micro',lec:7,num:5,pages:'p. 38',title:'In-plane shear modulus',
 text:'Find the in-plane shear modulus of a 70% glass/epoxy lamina by the strength of materials approach.',
 set(){setMicro('rom',2)},
 checks:[{q:'G_{12}',u:'GPa',slide:4.013,get:d=>d.r.G}],note:'The result is printed later, on p. 47. The inputs give 4.0141, so the slide rounds down.'},
{tool:'micro',lec:7,num:6,pages:'p. 42',title:'Transverse modulus by Halpin–Tsai',
 text:String.raw`Find $E_2$ of a 70% glass/epoxy lamina with circular fibers in a square array by Halpin–Tsai, with $\xi = 2$.`,
 set(){setMicro('ht',2)},
 checks:[{q:'\\eta',slide:null,get:d=>(d.c.Ef/d.c.Em-1)/(d.c.Ef/d.c.Em+d.xi)},{q:'E_2',u:'GPa',slide:null,get:d=>d.r.E2}],
 note:'The slide prints only the strength of materials value, 10.37 GPa, for comparison.'},
{tool:'micro',lec:8,num:1,pages:'p. 7',title:'Longitudinal tensile strength',
 text:'Find the ultimate longitudinal tensile strength of a 70% glass/epoxy lamina, and the minimum and critical fiber volume fractions.',
 set(){setMicro('rom',2)},
 checks:(()=>{const b=d=>d.c.Em*d.c.sf/d.c.Ef;return [
  {q:'(\\varepsilon_f)_{ult}',slide:null,get:d=>d.c.sf/(d.c.Ef*1000)},{q:'(\\varepsilon_m)_{ult}',slide:null,get:d=>d.c.sm/(d.c.Em*1000)},
  {q:'(\\sigma_1^T)_{ult}',u:'MPa',slide:null,get:d=>d.c.sf*d.v+b(d)*(1-d.v)},
  {q:'V_{f,\\min}',slide:null,get:d=>(d.c.sm-b(d))/(d.c.sf-b(d)+d.c.sm)},{q:'V_{f,\\text{crit}}',slide:null,get:d=>(d.c.sm-b(d))/(d.c.sf-b(d))}]})(),
 note:'The slide shows only the formulas.'},
{tool:'micro',lec:8,num:2,pages:'p. 18',title:'Thermal expansion',
 text:'Find the coefficients of thermal expansion of a 70% glass/epoxy lamina.',
 set(){setMicro('rom',2)},
 checks:[{q:'\\alpha_1',u:'μm/m/°C',slide:null,get:d=>d.r.a1},{q:'\\alpha_2',u:'μm/m/°C',slide:null,get:d=>d.r.a2}],note:'The slide shows only the formulas.'},
// Laminate builder
{tool:'laminate',lec:6,num:7,pages:'pp. 38–40',title:'Hygrothermal strains of a 60° ply',
 text:String.raw`A $60^\circ$ glass/epoxy lamina with $\Delta T = -100^\circ$C and $\Delta C = 0.02$ kg/kg and no load. Find the global thermal and moisture coefficients and the strains. A single free ply has midplane strain equal to its free strain.`,
 set(){setStack('[60]',1,'glass',{dt:-100,dc:0.02},NO_LOAD)},
 checks:[
  {q:'\\alpha_x',u:'μm/m/°C',slide:18.73,get:d=>expansion(d.env.a1,d.env.a2,d.plies[0].a)[0]},{q:'\\alpha_y',u:'μm/m/°C',slide:11.98,get:d=>expansion(d.env.a1,d.env.a2,d.plies[0].a)[1]},
  {q:'\\alpha_{xy}',u:'μm/m/°C',slide:-11.69,get:d=>expansion(d.env.a1,d.env.a2,d.plies[0].a)[2]},
  {q:'\\beta_x',slide:0.45,get:d=>expansion(d.env.b1,d.env.b2,d.plies[0].a)[0]},{q:'\\beta_y',slide:0.15,get:d=>expansion(d.env.b1,d.env.b2,d.plies[0].a)[1]},
  {q:'\\beta_{xy}',slide:-0.5196,get:d=>expansion(d.env.b1,d.env.b2,d.plies[0].a)[2]},
  {q:'\\varepsilon_x',slide:0.7127e-2,get:d=>d.r.response[0]},{q:'\\varepsilon_y',slide:0.1802e-2,get:d=>d.r.response[1]},{q:'\\gamma_{xy}',slide:-0.9223e-2,get:d=>d.r.response[2]}],
 note:'Slide p. 39 labels the third entries αxy/2 and βxy/2, but the printed values are the full αxy and βxy. The strains on p. 40 use them that way.'},
{tool:'laminate',lec:9,num:4,pages:'p. 36',title:'[A], [B] and [D] of [0/30/−45]',
 text:'Find [A], [B] and [D] for a three-ply [0/30/−45] graphite/epoxy laminate with 5 mm plies.',
 set(){setStack('[0/30/-45]',5,'graphite',{dt:0,dc:0},NO_LOAD)},
 checks:[
  {q:'z_0',u:'mm',slide:-7.5,get:d=>d.r.plies[0].z0},{q:'z_1',u:'mm',slide:-2.5,get:d=>d.r.plies[0].z1},{q:'z_2',u:'mm',slide:2.5,get:d=>d.r.plies[1].z1},{q:'z_3',u:'mm',slide:7.5,get:d=>d.r.plies[2].z1},
  {q:'A_{11}',u:'GPa·mm',slide:null,get:d=>d.r.A[0][0]/1000},{q:'A_{16}',u:'GPa·mm',slide:null,get:d=>d.r.A[0][2]/1000},
  {q:'B_{11}',u:'GPa·mm²',slide:null,get:d=>d.r.B[0][0]/1000},{q:'D_{11}',u:'GPa·mm³',slide:null,get:d=>d.r.D[0][0]/1000}],
 note:'Only the ply coordinates are printed (in the figure). The slides give no [A], [B] or [D].'},
{tool:'laminate',lec:9,num:5,pages:'pp. 41–43',title:'Antisymmetric [−45/45/−45/45] heated by 80 °C',
 text:String.raw`An antisymmetric $[-45/+45/-45/+45]$ carbon/epoxy laminate with 0.25 mm plies, heated from 20 to 100 °C, with $\alpha_1 = 0.88$ and $\alpha_2 = 31.0\ \mu$m/m/°C. Find the thermal resultants, midplane strains and curvatures.`,
 set(){
  setv('laminaMaterial','custom');setv('E1',137.98);setv('E2',8.987);setv('nu',0.3009);setv('G',6.9);updateAll();
  setStack('[-45/45/-45/45]',0.25,'shared',{dt:80,dc:0,ab:[0.88,31.0,0,0]},NO_LOAD);
 },
 checks:[
  {q:'\\bar Q_{11}(45^\\circ)',u:'GPa',slide:45.22,get:d=>d.r.plies[1].q[0][0]/1000},{q:'\\bar Q_{16}(45^\\circ)',u:'GPa',slide:32.44,get:d=>d.r.plies[1].q[0][2]/1000},
  {q:'A_{11}',u:'GPa·mm',slide:45.22,get:d=>d.r.A[0][0]/1000},{q:'A_{66}',u:'GPa·mm',slide:35.6,get:d=>d.r.A[2][2]/1000},
  {q:'B_{16}',u:'GPa·mm²',slide:4.055,get:d=>d.r.B[0][2]/1000},{q:'D_{11}',u:'GPa·mm³',slide:3.77,get:d=>d.r.D[0][0]/1000},
  {q:'N_x^T',u:'GPa·mm',slide:1.956e-2,get:d=>d.r.N[0]/1000},{q:'M_{xy}^T',u:'GPa·mm²',slide:-3.81e-4,get:d=>d.r.M[2]/1000},
  {q:'\\varepsilon_x^0',slide:3.06e-4,get:d=>d.r.response[0]},{q:'\\kappa_{xy}',u:'mm⁻¹',slide:-9.65e-4,get:d=>d.r.response[5]}],
 note:'The slides give only [Q̄], not E₁, E₂, ν₁₂ and G₁₂. The lamina constants loaded here (E₁ = 137.98, E₂ = 8.987, G₁₂ = 6.9 GPa, ν₁₂ = 0.3009) are solved from that [Q̄]. This preset changes the shared lamina in Lamina analysis.'}
];

const activeProblem={};
function problemBox(tool){
  const el=$(tool+'Problems');if(!el)return;
  const list=PROBLEMS.map((p,i)=>[p,i]).filter(([p])=>p.tool===tool),act=activeProblem[tool],p=act!==undefined?PROBLEMS[act]:null,d=LAST[tool];
  let h='<div class="panelHeader"><h3>Lecture problems</h3><small>'+list.length+' WORKED EXAMPLES</small></div><label>Load a problem<select id="'+tool+'ProblemSel"><option value="">Choose a problem…</option>'+
    list.map(([q,i])=>'<option value="'+i+'"'+(i===act?' selected':'')+'>Lecture '+q.lec+', Problem '+q.num+' · '+q.title+'</option>').join('')+'</select></label>';
  if(p){
    h+='<p class="probText">'+p.text+'</p>';
    if(!d)h+='<p class="help">Fix the inputs to compare with the slides.</p>';
    else{
      const rows=p.checks.map(c=>{let v;try{v=c.get(d)}catch{v=NaN}
        const ok=c.slide===null?null:Number.isFinite(v)&&Math.abs(v-c.slide)<=Math.max(Math.abs(c.slide)*0.005,1e-12);
        return '<tr><td>$'+c.q+'$'+(c.u?' <span class="u">'+c.u+'</span>':'')+'</td><td class="num">'+(c.slide===null?'<span class="u">not printed</span>':'$'+tn(c.slide)+'$')+'</td><td class="num">$'+(Number.isFinite(v)?tn(v):'—')+'$</td><td class="mark '+(ok===null?'':ok?'yes':'no')+'">'+(ok===null?'':ok?'✓':'✗')+'</td></tr>'});
      const nOk=p.checks.filter(c=>c.slide!==null).length;
      h+='<div class="tableWrap"><table class="checks"><thead><tr><th>QUANTITY</th><th>SLIDE</th><th>THIS PAGE</th><th></th></tr></thead><tbody>'+rows.join('')+'</tbody></table></div>';
      h+='<p class="help">'+(p.note?p.note+' ':'')+(nOk?'✓ means within 0.5% of the printed value. ':'')+'Lecture '+p.lec+', '+p.pages+'. The page values follow the current inputs; choose the problem again to reset them. Open “Show the working” below for the steps.</p>';
    }
  }
  el.innerHTML=h;
  $(tool+'ProblemSel').onchange=e=>{const v=e.target.value;if(v===''){delete activeProblem[tool];problemBox(tool);return}activeProblem[tool]=+v;PROBLEMS[+v].set();problemBox(tool)};
}
function afterUpdate(tool){if(activeProblem[tool]!==undefined)problemBox(tool)}
['lamina','failure','micro','laminate'].forEach(problemBox);
