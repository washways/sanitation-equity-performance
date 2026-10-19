const WB="https://api.worldbank.org/v2";
const N=1000;
const HH_SIZE=4.5;
const FECAL_WET_G_PER_PERSON_DAY=128; // Rose et al. 2015 global median wet faecal mass
const TARGETED_DELIVERY_OVERHEAD=0.10; // simplified scenario assumption for pro-poor targeting

// Economic scenario assumptions. JMP inequality data do not fit these values.
// The 5% midpoint is an editable scenario default; the soft transition avoids a binary cliff.
const AFFORDABILITY_DEFAULT_SHARE=0.05;
const AFFORDABILITY_SLOPE=2.0;
const JMP_BENCHMARK={"summary":{"n":380,"mae":23.3386,"rmse":30.6538,"pearsonR":0.6691,"scenarioBudgetShare":0.05,"slope":2.0,"reconstructedCountries":["BEN","CAF","COD","MDG","TCD","TGO"],"excludedCountries":["COM"],"role":"independent observed benchmark; not used to fit the economic model"},"countries":{"AFG":{"country":"Afghanistan","year":2017,"incomeYear":2017,"giniYear":null,"basicReconstructed":false,"basic":{"observed":[44.0097,34.3224,41.5166,31.6669,56.2205],"modelled":[22.8972,47.3956,65.3342,79.7317,92.0935]},"not_od":{"observed":[83.6584,85.1542,90.2338,73.0678,99.4556],"modelled":[72.9801,90.5808,95.3171,97.7064,99.2077]}},"AGO":{"country":"Angola","year":2016,"incomeYear":2016,"giniYear":2018,"basicReconstructed":false,"basic":{"observed":[14.8823,27.5131,45.9266,62.3757,87.0835],"modelled":[36.8853,73.3623,88.6217,95.6095,98.9434]},"not_od":{"observed":[28.3663,51.8316,85.4435,97.8431,99.9445],"modelled":[63.6573,90.6371,96.5191,98.7305,99.702]}},"BDI":{"country":"Burundi","year":2017,"incomeYear":2017,"giniYear":2020,"basicReconstructed":false,"basic":{"observed":[26.2012,36.0973,43.0738,52.4125,61.3918],"modelled":[5.8935,15.4287,27.3786,43.8782,70.3387]},"not_od":{"observed":[92.8475,97.8515,98.7697,99.5563,99.9582],"modelled":[82.5429,94.5542,97.3266,98.6915,99.5446]}},"BEN":{"country":"Benin","year":2018,"incomeYear":2018,"giniYear":2018,"basicReconstructed":true,"basic":{"observed":[0.8383,1.3274,5.4386,13.875,42.656],"modelled":[33.3739,60.7941,76.4487,87.1222,95.2163]},"not_od":{"observed":[15.0948,22.1615,32.6678,56.494,86.1612],"modelled":[69.5383,88.852,94.3894,97.2323,99.0384]}},"BFA":{"country":"Burkina Faso","year":2018,"incomeYear":2018,"giniYear":2018,"basicReconstructed":false,"basic":{"observed":[7.4591,18.5541,22.9462,26.0651,50.8174],"modelled":[15.1385,38.0672,58.7653,76.7482,91.8337]},"not_od":{"observed":[37.6941,49.2791,55.7507,64.3977,92.6812],"modelled":[40.4595,71.48,85.4416,93.1656,97.8791]}},"BGD":{"country":"Bangladesh","year":2019,"incomeYear":2019,"giniYear":2016,"basicReconstructed":false,"basic":{"observed":[47.9178,57.0063,66.249,69.0871,81.5522],"modelled":[96.8289,98.9939,99.4636,99.7118,99.8852]},"not_od":{"observed":[94.9073,98.0129,99.4576,99.9036,100.0],"modelled":[97.3807,99.1749,99.5604,99.764,99.906]}},"CAF":{"country":"Central African Republic","year":2019,"incomeYear":2019,"giniYear":2021,"basicReconstructed":true,"basic":{"observed":[2.2733,5.0095,6.7887,9.6562,28.2617],"modelled":[21.7901,49.3288,69.3498,83.9836,94.6818]},"not_od":{"observed":[44.8487,60.359,71.9722,88.098,97.9071],"modelled":[51.9774,80.6683,90.7489,95.7998,98.7207]}},"COD":{"country":"Democratic Republic of the Congo","year":2018,"incomeYear":2018,"giniYear":2020,"basicReconstructed":true,"basic":{"observed":[6.7913,8.3164,10.9736,12.5851,28.8281],"modelled":[1.661,5.6592,12.6334,26.0291,57.9251]},"not_od":{"observed":[75.6291,81.8837,90.674,95.7456,98.1142],"modelled":[20.4019,48.3862,69.3171,84.4457,95.0815]}},"ETH":{"country":"Ethiopia","year":2016,"incomeYear":2016,"giniYear":2015,"basicReconstructed":false,"basic":{"observed":[3.5046,3.0911,4.3535,4.762,18.179],"modelled":[0.3208,0.8625,1.6831,3.293,10.5161]},"not_od":{"observed":[45.1538,55.368,66.3897,75.983,92.7323],"modelled":[63.4401,84.2396,91.3757,95.4195,98.2573]}},"GIN":{"country":"Guinea","year":2018,"incomeYear":2018,"giniYear":2018,"basicReconstructed":false,"basic":{"observed":[7.3377,14.6991,25.2077,31.5078,57.3085],"modelled":[36.7718,58.618,71.4491,81.5151,91.189]},"not_od":{"observed":[67.938,78.4787,89.079,98.6827,100.0],"modelled":[83.7607,93.3429,96.1399,97.774,99.0324]}},"GMB":{"country":"Gambia","year":2020,"incomeYear":2020,"giniYear":2020,"basicReconstructed":false,"basic":{"observed":[20.6322,36.599,44.5848,66.9052,87.0856],"modelled":[35.8911,64.1787,79.2757,89.0404,96.0765]},"not_od":{"observed":[96.8926,99.437,99.7387,100.0,100.0],"modelled":[50.7407,77.5122,88.0793,94.0151,97.9281]}},"GNB":{"country":"Guinea-Bissau","year":2019,"incomeYear":2019,"giniYear":2018,"basicReconstructed":false,"basic":{"observed":[2.1055,2.2442,5.7422,13.7335,48.085],"modelled":[28.1053,52.2094,68.1698,80.7245,91.9007]},"not_od":{"observed":[71.9914,85.9592,91.9661,97.2391,99.9737],"modelled":[76.5668,91.3048,95.4059,97.6008,99.0943]}},"HTI":{"country":"Haiti","year":2017,"incomeYear":2017,"giniYear":2012,"basicReconstructed":false,"basic":{"observed":[9.7852,20.2176,28.9681,39.724,68.1434],"modelled":[44.259,73.6584,86.2803,93.3464,97.8271]},"not_od":{"observed":[43.0537,62.7765,75.9747,92.7205,98.8296],"modelled":[93.9489,98.6447,99.399,99.7303,99.9157]}},"KHM":{"country":"Cambodia","year":2014,"incomeYear":2014,"giniYear":null,"basicReconstructed":false,"basic":{"observed":[13.7073,25.4392,44.672,66.5815,90.5481],"modelled":[57.0338,81.5609,90.3231,95.1271,98.2884]},"not_od":{"observed":[19.5812,34.8485,55.9847,80.0032,97.5014],"modelled":[90.9711,97.5563,98.8333,99.4394,99.8085]}},"KIR":{"country":"Kiribati","year":2019,"incomeYear":2019,"giniYear":2019,"basicReconstructed":false,"basic":{"observed":[25.2861,37.5473,32.5132,52.5657,77.6324],"modelled":[98.0415,99.2558,99.5645,99.7436,99.8841]},"not_od":{"observed":[35.8547,55.2456,58.7776,83.0555,98.7406],"modelled":[99.6421,99.8662,99.9219,99.9541,99.9793]}},"LAO":{"country":"Lao People's Democratic Republic","year":2017,"incomeYear":2017,"giniYear":2018,"basicReconstructed":false,"basic":{"observed":[30.1434,56.6363,77.6582,92.6275,97.9827],"modelled":[80.2195,93.9287,97.0893,98.6113,99.5335]},"not_od":{"observed":[35.2047,63.4185,84.3523,97.4602,99.9215],"modelled":[87.4241,96.5258,98.3596,99.2229,99.74]}},"LBR":{"country":"Liberia","year":2020,"incomeYear":2020,"giniYear":2016,"basicReconstructed":false,"basic":{"observed":[2.4079,8.1196,17.4115,31.9436,59.3289],"modelled":[25.8921,49.6599,66.1357,79.4141,91.3829]},"not_od":{"observed":[29.7716,43.0934,69.9903,87.5792,95.5107],"modelled":[73.9437,90.1848,94.8343,97.3213,99.0009]}},"LSO":{"country":"Lesotho","year":2018,"incomeYear":2018,"giniYear":2017,"basicReconstructed":false,"basic":{"observed":[34.5192,51.962,53.0449,52.656,65.6165],"modelled":[17.5128,43.6907,65.2241,81.8997,94.1921]},"not_od":{"observed":[42.9362,73.3981,90.6587,96.9456,99.4486],"modelled":[44.9062,76.4454,88.817,95.0581,98.5652]}},"MDG":{"country":"Madagascar","year":2018,"incomeYear":2018,"giniYear":2021,"basicReconstructed":true,"basic":{"observed":[0.3001,0.9754,1.7481,4.6274,24.1303],"modelled":[9.2136,22.5465,37.2179,54.7381,77.9706]},"not_od":{"observed":[33.149,43.5441,54.9919,74.5436,95.0532],"modelled":[45.3616,71.9466,84.0298,91.4728,96.8314]}},"MLI":{"country":"Mali","year":2018,"incomeYear":2018,"giniYear":2018,"basicReconstructed":false,"basic":{"observed":[16.7049,23.8255,26.9258,42.0426,55.8798],"modelled":[30.7351,56.3513,72.1897,83.8759,93.5665]},"not_od":{"observed":[72.3445,89.3851,95.9406,99.0149,99.9996],"modelled":[68.7025,87.7093,93.5319,96.6697,98.7765]}},"MMR":{"country":"Myanmar","year":2016,"incomeYear":2016,"giniYear":2015,"basicReconstructed":false,"basic":{"observed":[22.2609,35.6949,47.4018,62.2474,82.9583],"modelled":[36.5818,64.4235,79.2105,88.8587,95.9314]},"not_od":{"observed":[69.9868,84.9879,92.8254,98.999,99.9074],"modelled":[75.3502,91.7031,95.9106,98.0077,99.315]}},"MOZ":{"country":"Mozambique","year":2018,"incomeYear":2018,"giniYear":2019,"basicReconstructed":false,"basic":{"observed":[15.0137,17.7277,20.3305,40.7881,78.7201],"modelled":[0.7147,2.9514,7.7467,19.0529,53.3115]},"not_od":{"observed":[50.8455,57.9773,61.7498,90.1545,99.0501],"modelled":[30.0946,65.94,84.3098,93.6689,98.4252]}},"MRT":{"country":"Mauritania","year":2015,"incomeYear":2015,"giniYear":2014,"basicReconstructed":false,"basic":{"observed":[4.4324,11.8373,34.1714,64.5466,86.7789],"modelled":[42.7152,66.7825,79.0707,87.6074,94.7271]},"not_od":{"observed":[15.3606,36.972,63.2896,90.2654,99.8406],"modelled":[75.0238,89.8501,94.3549,96.9045,98.754]}},"MWI":{"country":"Malawi","year":2017,"incomeYear":2017,"giniYear":2016,"basicReconstructed":false,"basic":{"observed":[15.0506,16.0193,16.2659,25.2827,36.6015],"modelled":[5.1796,16.287,31.8566,52.9669,80.4342]},"not_od":{"observed":[86.8479,94.1427,93.2795,96.447,99.2541],"modelled":[56.7783,84.575,93.0613,97.0036,99.1374]}},"NER":{"country":"Niger","year":2012,"incomeYear":2012,"giniYear":2011,"basicReconstructed":false,"basic":{"observed":[2.68,2.9087,4.2492,8.8328,36.0316],"modelled":[6.5225,14.6918,23.9657,36.6648,60.0193]},"not_od":{"observed":[11.9559,15.7643,17.2873,22.98,72.0581],"modelled":[80.5082,92.261,95.655,97.5805,99.0003]}},"NPL":{"country":"Nepal","year":2019,"incomeYear":2019,"giniYear":2022,"basicReconstructed":false,"basic":{"observed":[79.913,80.4839,82.0325,73.1728,77.4429],"modelled":[26.5712,46.7473,60.9568,73.4979,86.8631]},"not_od":{"observed":[90.6496,90.6467,94.836,98.9765,99.9654],"modelled":[94.9435,98.1855,98.9796,99.4235,99.7544]}},"RWA":{"country":"Rwanda","year":2017,"incomeYear":2017,"giniYear":2016,"basicReconstructed":false,"basic":{"observed":[57.6004,67.793,79.9724,81.4626,63.6807],"modelled":[5.7212,17.3713,33.0841,53.8208,80.5193]},"not_od":{"observed":[95.7677,97.482,99.166,100.0,99.9754],"modelled":[49.7849,79.4877,90.2408,95.6189,98.6898]}},"SDN":{"country":"Sudan","year":2014,"incomeYear":2014,"giniYear":2014,"basicReconstructed":false,"basic":{"observed":[7.284,8.8392,22.1089,46.6414,78.385],"modelled":[15.4345,32.9292,48.6855,64.7111,83.1726]},"not_od":{"observed":[45.8226,51.3004,68.7562,88.5464,99.5654],"modelled":[51.5133,75.461,85.6777,92.042,96.8413]}},"SEN":{"country":"Senegal","year":2019,"incomeYear":2019,"giniYear":2018,"basicReconstructed":false,"basic":{"observed":[21.8921,46.4079,65.9892,74.3378,90.363],"modelled":[34.3509,62.166,77.6272,87.9405,95.592]},"not_od":{"observed":[59.4096,85.1564,97.4753,99.1612,99.9865],"modelled":[71.4975,89.9666,95.0243,97.5739,99.1681]}},"SLE":{"country":"Sierra Leone","year":2019,"incomeYear":2019,"giniYear":2018,"basicReconstructed":false,"basic":{"observed":[4.3558,5.7944,12.6563,25.0278,45.0329],"modelled":[14.1574,31.5941,47.9159,64.7013,83.7382]},"not_od":{"observed":[60.0253,74.0005,82.8532,95.0792,98.1703],"modelled":[71.8716,89.2736,94.3713,97.0974,98.9277]}},"SOM":{"country":"Somalia","year":2017,"incomeYear":2017,"giniYear":null,"basicReconstructed":false,"basic":{"observed":[3.9858,17.3982,36.9192,37.5329,36.0159],"modelled":[36.3633,64.125,78.9596,88.6867,95.8527]},"not_od":{"observed":[32.812,66.2589,93.4153,99.8583,99.9693],"modelled":[76.0312,91.978,96.0443,98.0703,99.3349]}},"TCD":{"country":"Chad","year":2019,"incomeYear":2019,"giniYear":2018,"basicReconstructed":true,"basic":{"observed":[2.309,4.2374,4.8155,9.4554,39.43],"modelled":[13.9044,32.2272,49.5623,67.0045,85.6797]},"not_od":{"observed":[14.3496,19.4586,22.9961,34.7208,80.2396],"modelled":[54.9622,79.8835,89.232,94.4904,98.03]}},"TGO":{"country":"Togo","year":2017,"incomeYear":2017,"giniYear":2018,"basicReconstructed":true,"basic":{"observed":[3.142,4.8683,11.0065,21.1405,55.4345],"modelled":[6.336,18.4823,34.2002,54.4246,80.3665]},"not_od":{"observed":[21.1576,27.5735,50.1938,78.782,95.6355],"modelled":[61.0992,86.1223,93.5332,97.0836,99.1073]}},"TLS":{"country":"Timor-Leste","year":2016,"incomeYear":2016,"giniYear":2014,"basicReconstructed":false,"basic":{"observed":[24.2007,40.6789,55.6284,70.3653,86.2947],"modelled":[55.3334,75.2184,84.0718,90.1369,95.4204]},"not_od":{"observed":[44.9494,65.1382,77.2765,93.5596,99.7815],"modelled":[97.8552,99.2133,99.5479,99.7385,99.8847]}},"TZA":{"country":"United Republic of Tanzania","year":2017,"incomeYear":2017,"giniYear":2018,"basicReconstructed":false,"basic":{"observed":[30.8947,33.1678,41.9347,51.0737,52.19],"modelled":[11.5633,29.443,47.8423,66.8523,86.5872]},"not_od":{"observed":[78.8585,91.535,95.8301,99.1438,99.9625],"modelled":[59.9513,84.5925,92.4466,96.4267,98.8384]}},"UGA":{"country":"Uganda","year":2019,"incomeYear":2019,"giniYear":2019,"basicReconstructed":false,"basic":{"observed":[15.1143,19.8219,25.4904,39.3065,53.4688],"modelled":[10.2068,27.8043,46.9885,67.114,87.4067]},"not_od":{"observed":[83.8656,96.4864,98.733,99.6798,100.0],"modelled":[56.2657,83.3434,92.1252,96.4329,98.9093]}},"YEM":{"country":"Yemen","year":2013,"incomeYear":2013,"giniYear":2014,"basicReconstructed":false,"basic":{"observed":[12.1489,34.9114,57.6603,79.7997,94.8226],"modelled":[43.2573,70.0071,82.6879,90.6686,96.505]},"not_od":{"observed":[39.8991,68.4303,81.5516,92.8599,97.9071],"modelled":[81.2169,93.8543,96.9202,98.4643,99.4527]}},"ZMB":{"country":"Zambia","year":2018,"incomeYear":2018,"giniYear":2015,"basicReconstructed":false,"basic":{"observed":[21.0655,24.8145,25.9643,30.2575,63.61],"modelled":[4.3692,18.3394,40.8609,67.9963,91.2841]},"not_od":{"observed":[77.7813,83.9983,91.2694,98.6396,99.8639],"modelled":[25.9325,64.4143,84.993,94.6191,98.8583]}}}};

const FALLBACK={
 iso3:"MWI",
 iso2:"MW",
 name:"Malawi",
 income:"Low income",
 gni:{value:600,year:null},
 gdp:{value:670,year:null},
 gini:{value:38.5,year:2019},
 currency:{code:"MWK",name:"Malawi kwacha"}
};

const OPTIONS=[
 {
 id:"unimproved",
 name:"Unimproved pit latrine",
 short:"Unimproved pit",
 usd:50,
 od:100,
 cont:8,
 color:"#d6574a"
 },
 {
 id:"vip",
 name:"VIP latrine",
 short:"VIP latrine",
 usd:120,
 od:100,
 cont:40,
 color:"#d7ae3b"
 },
 {
 id:"septic",
 name:"Septic tank + soakaway",
 short:"Septic",
 usd:700,
 od:100,
 cont:86,
 color:"#aa5797"
 }
];

const LDC_COST_2015={
 "AFG":{name:"Afghanistan",traditional:4.4,wetPit:20.5,dryPit:8.6,septic:29.7},
 "AGO":{name:"Angola",traditional:16.8,wetPit:40.6,dryPit:23.0,septic:243.3},
 "BGD":{name:"Bangladesh",traditional:5.7,wetPit:6.9,dryPit:5.7,septic:132.0},
 "BEN":{name:"Benin",traditional:10.0,wetPit:34.5,dryPit:11.2,septic:57.8},
 "BFA":{name:"Burkina Faso",traditional:10.2,wetPit:31.5,dryPit:10.2,septic:41.9},
 "BDI":{name:"Burundi",traditional:1.5,wetPit:19.4,dryPit:10.5,septic:62.0},
 "KHM":{name:"Cambodia",traditional:5.6,wetPit:22.6,dryPit:11.2,septic:50.8},
 "CAF":{name:"Central African Republic",traditional:5.3,wetPit:11.6,dryPit:10.6,septic:102.4},
 "TCD":{name:"Chad",traditional:11.7,wetPit:40.1,dryPit:28.4,septic:58.8},
 "COM":{name:"Comoros",traditional:3.5,wetPit:30.0,dryPit:16.8,septic:50.3},
 "COD":{name:"Democratic Republic of the Congo",traditional:10.1,wetPit:71.0,dryPit:10.2,septic:280.7},
 "DJI":{name:"Djibouti",traditional:6.7,wetPit:57.8,dryPit:18.7,septic:81.9},
 "ERI":{name:"Eritrea",traditional:6.7,wetPit:290.7,dryPit:48.5,septic:449.4},
 "ETH":{name:"Ethiopia",traditional:7.6,wetPit:329.2,dryPit:54.9,septic:508.9},
 "GMB":{name:"Gambia",traditional:9.3,wetPit:17.8,dryPit:8.1,septic:95.3},
 "GIN":{name:"Guinea",traditional:7.0,wetPit:38.2,dryPit:6.1,septic:36.6},
 "GNB":{name:"Guinea-Bissau",traditional:7.0,wetPit:37.8,dryPit:6.0,septic:36.2},
 "HTI":{name:"Haiti",traditional:3.8,wetPit:32.8,dryPit:6.3,septic:43.9},
 "KIR":{name:"Kiribati",traditional:4.1,wetPit:13.8,dryPit:5.6,septic:40.9},
 "LAO":{name:"Lao People's Democratic Republic",traditional:10.7,wetPit:23.4,dryPit:5.3,septic:46.3},
 "LSO":{name:"Lesotho",traditional:14.5,wetPit:49.8,dryPit:10.3,septic:83.5},
 "LBR":{name:"Liberia",traditional:4.9,wetPit:26.7,dryPit:3.5,septic:346.6},
 "MDG":{name:"Madagascar",traditional:7.8,wetPit:31.9,dryPit:15.0,septic:70.9},
 "MWI":{name:"Malawi",traditional:4.4,wetPit:35.1,dryPit:12.9,septic:129.5},
 "MLI":{name:"Mali",traditional:9.2,wetPit:34.4,dryPit:9.2,septic:80.3},
 "MRT":{name:"Mauritania",traditional:17.1,wetPit:51.5,dryPit:20.6,septic:154.6},
 "MOZ":{name:"Mozambique",traditional:5.9,wetPit:86.0,dryPit:11.3,septic:42.2},
 "MMR":{name:"Myanmar",traditional:9.7,wetPit:32.3,dryPit:16.0,septic:110.2},
 "NPL":{name:"Nepal",traditional:5.0,wetPit:42.6,dryPit:36.6,septic:61.3},
 "NER":{name:"Niger",traditional:5.1,wetPit:57.4,dryPit:28.7,septic:25.8},
 "RWA":{name:"Rwanda",traditional:8.1,wetPit:62.1,dryPit:9.1,septic:175.9},
 "SEN":{name:"Senegal",traditional:11.7,wetPit:44.1,dryPit:11.0,septic:66.1},
 "SLE":{name:"Sierra Leone",traditional:7.7,wetPit:58.6,dryPit:7.7,septic:230.7},
 "SLB":{name:"Solomon Islands",traditional:4.6,wetPit:7.9,dryPit:3.5,septic:45.5},
 "SOM":{name:"Somalia",traditional:3.8,wetPit:17.4,dryPit:2.0,septic:115.7},
 "SSD":{name:"South Sudan",traditional:6.7,wetPit:59.3,dryPit:6.7,septic:65.9},
 "SDN":{name:"Sudan",traditional:18.9,wetPit:85.8,dryPit:9.7,septic:95.4},
 "TLS":{name:"Timor-Leste",traditional:5.0,wetPit:60.9,dryPit:3.8,septic:61.2},
 "TGO":{name:"Togo",traditional:7.8,wetPit:42.3,dryPit:41.3,septic:166.5},
 "TUV":{name:"Tuvalu",traditional:8.1,wetPit:13.8,dryPit:6.1,septic:80.1},
 "UGA":{name:"Uganda",traditional:7.9,wetPit:42.9,dryPit:15.2,septic:158.6},
 "TZA":{name:"United Republic of Tanzania",traditional:9.9,wetPit:54.0,dryPit:19.1,septic:142.8},
 "YEM":{name:"Yemen",traditional:8.8,wetPit:38.6,dryPit:6.7,septic:108.1},
 "ZMB":{name:"Zambia",traditional:15.0,wetPit:72.8,dryPit:15.0,septic:102.7}
};
const LDC_ISO=Object.keys(LDC_COST_2015);

