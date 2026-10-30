'use strict';
const chapters=[
{title:'Introduction',pages:36,topics:[
['Fiber, matrix, interface','A composite has distinct constituents. The fibers reinforce. The matrix binds the fibers, protects them, and passes load between them. The interface decides how well that load transfer works.',8],
['Why composites?','They are light. High specific stiffness $E/\\rho$ and specific strength $\\sigma/\\rho$ are the main reason to use them. Fiber direction also lets you tailor the material to the load path.',14],
['Tradeoffs','Fabrication, inspection, repair and cost can cancel the benefit. Characterizing the mechanical behavior is also harder. A unidirectional layup is poor when the load comes from many directions.',19],
['Why thin fibers?','Thin fibers have fewer critical flaws. They give more interface area for the same reinforcement volume. They are also flexible enough to process.',29],
['Selecting constituents','Fiber material, length, diameter, orientation and shape all matter. The matrix and the interface quality control transverse, shear and environmental performance.',32]]},
{title:'Classification of Composites',pages:28,topics:[
['Geometry of reinforcement','Composites are particulate, flake, fiber or nanocomposite, depending on the reinforcement shape. Continuous fibers give strong directional properties. Randomly dispersed short fibers cost less to make.',3],
['Matrix families','PMC is polymer matrix. MMC is metal matrix. CMC is ceramic matrix. CCC is carbon fiber in a carbon matrix. Each has different service conditions and processing needs.',12],
['Reinforcement families','Glass is the common choice for PMCs. Aramid (Kevlar), carbon/graphite, boron and ceramic fibers differ in stiffness, strength and temperature behavior. Jute is the natural fiber covered in the lecture.',11],
['Lamina versus laminate','A lamina is one layer of unidirectional or woven reinforcement in a matrix. A laminate is several laminae bonded together, usually at different angles.',25],
['Three scales of analysis','Micromechanics predicts ply properties from the constituents. Lamina macromechanics relates stresses and strains in one ply. Laminate analysis combines the plies.',26]]},
{title:'Manufacturing of Composites',pages:24,topics:[
['Making glass fibers','The raw materials are melted and drawn through fine bushing openings. The filaments get a sizing coat, then they are gathered and wound. Sizing protects the filaments, holds the strands together and helps adhesion.',3],
['Polymer composite routes','The main routes are hand lay-up, spray-up, prepreg/autoclave, filament winding, pultrusion and RTM. They trade off part geometry, fiber control, cost and production rate. Use the selector below to compare them.',6],
['Other matrix routes','Diffusion bonding joins metal foils around the reinforcement. Hot pressing consolidates ceramic systems. Carbon-carbon composites are densified by repeated impregnation and carbonization.',20]]},
{title:'Review of Mechanics',pages:39,topics:[
['Stress and strain','Normal and shear components describe the traction and the deformation. Engineering shear strain $\\gamma$ is twice the tensor shear strain $\\varepsilon$ for the same pair of axes.',2],
['Isotropic elasticity','E, ν, G and K are related. For isotropic linear elasticity, $G = E/[2(1+\\nu)]$ and $K = E/[3(1-2\\nu)]$.',5],
['Strain energy','For linear elasticity, the strain energy density is half the stress-strain inner product: $U = \\tfrac12(\\sigma_1\\varepsilon_1 + \\sigma_2\\varepsilon_2 + \\sigma_3\\varepsilon_3 + \\tau_{23}\\gamma_{23} + \\tau_{31}\\gamma_{31} + \\tau_{12}\\gamma_{12})$.',10],
['Elastic symmetry','A general anisotropic solid has 21 independent stiffness constants. Symmetry reduces that. Monoclinic has 13, orthotropic 9, transversely isotropic 5 and isotropic 2.',15],
['Compliance and stiffness','Stress = stiffness × strain, and strain = compliance × stress. The matrices are symmetric, so reciprocity holds. That gives relations between the elastic constants.',30]]},
{title:'Macromechanics of a Lamina I',pages:34,topics:[
['Effective homogeneous material','On a scale much larger than the fiber diameter, a ply behaves like a homogeneous material. Volume-averaged stress and strain define its effective elastic constants.',3],
['Plane stress and material axes','A thin ply with free surfaces has $\\sigma_3 = \\tau_{23} = \\tau_{31} = 0$. Axis 1 follows the fibers and axis 2 is transverse. Four constants describe the ply: $E_1$, $E_2$, $\\nu_{12}$ and $G_{12}$.',5],
['Reduced stiffness Q','The plane-stress stiffness and compliance matrices link local stress and engineering strain. Reciprocity gives $\\nu_{21}/E_2 = \\nu_{12}/E_1$.',7],
['Off-axis response','θ is measured from global x to local axis 1. Transform the stress or strain to the right axes before using the constitutive equations. A rotated ply couples normal and shear response through $\\bar Q_{16}$ and $\\bar Q_{26}$.',15],
['Engineering constants of an angle ply','The off-axis modulus and Poisson response come from the rotated compliance matrix. $E_x = 1/\\bar S_{11}$ and $E_y = 1/\\bar S_{22}$.',23]]},
{title:'Macromechanics of a Lamina II',pages:40,topics:[
['Five strengths','Five numbers define a lamina: longitudinal tension Xₜ and compression X꜀, transverse tension Yₜ and compression Y꜀, and in-plane shear S. Enter the compressive strengths as positive values.',2],
['Maximum stress and strain','These criteria do not interact. Each local stress or strain is compared with its own allowable, and failure happens when any one is reached. The strain version includes Poisson coupling.',9],
['Tsai–Hill and modified Tsai–Hill','This is a quadratic criterion that mixes the local stress components. In these lectures, standard Tsai–Hill uses the tensile strengths. The modified form picks tensile or compressive strengths from the sign of each stress.',21],
['Tsai–Wu','This quadratic criterion adds linear terms, so it separates tension from compression. H₁₂ needs test data or an empirical assumption.',28],
['Hygrothermal strains','Temperature change and moisture cause free expansion. Mechanical strain is total strain minus thermal and moisture strain. If the ply cannot expand freely, stress develops.',35]]},
{title:'Micromechanics of a Lamina I',pages:49,topics:[
['Volume, mass and density','Without voids, $V_f + V_m = 1$ and $W_f + W_m = 1$. Convert with $W_f = \\rho_fV_f/\\rho_c$. Voids make the measured density lower than the theoretical density.',5],
['Strength of materials model','Assume perfect bonding and continuous parallel fibers. Then the axial strain is equal in both phases, which gives the rule of mixtures for E₁. An equal-stress assumption gives the inverse-mixture estimates for E₂ and G₁₂.',16],
['Load sharing','Under longitudinal load, the fibers carry the fraction $E_fV_f/E_1$ of the force. A large modulus contrast means the fibers carry most of it.',21],
['Fiber packing','The maximum fiber fraction depends on the packing arrangement. The transverse response depends on the local fiber geometry, so the simple inverse mixture is only approximate.',28],
['Halpin–Tsai and elasticity models','Halpin–Tsai adds a reinforcement factor ξ for geometry and loading. Elasticity models treat the representative volume element more rigorously. They also need more detail and more work.',39]]},
{title:'Micromechanics of a Lamina II',pages:19,topics:[
['Longitudinal tensile strength','Assume the fibers fail before the matrix. The stress at first fiber failure is $\\sigma_{f,ult}V_f + E_m\\varepsilon_{f,ult}(1-V_f)$. At low fiber fractions, compare it with what the matrix alone can carry.',3],
['Minimum and critical fractions','The minimum fraction is where fiber fracture and matrix-only capacity are equal. The critical fraction is where the fiber-fracture branch equals the strength of the unreinforced matrix.',5],
['Compression and failure modes','Longitudinal compression can cause microbuckling, kinking, shear and transverse tensile rupture. The tensile mixture model does not capture these.',10],
['Thermal expansion','Axial expansion is weighted by stiffness. Transverse expansion has an extra Poisson correction: $\\alpha_2 = (1+\\nu_f)\\alpha_fV_f + (1+\\nu_m)\\alpha_mV_m - \\alpha_1\\nu_{12}$.',13]]},
{title:'Macromechanical Analysis of Laminates',pages:50,topics:[
['Laminate code and beam behavior','List the plies from top to bottom. A subscript s means mirrored about the middle surface. Flexural stiffness depends mostly on which plies sit far from the midplane.',4],
['Classical Lamination Theory','Assume a thin, perfectly bonded laminate. Strain then varies linearly through the thickness: $\\varepsilon(z) = \\varepsilon^0 + z\\kappa$. Each ply has its own rotated stiffness $\\bar Q$.',15],
['The A, B and D matrices','A is extension, B is extension-bending coupling and D is bending. They are thickness integrals of $\\bar Q$, $z\\bar Q$ and $z^2\\bar Q$.',22],
['Symmetric, balanced and cross-ply','A symmetric laminate has B = 0. A balanced laminate has $A_{16} = A_{26} = 0$. A cross-ply laminate has only 0° and 90° plies, so it has no normal-shear coupling.',28],
['Hygrothermal response','Integrate the constrained free expansion of each ply to get the environmental force and moment resultants. Add them to the mechanical loads, then solve for $\\varepsilon^0$ and $\\kappa$.',37],
['Failure and limits of CLT','First-ply failure is not final failure. Progressive analysis updates the stiffness as damage grows. CLT cannot resolve interlaminar stresses near free edges, which is where delamination starts.',44]]}
];
const processes=[
['Hand lay-up','PMC',6,['Prepare mold and release layer','Place dry reinforcement and wet with resin','Roll out air; repeat layers','Cure the laminate'],'Tooling is cheap and large, complex parts are possible. It is labor intensive, quality depends on the operator, and only the mold side has a precise finish.'],
['Spray-up','PMC',8,['Chop continuous roving with a chopper gun','Spray fibers and resin together onto mold','Compact with rollers','Cure'],'Good for constant-thickness shells like boat hulls and shower units. The chopped fibers are random and the operator matters, so consistency suffers.'],
['Prepreg / autoclave','PMC',9,['Store partially cured prepreg cold','Lay up sheets at specified angles','Vacuum-bag the assembly','Cure with controlled heat and pressure'],'Low voids and controlled properties make it the aerospace choice. The cost is expensive equipment, limited shelf life and slow curing.'],
['Filament winding','PMC',13,['Impregnate continuous fibers','Wind under tension onto a mandrel','Build hoop/helical reinforcement','Cure and remove mandrel'],'Fiber orientation is controlled, so it suits hollow axisymmetric parts such as pipes, tanks and pressure vessels. You have to be able to remove the mandrel, which limits the geometry.'],
['Pultrusion','PMC',15,['Feed continuous fibers from creels','Wet out in resin bath or chamber','Pull through a heated shaping die','Continuously cut cured profile'],'Continuous process for long, constant-section rods, channels and beams. Reinforcement is mostly axial. Bends and tapers are hard.'],
['Resin transfer molding','PMC',17,['Place dry preform in a closed mold','Inject low-viscosity liquid resin','Seal and cure','Open mold and remove part'],'Handles complex shapes with consistent output and fewer volatile emissions. It needs two mold halves and careful control of resin flow.'],
['Diffusion bonding','MMC',20,['Place reinforcement between metal foils','Stack layers at required angles','Remove binder by heating','Hot press to consolidate'],'The lecture example is boron/aluminum foils at about 500 °C and 35 MPa.'],
['Hot pressing','CMC',21,['Pass fiber tow through matrix slurry','Wind and dry prepreg tapes','Stack and burn out binder','Consolidate at high temperature and pressure'],'The lecture gives temperatures above 1000 °C and a pressing pressure of 7 to 14 MPa.'],
['Low-pressure carbonization','CCC',22,['Impregnate graphite cloth with resin','Lay up and cure','Pyrolyze in an oxygen-free atmosphere','Repeat impregnation and pyrolysis'],'Each cycle cuts shrinkage porosity and raises density. It is slow and expensive.']
];
const presets={graphite:{E1:181,E2:10.3,nu:.28,G:7.17,Xt:1500,Xc:1500,Yt:40,Yc:246,S:68,a1:.02,a2:22.5,b1:0,b2:.6,v:.7},glass:{E1:38.6,E2:8.27,nu:.26,G:4.14,Xt:1062,Xc:610,Yt:31,Yc:118,S:72,a1:8.6,a2:22.1,b1:0,b2:.6,v:.45},boron:{E1:204,E2:18.5,nu:.23,G:5.59,Xt:1260,Xc:2500,Yt:61,Yc:202,S:67,a1:6.1,a2:30.3,b1:0,b2:.6,v:.5}};
const names={graphite:'Graphite / epoxy',glass:'Glass / epoxy',boron:'Boron / epoxy',custom:'Custom lamina'};
const microDefaults={Ef:85,Em:3.4,Gf:35.42,Gm:1.308,nuf:.2,num:.3,rhof:2500,rhom:1200,af:5,am:63,sf:1550,sm:72};
const microLabels={Ef:'Fiber E (GPa)',Em:'Matrix E (GPa)',Gf:'Fiber G (GPa)',Gm:'Matrix G (GPa)',nuf:'Fiber ν',num:'Matrix ν',rhof:'Fiber density (kg/m³)',rhom:'Matrix density (kg/m³)',af:'Fiber α (μstrain/°C)',am:'Matrix α (μstrain/°C)',sf:'Fiber tensile strength (MPa)',sm:'Matrix tensile strength (MPa)'};
