'use strict';
// LaTeX source for every equation box. Elements with data-eq="name" are filled from here.
const EQ={
micro:String.raw`\begin{aligned}
E_1&=E_fV_f+E_mV_m\\
E_2&=\left(\frac{V_f}{E_f}+\frac{V_m}{E_m}\right)^{-1}\\
\nu_{12}&=\nu_fV_f+\nu_mV_m\\
G_{12}&=\left(\frac{V_f}{G_f}+\frac{V_m}{G_m}\right)^{-1}\\
\rho&=\rho_fV_f+\rho_mV_m,\qquad W_f=\frac{\rho_fV_f}{\rho}\\
E_2^{\text{HT}}&=E_m\,\frac{1+\xi\eta V_f}{1-\eta V_f},\qquad \eta=\frac{E_f/E_m-1}{E_f/E_m+\xi}\\
\alpha_1&=\frac{\alpha_fE_fV_f+\alpha_mE_mV_m}{E_1}\\
\alpha_2&=(1+\nu_f)\alpha_fV_f+(1+\nu_m)\alpha_mV_m-\alpha_1\nu_{12}\\
V_{\text{void}}&=1-\frac{\rho_{\text{measured}}}{\rho_{\text{theoretical}}}
\end{aligned}`,
tensile:String.raw`\begin{aligned}
\sigma_{1,\text{first}}&=\sigma_{f,\text{ult}}V_f+E_m\varepsilon_{f,\text{ult}}(1-V_f)\\
V_{f,\min}&=\frac{\sigma_{m,\text{ult}}-E_m\varepsilon_{f,\text{ult}}}{\sigma_{f,\text{ult}}-E_m\varepsilon_{f,\text{ult}}+\sigma_{m,\text{ult}}}\\
V_{f,\text{crit}}&=\frac{\sigma_{m,\text{ult}}-E_m\varepsilon_{f,\text{ult}}}{\sigma_{f,\text{ult}}-E_m\varepsilon_{f,\text{ult}}}
\end{aligned}`,
lamina:String.raw`\begin{aligned}
m&=\cos\theta,\qquad n=\sin\theta\\
\sigma_1&=m^2\sigma_x+n^2\sigma_y+2mn\,\tau_{xy}\\
\sigma_2&=n^2\sigma_x+m^2\sigma_y-2mn\,\tau_{xy}\\
\tau_{12}&=-mn\,\sigma_x+mn\,\sigma_y+(m^2-n^2)\tau_{xy}\\
\varepsilon_1&=\frac{\sigma_1}{E_1}-\frac{\nu_{12}\sigma_2}{E_1}\\
\varepsilon_2&=-\frac{\nu_{12}\sigma_1}{E_1}+\frac{\sigma_2}{E_2},\qquad \gamma_{12}=\frac{\tau_{12}}{G_{12}}\\
Q_{11}&=\frac{E_1}{1-\nu_{12}\nu_{21}},\qquad Q_{22}=\frac{E_2}{1-\nu_{12}\nu_{21}}\\
Q_{12}&=\frac{\nu_{12}E_2}{1-\nu_{12}\nu_{21}},\qquad Q_{66}=G_{12}\\
\{\sigma\}_{xy}&=[\bar Q]\{\varepsilon\}_{xy},\qquad [\bar S]=[\bar Q]^{-1}
\end{aligned}`,
failure:String.raw`\begin{aligned}
\text{Max stress:}&\quad\max\!\left(\frac{|\sigma_1|}{X},\frac{|\sigma_2|}{Y},\frac{|\tau_{12}|}{S}\right)\\
\text{Max strain:}&\quad\max\!\left(\frac{|\varepsilon_1|}{X/E_1},\frac{|\varepsilon_2|}{Y/E_2},\frac{|\gamma_{12}|}{S/G_{12}}\right)\\
\text{Tsai-Hill:}&\quad\frac{\sigma_1^2}{X_t^2}-\frac{\sigma_1\sigma_2}{X_t^2}+\frac{\sigma_2^2}{Y_t^2}+\frac{\tau_{12}^2}{S^2}\\
\text{Tsai-Wu:}&\quad H_1\sigma_1+H_2\sigma_2+H_{11}\sigma_1^2+H_{22}\sigma_2^2+2H_{12}\sigma_1\sigma_2+H_{66}\tau_{12}^2\\
&\quad H_1=\frac1{X_t}-\frac1{X_c},\quad H_2=\frac1{Y_t}-\frac1{Y_c}\\
&\quad H_{11}=\frac1{X_tX_c},\quad H_{22}=\frac1{Y_tY_c},\quad H_{66}=\frac1{S^2}
\end{aligned}`,
clt:String.raw`\begin{aligned}
A_{ij}&=\sum_k\bar Q_{ij}\,(z_k-z_{k-1})\\
B_{ij}&=\frac12\sum_k\bar Q_{ij}\,(z_k^2-z_{k-1}^2)\\
D_{ij}&=\frac13\sum_k\bar Q_{ij}\,(z_k^3-z_{k-1}^3)\\
\begin{bmatrix}A&B\\B&D\end{bmatrix}\begin{Bmatrix}\varepsilon^0\\\kappa\end{Bmatrix}&=\begin{Bmatrix}N+N^T+N^C\\M+M^T+M^C\end{Bmatrix}\\
\varepsilon(z)&=\varepsilon^0+z\kappa\\
\sigma_k(z)&=\bar Q_k\left[\varepsilon^0+z\kappa-\bar\alpha_k\Delta T-\bar\beta_k\Delta C\right]
\end{aligned}`
};
