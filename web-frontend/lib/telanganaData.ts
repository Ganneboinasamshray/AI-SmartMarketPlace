// Telangana 33 Districts, Mandals, and Villages Dataset
// Strictly Telangana state - Zero other states allowed

export interface TelanganaDistrictInfo {
  id: string;
  name: string;
  headquarters: string;
  mandals: string[];
}

export const TELANGANA_DISTRICTS: string[] = [
  "Adilabad",
  "Bhadradri Kothagudem",
  "Hanumakonda",
  "Hyderabad",
  "Jagtial",
  "Jangaon",
  "Jayashankar Bhupalpally",
  "Jogulamba Gadwal",
  "Kamareddy",
  "Karimnagar",
  "Khammam",
  "Kumuram Bheem Asifabad",
  "Mahabubabad",
  "Mahabubnagar",
  "Mancherial",
  "Medak",
  "Medchal-Malkajgiri",
  "Mulugu",
  "Nagarkurnool",
  "Nalgonda",
  "Narayanpet",
  "Nirmal",
  "Nizamabad",
  "Peddapalli",
  "Rajanna Sircilla",
  "Ranga Reddy",
  "Sangareddy",
  "Siddipet",
  "Suryapet",
  "Vikarabad",
  "Wanaparthy",
  "Warangal",
  "Yadadri Bhuvanagiri"
];

