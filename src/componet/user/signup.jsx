import React, { useState, useEffect, useRef } from "react";
import supabase from "../../supabase";

/* ─────────────────────────────────────────────
   DESIGN TOKENS  (match TradeFlow login)
───────────────────────────────────────────── */
const C = {
  bg:         "#05080F",
  surface:    "#0B1120",
  surfaceAlt: "#0F1929",
  border:     "#1A2740",
  borderFocus:"#00E5A060",
  borderHover:"#2A3F60",
  accent:     "#00E5A0",
  accentDim:  "rgba(0,229,160,0.10)",
  accentGlow: "rgba(0,229,160,0.22)",
  text:       "#E4EDF8",
  textMid:    "#6B87A8",
  textDim:    "#3D567A",
  red:        "#FF4D6A",
  green:      "#00E5A0",
  blue:       "#3B9EFF",
};

/* ─────────────────────────────────────────────
   COUNTRIES (full list with dial codes)
───────────────────────────────────────────── */
const COUNTRIES = [
  { code:"AF", name:"Afghanistan", dial:"+93", currency:"AFN" },
  { code:"AL", name:"Albania", dial:"+355", currency:"ALL" },
  { code:"DZ", name:"Algeria", dial:"+213", currency:"DZD" },
  { code:"AD", name:"Andorra", dial:"+376", currency:"EUR" },
  { code:"AO", name:"Angola", dial:"+244", currency:"AOA" },
  { code:"AG", name:"Antigua and Barbuda", dial:"+1-268", currency:"XCD" },
  { code:"AR", name:"Argentina", dial:"+54", currency:"ARS" },
  { code:"AM", name:"Armenia", dial:"+374", currency:"AMD" },
  { code:"AU", name:"Australia", dial:"+61", currency:"AUD" },
  { code:"AT", name:"Austria", dial:"+43", currency:"EUR" },
  { code:"AZ", name:"Azerbaijan", dial:"+994", currency:"AZN" },
  { code:"BS", name:"Bahamas", dial:"+1-242", currency:"BSD" },
  { code:"BH", name:"Bahrain", dial:"+973", currency:"BHD" },
  { code:"BD", name:"Bangladesh", dial:"+880", currency:"BDT" },
  { code:"BB", name:"Barbados", dial:"+1-246", currency:"BBD" },
  { code:"BY", name:"Belarus", dial:"+375", currency:"BYN" },
  { code:"BE", name:"Belgium", dial:"+32", currency:"EUR" },
  { code:"BZ", name:"Belize", dial:"+501", currency:"BZD" },
  { code:"BJ", name:"Benin", dial:"+229", currency:"XOF" },
  { code:"BT", name:"Bhutan", dial:"+975", currency:"BTN" },
  { code:"BO", name:"Bolivia", dial:"+591", currency:"BOB" },
  { code:"BA", name:"Bosnia and Herzegovina", dial:"+387", currency:"BAM" },
  { code:"BW", name:"Botswana", dial:"+267", currency:"BWP" },
  { code:"BR", name:"Brazil", dial:"+55", currency:"BRL" },
  { code:"BN", name:"Brunei", dial:"+673", currency:"BND" },
  { code:"BG", name:"Bulgaria", dial:"+359", currency:"BGN" },
  { code:"BF", name:"Burkina Faso", dial:"+226", currency:"XOF" },
  { code:"BI", name:"Burundi", dial:"+257", currency:"BIF" },
  { code:"CV", name:"Cabo Verde", dial:"+238", currency:"CVE" },
  { code:"KH", name:"Cambodia", dial:"+855", currency:"KHR" },
  { code:"CM", name:"Cameroon", dial:"+237", currency:"XAF" },
  { code:"CA", name:"Canada", dial:"+1", currency:"CAD" },
  { code:"CF", name:"Central African Republic", dial:"+236", currency:"XAF" },
  { code:"TD", name:"Chad", dial:"+235", currency:"XAF" },
  { code:"CL", name:"Chile", dial:"+56", currency:"CLP" },
  { code:"CN", name:"China", dial:"+86", currency:"CNY" },
  { code:"CO", name:"Colombia", dial:"+57", currency:"COP" },
  { code:"KM", name:"Comoros", dial:"+269", currency:"KMF" },
  { code:"CG", name:"Congo", dial:"+242", currency:"XAF" },
  { code:"CD", name:"Congo (DRC)", dial:"+243", currency:"CDF" },
  { code:"CR", name:"Costa Rica", dial:"+506", currency:"CRC" },
  { code:"CI", name:"Cote d'Ivoire", dial:"+225", currency:"XOF" },
  { code:"HR", name:"Croatia", dial:"+385", currency:"EUR" },
  { code:"CU", name:"Cuba", dial:"+53", currency:"CUP" },
  { code:"CY", name:"Cyprus", dial:"+357", currency:"EUR" },
  { code:"CZ", name:"Czech Republic", dial:"+420", currency:"CZK" },
  { code:"DK", name:"Denmark", dial:"+45", currency:"DKK" },
  { code:"DJ", name:"Djibouti", dial:"+253", currency:"DJF" },
  { code:"DM", name:"Dominica", dial:"+1-767", currency:"XCD" },
  { code:"DO", name:"Dominican Republic", dial:"+1-809", currency:"DOP" },
  { code:"EC", name:"Ecuador", dial:"+593", currency:"USD" },
  { code:"EG", name:"Egypt", dial:"+20", currency:"EGP" },
  { code:"SV", name:"El Salvador", dial:"+503", currency:"USD" },
  { code:"GQ", name:"Equatorial Guinea", dial:"+240", currency:"XAF" },
  { code:"ER", name:"Eritrea", dial:"+291", currency:"ERN" },
  { code:"EE", name:"Estonia", dial:"+372", currency:"EUR" },
  { code:"SZ", name:"Eswatini", dial:"+268", currency:"SZL" },
  { code:"ET", name:"Ethiopia", dial:"+251", currency:"ETB" },
  { code:"FJ", name:"Fiji", dial:"+679", currency:"FJD" },
  { code:"FI", name:"Finland", dial:"+358", currency:"EUR" },
  { code:"FR", name:"France", dial:"+33", currency:"EUR" },
  { code:"GA", name:"Gabon", dial:"+241", currency:"XAF" },
  { code:"GM", name:"Gambia", dial:"+220", currency:"GMD" },
  { code:"GE", name:"Georgia", dial:"+995", currency:"GEL" },
  { code:"DE", name:"Germany", dial:"+49", currency:"EUR" },
  { code:"GH", name:"Ghana", dial:"+233", currency:"GHS" },
  { code:"GR", name:"Greece", dial:"+30", currency:"EUR" },
  { code:"GD", name:"Grenada", dial:"+1-473", currency:"XCD" },
  { code:"GT", name:"Guatemala", dial:"+502", currency:"GTQ" },
  { code:"GN", name:"Guinea", dial:"+224", currency:"GNF" },
  { code:"GW", name:"Guinea-Bissau", dial:"+245", currency:"XOF" },
  { code:"GY", name:"Guyana", dial:"+592", currency:"GYD" },
  { code:"HT", name:"Haiti", dial:"+509", currency:"HTG" },
  { code:"HN", name:"Honduras", dial:"+504", currency:"HNL" },
  { code:"HU", name:"Hungary", dial:"+36", currency:"HUF" },
  { code:"IS", name:"Iceland", dial:"+354", currency:"ISK" },
  { code:"IN", name:"India", dial:"+91", currency:"INR" },
  { code:"ID", name:"Indonesia", dial:"+62", currency:"IDR" },
  { code:"IR", name:"Iran", dial:"+98", currency:"IRR" },
  { code:"IQ", name:"Iraq", dial:"+964", currency:"IQD" },
  { code:"IE", name:"Ireland", dial:"+353", currency:"EUR" },
  { code:"IL", name:"Israel", dial:"+972", currency:"ILS" },
  { code:"IT", name:"Italy", dial:"+39", currency:"EUR" },
  { code:"JM", name:"Jamaica", dial:"+1-876", currency:"JMD" },
  { code:"JP", name:"Japan", dial:"+81", currency:"JPY" },
  { code:"JO", name:"Jordan", dial:"+962", currency:"JOD" },
  { code:"KZ", name:"Kazakhstan", dial:"+7", currency:"KZT" },
  { code:"KE", name:"Kenya", dial:"+254", currency:"KES" },
  { code:"KI", name:"Kiribati", dial:"+686", currency:"AUD" },
  { code:"KW", name:"Kuwait", dial:"+965", currency:"KWD" },
  { code:"KG", name:"Kyrgyzstan", dial:"+996", currency:"KGS" },
  { code:"LA", name:"Laos", dial:"+856", currency:"LAK" },
  { code:"LV", name:"Latvia", dial:"+371", currency:"EUR" },
  { code:"LB", name:"Lebanon", dial:"+961", currency:"LBP" },
  { code:"LS", name:"Lesotho", dial:"+266", currency:"LSL" },
  { code:"LR", name:"Liberia", dial:"+231", currency:"LRD" },
  { code:"LY", name:"Libya", dial:"+218", currency:"LYD" },
  { code:"LI", name:"Liechtenstein", dial:"+423", currency:"CHF" },
  { code:"LT", name:"Lithuania", dial:"+370", currency:"EUR" },
  { code:"LU", name:"Luxembourg", dial:"+352", currency:"EUR" },
  { code:"MG", name:"Madagascar", dial:"+261", currency:"MGA" },
  { code:"MW", name:"Malawi", dial:"+265", currency:"MWK" },
  { code:"MY", name:"Malaysia", dial:"+60", currency:"MYR" },
  { code:"MV", name:"Maldives", dial:"+960", currency:"MVR" },
  { code:"ML", name:"Mali", dial:"+223", currency:"XOF" },
  { code:"MT", name:"Malta", dial:"+356", currency:"EUR" },
  { code:"MH", name:"Marshall Islands", dial:"+692", currency:"USD" },
  { code:"MR", name:"Mauritania", dial:"+222", currency:"MRU" },
  { code:"MU", name:"Mauritius", dial:"+230", currency:"MUR" },
  { code:"MX", name:"Mexico", dial:"+52", currency:"MXN" },
  { code:"FM", name:"Micronesia", dial:"+691", currency:"USD" },
  { code:"MD", name:"Moldova", dial:"+373", currency:"MDL" },
  { code:"MC", name:"Monaco", dial:"+377", currency:"EUR" },
  { code:"MN", name:"Mongolia", dial:"+976", currency:"MNT" },
  { code:"ME", name:"Montenegro", dial:"+382", currency:"EUR" },
  { code:"MA", name:"Morocco", dial:"+212", currency:"MAD" },
  { code:"MZ", name:"Mozambique", dial:"+258", currency:"MZN" },
  { code:"MM", name:"Myanmar", dial:"+95", currency:"MMK" },
  { code:"NA", name:"Namibia", dial:"+264", currency:"NAD" },
  { code:"NR", name:"Nauru", dial:"+674", currency:"AUD" },
  { code:"NP", name:"Nepal", dial:"+977", currency:"NPR" },
  { code:"NL", name:"Netherlands", dial:"+31", currency:"EUR" },
  { code:"NZ", name:"New Zealand", dial:"+64", currency:"NZD" },
  { code:"NI", name:"Nicaragua", dial:"+505", currency:"NIO" },
  { code:"NE", name:"Niger", dial:"+227", currency:"XOF" },
  { code:"NG", name:"Nigeria", dial:"+234", currency:"NGN" },
  { code:"MK", name:"North Macedonia", dial:"+389", currency:"MKD" },
  { code:"NO", name:"Norway", dial:"+47", currency:"NOK" },
  { code:"OM", name:"Oman", dial:"+968", currency:"OMR" },
  { code:"PK", name:"Pakistan", dial:"+92", currency:"PKR" },
  { code:"PW", name:"Palau", dial:"+680", currency:"USD" },
  { code:"PA", name:"Panama", dial:"+507", currency:"PAB" },
  { code:"PG", name:"Papua New Guinea", dial:"+675", currency:"PGK" },
  { code:"PY", name:"Paraguay", dial:"+595", currency:"PYG" },
  { code:"PE", name:"Peru", dial:"+51", currency:"PEN" },
  { code:"PH", name:"Philippines", dial:"+63", currency:"PHP" },
  { code:"PL", name:"Poland", dial:"+48", currency:"PLN" },
  { code:"PT", name:"Portugal", dial:"+351", currency:"EUR" },
  { code:"QA", name:"Qatar", dial:"+974", currency:"QAR" },
  { code:"RO", name:"Romania", dial:"+40", currency:"RON" },
  { code:"RU", name:"Russia", dial:"+7", currency:"RUB" },
  { code:"RW", name:"Rwanda", dial:"+250", currency:"RWF" },
  { code:"KN", name:"Saint Kitts and Nevis", dial:"+1-869", currency:"XCD" },
  { code:"LC", name:"Saint Lucia", dial:"+1-758", currency:"XCD" },
  { code:"VC", name:"Saint Vincent and the Grenadines", dial:"+1-784", currency:"XCD" },
  { code:"WS", name:"Samoa", dial:"+685", currency:"WST" },
  { code:"SM", name:"San Marino", dial:"+378", currency:"EUR" },
  { code:"ST", name:"Sao Tome and Principe", dial:"+239", currency:"STN" },
  { code:"SA", name:"Saudi Arabia", dial:"+966", currency:"SAR" },
  { code:"SN", name:"Senegal", dial:"+221", currency:"XOF" },
  { code:"RS", name:"Serbia", dial:"+381", currency:"RSD" },
  { code:"SC", name:"Seychelles", dial:"+248", currency:"SCR" },
  { code:"SL", name:"Sierra Leone", dial:"+232", currency:"SLL" },
  { code:"SG", name:"Singapore", dial:"+65", currency:"SGD" },
  { code:"SK", name:"Slovakia", dial:"+421", currency:"EUR" },
  { code:"SI", name:"Slovenia", dial:"+386", currency:"EUR" },
  { code:"SB", name:"Solomon Islands", dial:"+677", currency:"SBD" },
  { code:"SO", name:"Somalia", dial:"+252", currency:"SOS" },
  { code:"ZA", name:"South Africa", dial:"+27", currency:"ZAR" },
  { code:"SS", name:"South Sudan", dial:"+211", currency:"SSP" },
  { code:"ES", name:"Spain", dial:"+34", currency:"EUR" },
  { code:"LK", name:"Sri Lanka", dial:"+94", currency:"LKR" },
  { code:"SD", name:"Sudan", dial:"+249", currency:"SDG" },
  { code:"SR", name:"Suriname", dial:"+597", currency:"SRD" },
  { code:"SE", name:"Sweden", dial:"+46", currency:"SEK" },
  { code:"CH", name:"Switzerland", dial:"+41", currency:"CHF" },
  { code:"SY", name:"Syria", dial:"+963", currency:"SYP" },
  { code:"TW", name:"Taiwan", dial:"+886", currency:"TWD" },
  { code:"TJ", name:"Tajikistan", dial:"+992", currency:"TJS" },
  { code:"TZ", name:"Tanzania", dial:"+255", currency:"TZS" },
  { code:"TH", name:"Thailand", dial:"+66", currency:"THB" },
  { code:"TL", name:"Timor-Leste", dial:"+670", currency:"USD" },
  { code:"TG", name:"Togo", dial:"+228", currency:"XOF" },
  { code:"TO", name:"Tonga", dial:"+676", currency:"TOP" },
  { code:"TT", name:"Trinidad and Tobago", dial:"+1-868", currency:"TTD" },
  { code:"TN", name:"Tunisia", dial:"+216", currency:"TND" },
  { code:"TR", name:"Turkey", dial:"+90", currency:"TRY" },
  { code:"TM", name:"Turkmenistan", dial:"+993", currency:"TMT" },
  { code:"TV", name:"Tuvalu", dial:"+688", currency:"AUD" },
  { code:"UG", name:"Uganda", dial:"+256", currency:"UGX" },
  { code:"UA", name:"Ukraine", dial:"+380", currency:"UAH" },
  { code:"AE", name:"United Arab Emirates", dial:"+971", currency:"AED" },
  { code:"GB", name:"United Kingdom", dial:"+44", currency:"GBP" },
  { code:"US", name:"United States", dial:"+1", currency:"USD" },
  { code:"UY", name:"Uruguay", dial:"+598", currency:"UYU" },
  { code:"UZ", name:"Uzbekistan", dial:"+998", currency:"UZS" },
  { code:"VU", name:"Vanuatu", dial:"+678", currency:"VUV" },
  { code:"VE", name:"Venezuela", dial:"+58", currency:"VES" },
  { code:"VN", name:"Vietnam", dial:"+84", currency:"VND" },
  { code:"YE", name:"Yemen", dial:"+967", currency:"YER" },
  { code:"ZM", name:"Zambia", dial:"+260", currency:"ZMW" },
  { code:"ZW", name:"Zimbabwe", dial:"+263", currency:"ZWL" },
];

