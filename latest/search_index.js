var documenterSearchIndex = {"docs": [

{
    "location": "index.html#",
    "page": "Introduction",
    "title": "Introduction",
    "category": "page",
    "text": ""
},

{
    "location": "index.html#Mortar2D.jl-documentation-1",
    "page": "Introduction",
    "title": "Mortar2D.jl documentation",
    "category": "section",
    "text": "(Image: Typical 2d segmentation)Pages = [\"index.md\", \"theory.md\", \"api.md\"]Mortar2D.jl is a julia package to calculate discrete projections between non-conforming finite element mesheds. The resulting \"mortar matrices\" can be used to tie non-conforming finite element meshes together which are meshed separately to construct bigger models.Using mortar methods in mesh tie problems results variationally consistent solution. Mathematically, goal is to solve mixed problem with primary field variable and Lagrange multipliers, which have a physical meaning (e.g. contact pressure if unknown field is displacement). The problem arising is a typical saddle point problem with zeros on diagonal.Mortar2D.jl is part of JuliaFEM. All codes are MIT licensed."
},

{
    "location": "index.html#Installing-and-testing-package-1",
    "page": "Introduction",
    "title": "Installing and testing package",
    "category": "section",
    "text": "Installing package goes same way like other packages in julia, i.e.julia> Pkg.add(\"Mortar2D\")Testing package can be done using Pkg.test, i.e.julia> Pkg.test(\"Mortar2D\")"
},

{
    "location": "index.html#Contributing-1",
    "page": "Introduction",
    "title": "Contributing",
    "category": "section",
    "text": "Have a new great idea and want to share it with the open source community? From here and here you can look for coding style. Here is explained how to contribute to open source project, in general."
},

{
    "location": "theory.html#",
    "page": "Theory",
    "title": "Theory",
    "category": "page",
    "text": ""
},

{
    "location": "theory.html#Theory-1",
    "page": "Theory",
    "title": "Theory",
    "category": "section",
    "text": "Let us consider the simple following simple Laplace problem in the domain Omega=left left(xyright)inmathbbR^20leq xyleq2right.(Image: )The strong form of the problem is beginalign\n-Delta u^left(iright)  =0qquadtextin Omega^left(iright)i=12\nu^left(1right)  =0qquadtexton Gamma_mathrmD^left(1right)\nu^left(1right)-u^left(2right)  =0qquadtexton Gamma_mathrmC\nfracpartial u^left(2right)partial n  =gqquadtexton Gamma_mathrmN^left(2right)\nendalignCorresponding weak form of the problem is to find u^left(iright)inmathcalU and lambdainmathcalM such thatbeginalign\nint_Omeganabla ucdotnabla vmathrmdx+int_Gamma_mathrmClambdaleft(v^left(1right)-v^left(2right)right)mathrmds  =int_Omegafvmathrmdx+int_Gamma_mathrmNgvmathrmds    forall v^left(iright)inmathcalV^left(iright)\nint_Gamma_mathrmCmuleft(u^left(1right)-u^left(2right)right)mathrmds  =0    forallmuinmathcalM\nendalignIn more general form is to find u^left(iright)inmathcalU and lambdainmathcalM such thatbeginalign\naleft(u^left(iright)v^left(iright)right)+bleft(lambdav^left(iright)right)  =0qquadforall v^left(iright)inmathcalV^left(iright)\nbleft(muu^left(iright)right)  =0qquadforallmuinmathcalM\nendalignwherebeginalign\nbleft(lambdav^left(iright)right)  =int_Gamma_mathrmClambdaleft(v^left(1right)-v^left(2right)right)mathrmds\nbleft(muu^left(iright)right)  =int_Gamma_mathrmCmuleft(u^left(1right)-u^left(2right)right)mathrmds\nendalignAfter substituting interpolation polynomials to weak form we get so called mortar matrices boldsymbolD and boldsymbolM:beginalign\nboldsymbolDleftjkright  =int_Gamma_mathrmc^left(1right)N_jN_k^left(1right)mathrmds\nboldsymbolMleftjlright  =int_Gamma_mathrmc^left(1right)N_jleft(N_l^left(2right)circchiright)mathrmds\nendalignwhere chi is mapping between contacting surfaces. Let us define some contact pair:coords = Dict(1 => [8.0, 10.0],\n              2 => [7.0, 7.0],\n              3 => [4.0, 3.0],\n              4 => [0.0, 0.0],\n              5 => [-3.0, 0.0],\n              6 => [12.0, 10.0],\n              7 => [10.0, 4.0],\n              8 => [7.0, 2.0],\n              9 => [4.0, -2.0],\n              10 => [0.0, -3.0],\n              11 => [-4.0, -3.0])\n\nelements = Dict(\n    1 => [1, 2],\n    2 => [2, 3],\n    3 => [3, 4],\n    4 => [4, 5],\n    5 => [6, 7],\n    6 => [7, 8],\n    7 => [8, 9],\n    8 => [9, 10],\n    9 => [10, 11])\n\nslave_element_ids = [1, 2, 3, 4]\n\nslave_elements = Dict(i => elements[i] for i in slave_element_ids)\n\nmaster_element_ids = [5, 6, 7, 8, 9]\n\nelement_types = Dict(i => :Seg2 for i=1:length(elements))\n\nnothing # hide(Image: )For first order elements, normal direction is not unique. For that reason some preprocessing needs to be done to calculate unique nodal normals.Unique nodal normals can be calculated several different ways, more or less sophisticated. An easy solution is just to take average of the normals of adjacing elements connecting to node k, i.e.beginequation\nboldsymboln_k=fracsum_e=1^n_k^mathrmadjboldsymboln_k^left(eright)leftVert sum_e=1^n_k^mathrmadjboldsymboln_k^left(eright)rightVert \nendequationwhere boldsymboln_k^left(eright) means the normal calculated in element e in node k, and adj means adjacing elements.This is implemented in function calculate_normals:using Mortar2D: calculate_normals, project_from_master_to_slave, project_from_slave_to_master, calculate_segments, calculate_mortar_matrices, calculate_mortar_assemblynormals = calculate_normals(slave_elements, element_types, coords)(Image: )This package follows the idea of continuous normal field, proposed by Yang et al., where all the quantities are projected using only slave side normals. If we wish to find the projection of a slave node boldsymbolx_mathrms, having normal vector boldsymboln_mathrms onto a master element with nodes boldsymbolx_mathrmm1 and boldsymbolx_mathrmm2, we are solving xi^left(2right) from the equation beginequation\nleftN_1left(xi^left(2right)right)boldsymbolx_mathrmm1+N_2left(xi^left(2right)right)boldsymbolx_mathrmm2-boldsymbolx_mathrmsrighttimesboldsymboln_mathrms=boldsymbol0\nendequationThe equation to find the projection of a master node boldsymbolx_mathrmm onto a slave element with nodes boldsymbolx_mathrms1 and boldsymbolx_mathrms2 and normals boldsymboln_mathrms1 and boldsymboln_mathrms1 is beginequation\nleftN_1left(xi^left(1right)right)boldsymbolx_mathrms1+N_2left(xi^left(1right)right)boldsymbolx_mathrms2-boldsymbolx_mathrmmrighttimesleftN_1left(xi^left(1right)right)boldsymboln_s1+N_2left(xi^left(1right)right)boldsymboln_mathrms2right=boldsymbol0\nendequationwhere xi^left(1right) is the unknown parameter. First equation is linear and second is quadratic (in general). Second equation is also linear if boldsymboln_mathrms1=boldsymboln_mathrms2.These equations are solved in function project_from_master_to_slave and project_from_slave_to_master. They are used in function calculate_segments, which is used to calculate segmentation of interface.segmentation = calculate_segments(slave_element_ids, master_element_ids,\n                                  elements, element_types, coords, normals)(Image: )After segmentation is calculated, it\'s possible to integrate over non-conforming surface to calculate mortar matrices boldsymbolD and boldsymbolM or boldsymbolP=boldsymbolD^-1boldsymbolM.  Calculation projection matrix boldsymbolP is implemented as function calculate_mortar_assembly:s, m, D, M = calculate_mortar_assembly(elements, element_types, coords,\n                                       slave_element_ids, master_element_ids)This last command combines everything above to single command to calculate projection matrix needed for finite element codes."
},

{
    "location": "theory.html#References-1",
    "page": "Theory",
    "title": "References",
    "category": "section",
    "text": "Wikipedia contributors. \"Mortar methods.\" Wikipedia, The Free Encyclopedia. Wikipedia, The Free Encyclopedia.\nMaday, Yvon, Cathy Mavriplis, and Anthony Patera. \"Nonconforming mortar element methods: Application to spectral discretizations.\" (1988).\nYang, Bin, Tod A. Laursen, and Xiaonong Meng. \"Two dimensional mortar contact methods for large deformation frictional sliding.\" International journal for numerical methods in engineering 62.9 (2005): 1183-1225.\nYang, Bin, and Tod A. Laursen. \"A contact searching algorithm including bounding volume trees applied to finite sliding mortar formulations.\" Computational Mechanics 41.2 (2008): 189-205.\nWohlmuth, Barbara I. \"A mortar finite element method using dual spaces for the Lagrange multiplier.\" SIAM journal on numerical analysis 38.3 (2000): 989-1012."
},

{
    "location": "api.html#",
    "page": "API",
    "title": "API",
    "category": "page",
    "text": ""
},

{
    "location": "api.html#API-documentation-1",
    "page": "API",
    "title": "API documentation",
    "category": "section",
    "text": ""
},

{
    "location": "api.html#Mortar2D.calculate_normals",
    "page": "API",
    "title": "Mortar2D.calculate_normals",
    "category": "function",
    "text": "calculate_normals(elements::Dict{Int, Vector{Int}},\n                  element_types::Dict{Int, Symbol},\n                  X::Dict{Int, Vector{Float64})\n\nGiven elements, element types and node locations, calculate nodal normals by first calculating normal directions for each element and then averaging them in nodes. As a result we get unique normal direction defined to each node.\n\nNotes\n\nOnly linear elements supported.\n\nExample\n\nX = Dict(1 => [7.0, 7.0], 2 => [4.0, 3.0], 3 => [0.0, 0.0])\nelements = Dict(1 => [1, 2], 2 => [2, 3])\nelement_types = Dict(1 => :Seg2, 2 => :Seg2)\nnormals = calculate_normals(elements, element_types, X)\n\n# output\n\nDict{Int64,Array{Float64,1}} with 3 entries:\n  2 => [0.707107, -0.707107]\n  3 => [0.6, -0.8]\n  1 => [0.8, -0.6]\n\n\n\n\n"
},

{
    "location": "api.html#Mortar2D.project_from_master_to_slave",
    "page": "API",
    "title": "Mortar2D.project_from_master_to_slave",
    "category": "function",
    "text": "project_from_master_to_slave(Val{:Seg2}, xm, xs1, xs2, ns1, ns2)\n\nFind the projection of a master node xm, to the slave surface with nodes (xs1, xs2), in direction of slave surface normal defined by (ns1, ns2). Returns slave element dimensionless parameter, that is, to find coordinates in slave side:\n\nxs = 1/2*(1-xi)*xs1 + 1/2*(1+xi)*xs2\n\nExample\n\nxm = [4.0, -2.0]\nxs1 = [0.0, 0.0]\nxs2 = [4.0, 3.0]\nns1 = [3.0/5.0, -4.0/5.0]\nns2 = sqrt(2)/2*[1, -1]\nxi1 = project_from_master_to_slave(Val{:Seg2}, xm, xs1, xs2, ns1, ns2)\nround(xi1, 6)\n\n# output\n\n-0.281575\n\n\n\n"
},

{
    "location": "api.html#Mortar2D.project_from_slave_to_master",
    "page": "API",
    "title": "Mortar2D.project_from_slave_to_master",
    "category": "function",
    "text": "project_from_slave_to_master(Val{:Seg2}, xs, ns, xm1, xm2)\n\nFind the projection of a slave node xs, having normal vector ns, onto master elements with nodes (xm1, xm2). Returns master element dimensionless parameter xi, that is,\n\nxm = 1/2*(1-xi)*xm1 + 1/2*(1+xi)*xm2\n\nExample\n\nxm1 = [7.0, 2.0]\nxm2 = [4.0, -2.0]\nxs = [0.0, 0.0]\nns = [3.0/5.0, -4.0/5.0]\nxi2 = project_from_slave_to_master(Val{:Seg2}, xs, ns, xm1, xm2)\nround(xi2, 6)\n\n# output\n\n1.833333\n\n\n\n"
},

{
    "location": "api.html#Mortar2D.calculate_segments",
    "page": "API",
    "title": "Mortar2D.calculate_segments",
    "category": "function",
    "text": "calculate_segments(slave_element_ids::Vector{Int},\n                   master_element_ids::Vector{Int},\n                   elements::Dict{Int, Vector{Int}},\n                   element_types::Dict{Int, Symbol},\n                   coords::Dict{Int, Vector{Float64}},\n                   normals::Dict{Int, Vector{Float64}})\n\nGiven slave surface elements, master surface elements, nodal coordinates and normal direction on nodes of slave surface elements, calculate contact segments.\n\nReturn type is a dictionary, where key is slave element id and values is a list of master elements giving contribution to that slave elements and xi-coordinates of slave side element.\n\nExample\n\nelements = Dict(1 => [1, 2], 2 => [3, 4])\nelement_types = Dict(1 => :Seg2, 2 => :Seg2)\ncoords = Dict(\n    1 => [1.0, 2.0],\n    2 => [3.0, 2.0],\n    3 => [0.0, 2.0],\n    4 => [2.0, 2.0])\nnormals = Dict(\n    1 => [0.0, -1.0],\n    2 => [0.0, -1.0])\nslave_ids = [1]\nmaster_ids = [2]\nsegments = calculate_segments(slave_ids, master_ids, elements,\n                              element_types, coords, normals)\n\n# output\n\nDict{Int64,Array{Tuple{Int64,Array{Float64,1}},1}} with 1 entry:\n  1 => Tuple{Int64,Array{Float64,1}}[(2, [-1.0, -0.0])]\n\n\nHere, output result means that slave element #1 has segment with master element(s) #2 with dimensionless slave element coordinate xi = [-1, 0]. That is, the start and end point of projection in physical coordinate system is:\n\nx_start = 1/2*(1-xi[1])*xs1 + 1/2*(1+xi[1])*xs2\nx_stop = 1/2*(1-xi[2])*xs1 + 1/2*(1+xi[2])*xs2\n\n\n\n"
},

{
    "location": "api.html#Mortar2D.calculate_mortar_matrices",
    "page": "API",
    "title": "Mortar2D.calculate_mortar_matrices",
    "category": "function",
    "text": "calculate_mortar_matrices(slave_element_id::Int,\n                          elements::Dict{Int, Vector{Int}},\n                          element_types::Dict{Int, Symbol},\n                          coords::Dict{Int, Vector{Float64}},\n                          normals::Dict{Int, Vector{Float64}},\n                          segmentation:MortarSegmentation)\n\nCalculate mortar matrices De and Me for slave element.\n\nExample\n\nelements = Dict(\n    1 => [1, 2],\n    2 => [3, 4])\nelement_types = Dict(\n    1 => :Seg2,\n    2 => :Seg2)\ncoords = Dict(\n    1 => [1.0, 2.0],\n    2 => [3.0, 2.0],\n    3 => [2.0, 2.0],\n    4 => [0.0, 2.0])\nnormals = Dict(\n    1 => [0.0, -1.0],\n    2 => [0.0, -1.0])\nsegmentation = Dict(1 => [(2, [-1.0, 0.0])])\nDe, Me = calculate_mortar_matrices(1, elements, element_types,\n                                   coords, normals, segmentation)\n\n# output\n\n([0.583333 0.166667; 0.166667 0.0833333], Dict(2=>[0.541667 0.208333; 0.208333 0.0416667]))\n\n\n\n\n"
},

{
    "location": "api.html#Mortar2D.calculate_mortar_assembly",
    "page": "API",
    "title": "Mortar2D.calculate_mortar_assembly",
    "category": "function",
    "text": "calculate_mortar_assembly(elements::Dict{Int, Vector{Int}},\n                          element_types::Dict{Int, Symbol},\n                          coords::Dict{Int, Vector{Float64}},\n                          slave_element_ids::Vector{Int},\n                          master_element_ids::Vector{Int})\n\nGiven data, calculate projection matrices D and M. This is the main function of package. Relation between matrices is D u_s = M u_m, where u_s is slave nodes and u_m master nodes.\n\nExample\n\nCalculate mortar matrices for simple problem in README.md\n\nXs = Dict(1 => [0.0, 1.0], 2 => [5/4, 1.0], 3 => [2.0, 1.0])\nXm = Dict(4 => [0.0, 1.0], 5 => [1.0, 1.0], 6 => [2.0, 1.0])\ncoords = merge(Xm , Xs)\nEs = Dict(1 => [1, 2], 2 => [2, 3])\nEm = Dict(3 => [4, 5], 4 => [5, 6])\nelements = merge(Es, Em)\nelement_types = Dict(1 => :Seg2, 2 => :Seg2, 3 => :Seg2, 4 => :Seg2)\nslave_element_ids = [1, 2]\nmaster_element_ids = [3, 4]\ns, m, D, M = calculate_mortar_assembly(elements, element_types, coords,\n                                       slave_element_ids, master_element_ids)\n\n# output\n\n([1, 2, 3], [4, 5, 6],\n  [1, 1]  =  0.416667\n  [2, 1]  =  0.208333\n  [1, 2]  =  0.208333\n  [2, 2]  =  0.666667\n  [3, 2]  =  0.125\n  [2, 3]  =  0.125\n  [3, 3]  =  0.25,\n  [1, 4]  =  0.366667\n  [2, 4]  =  0.133333\n  [1, 5]  =  0.25625\n  [2, 5]  =  0.65\n  [3, 5]  =  0.09375\n  [1, 6]  =  0.00208333\n  [2, 6]  =  0.216667\n  [3, 6]  =  0.28125)\n\n\ns and m contains slave and master dofs:\n\njulia> s, m\n([1, 2, 3], [4, 5, 6])\n\nD is slave side mortar matrix:\n\njulia> full(D[s,s])\n3×3 Array{Float64,2}:\n 0.416667  0.208333  0.0\n 0.208333  0.666667  0.125\n 0.0       0.125     0.25\n\nM is master side mortar matrix:\n\njulia> full(M[s,m])\n3×3 Array{Float64,2}:\n 0.366667  0.25625  0.00208333\n 0.133333  0.65     0.216667\n 0.0       0.09375  0.28125\n\n\n\n"
},

{
    "location": "api.html#Index-1",
    "page": "API",
    "title": "Index",
    "category": "section",
    "text": "DocTestSetup = quote\n    using Mortar2D\n    using Mortar2D: calculate_normals, project_from_master_to_slave, project_from_slave_to_master, calculate_segments, calculate_mortar_matrices, calculate_mortar_assembly\nendMortar2D.calculate_normals\nMortar2D.project_from_master_to_slave\nMortar2D.project_from_slave_to_master\nMortar2D.calculate_segments\nMortar2D.calculate_mortar_matrices\nMortar2D.calculate_mortar_assembly"
},

]}