// JMP publishes country inequality workbooks for most LDCs in this comparison.
// These five currently have no Inequalities link on the JMP downloads index.
const JMP_INEQUALITY_UNAVAILABLE=new Set(["DJI","ERI","SLB","SSD","TUV"]);
function hasJmpInequality(iso3){
 return LDC_ISO.includes(iso3)&&!JMP_INEQUALITY_UNAVAILABLE.has(iso3)
}
function jmpInequalityUrl(iso3){
 return `https://washdata.org/data/country/${iso3}/inequalities/download`
}
const COST_USD_2015_TO_2024=143.86/108.7; // World Bank/IMF CPI index: US 2024 / US 2015
const SCENARIO_FALLBACK_USD={
 unimproved:50,
 vip:120,
 septic:700
};

const state={
 country:structuredClone(FALLBACK),
 countries:[],
 currency:"USD",
 fx:{USD:1,MWK:1735},
 options:OPTIONS.map(o=>({...o})),
 globalRaw:null,
 globalRows:[],
 globalLoaded:false,
 globalTableSort:{key:"gap",dir:"desc"},
 hhTableSort:{key:"houseId",dir:"asc"},
 currentModel:null,
 strategy:{
 initialized:false,
 countryIso:null,
 renderCurrency:null,
 prices:{},
 performance:{},
 envelopeUsd:5000,
 mechanism:"none",
 supportPct:30,
 takeup:100,
 uncertaintyPp:10
 },
 sidePanel:"overview",
 activePage:"home"
};

function el(id){return document.getElementById(id)}
function num(id){return Number(el(id).value)}
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function pct(v,d=0){return (v*100).toFixed(d)+"%"}
function frac(x){return x-Math.floor(x)}
function rand(i,s=0){return frac(Math.sin((i+1)*12.9898+(s+1)*78.233)*43758.5453)}
function rate(){return state.fx[state.currency]||1}
function moneyUSD(usd,d=0){
 const v=usd*rate();
 try{
 return new Intl.NumberFormat("en",{style:"currency",currency:state.currency,maximumFractionDigits:d}).format(v)
 }catch(e){
 return state.currency+" "+Math.round(v).toLocaleString()
 }
}
const COUNTRY_CURRENCY={"AW":{"code":"AWG","name":"Aruban Florin"},"AF":{"code":"AFN","name":"Afghan Afghani"},"AO":{"code":"AOA","name":"Angolan Kwanza"},"AI":{"code":"XCD","name":"East Caribbean Dollar"},"AX":{"code":"EUR","name":"Euro"},"AL":{"code":"ALL","name":"Albanian Lek"},"AD":{"code":"EUR","name":"Euro"},"AE":{"code":"AED","name":"United Arab Emirates Dirham"},"AR":{"code":"ARS","name":"Argentine Peso"},"AM":{"code":"AMD","name":"Armenian Dram"},"AS":{"code":"USD","name":"US Dollar"},"TF":{"code":"EUR","name":"Euro"},"AG":{"code":"XCD","name":"East Caribbean Dollar"},"AU":{"code":"AUD","name":"Australian Dollar"},"AT":{"code":"EUR","name":"Euro"},"AZ":{"code":"AZN","name":"Azerbaijani Manat"},"BI":{"code":"BIF","name":"Burundian Franc"},"BE":{"code":"EUR","name":"Euro"},"BJ":{"code":"XOF","name":"West African CFA Franc"},"BQ":{"code":"USD","name":"US Dollar"},"BF":{"code":"XOF","name":"West African CFA Franc"},"BD":{"code":"BDT","name":"Bangladeshi Taka"},"BG":{"code":"BGN","name":"Bulgarian Lev"},"BH":{"code":"BHD","name":"Bahraini Dinar"},"BS":{"code":"BSD","name":"Bahamian Dollar"},"BA":{"code":"BAM","name":"Bosnia-Herzegovina Convertible Mark"},"BL":{"code":"EUR","name":"Euro"},"BY":{"code":"BYN","name":"Belarusian Ruble"},"BZ":{"code":"BZD","name":"Belize Dollar"},"BM":{"code":"BMD","name":"Bermudan Dollar"},"BO":{"code":"BOB","name":"Bolivian Boliviano"},"BR":{"code":"BRL","name":"Brazilian Real"},"BB":{"code":"BBD","name":"Barbadian Dollar"},"BN":{"code":"BND","name":"Brunei Dollar"},"BT":{"code":"INR","name":"Indian Rupee"},"BV":{"code":"NOK","name":"Norwegian Krone"},"BW":{"code":"BWP","name":"Botswanan Pula"},"CF":{"code":"XAF","name":"Central African CFA Franc"},"CA":{"code":"CAD","name":"Canadian Dollar"},"CC":{"code":"AUD","name":"Australian Dollar"},"CH":{"code":"CHF","name":"Swiss Franc"},"CL":{"code":"CLP","name":"Chilean Peso"},"CN":{"code":"CNY","name":"Chinese Yuan"},"CI":{"code":"XOF","name":"West African CFA Franc"},"CM":{"code":"XAF","name":"Central African CFA Franc"},"CD":{"code":"CDF","name":"Congolese Franc"},"CG":{"code":"XAF","name":"Central African CFA Franc"},"CK":{"code":"NZD","name":"New Zealand Dollar"},"CO":{"code":"COP","name":"Colombian Peso"},"KM":{"code":"KMF","name":"Comorian Franc"},"CV":{"code":"CVE","name":"Cape Verdean Escudo"},"CR":{"code":"CRC","name":"Costa Rican Col\u00f3n"},"CU":{"code":"CUP","name":"Cuban Peso"},"CW":{"code":"XCG","name":"Caribbean guilder"},"CX":{"code":"AUD","name":"Australian Dollar"},"KY":{"code":"KYD","name":"Cayman Islands Dollar"},"CY":{"code":"EUR","name":"Euro"},"CZ":{"code":"CZK","name":"Czech Koruna"},"DE":{"code":"EUR","name":"Euro"},"DJ":{"code":"DJF","name":"Djiboutian Franc"},"DM":{"code":"XCD","name":"East Caribbean Dollar"},"DK":{"code":"DKK","name":"Danish Krone"},"DO":{"code":"DOP","name":"Dominican Peso"},"DZ":{"code":"DZD","name":"Algerian Dinar"},"EC":{"code":"USD","name":"US Dollar"},"EG":{"code":"EGP","name":"Egyptian Pound"},"ER":{"code":"ERN","name":"Eritrean Nakfa"},"EH":{"code":"MAD","name":"Moroccan Dirham"},"ES":{"code":"EUR","name":"Euro"},"EE":{"code":"EUR","name":"Euro"},"ET":{"code":"ETB","name":"Ethiopian Birr"},"FI":{"code":"EUR","name":"Euro"},"FJ":{"code":"FJD","name":"Fijian Dollar"},"FK":{"code":"FKP","name":"Falkland Islands Pound"},"FR":{"code":"EUR","name":"Euro"},"FO":{"code":"DKK","name":"Danish Krone"},"FM":{"code":"USD","name":"US Dollar"},"GA":{"code":"XAF","name":"Central African CFA Franc"},"GB":{"code":"GBP","name":"British Pound"},"GE":{"code":"GEL","name":"Georgian Lari"},"GG":{"code":"GBP","name":"British Pound"},"GH":{"code":"GHS","name":"Ghanaian Cedi"},"GI":{"code":"GIP","name":"Gibraltar Pound"},"GN":{"code":"GNF","name":"Guinean Franc"},"GP":{"code":"EUR","name":"Euro"},"GM":{"code":"GMD","name":"Gambian Dalasi"},"GW":{"code":"XOF","name":"West African CFA Franc"},"GQ":{"code":"XAF","name":"Central African CFA Franc"},"GR":{"code":"EUR","name":"Euro"},"GD":{"code":"XCD","name":"East Caribbean Dollar"},"GL":{"code":"DKK","name":"Danish Krone"},"GT":{"code":"GTQ","name":"Guatemalan Quetzal"},"GF":{"code":"EUR","name":"Euro"},"GU":{"code":"USD","name":"US Dollar"},"GY":{"code":"GYD","name":"Guyanaese Dollar"},"HK":{"code":"HKD","name":"Hong Kong Dollar"},"HM":{"code":"AUD","name":"Australian Dollar"},"HN":{"code":"HNL","name":"Honduran Lempira"},"HR":{"code":"EUR","name":"Euro"},"HT":{"code":"HTG","name":"Haitian Gourde"},"HU":{"code":"HUF","name":"Hungarian Forint"},"ID":{"code":"IDR","name":"Indonesian Rupiah"},"IM":{"code":"GBP","name":"British Pound"},"IN":{"code":"INR","name":"Indian Rupee"},"IO":{"code":"USD","name":"US Dollar"},"IE":{"code":"EUR","name":"Euro"},"IR":{"code":"IRR","name":"Iranian Rial"},"IQ":{"code":"IQD","name":"Iraqi Dinar"},"IS":{"code":"ISK","name":"Icelandic Kr\u00f3na"},"IL":{"code":"ILS","name":"Israeli New Shekel"},"IT":{"code":"EUR","name":"Euro"},"JM":{"code":"JMD","name":"Jamaican Dollar"},"JE":{"code":"GBP","name":"British Pound"},"JO":{"code":"JOD","name":"Jordanian Dinar"},"JP":{"code":"JPY","name":"Japanese Yen"},"KZ":{"code":"KZT","name":"Kazakhstani Tenge"},"KE":{"code":"KES","name":"Kenyan Shilling"},"KG":{"code":"KGS","name":"Kyrgystani Som"},"KH":{"code":"KHR","name":"Cambodian Riel"},"KI":{"code":"AUD","name":"Australian Dollar"},"KN":{"code":"XCD","name":"East Caribbean Dollar"},"KR":{"code":"KRW","name":"South Korean Won"},"KW":{"code":"KWD","name":"Kuwaiti Dinar"},"LA":{"code":"LAK","name":"Laotian Kip"},"LB":{"code":"LBP","name":"Lebanese Pound"},"LR":{"code":"LRD","name":"Liberian Dollar"},"LY":{"code":"LYD","name":"Libyan Dinar"},"LC":{"code":"XCD","name":"East Caribbean Dollar"},"LI":{"code":"CHF","name":"Swiss Franc"},"LK":{"code":"LKR","name":"Sri Lankan Rupee"},"LS":{"code":"ZAR","name":"South African Rand"},"LT":{"code":"EUR","name":"Euro"},"LU":{"code":"EUR","name":"Euro"},"LV":{"code":"EUR","name":"Euro"},"MO":{"code":"MOP","name":"Macanese Pataca"},"MF":{"code":"EUR","name":"Euro"},"MA":{"code":"MAD","name":"Moroccan Dirham"},"MC":{"code":"EUR","name":"Euro"},"MD":{"code":"MDL","name":"Moldovan Leu"},"MG":{"code":"MGA","name":"Malagasy Ariary"},"MV":{"code":"MVR","name":"Maldivian Rufiyaa"},"MX":{"code":"MXN","name":"Mexican Peso"},"MH":{"code":"USD","name":"US Dollar"},"MK":{"code":"MKD","name":"Macedonian Denar"},"ML":{"code":"XOF","name":"West African CFA Franc"},"MT":{"code":"EUR","name":"Euro"},"MM":{"code":"MMK","name":"Myanmar Kyat"},"ME":{"code":"EUR","name":"Euro"},"MN":{"code":"MNT","name":"Mongolian Tugrik"},"MP":{"code":"USD","name":"US Dollar"},"MZ":{"code":"MZN","name":"Mozambican Metical"},"MR":{"code":"MRU","name":"Mauritanian Ouguiya"},"MS":{"code":"XCD","name":"East Caribbean Dollar"},"MQ":{"code":"EUR","name":"Euro"},"MU":{"code":"MUR","name":"Mauritian Rupee"},"MW":{"code":"MWK","name":"Malawian Kwacha"},"MY":{"code":"MYR","name":"Malaysian Ringgit"},"YT":{"code":"EUR","name":"Euro"},"NA":{"code":"ZAR","name":"South African Rand"},"NC":{"code":"XPF","name":"CFP Franc"},"NE":{"code":"XOF","name":"West African CFA Franc"},"NF":{"code":"AUD","name":"Australian Dollar"},"NG":{"code":"NGN","name":"Nigerian Naira"},"NI":{"code":"NIO","name":"Nicaraguan C\u00f3rdoba"},"NU":{"code":"NZD","name":"New Zealand Dollar"},"NL":{"code":"EUR","name":"Euro"},"NO":{"code":"NOK","name":"Norwegian Krone"},"NP":{"code":"NPR","name":"Nepalese Rupee"},"NR":{"code":"AUD","name":"Australian Dollar"},"NZ":{"code":"NZD","name":"New Zealand Dollar"},"OM":{"code":"OMR","name":"Omani Rial"},"PK":{"code":"PKR","name":"Pakistani Rupee"},"PA":{"code":"PAB","name":"Panamanian Balboa"},"PN":{"code":"NZD","name":"New Zealand Dollar"},"PE":{"code":"PEN","name":"Peruvian Sol"},"PH":{"code":"PHP","name":"Philippine Peso"},"PW":{"code":"USD","name":"US Dollar"},"PG":{"code":"PGK","name":"Papua New Guinean Kina"},"PL":{"code":"PLN","name":"Polish Zloty"},"PR":{"code":"USD","name":"US Dollar"},"KP":{"code":"KPW","name":"North Korean Won"},"PT":{"code":"EUR","name":"Euro"},"PY":{"code":"PYG","name":"Paraguayan Guarani"},"PS":{"code":"ILS","name":"Israeli New Shekel"},"PF":{"code":"XPF","name":"CFP Franc"},"QA":{"code":"QAR","name":"Qatari Riyal"},"RE":{"code":"EUR","name":"Euro"},"RO":{"code":"RON","name":"Romanian Leu"},"RU":{"code":"RUB","name":"Russian Ruble"},"RW":{"code":"RWF","name":"Rwandan Franc"},"SA":{"code":"SAR","name":"Saudi Riyal"},"SD":{"code":"SDG","name":"Sudanese Pound"},"SN":{"code":"XOF","name":"West African CFA Franc"},"SG":{"code":"SGD","name":"Singapore Dollar"},"GS":{"code":"GBP","name":"British Pound"},"SH":{"code":"SHP","name":"St. Helena Pound"},"SJ":{"code":"NOK","name":"Norwegian Krone"},"SB":{"code":"SBD","name":"Solomon Islands Dollar"},"SL":{"code":"SLE","name":"Sierra Leonean Leone"},"SV":{"code":"USD","name":"US Dollar"},"SM":{"code":"EUR","name":"Euro"},"SO":{"code":"SOS","name":"Somali Shilling"},"PM":{"code":"EUR","name":"Euro"},"RS":{"code":"RSD","name":"Serbian Dinar"},"SS":{"code":"SSP","name":"South Sudanese Pound"},"ST":{"code":"STN","name":"S\u00e3o Tom\u00e9 & Pr\u00edncipe Dobra"},"SR":{"code":"SRD","name":"Surinamese Dollar"},"SK":{"code":"EUR","name":"Euro"},"SI":{"code":"EUR","name":"Euro"},"SE":{"code":"SEK","name":"Swedish Krona"},"SZ":{"code":"SZL","name":"Swazi Lilangeni"},"SX":{"code":"XCG","name":"Caribbean guilder"},"SC":{"code":"SCR","name":"Seychellois Rupee"},"SY":{"code":"SYP","name":"Syrian Pound"},"TC":{"code":"USD","name":"US Dollar"},"TD":{"code":"XAF","name":"Central African CFA Franc"},"TG":{"code":"XOF","name":"West African CFA Franc"},"TH":{"code":"THB","name":"Thai Baht"},"TJ":{"code":"TJS","name":"Tajikistani Somoni"},"TK":{"code":"NZD","name":"New Zealand Dollar"},"TM":{"code":"TMT","name":"Turkmenistani Manat"},"TL":{"code":"USD","name":"US Dollar"},"TO":{"code":"TOP","name":"Tongan Pa\u02bbanga"},"TT":{"code":"TTD","name":"Trinidad & Tobago Dollar"},"TN":{"code":"TND","name":"Tunisian Dinar"},"TR":{"code":"TRY","name":"Turkish Lira"},"TV":{"code":"AUD","name":"Australian Dollar"},"TW":{"code":"TWD","name":"New Taiwan Dollar"},"TZ":{"code":"TZS","name":"Tanzanian Shilling"},"UG":{"code":"UGX","name":"Ugandan Shilling"},"UA":{"code":"UAH","name":"Ukrainian Hryvnia"},"UM":{"code":"USD","name":"US Dollar"},"UY":{"code":"UYU","name":"Uruguayan Peso"},"US":{"code":"USD","name":"US Dollar"},"UZ":{"code":"UZS","name":"Uzbekistani Som"},"VA":{"code":"EUR","name":"Euro"},"VC":{"code":"XCD","name":"East Caribbean Dollar"},"VE":{"code":"VES","name":"Venezuelan Bol\u00edvar"},"VG":{"code":"USD","name":"US Dollar"},"VI":{"code":"USD","name":"US Dollar"},"VN":{"code":"VND","name":"Vietnamese Dong"},"VU":{"code":"VUV","name":"Vanuatu Vatu"},"WF":{"code":"XPF","name":"CFP Franc"},"WS":{"code":"WST","name":"Samoan Tala"},"YE":{"code":"YER","name":"Yemeni Rial"},"ZA":{"code":"ZAR","name":"South African Rand"},"ZM":{"code":"ZMW","name":"Zambian Kwacha"},"ZW":{"code":"USD","name":"US Dollar"}};

function currencyLabel(code){
 try{
 if(Intl.DisplayNames)return new Intl.DisplayNames(["en"],{type:"currency"}).of(code)||code
 }catch(e){}
 return code
}
function flagEmoji(iso2){
 if(!iso2 || iso2.length!==2)return "🌍";
 return iso2.toUpperCase().replace(/./g,c=>String.fromCodePoint(127397+c.charCodeAt(0)))
}