const CURRENCIES = [
  { code:"USD", name:"US Dollar", symbol:"$" },
  { code:"EUR", name:"Euro", symbol:"€" },
  { code:"GBP", name:"British Pound", symbol:"£" },
  { code:"JPY", name:"Japanese Yen", symbol:"¥" },
  { code:"CHF", name:"Swiss Franc", symbol:"Fr" },
  { code:"CAD", name:"Canadian Dollar", symbol:"C$" },
  { code:"AUD", name:"Australian Dollar", symbol:"A$" },
  { code:"NZD", name:"New Zealand Dollar", symbol:"NZ$" },
  { code:"CNY", name:"Chinese Yuan", symbol:"¥" },
  { code:"HKD", name:"Hong Kong Dollar", symbol:"HK$" },
  { code:"SGD", name:"Singapore Dollar", symbol:"S$" },
  { code:"SEK", name:"Swedish Krona", symbol:"kr" },
  { code:"NOK", name:"Norwegian Krone", symbol:"kr" },
  { code:"DKK", name:"Danish Krone", symbol:"kr" },
  { code:"INR", name:"Indian Rupee", symbol:"₹" },
  { code:"BRL", name:"Brazilian Real", symbol:"R$" },
  { code:"MXN", name:"Mexican Peso", symbol:"MX$" },
  { code:"ZAR", name:"South African Rand", symbol:"R" },
  { code:"NGN", name:"Nigerian Naira", symbol:"₦" },
  { code:"KES", name:"Kenyan Shilling", symbol:"KSh" },
  { code:"GHS", name:"Ghanaian Cedi", symbol:"₵" },
  { code:"EGP", name:"Egyptian Pound", symbol:"E£" },
  { code:"MAD", name:"Moroccan Dirham", symbol:"د.م." },
  { code:"AED", name:"UAE Dirham", symbol:"د.إ" },
  { code:"SAR", name:"Saudi Riyal", symbol:"ر.س" },
  { code:"QAR", name:"Qatari Riyal", symbol:"ر.ق" },
  { code:"KWD", name:"Kuwaiti Dinar", symbol:"د.ك" },
  { code:"TRY", name:"Turkish Lira", symbol:"₺" },
  { code:"RUB", name:"Russian Ruble", symbol:"₽" },
  { code:"PLN", name:"Polish Zloty", symbol:"zł" },
  { code:"CZK", name:"Czech Koruna", symbol:"Kč" },
  { code:"HUF", name:"Hungarian Forint", symbol:"Ft" },
  { code:"RON", name:"Romanian Leu", symbol:"lei" },
  { code:"ILS", name:"Israeli Shekel", symbol:"₪" },
  { code:"PHP", name:"Philippine Peso", symbol:"₱" },
  { code:"THB", name:"Thai Baht", symbol:"฿" },
  { code:"MYR", name:"Malaysian Ringgit", symbol:"RM" },
  { code:"IDR", name:"Indonesian Rupiah", symbol:"Rp" },
  { code:"KRW", name:"South Korean Won", symbol:"₩" },
  { code:"TWD", name:"Taiwan Dollar", symbol:"NT$" },
  { code:"PKR", name:"Pakistani Rupee", symbol:"₨" },
  { code:"BDT", name:"Bangladeshi Taka", symbol:"৳" },
  { code:"CLP", name:"Chilean Peso", symbol:"CLP$" },
  { code:"COP", name:"Colombian Peso", symbol:"COP$" },
  { code:"ARS", name:"Argentine Peso", symbol:"AR$" },
  { code:"PEN", name:"Peruvian Sol", symbol:"S/." },
  { code:"UAH", name:"Ukrainian Hryvnia", symbol:"₴" },
  { code:"VND", name:"Vietnamese Dong", symbol:"₫" },
];

