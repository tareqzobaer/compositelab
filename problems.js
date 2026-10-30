'use strict';
// Lecture problems. Choosing one sets the tool's inputs to the problem's data; the tool then shows the result,
// and "Show the working" lists the steps. hint says how to read the answer from the tool when that is not obvious.
const setv=(id,v)=>{$(id).value=v};
function setLamina(mat,angle,s){loadPreset(mat);setv('angle',angle);setv('sx',s[0]);setv('sy',s[1]);setv('txy',s[2]);updateAll()}
const failSetup=s=>()=>{setv('twInteraction','mises');setLamina('graphite',60,s)};
function setMicro(model,xi){$('microReset').onclick();setv('microModel',model);setv('xi',xi);updateMicro()}
function setStack(seq,t,mat,env,loads){
  setv('sequence',seq);setv('plyThickness',t);setv('deltaT',env.dt);setv('deltaC',env.dc);
  ['Nx','Ny','Nxy','Mx','My','Mxy'].forEach((k,i)=>setv(k,loads[i]));
  setv('stackMaterial',mat);
  if(mat==='shared'){['alpha1','alpha2','beta1','beta2'].forEach((k,i)=>setv(k,env.ab[i]));updateStack()}else stackEnvPreset();
}
const NO_LOAD=[0,0,0,0,0,0];
const S1='With S = 1 MPa entered, the strength ratio is the largest S.';
const PROBLEMS=[
// Lamina analysis (lecture 5)
{tool:'lamina',lec:5,num:1,pages:'p. 14',title:'Compliance, stiffness and local strains',
 text:String.raw`Graphite/epoxy unidirectional lamina from Table 2.1 under $\sigma_1 = 2$, $\sigma_2 = -3$ and $\tau_{12} = 4$ MPa. Find $[S]$, $\nu_{21}$, $[Q]$ and the strains in the 1-2 system.`,
 hint:'The angle is 0°, so the local axes coincide with the global axes.',
 set(){setLamina('graphite',0,[2,-3,4])}},
{tool:'lamina',lec:5,num:2,pages:'p. 22',title:'60° angle lamina',
 text:String.raw`A $60^\circ$ graphite/epoxy lamina under $\sigma_x = 2$, $\sigma_y = -3$ and $\tau_{xy} = 4$ MPa. Find $[\bar S]$, $[\bar Q]$, the global and local strains and the local stresses.`,
 set(){setLamina('graphite',60,[2,-3,4])}},
// Failure theories (lecture 6)
{tool:'failure',lec:6,num:1,pages:'pp. 10–11',title:'Maximum stress: largest S',
 text:String.raw`Find the largest $S > 0$ for $\sigma_x = 2S$, $\sigma_y = -3S$, $\tau_{xy} = 4S$ on a $60^\circ$ graphite/epoxy lamina, by maximum stress.`,
 hint:S1,set:failSetup([2,-3,4])},
{tool:'failure',lec:6,num:2,pages:'pp. 12–13',title:'Off-axis shear strength',
 text:String.raw`Find the off-axis shear strength of a $60^\circ$ graphite/epoxy lamina by maximum stress: the smaller magnitude of the largest positive and largest negative $\tau_{xy}$.`,
 hint:'Enter τxy = 1 MPa for the positive limit and τxy = −1 MPa for the negative limit. The strength ratio is then the limiting shear stress in MPa. The shear strength is the smaller of the two.',
 set:failSetup([0,0,1])},
{tool:'failure',lec:6,num:3,pages:'pp. 15–16',title:'Maximum stress: strength ratio',
 text:String.raw`Find the strength ratio for $\sigma_x = 2$, $\sigma_y = -3$ and $\tau_{xy} = 4$ MPa on a $60^\circ$ graphite/epoxy lamina, by maximum stress, and the load just before failure.`,
 hint:'The load just before failure is the strength ratio times the applied stresses.',
 set:failSetup([2,-3,4])},
{tool:'failure',lec:6,num:4,pages:'pp. 18–20',title:'Maximum strain: largest S',
 text:String.raw`Repeat Problem 1 with the maximum strain theory.`,
 hint:S1,set:failSetup([2,-3,4])},
{tool:'failure',lec:6,num:5,pages:'pp. 24–26',title:'Tsai–Hill and modified Tsai–Hill',
 text:String.raw`Repeat Problem 1 with Tsai–Hill (p. 24) and modified Tsai–Hill (p. 26).`,
 hint:S1,set:failSetup([2,-3,4])},
{tool:'failure',lec:6,num:6,pages:'pp. 31–33',title:'Tsai–Wu (Mises–Hencky H₁₂)',
 text:String.raw`Repeat Problem 1 with Tsai–Wu, taking $H_{12}$ from the Mises–Hencky criterion.`,
 hint:S1,set:failSetup([2,-3,4])},
// Micromechanics (lectures 7 and 8): 70% glass/epoxy, Tables 3.1 and 3.2
{tool:'micro',lec:7,num:1,pages:'pp. 9–10',title:'Density and mass fractions',
 text:'A 70% glass/epoxy lamina. Find its density, the mass fractions, the volume of a 4 kg lamina, and the volume and mass of glass and epoxy in it.',
 set(){setMicro('rom',2)}},
{tool:'micro',lec:7,num:2,pages:'p. 22',title:'Longitudinal modulus and load share',
 text:'Find the longitudinal modulus of a 70% glass/epoxy lamina, and the fraction of the load the fibers carry.',
 set(){setMicro('rom',2)}},
{tool:'micro',lec:7,num:3,pages:'p. 25',title:'Transverse modulus',
 text:'Find the transverse modulus of a 70% glass/epoxy lamina by the strength of materials approach.',
 set(){setMicro('rom',2)}},
{tool:'micro',lec:7,num:4,pages:'p. 34',title:'Poisson’s ratios',
 text:'Find the major and minor Poisson’s ratios of a 70% glass/epoxy lamina.',
 set(){setMicro('rom',2)}},
{tool:'micro',lec:7,num:5,pages:'p. 38',title:'In-plane shear modulus',
 text:'Find the in-plane shear modulus of a 70% glass/epoxy lamina by the strength of materials approach.',
 set(){setMicro('rom',2)}},
{tool:'micro',lec:7,num:6,pages:'p. 42',title:'Transverse modulus by Halpin–Tsai',
 text:String.raw`Find $E_2$ of a 70% glass/epoxy lamina with circular fibers in a square array by Halpin–Tsai, with $\xi = 2$.`,
 set(){setMicro('ht',2)}},
{tool:'micro',lec:8,num:1,pages:'p. 7',title:'Longitudinal tensile strength',
 text:'Find the ultimate longitudinal tensile strength of a 70% glass/epoxy lamina, and the minimum and critical fiber volume fractions.',
 set(){setMicro('rom',2)}},
{tool:'micro',lec:8,num:2,pages:'p. 18',title:'Thermal expansion',
 text:'Find the coefficients of thermal expansion of a 70% glass/epoxy lamina.',
 set(){setMicro('rom',2)}},
// Laminate builder
{tool:'laminate',lec:6,num:7,pages:'pp. 38–40',title:'Hygrothermal strains of a 60° ply',
 text:String.raw`A $60^\circ$ glass/epoxy lamina with $\Delta T = -100^\circ$C and $\Delta C = 0.02$ kg/kg and no load. Find the global thermal and moisture coefficients and the strains.`,
 hint:'A single free ply has a midplane strain equal to its free hygrothermal strain.',
 set(){setStack('[60]',1,'glass',{dt:-100,dc:0.02},NO_LOAD)}},
{tool:'laminate',lec:9,num:4,pages:'p. 36',title:'[A], [B] and [D] of [0/30/−45]',
 text:'Find [A], [B] and [D] for a three-ply [0/30/−45] graphite/epoxy laminate with 5 mm plies.',
 set(){setStack('[0/30/-45]',5,'graphite',{dt:0,dc:0},NO_LOAD)}},
{tool:'laminate',lec:9,num:5,pages:'pp. 41–43',title:'Antisymmetric [−45/45/−45/45] heated by 80 °C',
 text:String.raw`An antisymmetric $[-45/+45/-45/+45]$ carbon/epoxy laminate with 0.25 mm plies, heated from 20 to 100 °C, with $\alpha_1 = 0.88$ and $\alpha_2 = 31.0\ \mu$m/m/°C. Find the thermal resultants, midplane strains and curvatures.`,
 hint:'The lecture gives only [Q̄] for this lamina, not E₁, E₂, ν₁₂ and G₁₂. The constants loaded here (E₁ = 137.98, E₂ = 8.987, G₁₂ = 6.9 GPa, ν₁₂ = 0.3009) are solved from that [Q̄]. This problem changes the shared lamina in Lamina analysis.',
 set(){
  setv('laminaMaterial','custom');setv('E1',137.98);setv('E2',8.987);setv('nu',0.3009);setv('G',6.9);updateAll();
  setStack('[-45/45/-45/45]',0.25,'shared',{dt:80,dc:0,ab:[0.88,31.0,0,0]},NO_LOAD);
 }}
];