function invNorm(p){
 if(p<=0||p>=1)return p===0?-Infinity:p===1?Infinity:NaN;

 const a=[-39.69683028665376,220.9460984245205,-275.9285104469687,138.357751867269,-30.66479806614716,2.506628277459239];
 const b=[-54.47609879822406,161.5858368580409,-155.6989798598866,66.80131188771972,-13.28068155288572];
 const c=[-.007784894002430293,-.3223964580411365,-2.400758277161838,-2.549732539343734,4.374664141464968,2.938163982698783];
 const d=[.007784695709041462,.3224671290700398,2.445134137142996,3.754408661907416];

 const pl=.02425,ph=1-pl;
 let q,r;

 if(p<pl){
 q=Math.sqrt(-2*Math.log(p));
 return (((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5])/((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1)
 }

 if(p>ph){
 q=Math.sqrt(-2*Math.log(1-p));
 return -(((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5])/((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1)
 }

 q=p-.5;
 r=q*q;

 return (((((a[0]*r+a[1])*r+a[2])*r+a[3])*r+a[4])*r+a[5])*q/(((((b[0]*r+b[1])*r+b[2])*r+b[3])*r+b[4])*r+1)
}
function sigmaFromGini(g){
 const x=clamp(g/100,.01,.9);
 return Math.sqrt(2)*invNorm((x+1)/2)
}

function latest(p){
 return Array.isArray(p)&&Array.isArray(p[1])
 ? p[1].find(d=>d&&d.value!==null&&d.value!==undefined)||null
 : null
}

function wbJsonp(path,params={},timeoutMs=15000){
  return new Promise((resolve,reject)=>{
    // World Bank officially supports JSONP using format=jsonP&prefix=...
    // Keep callback lowercase because older API behaviour lowercased prefixes.
    const cb=("wbcb_"+Date.now()+"_"+Math.floor(Math.random()*1e9)).toLowerCase();
    const script=document.createElement("script");
    let finished=false;

    const cleanup=()=>{
      if(finished)return;
      finished=true;
      clearTimeout(timer);
      try{delete window[cb]}catch(e){window[cb]=undefined}
      script.remove();
    };

    window[cb]=(data)=>{
      cleanup();
      resolve(data);
    };

    const qs=new URLSearchParams({
      ...params,
      format:"jsonP",
      prefix:cb
    });

    script.src=`${WB}${path}?${qs.toString()}`;
    script.async=true;
    script.referrerPolicy="no-referrer";
    script.onerror=()=>{
      cleanup();
      reject(new Error("World Bank JSONP request failed"));
    };

    const timer=setTimeout(()=>{
      cleanup();
      reject(new Error("World Bank request timed out"));
    },timeoutMs);

    document.head.appendChild(script);
  });
}

async function indicator(iso,code,start=1990){
  const yr=new Date().getFullYear();
  const j=await wbJsonp(
    `/country/${iso}/indicator/${code}`,
    {per_page:"100",date:`${start}:${yr}`}
  );

  return latest(j);
}
async function loadFX(){
 try{
 const r=await fetch("https://open.er-api.com//latest/USD");
 const j=await r.json();

 if(j?.rates)state.fx=j.rates
 }catch(e){}
}
async function loadCountries(){
  try{
    const j=await wbJsonp("/country",{per_page:"400"});

    state.countries=(j[1]||[])
      .filter(c=>c.region?.id!=="NA"&&c.iso2Code?.length===2)
      .sort((a,b)=>a.name.localeCompare(b.name));

    el("country").innerHTML=
      state.countries.map(c=>`<option value="${c.id}" ${c.id==="MWI"?"selected":""}>${c.name}</option>`).join("");
  }catch(e){
    // Keep Malawi usable even if the country metadata request fails.
    state.countries=[{
      id:"MWI",
      iso2Code:"MW",
      name:"Malawi",
      incomeLevel:{value:"Low income"}
    }];

    el("country").innerHTML='<option value="MWI" selected>Malawi</option>';
    el("countryStatus").textContent="Country list could not be refreshed. Malawi fallback retained.";
  }
}
function localCurrency(iso2){
 const hit=COUNTRY_CURRENCY[iso2];

 if(hit)return hit;

 return {code:"USD",name:"US dollar"};
}
function rebuildCurrencies(local){
 const pool=[local.code,"USD","EUR","GBP","ZAR","KES","TZS","ZMW","MZN","UGX","RWF"];
 const codes=[...new Set(pool)].filter(c=>c==="USD"||state.fx[c]||c===local.code);

 el("currency").innerHTML=
 codes.map(c=>`<option value="${c}">${c}</option>`).join("");

 state.currency="USD";
 el("currency").value="USD"
}
function setCountryLoading(active,title="Loading country data",detail="Retrieving socioeconomic indicators…"){
 const overlay=el("countryLoadingOverlay");
 if(!overlay)return;

 overlay.hidden=!active;

 if(active){
 el("countryLoadingTitle").textContent=title;
 el("countryLoadingDetail").textContent=detail;
 }

 const select=el("country");
 if(select)select.disabled=active;
}

async function changeCountry(iso){
 const meta=state.countries.find(c=>c.id===iso);
 const countryName=meta?.name||iso;

 setCountryLoading(
 true,
 `Loading ${countryName}`,
 "Retrieving World Bank income and inequality data…"
 );

 el("countryStatus").textContent=`Loading ${countryName}…`;

 const c={
 iso3:iso,
 iso2:meta?.iso2Code||"MW",
 name:countryName,
 income:meta?.incomeLevel?.value||"Not classified",
 gni:{value:null,year:null},
 gdp:{value:null,year:null},
 gini:{value:null,year:null},
 currency:{code:"USD",name:"US dollar"}
 };

 try{
 // Do not let one missing indicator make the whole country switch fail.
 const results=await Promise.allSettled([
 indicator(iso,"NY.GNP.PCAP.CD",2005),
 indicator(iso,"NY.GDP.PCAP.CD",2005),
 indicator(iso,"SI.POV.GINI",1990)
 ]);

 const [gniR,gdpR,giniR]=results;
 const gni=gniR.status==="fulfilled"?gniR.value:null;
 const gdp=gdpR.status==="fulfilled"?gdpR.value:null;
 const gini=giniR.status==="fulfilled"?giniR.value:null;

 c.gni=gni?{value:gni.value,year:gni.date}:c.gni;
 c.gdp=gdp?{value:gdp.value,year:gdp.date}:c.gdp;
 c.gini=gini?{value:gini.value,year:gini.date}:c.gini;
 c.currency=localCurrency(c.iso2);

 state.country=c;
 rebuildCurrencies(c.currency);

 const loaded=[c.gni.value,c.gdp.value,c.gini.value].filter(v=>v!=null).length;

 if(loaded===3){
 el("countryStatus").textContent="Latest available World Bank socioeconomic values loaded.";
 }else if(loaded>0){
 el("countryStatus").textContent="Country loaded. Some World Bank indicators are unavailable, so the model uses its stated fallbacks where needed.";
 }else{
 el("countryStatus").textContent="Country loaded, but current World Bank socioeconomic indicators could not be retrieved.";
 }
 }catch(e){
 state.country=iso==="MWI"?structuredClone(FALLBACK):c;
 state.country.currency=localCurrency(state.country.iso2);
 rebuildCurrencies(state.country.currency);

 el("countryStatus").textContent=
 iso==="MWI"
 ? "Using Malawi fallback values."
 : "Country selected, but socioeconomic indicators could not be loaded.";
 }

 updateCountryText();
 applyCountryCostDefaults(iso);
 state.strategy.initialized=false;
 renderOptions();

 if(state.costSource?.type==="wb"){
 el("countryStatus").textContent += " Sanitation cost defaults use the embedded World Bank country benchmark.";
 }else{
 el("countryStatus").textContent += " No embedded country sanitation cost benchmark is available, so editable scenario defaults are shown.";
 }

 render();

 // Keep the overlay visible very briefly so the state change is legible
 // rather than flashing too quickly on fast connections.
 setTimeout(()=>setCountryLoading(false),120);
}
function updateCountryText(){
 el("countryFlag").textContent=flagEmoji(state.country.iso2);

 el("gniVal").textContent=
 state.country.gni?.value!=null
 ? moneyUSD(state.country.gni.value)
 : "No data";

 el("gdpVal").textContent=
 state.country.gdp?.value!=null
 ? moneyUSD(state.country.gdp.value)
 : "No data";

 el("giniVal").textContent=
 state.country.gini?.value!=null
 ? Number(state.country.gini.value).toFixed(1)
 : "No data"
}
function syncOutputs(){
 el("budgetShareOut").textContent=num("budgetShare").toFixed(1)+"%";
 el("subsidyOut").textContent=Math.round(num("subsidy"))+"%"
}

function applyCountryCostDefaults(iso){
 const wb=LDC_COST_2015[iso];

 if(wb){
 const householdFactor=COST_USD_2015_TO_2024*HH_SIZE;

 const defaults={
 unimproved:wb.traditional*householdFactor,
 vip:((wb.wetPit+wb.dryPit)/2)*householdFactor,
 septic:wb.septic*householdFactor
 };

 state.options.forEach(o=>{
 if(Number.isFinite(defaults[o.id]))o.usd=defaults[o.id];
 });

 state.costSource={
 type:"wb",
 iso,
 defaults
 };
 }else{
 state.options.forEach(o=>{
 if(Number.isFinite(SCENARIO_FALLBACK_USD[o.id]))o.usd=SCENARIO_FALLBACK_USD[o.id];
 });

 state.costSource={type:"fallback",iso};
 }
}

function updateCostSourceNote(){
 const n=el("costSourceNote");
 if(!n)return;

 if(state.costSource?.type==="wb"){
 n.innerHTML=
 `Default costs use the World Bank 2015 country unit-cost estimates, updated to 2024 US dollars and converted from per-person to household costs using ${HH_SIZE.toFixed(1)} people per household. `+
 `Unimproved pit = traditional pit; VIP = mean of rural wet- and dry-pit estimates; septic = latrine with septic tank. Values remain editable.`;
 }else{
 n.innerHTML=
 `No embedded World Bank unit-cost benchmark is available for this country in the current dataset. Editable scenario defaults are shown instead.`;
 }
}

function renderOptions(){
 const r=rate();

 el("costHead").textContent=`Scenario cost ${state.currency}`;
 updateCostSourceNote();

 el("optionRows").innerHTML=
 state.options.map((o,i)=>`
 <tr>
 <td><div class="op"><span class="dot" style="background:${o.color}"></span>${o.short}</div></td>
 <td><input type="number" min="0" step="${r>100?100:1}" value="${Math.round(o.usd*r)}" data-k="cost" data-i="${i}" title="Editable upfront household capital cost for this sanitation option."></td>
 <td><input type="number" min="0" max="100" value="${o.cont}" data-k="cont" data-i="${i}" title="Editable faecal-load performance from 0 to 100. Higher means more faecal waste is kept out of the environment."></td>
 </tr>
 `).join("");

 document.querySelectorAll("[data-k=cost]").forEach(n=>n.oninput=e=>{
 state.options[+e.target.dataset.i].usd=(+e.target.value||0)/rate();
 render()
 });

 document.querySelectorAll("[data-k=cont]").forEach(n=>n.oninput=e=>{
 state.options[+e.target.dataset.i].cont=clamp(+e.target.value||0,0,100);
 render()
 })
}

function utility(o){
 return o.cont/100
}
function financialAccessProbability(budget,price){
 if(!Number.isFinite(price) || price<=0)return 1;
 if(!Number.isFinite(budget) || budget<=0)return 0;

 const logRatio=Math.log(Math.max(1e-12,budget/price));
 const z=clamp(AFFORDABILITY_SLOPE*logRatio,-50,50);

 return 1/(1+Math.exp(-z))
}

function priceAtFinancialThreshold(budget,u){
 if(!Number.isFinite(budget) || budget<=0)return 0;

 const p=clamp(u,1e-6,1-1e-6);
 const logit=Math.log(p/(1-p));

 return budget/Math.exp(logit/AFFORDABILITY_SLOPE)
}

function households(){
 const gni=state.country.gni?.value??state.country.gdp?.value??600;
 const mean=gni*HH_SIZE;
 const sigma=sigmaFromGini(state.country.gini?.value??38.5);
 const mu=Math.log(Math.max(1,mean))-.5*sigma*sigma;
 const share=clamp(num("budgetShare")/100,.002,.5);

 return Array.from({length:N},(_,i)=>{
 const q=(i+.5)/N;
 const annual=Math.exp(mu+sigma*invNorm(q));

 return {
 i,q,annual,
 budget:annual*share,
 accessU:clamp(rand(i,17),1e-6,1-1e-6)
 }
 })
}
function activeOptions(){
 const support=clamp(num("subsidy")/100,0,.9);

 return state.options
 .map(o=>({
 ...o,
 price:o.usd*(1-support),
 utility:utility(o)
 }))
 .sort((a,b)=>b.utility-a.utility||a.price-b.price)
}
function totalFecalTonnesPerYear(){
 return N*HH_SIZE*FECAL_WET_G_PER_PERSON_DAY*365/1e6
}

function model(){
 const hh=households();
 const opts=activeOptions();

 const assigned=hh.map((h,i)=>{
 const opt=opts.find(o=>financialAccessProbability(h.budget,o.price)>=h.accessU)
 ?? {
 id:"none",
 name:"No toilet / OD",
 short:"No toilet / OD",
 color:"#78858b",
 od:0,
 cont:0,
 price:0,
 utility:0
 };

 return {...h,opt}
 });

 const coverage=assigned.filter(a=>a.opt.id!=="none").length/N;
 const poor40=assigned.slice(0,400).filter(a=>a.opt.id!=="none").length/400;
 const poor20=assigned.slice(0,200).filter(a=>a.opt.id!=="none").length/200;
 const rich20=assigned.slice(800,1000).filter(a=>a.opt.id!=="none").length/200;
 const equityGap=rich20-poor20;

 const fecalReduction=assigned.reduce((s,a)=>s+(a.opt.cont||0)/100,0)/N;
 const fecalGeneratedTonnes=totalFecalTonnesPerYear();
 const fecalAvoidedTonnes=fecalGeneratedTonnes*fecalReduction;
 const fecalRemainingTonnes=fecalGeneratedTonnes-fecalAvoidedTonnes;

 const od=coverage;
 const cont=fecalReduction;
 const linear=fecalReduction;

 const base=[
 {id:"none",short:"No toilet / OD",color:"#78858b",cont:0},
 ...opts
 ];

 const mix=base.map(o=>{
 const count=assigned.filter(a=>a.opt.id===o.id).length;

 return {
 ...o,
 count,
 share:count/N
 }
 });

 const optionEval=opts.map(o=>{
 const feasible=hh.filter(h=>financialAccessProbability(h.budget,o.price)>=h.accessU).length/N;
 const score=o.cont/100;

 return {
 ...o,
 feasible,
 cover:feasible,
 score,
 fecalControl:feasible*score
 }
 });

 return {
 hh,opts,assigned,
 coverage,poor40,poor20,rich20,equityGap,
 od,cont,linear,
 fecalReduction,fecalGeneratedTonnes,fecalAvoidedTonnes,fecalRemainingTonnes,
 mix,optionEval
 }
}

/* ---------- realistic synthetic village ---------- */

const ROAD_DEFS=[
 {
 kind:"main",
 pts:[[30,210],[180,230],[330,215],[480,245],[650,225],[820,250],[1000,225],[1170,250]]
 },
 {
 kind:"main",
 pts:[[80,545],[190,500],[320,455],[460,470],[585,430],[720,385],[860,405],[1015,455],[1140,500]]
 },
 {
 kind:"main",
 pts:[[535,25],[520,120],[535,215],[570,320],[565,430],[520,545],[475,695]]
 },
 {
 kind:"minor",
 pts:[[170,110],[205,200],[220,305],[200,430],[170,560]]
 },
 {
 kind:"minor",
 pts:[[330,75],[350,180],[345,300],[325,425],[300,555]]
 },
 {
 kind:"minor",
 pts:[[755,90],[735,200],[760,320],[790,455],[820,570]]
 },
 {
 kind:"minor",
 pts:[[930,100],[915,210],[940,335],[990,465],[1040,585]]
 },
 {
 kind:"minor",
 pts:[[610,300],[730,285],[845,275],[970,275],[1110,295]]
 },
 {
 kind:"minor",
 pts:[[610,470],[745,485],[875,515],[1015,555]]
 }
];

const WATER_DEF=[
 [0,655],[120,625],[260,620],[390,650],[520,680],[680,700],[840,675],[1010,625],[1200,585]
];

function dist(a,b){
 return Math.hypot(b[0]-a[0],b[1]-a[1])
}
function interpolatePolyline(pts,t){
 const lens=[];
 let total=0;

 for(let i=0;i<pts.length-1;i++){
 const d=dist(pts[i],pts[i+1]);
 lens.push(d);
 total+=d
 }

 let target=t*total;

 for(let i=0;i<lens.length;i++){
 if(target<=lens[i]){
 const p=pts[i];
 const q=pts[i+1];
 const u=target/lens[i];

 const x=p[0]+(q[0]-p[0])*u;
 const y=p[1]+(q[1]-p[1])*u;

 const ang=Math.atan2(q[1]-p[1],q[0]-p[0]);

 return {x,y,ang}
 }

 target-=lens[i]
 }

 const p=pts[pts.length-2];
 const q=pts[pts.length-1];

 return {
 x:q[0],
 y:q[1],
 ang:Math.atan2(q[1]-p[1],q[0]-p[0])
 }
}
function seededPermutation(n){
 const a=Array.from({length:n},(_,i)=>i);

 for(let i=n-1;i>0;i--){
 const j=Math.floor(rand(i,91)*(i+1));
 [a[i],a[j]]=[a[j],a[i]]
 }

 return a
}
const HOUSE_PERM=seededPermutation(N);

function generateParcels(){
 const parcels=[
 [[35,70],[155,60],[175,155],[55,165]],
 [[210,55],[330,50],[340,150],[220,160]],
 [[875,45],[1015,55],[1010,170],[885,155]],
 [[1030,70],[1170,80],[1160,180],[1035,175]],
 [[45,325],[170,300],[180,450],[55,475]],
 [[205,325],[315,315],[325,440],[210,455]],
 [[890,335],[1005,325],[1030,455],[910,465]],
 [[1040,345],[1160,365],[1150,500],[1045,485]],
 [[650,60],[775,70],[760,170],[640,155]]
 ];

 return parcels.map((poly,i)=>{
 const pts=poly.map(p=>p.join(",")).join(" ");

 let inner="";

 for(let k=1;k<=4;k++){
 const a=poly[0],b=poly[3];
 const c=poly[1],d=poly[2];

 const u=k/5;

 const x1=a[0]+(b[0]-a[0])*u;
 const y1=a[1]+(b[1]-a[1])*u;
 const x2=c[0]+(d[0]-c[0])*u;
 const y2=c[1]+(d[1]-c[1])*u;

 inner+=`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#c5d4c0" stroke-width=".8" opacity=".7"/>`
 }

 return `<g><polygon points="${pts}" fill="#e7eee5" stroke="#bdcdb8" stroke-width="1.2"/>${inner}</g>`
 }).join("")
}
function renderSyntheticBaseTo(parcelId,waterId,roadId){
 const parcel=el(parcelId);
 const water=el(waterId);
 const road=el(roadId);

 if(!parcel||!water||!road)return;

 parcel.innerHTML=generateParcels();

 const waterPts=WATER_DEF.map(p=>p.join(",")).join(" ");

 water.innerHTML=
 `<polyline points="${waterPts}" fill="none" stroke="#d2e5eb" stroke-width="54" stroke-linecap="round" stroke-linejoin="round"/>
 <polyline points="${waterPts}" fill="none" stroke="#8ebfce" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" opacity=".88"/>`;

 road.innerHTML=
 ROAD_DEFS.map(r=>{
 const pts=r.pts.map(p=>p.join(",")).join(" ");

 if(r.kind==="main"){
 return `
 <polyline points="${pts}" fill="none" stroke="#c6cdd1" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>
 <polyline points="${pts}" fill="none" stroke="#8e9ba1" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
 `
 }

 return `
 <polyline points="${pts}" fill="none" stroke="#d0d6d9" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
 `
 }).join("")
}

function renderSyntheticBase(){
 renderSyntheticBaseTo("parcelLayer","waterLayer","roadLayer");
 renderSyntheticBaseTo("strategyParcelLayer","strategyWaterLayer","strategyRoadLayer");
}

function generateBuildings(){
 const positions=[];

 // Distribute buildings along all roads, with denser settlement near junctions.
 const perRoad=[180,170,165,85,80,85,80,80,75];

 ROAD_DEFS.forEach((r,ri)=>{
 const n=perRoad[ri];

 for(let j=0;j<n;j++){
 const t=(j+.5)/n;

 const p=interpolatePolyline(r.pts,t);

 const side=rand(j+ri*1000,201)>.5?1:-1;
 const baseOffset=r.kind==="main"?18:13;
 const extra=rand(j+ri*1000,202)*18;

 const offset=(baseOffset+extra)*side;

 let x=p.x-Math.sin(p.ang)*offset;
 let y=p.y+Math.cos(p.ang)*offset;

 // small along-road jitter
 const shift=(rand(j+ri*1000,203)-.5)*12;
 x+=Math.cos(p.ang)*shift;
 y+=Math.sin(p.ang)*shift;

 const w=6+8*rand(j+ri*1000,204);
 const h=4.5+6*rand(j+ri*1000,205);

 positions.push({
 x:clamp(x,20,1180),
 y:clamp(y,20,695),
 ang:p.ang+(rand(j+ri*1000,206)-.5)*0.28,
 w,h
 })
 }
 });

 // Add extra village clusters around junctions.
 const junctions=[
 [525,220],[565,430],[215,225],[760,250],[925,245],[330,215],[790,405]
 ];

 let k=0;

 while(positions.length<N){
 const c=junctions[k%junctions.length];

 const theta=rand(k,301)*Math.PI*2;
 const radius=14+65*Math.pow(rand(k,302),.65);

 const x=clamp(c[0]+Math.cos(theta)*radius,20,1180);
 const y=clamp(c[1]+Math.sin(theta)*radius,20,695);

 positions.push({
 x,y,
 ang:(rand(k,303)-.5)*Math.PI,
 w:6+7*rand(k,304),
 h:4.5+6*rand(k,305)
 });

 k++
 }

 return positions.slice(0,N)
}
const BUILDINGS=generateBuildings();

function buildingPath(b){
 const dx=b.w/2;
 const dy=b.h/2;
 const ca=Math.cos(b.ang);
 const sa=Math.sin(b.ang);

 const corners=[
 [-dx,-dy],[dx,-dy],[dx,dy],[-dx,dy]
 ].map(([px,py])=>[
 b.x+px*ca-py*sa,
 b.y+px*sa+py*ca
 ]);

 return corners.map((p,i)=>
 `${i?"L":"M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`
 ).join(" ")+" Z"
}
function renderMapTo(m,buildingId,legendId){
 const buildingLayer=el(buildingId);
 const legend=el(legendId);

 if(!buildingLayer||!legend)return;

 buildingLayer.innerHTML=
 BUILDINGS.map((b,i)=>{
 const hhIndex=HOUSE_PERM[i];
 const a=m.assigned[hhIndex];
 const opt=a.opt;

 const fill=opt.id==="none"?"#27343a":opt.color;
 const stroke=opt.id==="none"?"#67757b":opt.color;

 const title=
 `${opt.short} · sanitation budget ${moneyUSD(a.budget)}`+
 (opt.id==="none"
 ?""
 :` · household price ${moneyUSD(opt.price)} · faecal load kept out ${Math.round(opt.cont||0)}%`);

 return `
 <path class="bldg"
 data-title="${title.replace(/"/g,"&quot;")}"
 d="${buildingPath(b)}"
 fill="${fill}"
 fill-opacity="${opt.id==="none"?".48":".88"}"
 stroke="${stroke}"
 stroke-width=".7"/>
 `
 }).join("");

 legend.innerHTML=
 "<h3>SANITATION STATUS</h3>"+
 m.mix.map(o=>`
 <div class="leg">
 <span class="leg-dot" style="background:${o.color}"></span>
 <span>${o.short}: ${o.count} HH</span>
 </div>
 `).join("");

 const tip=el("tooltip");

 buildingLayer.querySelectorAll(".bldg").forEach(n=>{
 n.onmouseenter=e=>{
 tip.textContent=e.currentTarget.dataset.title;
 tip.style.display="block"
 };

 n.onmousemove=e=>{
 tip.style.left=(e.clientX+12)+"px";
 tip.style.top=(e.clientY+12)+"px"
 };

 n.onmouseleave=()=>{
 tip.style.display="none"
 }
 })
}

function renderMap(m){
 renderMapTo(m,"buildingLayer","mapLegend");
}

function renderStrategyMap(m){
 renderMapTo(m,"strategyBuildingLayer","strategyMapLegend");
}

/* ---------- charts ---------- */

function T(x,y,t,size=9,fill="#657780",anchor="middle",weight=400){
 return `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" text-anchor="${anchor}" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif" font-weight="${weight}">${t}</text>`
}
function L(x1,y1,x2,y2,stroke="#d8e1e5",w=1,dash=""){
 return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${w}" ${dash?`stroke-dasharray="${dash}"`:""}/>`
}
function quintileMix(m,q){
 const a=m.assigned.slice(q*200,(q+1)*200);
 const counts={};

 a.forEach(x=>{
 counts[x.opt.id]=(counts[x.opt.id]||0)+1
 });

 return {
 n:a.length,
 counts
 }
}

function quintileFinance(m,q){
 const a=m.hh.slice(q*200,(q+1)*200);

 const medianOf=vals=>{
 const s=vals.slice().sort((x,y)=>x-y);
 const mid=Math.floor(s.length/2);
 return s.length%2?s[mid]:(s[mid-1]+s[mid])/2;
 };

 const resources=medianOf(a.map(h=>h.annual));
 const budget=medianOf(a.map(h=>h.budget));
 const support=clamp(num("subsidy")/100,0,.9);
 const maxListedPrice=support<.999?budget/(1-support):budget;

 return {resources,budget,maxListedPrice};
}

function renderSideEquity(m){
 const tableBody=el("quintileFinanceTable").querySelector("tbody");

 tableBody.innerHTML=Array.from({length:5},(_,q)=>{
 const finance=quintileFinance(m,q);

 return `<tr>
 <td>${q===0?"Q1 poorest":q===4?"Q5 richest":"Q"+(q+1)}</td>
 <td>${moneyUSD(finance.resources)}</td>
 <td>${moneyUSD(finance.budget)}</td>
 <td>${moneyUSD(finance.maxListedPrice)}</td>
 </tr>`;
 }).join("");

 const svg=el("sideEquity");
 const W=360,H=220,Lf=52,R=10,Tp=12,B=30,iw=W-Lf-R,ih=H-Tp-B;
 const maxY=200;

 let out=`<rect width="${W}" height="${H}" fill="transparent"/>`;

 [0,50,100,150,200].forEach(v=>{
 const y=Tp+ih-(v/maxY)*ih;

 out+=L(Lf,y,W-R,y,"#d6dfe3",1);
 out+=T(Lf-6,y+3,String(v),9.5,"#566b74","end")
 });

 const order=m.mix;
 const bw=42;
 const gap=(iw-5*bw)/4;

 for(let q=0;q<5;q++){
 const qm=quintileMix(m,q);
 const x=Lf+q*(bw+gap);
 let cum=0;

 order.forEach(o=>{
 const count=qm.counts[o.id]||0;
 const h=(count/maxY)*ih;

 out+=`<rect x="${x}" y="${Tp+ih-cum-h}" width="${bw}" height="${h}" fill="${o.color}"/>`;

 if(h>16){
 out+=T(
 x+bw/2,
 Tp+ih-cum-h/2+3,
 String(count),
 9,
 "#fff",
 "middle",
 700
 )
 }

 cum+=h
 });

 out+=T(
 x+bw/2,
 H-10,
 q===0?"Q1":q===4?"Q5":"Q"+(q+1),
 9.5,
 "#566b74",
 "middle",
 700
 )
 }

 svg.innerHTML=out;

 el("sideEquityLegend").innerHTML=
 m.mix.map(o=>`
 <span><i style="background:${o.color}"></i>${o.short.replace(" / OD","")}</span>
 `).join("")
}
function renderLoadSummary(m){
 el("loadRemaining").textContent=
 `${pct(1-m.fecalReduction,1)} · ${m.fecalRemainingTonnes.toFixed(0)} t/yr`;

 el("impactRemainingFill").style.width=((1-m.fecalReduction)*100).toFixed(1)+"%";
}
function renderSide(m){
 renderSideEquity(m);
 renderLoadSummary(m)
}

function renderAfford(m){
 const svg=el("affordChart");
 const W=580,H=300,Lf=80,R=20,Tp=18,B=40,iw=W-Lf-R,ih=H-Tp-B;

 const vals=m.hh.map(h=>h.budget);
 const max=Math.max(...vals,...m.opts.map(o=>o.price))*1.08;
 const min=Math.max(1,Math.min(...vals)*.8);

 const ly=v=>Math.log(v);
 const a=ly(min),b=ly(max);

 const sx=q=>Lf+q*iw;
 const sy=v=>Tp+(b-ly(Math.max(v,min)))/(b-a)*ih;

 let out=`<rect width="${W}" height="${H}" fill="#fff"/>`;

 [0,.25,.5,.75,1].forEach(q=>{
 out+=L(sx(q),Tp,sx(q),Tp+ih);
 out+=T(sx(q),H-13,Math.round(q*100)+"%",10,"#536973")
 });

 [10,25,50,100,250,500,1000,2500,5000,10000]
 .filter(v=>v>=min&&v<=max)
 .forEach(v=>{
 out+=L(Lf,sy(v),W-R,sy(v));
 out+=T(Lf-7,sy(v)+3,moneyUSD(v),9,"#536973","end")
 });

 let d="";

 m.hh.forEach((h,i)=>{
 d+=(i?"L":"M")+sx(i/(N-1)).toFixed(1)+" "+sy(h.budget).toFixed(1)+" "
 });

 out+=`<path d="${d}" fill="none" stroke="#173f5a" stroke-width="2.5"/>`;

 m.opts.forEach(o=>{
 const y=sy(o.price);

 out+=L(Lf,y,W-R,y,o.color,2,"5 4");
 out+=T(W-R-2,y-4,o.short,9,o.color,"end",700)
 });

 out+=T(
 W/2,
 H-2,
 "Households: poorest → richest",
 11,
 "#314f5d",
 "middle",
 650
 );

 out+=`<text x="15" y="${Tp+ih/2}" transform="rotate(-90 15 ${Tp+ih/2})"
 font-size="10.5" fill="#314f5d" text-anchor="middle"
 font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
 font-weight="650">Cash available for sanitation (${state.currency}/HH, log scale)</text>`;

 svg.innerHTML=out
}
function renderTradeBubble(m){
 const svg=el("tradeBubbleChart");
 const W=760,H=330,Lf=66,R=30,Tp=24,B=48,iw=W-Lf-R,ih=H-Tp-B;
 const sx=v=>Lf+v*iw;
 const sy=v=>Tp+(1-v)*ih;
 const totalGeneratedTonnes=totalFecalTonnesPerYear();

 const impacts=m.mix.filter(o=>o.id!=="none").map(o=>{
 const reductionFraction=o.share*(o.cont/100);
 return {
 ...o,
 reductionFraction,
 reductionTonnes:totalGeneratedTonnes*reductionFraction
 };
 });

 const maxImpact=Math.max(.0001,...impacts.map(o=>o.reductionTonnes));
 let out=`<rect width="${W}" height="${H}" fill="#fff"/>`;

 [0,.25,.5,.75,1].forEach(v=>{
 out+=L(sx(v),Tp,sx(v),Tp+ih);
 out+=L(Lf,sy(v),W-R,sy(v));
 out+=T(sx(v),H-17,Math.round(v*100)+"%",10,"#536973");
 out+=T(Lf-7,sy(v)+3,Math.round(v*100)+"%",10,"#536973","end")
 });

 impacts.forEach(o=>{
 const x=sx(o.share),y=sy(o.cont/100);
 const r=6+31*Math.sqrt(o.reductionTonnes/maxImpact);
 const title=
 `${o.short} · ${o.count} households (${pct(o.share,1)}) · `+
 `faecal load kept out ${o.cont.toFixed(0)}% · `+
 `${o.reductionTonnes.toFixed(0)} t/year wet faecal mass kept out`;

 out+=`<circle class="trade-point" data-title="${title.replace(/"/g,"&quot;")}" cx="${x}" cy="${y}" r="${r}" fill="${o.color}" fill-opacity=".80" stroke="#fff" stroke-width="2"/>`;
 out+=T(x+r+5,y+3,o.short,9.5,o.color,"start",700)
 });

 out+=T(W/2,H-2,"Households using this technology (%)",10.5,"#314f5d","middle",650);

 out+=`<text x="15" y="${Tp+ih/2}" transform="rotate(-90 15 ${Tp+ih/2})" font-size="10.5" fill="#314f5d" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif" font-weight="650">Faecal load kept out (%)</text>`;

 svg.innerHTML=out;

 const tip=el("tooltip");

 document.querySelectorAll(".trade-point").forEach(n=>{
 n.onmouseenter=e=>{
 tip.textContent=e.currentTarget.dataset.title;
 tip.style.display="block"
 };

 n.onmousemove=e=>{
 tip.style.left=(e.clientX+12)+"px";
 tip.style.top=(e.clientY+12)+"px"
 };

 n.onmouseleave=()=>tip.style.display="none"
 });

 el("tradeBubbleLegend").innerHTML=
 impacts.map(o=>`<span><i style="background:${o.color};border-radius:50%"></i>${o.short}</span>`).join("")+
 `<span style="margin-left:6px;font-weight:650">Bubble area = annual faecal wet mass kept out</span>`
}

function renderTrade(m){
 const svg=el("tradeChart");
 const W=580,H=300,Lf=66,R=62,Tp=26,B=48,iw=W-Lf-R,ih=H-Tp-B;
 const totalGeneratedTonnes=totalFecalTonnesPerYear();

 const tech=m.opts
 .map(o=>({
 ...o,
 listed:o.usd,
 price:o.price,
 performance:clamp((o.cont||0)/100,0,1)
 }))
 .sort((a,b)=>a.price-b.price);

 if(!tech.length){
 svg.innerHTML="";
 el("tradeLegend").innerHTML="";
 return;
 }

 const coverageAt=price=>{
 if(price<=0)return 1;
 return m.hh.filter(h=>financialAccessProbability(h.budget,price)>=h.accessU).length/m.hh.length;
 };

 // Performance is deliberately independent of cost. The curve simply
 // interpolates between the three editable technology assumptions.
 const performanceAt=price=>{
 if(price<=0)return 0;

 if(price<=tech[0].price){
 const den=Math.max(1e-9,tech[0].price);
 return clamp(tech[0].performance*(price/den),0,1);
 }

 for(let i=0;i<tech.length-1;i++){
 const a=tech[i],b=tech[i+1];

 if(price<=b.price){
 const den=Math.max(1e-9,b.price-a.price);
 const f=clamp((price-a.price)/den,0,1);

 return clamp(a.performance+f*(b.performance-a.performance),0,1);
 }
 }

 return tech[tech.length-1].performance;
 };

 const baseMax=Math.max(1,...tech.map(o=>o.price));
 let maxCost=baseMax*1.15;
 let probe=baseMax;

 while(coverageAt(probe)>.06 && probe<baseMax*6){
 probe*=1.28;
 }

 maxCost=Math.max(maxCost,probe);

 const n=61;
 const pts=Array.from({length:n},(_,i)=>{
 const cost=maxCost*i/(n-1);
 const coverage=coverageAt(cost);
 const performance=performanceAt(cost);
 const removedFraction=coverage*performance;
 const removedTonnes=removedFraction*totalGeneratedTonnes;

 return {cost,coverage,performance,removedFraction,removedTonnes};
 });

 const sx=v=>Lf+(v/maxCost)*iw;
 const syLeft=v=>Tp+(1-clamp(v,0,1))*ih;
 const syRight=tonnes=>Tp+(1-clamp(tonnes/totalGeneratedTonnes,0,1))*ih;

 const linePathLeft=(key)=>pts.map((d,i)=>
 `${i?"L":"M"} ${sx(d.cost).toFixed(1)} ${syLeft(d[key]).toFixed(1)}`
 ).join(" ");

 const removedLine=pts.map((d,i)=>
 `${i?"L":"M"} ${sx(d.cost).toFixed(1)} ${syRight(d.removedTonnes).toFixed(1)}`
 ).join(" ");

 const removedArea=
 `${removedLine} L ${sx(maxCost).toFixed(1)} ${syRight(0).toFixed(1)} `+
 `L ${sx(0).toFixed(1)} ${syRight(0).toFixed(1)} Z`;

 const compactTick=usd=>{
 const v=usd*rate();
 const av=Math.abs(v);

 if(av>=1000000)return (v/1000000).toFixed(v>=10000000?0:1).replace(".0","")+"m";
 if(av>=1000)return (v/1000).toFixed(v>=10000?0:1).replace(".0","")+"k";

 return Math.round(v).toLocaleString();
 };

 let out=`<rect width="${W}" height="${H}" fill="#fff"/>`;

 // Shared horizontal grid. Left labels are percentages; right labels are the
 // equivalent annual faecal wet-mass tonnes kept out.
 [0,.25,.5,.75,1].forEach(v=>{
 const y=syLeft(v);

 out+=L(Lf,y,W-R,y,"#e5e9ec",1);
 out+=T(Lf-7,y+3,Math.round(v*100)+"%",10,"#536973","end");
 out+=T(W-R+7,y+3,(totalGeneratedTonnes*v).toFixed(0)+" t",9.5,"#8a6d00","start",700);
 });

 [0,.25,.5,.75,1].forEach(v=>{
 const x=sx(maxCost*v);

 out+=L(x,Tp,x,Tp+ih,"#f0f2f4",1);
 out+=T(x,H-18,compactTick(maxCost*v),9.5,"#536973","middle");
 });

 // Environmental outcome gets its own right-axis visual treatment.
 out+=`<path d="${removedArea}" fill="#e8df9c" fill-opacity=".34"/>`;
 out+=`<path class="trade-line" data-title="Faecal load kept out, read from the right axis in tonnes/year" d="${removedLine}" fill="none" stroke="#a47f00" stroke-width="3.6"/>`;

 // Coverage and performance remain on the left percentage axis.
 out+=`<path class="trade-line" data-title="Modelled household coverage, read from the left percentage axis" d="${linePathLeft("coverage")}" fill="none" stroke="#6268cf" stroke-width="2.0" stroke-dasharray="7 4"/>`;
 out+=`<path class="trade-line" data-title="Technical performance, read from the left percentage axis" d="${linePathLeft("performance")}" fill="none" stroke="#96345f" stroke-width="2.0" stroke-dasharray="3 3"/>`;

 // Mark actual technology assumptions.
 tech.forEach((o,i)=>{
 const coverage=coverageAt(o.price);
 const removedFraction=coverage*o.performance;
 const removedTonnes=removedFraction*totalGeneratedTonnes;
 const x=sx(o.price),y=syLeft(o.performance);
 const labelCost=compactTick(o.price);

 out+=L(x,Tp,x,Tp+ih,"#dfe4e7",1,"4 4");

 out+=`<circle class="trade-tech-point" data-title="${(
 `${o.short}: household cost ${state.currency} ${labelCost}; `+
 `technical performance ${pct(o.performance,0)}; `+
 `modelled coverage if offered alone ${pct(coverage,1)}; `+
 `faecal load kept out ${removedTonnes.toFixed(0)} t/year (${pct(removedFraction,1)})`
 ).replace(/"/g,"&quot;")}" cx="${x}" cy="${y}" r="4.8" fill="${o.color}" stroke="#fff" stroke-width="1.8"/>`;

 const anchor=i===tech.length-1?"end":i===0?"start":"middle";
 const dx=i===tech.length-1?-5:i===0?5:0;

 out+=T(
 x+dx,
 Math.max(Tp+10,y-9),
 `${o.short} · ${labelCost}`,
 8.6,
 "#4c5e66",
 anchor,
 700
 );
 });

 const peak=pts.reduce((best,d)=>d.removedTonnes>best.removedTonnes?d:best,pts[0]);
 const px=sx(peak.cost),py=syRight(peak.removedTonnes);

 out+=L(px,py,px,syRight(0),"#b7a44f",1,"4 4");

 out+=`<circle class="trade-peak" data-title="${(
 `Highest faecal-load reduction in this illustrative cost sweep: `+
 `${peak.removedTonnes.toFixed(0)} t/year (${pct(peak.removedFraction,1)}) `+
 `at about ${state.currency} ${compactTick(peak.cost)} household cost. `+
 `This is an explanatory interpolation, not a recommended technology price.`
 ).replace(/"/g,"&quot;")}" cx="${px}" cy="${py}" r="4.6" fill="#a47f00" stroke="#fff" stroke-width="1.5"/>`;

 const peakAnchor=px>W*.67?"end":"start";
 const peakDx=peakAnchor==="end"?-7:7;

 out+=T(
 px+peakDx,
 Math.max(Tp+13,py-10),
 `${peak.removedTonnes.toFixed(0)} t/yr kept out`,
 8.9,
 "#7d6500",
 peakAnchor,
 760
 );

 out+=T(
 W/2,
 H-2,
 `Household cost after current support (${state.currency})`,
 10.5,
 "#314f5d",
 "middle",
 650
 );

 out+=`<text x="16" y="${Tp+ih/2}" transform="rotate(-90 16 ${Tp+ih/2})" font-size="10.2" fill="#314f5d" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif" font-weight="650">Coverage / performance (%)</text>`;

 out+=`<text x="${W-8}" y="${Tp+ih/2}" transform="rotate(90 ${W-8} ${Tp+ih/2})" font-size="10.2" fill="#8a6d00" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif" font-weight="700">Faecal load kept out (t/year)</text>`;

 svg.innerHTML=out;

 const tip=el("tooltip");

 document.querySelectorAll(".trade-line,.trade-tech-point,.trade-peak").forEach(n=>{
 n.onmouseenter=e=>{
 tip.textContent=e.currentTarget.dataset.title;
 tip.style.display="block";
 };

 n.onmousemove=e=>{
 tip.style.left=(e.clientX+12)+"px";
 tip.style.top=(e.clientY+12)+"px";
 };

 n.onmouseleave=()=>tip.style.display="none";
 });

 el("tradeLegend").innerHTML=
 `<span><i style="background:#6268cf"></i>Coverage · left axis</span>`+
 `<span><i style="background:#96345f"></i>Technical performance · left axis</span>`+
 `<span><i style="background:#a47f00"></i><strong>Faecal load kept out · right axis</strong></span>`+
 `<span style="flex-basis:100%;margin-top:3px;font-weight:700;color:#5d6971">Faecal load kept out = coverage × performance × ${totalGeneratedTonnes.toFixed(0)} t/year generated</span>`+
 `<span style="flex-basis:100%;margin-top:1px;color:#7a858c">The performance curve simply joins the three editable technology assumptions; higher cost does not automatically imply better performance.</span>`;
}

/* ---------- LDC comparison with JMP ---------- */

function withTimeout(promise,ms=12000){
 return new Promise((resolve,reject)=>{
 const timer=setTimeout(()=>reject(new Error("Request timed out")),ms);
 promise.then(v=>{clearTimeout(timer);resolve(v)}).catch(e=>{clearTimeout(timer);reject(e)});
 });
}
async function ldcIndicator(code,dateRange){
  const codes=LDC_ISO.join(";");
  const j=await wbJsonp(
    `/country/${codes}/indicator/${code}`,
    {per_page:"5000",date:dateRange},
    20000
  );

  return Array.isArray(j)&&Array.isArray(j[1])?j[1]:[];
}
function latestMap(rows){
 const out={};
 rows.forEach(d=>{
 const iso=d?.countryiso3code;
 if(!iso || !LDC_COST_2015[iso] || d.value===null || d.value===undefined)return;
 const year=Number(d.date)||0;
 if(!out[iso] || year>out[iso].year)out[iso]={value:Number(d.value),year};
 });
 return out;
}
function median(values){
 const a=values.filter(Number.isFinite).slice().sort((x,y)=>x-y);
 if(!a.length)return null;
 const m=Math.floor(a.length/2);
 return a.length%2?a[m]:(a[m-1]+a[m])/2;
}
function ldcCosts2024(iso){
 const c=LDC_COST_2015[iso];
 if(!c)return null;

 return {
 traditional:c.traditional*COST_USD_2015_TO_2024,
 improved:((c.wetPit+c.dryPit)/2)*COST_USD_2015_TO_2024,
 septic:c.septic*COST_USD_2015_TO_2024
 };
}
function affordabilityCoverageSegment(gni,gini,costPerPerson,qStart=0,qEnd=1){
 if(
 !Number.isFinite(gni) || gni<=0 ||
 !Number.isFinite(gini) ||
 !Number.isFinite(costPerPerson) || costPerPerson<0
 )return null;

 const sigma=sigmaFromGini(gini);
 const mu=Math.log(Math.max(1,gni))-.5*sigma*sigma;
 const share=clamp(num("budgetShare")/100,.002,.5);
 const n=1000;

 let expected=0;

 for(let i=0;i<n;i++){
 const q=qStart+((i+.5)/n)*(qEnd-qStart);
 const annualPerCapita=Math.exp(mu+sigma*invNorm(q));
 const budget=annualPerCapita*share;

 expected+=financialAccessProbability(budget,costPerPerson);
 }

 return expected/n*100;
}
function affordabilityCoverage(gni,gini,costPerPerson){
 return affordabilityCoverageSegment(gni,gini,costPerPerson,0,1);
}
function poorest20Coverage(gni,gini,costPerPerson){
 return affordabilityCoverageSegment(gni,gini,costPerPerson,0,.20);
}

function theoreticalTechnologyMix(gni,gini,costs,qStart=0,qEnd=1){
 if(
 !Number.isFinite(gni) || gni<=0 ||
 !Number.isFinite(gini) ||
 !costs ||
 !["traditional","improved","septic"].every(k=>Number.isFinite(costs[k]))
 )return null;

 const sigma=sigmaFromGini(gini);
 const mu=Math.log(Math.max(1,gni))-.5*sigma*sigma;
 const share=clamp(num("budgetShare")/100,.002,.5);
 const n=1000;
 const count={none:0,traditional:0,improved:0,septic:0};

 for(let i=0;i<n;i++){
 const q=qStart+((i+.5)/n)*(qEnd-qStart);
 const annualPerCapita=Math.exp(mu+sigma*invNorm(q));
 const budget=annualPerCapita*share;
 const u=clamp(rand(i,67),1e-6,1-1e-6);

 if(financialAccessProbability(budget,costs.septic)>=u)count.septic++;
 else if(financialAccessProbability(budget,costs.improved)>=u)count.improved++;
 else if(financialAccessProbability(budget,costs.traditional)>=u)count.traditional++;
 else count.none++;
 }

 const out={
 none:count.none/n*100,
 traditional:count.traditional/n*100,
 improved:count.improved/n*100,
 septic:count.septic/n*100
 };

 out.any=100-out.none;
 out.meanTier=(out.traditional+2*out.improved+3*out.septic)/100;

 return out;
}

function mixForLdcRow(r,qStart=0,qEnd=1){
 return theoreticalTechnologyMix(r.gni,r.gini,r.costs,qStart,qEnd);
}

function filteredLdcRowsForMix(rows=state.globalRows){
 const q=(el("globalSearch").value||"").trim().toLowerCase();

 return rows.filter(r=>{
 if(q && !r.country.toLowerCase().includes(q) && !r.iso3.toLowerCase().includes(q))return false;
 return !!mixForLdcRow(r);
 });
}

function buildLdcRows(){
 if(!state.globalLoaded||!state.globalRaw)return [];

 const {gni,gdp,gini,od,basic}=state.globalRaw;
 const ldcGiniMedian=median(LDC_ISO.map(iso=>gini[iso]?.value).filter(Number.isFinite));

 return LDC_ISO.map(iso=>{
 const cost=LDC_COST_2015[iso];
 const incomeRec=gni[iso]||gdp[iso];
 const giniRec=gini[iso];
 const giniValue=Number.isFinite(giniRec?.value)?giniRec.value:ldcGiniMedian;
 const costs=ldcCosts2024(iso);

 return {
 iso3:iso,
 country:cost.name,
 gni:incomeRec?.value??null,
 gniYear:incomeRec?.year??null,
 gini:giniValue,
 giniYear:giniRec?.year??null,
 giniImputed:!Number.isFinite(giniRec?.value),
 costs,
 modelTraditional:affordabilityCoverage(incomeRec?.value,giniValue,costs?.traditional),
 modelTraditionalPoor20:poorest20Coverage(incomeRec?.value,giniValue,costs?.traditional),
 modelImproved:affordabilityCoverage(incomeRec?.value,giniValue,costs?.improved),
 modelImprovedPoor20:poorest20Coverage(incomeRec?.value,giniValue,costs?.improved),
 traditionalCostBurden:Number.isFinite(incomeRec?.value)&&incomeRec.value>0?costs.traditional/incomeRec.value*100:null,
 improvedCostBurden:Number.isFinite(incomeRec?.value)&&incomeRec.value>0?costs.improved/incomeRec.value*100:null,
 jmpNonOD:Number.isFinite(od[iso]?.value)?100-od[iso].value:null,
 jmpBasic:Number.isFinite(basic[iso]?.value)?basic[iso].value:null
 };
 });
}
const GLOBAL_METRICS={
 nonod:{
 label:"Traditional pit financial access vs JMP not practising open defecation",
 title:"Modelled traditional-pit financial access vs JMP population not practising open defecation",
 note:"The model asks what share of the stylised income distribution could mobilise the published country-specific traditional-pit capital cost.",
 xLabel:"Modelled affordable coverage: traditional pit (%)",
 yLabel:"JMP 2024: not practising open defecation (%)",
 model:r=>r.modelTraditional,
 poor20:r=>r.modelTraditionalPoor20,
 burden:r=>r.traditionalCostBurden,
 cost:r=>r.costs?.traditional,
 jmp:r=>r.jmpNonOD
 },
 basic:{
 label:"Improved pit financial access vs JMP at least basic",
 title:"Modelled improved-pit financial access vs JMP at least basic sanitation",
 note:"The improved-pit cost is a proxy formed from the World Bank rural wet-pit and dry-pit estimates. JMP basic additionally requires an improved facility that is not shared.",
 xLabel:"Modelled affordable coverage: improved pit proxy (%)",
 yLabel:"JMP 2024: at least basic sanitation (%)",
 model:r=>r.modelImproved,
 poor20:r=>r.modelImprovedPoor20,
 burden:r=>r.improvedCostBurden,
 cost:r=>r.costs?.improved,
 jmp:r=>r.jmpBasic
 }
};
function pairedRows(metricKey,rows=state.globalRows){
 const m=GLOBAL_METRICS[metricKey];
 return rows.map(r=>({...r,modelValue:m.model(r),jmpValue:m.jmp(r)}))
 .filter(r=>Number.isFinite(r.modelValue)&&Number.isFinite(r.jmpValue));
}
function pearsonArrays(x,y){
 const n=Math.min(x.length,y.length);
 if(n<2)return null;

 const mx=x.reduce((s,v)=>s+v,0)/n;
 const my=y.reduce((s,v)=>s+v,0)/n;

 let cov=0,vx=0,vy=0;

 for(let i=0;i<n;i++){
 const dx=x[i]-mx;
 const dy=y[i]-my;
 cov+=dx*dy;
 vx+=dx*dx;
 vy+=dy*dy;
 }

 return (vx>0&&vy>0)?cov/Math.sqrt(vx*vy):null;
}
function ranks(values){
 const indexed=values.map((v,i)=>({v,i})).sort((a,b)=>a.v-b.v);
 const out=new Array(values.length);

 for(let i=0;i<indexed.length;){
 let j=i+1;
 while(j<indexed.length && indexed[j].v===indexed[i].v)j++;

 const avg=(i+j-1)/2+1;
 for(let k=i;k<j;k++)out[indexed[k].i]=avg;

 i=j;
 }

 return out;
}
function medianSimple(values){
 const a=values.filter(Number.isFinite).slice().sort((a,b)=>a-b);
 if(!a.length)return null;
 const m=Math.floor(a.length/2);
 return a.length%2?a[m]:(a[m-1]+a[m])/2;
}
function partialCorrelation(rxy,rxz,ryz){
 if(![rxy,rxz,ryz].every(Number.isFinite))return null;
 const den=Math.sqrt((1-rxz*rxz)*(1-ryz*ryz));
 if(!Number.isFinite(den)||den<=0)return null;
 return (rxy-rxz*ryz)/den;
}
function statsForPairs(pairs){
 const n=pairs.length;

 if(n<2)return {
 n,r:null,r2:null,mae:null,spearman:null,medianBias:null,
 within10:null,incomeR:null,partialR:null
 };

 const model=pairs.map(p=>p.modelValue);
 const jmp=pairs.map(p=>p.jmpValue);
 const gaps=pairs.map(p=>p.modelValue-p.jmpValue);

 const r=pearsonArrays(model,jmp);
 const spearman=pearsonArrays(ranks(model),ranks(jmp));
 const mae=gaps.reduce((s,g)=>s+Math.abs(g),0)/n;
 const medianBias=medianSimple(gaps);
 const within10=gaps.filter(g=>Math.abs(g)<=10).length/n;

 const incomePairs=pairs.filter(p=>Number.isFinite(p.gni)&&p.gni>0);
 let incomeR=null;
 let partialR=null;

 if(incomePairs.length>=3){
 const m=incomePairs.map(p=>p.modelValue);
 const y=incomePairs.map(p=>p.jmpValue);
 const z=incomePairs.map(p=>Math.log(p.gni));

 const rxy=pearsonArrays(m,y);
 const rxz=pearsonArrays(m,z);
 const ryz=pearsonArrays(y,z);

 incomeR=ryz;
 partialR=partialCorrelation(rxy,rxz,ryz);
 }

 return {
 n,
 r,
 r2:Number.isFinite(r)?r*r:null,
 mae,
 spearman,
 medianBias,
 within10,
 incomeR,
 partialR
 };
}
function fmtStat(v,d=2){
 return Number.isFinite(v)?v.toFixed(d):"—"
}
function renderMetricSummary(){
 const selected=el("globalMetric").value;
 const body=el("metricSummary").querySelector("tbody");

 body.innerHTML=Object.entries(GLOBAL_METRICS).map(([key,m])=>{
 const s=statsForPairs(pairedRows(key));

 return `<tr class="${key===selected?"selected":""}" data-metric-row="${key}">
 <td>${m.label}</td>
 <td>${s.n}</td>
 <td>${fmtStat(s.r,2)}</td>
 <td>${fmtStat(s.r2,2)}</td>
 <td>${Number.isFinite(s.mae)?s.mae.toFixed(1)+" pp":"—"}</td>
 </tr>`;
 }).join("");

 document.querySelectorAll("[data-metric-row]").forEach(tr=>tr.onclick=()=>{
 el("globalMetric").value=tr.dataset.metricRow;
 updateGlobalComparison();
 });
}
function renderGlobalScatter(metricKey,rows){
 const svg=el("globalScatter");
 const W=760,H=520,Lf=66,R=24,Tp=22,B=52,iw=W-Lf-R,ih=H-Tp-B;
 const sx=v=>Lf+clamp(v,0,100)/100*iw;
 const sy=v=>Tp+(100-clamp(v,0,100))/100*ih;

 let out=`<rect width="${W}" height="${H}" fill="#fff"/>`;

 [0,20,40,60,80,100].forEach(v=>{
 out+=L(sx(v),Tp,sx(v),Tp+ih,"#dbe3e6",1);
 out+=L(Lf,sy(v),W-R,sy(v),"#dbe3e6",1);
 out+=T(sx(v),H-23,v+"%",9,"#536973");
 out+=T(Lf-8,sy(v)+3,v+"%",9,"#536973","end");
 });

 out+=L(sx(0),sy(0),sx(100),sy(100),"#8ea0a8",1.5,"5 5");

 rows.forEach(r=>{
 const x=sx(r.modelValue);
 const y=sy(r.jmpValue);
 const isMalawi=r.iso3==="MWI";
 const title=
 `${r.country} · model ${r.modelValue.toFixed(1)}% · JMP ${r.jmpValue.toFixed(1)}% · gap ${(r.modelValue-r.jmpValue).toFixed(1)} pp`;

 out+=`<circle class="global-point" data-title="${title.replace(/"/g,"&quot;")}"
 cx="${x}" cy="${y}" r="${isMalawi?6:4}"
 fill="${isMalawi?"#173d57":"#39a6c8"}" fill-opacity=".80"
 stroke="#fff" stroke-width="${isMalawi?2:1}"/>`;

 if(isMalawi)out+=T(x+8,y-7,"Malawi",9,"#173d57","start",700);
 });

 const metric=GLOBAL_METRICS[metricKey];

 out+=T(W/2,H-3,metric.xLabel,10.5,"#314f5d","middle",650);
 out+=`<text x="14" y="${Tp+ih/2}" transform="rotate(-90 14 ${Tp+ih/2})" font-size="10.5"
 fill="#314f5d" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif" font-weight="650">${metric.yLabel}</text>`;

 svg.innerHTML=out;

 const tip=el("tooltip");
 document.querySelectorAll(".global-point").forEach(n=>{
 n.onmouseenter=e=>{tip.textContent=e.currentTarget.dataset.title;tip.style.display="block"};
 n.onmousemove=e=>{tip.style.left=e.clientX+12+"px";tip.style.top=e.clientY+12+"px"};
 n.onmouseleave=()=>tip.style.display="none";
 });

 el("globalScatterLegend").innerHTML=
 `<span><i style="background:#39a6c8"></i>UN LDC</span><span><i style="background:#173d57"></i>Malawi</span>`;
}
function filteredGlobalPairs(metricKey,rows){
 const q=(el("globalSearch").value||"").trim().toLowerCase();
 let pairs=pairedRows(metricKey,rows);

 if(q){
 pairs=pairs.filter(r=>r.country.toLowerCase().includes(q)||r.iso3.toLowerCase().includes(q));
 }

 return pairs.map(r=>({...r,gap:r.modelValue-r.jmpValue}));
}

function globalSortValue(r,key){
 if(key==="country")return r.country.toLowerCase();
 if(key==="gni")return r.gni;
 if(key==="gini")return r.gini;
 if(key==="traditional")return r.costs?.traditional;
 if(key==="improved")return r.costs?.improved;
 if(key==="septic")return r.costs?.septic;
 if(key==="model")return r.modelValue;
 if(key==="jmp")return r.jmpValue;
 if(key==="gap")return r.gap;
 return null;
}

function sortedGlobalPairs(metricKey,rows){
 const pairs=filteredGlobalPairs(metricKey,rows);
 const {key,dir}=state.globalTableSort;
 const sign=dir==="asc"?1:-1;

 pairs.sort((a,b)=>{
 const av=globalSortValue(a,key);
 const bv=globalSortValue(b,key);

 if(av===null||av===undefined||Number.isNaN(av))return 1;
 if(bv===null||bv===undefined||Number.isNaN(bv))return -1;

 if(typeof av==="string"){
 const c=av.localeCompare(bv);
 return c!==0?sign*c:a.country.localeCompare(b.country);
 }

 if(av===bv)return a.country.localeCompare(b.country);
 return sign*(av-bv);
 });

 return pairs;
}

function updateGlobalSortHeaders(){
 document.querySelectorAll("#countryComparisonTable th.sortable").forEach(th=>{
 th.classList.remove("sort-asc","sort-desc");

 if(th.dataset.sort===state.globalTableSort.key){
 th.classList.add(state.globalTableSort.dir==="asc"?"sort-asc":"sort-desc");
 }
 });
}

function renderGlobalTable(metricKey,rows){
 const pairs=sortedGlobalPairs(metricKey,rows);
 const body=el("countryComparisonTable").querySelector("tbody");

 body.innerHTML=pairs.map(r=>`<tr class="${r.iso3==="MWI"?"malawi":""}">
 <td>${r.country}</td>
 <td class="num">${Number.isFinite(r.gni)?"$"+Math.round(r.gni).toLocaleString():"—"}</td>
 <td class="num ${r.giniImputed?"imputed":""}">${Number.isFinite(r.gini)?r.gini.toFixed(1)+(r.giniImputed?"*":""):"—"}</td>
 <td class="num">$${r.costs.traditional.toFixed(1)}</td>
 <td class="num">$${r.costs.improved.toFixed(1)}</td>
 <td class="num">$${r.costs.septic.toFixed(1)}</td>
 <td class="num">${r.modelValue.toFixed(1)}%</td>
 <td class="num">${r.jmpValue.toFixed(1)}%</td>
 <td class="num">${r.gap>=0?"+":""}${r.gap.toFixed(1)} pp</td>
 <td class="jmp-link-cell">${
 hasJmpInequality(r.iso3)
 ?`<a href="${jmpInequalityUrl(r.iso3)}" target="_blank" rel="noopener">Observed equity ↗</a>`
 :"—"
 }</td>
 </tr>`).join("") || `<tr><td colspan="10">No matching LDCs with paired data.</td></tr>`;

 updateGlobalSortHeaders();

 const s=statsForPairs(pairedRows(metricKey,rows));
 el("globalStats").textContent=
 `${pairs.length} shown · ${s.n} paired LDCs · r ${fmtStat(s.r,2)} · R² ${fmtStat(s.r2,2)} · MAE ${Number.isFinite(s.mae)?s.mae.toFixed(1)+" pp":"—"}`;
}

function exportComparisonTableCsv(){
 console.info("File export is disabled in the Defender-friendly build.");
}
function renderDiagnostics(metricKey,rows){
 const pairs=pairedRows(metricKey,rows);
 const s=statsForPairs(pairs);

 el("diagPearson").textContent=fmtStat(s.r,2);
 el("diagSpearman").textContent=fmtStat(s.spearman,2);
 el("diagMae").textContent=Number.isFinite(s.mae)?s.mae.toFixed(1)+" pp":"—";
 el("diagBias").textContent=Number.isFinite(s.medianBias)
 ? (s.medianBias>=0?"+":"")+s.medianBias.toFixed(1)+" pp"
 : "—";
 el("diagWithin10").textContent=Number.isFinite(s.within10)?pct(s.within10,0):"—";
 el("diagIncomeR").textContent=fmtStat(s.incomeR,2);
 el("diagPartial").textContent=fmtStat(s.partialR,2);

 let verdict="Not enough paired observations.";
 let explanation="";

 if(s.n>=5){
 const absR=Math.abs(s.r||0);
 const absPartial=Math.abs(s.partialR||0);

 if(absR>=.7)verdict="Strong cross-country association.";
 else if(absR>=.5)verdict="Moderate cross-country association.";
 else if(absR>=.3)verdict="Weak-to-moderate association.";
 else verdict="Weak cross-country association.";

 if(Number.isFinite(s.incomeR) && Number.isFinite(s.r)){
 if(Math.abs(s.r)>Math.abs(s.incomeR)+.10){
 explanation+=`The financial-access model correlates with JMP more strongly than log GNI alone (${s.r.toFixed(2)} vs ${s.incomeR.toFixed(2)}). `;
 }else if(Math.abs(s.incomeR)>Math.abs(s.r)+.10){
 explanation+=`Log GNI alone correlates with JMP more strongly than the financial-access model (${s.incomeR.toFixed(2)} vs ${s.r.toFixed(2)}), so the additional model structure is not clearly improving explanatory power. `;
 }else{
 explanation+=`The financial-access model and log GNI have similar correlation with JMP (${s.r.toFixed(2)} vs ${s.incomeR.toFixed(2)}). `;
 }
 }

 if(Number.isFinite(s.partialR)){
 if(absPartial>=.4){
 explanation+=`A meaningful association remains after controlling for log GNI (partial r ${s.partialR.toFixed(2)}). `;
 }else if(absPartial>=.2){
 explanation+=`Only a modest association remains after controlling for log GNI (partial r ${s.partialR.toFixed(2)}). `;
 }else{
 explanation+=`Little independent association remains after controlling for log GNI (partial r ${s.partialR.toFixed(2)}). `;
 }
 }

 if(Number.isFinite(s.medianBias)){
 explanation+=`Median bias is ${(s.medianBias>=0?"+":"")+s.medianBias.toFixed(1)} percentage points, and ${pct(s.within10||0,0)} of paired LDCs fall within ±10 percentage points.`;
 }
 }

 el("diagnosticVerdict").textContent=verdict;
 el("diagnosticText").textContent=explanation;
}
function currentGlobalExportRows(){
 const key=el("globalMetric").value;
 const q=(el("globalSearch").value||"").trim().toLowerCase();
 let rows=pairedRows(key,state.globalRows);

 if(q){
 rows=rows.filter(r=>r.country.toLowerCase().includes(q)||r.iso3.toLowerCase().includes(q));
 }

 return rows;
}
function csvEscape(v){
 const s=String(v??"");
 return /[",\n]/.test(s)?`"${s.replace(/"/g,'""')}"`:s;
}
function exportGlobalCsv(){
 console.info("File export is disabled in the Defender-friendly build.");
}
function exportGlobalPng(){
 console.info("File export is disabled in the Defender-friendly build.");
}

function renderEquityScatter(metricKey,rows){
 const svg=el("equityScatter");
 const metric=GLOBAL_METRICS[metricKey];

 const displayed=rows.map(r=>({
 ...r,
 overall:metric.model(r),
 poor20:metric.poor20(r)
 })).filter(r=>Number.isFinite(r.overall)&&Number.isFinite(r.poor20))
 .map(r=>({...r,gap:r.overall-r.poor20}))
 .sort((a,b)=>b.gap-a.gap || a.country.localeCompare(b.country));

 const W=920,rowH=23,Tp=28,B=52,Lf=190,R=48;
 const H=Math.max(460,Tp+B+displayed.length*rowH);
 const iw=W-Lf-R;
 const sx=v=>Lf+clamp(v,0,100)/100*iw;

 svg.setAttribute("viewBox",`0 0 ${W} ${H}`);
 svg.style.height=Math.max(520,Math.round(H*.92))+"px";

 if(el("equityGapStatus")){
 el("equityGapStatus").textContent=
 `${displayed.length} of ${LDC_ISO.length} current UN LDCs shown. Countries are omitted only where the income/inequality inputs needed for the financial-access calculation are unavailable.`;
 }

 let out=`<rect width="${W}" height="${H}" fill="#fff"/>`;

 [0,20,40,60,80,100].forEach(v=>{
 const x=sx(v);
 out+=L(x,Tp,x,H-B,"#dbe3e6",1);
 out+=T(x,H-20,v+"%",9,"#536973");
 });

 displayed.forEach((r,i)=>{
 const y=Tp+rowH*(i+.5);
 const xPoor=sx(r.poor20);
 const xAll=sx(r.overall);
 const isMalawi=r.iso3==="MWI";
 const lineColor=isMalawi?"#173d57":"#a9bac1";

 const label=r.country.length>31?r.country.slice(0,29)+"…":r.country;

 out+=T(
 Lf-12,
 y+3,
 label,
 8.7,
 isMalawi?"#173d57":"#405963",
 "end",
 isMalawi?700:500
 );

 out+=L(xPoor,y,xAll,y,lineColor,isMalawi?3:2);

 const poorTitle=
 `${r.country} · poorest 20% affordable coverage ${r.poor20.toFixed(1)}%`;
 const allTitle=
 `${r.country} · all-household financial access ${r.overall.toFixed(1)}% · financial-access gap ${r.gap.toFixed(1)} pp`;

 out+=`<circle class="extra-global-point" data-title="${poorTitle.replace(/"/g,"&quot;")}"
 cx="${xPoor}" cy="${y}" r="${isMalawi?5.3:4.1}" fill="#d7ae3b"
 stroke="#fff" stroke-width="1.2"/>`;

 out+=`<circle class="extra-global-point" data-title="${allTitle.replace(/"/g,"&quot;")}"
 cx="${xAll}" cy="${y}" r="${isMalawi?6.1:4.7}" fill="${isMalawi?"#173d57":"#39a6c8"}"
 stroke="#fff" stroke-width="1.2"/>`;

 if(r.gap>=8){
 out+=T(
 Math.min(W-R-1,xAll+7),
 y+3,
 r.gap.toFixed(0)+" pp",
 7.8,
 isMalawi?"#173d57":"#60747d",
 "start",
 isMalawi?700:500
 )
 }
 });

 out+=T(W/2,H-3,"Modelled affordable coverage (%)",10.5,"#314f5d","middle",650);

 svg.innerHTML=out;
}
function renderCostAccessScatter(metricKey,rows){
 const svg=el("costAccessScatter");
 const metric=GLOBAL_METRICS[metricKey];

 const pts=rows.map(r=>({
 ...r,
 burden:metric.burden(r),
 jmp:metric.jmp(r)
 })).filter(r=>Number.isFinite(r.burden)&&r.burden>0&&Number.isFinite(r.jmp));

 if(!pts.length){
 svg.innerHTML=T(310,190,"No paired cost/access data",11,"#536973");
 return;
 }

 const W=620,H=400,Lf=68,R=22,Tp=18,B=50,iw=W-Lf-R,ih=H-Tp-B;
 const minBurden=Math.max(.05,Math.min(...pts.map(p=>p.burden))*.8);
 const maxBurden=Math.max(minBurden*2,Math.max(...pts.map(p=>p.burden))*1.2);

 const lmin=Math.log10(minBurden),lmax=Math.log10(maxBurden);
 const sx=v=>Lf+(Math.log10(v)-lmin)/(lmax-lmin)*iw;
 const sy=v=>Tp+(100-clamp(v,0,100))/100*ih;

 const ticks=[.05,.1,.2,.5,1,2,5,10,20,50,100,200,500]
 .filter(v=>v>=minBurden&&v<=maxBurden);

 let out=`<rect width="${W}" height="${H}" fill="#fff"/>`;

 ticks.forEach(v=>{
 out+=L(sx(v),Tp,sx(v),Tp+ih,"#dbe3e6",1);
 out+=T(sx(v),H-19,(v<1?v.toFixed(1):Math.round(v))+"%",8.5,"#536973")
 });

 [0,20,40,60,80,100].forEach(v=>{
 out+=L(Lf,sy(v),W-R,sy(v),"#dbe3e6",1);
 out+=T(Lf-7,sy(v)+3,v+"%",9,"#536973","end")
 });

 pts.forEach(r=>{
 const x=sx(r.burden),y=sy(r.jmp);
 const malawi=r.iso3==="MWI";
 const title=
 `${r.country} · technology cost ${r.burden.toFixed(1)}% of GNI/capita · JMP ${r.jmp.toFixed(1)}%`;

 out+=`<circle class="extra-global-point" data-title="${title.replace(/"/g,"&quot;")}"
 cx="${x}" cy="${y}" r="${malawi?6:4}" fill="${malawi?"#173d57":"#d7ae3b"}"
 fill-opacity=".80" stroke="#fff" stroke-width="${malawi?2:1}"/>`;

 if(malawi)out+=T(x+8,y-7,"Malawi",9,"#173d57","start",700);
 });

 out+=T(W/2,H-2,"Published capital cost / GNI per capita (%) · log scale",10.2,"#314f5d","middle",650);
 out+=`<text x="14" y="${Tp+ih/2}" transform="rotate(-90 14 ${Tp+ih/2})"
 font-size="10.5" fill="#314f5d" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
 font-weight="650">${metric.yLabel}</text>`;

 svg.innerHTML=out;
}

function quantile(values,q){
 const a=values.filter(Number.isFinite).slice().sort((x,y)=>x-y);
 if(!a.length)return null;

 const pos=(a.length-1)*q;
 const lo=Math.floor(pos),hi=Math.ceil(pos);

 if(lo===hi)return a[lo];

 return a[lo]+(a[hi]-a[lo])*(pos-lo);
}

function initJmpValidationControls(){
 const select=el("validationCountry");
 if(!select)return;

 const entries=Object.entries(JMP_BENCHMARK.countries)
 .sort((a,b)=>a[1].country.localeCompare(b[1].country));

 select.innerHTML=entries
 .map(([iso,d])=>`<option value="${iso}" ${iso==="MWI"?"selected":""}>${d.country}</option>`)
 .join("");

 renderJmpValidation();
}

function renderJmpValidation(){
 const countryEl=el("validationCountry");
 const metricEl=el("validationMetric");
 const svg=el("validationQuintileChart");

 if(!countryEl || !metricEl || !svg)return;

 const iso=countryEl.value || "MWI";
 const metric=metricEl.value || "basic";
 const d=JMP_BENCHMARK.countries[iso];

 if(!d)return;

 const series=d[metric];
 const obs=series.observed;
 const mod=series.modelled;

 const W=720,H=330,Lf=54,R=20,Tp=24,B=46,iw=W-Lf-R,ih=H-Tp-B;
 const sx=i=>Lf+(i+.5)/5*iw;
 const sy=v=>Tp+(100-clamp(v,0,100))/100*ih;

 let out=`<rect width="${W}" height="${H}" fill="#fff"/>`;

 [0,25,50,75,100].forEach(v=>{
 const y=sy(v);

 out+=L(Lf,y,W-R,y,"#e3e8eb",1);
 out+=T(Lf-7,y+3,v+"%",9,"#6a7980","end");
 });

 for(let i=0;i<5;i++){
 out+=T(sx(i),H-18,`Q${i+1}`,9.5,"#536973","middle",700);
 }

 const linePath=(vals)=>vals
 .map((v,i)=>`${i?"L":"M"}${sx(i).toFixed(1)} ${sy(v).toFixed(1)}`)
 .join(" ");

 out+=`<path d="${linePath(obs)}" fill="none" stroke="#173d57" stroke-width="2.2"/>`;
 out+=`<path d="${linePath(mod)}" fill="none" stroke="#d39467" stroke-width="2.2" stroke-dasharray="5 4"/>`;

 obs.forEach((v,i)=>{
 out+=`<circle cx="${sx(i)}" cy="${sy(v)}" r="5.2" fill="#173d57"><title>JMP observed Q${i+1}: ${v.toFixed(1)}%</title></circle>`;
 });

 mod.forEach((v,i)=>{
 out+=`<rect x="${sx(i)-4.5}" y="${sy(v)-4.5}" width="9" height="9" rx="1" fill="#d39467"><title>Modelled Q${i+1}: ${v.toFixed(1)}%</title></rect>`;
 });

 out+=T(W/2,H-2,"Poorest → richest wealth quintile",10,"#314f5d","middle",650);

 svg.innerHTML=out;

 const errors=obs.map((v,i)=>Math.abs(mod[i]-v));
 const countryMae=errors.reduce((a,b)=>a+b,0)/errors.length;
 const obsGap=obs[4]-obs[0];
 const modGap=mod[4]-mod[0];

 el("validationSurvey").textContent=
 `${d.year}${d.basicReconstructed && metric==="basic"?" · basic reconstructed from JMP ladder":""}`;

 el("validationCountryMae").textContent=`${countryMae.toFixed(1)} pp`;
 el("validationObservedGap").textContent=`${obsGap>=0?"+":""}${obsGap.toFixed(1)} pp`;
 el("validationModelGap").textContent=`${modGap>=0?"+":""}${modGap.toFixed(1)} pp`;
 el("validationPooledMae").textContent=`${JMP_BENCHMARK.summary.mae.toFixed(1)} pp`;
 el("validationCvMae").textContent=JMP_BENCHMARK.summary.pearsonR.toFixed(2);

 let interpretation="";

 if(Math.abs(modGap-obsGap)<=10){
 interpretation="The independent economic scenario produces a similar poorest-to-richest gradient here, although absolute sanitation levels may still differ.";
 }else if(Math.abs(modGap)>Math.abs(obsGap)+10){
 interpretation="The economic scenario produces a steeper wealth gradient than JMP observes here. This suggests that non-price factors or the simplified resource distribution matter.";
 }else{
 interpretation="JMP observes a steeper wealth gradient than the economic scenario produces here. Financial access alone does not explain the observed inequality.";
 }

 if(countryMae>30){
 interpretation+=" The gap is large, which is useful evidence that affordability is only one part of observed sanitation access.";
 }

 el("validationInterpretation").textContent=interpretation;

 const link=el("jmpIneqCountryLink");
 if(link){
 link.href=jmpInequalityUrl(iso);
 link.textContent=`${d.country}: JMP inequalities ↗`;
 }
}

function renderJmpInequalityLinks(rows=state.globalRows){
 const available=LDC_ISO.filter(hasJmpInequality);
 const q=(el("globalSearch").value||"").trim().toLowerCase();

 const matches=q
 ?rows.filter(r=>r.country.toLowerCase().includes(q)||r.iso3.toLowerCase().includes(q))
 :[];

 const link=el("jmpIneqCountryLink");
 const hint=el("ldcJmpObservedHint");

 if(matches.length===1){
 const r=matches[0];

 if(hasJmpInequality(r.iso3)){
 link.href=jmpInequalityUrl(r.iso3);
 link.textContent=`${r.country}: JMP observed inequalities ↗`;

 hint.innerHTML=
 `The bars above are synthetic financial-access estimates. <a href="${jmpInequalityUrl(r.iso3)}" target="_blank" rel="noopener">Open the JMP wealth-quintile workbook for ${r.country}</a> to compare against observed survey-based sanitation inequalities.`;
 }else{
 link.href="https://washdata.org/data/downloads#WLD";
 link.textContent=`${r.country}: no JMP inequality file listed`;

 hint.textContent=
 `JMP currently does not list a country inequality workbook for ${r.country}. The theoretical quintile view should therefore be treated as model-only.`;
 }
 }else{
 link.href=jmpInequalityUrl("MWI");
 link.textContent="Malawi JMP inequalities ↗";

 hint.innerHTML=
 `Search for one country to reveal its JMP inequality workbook where available. Malawi is a useful example: <a href="${jmpInequalityUrl("MWI")}" target="_blank" rel="noopener">open the Malawi observed inequalities file</a>.`;
 }

 el("jmpIneqCoverage").textContent=
 `${available.length} of ${LDC_ISO.length} LDCs in this comparison currently have an Inequalities download listed by JMP.`;
}

function renderLdcTechnologyMix(rows=state.globalRows){
 const svg=el("ldcMixChart");
 if(!svg)return;

 const data=filteredLdcRowsForMix(rows)
 .map(r=>({...r,mix:mixForLdcRow(r)}))
 .filter(r=>r.mix)
 .sort((a,b)=>b.mix.none-a.mix.none || a.country.localeCompare(b.country));

 const W=920;
 const Lf=150,R=42,Tp=34,B=40,rowH=23;
 const H=Math.max(180,Tp+B+data.length*rowH);
 const iw=W-Lf-R;
 const sx=v=>Lf+clamp(v,0,100)/100*iw;

 svg.setAttribute("viewBox",`0 0 ${W} ${H}`);

 const colors={
 none:"#7c878d",
 traditional:"#d39467",
 improved:"#6d9aa6",
 septic:"#5c7f68"
 };

 let out=`<rect width="${W}" height="${H}" fill="#fff"/>`;

 [0,25,50,75,100].forEach(v=>{
 out+=L(sx(v),Tp-8,sx(v),H-B+3,"#e1e7ea",1);
 out+=T(sx(v),18,v+"%",8.5,"#667980");
 });

 data.forEach((r,i)=>{
 const y=Tp+i*rowH;
 const h=14;
 const m=r.mix;
 const title=
 `${r.country} · no toilet ${m.none.toFixed(1)}% · traditional ${m.traditional.toFixed(1)}% · `+
 `improved ${m.improved.toFixed(1)}% · septic ${m.septic.toFixed(1)}%`;

 out+=T(Lf-9,y+10,r.country,8.7,r.iso3==="MWI"?"#173d57":"#405761","end",r.iso3==="MWI"?700:500);

 let x=Lf;
 ["none","traditional","improved","septic"].forEach(k=>{
 const w=iw*m[k]/100;
 if(w>0){
 out+=`<rect class="ldc-mix-segment" data-title="${title.replace(/"/g,"&quot;")}"
 x="${x}" y="${y}" width="${Math.max(.5,w)}" height="${h}"
 fill="${colors[k]}" stroke="#fff" stroke-width=".45"/>`;
 }
 x+=w;
 });

 if(r.iso3==="MWI"){
 out+=`<rect x="${Lf}" y="${y-1}" width="${iw}" height="${h+2}" fill="none" stroke="#173d57" stroke-width="1.4"/>`;
 }
 });

 out+=T(Lf+iw/2,H-8,"Share of theoretical population (%)",9.5,"#314f5d","middle",650);
 svg.innerHTML=out;

 const tip=el("tooltip");
 svg.querySelectorAll(".ldc-mix-segment").forEach(n=>{
 n.onmouseenter=e=>{tip.textContent=e.currentTarget.dataset.title;tip.style.display="block"};
 n.onmousemove=e=>{tip.style.left=e.clientX+12+"px";tip.style.top=e.clientY+12+"px"};
 n.onmouseleave=()=>tip.style.display="none";
 });

 const allMix=data.map(d=>d.mix);
 const avg=k=>allMix.length?allMix.reduce((s,m)=>s+m[k],0)/allMix.length:null;

 el("ldcMixSummary").textContent=
 data.length
 ?`${data.length} LDCs shown · equal-country mean: ${avg("none").toFixed(0)}% no toilet, ${avg("traditional").toFixed(0)}% traditional, ${avg("improved").toFixed(0)}% improved, ${avg("septic").toFixed(0)}% septic`
 :"No LDCs match the current search";
}

function renderLdcEquityMix(rows=state.globalRows){
 const svg=el("ldcEquityMixChart");
 if(!svg)return;

 const countryRows=filteredLdcRowsForMix(rows);
 const quintiles=Array.from({length:5},(_,i)=>{
 const mixes=countryRows
 .map(r=>mixForLdcRow(r,i*.2,(i+1)*.2))
 .filter(Boolean);

 const avg=k=>mixes.length
 ?mixes.reduce((s,m)=>s+m[k],0)/mixes.length
 :0;

 return {
 q:i+1,
 none:avg("none"),
 traditional:avg("traditional"),
 improved:avg("improved"),
 septic:avg("septic")
 };
 });

 const W=620,H=360,Lf=72,R=26,Tp=32,B=48,iw=W-Lf-R;
 const sx=v=>Lf+clamp(v,0,100)/100*iw;
 const colors={
 none:"#7c878d",
 traditional:"#d39467",
 improved:"#6d9aa6",
 septic:"#5c7f68"
 };

 let out=`<rect width="${W}" height="${H}" fill="#fff"/>`;

 [0,25,50,75,100].forEach(v=>{
 out+=L(sx(v),Tp,sx(v),H-B,"#e1e7ea",1);
 out+=T(sx(v),H-20,v+"%",8.5,"#667980");
 });

 quintiles.forEach((m,i)=>{
 const y=Tp+18+i*54;
 const h=28;

 out+=T(Lf-12,y+18,`Q${m.q}`,10,"#405761","end",700);

 let x=Lf;
 ["none","traditional","improved","septic"].forEach(k=>{
 const w=iw*m[k]/100;
 const title=
 `Q${m.q} · no toilet ${m.none.toFixed(1)}% · traditional ${m.traditional.toFixed(1)}% · `+
 `improved ${m.improved.toFixed(1)}% · septic ${m.septic.toFixed(1)}%`;

 if(w>0){
 out+=`<rect class="ldc-equity-mix-segment" data-title="${title.replace(/"/g,"&quot;")}"
 x="${x}" y="${y}" width="${Math.max(.5,w)}" height="${h}"
 fill="${colors[k]}" stroke="#fff" stroke-width=".6"/>`;
 }
 x+=w;
 });
 });

 out+=T(Lf+iw/2,H-3,"Equal-weighted theoretical population mix across LDCs",9.5,"#314f5d","middle",650);
 svg.innerHTML=out;

 const tip=el("tooltip");
 svg.querySelectorAll(".ldc-equity-mix-segment").forEach(n=>{
 n.onmouseenter=e=>{tip.textContent=e.currentTarget.dataset.title;tip.style.display="block"};
 n.onmousemove=e=>{tip.style.left=e.clientX+12+"px";tip.style.top=e.clientY+12+"px"};
 n.onmouseleave=()=>tip.style.display="none";
 });

 const q1=quintiles[0],q5=quintiles[4];
 const q1Any=100-q1.none,q5Any=100-q5.none;

 el("ldcEquityMixNote").innerHTML=
 countryRows.length
 ?`In the theoretical financial-access model, any-toilet use rises from <strong>${q1Any.toFixed(0)}%</strong> in Q1 to <strong>${q5Any.toFixed(0)}%</strong> in Q5. `+
 `The richer quintile also shifts toward higher-cost improved and septic options, making the technology mix itself an equity outcome.`
 :"No LDCs match the current search.";
}

function renderTechnologyCostChart(){
 const svg=el("technologyCostChart");
 const W=920,H=310,Lf=145,R=28,Tp=25,B=48,iw=W-Lf-R,ih=H-Tp-B;

 const all=LDC_ISO.map(iso=>ldcCosts2024(iso));

 const series=[
 {label:"Traditional pit",values:all.map(c=>c.traditional),color:"#d6574a"},
 {label:"Improved pit proxy",values:all.map(c=>c.improved),color:"#d7ae3b"},
 {label:"Septic",values:all.map(c=>c.septic),color:"#aa5797"}
 ].map(s=>({
 ...s,
 min:Math.min(...s.values),
 q1:quantile(s.values,.25),
 med:quantile(s.values,.50),
 q3:quantile(s.values,.75),
 max:Math.max(...s.values)
 }));

 const minX=Math.max(1,Math.min(...series.map(s=>s.min))*.8);
 const maxX=Math.max(...series.map(s=>s.max))*1.15;
 const lmin=Math.log10(minX),lmax=Math.log10(maxX);
 const sx=v=>Lf+(Math.log10(v)-lmin)/(lmax-lmin)*iw;

 const ticks=[2,5,10,20,50,100,200,500,1000]
 .filter(v=>v>=minX&&v<=maxX);

 let out=`<rect width="${W}" height="${H}" fill="#fff"/>`;

 ticks.forEach(v=>{
 out+=L(sx(v),Tp,sx(v),Tp+ih,"#dbe3e6",1);
 out+=T(sx(v),H-20,"$"+v,9,"#536973")
 });

 const ys=[72,145,218];

 series.forEach((s,i)=>{
 const y=ys[i];

 out+=T(Lf-12,y+4,s.label,10,"#344c57","end",700);

 out+=L(sx(s.min),y,sx(s.max),y,"#758991",2);
 out+=L(sx(s.min),y-8,sx(s.min),y+8,"#758991",2);
 out+=L(sx(s.max),y-8,sx(s.max),y+8,"#758991",2);

 out+=`<rect x="${sx(s.q1)}" y="${y-15}" width="${Math.max(2,sx(s.q3)-sx(s.q1))}"
 height="30" fill="${s.color}" fill-opacity=".40" stroke="${s.color}" stroke-width="1.4"/>`;

 out+=L(sx(s.med),y-17,sx(s.med),y+17,s.color,3);

 out+=T(sx(s.med),y-22,"median $"+s.med.toFixed(0),8.5,s.color,"middle",700)
 });

 out+=T(W/2,H-3,"2024-equivalent capital cost per person (US$) · log scale",10.5,"#314f5d","middle",650);

 svg.innerHTML=out;
}

function attachExtraGlobalTooltips(){
 const tip=el("tooltip");

 document.querySelectorAll(".extra-global-point").forEach(n=>{
 n.onmouseenter=e=>{
 tip.textContent=e.currentTarget.dataset.title;
 tip.style.display="block"
 };
 n.onmousemove=e=>{
 tip.style.left=(e.clientX+12)+"px";
 tip.style.top=(e.clientY+12)+"px"
 };
 n.onmouseleave=()=>tip.style.display="none"
 });
}

function updateGlobalComparison(){
 if(!state.globalLoaded)return;

 state.globalRows=buildLdcRows();

 const key=el("globalMetric").value;
 const metric=GLOBAL_METRICS[key];
 const pairs=pairedRows(key);

 el("globalScatterTitle").textContent=metric.title;
 el("globalScatterNote").textContent=metric.note+" The dashed line is 1:1 agreement.";

 renderMetricSummary();
 renderGlobalScatter(key,pairs);
 renderDiagnostics(key,state.globalRows);
 renderEquityScatter(key,state.globalRows);
 renderCostAccessScatter(key,state.globalRows);
 renderTechnologyCostChart();
 renderLdcTechnologyMix(state.globalRows);
 renderLdcEquityMix(state.globalRows);
 renderJmpInequalityLinks(state.globalRows);
 renderJmpValidation();
 attachExtraGlobalTooltips();
 renderGlobalTable(key,state.globalRows);
}
function loadCachedLdcSnapshot(){
 return null;
}
function saveCachedLdcSnapshot(maps){
 return;
}
async function loadGlobalData(){
 if(state.globalLoaded)return;

 const status=el("globalStatus");
 status.classList.add("is-loading");
 status.textContent=
 "Loading five current WDI/JMP series for the 44 UN Least Developed Countries…";

 try{
 const [gniRows,gdpRows,giniRows,odRows,basicRows]=await Promise.all([
 ldcIndicator("NY.GNP.PCAP.CD","2022:2024"),
 ldcIndicator("NY.GDP.PCAP.CD","2022:2024"),
 ldcIndicator("SI.POV.GINI","2000:2024"),
 ldcIndicator("SH.STA.ODFC.ZS","2024"),
 ldcIndicator("SH.STA.BASS.ZS","2024")
 ]);

 const maps={
 gni:latestMap(gniRows),
 gdp:latestMap(gdpRows),
 gini:latestMap(giniRows),
 od:latestMap(odRows),
 basic:latestMap(basicRows)
 };

 state.globalRaw=maps;
 state.globalLoaded=true;
 saveCachedLdcSnapshot(maps);

 status.classList.remove("is-loading");
 status.textContent=
 `Loaded ${LDC_ISO.length} UN LDCs. Cost benchmarks are embedded from the World Bank 2016 study; economic and JMP indicators are current WDI/JMP data.`;

 updateGlobalComparison();

 }catch(err){
 console.error(err);

 status.classList.remove("is-loading");
 status.textContent=
 "The World Bank/JMP data request failed. The rest of the tool remains available; try reloading this page to retry the LDC comparison.";
 }
}

function showPage(page){
 const home=page==="home";
 const global=page==="global";
 const strategy=page==="strategy";
 const country=page==="country";

 state.activePage=
 home?"home":
 global?"global":
 strategy?"strategy":
 "country";

 const landingPage=el("landingPage");
 const countryPage=el("countryPage");
 const strategyPage=el("strategyPage");
 const globalPage=el("globalPage");

 landingPage.hidden=!home;
 countryPage.hidden=!country;
 strategyPage.hidden=!strategy;
 globalPage.hidden=!global;

 landingPage.style.display=home?"":"none";
 countryPage.style.display=country?"":"none";
 strategyPage.style.display=strategy?"":"none";
 globalPage.style.display=global?"":"none";

 el("homeNav").classList.toggle("active",home);
 el("countryNav").classList.toggle("active",country);
 el("strategyNav").classList.toggle("active",strategy);
 el("globalNav").classList.toggle("active",global);

 const scenario=country||strategy;

 document.querySelectorAll(".scenario-header-control").forEach(n=>{
 n.style.display=scenario?"":"none";
 });

 document.querySelectorAll(".country-only-nav").forEach(n=>{
 n.style.display=country?"":"none";
 });

 document.body.classList.toggle("strategy-map-active",strategy);

 if(global){
 loadGlobalData();
 }

 if(strategy){
 // Repaint the synthetic base here as well as at startup so the
 // dedicated page never depends on having visited Explore Map first.
 renderSyntheticBaseTo(
 "strategyParcelLayer",
 "strategyWaterLayer",
 "strategyRoadLayer"
 );

 renderStrategyControls(true);
 renderStrategyLab();

 const strategyMapModel=selectedStrategyMapModel();
 renderStrategyMap(strategyMapModel);

 el("strategyMapMeta").innerHTML=
 `<span class="strategy-map-pill">${pct(strategyMapModel.fecalReduction,1)} faecal load kept out</span> · 1,000 households`;
 }

 if(country){
 render();
 }

 window.scrollTo({top:0,behavior:"auto"});
}

function ensureStrategyInitialized(force=false){
 const s=state.strategy;
 if(!force && s.initialized && s.countryIso===state.country.iso3)return;
 s.prices={}; s.performance={};
 state.options.forEach(o=>{s.prices[o.id]=o.usd; s.performance[o.id]=o.cont;});
 s.mechanism="targeted"; s.supportPct=30; s.takeup=100; s.uncertaintyPp=10;
 const vip=state.options.find(o=>o.id==="vip")?.usd ?? state.options.slice().sort((a,b)=>a.usd-b.usd)[Math.floor(state.options.length/2)]?.usd ?? 150;
 const rawEnvelope=vip*N*.30;
 s.envelopeUsd=Math.max(10000,Math.round(rawEnvelope/5000)*5000);
 s.countryIso=state.country.iso3; s.renderCurrency=null; s.initialized=true;
}

function strategyOptions(){
 ensureStrategyInitialized();

 return state.options
 .map(o=>({
 ...o,
 usd:Math.max(0,state.strategy.prices[o.id]??o.usd),
 price:Math.max(0,state.strategy.prices[o.id]??o.usd),
 cont:clamp(state.strategy.performance[o.id]??o.cont,0,100),
 contLow:clamp((state.strategy.performance[o.id]??o.cont)-(state.strategy.uncertaintyPp??10),0,100),
 contHigh:clamp((state.strategy.performance[o.id]??o.cont)+(state.strategy.uncertaintyPp??10),0,100),
 utility:clamp(state.strategy.performance[o.id]??o.cont,0,100)/100
 }))
 .sort((a,b)=>b.utility-a.utility||a.price-b.price)
}

function strategyNoneOption(){
 return {
 id:"none",
 name:"No toilet / OD",
 short:"No toilet / OD",
 color:"#78858b",
 od:0,
 cont:0,
 price:0,
 utility:0
 }
}

function strategyCanAdopt(i){
 return rand(i,41)<clamp(state.strategy.takeup/100,.70,1)
}

function strategyModel(mechanismOverride=null){
 ensureStrategyInitialized();

 const hh=households();
 const opts=strategyOptions();
 const assigned=hh.map(h=>({...h,opt:strategyNoneOption()}));
 const mechanism=mechanismOverride??state.strategy.mechanism;
 const supportRate=clamp(state.strategy.supportPct/100,0,.80);
 const envelope=Math.max(0,state.strategy.envelopeUsd);

 let remaining=envelope;
 let subsidySpent=0;
 let deliveryCost=0;
 let subsidisedHouseholds=0;
 let subsidyExtension=0;
 let subsidyUpgrade=0;
 let subsidyLeakage=0;
 let extensionSupportHouseholds=0;
 let upgradeSupportHouseholds=0;
 let leakageHouseholds=0;

 const selfOption=(h)=>opts.find(o=>financialAccessProbability(h.budget,o.price)>=h.accessU);

 if(mechanism==="none"){
 hh.forEach((h,i)=>{
 if(!strategyCanAdopt(i))return;

 const opt=selfOption(h);

 if(opt){
 assigned[i]={
 ...h,
 opt:{...opt,householdPays:opt.price,supportValue:0}
 };
 }
 });
 }

 if(mechanism==="blanket"){
 const order=hh
 .map((h,i)=>({h,i,r:rand(i,73)}))
 .sort((a,b)=>a.r-b.r);

 order.forEach(({h,i})=>{
 if(!strategyCanAdopt(i))return;

 let adopted=false;
 const selfBefore=selfOption(h);

 for(const o of opts){
 const subsidy=o.price*supportRate;
 const householdPays=o.price-subsidy;

 if(
 financialAccessProbability(h.budget,householdPays)>=h.accessU &&
 subsidy<=remaining+1e-9
 ){
 remaining-=subsidy;
 subsidySpent+=subsidy;
 if(subsidy>1e-9){
 subsidisedHouseholds++;
 if(!selfBefore){
 subsidyExtension+=subsidy;
 extensionSupportHouseholds++;
 }else if((o.cont||0)>(selfBefore.cont||0)+1e-9){
 subsidyUpgrade+=subsidy;
 upgradeSupportHouseholds++;
 }else{
 subsidyLeakage+=subsidy;
 leakageHouseholds++;
 }
 }

 assigned[i]={
 ...h,
 opt:{...o,householdPays,supportValue:subsidy}
 };

 adopted=true;
 break;
 }
 }

 if(!adopted){
 const self=selfOption(h);

 if(self){
 assigned[i]={
 ...h,
 opt:{...self,householdPays:self.price,supportValue:0}
 };
 }
 }
 });
 }

 if(mechanism==="targeted"){
 // Let households that already cross their individual financial-access
 // threshold self-finance first. Public support is then used only where it
 // changes the simulated outcome.
 hh.forEach((h,i)=>{
 if(!strategyCanAdopt(i))return;

 const self=selfOption(h);

 if(self){
 assigned[i]={
 ...h,
 opt:{...self,householdPays:self.price,supportValue:0}
 };
 }
 });

 for(let i=0;i<N;i++){
 if(assigned[i].opt.id!=="none" || !strategyCanAdopt(i))continue;

 const h=hh[i];
 const candidates=[];

 opts.forEach(o=>{
 // Maximum out-of-pocket price that just crosses this household's
 // fixed simulated financial-access threshold.
 const thresholdPrice=priceAtFinancialThreshold(h.budget,h.accessU);
 const gap=Math.max(0,o.price-thresholdPrice);

 if(gap<=0 || gap>o.price*supportRate+1e-9)return;

 const delivery=gap*TARGETED_DELIVERY_OVERHEAD;
 const programmeCost=gap+delivery;

 if(programmeCost>remaining+1e-9)return;

 candidates.push({
 o,
 gap,
 delivery,
 programmeCost,
 efficiency:(o.cont/100)/Math.max(programmeCost,.0001)
 });
 });

 if(!candidates.length)continue;

 candidates.sort((a,b)=>
 b.efficiency-a.efficiency ||
 b.o.cont-a.o.cont ||
 a.programmeCost-b.programmeCost
 );

 const selected=candidates[0];

 remaining-=selected.programmeCost;
 subsidySpent+=selected.gap;
 deliveryCost+=selected.delivery;
 subsidisedHouseholds++;
 subsidyExtension+=selected.gap;
 extensionSupportHouseholds++;

 assigned[i]={
 ...h,
 opt:{
 ...selected.o,
 householdPays:selected.o.price-selected.gap,
 supportValue:selected.gap
 }
 };
 }
 }

 const coverage=assigned.filter(a=>a.opt.id!=="none").length/N;
 const poor40=assigned.slice(0,400).filter(a=>a.opt.id!=="none").length/400;
 const poor20=assigned.slice(0,200).filter(a=>a.opt.id!=="none").length/200;
 const rich20=assigned.slice(800,1000).filter(a=>a.opt.id!=="none").length/200;
 const equityGap=rich20-poor20;

 const quintileCoverage=Array.from({length:5},(_,q)=>{
 const group=assigned.slice(q*200,(q+1)*200);
 return group.filter(a=>a.opt.id!=="none").length/200;
 });

 const fecalReduction=assigned.reduce((s,a)=>s+(a.opt.cont||0)/100,0)/N;
 const fecalGeneratedTonnes=totalFecalTonnesPerYear();
 const fecalAvoidedTonnes=fecalGeneratedTonnes*fecalReduction;
 const fecalRemainingTonnes=fecalGeneratedTonnes-fecalAvoidedTonnes;
 const totalProgrammeCost=subsidySpent+deliveryCost;

 const base=[
 {id:"none",short:"No toilet / OD",color:"#78858b",cont:0},
 ...opts
 ];

 const mix=base.map(o=>{
 const count=assigned.filter(a=>a.opt.id===o.id).length;

 return {
 ...o,
 count,
 share:count/N
 }
 });

 return {
 hh,opts,assigned,mix,
 mechanism,
 coverage,poor40,poor20,rich20,equityGap,quintileCoverage,
 cont:fecalReduction,
 linear:fecalReduction,
 fecalReduction,fecalGeneratedTonnes,fecalAvoidedTonnes,fecalRemainingTonnes,
 subsidySpent,deliveryCost,totalProgrammeCost,
 subsidisedHouseholds,
 subsidyExtension,subsidyUpgrade,subsidyLeakage,
 extensionSupportHouseholds,upgradeSupportHouseholds,leakageHouseholds,
 subsidyEnvelope:envelope,
 strategy:true
 }
}

function strategyPerformanceRange(m){
 const band=clamp(state.strategy.uncertaintyPp??10,0,30);
 const total=m.assigned.length||1;
 let low=0,high=0;

 m.assigned.forEach(a=>{
 if(a.opt.id==="none")return;
 const c=clamp(a.opt.cont||0,0,100);
 low+=clamp(c-band,0,100)/100;
 high+=clamp(c+band,0,100)/100;
 });

 const lowReduction=low/total;
 const highReduction=high/total;
 const tonnes=m.fecalGeneratedTonnes||totalFecalTonnesPerYear();

 return {low:lowReduction,high:highReduction,lowTonnes:tonnes*lowReduction,highTonnes:tonnes*highReduction}
}

function strategyTransitionMetrics(m,base){
 const massPerHH=(m.fecalGeneratedTonnes||totalFecalTonnesPerYear())/N;
 let extensionHH=0,upgradeHH=0,extensionTonnes=0,upgradeTonnes=0,otherTonnes=0;

 for(let i=0;i<N;i++){
 const b=base.assigned[i]?.opt??strategyNoneOption();
 const s=m.assigned[i]?.opt??strategyNoneOption();
 const delta=((s.cont||0)-(b.cont||0))/100*massPerHH;

 if(b.id==="none" && s.id!=="none"){
 extensionHH++;
 extensionTonnes+=Math.max(0,delta);
 }else if(b.id!=="none" && s.id!=="none" && (s.cont||0)>(b.cont||0)+1e-9){
 upgradeHH++;
 upgradeTonnes+=Math.max(0,delta);
 }else if(Math.abs(delta)>.000001){
 otherTonnes+=delta;
 }
 }

 const poor40Added=Math.max(0,Math.round((m.poor40-base.poor40)*400));
 const incrementalTonnes=m.fecalAvoidedTonnes-base.fecalAvoidedTonnes;
 const spend=m.totalProgrammeCost;

 return {
 extensionHH,upgradeHH,extensionTonnes,upgradeTonnes,otherTonnes,
 poor40Added,incrementalTonnes,
 tonnesPer10k:spend>0?incrementalTonnes/(spend/10000):null,
 poor40Per10k:spend>0?poor40Added/(spend/10000):null
 }
}

function renderStrategyFrontier(comparisons,noSupport){
 const svg=el("strategyFrontier");
 if(!svg)return;

 const W=640,H=360,Lf=54,R=26,Tp=26,B=48,iw=W-Lf-R,ih=H-Tp-B;
 const sx=v=>Lf+clamp(v,0,100)/100*iw;
 const sy=v=>Tp+(100-clamp(v,0,100))/100*ih;
 const maxCost=Math.max(1,...comparisons.map(d=>d.m.totalProgrammeCost));
 const colors={none:"#78858b",blanket:"#6d9aa6",targeted:"#4f7d63"};

 let out=`<rect width="${W}" height="${H}" fill="#fff"/>`;
 [0,20,40,60,80,100].forEach(v=>{
 out+=L(sx(v),Tp,sx(v),H-B,"#e5e9ec",1);
 out+=L(Lf,sy(v),W-R,sy(v),"#e5e9ec",1);
 out+=T(sx(v),H-24,v+"%",8.5,"#6b7a82");
 out+=T(Lf-7,sy(v)+3,v+"%",8.5,"#6b7a82","end");
 });

 comparisons.forEach(d=>{
 const x=d.m.poor40*100;
 const y=d.m.fecalReduction*100;
 const range=strategyPerformanceRange(d.m);
 const r=d.m.totalProgrammeCost>0?5+11*Math.sqrt(d.m.totalProgrammeCost/maxCost):5;
 const px=sx(x),py=sy(y),yl=sy(range.low*100),yh=sy(range.high*100);
 out+=L(px,yh,px,yl,colors[d.key],1.5);
 out+=L(px-4,yh,px+4,yh,colors[d.key],1.5);
 out+=L(px-4,yl,px+4,yl,colors[d.key],1.5);
 out+=`<circle cx="${px}" cy="${py}" r="${r.toFixed(1)}" fill="${colors[d.key]}" fill-opacity=".84" stroke="#fff" stroke-width="1.5"><title>${d.label}: poorest 40% ${x.toFixed(1)}%, faecal load ${y.toFixed(1)}%, public cost ${moneyUSD(d.m.totalProgrammeCost)}</title></circle>`;
 const textAnchor=px>W-160?"end":"start";
 const tx=px+(textAnchor==="end"?-r-6:r+6);
 out+=T(tx,py+3,d.label,9,"#344c57",textAnchor,700);
 });

 out+=T(Lf+iw/2,H-3,"Poorest 40% modelled toilet use",9.5,"#314f5d","middle",650);
 out+=`<text x="13" y="${Tp+ih/2}" transform="rotate(-90 13 ${Tp+ih/2})" text-anchor="middle" font-size="9.5" fill="#314f5d" font-weight="650">Faecal load kept out</text>`;
 svg.innerHTML=out;
}

function renderStrategyControls(force=false){
 ensureStrategyInitialized();

 const s=state.strategy;
 const r=rate();
 const rows=el("strategyTechRows");

 if(force || s.renderCurrency!==state.currency || !rows.children.length){
 const maxPriceUsd=Math.max(1000,...state.options.map(o=>Math.max(200,o.usd*2.2)));
 const stepUsd=maxPriceUsd>4000?50:maxPriceUsd>1000?10:5;

 rows.innerHTML=state.options.map(o=>`
 <div class="strategy-tech-row">
 <div class="strategy-tech-name">
 <i style="background:${o.color}"></i>
 <strong>${o.short}</strong>
 </div>

 <div class="strategy-tech-control">
 <div><span>Price</span><output data-strategy-price-out="${o.id}">${moneyUSD(s.prices[o.id])}</output></div>
 <input type="range"
 min="0"
 max="${Math.round(maxPriceUsd*r)}"
 step="${Math.max(1,Math.round(stepUsd*r))}"
 value="${Math.round(s.prices[o.id]*r)}"
 data-strategy-price="${o.id}">
 </div>

 <div class="strategy-tech-control">
 <div><span>Faecal load kept out</span><output data-strategy-performance-out="${o.id}">${Math.round(s.performance[o.id])}%</output></div>
 <input type="range"
 min="0"
 max="100"
 step="1"
 value="${Math.round(s.performance[o.id])}"
 data-strategy-performance="${o.id}">
 <small data-strategy-range-out="${o.id}">${Math.max(0,Math.round(s.performance[o.id]-(s.uncertaintyPp??10)))}–${Math.min(100,Math.round(s.performance[o.id]+(s.uncertaintyPp??10)))}% sensitivity</small>
 </div>
 </div>
 `).join("");

 const envelopeMaxUsd=Math.max(100000,s.envelopeUsd*2.5,maxPriceUsd*N*.30);
 el("strategyEnvelope").max=Math.round(envelopeMaxUsd*r);
 el("strategyEnvelope").step=Math.max(1,Math.round(1000*r));
 el("strategyEnvelope").value=Math.round(s.envelopeUsd*r);

 s.renderCurrency=state.currency;
 }

 document.querySelectorAll("[data-mechanism]").forEach(btn=>{
 btn.classList.toggle("active",btn.dataset.mechanism===s.mechanism);
 });

 el("strategySupport").value=s.supportPct;
 el("strategySupportOut").textContent=`${Math.round(s.supportPct)}%`;
 el("strategyEnvelope").value=Math.round(s.envelopeUsd*r);
 el("strategyEnvelopeOut").textContent=moneyUSD(s.envelopeUsd);
 const vip=state.options.find(o=>o.id==="vip")?.usd ?? state.options.slice().sort((a,b)=>a.usd-b.usd)[Math.floor(state.options.length/2)]?.usd ?? 150;
 el("strategyEnvelopeNote").textContent=`Starting envelope scales to the community: about 30% of the current VIP benchmark × 1,000 households (${moneyUSD(vip*N*.30)} before rounding).`;
 el("strategyTakeup").value=s.takeup;
 el("strategyTakeupOut").textContent=`${Math.round(s.takeup)}%`;
 el("strategyUncertainty").value=s.uncertaintyPp??10;
 el("strategyUncertaintyOut").textContent=`±${Math.round(s.uncertaintyPp??10)} pp`;
 document.querySelectorAll("[data-strategy-range-out]").forEach(out=>{
 const id=out.dataset.strategyRangeOut;
 const c=clamp(s.performance[id]??0,0,100);
 const band=clamp(s.uncertaintyPp??10,0,30);
 out.textContent=`${Math.max(0,Math.round(c-band))}–${Math.min(100,Math.round(c+band))}% sensitivity`;
 });

 const noSupport=s.mechanism==="none";
 el("strategySupport").disabled=noSupport;
 el("strategyEnvelope").disabled=noSupport;
 el("strategySupportWrap").classList.toggle("strategy-control-disabled",noSupport);
 el("strategyEnvelopeWrap").classList.toggle("strategy-control-disabled",noSupport);

 el("strategySupportNote").textContent=
 s.mechanism==="targeted"
 ?`Pro-poor support leaves self-financed choices unchanged, then uses public money where support changes the household's modelled financial-access outcome. It starts with the poorest households and selects the feasible option giving the most faecal-load reduction per public dollar. A ${Math.round(TARGETED_DELIVERY_OVERHEAD*100)}% illustrative delivery overhead is included.`
 :s.mechanism==="blanket"
 ?"Blanket support applies the same discount to every subsidised purchase. It avoids household means testing but can subsidise households that could have paid without support."
 :"No household subsidy. Change technology prices to test market strengthening, local production, procurement or R&D scenarios.";
}

