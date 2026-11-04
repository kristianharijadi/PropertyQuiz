/**
 * EXPLICIT DEMONSTRATION CATALOG. Names, project descriptions and public image URLs
 * reference public Sinar Mas Land / eCatalog pages (see README). Scores are SYNTHETIC;
 * DO NOT publish them as actual verifiable facts. Availability is intentionally UNKNOWN.
 */
export const ASSETS = {
  logo: 'https://www.sinarmas.com/units/UNIT3B.png',
  hero: 'https://cms.sinarmasland.com/uploads/Foto_2_Nava_Park_4203a61fc7.jpg',
  navapark: 'https://cms.sinarmasland.com/uploads/Foto_2_Nava_Park_4203a61fc7.jpg',
  castilo: 'https://cms.sinarmasland.com/uploads/Foto_3_Artist_Impression_Terravia_Castilo_di_BSD_City_be5bf2eeda.jpg',
  castiloFacade: 'https://www.bsdcity.com/app/uploads/2026/05/Cl-Terravia-3-13-IM-EXT-D-MEV-Fasad-Deret-T65-FInal_1-scaled.jpg',
  vyorelle: 'https://i.ibb.co.com/00qW6TN/V27-R2-T5-Exterior-Deret-2.jpg',
  vyorelleNature: 'https://i.ibb.co.com/yc6D6R0K/Copy-of-V15-R3-T5-5-River-2.jpg',
  monard: 'https://i.ibb.co.com/m5X0FLWK/Monard-T9-side.jpg',
  hiera: 'https://ecatalog.sinarmasland.com/assets/cluster-files/6/frontyard670769d4400d4-OSQrqEvMWmf0tTMJKFnChqH2XyANpFP0QEPZCggT.webp',
  office: 'https://www.bsdcity.com/app/uploads/2021/12/Foto-3-Gedung-Perkantoran-di-BSD-Green-Office-Park.jpeg',
  community: 'https://www.terravia-bsdcity.id/assets/clusters/catilo/gallery/castilo-teravia-bsd-3.webp'
} as const;

export const LIFESTYLES = [
  {id:'career',title:'Career & Business',description:'Karier dan konektivitas',icon:'briefcase-business',image:ASSETS.office},
  {id:'family',title:'Family & Education',description:'Keluarga jadi prioritas',icon:'graduation-cap',image:ASSETS.vyorelleNature},
  {id:'wellness',title:'Health & Wellness',description:'Aktif dan seimbang',icon:'activity',image:ASSETS.community},
  {id:'dining',title:'Dining & Entertainment',description:'Selalu ada cerita baru',icon:'coffee',image:ASSETS.castilo},
  {id:'nature',title:'Nature & Relaxation',description:'Hidup lebih dekat alam',icon:'trees',image:ASSETS.navapark},
  {id:'shopping',title:'Shopping & Convenience',description:'Semua dalam jangkauan',icon:'shopping-bag',image:ASSETS.hiera}
] as const;
export const DESTINATIONS = [
  {id:'office',title:'Office / Business District',icon:'briefcase-business'},
  {id:'school',title:'School / University',icon:'graduation-cap'},
  {id:'mall',title:'Shopping Mall / Retail',icon:'shopping-bag'},
  {id:'cafe',title:'Restaurant / Cafe',icon:'coffee'},
  {id:'sports',title:'Gym / Sports Club',icon:'dumbbell'},
  {id:'hospital',title:'Hospital / Healthcare',icon:'heart-pulse'},
  {id:'family',title:'Family & Relatives',icon:'users'},
  {id:'transport',title:'Transportation Hub',icon:'train-front'},
  {id:'leisure',title:'Entertainment & Recreation',icon:'ticket'}
] as const;
export const PRIORITIES = [
  {id:'workplace',title:'Easy Access to Workplace',icon:'building-2'},
  {id:'school',title:'Close to Children’s School',icon:'graduation-cap'},
  {id:'green',title:'Green & Open Spaces',icon:'trees'},
  {id:'sports',title:'Sports & Wellness Facilities',icon:'dumbbell'},
  {id:'dining',title:'Dining & Entertainment',icon:'coffee'}
] as const;
export const WEEKENDS = [
  {id:'social',title:'The Social Explorer',subtitle:'Coffee, conversations & city strolls',image:ASSETS.castilo},
  {id:'family',title:'The Family Companion',subtitle:'A little more time for the people you love',image:ASSETS.vyorelleNature},
  {id:'active',title:'The Active Adventurer',subtitle:'Move, explore & feel alive',image:ASSETS.community},
  {id:'urban',title:'The Urban Enthusiast',subtitle:'Discover what the city has to offer',image:ASSETS.office},
  {id:'nature',title:'The Nature Seeker',subtitle:'Take it slow, breathe it all in',image:ASSETS.navapark}
] as const;
export const TRAVEL = [
  {id:'under15',title:'Under 15 minutes',short:'<15 min'},
  {id:'15to30',title:'15–30 minutes',short:'15–30'},
  {id:'30to45',title:'30–45 minutes',short:'30–45'},
  {id:'over45',title:'More than 45 minutes',short:'>45 min'},
  {id:'notConcern',title:'Distance is not a major concern',short:'Flexible'}
] as const;
export const ENVIRONMENTS = [
  {id:'urban',title:'Urban & Connected',description:'Everything moves with your rhythm.',image:ASSETS.office},
  {id:'green',title:'Green & Peaceful',description:'More fresh air. A gentler pace.',image:ASSETS.navapark},
  {id:'integrated',title:'Integrated & Convenient',description:'A thoughtful balance of daily needs.',image:ASSETS.castilo},
  {id:'private',title:'Private & Exclusive',description:'Personal space, elevated living.',image:ASSETS.monard}
] as const;