const activeProblem={};
function problemBox(tool){
  const el=$(tool+'Problems');if(!el)return;
  const list=PROBLEMS.map((p,i)=>[p,i]).filter(([p])=>p.tool===tool),act=activeProblem[tool],p=act!==undefined?PROBLEMS[act]:null;
  let h='<div class="panelHeader"><h3>Lecture problems</h3><small>'+list.length+' WORKED EXAMPLES</small></div><label>Load a problem<select id="'+tool+'ProblemSel"><option value="">Choose a problem…</option>'+
    list.map(([q,i])=>'<option value="'+i+'"'+(i===act?' selected':'')+'>Lecture '+q.lec+', Problem '+q.num+' · '+q.title+'</option>').join('')+'</select></label>';
  if(p)h+='<p class="probText">'+p.text+'</p><p class="help">'+(p.hint?p.hint+' ':'')+'Lecture '+p.lec+', '+p.pages+'. Open “Show the working” below for the steps.</p>';
  el.innerHTML=h;
  $(tool+'ProblemSel').onchange=e=>{const v=(e.target).value;if(v===''){delete activeProblem[tool];problemBox(tool);return}activeProblem[tool]=+v;PROBLEMS[+v].set();problemBox(tool)};
}
['lamina','failure','micro','laminate'].forEach(problemBox);