function renderStrategyLab(){
 ensureStrategyInitialized(); renderStrategyControls();
 const baseline=model(), selected=strategyModel(), noSupport=strategyModel("none"), blanket=strategyModel("blanket"), targeted=strategyModel("targeted");
 const gini=state.country.gini?.value??38.5;
 const coverageDelta=(selected.coverage-baseline.coverage)*100, poorDelta=(selected.poor40-baseline.poor40)*100;
 const envelope=Math.max(0,state.strategy.envelopeUsd), usedShare=envelope>0?selected.totalProgrammeCost/envelope:0;
 const selectedRange=strategyPerformanceRange(selected);

 el("strategyFecalPct").textContent=pct(selected.fecalReduction,1);
 el("strategyFecalTonnes").textContent=`${selected.fecalAvoidedTonnes.toFixed(0)} t/year wet faecal mass kept out`;
 el("strategyFecalBar").style.width=`${Math.max(0,Math.min(100,selected.fecalReduction*100)).toFixed(1)}%`;
 el("strategyFecalRange").textContent=`Technical-performance sensitivity: ${pct(selectedRange.low,1)}–${pct(selectedRange.high,1)} · ${selectedRange.lowTonnes.toFixed(0)}–${selectedRange.highTonnes.toFixed(0)} t/year`;

 el("strategyCoverage").textContent=pct(selected.coverage,1); el("strategyPoor40").textContent=pct(selected.poor40,1);
 el("strategyEquityGap").textContent=`${(selected.equityGap*100).toFixed(1)} pp`; el("strategySpent").textContent=moneyUSD(selected.totalProgrammeCost);
 el("strategyCoverageDelta").textContent=`${coverageDelta>=0?"+":""}${coverageDelta.toFixed(1)} pp vs main scenario`;
 el("strategyPoor40Delta").textContent=`${poorDelta>=0?"+":""}${poorDelta.toFixed(1)} pp vs main scenario`;
 el("strategyBudgetUse").textContent=state.strategy.mechanism==="none"?"no household subsidy":`${Math.min(999,usedShare*100).toFixed(0)}% of envelope`;
 el("strategyPopulation").textContent=`≈${Math.round(N*HH_SIZE).toLocaleString()} people`; el("strategyGini").textContent=Number(gini).toFixed(1); el("strategyGiniBadge").textContent=`Gini ${Number(gini).toFixed(1)}`; el("strategyBaselineFecal").textContent=pct(noSupport.fecalReduction,1);

 el("strategyEquityBars").innerHTML=selected.quintileCoverage.map((value,i)=>{const marker=noSupport.quintileCoverage[i]*100; return `<div class="strategy-equity-row"><span class="strategy-equity-label">Q${i+1}</span><div class="strategy-equity-track"><div class="strategy-equity-fill" style="width:${(value*100).toFixed(1)}%"></div><i class="strategy-equity-marker" style="left:${Math.max(0,Math.min(100,marker)).toFixed(1)}%"></i></div><strong>${pct(value,0)}</strong></div>`}).join("");

 const comparisons=[{key:"none",label:"No subsidy",m:noSupport},{key:"blanket",label:"Blanket",m:blanket},{key:"targeted",label:"Pro-poor",m:targeted}];
 const transition=new Map(comparisons.map(d=>[d.key,strategyTransitionMetrics(d.m,noSupport)]));
 const selectedTransition=transition.get(state.strategy.mechanism)||strategyTransitionMetrics(selected,noSupport);
 const efficiencyTonnes=m=>strategyTransitionMetrics(m,noSupport).tonnesPer10k;
 const efficiencyPoor=m=>strategyTransitionMetrics(m,noSupport).poor40Per10k;

 el("strategyCompareRows").innerHTML=comparisons.map(d=>{
 const tr=transition.get(d.key), range=strategyPerformanceRange(d.m), selectedClass=state.strategy.mechanism===d.key?" selected":"";
 return `<div class="strategy-compare-row${selectedClass}">
 <div class="strategy-compare-name">${d.label}</div>
 <div class="strategy-compare-load"><div class="strategy-compare-track"><div style="width:${(d.m.fecalReduction*100).toFixed(1)}%"></div></div><div><strong>${pct(d.m.fecalReduction,1)}</strong><small>${pct(range.low,0)}–${pct(range.high,0)}</small></div></div>
 <div class="strategy-compare-stat"><span>Poorest 40%</span><strong>${pct(d.m.poor40,0)}</strong></div>
 <div class="strategy-compare-stat"><span>Public cost</span><strong>${moneyUSD(d.m.totalProgrammeCost)}</strong></div>
 <div class="strategy-compare-stat"><span>Added load / US$10k</span><strong>${tr.tonnesPer10k==null?"—":tr.tonnesPer10k.toFixed(1)+" t"}</strong></div>
 <div class="strategy-compare-stat"><span>Poor-40 HH / US$10k</span><strong>${tr.poor40Per10k==null?"—":tr.poor40Per10k.toFixed(0)}</strong></div>
 </div>`
 }).join("");

 const be=efficiencyTonnes(blanket), te=efficiencyTonnes(targeted), loadDiff=targeted.fecalAvoidedTonnes-blanket.fecalAvoidedTonnes, poorDiff=(targeted.poor40-blanket.poor40)*100;
 const bp=efficiencyPoor(blanket),tp=efficiencyPoor(targeted);
 let why="";
 if(te!=null && be!=null && te>be+0.001){why=`<strong>Environmental efficiency:</strong> pro-poor support adds ${te.toFixed(1)} t per US$10,000 versus ${be.toFixed(1)} t for blanket support because it pays only where support changes the simulated outcome.`}
 else if(te!=null && be!=null){why=`<strong>Environmental efficiency:</strong> blanket support adds ${be.toFixed(1)} t per US$10,000 versus ${te.toFixed(1)} t for pro-poor support in this scenario. Targeting prioritises households without a modelled toilet rather than upgrades among households that already have one.`}
 if(tp!=null&&bp!=null)why+=` <strong>Equity efficiency:</strong> pro-poor reaches ${tp.toFixed(0)} additional poorest-40 households per US$10,000 versus ${bp.toFixed(0)} for blanket support.`;
 if(poorDiff>0.1)why+=` Pro-poor raises poorest-40 modelled toilet use by ${poorDiff.toFixed(1)} percentage points compared with blanket support.`;
 if(loadDiff<-.05)why+=` It keeps out ${Math.abs(loadDiff).toFixed(1)} fewer tonnes/year overall, showing the equity/environment trade-off.`; else if(loadDiff>.05)why+=` It also keeps out ${loadDiff.toFixed(1)} more tonnes/year overall.`;
 why+=` No combined score is imposed because equity and environmental performance are distinct policy objectives.`;
 el("strategyWhyText").innerHTML=why;

 const extensionShare=selectedTransition.incrementalTonnes>0?selectedTransition.extensionTonnes/selectedTransition.incrementalTonnes:0;
 const upgradeShare=selectedTransition.incrementalTonnes>0?selectedTransition.upgradeTonnes/selectedTransition.incrementalTonnes:0;
 el("strategyOutcomeBreakdown").innerHTML=`
 <div class="strategy-outcome-row"><div><strong>${selectedTransition.extensionHH}</strong><span>households gain a toilet</span></div><div class="strategy-outcome-track"><i style="width:${Math.max(0,Math.min(100,extensionShare*100)).toFixed(1)}%"></i></div><b>${selectedTransition.extensionTonnes.toFixed(1)} t/yr</b></div>
 <div class="strategy-outcome-row"><div><strong>${selectedTransition.upgradeHH}</strong><span>households upgrade service</span></div><div class="strategy-outcome-track"><i style="width:${Math.max(0,Math.min(100,upgradeShare*100)).toFixed(1)}%"></i></div><b>${selectedTransition.upgradeTonnes.toFixed(1)} t/yr</b></div>
 <div class="strategy-outcome-total"><span>Incremental faecal load kept out</span><strong>${selectedTransition.incrementalTonnes>=0?"+":""}${selectedTransition.incrementalTonnes.toFixed(1)} t/year</strong></div>`;

 const spendParts=[
 {label:"Access extension",value:selected.subsidyExtension,color:"#4f7d63"},
 {label:"Upgrade support",value:selected.subsidyUpgrade,color:"#6d9aa6"},
 {label:"Potential leakage",value:selected.subsidyLeakage,color:"#b78264"},
 {label:"Targeting / delivery",value:selected.deliveryCost,color:"#9a8a68"}
 ];
 const spendTotal=spendParts.reduce((s,x)=>s+x.value,0);
 const leakagePct=selected.subsidySpent>0?selected.subsidyLeakage/selected.subsidySpent*100:0;
 el("strategySpendingBreakdown").innerHTML=spendTotal>0?`
 <div class="strategy-spending-bar">${spendParts.map(x=>x.value>0?`<i style="width:${(x.value/spendTotal*100).toFixed(1)}%;background:${x.color}" title="${x.label}: ${moneyUSD(x.value)}"></i>`:"").join("")}</div>
 <div class="strategy-spending-legend">${spendParts.map(x=>`<span><i style="background:${x.color}"></i>${x.label} <strong>${moneyUSD(x.value)}</strong></span>`).join("")}</div>
 <p>${selected.mechanism==="blanket"?`Potential leakage is ${leakagePct.toFixed(0)}% of household subsidy: support paid where the modelled sanitation outcome would have been unchanged without subsidy. Upgrade support is shown separately and is not counted as leakage.`:selected.mechanism==="targeted"?`Pro-poor support is used only where it changes the simulated sanitation outcome. The ${Math.round(TARGETED_DELIVERY_OVERHEAD*100)}% delivery/verification overhead is shown separately.`:`No public household subsidy in this scenario.`}</p>`:
 `<p>No public household subsidy in this scenario.</p>`;

 renderStrategyFrontier(comparisons,noSupport);
}

