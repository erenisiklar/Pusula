export interface UniversityMapData {
  id: string;
  lat: number;
  lng: number;
  website: string;
  imageUrl: string;
  durationYears: number;
  countryColor: string;
}

export const universityMapData: UniversityMapData[] = [
  // ── Hollanda ──
  { id: "tu-delft-cs", lat: 51.9988, lng: 4.3733, website: "https://www.tudelft.nl", imageUrl: "", durationYears: 2, countryColor: "#f59e0b" },
  { id: "tu-delft-arch", lat: 51.9958, lng: 4.3712, website: "https://www.tudelft.nl", imageUrl: "", durationYears: 2, countryColor: "#f59e0b" },
  { id: "tu-delft-ee", lat: 51.9993, lng: 4.3760, website: "https://www.tudelft.nl", imageUrl: "", durationYears: 2, countryColor: "#f59e0b" },
  { id: "groningen-business", lat: 53.2194, lng: 6.5666, website: "https://www.rug.nl", imageUrl: "", durationYears: 2, countryColor: "#f59e0b" },
  { id: "rsm-erasmus-mim", lat: 51.9170, lng: 4.5260, website: "https://www.rsm.nl", imageUrl: "", durationYears: 2, countryColor: "#f59e0b" },
  { id: "amsterdam-business-mim", lat: 52.3559, lng: 4.9554, website: "https://www.uva.nl", imageUrl: "", durationYears: 2, countryColor: "#f59e0b" },
  { id: "maastricht-mim", lat: 50.8466, lng: 5.6872, website: "https://www.maastrichtuniversity.nl", imageUrl: "", durationYears: 2, countryColor: "#f59e0b" },
  { id: "tilburg-mim", lat: 51.5635, lng: 5.0432, website: "https://www.tilburguniversity.edu", imageUrl: "", durationYears: 2, countryColor: "#f59e0b" },
  { id: "nyenrode-mim", lat: 52.1700, lng: 5.0000, website: "https://www.nyenrode.nl", imageUrl: "", durationYears: 2, countryColor: "#f59e0b" },
  { id: "tu-eindhoven-cs", lat: 51.4478, lng: 5.4904, website: "https://www.tue.nl", imageUrl: "", durationYears: 2, countryColor: "#f59e0b" },
  { id: "university-twente-eng", lat: 52.2396, lng: 6.8561, website: "https://www.utwente.nl", imageUrl: "", durationYears: 2, countryColor: "#f59e0b" },
  { id: "leiden-politics", lat: 52.1571, lng: 4.4853, website: "https://www.universiteitleiden.nl", imageUrl: "", durationYears: 2, countryColor: "#f59e0b" },
  { id: "leiden-ir", lat: 52.0867, lng: 4.3281, website: "https://www.universiteitleiden.nl", imageUrl: "", durationYears: 2, countryColor: "#f59e0b" },
  { id: "leiden-law", lat: 52.1572, lng: 4.4855, website: "https://www.universiteitleiden.nl", imageUrl: "", durationYears: 2, countryColor: "#f59e0b" },
  { id: "amsterdam-politics", lat: 52.3564, lng: 4.9551, website: "https://www.uva.nl", imageUrl: "", durationYears: 2, countryColor: "#f59e0b" },
  { id: "amsterdam-med", lat: 52.3347, lng: 4.8654, website: "https://www.uva.nl", imageUrl: "", durationYears: 2, countryColor: "#f59e0b" },
  { id: "tilburg-economics", lat: 51.5638, lng: 5.0435, website: "https://www.tilburguniversity.edu", imageUrl: "", durationYears: 2, countryColor: "#f59e0b" },

  // ── İtalya ──
  { id: "polimi-cs", lat: 45.4781, lng: 9.2277, website: "https://www.polimi.it", imageUrl: "", durationYears: 2, countryColor: "#22c55e" },
  { id: "polimi-arch", lat: 45.4784, lng: 9.2268, website: "https://www.polimi.it", imageUrl: "", durationYears: 2, countryColor: "#22c55e" },
  { id: "polimi-gsom-mim", lat: 45.4786, lng: 9.2290, website: "https://www.polimi.it", imageUrl: "", durationYears: 2, countryColor: "#22c55e" },
  { id: "bocconi-economics", lat: 45.4486, lng: 9.1899, website: "https://www.unibocconi.eu", imageUrl: "", durationYears: 2, countryColor: "#22c55e" },
  { id: "sda-bocconi-mba", lat: 45.4492, lng: 9.1905, website: "https://www.sdabocconi.it", imageUrl: "", durationYears: 1, countryColor: "#22c55e" },
  { id: "bologna-eng", lat: 44.4968, lng: 11.3524, website: "https://www.unibo.it", imageUrl: "", durationYears: 2, countryColor: "#22c55e" },
  { id: "polito-cs", lat: 45.0628, lng: 7.6624, website: "https://www.polito.it", imageUrl: "", durationYears: 2, countryColor: "#22c55e" },
  { id: "polito-eng", lat: 45.0631, lng: 7.6620, website: "https://www.polito.it", imageUrl: "", durationYears: 2, countryColor: "#22c55e" },

  // ── Almanya ──
  { id: "tum-cs", lat: 48.2628, lng: 11.6686, website: "https://www.tum.de", imageUrl: "", durationYears: 2, countryColor: "#3b82f6" },
  { id: "tum-ee", lat: 48.2632, lng: 11.6690, website: "https://www.tum.de", imageUrl: "", durationYears: 2, countryColor: "#3b82f6" },
  { id: "lmu-business", lat: 48.1508, lng: 11.5804, website: "https://www.lmu.de", imageUrl: "", durationYears: 2, countryColor: "#3b82f6" },
  { id: "rwth-aachen", lat: 50.7801, lng: 6.0657, website: "https://www.rwth-aachen.de", imageUrl: "", durationYears: 2, countryColor: "#3b82f6" },
  { id: "esmt-berlin-mim", lat: 52.5194, lng: 13.4048, website: "https://esmt.berlin", imageUrl: "", durationYears: 2, countryColor: "#3b82f6" },
  { id: "mannheim-mim", lat: 49.4830, lng: 8.4625, website: "https://www.uni-mannheim.de", imageUrl: "", durationYears: 2, countryColor: "#3b82f6" },
  { id: "whu-mim", lat: 50.3979, lng: 7.6198, website: "https://www.whu.edu", imageUrl: "", durationYears: 2, countryColor: "#3b82f6" },
  { id: "frankfurt-school-mim", lat: 50.1299, lng: 8.6919, website: "https://www.fs.de", imageUrl: "", durationYears: 2, countryColor: "#3b82f6" },
  { id: "cologne-mim", lat: 50.9281, lng: 6.9293, website: "https://www.wiso.uni-koeln.de", imageUrl: "", durationYears: 2, countryColor: "#3b82f6" },
  { id: "goettingen-mim", lat: 51.5328, lng: 9.9352, website: "https://www.uni-goettingen.de", imageUrl: "", durationYears: 2, countryColor: "#3b82f6" },
  { id: "fu-berlin-mim", lat: 52.4499, lng: 13.2903, website: "https://www.fu-berlin.de", imageUrl: "", durationYears: 2, countryColor: "#3b82f6" },
  { id: "tu-berlin-cs", lat: 52.5122, lng: 13.3271, website: "https://www.tu.berlin", imageUrl: "", durationYears: 2, countryColor: "#3b82f6" },
  { id: "stuttgart-eng", lat: 48.7453, lng: 9.1071, website: "https://www.uni-stuttgart.de", imageUrl: "", durationYears: 2, countryColor: "#3b82f6" },
  { id: "heidelberg-med", lat: 49.4144, lng: 8.6745, website: "https://www.uni-heidelberg.de", imageUrl: "", durationYears: 2, countryColor: "#3b82f6" },
  { id: "humboldt-law", lat: 52.5181, lng: 13.3935, website: "https://www.hu-berlin.de", imageUrl: "", durationYears: 2, countryColor: "#3b82f6" },

  // ── Fransa ──
  { id: "sciences-po", lat: 48.8541, lng: 2.3284, website: "https://www.sciencespo.fr", imageUrl: "", durationYears: 2, countryColor: "#60a5fa" },
  { id: "essec", lat: 49.0335, lng: 2.0768, website: "https://www.essec.edu", imageUrl: "", durationYears: 2, countryColor: "#60a5fa" },
  { id: "insead-mim", lat: 48.4044, lng: 2.7015, website: "https://www.insead.edu", imageUrl: "", durationYears: 2, countryColor: "#60a5fa" },
  { id: "hec-paris-mim", lat: 48.7575, lng: 2.1699, website: "https://www.hec.edu", imageUrl: "", durationYears: 2, countryColor: "#60a5fa" },
  { id: "escp-mim", lat: 48.8490, lng: 2.3942, website: "https://escp.eu", imageUrl: "", durationYears: 2, countryColor: "#60a5fa" },
  { id: "edhec-mim", lat: 43.6151, lng: 7.0489, website: "https://www.edhec.edu", imageUrl: "", durationYears: 2, countryColor: "#60a5fa" },
  { id: "emlyon-mim", lat: 45.7583, lng: 4.7636, website: "https://em-lyon.com", imageUrl: "", durationYears: 2, countryColor: "#60a5fa" },
  { id: "skema-mim", lat: 50.6579, lng: 3.1406, website: "https://www.skema.edu", imageUrl: "", durationYears: 2, countryColor: "#60a5fa" },
  { id: "grenoble-em-mim", lat: 45.1921, lng: 5.7156, website: "https://www.grenoble-em.com", imageUrl: "", durationYears: 2, countryColor: "#60a5fa" },
  { id: "audencia-mim", lat: 47.2075, lng: -1.5499, website: "https://www.audencia.com", imageUrl: "", durationYears: 2, countryColor: "#60a5fa" },
  { id: "neoma-mim", lat: 49.2477, lng: 4.0263, website: "https://neoma-bs.com", imageUrl: "", durationYears: 2, countryColor: "#60a5fa" },
  { id: "kedge-mim", lat: 43.2462, lng: 5.4399, website: "https://kedge.edu", imageUrl: "", durationYears: 2, countryColor: "#60a5fa" },
  { id: "ieseg-mim", lat: 50.6391, lng: 3.0617, website: "https://www.ieseg.fr", imageUrl: "", durationYears: 2, countryColor: "#60a5fa" },
  { id: "icn-mim", lat: 48.6867, lng: 6.1668, website: "https://www.icn-artem.com", imageUrl: "", durationYears: 2, countryColor: "#60a5fa" },
  { id: "essca-mim", lat: 47.4731, lng: -0.5517, website: "https://www.essca.fr", imageUrl: "", durationYears: 2, countryColor: "#60a5fa" },
  { id: "paris-school-business", lat: 48.8972, lng: 2.3185, website: "https://www.psbedu.paris", imageUrl: "", durationYears: 2, countryColor: "#60a5fa" },
  { id: "toulouse-mim", lat: 43.6120, lng: 1.4114, website: "https://www.tbs-education.com", imageUrl: "", durationYears: 2, countryColor: "#60a5fa" },
  { id: "toulouse-economics", lat: 43.6042, lng: 1.4438, website: "https://www.tbs-education.com", imageUrl: "", durationYears: 2, countryColor: "#60a5fa" },
  { id: "montpellier-mim", lat: 43.6137, lng: 3.8739, website: "https://www.montpellier-bs.com", imageUrl: "", durationYears: 2, countryColor: "#60a5fa" },
  { id: "em-normandie-mim", lat: 49.4916, lng: 0.1138, website: "https://www.em-normandie.com", imageUrl: "", durationYears: 2, countryColor: "#60a5fa" },
  { id: "sorbonne-economics", lat: 48.8484, lng: 2.3470, website: "https://www.sorbonne-universite.fr", imageUrl: "", durationYears: 2, countryColor: "#60a5fa" },

  // ── İspanya ──
  { id: "ie-university", lat: 40.4477, lng: -3.6923, website: "https://www.ie.edu", imageUrl: "", durationYears: 2, countryColor: "#ef4444" },
  { id: "ie-business-mim", lat: 40.4479, lng: -3.6920, website: "https://www.ie.edu", imageUrl: "", durationYears: 2, countryColor: "#ef4444" },
  { id: "iese-mba", lat: 41.4179, lng: 2.1377, website: "https://www.iese.edu", imageUrl: "", durationYears: 1, countryColor: "#ef4444" },
  { id: "esade-mim", lat: 41.3836, lng: 2.1166, website: "https://www.esade.edu", imageUrl: "", durationYears: 2, countryColor: "#ef4444" },
  { id: "barcelona-mim", lat: 41.3859, lng: 2.1646, website: "https://www.ub.edu", imageUrl: "", durationYears: 2, countryColor: "#ef4444" },
  { id: "pompeu-fabra-mim", lat: 41.3889, lng: 2.1936, website: "https://www.upf.edu", imageUrl: "", durationYears: 2, countryColor: "#ef4444" },
  { id: "carlos-iii-mim", lat: 40.3315, lng: -3.7656, website: "https://www.uc3m.es", imageUrl: "", durationYears: 2, countryColor: "#ef4444" },
  { id: "navarra-mim", lat: 42.8049, lng: -1.6594, website: "https://www.unav.edu", imageUrl: "", durationYears: 2, countryColor: "#ef4444" },
  { id: "upc-cs", lat: 41.3890, lng: 2.1129, website: "https://www.upc.edu", imageUrl: "", durationYears: 2, countryColor: "#ef4444" },
  { id: "upc-eng", lat: 41.3892, lng: 2.1132, website: "https://www.upc.edu", imageUrl: "", durationYears: 2, countryColor: "#ef4444" },

  // ── İngiltere ──
  { id: "lbs-mim", lat: 51.5265, lng: -0.1629, website: "https://www.london.edu", imageUrl: "", durationYears: 1, countryColor: "#3b82f6" },
  { id: "oxford-said-mba", lat: 51.7570, lng: -1.2631, website: "https://www.ox.ac.uk", imageUrl: "", durationYears: 1, countryColor: "#3b82f6" },
  { id: "oxford-cs", lat: 51.7598, lng: -1.2580, website: "https://www.ox.ac.uk", imageUrl: "", durationYears: 2, countryColor: "#3b82f6" },
  { id: "oxford-economics", lat: 51.7548, lng: -1.2545, website: "https://www.ox.ac.uk", imageUrl: "", durationYears: 1, countryColor: "#3b82f6" },
  { id: "oxford-politics", lat: 51.7551, lng: -1.2549, website: "https://www.ox.ac.uk", imageUrl: "", durationYears: 1, countryColor: "#3b82f6" },
  { id: "oxford-law", lat: 51.7540, lng: -1.2540, website: "https://www.ox.ac.uk", imageUrl: "", durationYears: 1, countryColor: "#3b82f6" },
  { id: "cambridge-judge-mba", lat: 52.2025, lng: 0.1187, website: "https://www.cam.ac.uk", imageUrl: "", durationYears: 1, countryColor: "#3b82f6" },
  { id: "cambridge-cs", lat: 52.2109, lng: 0.0917, website: "https://www.cam.ac.uk", imageUrl: "", durationYears: 2, countryColor: "#3b82f6" },
  { id: "cambridge-economics", lat: 52.2040, lng: 0.1175, website: "https://www.cam.ac.uk", imageUrl: "", durationYears: 1, countryColor: "#3b82f6" },
  { id: "cambridge-law", lat: 52.2048, lng: 0.1155, website: "https://www.cam.ac.uk", imageUrl: "", durationYears: 1, countryColor: "#3b82f6" },
  { id: "imperial-cs", lat: 51.4988, lng: -0.1749, website: "https://www.imperial.ac.uk", imageUrl: "", durationYears: 2, countryColor: "#3b82f6" },
  { id: "imperial-eng", lat: 51.4991, lng: -0.1745, website: "https://www.imperial.ac.uk", imageUrl: "", durationYears: 2, countryColor: "#3b82f6" },
  { id: "imperial-ee", lat: 51.4986, lng: -0.1752, website: "https://www.imperial.ac.uk", imageUrl: "", durationYears: 2, countryColor: "#3b82f6" },
  { id: "imperial-mim", lat: 51.4993, lng: -0.1742, website: "https://www.imperial.ac.uk", imageUrl: "", durationYears: 1, countryColor: "#3b82f6" },
  { id: "lse-mim", lat: 51.5144, lng: -0.1165, website: "https://www.lse.ac.uk", imageUrl: "", durationYears: 1, countryColor: "#3b82f6" },
  { id: "lse-economics", lat: 51.5142, lng: -0.1168, website: "https://www.lse.ac.uk", imageUrl: "", durationYears: 1, countryColor: "#3b82f6" },
  { id: "lse-ir", lat: 51.5146, lng: -0.1162, website: "https://www.lse.ac.uk", imageUrl: "", durationYears: 1, countryColor: "#3b82f6" },
  { id: "ucl-cs", lat: 51.5246, lng: -0.1340, website: "https://www.ucl.ac.uk", imageUrl: "", durationYears: 2, countryColor: "#3b82f6" },
  { id: "ucl-arch", lat: 51.5218, lng: -0.1321, website: "https://www.ucl.ac.uk", imageUrl: "", durationYears: 2, countryColor: "#3b82f6" },
  { id: "warwick-mim", lat: 52.3838, lng: -1.5616, website: "https://www.wbs.ac.uk", imageUrl: "", durationYears: 1, countryColor: "#3b82f6" },
  { id: "edinburgh-mim", lat: 55.9436, lng: -3.1892, website: "https://www.ed.ac.uk", imageUrl: "", durationYears: 1, countryColor: "#3b82f6" },
  { id: "edinburgh-cs", lat: 55.9446, lng: -3.1875, website: "https://www.ed.ac.uk", imageUrl: "", durationYears: 2, countryColor: "#3b82f6" },
  { id: "bayes-mim", lat: 51.5275, lng: -0.1020, website: "https://www.bayes.city.ac.uk", imageUrl: "", durationYears: 1, countryColor: "#3b82f6" },
  { id: "cranfield-mba", lat: 52.0739, lng: -0.6287, website: "https://www.cranfield.ac.uk", imageUrl: "", durationYears: 1, countryColor: "#3b82f6" },
  { id: "alliance-manchester-mim", lat: 53.4668, lng: -2.2339, website: "https://www.alliancembs.manchester.ac.uk", imageUrl: "", durationYears: 1, countryColor: "#3b82f6" },
  { id: "henley-mim", lat: 51.4412, lng: -0.9447, website: "https://www.henley.ac.uk", imageUrl: "", durationYears: 1, countryColor: "#3b82f6" },
  { id: "bath-mim", lat: 51.3796, lng: -2.3279, website: "https://www.bath.ac.uk", imageUrl: "", durationYears: 1, countryColor: "#3b82f6" },
  { id: "durham-mim", lat: 54.7681, lng: -1.5719, website: "https://www.dur.ac.uk", imageUrl: "", durationYears: 1, countryColor: "#3b82f6" },
  { id: "lancaster-mim", lat: 54.0104, lng: -2.7856, website: "https://www.lancaster.ac.uk", imageUrl: "", durationYears: 1, countryColor: "#3b82f6" },
  { id: "nottingham-mim", lat: 52.9388, lng: -1.1960, website: "https://www.nottingham.ac.uk", imageUrl: "", durationYears: 1, countryColor: "#3b82f6" },
  { id: "st-andrews-mim", lat: 56.3402, lng: -2.7931, website: "https://www.st-andrews.ac.uk", imageUrl: "", durationYears: 1, countryColor: "#3b82f6" },

  // ── İsviçre ──
  { id: "eth-zurich-cs", lat: 47.3763, lng: 8.5481, website: "https://ethz.ch", imageUrl: "", durationYears: 2, countryColor: "#22c55e" },
  { id: "eth-zurich-eng", lat: 47.3765, lng: 8.5485, website: "https://ethz.ch", imageUrl: "", durationYears: 2, countryColor: "#22c55e" },
  { id: "eth-zurich-ee", lat: 47.3761, lng: 8.5478, website: "https://ethz.ch", imageUrl: "", durationYears: 2, countryColor: "#22c55e" },
  { id: "eth-zurich-arch", lat: 47.3767, lng: 8.5488, website: "https://ethz.ch", imageUrl: "", durationYears: 2, countryColor: "#22c55e" },
  { id: "epfl-cs", lat: 46.5191, lng: 6.5668, website: "https://www.epfl.ch", imageUrl: "", durationYears: 2, countryColor: "#22c55e" },
  { id: "epfl-eng", lat: 46.5193, lng: 6.5672, website: "https://www.epfl.ch", imageUrl: "", durationYears: 2, countryColor: "#22c55e" },
  { id: "epfl-ee", lat: 46.5189, lng: 6.5665, website: "https://www.epfl.ch", imageUrl: "", durationYears: 2, countryColor: "#22c55e" },
  { id: "st-gallen-mim", lat: 47.4318, lng: 9.3740, website: "https://www.unisg.ch", imageUrl: "", durationYears: 2, countryColor: "#22c55e" },
  { id: "imd-mba", lat: 46.5098, lng: 6.6150, website: "https://www.imd.org", imageUrl: "", durationYears: 1, countryColor: "#22c55e" },
  { id: "hec-lausanne-mim", lat: 46.5227, lng: 6.5791, website: "https://www.unil.ch/hec", imageUrl: "", durationYears: 2, countryColor: "#22c55e" },
  { id: "zurich-mim", lat: 47.3744, lng: 8.5508, website: "https://www.uzh.ch", imageUrl: "", durationYears: 2, countryColor: "#22c55e" },
  { id: "zurich-economics", lat: 47.3747, lng: 8.5511, website: "https://www.uzh.ch", imageUrl: "", durationYears: 2, countryColor: "#22c55e" },
  { id: "geneva-ir", lat: 46.1952, lng: 6.1408, website: "https://www.unige.ch", imageUrl: "", durationYears: 2, countryColor: "#22c55e" },

  // ── İsveç ──
  { id: "kth-stockholm", lat: 59.3500, lng: 18.0703, website: "https://www.kth.se", imageUrl: "", durationYears: 2, countryColor: "#fbbf24" },
  { id: "kth-ee", lat: 59.3503, lng: 18.0706, website: "https://www.kth.se", imageUrl: "", durationYears: 2, countryColor: "#fbbf24" },
  { id: "sse-stockholm-mim", lat: 59.3388, lng: 18.0589, website: "https://www.hhs.se", imageUrl: "", durationYears: 2, countryColor: "#fbbf24" },
  { id: "stockholm-economics", lat: 59.3633, lng: 18.0593, website: "https://www.su.se", imageUrl: "", durationYears: 2, countryColor: "#fbbf24" },
  { id: "lund-mim", lat: 55.7117, lng: 13.2094, website: "https://www.lunduniversity.lu.se", imageUrl: "", durationYears: 2, countryColor: "#fbbf24" },
  { id: "gothenburg-mim", lat: 57.6896, lng: 11.9719, website: "https://www.gu.se", imageUrl: "", durationYears: 2, countryColor: "#fbbf24" },
  { id: "chalmers-cs", lat: 57.6887, lng: 11.9776, website: "https://www.chalmers.se", imageUrl: "", durationYears: 2, countryColor: "#fbbf24" },
  { id: "chalmers-eng", lat: 57.6890, lng: 11.9779, website: "https://www.chalmers.se", imageUrl: "", durationYears: 2, countryColor: "#fbbf24" },
  { id: "karolinska-med", lat: 59.3488, lng: 18.0237, website: "https://ki.se", imageUrl: "", durationYears: 2, countryColor: "#fbbf24" },

  // ── Belçika ──
  { id: "vlerick-mim", lat: 51.0517, lng: 3.7279, website: "https://www.vlerick.com", imageUrl: "", durationYears: 2, countryColor: "#f59e0b" },
  { id: "solvay-mim", lat: 50.8124, lng: 4.3824, website: "https://www.solvay.edu", imageUrl: "", durationYears: 2, countryColor: "#f59e0b" },
  { id: "ku-leuven-mim", lat: 50.8772, lng: 4.7007, website: "https://www.kuleuven.be", imageUrl: "", durationYears: 2, countryColor: "#f59e0b" },
  { id: "antwerp-mim", lat: 51.2271, lng: 4.4111, website: "https://www.uantwerpen.be", imageUrl: "", durationYears: 2, countryColor: "#f59e0b" },

  // ── Danimarka ──
  { id: "cbs-mim", lat: 55.6816, lng: 12.5275, website: "https://www.cbs.dk", imageUrl: "", durationYears: 2, countryColor: "#60a5fa" },
  { id: "aarhus-mim", lat: 56.1686, lng: 10.2027, website: "https://www.au.dk", imageUrl: "", durationYears: 2, countryColor: "#60a5fa" },
  { id: "dtu-cs", lat: 55.7856, lng: 12.5211, website: "https://www.dtu.dk", imageUrl: "", durationYears: 2, countryColor: "#60a5fa" },
  { id: "dtu-eng", lat: 55.7859, lng: 12.5214, website: "https://www.dtu.dk", imageUrl: "", durationYears: 2, countryColor: "#60a5fa" },
  { id: "copenhagen-politics", lat: 55.6809, lng: 12.5722, website: "https://www.ku.dk", imageUrl: "", durationYears: 2, countryColor: "#60a5fa" },
  { id: "copenhagen-med", lat: 55.6964, lng: 12.5710, website: "https://www.ku.dk", imageUrl: "", durationYears: 2, countryColor: "#60a5fa" },
  { id: "aalborg-arch", lat: 57.0149, lng: 9.9857, website: "https://www.aau.dk", imageUrl: "", durationYears: 2, countryColor: "#60a5fa" },

  // ── Norveç ──
  { id: "bi-norwegian-mim", lat: 59.9488, lng: 10.7686, website: "https://www.bi.edu", imageUrl: "", durationYears: 2, countryColor: "#3b82f6" },
  { id: "nhh-mim", lat: 60.3676, lng: 5.3434, website: "https://www.nhh.no", imageUrl: "", durationYears: 2, countryColor: "#3b82f6" },

  // ── Finlandiya ──
  { id: "aalto-mim", lat: 60.1860, lng: 24.8263, website: "https://www.aalto.fi", imageUrl: "", durationYears: 2, countryColor: "#22c55e" },
  { id: "aalto-cs", lat: 60.1864, lng: 24.8267, website: "https://www.aalto.fi", imageUrl: "", durationYears: 2, countryColor: "#22c55e" },
  { id: "hanken-mim", lat: 60.1715, lng: 24.9224, website: "https://www.hanken.fi", imageUrl: "", durationYears: 2, countryColor: "#22c55e" },

  // ── Portekiz ──
  { id: "nova-sbe-mim", lat: 38.6782, lng: -9.3186, website: "https://www.novasbe.pt", imageUrl: "", durationYears: 2, countryColor: "#fbbf24" },
  { id: "catolica-lisbon-mim", lat: 38.7474, lng: -9.1536, website: "https://www.clsbe.lisboa.ucp.pt", imageUrl: "", durationYears: 2, countryColor: "#fbbf24" },
  { id: "iseg-lisbon-mim", lat: 38.7138, lng: -9.1570, website: "https://www.iseg.ulisboa.pt", imageUrl: "", durationYears: 2, countryColor: "#fbbf24" },
  { id: "porto-fep-mim", lat: 41.1534, lng: -8.6360, website: "https://www.fep.up.pt", imageUrl: "", durationYears: 2, countryColor: "#fbbf24" },
  { id: "iscte-mim", lat: 38.7492, lng: -9.1536, website: "https://www.iscte-iul.pt", imageUrl: "", durationYears: 2, countryColor: "#fbbf24" },

  // ── İrlanda ──
  { id: "trinity-dublin-mim", lat: 53.3439, lng: -6.2546, website: "https://www.tcd.ie", imageUrl: "", durationYears: 2, countryColor: "#22c55e" },
  { id: "ucd-smurfit-mim", lat: 53.3073, lng: -6.2237, website: "https://www.smurfitschool.ie", imageUrl: "", durationYears: 2, countryColor: "#22c55e" },

  // ── Avusturya ──
  { id: "wu-vienna-mim", lat: 48.2133, lng: 16.4059, website: "https://www.wu.ac.at", imageUrl: "", durationYears: 2, countryColor: "#ef4444" },
  { id: "tu-wien-eng", lat: 48.1987, lng: 16.3700, website: "https://www.tuwien.at", imageUrl: "", durationYears: 2, countryColor: "#ef4444" },
  { id: "tu-wien-arch", lat: 48.1990, lng: 16.3703, website: "https://www.tuwien.at", imageUrl: "", durationYears: 2, countryColor: "#ef4444" },

  // ── Polonya ──
  { id: "kozminski-mim", lat: 52.2534, lng: 20.9229, website: "https://www.kozminski.edu.pl", imageUrl: "", durationYears: 2, countryColor: "#ef4444" },
  { id: "sgh-warsaw-mim", lat: 52.2089, lng: 21.0082, website: "https://www.sgh.waw.pl", imageUrl: "", durationYears: 2, countryColor: "#ef4444" },

  // ── Çekya ──
  { id: "prague-economics-mim", lat: 50.0847, lng: 14.4411, website: "https://www.vse.cz", imageUrl: "", durationYears: 2, countryColor: "#3b82f6" },

  // ── Macaristan ──
  { id: "corvinus-mim", lat: 47.4771, lng: 19.0613, website: "https://www.uni-corvinus.hu", imageUrl: "", durationYears: 2, countryColor: "#f59e0b" },
];