export const TELANGANA_MANDALS_MAP: Record<string, string[]> = {
  "Adilabad": ["Adilabad Urban", "Adilabad Rural", "Bela", "Boath", "Gudihathnur", "Ichoda", "Jainath", "Mavala", "Narnoor", "Tamsi", "Utnoor"],
  "Bhadradri Kothagudem": ["Kothagudem", "Palwancha", "Yellandu", "Bhadrachalam", "Manuguru", "Aswapuram", "Burgampahad", "Chandrugonda", "Julurpad"],
  "Hanumakonda": ["Hanumakonda", "Kazipet", "Hasanparthy", "Inavolu", "Bheemadevarpalli", "Elkathurthi", "Kamalapur", "Parkal", "Shayampet"],
  "Hyderabad": ["Amberpet", "Asifnagar", "Bahadurpura", "Bandlaguda", "Charminar", "Golconda", "Himayatnagar", "Khairatabad", "Musheerabad", "Saidabad", "Secunderabad", "Shaikpet"],
  "Jagtial": ["Jagtial", "Jagtial Rural", "Raikal", "Sarangapur", "Beerpur", "Dharmapuri", "Buggaram", "Korutla", "Metpalli", "Mallapur", "Ibrahimpatnam"],
  "Jangaon": ["Jangaon", "Bachannapet", "Devaruppula", "Ghanpur (Station)", "Lingalaghanpur", "Narmetta", "Raghunathpalle", "Tarigoppula", "Zaffergadh"],
  "Jayashankar Bhupalpally": ["Bhupalpally", "Chityal", "Ghanpur", "Kataram", "Mahadevpur", "Malharrao", "Mogullapalle", "Palimela", "Regonda", "Tekumatla"],
  "Jogulamba Gadwal": ["Gadwal", "Alampur", "Dharur", "Ghattu", "Ieeja", "Itikyal", "Maldakal", "Manopad", "Rajoli", "Undavelly", "Waddepalle"],
  "Kamareddy": ["Kamareddy", "Banswada", "Bhiknoor", "Bibipet", "Birkur", "Domakonda", "Gandhari", "Jukkal", "Machareddy", "Madnoor", "Nizamsagar", "Pitlam", "Sadashivanagar", "Yellareddy"],
  "Karimnagar": ["Karimnagar", "Karimnagar Rural", "Choppadandi", "Gangadhara", "Ganneruvaram", "Huzurabad", "Jammikunta", "Manakondur", "Ramadugu", "Shankarapatnam", "Thimmapur", "Veenavanka"],
  "Khammam": ["Khammam Urban", "Khammam Rural", "Bonakal", "Chintakani", "Enkuru", "Kalluru", "Konavarigudem", "Kusumanchi", "Madhira", "Mudigonda", "Penuballi", "Sathupalli", "Thirumalayapalem", "Wyra"],
  "Kumuram Bheem Asifabad": ["Asifabad", "Jainoor", "Kagaznagar", "Kerameri", "Lingapur", "Penchikalpet", "Rebbena", "Sirpur (T)", "Tiryani", "Wankdi"],
  "Mahabubabad": ["Mahabubabad", "Bayyaram", "Dornakal", "Garla", "Gudur", "Kesamudram", "Kothaguda", "Kuravi", "Maripeda", "Nellikudur", "Thorrur"],
  "Mahabubnagar": ["Mahabubnagar Urban", "Mahabubnagar Rural", "Balanagar", "Bhoothpur", "C.C. Kunta", "Devarkadra", "Gandeed", "Hanwada", "Jadcherla", "Koilkonda", "Midjil", "Moosapet", "Nawabpet", "Rajaapur"],
  "Mancherial": ["Mancherial", "Bellampalli", "Chennur", "Dandepally", "Hajipur", "Jaipur", "Jannaram", "Kotapally", "Luxettipet", "Mandamarri", "Nennal", "Vemanpally"],
  "Medak": ["Medak", "Alladurg", "Chegunta", "Havelighanpur", "Kulcharam", "Manoor", "Narsapur", "Papannapet", "Ramayampet", "Regode", "Shankarampet (A)", "Shankarampet (R)", "Shivampet", "Tekmal", "Tupran", "Yeldurthy"],
  "Medchal-Malkajgiri": ["Medchal", "Alwal", "Ghatkesar", "Kapra", "Keesara", "Kukatpally", "Malkajgiri", "Muduchintalapalli", "Quthbullapur", "Shamirpet"],
  "Mulugu": ["Mulugu", "Govindaraopet", "Mangapet", "Mulug", "SS Tadwai", "Venkatapur", "Venkatapuram (Nuugur)", "Wazeed"],
  "Nagarkurnool": ["Nagarkurnool", "Achampet", "Amrabad", "Bijinapalle", "Kalwakurthy", "Kollapur", "Lingal", "Padara", "Telkapally", "Thimmajipet", "Urkonda", "Vangoor"],
  "Nalgonda": ["Nalgonda", "Chandur", "Chityal", "Devarakonda", "Gundlapally", "Kangal", "Kattangur", "Miryalaguda", "Munugode", "Nakrekal", "Narketpally", "Nidamanoor", "Pedda Adiserla Pally", "Shaligouraram", "Thipparthy", "Vemulapally"],
  "Narayanpet": ["Narayanpet", "Damaragidda", "Dhanwada", "Koilkonda", "Kosgi", "Krishna", "Maddur", "Maganoor", "Makthal", "Marikal", "Utkoor"],
  "Nirmal": ["Nirmal Urban", "Nirmal Rural", "Bhainsa", "Dilawarpur", "Kaddam (Peddur)", "Khanapur", "Kuntala", "Laxmanchanda", "Mamada", "Mudhole", "Sarangapur", "Soan", "Tanur"],
  "Nizamabad": ["Nizamabad North", "Nizamabad South", "Nizamabad Rural", "Armoor", "Balkonda", "Bheemgal", "Bodhan", "Dichpally", "Jakranpally", "Kotgiri", "Makloor", "Mopal", "Navipet", "Ranjal", "Rudrur", "Varni", "Velpur", "Yedapally"],
  "Peddapalli": ["Peddapalli", "Anthergaon", "Dharmaram", "Eligaid", "Julapalli", "Kamanpur", "Manthani", "Mutharam (Manthani)", "Odela", "Ramagundam", "Srirampur", "Sulthanabad"],
  "Rajanna Sircilla": ["Sircilla", "Boinpalli", "Chandurthi", "Gambhiraopet", "Illanthakunta", "Konaraopet", "Mustabad", "Rudrangi", "Thangallapalli", "Veernapalli", "Vemulawada", "Vemulawada Rural", "Yellareddypet"],
  "Ranga Reddy": ["Chevella", "Farooqnagar", "Hayathnagar", "Ibrahimpatnam", "Kandukur", "Keshampet", "Kondurg", "Kothur", "Maheshwaram", "Manchal", "Moinabad", "Nandigama", "Rajendranagar", "Saroornagar", "Shahbad", "Shamshabad", "Shabad", "Talakondapalle", "Yacharam"],
  "Sangareddy": ["Sangareddy", "Ameenpur", "Andole", "Ghatkesar", "Hathnoora", "Jharasangam", "Kandi", "Kohir", "Kondapur", "Munipally", "Narayankhed", "Patancheru", "Pulkal", "Raicode", "Sadasivpet", "Sirgapoor", "Vatpally", "Zaheerabad"],
  "Siddipet": ["Siddipet Urban", "Siddipet Rural", "Bejjanki", "Cheriyal", "Chinnakodur", "Dhoolmitta", "Doultabad", "Gajwel", "Husnabad", "Jagdevpur", "Kondapak", "Koheda", "Komuravelli", "Markook", "Mulug", "Mirdoddi", "Nangnoor", "Raipole", "Thoguta", "Wargal"],
  "Suryapet": ["Suryapet", "Atmakur (S)", "Chilkur", "Chivvemla", "Garidepally", "Huzurnagar", "Jaggayyapet", "Kodad", "Mattampally", "Mellachervu", "Mothey", "Munagala", "Neredcherla", "Penpahad", "Thirumalagiri"],
  "Vikarabad": ["Vikarabad", "Bantwaram", "Basheerabad", "Chowdapur", "Dharur", "Doma", "Kodhagal", "Kotepally", "Kulkacherla", "Marpalle", "Mominpet", "Nawabpet", "Pargi", "Pudur", "Tandur", "Yalal"],
  "Wanaparthy": ["Wanaparthy", "Amarchinta", "Atmakur", "Chinnambavi", "Ghanpur", "Gopalpete", "Kothakota", "Madnapoor", "Pangal", "Pebbair", "Peddamandadi", "Revally", "Srirangapur", "Veepangandla"],
  "Warangal": ["Warangal", "Chennaraopet", "Duggondi", "Geesugonda", "Khila Warangal", "Nallabelly", "Narsampet", "Nekkonda", "Parvathagiri", "Rayaparthy", "Sangem", "Wardhannapet"],
  "Yadadri Bhuvanagiri": ["Bhongir", "Alair", "Atmakur (M)", "Bibinagar", "Bommalaramaram", "Choutuppal", "Gundala", "Mothkur", "Narayanpur", "Pochampally", "Rajapet", "Ramannapet", "Turkapally", "Valigonda", "Yadagirigutta"]
};