/* ─────────────────────────────────────────────
   GLOBAL CSS
───────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; height: 100%; }
body {
  background: ${C.bg}; color: ${C.text};
  font-family: 'DM Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  min-height: 100%; overflow-x: hidden; overflow-y: auto;
}
a { text-decoration: none; color: inherit; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes gridFade { from { opacity: 0; } to { opacity: .3; } }
@keyframes pulse {
  0%,100% { opacity:1; transform:scale(1); }
  50%     { opacity:.5; transform:scale(.9); }
}
@keyframes spinDot { to { transform: rotate(360deg); } }
@keyframes successPop {
  0%   { transform: scale(.8); opacity:0; }
  60%  { transform: scale(1.08); }
  100% { transform: scale(1); opacity:1; }
}
@keyframes shake {
  0%,100% { transform: translateX(0); }
  20%     { transform: translateX(-6px); }
  40%     { transform: translateX(6px); }
  60%     { transform: translateX(-4px); }
  80%     { transform: translateX(4px); }
}

.auth-card-enter   { animation: fadeUp .65s cubic-bezier(.22,1,.36,1) .05s both; }
.auth-header-enter { animation: fadeUp .65s cubic-bezier(.22,1,.36,1) .15s both; }

.grid-bg {
  position: fixed; inset: 0; pointer-events: none; z-index: 0;
  background-image:
    linear-gradient(${C.border} 1px, transparent 1px),
    linear-gradient(90deg, ${C.border} 1px, transparent 1px);
  background-size: 56px 56px;
  animation: gridFade 1.2s ease-out both;
  mask-image: radial-gradient(ellipse 70% 70% at 50% 40%, black 0%, transparent 100%);
}

.tf-nav {
  height: 60px;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 clamp(16px, 4vw, 40px);
  background: rgba(5,8,15,.9); backdrop-filter: blur(14px);
  border-bottom: 1px solid ${C.border};
  position: sticky; top: 0; z-index: 100;
}

.tf-input {
  width: 100%; background: ${C.surfaceAlt};
  border: 1px solid ${C.border}; border-radius: 10px;
  padding: 13px 16px; font-size: 14px; color: ${C.text};
  font-family: 'DM Sans', sans-serif; outline: none;
  transition: border-color .2s, box-shadow .2s;
}
.tf-input:focus { border-color: ${C.accent}60; box-shadow: 0 0 0 3px ${C.accentDim}; }
.tf-input::placeholder { color: ${C.textDim}; }
.tf-input.error { border-color: ${C.red}70; box-shadow: 0 0 0 3px rgba(255,77,106,.08); }
.tf-input.success { border-color: ${C.accent}60; }

.tf-select {
  width: 100%; background: ${C.surfaceAlt};
  border: 1px solid ${C.border}; border-radius: 10px;
  padding: 13px 16px; font-size: 14px; color: ${C.text};
  font-family: 'DM Sans', sans-serif; outline: none;
  appearance: none; cursor: pointer;
  transition: border-color .2s, box-shadow .2s;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%233D567A' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 14px center; padding-right: 38px;
}
.tf-select:focus { border-color: ${C.accent}60; box-shadow: 0 0 0 3px ${C.accentDim}; }
.tf-select option { background: ${C.surface}; color: ${C.text}; }
.tf-select.error { border-color: ${C.red}70; box-shadow: 0 0 0 3px rgba(255,77,106,.08); }
.tf-select.success { border-color: ${C.accent}60; }

.pw-wrap { position: relative; }
.pw-wrap .tf-input { padding-right: 46px; }
.pw-toggle {
  position: absolute; right: 13px; top: 50%; transform: translateY(-50%);
  background: none; border: none; color: ${C.textDim}; cursor: pointer;
  font-size: 17px; padding: 4px; line-height: 1; transition: color .15s;
}
.pw-toggle:hover { color: ${C.textMid}; }

.tf-checkbox {
  appearance: none; -webkit-appearance: none;
  width: 16px; height: 16px; border-radius: 4px;
  border: 1px solid ${C.border}; background: ${C.surfaceAlt};
  cursor: pointer; flex-shrink: 0;
  transition: border-color .15s, background .15s; position: relative;
}
.tf-checkbox:checked { background: ${C.accent}; border-color: ${C.accent}; }
.tf-checkbox:checked::after {
  content: '\u2713'; position: absolute; top: 50%; left: 50%;
  transform: translate(-50%,-52%); font-size: 10px; color: #040A14; font-weight: 800;
}

.btn-primary {
  width: 100%; padding: 14px;
  background: ${C.accent}; color: #040A14;
  border: none; border-radius: 10px;
  font-size: 14px; font-weight: 700;
  font-family: 'DM Sans', sans-serif; cursor: pointer; letter-spacing: .01em;
  transition: transform .18s, box-shadow .18s, background .18s;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  position: relative; overflow: hidden;
}
.btn-primary::after {
  content:''; position:absolute; inset:0;
  background: linear-gradient(135deg,rgba(255,255,255,.16) 0%,transparent 60%);
  opacity:0; transition:opacity .2s;
}
.btn-primary:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 10px 36px ${C.accentGlow}; }
.btn-primary:hover::after { opacity:1; }
.btn-primary:disabled { opacity:.55; cursor:not-allowed; transform:none; }

.btn-social {
  width: 100%; padding: 11px 14px;
  background: ${C.surfaceAlt}; color: ${C.textMid};
  border: 1px solid ${C.border}; border-radius: 10px;
  font-size: 13px; font-weight: 600;
  font-family: 'DM Sans', sans-serif; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  transition: border-color .2s, color .2s, background .2s;
}
.btn-social:hover { border-color: ${C.borderHover}; color: ${C.text}; background: ${C.surface}; }

.divider-or { text-align: center; position: relative; color: ${C.textDim}; font-size: 12px; margin: 4px 0; }
.divider-or::before { content:''; position:absolute; top:50%; left:0; right:0; height:1px; background:${C.border}; }
.divider-or span { background:${C.surface}; padding:0 14px; position:relative; }

.step-dots { display:flex; align-items:center; gap:6px; justify-content:center; }
.step-dot { width:7px; height:7px; border-radius:50%; background:${C.border}; transition:background .25s, transform .25s; }
.step-dot.active { background:${C.accent}; transform:scale(1.3); }
.step-dot.done   { background:${C.accent}40; }

.field-error { font-size:12px; color:${C.red}; margin-top:5px; display:flex; align-items:center; gap:4px; }

.success-icon {
  width:64px; height:64px; border-radius:50%;
  background:${C.accentDim}; border:1px solid ${C.accent}40;
  display:flex; align-items:center; justify-content:center;
  font-size:28px; margin:0 auto 20px;
  animation: successPop .5s cubic-bezier(.22,1,.36,1) both;
}

.spinner {
  width:18px; height:18px; border-radius:50%;
  border:2px solid rgba(4,10,20,.3); border-top-color:#040A14;
  animation: spinDot .7s linear infinite; flex-shrink:0;
}

.strength-bar { display:flex; gap:4px; margin-top:8px; }
.strength-seg { flex:1; height:3px; border-radius:2px; background:${C.border}; transition:background .3s; }

.badge-live {
  display:inline-flex; align-items:center; gap:5px;
  background:rgba(0,229,160,.08); border:1px solid rgba(0,229,160,.2);
  border-radius:6px; padding:3px 8px;
  font-family:'DM Mono',monospace; font-size:10px; color:${C.accent};
}
.badge-live::before {
  content:''; width:5px; height:5px; border-radius:50%;
  background:${C.accent}; animation:pulse 1.5s ease-in-out infinite; flex-shrink:0;
}

.form-two-col { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
@media(max-width:420px) { .form-two-col { grid-template-columns:1fr; } }

.phone-row { display:grid; grid-template-columns:110px 1fr; gap:10px; }
@media(max-width:420px) { .phone-row { grid-template-columns:96px 1fr; } }

/* ── OTP inputs ── */
.otp-row { display: flex; gap: 8px; justify-content: center; }
.otp-box {
  width: 40px; height: 52px;
  background: ${C.surfaceAlt}; border: 1px solid ${C.border}; border-radius: 10px;
  font-size: 22px; font-weight: 700; color: ${C.text};
  font-family: 'DM Mono', monospace; text-align: center; outline: none;
  transition: border-color .2s, box-shadow .2s; caret-color: ${C.accent};
}
.otp-box:focus { border-color: ${C.accent}60; box-shadow: 0 0 0 3px ${C.accentDim}; }
.otp-box.filled { border-color: ${C.accent}40; }
.otp-box.error  { border-color: ${C.red}70; animation: shake .35s ease-in-out; }