function resetStrategyFromCurrent(){
 state.strategy.initialized=false;
 ensureStrategyInitialized(true);
 renderStrategyControls(true);
 refreshStrategyView();
}

function householdDataRows(m){
 const support=clamp(num("subsidy")/100,0,.9);
 const supportPct=support*100;
 const budgetShare=num("budgetShare");
 const rows=[];

 for(let houseIndex=0;houseIndex<N;houseIndex++){
 const wealthIndex=HOUSE_PERM[houseIndex];
 const a=m.assigned[wealthIndex];
 const quintile=Math.floor(wealthIndex/200)+1;
 const listedPrice=a.opt.id==="none" ? 0 : (a.opt.usd??0);
 const householdPays=a.opt.id==="none" ? 0 : (a.opt.price??0);
 const supportValue=Math.max(0,listedPrice-householdPays);
 const maxListed=support<.999 ? a.budget/(1-support) : a.budget;

 const accessByOption=m.opts
 .map(o=>`${o.short}: ${Math.round(financialAccessProbability(a.budget,o.price)*100)}%`);

 rows.push({
 houseId:houseIndex+1,
 houseLabel:"H"+String(houseIndex+1).padStart(4,"0"),
 wealthRank:wealthIndex+1,
 wealthPercentile:a.q*100,
 quintile,
 annual:a.annual,
 budgetShare,
 budget:a.budget,
 supportPct,
 maxListed,
 optionId:a.opt.id,
 decision:a.opt.id==="none" ? "No toilet / OD" : a.opt.short,
 decisionDetail:a.opt.id==="none"
 ? "No sanitation option crosses this household's simulated financial-access threshold"
 : `Modelled financial access: ${a.opt.short}`,
 listedPrice,
 householdPays,
 supportValue,
 containment:a.opt.cont??0,
 affordableOptions:accessByOption.join("; ")
 });
 }

 return rows;
}

