export interface UniversityMapData {
  id: string;
  lat: number;
  lng: number;
  website: string;
  imageUrl: string;
  durationYears: number;
  countryColor: string;
}

const WP = (filename: string) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${filename}?width=800`;

export const universityMapData: UniversityMapData[] = [
  // ── Hollanda ──

  // ── İtalya ──

  // ── Almanya ──

  // ── Fransa ──

  // ── İspanya ──

  // ── İngiltere ──

  // ── İsviçre ──

  // ── İsveç ──

  // ── Belçika ──

  // ── Danimarka ──

  // ── Norveç ──

  // ── Finlandiya ──

  // ── Portekiz ──

  // ── İrlanda ──

  // ── Avusturya ──

  // ── Polonya ──

  // ── Çekya ──

  // ── Macaristan ──

  // ══ BACHELOR PROGRAMLARI ══

  // Hollanda
  { id: "tu-delft-bsc-ae", lat: 51.9975, lng: 4.3748, website: "https://www.tudelft.nl", imageUrl: "", durationYears: 3, countryColor: "#f59e0b" },
  { id: "tu-delft-bsc-cs", lat: 51.9980, lng: 4.3750, website: "https://www.tudelft.nl", imageUrl: "", durationYears: 3, countryColor: "#f59e0b" },
  { id: "amsterdam-bsc-economics", lat: 52.3567, lng: 4.9557, website: "https://www.uva.nl", imageUrl: "", durationYears: 3, countryColor: "#f59e0b" },
  { id: "amsterdam-bsc-cs", lat: 52.3562, lng: 4.9560, website: "https://www.uva.nl", imageUrl: "", durationYears: 3, countryColor: "#f59e0b" },
  { id: "groningen-bsc-psychology", lat: 53.2197, lng: 6.5670, website: "https://www.rug.nl", imageUrl: "", durationYears: 3, countryColor: "#f59e0b" },
  { id: "groningen-bsc-ir", lat: 53.2200, lng: 6.5673, website: "https://www.rug.nl", imageUrl: "", durationYears: 3, countryColor: "#f59e0b" },
  { id: "maastricht-bsc-business", lat: 50.8470, lng: 5.6876, website: "https://www.maastrichtuniversity.nl", imageUrl: "", durationYears: 3, countryColor: "#f59e0b" },
  { id: "eindhoven-bsc-me", lat: 51.4480, lng: 5.4907, website: "https://www.tue.nl", imageUrl: "", durationYears: 3, countryColor: "#f59e0b" },
  // İtalya
  { id: "bocconi-bsc-economics", lat: 45.4489, lng: 9.1902, website: "https://www.unibocconi.eu", imageUrl: "", durationYears: 3, countryColor: "#22c55e" },
  { id: "bocconi-bsc-business", lat: 45.4495, lng: 9.1908, website: "https://www.unibocconi.eu", imageUrl: "", durationYears: 3, countryColor: "#22c55e" },
  { id: "polimi-bsc-eng", lat: 45.4789, lng: 9.2283, website: "https://www.polimi.it", imageUrl: "", durationYears: 3, countryColor: "#22c55e" },
  { id: "bologna-bsc-business", lat: 44.4971, lng: 11.3527, website: "https://www.unibo.it", imageUrl: "", durationYears: 3, countryColor: "#22c55e" },
  // Almanya
  { id: "tum-bsc-management", lat: 48.2635, lng: 11.6693, website: "https://www.tum.de", imageUrl: "", durationYears: 3, countryColor: "#3b82f6" },
  { id: "rwth-bsc-business", lat: 50.7804, lng: 6.0660, website: "https://www.rwth-aachen.de", imageUrl: "", durationYears: 3, countryColor: "#3b82f6" },
  { id: "jacobs-bsc-cs", lat: 53.1068, lng: 8.8524, website: "https://www.jacobs-university.de", imageUrl: "", durationYears: 3, countryColor: "#3b82f6" },
  // İngiltere
  { id: "ucl-bsc-economics", lat: 51.5249, lng: -0.1343, website: "https://www.ucl.ac.uk", imageUrl: "", durationYears: 3, countryColor: "#3b82f6" },
  { id: "imperial-bsc-cs", lat: 51.4995, lng: -0.1755, website: "https://www.imperial.ac.uk", imageUrl: "", durationYears: 3, countryColor: "#3b82f6" },
  { id: "edinburgh-bsc-cs", lat: 55.9449, lng: -3.1878, website: "https://www.ed.ac.uk", imageUrl: "", durationYears: 4, countryColor: "#3b82f6" },
  { id: "warwick-bsc-economics", lat: 52.3841, lng: -1.5619, website: "https://www.warwick.ac.uk", imageUrl: "", durationYears: 3, countryColor: "#3b82f6" },
  { id: "manchester-bsc-business", lat: 53.4671, lng: -2.2342, website: "https://www.manchester.ac.uk", imageUrl: "", durationYears: 3, countryColor: "#3b82f6" },
  { id: "kcl-bsc-business", lat: 51.5115, lng: -0.1160, website: "https://www.kcl.ac.uk", imageUrl: "", durationYears: 3, countryColor: "#3b82f6" },
  // İsveç
  { id: "lund-bsc-economics", lat: 55.7120, lng: 13.2097, website: "https://www.lunduniversity.lu.se", imageUrl: "", durationYears: 3, countryColor: "#fbbf24" },
  // Danimarka
  { id: "cbs-bsc-business", lat: 55.6819, lng: 12.5278, website: "https://www.cbs.dk", imageUrl: "", durationYears: 3, countryColor: "#60a5fa" },
  // İspanya
  { id: "ie-bsc-business", lat: 40.4481, lng: -3.6926, website: "https://www.ie.edu", imageUrl: "", durationYears: 4, countryColor: "#ef4444" },
  { id: "ie-bsc-cs", lat: 40.4483, lng: -3.6929, website: "https://www.ie.edu", imageUrl: "", durationYears: 4, countryColor: "#ef4444" },
  // İrlanda
  { id: "trinity-bsc-business", lat: 53.3442, lng: -6.2549, website: "https://www.tcd.ie", imageUrl: "", durationYears: 4, countryColor: "#22c55e" },
  { id: "trinity-bsc-cs", lat: 53.3445, lng: -6.2552, website: "https://www.tcd.ie", imageUrl: "", durationYears: 4, countryColor: "#22c55e" },
  // Çekya
  { id: "charles-bsc-economics", lat: 50.0850, lng: 14.4414, website: "https://www.cuni.cz", imageUrl: "", durationYears: 3, countryColor: "#3b82f6" },
  // Macaristan
  { id: "corvinus-bsc-business", lat: 47.4774, lng: 19.0616, website: "https://www.uni-corvinus.hu", imageUrl: "", durationYears: 3, countryColor: "#f59e0b" },
  // Polonya
  { id: "kozminski-bsc-management", lat: 52.2537, lng: 20.9232, website: "https://www.kozminski.edu.pl", imageUrl: "", durationYears: 3, countryColor: "#ef4444" },

  // ── Hollanda (Bachelor) ──
  { id: "erasmus-bsc-economics", lat: 51.9173, lng: 4.5263, website: "https://www.eur.nl", imageUrl: "", durationYears: 3, countryColor: "#f59e0b" },
  { id: "erasmus-bsc-iba", lat: 51.9176, lng: 4.5266, website: "https://www.rsm.nl", imageUrl: "", durationYears: 3, countryColor: "#f59e0b" },
  { id: "erasmus-bsc-econometrics", lat: 51.9179, lng: 4.5269, website: "https://www.eur.nl", imageUrl: "", durationYears: 3, countryColor: "#f59e0b" },
  { id: "utrecht-bsc-economics", lat: 52.0843, lng: 5.1744, website: "https://www.uu.nl", imageUrl: "", durationYears: 3, countryColor: "#f59e0b" },
  { id: "utrecht-bsc-las", lat: 52.0890, lng: 5.1136, website: "https://www.uu.nl", imageUrl: "", durationYears: 3, countryColor: "#f59e0b" },
  { id: "leiden-bsc-polsci", lat: 52.1574, lng: 4.4857, website: "https://www.universiteitleiden.nl", imageUrl: "", durationYears: 3, countryColor: "#f59e0b" },
  { id: "leiden-bsc-ir", lat: 52.0870, lng: 4.3284, website: "https://www.universiteitleiden.nl", imageUrl: "", durationYears: 3, countryColor: "#f59e0b" },
  { id: "leiden-bsc-psychology", lat: 52.1568, lng: 4.4850, website: "https://www.universiteitleiden.nl", imageUrl: "", durationYears: 3, countryColor: "#f59e0b" },
  { id: "vu-bsc-ba", lat: 52.3338, lng: 4.8650, website: "https://www.vu.nl", imageUrl: "", durationYears: 3, countryColor: "#f59e0b" },
  { id: "vu-bsc-ib", lat: 52.3341, lng: 4.8653, website: "https://www.vu.nl", imageUrl: "", durationYears: 3, countryColor: "#f59e0b" },
  { id: "tilburg-bsc-iba", lat: 51.5641, lng: 5.0438, website: "https://www.tilburguniversity.edu", imageUrl: "", durationYears: 3, countryColor: "#f59e0b" },
  { id: "tilburg-bsc-economics", lat: 51.5644, lng: 5.0441, website: "https://www.tilburguniversity.edu", imageUrl: "", durationYears: 3, countryColor: "#f59e0b" },
  { id: "wageningen-bsc-food", lat: 51.9692, lng: 5.6653, website: "https://www.wur.nl", imageUrl: "", durationYears: 3, countryColor: "#f59e0b" },
  { id: "radboud-bsc-ba", lat: 51.8198, lng: 5.8663, website: "https://www.ru.nl", imageUrl: "", durationYears: 3, countryColor: "#f59e0b" },
  { id: "twente-bsc-tcs", lat: 52.2399, lng: 6.8564, website: "https://www.utwente.nl", imageUrl: "", durationYears: 3, countryColor: "#f59e0b" },
  { id: "twente-bsc-iba", lat: 52.2402, lng: 6.8567, website: "https://www.utwente.nl", imageUrl: "", durationYears: 3, countryColor: "#f59e0b" },
  { id: "groningen-bsc-economics", lat: 53.2203, lng: 6.5676, website: "https://www.rug.nl", imageUrl: "", durationYears: 3, countryColor: "#f59e0b" },
  { id: "maastricht-bsc-economics", lat: 50.8473, lng: 5.6879, website: "https://www.maastrichtuniversity.nl", imageUrl: "", durationYears: 3, countryColor: "#f59e0b" },

  // ── İtalya (Bachelor) ──
  { id: "bologna-bsc-polsci", lat: 44.4974, lng: 11.3530, website: "https://www.unibo.it", imageUrl: "", durationYears: 3, countryColor: "#22c55e" },
  { id: "padua-bsc-economics", lat: 45.4064, lng: 11.8768, website: "https://www.unipd.it", imageUrl: "", durationYears: 3, countryColor: "#22c55e" },
  { id: "trento-bsc-economics", lat: 46.0664, lng: 11.1505, website: "https://www.unitn.it", imageUrl: "", durationYears: 3, countryColor: "#22c55e" },
  { id: "luiss-bsc-economics", lat: 41.9242, lng: 12.4932, website: "https://www.luiss.it", imageUrl: "", durationYears: 3, countryColor: "#22c55e" },
  { id: "luiss-bsc-polsci", lat: 41.9245, lng: 12.4935, website: "https://www.luiss.it", imageUrl: "", durationYears: 3, countryColor: "#22c55e" },
  { id: "milan-bsc-intpol", lat: 45.4601, lng: 9.1946, website: "https://www.unimi.it", imageUrl: "", durationYears: 3, countryColor: "#22c55e" },
  { id: "cafoscari-bsc-dm", lat: 45.4371, lng: 12.3265, website: "https://www.unive.it", imageUrl: "", durationYears: 3, countryColor: "#22c55e" },
  { id: "torino-bsc-business", lat: 45.0634, lng: 7.6627, website: "https://www.unito.it", imageUrl: "", durationYears: 3, countryColor: "#22c55e" },
  { id: "polimi-bsc-design", lat: 45.4792, lng: 9.2271, website: "https://www.polimi.it", imageUrl: "", durationYears: 3, countryColor: "#22c55e" },

  // ── Almanya (Bachelor) ──
  { id: "constructor-bsc-iba", lat: 53.1071, lng: 8.8527, website: "https://constructor.university", imageUrl: "", durationYears: 3, countryColor: "#3b82f6" },
  { id: "constructor-bsc-datasci", lat: 53.1074, lng: 8.8530, website: "https://constructor.university", imageUrl: "", durationYears: 3, countryColor: "#3b82f6" },
  { id: "constructor-bsc-biochem", lat: 53.1077, lng: 8.8533, website: "https://constructor.university", imageUrl: "", durationYears: 3, countryColor: "#3b82f6" },
  { id: "escp-bsc-management", lat: 52.5070, lng: 13.3220, website: "https://escp.eu", imageUrl: "", durationYears: 3, countryColor: "#3b82f6" },
  { id: "bard-ba-humanities", lat: 52.4470, lng: 13.1643, website: "https://www.berlin.bard.edu", imageUrl: "", durationYears: 4, countryColor: "#3b82f6" },
  { id: "whu-bsc-iba", lat: 50.3982, lng: 7.6201, website: "https://www.whu.edu", imageUrl: "", durationYears: 3, countryColor: "#3b82f6" },
  { id: "ebs-bsc-business", lat: 50.0832, lng: 8.2400, website: "https://www.ebs.edu", imageUrl: "", durationYears: 3, countryColor: "#3b82f6" },
  { id: "tum-bsc-cs", lat: 48.2631, lng: 11.6689, website: "https://www.tum.de", imageUrl: "", durationYears: 3, countryColor: "#3b82f6" },

  // ── İngiltere (Bachelor) ──
  { id: "bristol-bsc-economics", lat: 51.4584, lng: -2.6030, website: "https://www.bristol.ac.uk", imageUrl: "", durationYears: 3, countryColor: "#3b82f6" },
  { id: "leeds-bsc-business", lat: 53.8067, lng: -1.5550, website: "https://www.leeds.ac.uk", imageUrl: "", durationYears: 3, countryColor: "#3b82f6" },
  { id: "birmingham-bsc-business", lat: 52.4508, lng: -1.9305, website: "https://www.birmingham.ac.uk", imageUrl: "", durationYears: 3, countryColor: "#3b82f6" },
  { id: "bath-bsc-ba", lat: 51.3799, lng: -2.3282, website: "https://www.bath.ac.uk", imageUrl: "", durationYears: 4, countryColor: "#3b82f6" },
  { id: "loughborough-bsc-be", lat: 52.7649, lng: -1.2276, website: "https://www.lboro.ac.uk", imageUrl: "", durationYears: 3, countryColor: "#3b82f6" },
  { id: "glasgow-bsc-cs", lat: 55.8724, lng: -4.2882, website: "https://www.gla.ac.uk", imageUrl: "", durationYears: 4, countryColor: "#3b82f6" },
  { id: "lse-bsc-economics", lat: 51.5148, lng: -0.1171, website: "https://www.lse.ac.uk", imageUrl: "", durationYears: 3, countryColor: "#3b82f6" },
  { id: "oxford-ba-em", lat: 51.7553, lng: -1.2552, website: "https://www.ox.ac.uk", imageUrl: "", durationYears: 3, countryColor: "#3b82f6" },
  { id: "cambridge-ba-economics", lat: 52.2043, lng: 0.1178, website: "https://www.cam.ac.uk", imageUrl: "", durationYears: 3, countryColor: "#3b82f6" },
  { id: "exeter-bsc-business", lat: 50.7355, lng: -3.5344, website: "https://www.exeter.ac.uk", imageUrl: "", durationYears: 3, countryColor: "#3b82f6" },
  { id: "nottingham-bsc-economics", lat: 52.9391, lng: -1.1963, website: "https://www.nottingham.ac.uk", imageUrl: "", durationYears: 3, countryColor: "#3b82f6" },
  { id: "sheffield-bsc-cs", lat: 53.3811, lng: -1.4882, website: "https://www.sheffield.ac.uk", imageUrl: "", durationYears: 3, countryColor: "#3b82f6" },
  { id: "southampton-bsc-cs", lat: 50.9348, lng: -1.3964, website: "https://www.southampton.ac.uk", imageUrl: "", durationYears: 3, countryColor: "#3b82f6" },

  // ── İsveç (Bachelor) ──
  { id: "stockholm-bsc-be", lat: 59.3636, lng: 18.0596, website: "https://www.su.se", imageUrl: "", durationYears: 3, countryColor: "#fbbf24" },
  { id: "uppsala-bsc-be", lat: 59.8586, lng: 17.6389, website: "https://www.uu.se", imageUrl: "", durationYears: 3, countryColor: "#fbbf24" },
  { id: "kth-bsc-eng", lat: 59.3506, lng: 18.0709, website: "https://www.kth.se", imageUrl: "", durationYears: 3, countryColor: "#fbbf24" },

  // ── Danimarka (Bachelor) ──
  { id: "aarhus-bsc-ba", lat: 56.1689, lng: 10.2030, website: "https://www.au.dk", imageUrl: "", durationYears: 3, countryColor: "#60a5fa" },
  { id: "sdu-bsc-eng", lat: 55.3688, lng: 10.4310, website: "https://www.sdu.dk", imageUrl: "", durationYears: 3, countryColor: "#60a5fa" },
  { id: "dtu-bsc-eng", lat: 55.7862, lng: 12.5217, website: "https://www.dtu.dk", imageUrl: "", durationYears: 3, countryColor: "#60a5fa" },

  // ── Finlandiya (Bachelor) ──
  { id: "aalto-bsc-ib", lat: 60.1863, lng: 24.8270, website: "https://www.aalto.fi", imageUrl: "", durationYears: 3, countryColor: "#22c55e" },
  { id: "aalto-bsc-datasci", lat: 60.1867, lng: 24.8273, website: "https://www.aalto.fi", imageUrl: "", durationYears: 3, countryColor: "#22c55e" },
  { id: "helsinki-bsc-science", lat: 60.2046, lng: 24.9633, website: "https://www.helsinki.fi", imageUrl: "", durationYears: 3, countryColor: "#22c55e" },

  // ── İspanya (Bachelor) ──
  { id: "esade-bba", lat: 41.3839, lng: 2.1169, website: "https://www.esade.edu", imageUrl: "", durationYears: 4, countryColor: "#ef4444" },
  { id: "ub-bsc-business", lat: 41.3862, lng: 2.1649, website: "https://www.ub.edu", imageUrl: "", durationYears: 4, countryColor: "#ef4444" },

  // ── Avusturya (Bachelor) ──
  { id: "modul-bsc-im", lat: 48.2571, lng: 16.3677, website: "https://www.modul.ac.at", imageUrl: "", durationYears: 3, countryColor: "#ef4444" },
  { id: "wu-bsc-be", lat: 48.2136, lng: 16.4062, website: "https://www.wu.ac.at", imageUrl: "", durationYears: 3, countryColor: "#ef4444" },

  // ── Belçika (Bachelor) ──
  { id: "kuleuven-bsc-beng", lat: 50.8775, lng: 4.7010, website: "https://www.kuleuven.be", imageUrl: "", durationYears: 3, countryColor: "#f59e0b" },
  { id: "kuleuven-bsc-economics", lat: 50.8778, lng: 4.7013, website: "https://www.kuleuven.be", imageUrl: "", durationYears: 3, countryColor: "#f59e0b" },
  { id: "ghent-bsc-beng", lat: 51.0520, lng: 3.7282, website: "https://www.ugent.be", imageUrl: "", durationYears: 3, countryColor: "#f59e0b" },

  // ── Portekiz (Bachelor) ──
  { id: "nova-bsc-economics", lat: 38.6785, lng: -9.3189, website: "https://www.novasbe.pt", imageUrl: "", durationYears: 3, countryColor: "#fbbf24" },
  { id: "nova-bsc-management", lat: 38.6788, lng: -9.3192, website: "https://www.novasbe.pt", imageUrl: "", durationYears: 3, countryColor: "#fbbf24" },
  { id: "catolica-bsc-management", lat: 38.7477, lng: -9.1539, website: "https://www.clsbe.lisboa.ucp.pt", imageUrl: "", durationYears: 3, countryColor: "#fbbf24" },

  // ── İrlanda (Bachelor) ──
  { id: "ucd-bsc-business", lat: 53.3076, lng: -6.2240, website: "https://www.ucd.ie", imageUrl: "", durationYears: 4, countryColor: "#22c55e" },
  { id: "ucd-bsc-cs", lat: 53.3079, lng: -6.2243, website: "https://www.ucd.ie", imageUrl: "", durationYears: 4, countryColor: "#22c55e" },
  { id: "ucc-bsc-bis", lat: 51.8936, lng: -8.4921, website: "https://www.ucc.ie", imageUrl: "", durationYears: 4, countryColor: "#22c55e" },

  // ── Top Üniversite Bachelor Eklentileri ──
  { id: "sciences-po-bsc-polsci", lat: 48.8542, lng: 2.3289, website: "https://www.sciencespo.fr", imageUrl: "", durationYears: 3, countryColor: "#60a5fa" },
  { id: "sciences-po-bsc-economics", lat: 49.2547, lng: 4.0341, website: "https://www.sciencespo.fr", imageUrl: "", durationYears: 3, countryColor: "#60a5fa" },
  { id: "lmu-bsc-economics", lat: 48.1505, lng: 11.5808, website: "https://www.lmu.de", imageUrl: "", durationYears: 3, countryColor: "#3b82f6" },
  { id: "mannheim-bsc-business", lat: 49.4831, lng: 8.4625, website: "https://www.uni-mannheim.de", imageUrl: "", durationYears: 3, countryColor: "#3b82f6" },
  { id: "st-gallen-bsc-ia", lat: 47.4306, lng: 9.3753, website: "https://www.unisg.ch", imageUrl: "", durationYears: 3, countryColor: "#22c55e" },
  { id: "karolinska-bsc-biomed", lat: 59.3487, lng: 18.0234, website: "https://ki.se", imageUrl: "", durationYears: 3, countryColor: "#fbbf24" },

  // ── Silinen Okulların Bachelor Map Data ──
  { id: "aalborg-bsc-electronics", lat: 57.0128, lng: 9.9912, website: "https://www.en.aau.dk", imageUrl: "", durationYears: 3, countryColor: "#60a5fa" },
  { id: "aalborg-bsc-energy", lat: 57.0132, lng: 9.9916, website: "https://www.en.aau.dk", imageUrl: "", durationYears: 3, countryColor: "#60a5fa" },
  { id: "antwerp-bsc-be", lat: 51.2194, lng: 4.4025, website: "https://www.uantwerpen.be", imageUrl: "", durationYears: 3, countryColor: "#f59e0b" },
  { id: "durham-bsc-cs", lat: 54.7681, lng: -1.5724, website: "https://www.durham.ac.uk", imageUrl: "", durationYears: 3, countryColor: "#3b82f6" },
  { id: "durham-bsc-economics", lat: 54.7685, lng: -1.5720, website: "https://www.durham.ac.uk", imageUrl: "", durationYears: 3, countryColor: "#3b82f6" },
  { id: "lancaster-bsc-business", lat: 54.0104, lng: -2.7877, website: "https://www.lancaster.ac.uk", imageUrl: "", durationYears: 3, countryColor: "#3b82f6" },
  { id: "lancaster-bsc-cs", lat: 54.0108, lng: -2.7873, website: "https://www.lancaster.ac.uk", imageUrl: "", durationYears: 3, countryColor: "#3b82f6" },
  { id: "standrews-bsc-cs", lat: 56.3398, lng: -2.7967, website: "https://www.st-andrews.ac.uk", imageUrl: "", durationYears: 4, countryColor: "#3b82f6" },
  { id: "standrews-bsc-economics", lat: 56.3402, lng: -2.7963, website: "https://www.st-andrews.ac.uk", imageUrl: "", durationYears: 4, countryColor: "#3b82f6" },
  { id: "standrews-bsc-ir", lat: 56.3406, lng: -2.7959, website: "https://www.st-andrews.ac.uk", imageUrl: "", durationYears: 4, countryColor: "#3b82f6" },
  { id: "polito-bsc-eng", lat: 45.0628, lng: 7.6620, website: "https://www.polito.it", imageUrl: "", durationYears: 3, countryColor: "#22c55e" },
  { id: "polito-bsc-auto", lat: 45.0632, lng: 7.6624, website: "https://www.polito.it", imageUrl: "", durationYears: 3, countryColor: "#22c55e" },
  { id: "carlos-iii-bsc-economics", lat: 40.3318, lng: -3.7660, website: "https://www.uc3m.es", imageUrl: "", durationYears: 4, countryColor: "#ef4444" },
  { id: "carlos-iii-bsc-business", lat: 40.3322, lng: -3.7656, website: "https://www.uc3m.es", imageUrl: "", durationYears: 4, countryColor: "#ef4444" },
  { id: "pompeu-fabra-bsc-economics", lat: 41.3898, lng: 2.1944, website: "https://www.upf.edu", imageUrl: "", durationYears: 4, countryColor: "#ef4444" },
  { id: "gothenburg-bsc-se", lat: 57.6876, lng: 11.9795, website: "https://www.gu.se", imageUrl: "", durationYears: 3, countryColor: "#fbbf24" },
  { id: "sse-bsc-economics", lat: 59.3401, lng: 18.0580, website: "https://www.hhs.se", imageUrl: "", durationYears: 3, countryColor: "#fbbf24" },
  { id: "iscte-bsc-management", lat: 38.7478, lng: -9.1535, website: "https://www.iscte-iul.pt", imageUrl: "", durationYears: 3, countryColor: "#fbbf24" },
  { id: "sgh-bsc-ib", lat: 52.2089, lng: 21.0074, website: "https://www.sgh.waw.pl", imageUrl: "", durationYears: 3, countryColor: "#ef4444" },
  { id: "sgh-bsc-economics", lat: 52.2093, lng: 21.0078, website: "https://www.sgh.waw.pl", imageUrl: "", durationYears: 3, countryColor: "#ef4444" },
  { id: "copenhagen-bsc-economics", lat: 55.6802, lng: 12.5724, website: "https://www.ku.dk", imageUrl: "", durationYears: 3, countryColor: "#60a5fa" },
  { id: "essec-bba", lat: 49.0340, lng: 2.0765, website: "https://www.essec.edu", imageUrl: "", durationYears: 4, countryColor: "#60a5fa" },

  // ── Fransız Grande Écoles BBA ──
  { id: "edhec-bba", lat: 43.6155, lng: 7.0718, website: "https://www.edhec.edu", imageUrl: "", durationYears: 4, countryColor: "#60a5fa" },
  { id: "skema-bba", lat: 43.6165, lng: 7.0552, website: "https://www.skema.edu", imageUrl: "", durationYears: 4, countryColor: "#60a5fa" },
  { id: "emlyon-bba", lat: 45.7585, lng: 4.8561, website: "https://em-lyon.com", imageUrl: "", durationYears: 4, countryColor: "#60a5fa" },
  { id: "ieseg-bba", lat: 50.6337, lng: 3.0578, website: "https://www.ieseg.fr", imageUrl: "", durationYears: 3, countryColor: "#60a5fa" },
  { id: "neoma-bba", lat: 49.2486, lng: 4.0285, website: "https://neoma-bs.com", imageUrl: "", durationYears: 4, countryColor: "#60a5fa" },
  { id: "kedge-bba", lat: 43.3068, lng: 5.4368, website: "https://kedge.edu", imageUrl: "", durationYears: 4, countryColor: "#60a5fa" },
  { id: "audencia-bba", lat: 47.2076, lng: -1.5642, website: "https://www.audencia.com", imageUrl: "", durationYears: 3, countryColor: "#60a5fa" },

  // ── Nordic ──
  { id: "tampere-bsc-tech", lat: 61.4498, lng: 23.8569, website: "https://www.tuni.fi", imageUrl: "", durationYears: 3, countryColor: "#22c55e" },
  { id: "turku-bsc-tech", lat: 60.4531, lng: 22.2963, website: "https://www.utu.fi", imageUrl: "", durationYears: 3, countryColor: "#22c55e" },
  { id: "linkoping-bsc-se", lat: 58.3968, lng: 15.5770, website: "https://liu.se", imageUrl: "", durationYears: 3, countryColor: "#fbbf24" },
  { id: "bi-norwegian-bba", lat: 59.9487, lng: 10.7680, website: "https://www.bi.no", imageUrl: "", durationYears: 3, countryColor: "#3b82f6" },
  { id: "nhh-bba", lat: 60.3773, lng: 5.3438, website: "https://www.nhh.no", imageUrl: "", durationYears: 3, countryColor: "#3b82f6" },

  // ── UK ──
  { id: "queen-mary-bsc-economics", lat: 51.5241, lng: -0.0402, website: "https://www.qmul.ac.uk", imageUrl: "", durationYears: 3, countryColor: "#3b82f6" },
  { id: "york-bsc-cs", lat: 53.9473, lng: -1.0534, website: "https://www.york.ac.uk", imageUrl: "", durationYears: 3, countryColor: "#3b82f6" },
  { id: "liverpool-bsc-business", lat: 53.4050, lng: -2.9662, website: "https://www.liverpool.ac.uk", imageUrl: "", durationYears: 3, countryColor: "#3b82f6" },
  { id: "sussex-bsc-economics", lat: 50.8665, lng: -0.0872, website: "https://www.sussex.ac.uk", imageUrl: "", durationYears: 3, countryColor: "#3b82f6" },

  // ── İtalya ──
  { id: "sapienza-bsc-economics", lat: 41.9019, lng: 12.5149, website: "https://www.uniroma1.it", imageUrl: "", durationYears: 3, countryColor: "#22c55e" },
  { id: "pavia-bsc-eng", lat: 45.1863, lng: 9.1561, website: "https://www.unipv.it", imageUrl: "", durationYears: 3, countryColor: "#22c55e" },

  // ── Almanya ──
  { id: "tu-berlin-bsc-cs", lat: 52.5125, lng: 13.3269, website: "https://www.tu.berlin", imageUrl: "", durationYears: 3, countryColor: "#3b82f6" },

  // ── İspanya ──
  { id: "navarra-bba", lat: 42.8034, lng: -1.6608, website: "https://www.unav.edu", imageUrl: "", durationYears: 4, countryColor: "#ef4444" },

  // ── Baltık / Orta Avrupa ──
  { id: "taltech-bsc-iba", lat: 59.3953, lng: 24.6718, website: "https://taltech.ee", imageUrl: "", durationYears: 3, countryColor: "#60a5fa" },
  { id: "masaryk-bsc-economics", lat: 49.1987, lng: 16.6046, website: "https://www.muni.cz", imageUrl: "", durationYears: 3, countryColor: "#3b82f6" },
];