.resend-btn {
  background: none; border: none; padding: 0;
  font-family: 'DM Sans', sans-serif; font-size: 13px; cursor: pointer; transition: color .15s;
}

::-webkit-scrollbar { width:5px; }
::-webkit-scrollbar-track { background:${C.bg}; }
::-webkit-scrollbar-thumb { background:${C.border}; border-radius:3px; }

@media (max-width: 767px) { .side-panel-desktop { display: none !important; } }
@media (max-width: 480px) { .auth-panel { padding: 20px 16px !important; } }
@media (max-width: 360px) { .auth-panel { padding: 16px 12px !important; } }
@media (min-width: 481px) and (max-width: 767px) { .auth-panel { padding: 28px 32px !important; } }
@media (min-width: 768px) and (max-width: 1024px) { .side-panel-desktop { max-width: 340px !important; } }
`;

/* ─────────────────────────────────────────────
   ICON HELPERS
───────────────────────────────────────────── */
const EyeIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeOffIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);
const AppleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={C.text}>
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);

/* ─────────────────────────────────────────────
   FIELD with label + error
───────────────────────────────────────────── */
const Field = ({ label, error, children }) => (
  <div style={{ marginBottom: "20px" }}>
    <div style={{ marginBottom:"7px" }}>
      <label style={{ fontSize:"13px", fontWeight:"600", color:C.textMid, letterSpacing:".01em" }}>{label}</label>
    </div>
    {children}
    {error && <div className="field-error">&#9888; {error}</div>}
  </div>
);

/* ─────────────────────────────────────────────
   PASSWORD STRENGTH
───────────────────────────────────────────── */
const getStrength = (pw) => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
};
const strengthColor = (score) => ["#3D567A","#FF4D6A","#F59E0B","#3B9EFF","#00E5A0"][score];
const strengthLabel = (score) => ["","Weak","Fair","Good","Strong"][score];

const StrengthBar = ({ password }) => {
  if (!password) return null;
  const score = getStrength(password);
  return (
    <div>
      <div className="strength-bar">
        {[1,2,3,4].map(i => (
          <div key={i} className="strength-seg" style={{ background: i <= score ? strengthColor(score) : C.border }}/>
        ))}
      </div>
      {score > 0 && (
        <div style={{ fontSize:"11px", color:strengthColor(score), marginTop:"5px", fontFamily:"'DM Mono',monospace", letterSpacing:".04em" }}>
          {strengthLabel(score)}
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   SIDE PANEL
───────────────────────────────────────────── */
const SidePanel = () => {
  const perks = [
    { icon:"📈", title:"Copy top traders",    desc:"Mirror verified strategies automatically." },
    { icon:"🤖", title:"AI-powered signals",  desc:"Real-time alerts based on live market data." },
    { icon:"🔒", title:"Bank-grade security", desc:"2FA, cold storage, and insured assets." },
  ];
  return (
    <div style={{
      position:"relative", flex:"1",
      background:`linear-gradient(160deg, ${C.surface} 0%, #080F20 100%)`,
      borderRight:`1px solid ${C.border}`,
      padding:"48px 36px",
      display:"flex", flexDirection:"column", justifyContent:"space-between",
      overflow:"hidden", minHeight:"calc(100vh - 60px)",
    }}>
      <div style={{position:"absolute", width:"380px", height:"380px", borderRadius:"50%", background:C.accentGlow, filter:"blur(90px)", top:"-100px", left:"-80px", pointerEvents:"none"}}/>
      <div style={{position:"absolute", width:"200px", height:"200px", borderRadius:"50%", background:"rgba(59,158,255,.12)", filter:"blur(60px)", bottom:"80px", right:"-40px", pointerEvents:"none"}}/>
      <div style={{position:"relative", zIndex:1}}>
        <a href="/" style={{fontFamily:"'Syne',sans-serif", fontSize:"22px", fontWeight:"800", color:C.text, letterSpacing:"-0.5px", display:"inline-block", marginBottom:"40px"}}>
          Trade<span style={{color:C.accent}}>Flow</span>
        </a>
        <div style={{marginBottom:"12px"}}>
          <div className="badge-live" style={{marginBottom:"16px"}}>280,000+ traders</div>
          <h2 style={{fontFamily:"'Syne',sans-serif", fontSize:"clamp(22px,2.5vw,30px)", fontWeight:"800", letterSpacing:"-1px", color:C.text, lineHeight:"1.2", marginBottom:"12px"}}>
            Start trading<br/>smarter today.
          </h2>
          <p style={{fontSize:"14px", color:C.textMid, lineHeight:"1.7", maxWidth:"280px"}}>
            Create your free account in under 2 minutes and get access to the world's best copy trading platform.
          </p>
        </div>
      </div>
      <div style={{position:"relative", zIndex:1, display:"flex", flexDirection:"column", gap:"12px"}}>
        {perks.map((p,i) => (
          <div key={i} style={{
            background:"rgba(11,17,32,.7)", border:`1px solid ${C.border}`,
            borderRadius:"12px", padding:"16px 18px",
            display:"flex", gap:"14px", alignItems:"flex-start",
            backdropFilter:"blur(8px)",
            animation:`fadeUp .6s cubic-bezier(.22,1,.36,1) ${.4+i*.12}s both`,
          }}>
            <span style={{fontSize:"20px", flexShrink:0, marginTop:"1px"}}>{p.icon}</span>
            <div>
              <div style={{fontSize:"13px", fontWeight:"700", color:C.text, marginBottom:"3px"}}>{p.title}</div>
              <div style={{fontSize:"12px", color:C.textDim, lineHeight:"1.5"}}>{p.desc}</div>
            </div>
          </div>
        ))}
        <p style={{fontSize:"11px", color:C.textDim, textAlign:"center", marginTop:"6px"}}>
          Simulated data for illustration only
        </p>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   OTP INPUT COMPONENT