function hhSortValue(r,key){
 return r[key];
}

function filteredHouseholdRows(m){
 const q=(el("hhSearch").value||"").trim().toLowerCase();
 const quintile=el("hhQuintile").value;
 const decision=el("hhDecision").value;

 let rows=householdDataRows(m);

 if(q){
 rows=rows.filter(r=>
 r.houseLabel.toLowerCase().includes(q) ||
 String(r.houseId)===q ||
 r.decision.toLowerCase().includes(q) ||
 r.decisionDetail.toLowerCase().includes(q)
 );
 }

 if(quintile!=="all"){
 rows=rows.filter(r=>r.quintile===Number(quintile));
 }

 if(decision!=="all"){
 rows=rows.filter(r=>r.optionId===decision);
 }

 const {key,dir}=state.hhTableSort;
 const sign=dir==="asc"?1:-1;

 rows.sort((a,b)=>{
 const av=hhSortValue(a,key);
 const bv=hhSortValue(b,key);

 if(typeof av==="string"){
 const c=av.localeCompare(bv);
 return c!==0 ? sign*c : a.houseId-b.houseId;
 }

 if(av===bv)return a.houseId-b.houseId;
 return sign*(av-bv);
 });

 return rows;
}

function updateHouseholdSortHeaders(){
 document.querySelectorAll("#householdDataTable th.hh-sortable").forEach(th=>{
 th.classList.remove("hh-asc","hh-desc");

 if(th.dataset.hhSort===state.hhTableSort.key){
 th.classList.add(state.hhTableSort.dir==="asc"?"hh-asc":"hh-desc");
 }
 });
}