// Major agricultural vegetables commonly grown across Telangana
export const TELANGANA_VEGETABLE_CROPS = [
  { name: "Tomato", category: "Vegetables", varieties: ["Hybrid Roma Red", "Arka Rakshak", "Desi Local Red"], defaultPrice: 28 },
  { name: "Green Chilli", category: "Spices & Seasoning", varieties: ["Guntur Teja Polyhouse", "Pusa Jwala", "Kalyani Green"], defaultPrice: 38 },
  { name: "Capsicum (Bell Pepper)", category: "Vegetables", varieties: ["Green Polyhouse Wonder", "Indra Yellow", "Bomby Red"], defaultPrice: 46 },
  { name: "Brinjal (Eggplant)", category: "Vegetables", varieties: ["Bhagyamati Purple Round", "Pusa Purple Long", "Panniyur Green"], defaultPrice: 24 },
  { name: "Spinach (Palak)", category: "Leafy Greens", varieties: ["Desi All-Green Leafy", "Pusa Bharati", "All Green Wonder"], defaultPrice: 20 },
  { name: "Cabbage", category: "Vegetables", varieties: ["Golden Acre Hybrid", "Pusa Drumhead", "Green Express"], defaultPrice: 18 },
  { name: "Cauliflower", category: "Vegetables", varieties: ["Snowball Early White", "Pusa Deepali", "Pusa Snowball"], defaultPrice: 26 },
  { name: "Bottle Gourd (Sorakaya)", category: "Gourds", varieties: ["Pusa Naveen Long", "Arka Bahar", "Desi Cylindrical"], defaultPrice: 22 },
  { name: "Bitter Gourd (Kakarakaya)", category: "Gourds", varieties: ["Coimbatore Long Green", "Pusa Do Mausami", "Arka Harit"], defaultPrice: 34 },
  { name: "Ridge Gourd (Beerakaya)", category: "Gourds", varieties: ["Pusa Nasdar", "Arka Sumeet", "Desi Tender Green"], defaultPrice: 30 },
  { name: "Cucumber (Dosakaya)", category: "Gourds", varieties: ["Poinsett Crispy Green", "Telangana Yellow Nakka Dosakaya", "Malini Hybrid"], defaultPrice: 20 },
  { name: "Lady Finger (Bhendi)", category: "Vegetables", varieties: ["Parbhani Kranti", "Pusa Sawani", "Arka Anamika"], defaultPrice: 32 },
  { name: "Cluster Beans (Goruchikkudu)", category: "Vegetables", varieties: ["Pusa Navbahar", "Pusa Sadabahar", "Desi Local Tender"], defaultPrice: 28 },
  { name: "Green Beans (French Beans)", category: "Vegetables", varieties: ["Falguni Bush Beans", "Contender Bush", "Arka Komal"], defaultPrice: 42 },
  { name: "Onion", category: "Vegetables", varieties: ["Nasik Red Globe", "Bhima Super", "Pusa Red"], defaultPrice: 26 },
  { name: "Potato", category: "Tubers", varieties: ["Kufri Jyoti Mountain", "Kufri Chandramukhi", "Desi Red Potato"], defaultPrice: 24 },
  { name: "Carrot", category: "Tubers", varieties: ["Pusa Kesar Orange", "Nantes Half Long", "Super Kuroda"], defaultPrice: 36 },
  { name: "Fresh Ginger (Allam)", category: "Spices & Seasoning", varieties: ["Zaheerabad Maran Variety", "Rio de Janeiro", "Nadia Aromatic"], defaultPrice: 68 },
  { name: "Fresh Garlic Bulbs", category: "Spices & Seasoning", varieties: ["Telangana Local White", "Yamuna Safed", "G-282 Big Cloves"], defaultPrice: 115 },
  { name: "Coriander Leaves (Kothimeera)", category: "Leafy Greens", varieties: ["Desi Super Fragrant", "Pant Haritima", "Sadhana High Aroma"], defaultPrice: 25 },
  { name: "Fenugreek (Methi)", category: "Leafy Greens", varieties: ["Pusa Early Bunching", "Kasuri Methi Desi", "RMT-1"], defaultPrice: 22 },
  { name: "Drumstick (Munakkaya)", category: "Vegetables", varieties: ["PKM-1 Annual", "PKM-2 Tender", "Odc Long Tender"], defaultPrice: 40 }
];

export const TELANGANA_VEGETABLE_CATEGORIES = [
  "All",
  "Vegetables",
  "Leafy Greens",
  "Gourds",
  "Tubers",
  "Spices & Seasoning"
];

export function isValidTelanganaDistrict(district: string): boolean {
  return TELANGANA_DISTRICTS.includes(district);
}

export function getMandalsForDistrict(district: string): string[] {
  return TELANGANA_MANDALS_MAP[district] || ["Headquarters Mandal", "Rural Mandal"];
}