───────────────────────────────────────────── */
const OTPInput = ({ value, onChange, hasError }) => {
  const inputsRef = useRef([]);
  const digits = Array.from({length:8}, (_,i) => value[i] || "");

  const handleChange = (i, e) => {
    const raw = e.target.value.replace(/\D/g,"");
    if (!raw) return;
    if (raw.length > 1) {
      const pasted = raw.slice(0,8);
      onChange(pasted);
      inputsRef.current[Math.min(pasted.length, 7)]?.focus();
      return;
    }
    const next = [...digits]; next[i] = raw[0];
    onChange(next.join(""));
    if (i < 7) inputsRef.current[i+1]?.focus();
  };

  const handleKey = (i, e) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (digits[i]) {
        const next = [...digits]; next[i] = ""; onChange(next.join(""));
      } else if (i > 0) {
        const next = [...digits]; next[i-1] = ""; onChange(next.join(""));
        inputsRef.current[i-1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && i > 0) { inputsRef.current[i-1]?.focus(); }
    else if (e.key === "ArrowRight" && i < 7)   { inputsRef.current[i+1]?.focus(); }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g,"").slice(0,8);
    if (pasted) { onChange(pasted); inputsRef.current[Math.min(pasted.length,7)]?.focus(); }
  };

  return (
    <div className="otp-row">
      {[0,1,2,3,4,5,6,7].map(i => (
        <input
          key={i}
          ref={el => inputsRef.current[i] = el}
          className={`otp-box${hasError ? " error" : digits[i] ? " filled" : ""}`}
          type="text" inputMode="numeric" maxLength="6"
          value={digits[i]}
          onChange={e => handleChange(i, e)}
          onKeyDown={e => handleKey(i, e)}
          onPaste={handlePaste}
          autoComplete={i === 0 ? "one-time-code" : "off"}
        />
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────────
   STEP 1 — Account details
───────────────────────────────────────────── */
const StepAccount = ({ onNext }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName,  setLastName]  = useState("");
  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [show,      setShow]      = useState(false);
  const [errors,    setErrors]    = useState({});
  const [loading,   setLoading]   = useState(false);

  const validate = () => {
    const e = {};
    if (!firstName.trim())         e.firstName = "First name is required";
    if (!lastName.trim())          e.lastName  = "Last name is required";
    if (!email.includes("@"))      e.email     = "Enter a valid email address";
    if (getStrength(password) < 2) e.password  = "Password is too weak";
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({}); setLoading(true);

    try {
      // 1. Create the auth user — Supabase sends the OTP email automatically
      const { data: authData, error: authErr } = await supabase.auth.signUp({
        email:    email.toLowerCase().trim(),
        password,
        options:  { data: { first_name: firstName.trim(), last_name: lastName.trim() } },
      });
      if (authErr) throw authErr;

      // "Confirm email" ON → Supabase returns { user: null, session: null } on success.
      // The user IS created in auth.users and the OTP email IS sent — null is not an error.
      // Only a user object with empty identities means the email is already taken.
      if (authData?.user?.identities?.length === 0) {
        throw new Error("An account with this email already exists.");
      }

      // Write to users table only if we have an id (confirm email OFF scenario).
      // When confirm email is ON, do this after OTP verification instead.
      const userId = authData?.user?.id;
      if (userId) {
        const { error: dbErr } = await supabase.from("users").upsert({
          id:            userId,
          email:         email.toLowerCase().trim(),
          password_hash: "managed_by_supabase_auth",
          first_name:    firstName.trim(),
          last_name:     lastName.trim(),
          otp_verified:  false,
        }, { onConflict: "id" });
        if (dbErr) console.error("users upsert:", dbErr.message);
      }

      setLoading(false);
      onNext({ firstName, lastName, email });
    } catch (err) {
      setLoading(false);
      setErrors({ email: err.message || "Sign-up failed. Please try again." });
    }
  };

  return (
    <div>
      <div className="form-two-col">
        <Field label="First name" error={errors.firstName}>
          <input className={`tf-input${errors.firstName?" error":firstName.trim()?" success":""}`}
            type="text" placeholder="Alex" value={firstName}
            onChange={e=>{setFirstName(e.target.value);setErrors(p=>({...p,firstName:""}));}}
            autoComplete="given-name"/>
        </Field>
        <Field label="Last name" error={errors.lastName}>
          <input className={`tf-input${errors.lastName?" error":lastName.trim()?" success":""}`}
            type="text" placeholder="Kim" value={lastName}
            onChange={e=>{setLastName(e.target.value);setErrors(p=>({...p,lastName:""}));}}
            autoComplete="family-name"/>
        </Field>
      </div>
      <Field label="Email address" error={errors.email}>
        <input className={`tf-input${errors.email?" error":email.includes("@")?" success":""}`}
          type="email" placeholder="alex@email.com" value={email}
          onChange={e=>{setEmail(e.target.value);setErrors(p=>({...p,email:""}));}}
          onKeyDown={e=>e.key==="Enter"&&submit()} autoComplete="email"/>
      </Field>
      <Field label="Password" error={errors.password}>
        <div className="pw-wrap">
          <input className={`tf-input${errors.password?" error":""}`}
            type={show?"text":"password"} placeholder="Min. 8 characters" value={password}
            onChange={e=>{setPassword(e.target.value);setErrors(p=>({...p,password:""}));}}
            onKeyDown={e=>e.key==="Enter"&&submit()} autoComplete="new-password"/>
          <button type="button" className="pw-toggle" onClick={()=>setShow(s=>!s)}>
            {show?<EyeOffIcon/>:<EyeIcon/>}
          </button>
        </div>
        <StrengthBar password={password}/>
      </Field>
      <button className="btn-primary" onClick={submit} disabled={loading}>
        {loading?<><div className="spinner"/>Creating account…</>:<>Continue <span style={{fontSize:"16px"}}>&#8594;</span></>}
      </button>
      <div style={{margin:"22px 0"}}>
        <div className="divider-or"><span>or sign up with</span></div>
      </div>
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px"}}>
        <button className="btn-social"><GoogleIcon/> Google</button>
        <button className="btn-social"><AppleIcon/> Apple</button>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   STEP 2 — OTP Email Verification
───────────────────────────────────────────── */
const StepOTP = ({ email, onNext, onBack }) => {
  const [otp,      setOtp]      = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [resendCD, setResendCD] = useState(30);
  const [sent,     setSent]     = useState(false);

  useEffect(() => {
    if (resendCD <= 0) return;
    const t = setInterval(() => setResendCD(c => c-1), 1000);
    return () => clearInterval(t);
  }, [resendCD]);

  const resend = async () => {
    setResendCD(30); setOtp(""); setError("");
    try {
      await supabase.auth.resend({ type: "signup", email });
      setSent(true);
      setTimeout(() => setSent(false), 2000);
    } catch { /* silent — UI still resets the timer */ }
  };

  const submit = async () => {
    if (otp.length < 8) { setError("Enter the complete 8-digit code"); return; }
    setLoading(true);

    try {
      const { data: verifyData, error: verifyErr } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type:  "signup",
      });
      if (verifyErr) throw verifyErr;

      // After OTP verify the session is now active — upsert the users row.
      // This covers the "Confirm email ON" case where we had no userId at signup.
      const user = verifyData?.user;
      if (user) {
        const { error: dbErr } = await supabase.from("users").upsert({
          id:            user.id,
          email:         user.email,
          password_hash: "managed_by_supabase_auth",
          first_name:    user.user_metadata?.first_name ?? "",
          last_name:     user.user_metadata?.last_name  ?? "",
          otp_verified:  true,
        }, { onConflict: "id" });
        if (dbErr) console.error("users upsert after OTP:", dbErr.message);
      }

      setLoading(false);
      onNext();
    } catch (err) {
      setLoading(false);
      setError(err.message?.includes("expired")
        ? "Code expired. Please request a new one."
        : "Incorrect code. Please try again.");
    }
  };

  return (
    <div>
      <div style={{textAlign:"center", marginBottom:"28px"}}>
        <div style={{
          width:"58px", height:"58px", borderRadius:"14px",
          background:C.accentDim, border:`1px solid ${C.accent}30`,
          display:"flex", alignItems:"center", justifyContent:"center",
          margin:"0 auto 14px", fontSize:"26px",
        }}>&#9993;</div>
        <p style={{fontSize:"13px", color:C.textMid, lineHeight:"1.7"}}>
          We sent an 8-digit code to<br/>
          <span style={{color:C.text, fontWeight:"600"}}>{email}</span>
        </p>
        {sent && <p style={{fontSize:"12px", color:C.accent, marginTop:"6px", fontWeight:"600"}}>Code resent!</p>}
      </div>

      <div style={{marginBottom:"24px"}}>
        <div style={{marginBottom:"12px"}}>
          <label style={{fontSize:"13px", fontWeight:"600", color:C.textMid, display:"block", textAlign:"center", marginBottom:"14px"}}>Verification code</label>
          <OTPInput value={otp} onChange={v=>{setOtp(v);setError("");}} hasError={!!error}/>
        </div>
        {error && <div className="field-error" style={{justifyContent:"center", marginTop:"10px"}}>&#9888; {error}</div>}
      </div>

      <button className="btn-primary" onClick={submit} disabled={loading || otp.length < 8}>
        {loading?<><div className="spinner"/>Verifying…</>:<>Verify &amp; Continue <span style={{fontSize:"16px"}}>&#8594;</span></>}
      </button>

      <div style={{textAlign:"center", marginTop:"18px", fontSize:"13px", color:C.textDim}}>
        Didn't receive it?{" "}
        {resendCD > 0
          ? <span>Resend in <span style={{color:C.textMid, fontFamily:"'DM Mono',monospace"}}>{resendCD}s</span></span>
          : <button className="resend-btn" style={{color:C.accent, fontWeight:"600"}} onClick={resend}>Resend code</button>
        }
      </div>

      <button onClick={onBack} style={{
        width:"100%", marginTop:"16px", padding:"11px",
        background:"transparent", border:`1px solid ${C.border}`, borderRadius:"10px",
        color:C.textMid, fontSize:"13px", fontWeight:"600", fontFamily:"'DM Sans',sans-serif",
        cursor:"pointer", transition:"border-color .2s, color .2s",
      }}
        onMouseEnter={e=>{e.currentTarget.style.borderColor=C.borderHover;e.currentTarget.style.color=C.text;}}
        onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textMid;}}
      >&#8592; Back</button>

      <p style={{textAlign:"center", fontSize:"11px", color:C.textDim, marginTop:"18px", lineHeight:"1.6"}}>
        Check your spam folder if you don't see it in your inbox.
      </p>
    </div>
  );
};

/* ─────────────────────────────────────────────
   STEP 3 — Profile preferences
───────────────────────────────────────────── */
const StepProfile = ({ onNext, onBack }) => {
  const [countryCode, setCountryCode] = useState("");
  const [phone,       setPhone]       = useState("");
  const [currency,    setCurrency]    = useState("");
  const [goal,        setGoal]        = useState("");
  const [terms,       setTerms]       = useState(false);
  const [errors,      setErrors]      = useState({});
  const [loading,     setLoading]     = useState(false);

  const handleCountryChange = (val) => {
    setCountryCode(val);
    setErrors(p=>({...p,country:""}));
    if (val && !currency) {
      const c = COUNTRIES.find(c=>c.code===val);
      if (c) setCurrency(c.currency);
    }
  };

  const selectedCountry = COUNTRIES.find(c=>c.code===countryCode);

  const validate = () => {
    const e = {};
    if (!countryCode)  e.country  = "Please select your country";
    if (!phone.trim()) e.phone    = "Phone number is required";
    if (!currency)     e.currency = "Please select your currency";
    if (!goal)         e.goal     = "Please select your trading goal";
    if (!terms)        e.terms    = "You must accept the terms to continue";
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({}); setLoading(true);

    try {
      const { data: { user }, error: sessionErr } = await supabase.auth.getUser();
      if (sessionErr || !user) throw new Error("Session expired. Please sign in again.");

      const country = COUNTRIES.find(c => c.code === countryCode);

      const { error: dbErr } = await supabase.from("users").update({
        country_code:  countryCode,
        country_name:  country?.name ?? null,
        currency:      currency      || null,
        dial_code:     country?.dial ?? null,
        phone:         phone.trim()  || null,
        trading_goal:  goal          || null,
        updated_at:    new Date().toISOString(),
      }).eq("id", user.id);
      if (dbErr) throw dbErr;

      setLoading(false);
      onNext();
    } catch (err) {
      setLoading(false);
      setErrors({ country: err.message || "Could not save your profile. Please try again." });
    }
  };

  return (
    <div>
      {/* Country */}
      <Field label="Country" error={errors.country}>
        <select className={`tf-select${errors.country?" error":countryCode?" success":""}`}
          value={countryCode} onChange={e=>handleCountryChange(e.target.value)}>
          <option value="">Select your country…</option>
          {COUNTRIES.map(c=>(
            <option key={c.code} value={c.code}>{c.name}</option>
          ))}
        </select>
      </Field>

      {/* Phone */}
      <Field label="Phone number" error={errors.phone}>
        <div className="phone-row">
          <div style={{
            background:C.surfaceAlt, border:`1px solid ${C.border}`,
            borderRadius:"10px", padding:"13px 10px",
            fontSize:"13px", color:selectedCountry?C.textMid:C.textDim,
            fontFamily:"'DM Mono',monospace",
            display:"flex", alignItems:"center", whiteSpace:"nowrap",
          }}>
            {selectedCountry ? selectedCountry.dial : "+???"}
          </div>
          <input
            className={`tf-input${errors.phone?" error":phone.trim()?" success":""}`}
            type="tel" placeholder="800 000 0000"
            value={phone}
            onChange={e=>{setPhone(e.target.value);setErrors(p=>({...p,phone:""}));}}
            autoComplete="tel-national"
          />
        </div>
      </Field>

      {/* Currency */}
      <Field label="Preferred currency" error={errors.currency}>
        <select className={`tf-select${errors.currency?" error":currency?" success":""}`}
          value={currency} onChange={e=>{setCurrency(e.target.value);setErrors(p=>({...p,currency:""}));}}>
          <option value="">Select currency…</option>
          {CURRENCIES.map(c=>(
            <option key={c.code} value={c.code}>{c.symbol} {c.code} — {c.name}</option>
          ))}
        </select>
      </Field>

      {/* Goal */}
      <Field label="I want to" error={errors.goal}>
        <select className={`tf-select${errors.goal?" error":goal?" success":""}`}
          value={goal} onChange={e=>{setGoal(e.target.value);setErrors(p=>({...p,goal:""}));}}>
          <option value="">Select your goal…</option>
          <option value="copy">Copy successful traders</option>
          <option value="hire">Hire a professional trader</option>
          <option value="independent">Trade independently</option>
          <option value="all">All of the above</option>
        </select>
      </Field>

      {/* Terms */}
      <div style={{marginBottom:"24px"}}>
        <div style={{display:"flex", alignItems:"flex-start", gap:"10px"}}>
          <input type="checkbox" className="tf-checkbox" id="terms"
            checked={terms} onChange={e=>{setTerms(e.target.checked);setErrors(p=>({...p,terms:""}));}}
            style={{marginTop:"2px"}}/>
          <label htmlFor="terms" style={{fontSize:"13px", color:C.textMid, cursor:"pointer", lineHeight:"1.6", userSelect:"none"}}>
            I agree to the{" "}
            <a href="/terms" style={{color:C.accent, fontWeight:"600"}}>Terms of Service</a>
            {" "}and{" "}
            <a href="/privacy" style={{color:C.accent, fontWeight:"600"}}>Privacy Policy</a>.
            {" "}I confirm I am 18+ years of age.
          </label>
        </div>
        {errors.terms && <div className="field-error" style={{marginTop:"8px"}}>&#9888; {errors.terms}</div>}
      </div>

      <button className="btn-primary" onClick={submit} disabled={loading}>
        {loading?<><div className="spinner"/>Setting up…</>:<>Create Account <span style={{fontSize:"16px"}}>&#8594;</span></>}
      </button>

      <button onClick={onBack} style={{
        width:"100%", marginTop:"12px", padding:"11px",
        background:"transparent", border:`1px solid ${C.border}`, borderRadius:"10px",
        color:C.textMid, fontSize:"13px", fontWeight:"600", fontFamily:"'DM Sans',sans-serif",
        cursor:"pointer", transition:"border-color .2s, color .2s",
      }}
        onMouseEnter={e=>{e.currentTarget.style.borderColor=C.borderHover;e.currentTarget.style.color=C.text;}}
        onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textMid;}}
      >&#8592; Back</button>
    </div>
  );
};

/* ─────────────────────────────────────────────
   STEP 4 — Success
───────────────────────────────────────────── */
const StepSuccess = ({ name }) => {
  useEffect(() => {
    const t = setTimeout(() => { window.location.href = "/dashboard"; }, 2500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{textAlign:"center", padding:"12px 0 8px"}}>
      <div className="success-icon">&#10003;</div>
      <h3 style={{fontFamily:"'Syne',sans-serif", fontSize:"20px", fontWeight:"800", color:C.text, marginBottom:"8px"}}>
        Welcome, {name}!
      </h3>
      <p style={{fontSize:"14px", color:C.textMid, lineHeight:"1.65", marginBottom:"24px"}}>
        Your account is ready. Redirecting you to your dashboard…
      </p>
      <div style={{display:"flex", justifyContent:"center"}}>
        <div style={{
          width:"36px", height:"36px", borderRadius:"50%",
          border:`2px solid ${C.border}`, borderTopColor:C.accent,
          animation:"spinDot .8s linear infinite",
        }}/>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   MAIN SIGNUP PAGE
───────────────────────────────────────────── */
const SignUp = () => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({});

  const totalSteps = 3;

  const goStep2 = (info) => { setData(info); setStep(2); };
  const goStep3 = ()     => { setStep(3); };
  const goSuccess = ()   => { setStep(4); };
  const goBack    = ()   => { setStep(s => s - 1); };

  const stepLabel = { 1:"Your details", 2:"Verify email", 3:"Preferences", 4:"All set" };

  return (
    <>
      <style>{CSS}</style>

      <nav className="tf-nav">
        <a href="/" style={{fontFamily:"'Syne',sans-serif", fontSize:"19px", fontWeight:"800", color:C.text, letterSpacing:"-0.5px"}}>
          Trade<span style={{color:C.accent}}>Flow</span>
        </a>
        <div style={{display:"flex", alignItems:"center", gap:"12px"}}>
          <span style={{fontSize:"13px", color:C.textDim}}>Already a member?</span>
          <a href="/login" style={{
            fontSize:"12px", padding:"8px 16px", borderRadius:"8px",
            background:C.accentDim, border:`1px solid ${C.accent}40`,
            color:C.accent, fontWeight:"700", letterSpacing:".01em",
            transition:"background .2s, color .2s",
          }}>Log in &#8594;</a>
        </div>
      </nav>

      <div className="grid-bg"/>

      <div style={{
        minHeight:"calc(100vh - 60px)", display:"flex",
        position:"relative", zIndex:1, alignItems:"stretch",
      }}>
        <div className="side-panel-desktop" style={{display:"none", flex:"1", maxWidth:"480px"}}>
          <SidePanel/>
        </div>
        <style>{`@media(min-width:768px){ .side-panel-desktop{ display:flex !important; } }`}</style>

        <div style={{
          flex:"1", display:"flex", alignItems:"flex-start", justifyContent:"center",
          padding:"clamp(32px,6vw,64px) clamp(16px,5vw,48px)",
        }}>
          <div style={{width:"100%", maxWidth:"400px"}}>

            <div className="auth-header-enter" style={{marginBottom:"32px"}}>
              {step < 4 && (
                <div style={{marginBottom:"20px"}}>
                  <div className="step-dots">
                    {Array.from({length:totalSteps},(_,i)=>(
                      <div key={i} className={`step-dot ${i+1===step?"active":i+1<step?"done":""}`}/>
                    ))}
                  </div>
                  <div style={{textAlign:"center", fontSize:"11px", color:C.textDim, marginTop:"8px", fontFamily:"'DM Mono',monospace", letterSpacing:".06em", textTransform:"uppercase"}}>
                    Step {step} of {totalSteps} — {stepLabel[step]}
                  </div>
                </div>
              )}
              <h1 style={{fontFamily:"'Syne',sans-serif", fontSize:"clamp(24px,3vw,30px)", fontWeight:"800", letterSpacing:"-1px", color:C.text, marginBottom:"6px", textAlign:"center"}}>
                {step===1?"Create your account":step===2?"Check your email":step===3?"Almost there":"You're in!"}
              </h1>
              <p style={{fontSize:"14px", color:C.textMid, textAlign:"center", lineHeight:"1.6"}}>
                {step===1?"Join 280,000+ traders worldwide":
                 step===2?"Enter the code we sent to verify your email":
                 step===3?"A few more details to personalize your experience":""}
              </p>
            </div>

            <div className="auth-card-enter" style={{
              background:C.surface, border:`1px solid ${C.border}`,
              borderRadius:"18px", padding:"clamp(20px,4vw,32px)",
              boxShadow:`0 32px 64px rgba(0,0,0,.45), 0 0 0 1px ${C.border}`,
            }}>
              {step===1 && <StepAccount onNext={goStep2}/>}
              {step===2 && <StepOTP email={data.email} onNext={goStep3} onBack={goBack}/>}
              {step===3 && <StepProfile onNext={goSuccess} onBack={goBack}/>}
              {step===4 && <StepSuccess name={data.firstName || "Trader"}/>}
            </div>

            {step < 4 && (
              <div style={{textAlign:"center", marginTop:"24px", fontSize:"13px", color:C.textDim}}>
                Already have an account?{" "}
                <a href="/login" style={{color:C.accent, fontWeight:"600"}}>Sign in &#8594;</a>
              </div>
            )}

            <p style={{textAlign:"center", fontSize:"11px", color:C.textDim, marginTop:"20px", lineHeight:"1.6"}}>
              By creating an account you agree to our{" "}
              <a href="/terms" style={{color:C.textDim, textDecoration:"underline"}}>Terms</a>
              {" "}and{" "}
              <a href="/privacy" style={{color:C.textDim, textDecoration:"underline"}}>Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;