function renderHouseholdTable(m=state.currentModel||model()){
 const rows=filteredHouseholdRows(m);
 const body=el("householdDataTable").querySelector("tbody");

 body.innerHTML=rows.map(r=>`<tr>
 <td>${r.houseLabel}</td>
 <td class="num">${r.wealthRank.toLocaleString()}</td>
 <td>Q${r.quintile}</td>
 <td class="num">${moneyUSD(r.annual)}</td>
 <td class="num">${r.budgetShare.toFixed(1)}%</td>
 <td class="num">${moneyUSD(r.budget)}</td>
 <td class="num">${r.supportPct.toFixed(0)}%</td>
 <td class="num">${moneyUSD(r.maxListed)}</td>
 <td class="${r.optionId==="none"?"decision-no":"decision-yes"}">${r.decision}</td>
 <td class="num">${r.optionId==="none"?"—":moneyUSD(r.listedPrice)}</td>
 <td class="num">${r.optionId==="none"?"—":moneyUSD(r.householdPays)}</td>
 <td class="num">${r.optionId==="none"?"—":moneyUSD(r.supportValue)}</td>
 <td class="num">${r.optionId==="none"?"—":r.containment.toFixed(0)+"%"}</td>
 <td>${r.affordableOptions}</td>
 </tr>`).join("");

 el("hhRowCount").textContent=
 `${rows.length.toLocaleString()} of ${N.toLocaleString()} households`;

 updateHouseholdSortHeaders();
}