export type Criterion = 'workplace' | 'education' | 'lifestyle' | 'environment' | 'connectivity';
export type Property = {
 id:string; name:string; township:string; category:string; description:string;
 image:string; priceMinBillion:number; priceLabel:string; sourceUrl:string;
 amenities:string[]; nearby:string[]; tags:string[];
 scores:Record<Criterion,number>; upgrade:boolean; segment:string;
 /** For demo catalog these are not independently verified. */
 verifiedScores:false;
};
export const PROPERTIES:Property[] = [
 {id:'vyorelle',name:'Vyorelle at Vireya',township:'BSD City',category:'A refreshing new beginning',description:'Karakter rumah modern dengan detail lengkung dan lingkungan yang terasa hangat.',image:ASSETS.vyorelle,priceMinBillion:1.2,priceLabel:'Mulai ± Rp1,2 M',sourceUrl:'https://www.sinarmasland.com/development/residential/vyorelle-at-vireya',amenities:['Jogging track','Club house','Keamanan kawasan'],nearby:['Kawasan BSD City','Akses kawasan terintegrasi'],tags:['integrated','family','urban'],scores:{workplace:80,education:78,lifestyle:78,environment:72,connectivity:79},upgrade:false,segment:'compact',verifiedScores:false},
 {id:'castilo',name:'Castilo at Terravia',township:'BSD City',category:'Classic comfort for new chapters',description:'Arsitektur American Classic modern dengan sentuhan hijau di lingkungan hunian.',image:ASSETS.castiloFacade,priceMinBillion:1.9,priceLabel:'Mulai ± Rp1,9 M',sourceUrl:'https://www.sinarmasland.com/development/residential/castilo-at-terravia',amenities:['Area komunal','Ruang hijau','Fasilitas kawasan'],nearby:['BSD City','Gading Serpong (akses kawasan)'],tags:['family','green','integrated'],scores:{workplace:75,education:87,lifestyle:79,environment:89,connectivity:74},upgrade:false,segment:'family',verifiedScores:false},
 {id:'wynyard',name:'Wynyard at Hiera',township:'BSD City',category:'Modern, active, connected',description:'Pilihan hunian modern dengan tata ruang vertikal di kawasan Hiera.',image:ASSETS.hiera,priceMinBillion:3.3,priceLabel:'Mulai ± Rp3,3 M',sourceUrl:'https://ecatalog.sinarmasland.com/project/hiera/cluster/wynyard',amenities:['Hunian modern','Kawasan Hiera'],nearby:['BSD City','Fasilitas kawasan'],tags:['urban','integrated','family'],scores:{workplace:88,education:83,lifestyle:92,environment:76,connectivity:91},upgrade:false,segment:'modern',verifiedScores:false},
 {id:'monard8',name:'Monard of The Armont',township:'BSD City',category:'Modern European Royal Living',description:'Hunian premium dengan inner courtyard, arsitektur tropis klasik dan fasilitas eksklusif.',image:ASSETS.monard,priceMinBillion:4.874,priceLabel:'Type 8 mulai ± Rp4,87 M',sourceUrl:'https://www.sinarmasland.com/development/residential/monard-of-the-armont',amenities:['Le Gran Clubhouse','Inner courtyard','Taman & playground'],nearby:['Eastvara','ACS School'],tags:['private','family','green'],scores:{workplace:77,education:94,lifestyle:88,environment:96,connectivity:85},upgrade:true,segment:'premium',verifiedScores:false},
 {id:'monard9',name:'Monard Type 9',township:'BSD City',category:'More room for what matters',description:'Versi rumah Monard dengan ruang lebih luas untuk keluarga yang terus bertumbuh.',image:ASSETS.monard,priceMinBillion:6.795,priceLabel:'Type 9 mulai ± Rp6,79 M',sourceUrl:'https://www.sinarmasland.com/development/residential/monard-of-the-armont',amenities:['Le Gran Clubhouse','4 kamar tidur','Inner courtyard'],nearby:['Eastvara','ACS School'],tags:['private','family','green'],scores:{workplace:78,education:95,lifestyle:88,environment:97,connectivity:85},upgrade:true,segment:'premium-large',verifiedScores:false},
 {id:'navapark',name:'Island Villa at NavaPark',township:'BSD City',category:'Private resort-style living',description:'Resort-style luxury living dengan lanskap hijau dan area privat.',image:ASSETS.navapark,priceMinBillion:90,priceLabel:'Mulai ± Rp90 M',sourceUrl:'https://www.sinarmasland.com/development/township/bsd-city',amenities:['Private garden','Resort-style living','Lanskap hijau'],nearby:['NavaPark','BSD City'],tags:['private','green','nature'],scores:{workplace:80,education:87,lifestyle:89,environment:99,connectivity:82},upgrade:true,segment:'ultraluxury',verifiedScores:false}
];