function openHouseholdData(){
 const modal=el("householdDataModal");
 modal.hidden=false;
 document.body.classList.add("hh-modal-open");
 renderHouseholdTable(state.currentModel||model());
 el("hhSearch").focus();
}

function closeHouseholdData(){
 el("householdDataModal").hidden=true;
 document.body.classList.remove("hh-modal-open");
}

function exportHouseholdDataCsv(){
 console.info("File export is disabled in the Defender-friendly build.");
}

function budgetAtPercentileForGini(gini,percentile){
 const gni=state.country.gni?.value??state.country.gdp?.value??600;
 const mean=gni*HH_SIZE;
 const sigma=sigmaFromGini(gini);
 const mu=Math.log(Math.max(1,mean))-.5*sigma*sigma;
 const share=clamp(num("budgetShare")/100,.002,.5);

 return Math.exp(mu+sigma*invNorm(percentile))*share;
}

function renderGiniSensitivity(){
 const svg=el("giniSensitivityChart");
 const W=620,H=330,Lf=86,R=22,Tp=24,B=48,iw=W-Lf-R,ih=H-Tp-B;

 const currentGini=state.country.gini?.value??38.5;
 const gMin=15,gMax=65;
 const ginis=Array.from({length:26},(_,i)=>gMin+i*2);

 const series=[
 {label:"Poorest 20% median",q:.10,color:"#c9972b"},
 {label:"Middle 20% median",q:.50,color:"#1677ff"},
 {label:"Richest 20% median",q:.90,color:"#5f8f72"}
 ].map(s=>({
 ...s,
 values:ginis.map(g=>({g,budget:budgetAtPercentileForGini(g,s.q)}))
 }));

 const allBudgets=series.flatMap(s=>s.values.map(v=>v.budget));
 const min=Math.max(.5,Math.min(...allBudgets)*.80);
 const max=Math.max(min*2,Math.max(...allBudgets)*1.15);

 const ly=v=>Math.log(v);
 const la=ly(min),lb=ly(max);
 const sx=g=>Lf+(g-gMin)/(gMax-gMin)*iw;
 const sy=v=>Tp+(lb-ly(Math.max(v,min)))/(lb-la)*ih;

 let out=`<rect width="${W}" height="${H}" fill="#fff"/>`;

 [20,30,40,50,60].forEach(g=>{
 out+=L(sx(g),Tp,sx(g),Tp+ih,"#e2e7ea",1);
 out+=T(sx(g),H-18,String(g),9,"#66717a")
 });

 [1,2,5,10,20,50,100,200,500,1000,2000,5000,10000,20000,50000]
 .filter(v=>v>=min&&v<=max)
 .forEach(v=>{
 out+=L(Lf,sy(v),W-R,sy(v),"#e2e7ea",1);
 out+=T(Lf-8,sy(v)+3,moneyUSD(v),8.5,"#66717a","end")
 });

 series.forEach(s=>{
 let d="";
 s.values.forEach((v,i)=>{
 d+=(i?"L":"M")+sx(v.g).toFixed(1)+" "+sy(v.budget).toFixed(1)+" "
 });
 out+=`<path d="${d}" fill="none" stroke="${s.color}" stroke-width="2.4"/>`;
 });

 const cg=clamp(currentGini,gMin,gMax);
 out+=L(sx(cg),Tp,sx(cg),Tp+ih,"#344054",1.5,"4 4");
 out+=T(
 Math.min(W-R-3,sx(cg)+5),
 Tp+11,
 `Current Gini ${currentGini.toFixed(1)}`,
 8.5,
 "#344054",
 "start",
 700
 );

 out+=T(W/2,H-2,"Gini inequality",10.5,"#314f5d","middle",650);

 out+=`<text x="15" y="${Tp+ih/2}" transform="rotate(-90 15 ${Tp+ih/2})"
 font-size="10.2" fill="#314f5d" text-anchor="middle"
 font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
 font-weight="650">Median sanitation cash budget (${state.currency}/HH, log scale)</text>`;

 svg.innerHTML=out;

 el("giniSensitivityLegend").innerHTML=
 series.map(s=>`<span><i style="background:${s.color}"></i>${s.label}</span>`).join("");
}

function renderCostContainment(){
 const svg=el("costContainmentChart");
 const W=620,H=330,Lf=60,R=18,Tp=24,B=48,iw=W-Lf-R,ih=H-Tp-B;
 const opts=activeOptions().slice().sort((a,b)=>a.usd-b.usd);

 const maxCost=Math.max(...opts.map(o=>o.usd),1);
 const grouped=opts.map(o=>({
 ...o,
 costIndex:o.usd/maxCost*100,
 containment:o.cont
 }));

 const band=iw/grouped.length;
 const barW=Math.min(34,band*.26);
 const sy=v=>Tp+(100-clamp(v,0,100))/100*ih;

 let out=`<rect width="${W}" height="${H}" fill="#fff"/>`;

 [0,20,40,60,80,100].forEach(v=>{
 out+=L(Lf,sy(v),W-R,sy(v),"#e2e7ea",1);
 out+=T(Lf-8,sy(v)+3,String(v),9,"#66717a","end")
 });

 grouped.forEach((o,i)=>{
 const cx=Lf+band*(i+.5);
 const xCost=cx-barW-3;
 const xCont=cx+3;
 const yCost=sy(o.costIndex);
 const yCont=sy(o.containment);

 out+=`<rect x="${xCost}" y="${yCost}" width="${barW}" height="${Tp+ih-yCost}"
 rx="2" fill="#9aa4ad"/>`;

 out+=`<rect x="${xCont}" y="${yCont}" width="${barW}" height="${Tp+ih-yCont}"
 rx="2" fill="${o.color}"/>`;

 out+=T(cx,H-19,o.short,9,"#344054","middle",700);
 out+=T(xCost+barW/2,Math.max(Tp+9,yCost-5),o.costIndex.toFixed(0),8.2,"#67727a","middle",700);
 out+=T(xCont+barW/2,Math.max(Tp+9,yCont-5),o.containment.toFixed(0),8.2,o.color,"middle",700);
 });

 out+=T(W/2,H-2,"Sanitation technology",10.5,"#314f5d","middle",650);

 out+=`<text x="15" y="${Tp+ih/2}" transform="rotate(-90 15 ${Tp+ih/2})"
 font-size="10.2" fill="#314f5d" text-anchor="middle"
 font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
 font-weight="650">Index / score (0–100)</text>`;

 svg.innerHTML=out;

 el("costContainmentLegend").innerHTML=
 `<span><i style="background:#9aa4ad"></i>Cost index (highest cost = 100)</span>`+
 `<span><i style="background:#1677ff"></i>Faecal load kept out</span>`;
}

function renderMessage(m){
 const med=m.hh[499].budget;
 const poor=m.hh.slice(0,400).reduce((s,h)=>s+h.budget,0)/400;
 const cheapest=m.opts.slice().sort((a,b)=>a.price-b.price)[0];

 el("message").innerHTML=
 `Cheapest option: <strong>${cheapest.short}</strong> at <strong>${moneyUSD(cheapest.price)}</strong>. `+
 `Coverage reaches <strong>${pct(m.coverage)}</strong>, but only <strong>${pct(m.poor40)}</strong> among the poorest 40%. `+
 `The current mix keeps an estimated <strong>${pct(m.fecalReduction,1)}</strong> of faecal wet mass out of the environment `+
 `(<strong>${m.fecalAvoidedTonnes.toFixed(0)} t/year</strong> in this 1,000-household demo).`
}


function refreshStrategyView(){
 renderStrategyLab();

 if(state.activePage!=="strategy")return;

 const strategyMapModel=strategyModel();
 renderStrategyMap(strategyMapModel);

 el("strategyMapMeta").innerHTML=
 `<span class="strategy-map-pill">${pct(strategyMapModel.fecalReduction,1)} faecal load kept out</span> · 1,000 households`;
}

function selectedStrategyMapModel(){
 return strategyModel();
}

function render(){
 syncOutputs();

 const m=model();
 state.currentModel=m;

 renderMessage(m);
 renderMap(m);
 renderSide(m);

 if(state.activePage==="strategy"){
 const strategyMapModel=selectedStrategyMapModel();
 renderStrategyMap(strategyMapModel);

 el("strategyMapMeta").innerHTML=
 `<span class="strategy-map-pill">${pct(strategyMapModel.fecalReduction,1)} faecal load kept out</span> · 1,000 households`;
 }

 renderAfford(m);
 renderTrade(m);
 renderTradeBubble(m);
 renderGiniSensitivity();
 renderCostContainment();
 renderStrategyLab();

 if(!el("householdDataModal").hidden){
 renderHouseholdTable(m);
 }

 if(state.globalLoaded)updateGlobalComparison()
}

[
 "budgetShare",
 "subsidy"
].forEach(id=>{
 el(id).addEventListener("input",()=>{
 render();
 if(state.globalLoaded){
 renderLdcTechnologyMix(state.globalRows);
 renderLdcEquityMix(state.globalRows);
 }
 })
});

el("currency").addEventListener("change",e=>{
 state.currency=e.target.value;
 state.strategy.renderCurrency=null;
 updateCountryText();
 renderOptions();
 render()
});

el("country").addEventListener("change",async e=>{
 try{
 await changeCountry(e.target.value);
 }catch(err){
 console.error(err);
 el("countryStatus").textContent="The country could not be loaded. Please try again.";
 setCountryLoading(false);
 }
});


el("homeNav").addEventListener("click",e=>{
 e.preventDefault();
 history.replaceState(null,"","#home");
 showPage("home");
});
el("brandHome").addEventListener("click",()=>{
 history.replaceState(null,"","#home");
 showPage("home");
});
el("brandHome").addEventListener("keydown",e=>{
 if(e.key==="Enter"||e.key===" "){
 e.preventDefault();
 history.replaceState(null,"","#home");
 showPage("home");
 }
});

el("countryNav").addEventListener("click",e=>{
 e.preventDefault();
 history.replaceState(null,"","#country");
 showPage("country");
});
el("globalNav").addEventListener("click",e=>{
 e.preventDefault();
 history.replaceState(null,"","#global");
 showPage("global");
});
el("enterModel").addEventListener("click",()=>{
 history.replaceState(null,"","#country");
 showPage("country");
});
el("enterGlobal").addEventListener("click",()=>{
 history.replaceState(null,"","#global");
 showPage("global");
});
el("globalMetric").addEventListener("change",()=>updateGlobalComparison());
el("validationCountry").addEventListener("change",renderJmpValidation);
el("validationMetric").addEventListener("change",renderJmpValidation);
el("globalSearch").addEventListener("input",()=>{
 if(state.globalLoaded){
 renderGlobalTable(el("globalMetric").value,state.globalRows);
 renderLdcTechnologyMix(state.globalRows);
 renderLdcEquityMix(state.globalRows);
 renderJmpInequalityLinks(state.globalRows);

 const q=(el("globalSearch").value||"").trim().toLowerCase();
 const matches=Object.entries(JMP_BENCHMARK.countries)
 .filter(([iso,d])=>q && (d.country.toLowerCase().includes(q)||iso.toLowerCase().includes(q)));

 if(matches.length===1){
 el("validationCountry").value=matches[0][0];
 }

 renderJmpValidation();
 }
});




el("strategyNav").addEventListener("click",e=>{
 e.preventDefault();
 history.replaceState(null,"","#strategy");
 showPage("strategy");
});

document.querySelectorAll("[data-mechanism]").forEach(btn=>{
 btn.addEventListener("click",()=>{
 state.strategy.mechanism=btn.dataset.mechanism;
 renderStrategyControls();
 refreshStrategyView();
 });
});

el("strategyReset").addEventListener("click",resetStrategyFromCurrent);

el("strategySupport").addEventListener("input",e=>{
 state.strategy.supportPct=clamp(Number(e.target.value)||0,0,80);
 refreshStrategyView();
});

el("strategyEnvelope").addEventListener("input",e=>{
 state.strategy.envelopeUsd=Math.max(0,(Number(e.target.value)||0)/rate());
 refreshStrategyView();
});

el("strategyTakeup").addEventListener("input",e=>{
 state.strategy.takeup=clamp(Number(e.target.value)||100,70,100);
 refreshStrategyView();
});

el("strategyUncertainty").addEventListener("input",e=>{
 state.strategy.uncertaintyPp=clamp(Number(e.target.value)||0,0,30);
 renderStrategyControls();
 refreshStrategyView();
});

el("strategyTechRows").addEventListener("input",e=>{
 const priceId=e.target.dataset.strategyPrice;
 const performanceId=e.target.dataset.strategyPerformance;

 if(priceId){
 state.strategy.prices[priceId]=Math.max(0,(Number(e.target.value)||0)/rate());

 const out=document.querySelector(`[data-strategy-price-out="${priceId}"]`);
 if(out)out.textContent=moneyUSD(state.strategy.prices[priceId]);
 }

 if(performanceId){
 state.strategy.performance[performanceId]=clamp(Number(e.target.value)||0,0,100);

 const out=document.querySelector(`[data-strategy-performance-out="${performanceId}"]`);
 if(out)out.textContent=`${Math.round(state.strategy.performance[performanceId])}%`;
 const rangeOut=document.querySelector(`[data-strategy-range-out="${performanceId}"]`);
 if(rangeOut){
 const c=state.strategy.performance[performanceId],band=state.strategy.uncertaintyPp??10;
 rangeOut.textContent=`${Math.max(0,Math.round(c-band))}–${Math.min(100,Math.round(c+band))}% sensitivity`;
 }
 }

 refreshStrategyView();
});

el("openHouseholdData").addEventListener("click",openHouseholdData);
el("closeHouseholdData").addEventListener("click",closeHouseholdData);


el("hhSearch").addEventListener("input",()=>renderHouseholdTable());
el("hhQuintile").addEventListener("change",()=>renderHouseholdTable());
el("hhDecision").addEventListener("change",()=>renderHouseholdTable());

document.querySelectorAll("#householdDataTable th.hh-sortable").forEach(th=>{
 th.addEventListener("click",e=>{
 if(e.target.closest(".info-tip"))return;

 const key=th.dataset.hhSort;

 if(state.hhTableSort.key===key){
 state.hhTableSort.dir=state.hhTableSort.dir==="asc"?"desc":"asc";
 }else{
 state.hhTableSort.key=key;
 state.hhTableSort.dir=key==="decision"?"asc":"desc";
 if(["houseId","wealthRank","quintile"].includes(key)){
 state.hhTableSort.dir="asc";
 }
 }

 renderHouseholdTable();
 });
});

el("householdDataModal").addEventListener("click",e=>{
 if(e.target===el("householdDataModal"))closeHouseholdData();
});

document.addEventListener("keydown",e=>{
 if(e.key==="Escape" && !el("householdDataModal").hidden){
 closeHouseholdData();
 }
});

document.querySelectorAll("#countryComparisonTable th.sortable").forEach(th=>{
 th.addEventListener("click",e=>{
 if(e.target.closest(".info-tip"))return;
 const key=th.dataset.sort;

 if(state.globalTableSort.key===key){
 state.globalTableSort.dir=state.globalTableSort.dir==="asc"?"desc":"asc";
 }else{
 state.globalTableSort.key=key;
 state.globalTableSort.dir=key==="country"?"asc":"desc";
 }

 if(state.globalLoaded){
 renderGlobalTable(el("globalMetric").value,state.globalRows);
 }
 });
});

function positionHelpTooltip(node){
 const tip=el("tooltip");
 const r=node.getBoundingClientRect();
 const left=Math.min(window.innerWidth-245,Math.max(8,r.left+r.width+7));
 const top=Math.min(window.innerHeight-80,Math.max(8,r.top-4));
 tip.style.left=left+"px";
 tip.style.top=top+"px";
}
function showHelpTooltip(node){
 const text=node.dataset.help;
 if(!text)return;
 const tip=el("tooltip");
 tip.textContent=text;
 tip.style.display="block";
 positionHelpTooltip(node);
}
function hideHelpTooltip(){
 el("tooltip").style.display="none";
}
document.querySelectorAll(".info-tip").forEach(node=>{
 node.setAttribute("aria-label","More information");

 node.addEventListener("mouseenter",()=>showHelpTooltip(node));
 node.addEventListener("mouseleave",hideHelpTooltip);
 node.addEventListener("focus",()=>showHelpTooltip(node));
 node.addEventListener("blur",hideHelpTooltip);
 node.addEventListener("click",e=>{
 e.preventDefault();
 e.stopPropagation();
 showHelpTooltip(node);
 });
});
document.addEventListener("click",e=>{
 if(!e.target.closest(".info-tip"))hideHelpTooltip();
});

async function init(){
 renderSyntheticBase();

 await Promise.all([
 loadFX(),
 loadCountries()
 ]);

 await changeCountry("MWI");
 const route=
 location.hash==="#global"?"global":
 location.hash==="#strategy"?"strategy":
 location.hash==="#country"?"country":
 "home";
 showPage(route)
}

renderSyntheticBase();
initJmpValidationControls();
updateCountryText();
syncOutputs();
applyCountryCostDefaults("MWI");
renderOptions();
render();
init();
