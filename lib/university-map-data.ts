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

// University campus images from Wikimedia Commons
const IMG: Record<string, string> = {
  // Netherlands
  "tu-delft": WP("TU_Delft_-_EWI.JPG"),
  "amsterdam": WP("Agnietenkapel,_Amsterdam_(2).jpg"),
  "groningen": WP("Groningen_Academiegebouw.jpg"),
  "maastricht": WP("Tapijnkazerne,_Maastricht_2.jpg"),
  "erasmus": WP("Erasmus_University_Rotterdam_-_Campus_Woudestein.jpg"),
  "utrecht": WP("Academiegebouw_Universiteit_Utrecht.jpg"),
  "leiden": WP("Leiden_University_-_Academy_Building.jpg"),
  "eindhoven": WP("Eindhoven_University_of_Technology_01.jpg"),
  "tilburg": WP("Tilburg_University_Cobbenhagen_building.jpg"),
  "twente": WP("Universiteit_Twente_Bastille.jpg"),
  "wageningen": WP("Forum_building_of_Wageningen_University.jpg"),
  "radboud": WP("Radboud_Universiteit.jpg"),
  "vu": WP("Vrije_Universiteit_Amsterdam_-_main_building_-_2.jpg"),
  // Italy
  "bocconi": WP("Bocconi_-_Nuovo_Campus_-_Grafton_Architects.jpg"),
  "polimi": WP("Politecnico_Milano_Campus_Leonardo.jpg"),
  "bologna": WP("Bologna_Archiginnasio.jpg"),
  "padua": WP("Palazzo_del_Bo.jpg"),
  "trento": WP("Universit%C3%A0_degli_Studi_di_Trento_-_Facolt%C3%A0_di_Sociologia.jpg"),
  "luiss": WP("LUISS_University.jpg"),
  "milan": WP("Milano_-_Universit%C3%A0_Statale_-_Ca%27_Granda_01.jpg"),
  "cafoscari": WP("Ca%27_Foscari.jpg"),
  "torino": WP("Universit%C3%A0_degli_Studi_di_Torino.JPG"),
  "sapienza": WP("Universit%C3%A0_di_Roma_-_La_Sapienza.jpg"),
  "pavia": WP("Pavia_universit%C3%A0_cortile.jpg"),
  "polito": WP("Politecnico_di_Torino_-_sede_centrale.jpg"),
  // Germany
  "tum": WP("Audimax_TUM.JPG"),
  "rwth": WP("RWTH_Aachen_Hauptgeb%C3%A4ude.jpg"),
  "jacobs": WP("Jacobs_University_Bremen.jpg"),
  "constructor": WP("Jacobs_University_Bremen.jpg"),
  "tu-berlin": WP("TU_Berlin_Hauptgeb%C3%A4ude.jpg"),
  "lmu": WP("LMU_Muenchen.jpg"),
  "mannheim": WP("Schloss_Mannheim_Luftbild.jpg"),
  "ebs": WP("EBS_Business_School_Oestrich-Winkel.jpg"),
  "whu": WP("WHU_Otto_Beisheim_School_of_Management.jpg"),
  "kit": WP("KIT_-_Karlsruher_Institut_f%C3%BCr_Technologie_-_Campus_S%C3%BCd.jpg"),
  "bard": WP("Bard_College_Berlin.jpg"),
  "escp": WP("ESCP_Business_School_Berlin.jpg"),
  // UK
  "oxford": WP("Radcliffe_Camera%2C_Oxford_-_Oct_2006.jpg"),
  "cambridge": WP("KingsCollegeChapelWest.jpg"),
  "imperial": WP("Imperial_College_London_Exhibition_Road_frontage.jpg"),
  "ucl": WP("Wilkins_Building_1%2C_UCL%2C_London_-_Diliff.jpg"),
  "lse": WP("LSE_New_Academic_Building.jpg"),
  "kcl": WP("King%27s_College_London_Chapel_2%2C_London_-_Diliff.jpg"),
  "edinburgh": WP("Old_College%2C_University_of_Edinburgh_%28geograph_3088tried955%29.jpg"),
  "manchester": WP("The_University_of_Manchester%2C_Oxford_Road.jpg"),
  "warwick": WP("Warwick_Arts_Centre.jpg"),
  "bristol": WP("University_of_Bristol_from_Cabot_Tower.jpg"),
  "bath": WP("University_of_Bath_campus.jpg"),
  "glasgow": WP("University_of_Glasgow_Gilbert_Scott_Building_-_Feb_2008.jpg"),
  "exeter": WP("University_of_Exeter_-_Forum.jpg"),
  "leeds": WP("Parkinson_Building%2C_Leeds_University.jpg"),
  "birmingham": WP("Birmingham_University_Aston_Webb.jpg"),
  "nottingham": WP("Trent_Building%2C_University_of_Nottingham_%28east_frontage%29.jpg"),
  "sheffield": WP("Firth_Court_Sheffield.jpg"),
  "southampton": WP("Hartley_Library%2C_University_of_Southampton.jpg"),
  "durham": WP("Durham_Castle.jpg"),
  "lancaster": WP("Lancaster_University.jpg"),
  "standrews": WP("StAndrews_CollegeChurch.jpg"),
  "loughborough": WP("Hazlerigg_building%2C_Loughborough_University.jpg"),
  "queen-mary": WP("Queen_Mary_University_of_London_-_Geography_Building.jpg"),
  "york": WP("Heslington_Hall%2C_University_of_York.jpg"),
  "liverpool": WP("Victoria_Building%2C_University_of_Liverpool_2.jpg"),
  "sussex": WP("Sussex_University_-_geograph.org.uk_-_Photo_by_Simon_Carey.jpg"),
  "newcastle": WP("Armstrong_Building%2C_Newcastle_University.jpg"),
  "qub": WP("Queen%27s_University_Belfast_by_Paride.jpg"),
  // France
  "sciences-po": WP("Paris_-_Sciences_po_-_27_rue_Saint-Guillaume_-_1.jpg"),
  "essec": WP("ESSEC_Business_School.jpg"),
  "edhec": WP("EDHEC_Business_School.jpg"),
  "emlyon": WP("EmLyon.jpg"),
  "audencia": WP("Audencia_Business_School.jpg"),
  "neoma": WP("Neoma_Business_School.jpg"),
  "kedge": WP("Kedge_Business_School_Marseille.jpg"),
  "ieseg": WP("IESEG_School_of_Management_Lille.jpg"),
  "skema": WP("SKEMA_Business_School.jpg"),
  // Spain
  "ie": WP("IE_University_Segovia.jpg"),
  "esade": WP("ESADE_Business_School.jpg"),
  "carlos-iii": WP("Universidad_Carlos_III_-_Campus_de_Getafe.jpg"),
  "pompeu-fabra": WP("Universitat_Pompeu_Fabra_-_Ciutadella_campus.jpg"),
  "autonoma-madrid": WP("Universidad_Aut%C3%B3noma_de_Madrid.jpg"),
  "navarra": WP("University_of_Navarra_-_Science_Building.jpg"),
  "ub": WP("Pla%C3%A7a_Universitat_-_Edifici_hist%C3%B2ric_UB.jpg"),
  // Sweden
  "lund": WP("Universitetshuset_i_Lund.jpg"),
  "kth": WP("KTH_Royal_Institute_of_Technology.jpg"),
  "stockholm": WP("S%C3%B6dra_husen%2C_Stockholms_universitet.JPG"),
  "sse": WP("Handelsh%C3%B6gskolan_i_Stockholm.jpg"),
  "gothenburg": WP("University_of_Gothenburg_-_School_of_Business%2C_Economics_and_Law.jpg"),
  "karolinska": WP("Karolinska_Institutet.JPG"),
  "uppsala": WP("Universitetshuset_Uppsala.jpg"),
  "linkoping": WP("Link%C3%B6pings_universitet_Campus_Valla.jpg"),
  // Denmark
  "cbs": WP("Copenhagen_Business_School_-_Solbjerg_Plads.jpg"),
  "aarhus": WP("Aarhus_University_main_building.jpg"),
  "copenhagen": WP("K%C3%B8benhavns_Universitet_-_Frue_Plads.jpg"),
  "dtu": WP("DTU_main_building.jpg"),
  "sdu": WP("Syddansk_Universitet_main_building.jpg"),
  "aalborg": WP("Aalborg_Universitet.jpg"),
  // Norway
  "nhh": WP("NHH_Norwegian_School_of_Economics.jpg"),
  "bi-norwegian": WP("BI_Norwegian_Business_School_Oslo.jpg"),
  // Finland
  "aalto": WP("Aalto_University_Undergraduate_Centre.jpg"),
  "helsinki": WP("Helsinki_University_Main_Building.jpg"),
  "tampere": WP("Tampere_University_Main_Building.jpg"),
  "turku": WP("Turun_yliopisto.jpg"),
  // Belgium
  "kuleuven": WP("University_Hall_KU_Leuven.jpg"),
  "ghent": WP("Universiteit_Gent_-_Boekentoren.jpg"),
  "antwerp": WP("Universiteit_Antwerpen_-_Stadscampus.jpg"),
  // Portugal
  "nova": WP("Nova_SBE_Campus_Carcavelos.jpg"),
  "catolica": WP("Universidade_Cat%C3%B3lica_Portuguesa.jpg"),
  "iscte": WP("ISCTE-IUL_campus.jpg"),
  // Ireland
  "trinity": WP("Trinity_College_Dublin_2018.jpg"),
  "ucd": WP("UCD_James_Joyce_Library.jpg"),
  "ucc": WP("University_College_Cork_-_Quad.jpg"),
  // Switzerland
  "st-gallen": WP("Universit%C3%A4t_St._Gallen.jpg"),
  // Austria
  "modul": WP("MODUL_University_Vienna.jpg"),
  "wu": WP("WU_Wien_Library_%26_Learning_Center.jpg"),
  // Poland
  "kozminski": WP("Kozminski_University_Warsaw.jpg"),
  "sgh": WP("SGH_Warsaw_School_of_Economics.jpg"),
  "warsaw": WP("Pa%C5%82ac_Kazimierzowski_w_Warszawie_2019.jpg"),
  // Czech Republic
  "charles": WP("Karolinum_001.jpg"),
  "masaryk": WP("Masaryk_University_-_Faculty_of_Arts.jpg"),
  // Hungary
  "corvinus": WP("Corvinus_University_of_Budapest%2C_Main_building.jpg"),
  // Estonia
  "taltech": WP("TalTech_peahoone.jpg"),
  "tartu": WP("Tartu_%C3%9Clikool_peahoone.JPG"),
};

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
  { id: "tu-delft-bsc-ae", lat: 51.9975, lng: 4.3748, website: "https://www.tudelft.nl", imageUrl: IMG["tu-delft"], durationYears: 3, countryColor: "#f59e0b" },
  { id: "tu-delft-bsc-cs", lat: 51.9980, lng: 4.3750, website: "https://www.tudelft.nl", imageUrl: IMG["tu-delft"], durationYears: 3, countryColor: "#f59e0b" },
  { id: "amsterdam-bsc-economics", lat: 52.3567, lng: 4.9557, website: "https://www.uva.nl", imageUrl: IMG["amsterdam"], durationYears: 3, countryColor: "#f59e0b" },
  { id: "amsterdam-bsc-cs", lat: 52.3562, lng: 4.9560, website: "https://www.uva.nl", imageUrl: IMG["amsterdam"], durationYears: 3, countryColor: "#f59e0b" },
  { id: "groningen-bsc-psychology", lat: 53.2197, lng: 6.5670, website: "https://www.rug.nl", imageUrl: IMG["groningen"], durationYears: 3, countryColor: "#f59e0b" },
  { id: "groningen-bsc-ir", lat: 53.2200, lng: 6.5673, website: "https://www.rug.nl", imageUrl: IMG["groningen"], durationYears: 3, countryColor: "#f59e0b" },
  { id: "maastricht-bsc-business", lat: 50.8470, lng: 5.6876, website: "https://www.maastrichtuniversity.nl", imageUrl: IMG["maastricht"], durationYears: 3, countryColor: "#f59e0b" },
  { id: "eindhoven-bsc-me", lat: 51.4480, lng: 5.4907, website: "https://www.tue.nl", imageUrl: IMG["eindhoven"], durationYears: 3, countryColor: "#f59e0b" },
  // İtalya
  { id: "bocconi-bsc-economics", lat: 45.4489, lng: 9.1902, website: "https://www.unibocconi.eu", imageUrl: IMG["bocconi"], durationYears: 3, countryColor: "#22c55e" },
  { id: "bocconi-bsc-business", lat: 45.4495, lng: 9.1908, website: "https://www.unibocconi.eu", imageUrl: IMG["bocconi"], durationYears: 3, countryColor: "#22c55e" },
  { id: "polimi-bsc-eng", lat: 45.4789, lng: 9.2283, website: "https://www.polimi.it", imageUrl: IMG["polimi"], durationYears: 3, countryColor: "#22c55e" },
  { id: "bologna-bsc-business", lat: 44.4971, lng: 11.3527, website: "https://www.unibo.it", imageUrl: IMG["bologna"], durationYears: 3, countryColor: "#22c55e" },
  // Almanya
  { id: "tum-bsc-management", lat: 48.2635, lng: 11.6693, website: "https://www.tum.de", imageUrl: IMG["tum"], durationYears: 3, countryColor: "#3b82f6" },
  { id: "rwth-bsc-business", lat: 50.7804, lng: 6.0660, website: "https://www.rwth-aachen.de", imageUrl: IMG["rwth"], durationYears: 3, countryColor: "#3b82f6" },
  { id: "jacobs-bsc-cs", lat: 53.1068, lng: 8.8524, website: "https://www.jacobs-university.de", imageUrl: IMG["jacobs"], durationYears: 3, countryColor: "#3b82f6" },
  // İngiltere
  { id: "ucl-bsc-economics", lat: 51.5249, lng: -0.1343, website: "https://www.ucl.ac.uk", imageUrl: IMG["ucl"], durationYears: 3, countryColor: "#3b82f6" },
  { id: "imperial-bsc-cs", lat: 51.4995, lng: -0.1755, website: "https://www.imperial.ac.uk", imageUrl: IMG["imperial"], durationYears: 3, countryColor: "#3b82f6" },
  { id: "edinburgh-bsc-cs", lat: 55.9449, lng: -3.1878, website: "https://www.ed.ac.uk", imageUrl: IMG["edinburgh"], durationYears: 4, countryColor: "#3b82f6" },
  { id: "warwick-bsc-economics", lat: 52.3841, lng: -1.5619, website: "https://www.warwick.ac.uk", imageUrl: IMG["warwick"], durationYears: 3, countryColor: "#3b82f6" },
  { id: "manchester-bsc-business", lat: 53.4671, lng: -2.2342, website: "https://www.manchester.ac.uk", imageUrl: IMG["manchester"], durationYears: 3, countryColor: "#3b82f6" },
  { id: "kcl-bsc-business", lat: 51.5115, lng: -0.1160, website: "https://www.kcl.ac.uk", imageUrl: IMG["kcl"], durationYears: 3, countryColor: "#3b82f6" },
  // İsveç
  { id: "lund-bsc-economics", lat: 55.7120, lng: 13.2097, website: "https://www.lunduniversity.lu.se", imageUrl: IMG["lund"], durationYears: 3, countryColor: "#fbbf24" },
  // Danimarka
  { id: "cbs-bsc-business", lat: 55.6819, lng: 12.5278, website: "https://www.cbs.dk", imageUrl: IMG["cbs"], durationYears: 3, countryColor: "#60a5fa" },
  // İspanya
  { id: "ie-bsc-business", lat: 40.4481, lng: -3.6926, website: "https://www.ie.edu", imageUrl: IMG["ie"], durationYears: 4, countryColor: "#ef4444" },
  { id: "ie-bsc-cs", lat: 40.4483, lng: -3.6929, website: "https://www.ie.edu", imageUrl: IMG["ie"], durationYears: 4, countryColor: "#ef4444" },
  // İrlanda
  { id: "trinity-bsc-business", lat: 53.3442, lng: -6.2549, website: "https://www.tcd.ie", imageUrl: IMG["trinity"], durationYears: 4, countryColor: "#22c55e" },
  { id: "trinity-bsc-cs", lat: 53.3445, lng: -6.2552, website: "https://www.tcd.ie", imageUrl: IMG["trinity"], durationYears: 4, countryColor: "#22c55e" },
  // Çekya
  { id: "charles-bsc-economics", lat: 50.0850, lng: 14.4414, website: "https://www.cuni.cz", imageUrl: IMG["charles"], durationYears: 3, countryColor: "#3b82f6" },
  // Macaristan
  { id: "corvinus-bsc-business", lat: 47.4774, lng: 19.0616, website: "https://www.uni-corvinus.hu", imageUrl: IMG["corvinus"], durationYears: 3, countryColor: "#f59e0b" },
  // Polonya
  { id: "kozminski-bsc-management", lat: 52.2537, lng: 20.9232, website: "https://www.kozminski.edu.pl", imageUrl: IMG["kozminski"], durationYears: 3, countryColor: "#ef4444" },

  // ── Hollanda (Bachelor) ──
  { id: "erasmus-bsc-economics", lat: 51.9173, lng: 4.5263, website: "https://www.eur.nl", imageUrl: IMG["erasmus"], durationYears: 3, countryColor: "#f59e0b" },
  { id: "erasmus-bsc-iba", lat: 51.9176, lng: 4.5266, website: "https://www.rsm.nl", imageUrl: IMG["erasmus"], durationYears: 3, countryColor: "#f59e0b" },
  { id: "erasmus-bsc-econometrics", lat: 51.9179, lng: 4.5269, website: "https://www.eur.nl", imageUrl: IMG["erasmus"], durationYears: 3, countryColor: "#f59e0b" },
  { id: "utrecht-bsc-economics", lat: 52.0843, lng: 5.1744, website: "https://www.uu.nl", imageUrl: IMG["utrecht"], durationYears: 3, countryColor: "#f59e0b" },
  { id: "utrecht-bsc-las", lat: 52.0890, lng: 5.1136, website: "https://www.uu.nl", imageUrl: IMG["utrecht"], durationYears: 3, countryColor: "#f59e0b" },
  { id: "leiden-bsc-polsci", lat: 52.1574, lng: 4.4857, website: "https://www.universiteitleiden.nl", imageUrl: IMG["leiden"], durationYears: 3, countryColor: "#f59e0b" },
  { id: "leiden-bsc-ir", lat: 52.0870, lng: 4.3284, website: "https://www.universiteitleiden.nl", imageUrl: IMG["leiden"], durationYears: 3, countryColor: "#f59e0b" },
  { id: "leiden-bsc-psychology", lat: 52.1568, lng: 4.4850, website: "https://www.universiteitleiden.nl", imageUrl: IMG["leiden"], durationYears: 3, countryColor: "#f59e0b" },
  { id: "vu-bsc-ba", lat: 52.3338, lng: 4.8650, website: "https://www.vu.nl", imageUrl: IMG["vu"], durationYears: 3, countryColor: "#f59e0b" },
  { id: "vu-bsc-ib", lat: 52.3341, lng: 4.8653, website: "https://www.vu.nl", imageUrl: IMG["vu"], durationYears: 3, countryColor: "#f59e0b" },
  { id: "tilburg-bsc-iba", lat: 51.5641, lng: 5.0438, website: "https://www.tilburguniversity.edu", imageUrl: IMG["tilburg"], durationYears: 3, countryColor: "#f59e0b" },
  { id: "tilburg-bsc-economics", lat: 51.5644, lng: 5.0441, website: "https://www.tilburguniversity.edu", imageUrl: IMG["tilburg"], durationYears: 3, countryColor: "#f59e0b" },
  { id: "wageningen-bsc-food", lat: 51.9692, lng: 5.6653, website: "https://www.wur.nl", imageUrl: IMG["wageningen"], durationYears: 3, countryColor: "#f59e0b" },
  { id: "radboud-bsc-ba", lat: 51.8198, lng: 5.8663, website: "https://www.ru.nl", imageUrl: IMG["radboud"], durationYears: 3, countryColor: "#f59e0b" },
  { id: "twente-bsc-tcs", lat: 52.2399, lng: 6.8564, website: "https://www.utwente.nl", imageUrl: IMG["twente"], durationYears: 3, countryColor: "#f59e0b" },
  { id: "twente-bsc-iba", lat: 52.2402, lng: 6.8567, website: "https://www.utwente.nl", imageUrl: IMG["twente"], durationYears: 3, countryColor: "#f59e0b" },
  { id: "groningen-bsc-economics", lat: 53.2203, lng: 6.5676, website: "https://www.rug.nl", imageUrl: IMG["groningen"], durationYears: 3, countryColor: "#f59e0b" },
  { id: "maastricht-bsc-economics", lat: 50.8473, lng: 5.6879, website: "https://www.maastrichtuniversity.nl", imageUrl: IMG["maastricht"], durationYears: 3, countryColor: "#f59e0b" },

  // ── İtalya (Bachelor) ──
  { id: "bologna-bsc-polsci", lat: 44.4974, lng: 11.3530, website: "https://www.unibo.it", imageUrl: IMG["bologna"], durationYears: 3, countryColor: "#22c55e" },
  { id: "padua-bsc-economics", lat: 45.4064, lng: 11.8768, website: "https://www.unipd.it", imageUrl: IMG["padua"], durationYears: 3, countryColor: "#22c55e" },
  { id: "trento-bsc-economics", lat: 46.0664, lng: 11.1505, website: "https://www.unitn.it", imageUrl: IMG["trento"], durationYears: 3, countryColor: "#22c55e" },
  { id: "luiss-bsc-economics", lat: 41.9242, lng: 12.4932, website: "https://www.luiss.it", imageUrl: IMG["luiss"], durationYears: 3, countryColor: "#22c55e" },
  { id: "luiss-bsc-polsci", lat: 41.9245, lng: 12.4935, website: "https://www.luiss.it", imageUrl: IMG["luiss"], durationYears: 3, countryColor: "#22c55e" },
  { id: "milan-bsc-intpol", lat: 45.4601, lng: 9.1946, website: "https://www.unimi.it", imageUrl: IMG["milan"], durationYears: 3, countryColor: "#22c55e" },
  { id: "cafoscari-bsc-dm", lat: 45.4371, lng: 12.3265, website: "https://www.unive.it", imageUrl: IMG["cafoscari"], durationYears: 3, countryColor: "#22c55e" },
  { id: "torino-bsc-business", lat: 45.0634, lng: 7.6627, website: "https://www.unito.it", imageUrl: IMG["torino"], durationYears: 3, countryColor: "#22c55e" },
  { id: "polimi-bsc-design", lat: 45.4792, lng: 9.2271, website: "https://www.polimi.it", imageUrl: IMG["polimi"], durationYears: 3, countryColor: "#22c55e" },

  // ── Almanya (Bachelor) ──
  { id: "constructor-bsc-iba", lat: 53.1071, lng: 8.8527, website: "https://constructor.university", imageUrl: IMG["constructor"], durationYears: 3, countryColor: "#3b82f6" },
  { id: "constructor-bsc-datasci", lat: 53.1074, lng: 8.8530, website: "https://constructor.university", imageUrl: IMG["constructor"], durationYears: 3, countryColor: "#3b82f6" },
  { id: "constructor-bsc-biochem", lat: 53.1077, lng: 8.8533, website: "https://constructor.university", imageUrl: IMG["constructor"], durationYears: 3, countryColor: "#3b82f6" },
  { id: "escp-bsc-management", lat: 52.5070, lng: 13.3220, website: "https://escp.eu", imageUrl: IMG["escp"], durationYears: 3, countryColor: "#3b82f6" },
  { id: "bard-ba-humanities", lat: 52.4470, lng: 13.1643, website: "https://www.berlin.bard.edu", imageUrl: IMG["bard"], durationYears: 4, countryColor: "#3b82f6" },
  { id: "whu-bsc-iba", lat: 50.3982, lng: 7.6201, website: "https://www.whu.edu", imageUrl: IMG["whu"], durationYears: 3, countryColor: "#3b82f6" },
  { id: "ebs-bsc-business", lat: 50.0832, lng: 8.2400, website: "https://www.ebs.edu", imageUrl: IMG["ebs"], durationYears: 3, countryColor: "#3b82f6" },
  { id: "tum-bsc-cs", lat: 48.2631, lng: 11.6689, website: "https://www.tum.de", imageUrl: IMG["tum"], durationYears: 3, countryColor: "#3b82f6" },

  // ── İngiltere (Bachelor) ──
  { id: "bristol-bsc-economics", lat: 51.4584, lng: -2.6030, website: "https://www.bristol.ac.uk", imageUrl: IMG["bristol"], durationYears: 3, countryColor: "#3b82f6" },
  { id: "leeds-bsc-business", lat: 53.8067, lng: -1.5550, website: "https://www.leeds.ac.uk", imageUrl: IMG["leeds"], durationYears: 3, countryColor: "#3b82f6" },
  { id: "birmingham-bsc-business", lat: 52.4508, lng: -1.9305, website: "https://www.birmingham.ac.uk", imageUrl: IMG["birmingham"], durationYears: 3, countryColor: "#3b82f6" },
  { id: "bath-bsc-ba", lat: 51.3799, lng: -2.3282, website: "https://www.bath.ac.uk", imageUrl: IMG["bath"], durationYears: 4, countryColor: "#3b82f6" },
  { id: "loughborough-bsc-be", lat: 52.7649, lng: -1.2276, website: "https://www.lboro.ac.uk", imageUrl: IMG["loughborough"], durationYears: 3, countryColor: "#3b82f6" },
  { id: "glasgow-bsc-cs", lat: 55.8724, lng: -4.2882, website: "https://www.gla.ac.uk", imageUrl: IMG["glasgow"], durationYears: 4, countryColor: "#3b82f6" },
  { id: "lse-bsc-economics", lat: 51.5148, lng: -0.1171, website: "https://www.lse.ac.uk", imageUrl: IMG["lse"], durationYears: 3, countryColor: "#3b82f6" },
  { id: "oxford-ba-em", lat: 51.7553, lng: -1.2552, website: "https://www.ox.ac.uk", imageUrl: IMG["oxford"], durationYears: 3, countryColor: "#3b82f6" },
  { id: "cambridge-ba-economics", lat: 52.2043, lng: 0.1178, website: "https://www.cam.ac.uk", imageUrl: IMG["cambridge"], durationYears: 3, countryColor: "#3b82f6" },
  { id: "exeter-bsc-business", lat: 50.7355, lng: -3.5344, website: "https://www.exeter.ac.uk", imageUrl: IMG["exeter"], durationYears: 3, countryColor: "#3b82f6" },
  { id: "nottingham-bsc-economics", lat: 52.9391, lng: -1.1963, website: "https://www.nottingham.ac.uk", imageUrl: IMG["nottingham"], durationYears: 3, countryColor: "#3b82f6" },
  { id: "sheffield-bsc-cs", lat: 53.3811, lng: -1.4882, website: "https://www.sheffield.ac.uk", imageUrl: IMG["sheffield"], durationYears: 3, countryColor: "#3b82f6" },
  { id: "southampton-bsc-cs", lat: 50.9348, lng: -1.3964, website: "https://www.southampton.ac.uk", imageUrl: IMG["southampton"], durationYears: 3, countryColor: "#3b82f6" },

  // ── İsveç (Bachelor) ──
  { id: "stockholm-bsc-be", lat: 59.3636, lng: 18.0596, website: "https://www.su.se", imageUrl: IMG["stockholm"], durationYears: 3, countryColor: "#fbbf24" },
  { id: "uppsala-bsc-be", lat: 59.8586, lng: 17.6389, website: "https://www.uu.se", imageUrl: IMG["uppsala"], durationYears: 3, countryColor: "#fbbf24" },
  { id: "kth-bsc-eng", lat: 59.3506, lng: 18.0709, website: "https://www.kth.se", imageUrl: IMG["kth"], durationYears: 3, countryColor: "#fbbf24" },

  // ── Danimarka (Bachelor) ──
  { id: "aarhus-bsc-ba", lat: 56.1689, lng: 10.2030, website: "https://www.au.dk", imageUrl: IMG["aarhus"], durationYears: 3, countryColor: "#60a5fa" },
  { id: "sdu-bsc-eng", lat: 55.3688, lng: 10.4310, website: "https://www.sdu.dk", imageUrl: IMG["sdu"], durationYears: 3, countryColor: "#60a5fa" },
  { id: "dtu-bsc-eng", lat: 55.7862, lng: 12.5217, website: "https://www.dtu.dk", imageUrl: IMG["dtu"], durationYears: 3, countryColor: "#60a5fa" },

  // ── Finlandiya (Bachelor) ──
  { id: "aalto-bsc-ib", lat: 60.1863, lng: 24.8270, website: "https://www.aalto.fi", imageUrl: IMG["aalto"], durationYears: 3, countryColor: "#22c55e" },
  { id: "aalto-bsc-datasci", lat: 60.1867, lng: 24.8273, website: "https://www.aalto.fi", imageUrl: IMG["aalto"], durationYears: 3, countryColor: "#22c55e" },
  { id: "helsinki-bsc-science", lat: 60.2046, lng: 24.9633, website: "https://www.helsinki.fi", imageUrl: IMG["helsinki"], durationYears: 3, countryColor: "#22c55e" },

  // ── İspanya (Bachelor) ──
  { id: "esade-bba", lat: 41.3839, lng: 2.1169, website: "https://www.esade.edu", imageUrl: IMG["esade"], durationYears: 4, countryColor: "#ef4444" },
  { id: "ub-bsc-business", lat: 41.3862, lng: 2.1649, website: "https://www.ub.edu", imageUrl: IMG["ub"], durationYears: 4, countryColor: "#ef4444" },

  // ── Avusturya (Bachelor) ──
  { id: "modul-bsc-im", lat: 48.2571, lng: 16.3677, website: "https://www.modul.ac.at", imageUrl: IMG["modul"], durationYears: 3, countryColor: "#ef4444" },
  { id: "wu-bsc-be", lat: 48.2136, lng: 16.4062, website: "https://www.wu.ac.at", imageUrl: IMG["wu"], durationYears: 3, countryColor: "#ef4444" },

  // ── Belçika (Bachelor) ──
  { id: "kuleuven-bsc-beng", lat: 50.8775, lng: 4.7010, website: "https://www.kuleuven.be", imageUrl: IMG["kuleuven"], durationYears: 3, countryColor: "#f59e0b" },
  { id: "kuleuven-bsc-economics", lat: 50.8778, lng: 4.7013, website: "https://www.kuleuven.be", imageUrl: IMG["kuleuven"], durationYears: 3, countryColor: "#f59e0b" },
  { id: "ghent-bsc-beng", lat: 51.0520, lng: 3.7282, website: "https://www.ugent.be", imageUrl: IMG["ghent"], durationYears: 3, countryColor: "#f59e0b" },

  // ── Portekiz (Bachelor) ──
  { id: "nova-bsc-economics", lat: 38.6785, lng: -9.3189, website: "https://www.novasbe.pt", imageUrl: IMG["nova"], durationYears: 3, countryColor: "#fbbf24" },
  { id: "nova-bsc-management", lat: 38.6788, lng: -9.3192, website: "https://www.novasbe.pt", imageUrl: IMG["nova"], durationYears: 3, countryColor: "#fbbf24" },
  { id: "catolica-bsc-management", lat: 38.7477, lng: -9.1539, website: "https://www.clsbe.lisboa.ucp.pt", imageUrl: IMG["catolica"], durationYears: 3, countryColor: "#fbbf24" },

  // ── İrlanda (Bachelor) ──
  { id: "ucd-bsc-business", lat: 53.3076, lng: -6.2240, website: "https://www.ucd.ie", imageUrl: IMG["ucd"], durationYears: 4, countryColor: "#22c55e" },
  { id: "ucd-bsc-cs", lat: 53.3079, lng: -6.2243, website: "https://www.ucd.ie", imageUrl: IMG["ucd"], durationYears: 4, countryColor: "#22c55e" },
  { id: "ucc-bsc-bis", lat: 51.8936, lng: -8.4921, website: "https://www.ucc.ie", imageUrl: IMG["ucc"], durationYears: 4, countryColor: "#22c55e" },

  // ── Top Üniversite Bachelor Eklentileri ──
  { id: "sciences-po-bsc-polsci", lat: 48.8542, lng: 2.3289, website: "https://www.sciencespo.fr", imageUrl: IMG["sciences-po"], durationYears: 3, countryColor: "#60a5fa" },
  { id: "sciences-po-bsc-economics", lat: 49.2547, lng: 4.0341, website: "https://www.sciencespo.fr", imageUrl: IMG["sciences-po"], durationYears: 3, countryColor: "#60a5fa" },
  { id: "lmu-bsc-economics", lat: 48.1505, lng: 11.5808, website: "https://www.lmu.de", imageUrl: IMG["lmu"], durationYears: 3, countryColor: "#3b82f6" },
  { id: "mannheim-bsc-business", lat: 49.4831, lng: 8.4625, website: "https://www.uni-mannheim.de", imageUrl: IMG["mannheim"], durationYears: 3, countryColor: "#3b82f6" },
  { id: "st-gallen-bsc-ia", lat: 47.4306, lng: 9.3753, website: "https://www.unisg.ch", imageUrl: IMG["st-gallen"], durationYears: 3, countryColor: "#22c55e" },
  { id: "karolinska-bsc-biomed", lat: 59.3487, lng: 18.0234, website: "https://ki.se", imageUrl: IMG["karolinska"], durationYears: 3, countryColor: "#fbbf24" },

  // ── Silinen Okulların Bachelor Map Data ──
  { id: "aalborg-bsc-electronics", lat: 57.0128, lng: 9.9912, website: "https://www.en.aau.dk", imageUrl: IMG["aalborg"], durationYears: 3, countryColor: "#60a5fa" },
  { id: "aalborg-bsc-energy", lat: 57.0132, lng: 9.9916, website: "https://www.en.aau.dk", imageUrl: IMG["aalborg"], durationYears: 3, countryColor: "#60a5fa" },
  { id: "antwerp-bsc-be", lat: 51.2194, lng: 4.4025, website: "https://www.uantwerpen.be", imageUrl: IMG["antwerp"], durationYears: 3, countryColor: "#f59e0b" },
  { id: "durham-bsc-cs", lat: 54.7681, lng: -1.5724, website: "https://www.durham.ac.uk", imageUrl: IMG["durham"], durationYears: 3, countryColor: "#3b82f6" },
  { id: "durham-bsc-economics", lat: 54.7685, lng: -1.5720, website: "https://www.durham.ac.uk", imageUrl: IMG["durham"], durationYears: 3, countryColor: "#3b82f6" },
  { id: "lancaster-bsc-business", lat: 54.0104, lng: -2.7877, website: "https://www.lancaster.ac.uk", imageUrl: IMG["lancaster"], durationYears: 3, countryColor: "#3b82f6" },
  { id: "lancaster-bsc-cs", lat: 54.0108, lng: -2.7873, website: "https://www.lancaster.ac.uk", imageUrl: IMG["lancaster"], durationYears: 3, countryColor: "#3b82f6" },
  { id: "standrews-bsc-cs", lat: 56.3398, lng: -2.7967, website: "https://www.st-andrews.ac.uk", imageUrl: IMG["standrews"], durationYears: 4, countryColor: "#3b82f6" },
  { id: "standrews-bsc-economics", lat: 56.3402, lng: -2.7963, website: "https://www.st-andrews.ac.uk", imageUrl: IMG["standrews"], durationYears: 4, countryColor: "#3b82f6" },
  { id: "standrews-bsc-ir", lat: 56.3406, lng: -2.7959, website: "https://www.st-andrews.ac.uk", imageUrl: IMG["standrews"], durationYears: 4, countryColor: "#3b82f6" },
  { id: "polito-bsc-eng", lat: 45.0628, lng: 7.6620, website: "https://www.polito.it", imageUrl: IMG["polito"], durationYears: 3, countryColor: "#22c55e" },
  { id: "polito-bsc-auto", lat: 45.0632, lng: 7.6624, website: "https://www.polito.it", imageUrl: IMG["polito"], durationYears: 3, countryColor: "#22c55e" },
  { id: "carlos-iii-bsc-economics", lat: 40.3318, lng: -3.7660, website: "https://www.uc3m.es", imageUrl: IMG["carlos-iii"], durationYears: 4, countryColor: "#ef4444" },
  { id: "carlos-iii-bsc-business", lat: 40.3322, lng: -3.7656, website: "https://www.uc3m.es", imageUrl: IMG["carlos-iii"], durationYears: 4, countryColor: "#ef4444" },
  { id: "pompeu-fabra-bsc-economics", lat: 41.3898, lng: 2.1944, website: "https://www.upf.edu", imageUrl: IMG["pompeu-fabra"], durationYears: 4, countryColor: "#ef4444" },
  { id: "gothenburg-bsc-se", lat: 57.6876, lng: 11.9795, website: "https://www.gu.se", imageUrl: IMG["gothenburg"], durationYears: 3, countryColor: "#fbbf24" },
  { id: "sse-bsc-economics", lat: 59.3401, lng: 18.0580, website: "https://www.hhs.se", imageUrl: IMG["sse"], durationYears: 3, countryColor: "#fbbf24" },
  { id: "iscte-bsc-management", lat: 38.7478, lng: -9.1535, website: "https://www.iscte-iul.pt", imageUrl: IMG["iscte"], durationYears: 3, countryColor: "#fbbf24" },
  { id: "sgh-bsc-ib", lat: 52.2089, lng: 21.0074, website: "https://www.sgh.waw.pl", imageUrl: IMG["sgh"], durationYears: 3, countryColor: "#ef4444" },
  { id: "sgh-bsc-economics", lat: 52.2093, lng: 21.0078, website: "https://www.sgh.waw.pl", imageUrl: IMG["sgh"], durationYears: 3, countryColor: "#ef4444" },
  { id: "copenhagen-bsc-economics", lat: 55.6802, lng: 12.5724, website: "https://www.ku.dk", imageUrl: IMG["copenhagen"], durationYears: 3, countryColor: "#60a5fa" },
  { id: "essec-bba", lat: 49.0340, lng: 2.0765, website: "https://www.essec.edu", imageUrl: IMG["essec"], durationYears: 4, countryColor: "#60a5fa" },

  // ── Fransız Grande Écoles BBA ──
  { id: "edhec-bba", lat: 43.6155, lng: 7.0718, website: "https://www.edhec.edu", imageUrl: IMG["edhec"], durationYears: 4, countryColor: "#60a5fa" },
  { id: "skema-bba", lat: 43.6165, lng: 7.0552, website: "https://www.skema.edu", imageUrl: IMG["skema"], durationYears: 4, countryColor: "#60a5fa" },
  { id: "emlyon-bba", lat: 45.7585, lng: 4.8561, website: "https://em-lyon.com", imageUrl: IMG["emlyon"], durationYears: 4, countryColor: "#60a5fa" },
  { id: "ieseg-bba", lat: 50.6337, lng: 3.0578, website: "https://www.ieseg.fr", imageUrl: IMG["ieseg"], durationYears: 3, countryColor: "#60a5fa" },
  { id: "neoma-bba", lat: 49.2486, lng: 4.0285, website: "https://neoma-bs.com", imageUrl: IMG["neoma"], durationYears: 4, countryColor: "#60a5fa" },
  { id: "kedge-bba", lat: 43.3068, lng: 5.4368, website: "https://kedge.edu", imageUrl: IMG["kedge"], durationYears: 4, countryColor: "#60a5fa" },
  { id: "audencia-bba", lat: 47.2076, lng: -1.5642, website: "https://www.audencia.com", imageUrl: IMG["audencia"], durationYears: 3, countryColor: "#60a5fa" },

  // ── Nordic ──
  { id: "tampere-bsc-tech", lat: 61.4498, lng: 23.8569, website: "https://www.tuni.fi", imageUrl: IMG["tampere"], durationYears: 3, countryColor: "#22c55e" },
  { id: "turku-bsc-tech", lat: 60.4531, lng: 22.2963, website: "https://www.utu.fi", imageUrl: IMG["turku"], durationYears: 3, countryColor: "#22c55e" },
  { id: "linkoping-bsc-se", lat: 58.3968, lng: 15.5770, website: "https://liu.se", imageUrl: IMG["linkoping"], durationYears: 3, countryColor: "#fbbf24" },
  { id: "bi-norwegian-bba", lat: 59.9487, lng: 10.7680, website: "https://www.bi.no", imageUrl: IMG["bi-norwegian"], durationYears: 3, countryColor: "#3b82f6" },
  { id: "nhh-bba", lat: 60.3773, lng: 5.3438, website: "https://www.nhh.no", imageUrl: IMG["nhh"], durationYears: 3, countryColor: "#3b82f6" },

  // ── UK ──
  { id: "queen-mary-bsc-economics", lat: 51.5241, lng: -0.0402, website: "https://www.qmul.ac.uk", imageUrl: IMG["queen-mary"], durationYears: 3, countryColor: "#3b82f6" },
  { id: "york-bsc-cs", lat: 53.9473, lng: -1.0534, website: "https://www.york.ac.uk", imageUrl: IMG["york"], durationYears: 3, countryColor: "#3b82f6" },
  { id: "liverpool-bsc-business", lat: 53.4050, lng: -2.9662, website: "https://www.liverpool.ac.uk", imageUrl: IMG["liverpool"], durationYears: 3, countryColor: "#3b82f6" },
  { id: "sussex-bsc-economics", lat: 50.8665, lng: -0.0872, website: "https://www.sussex.ac.uk", imageUrl: IMG["sussex"], durationYears: 3, countryColor: "#3b82f6" },

  // ── İtalya ──
  { id: "sapienza-bsc-economics", lat: 41.9019, lng: 12.5149, website: "https://www.uniroma1.it", imageUrl: IMG["sapienza"], durationYears: 3, countryColor: "#22c55e" },
  { id: "pavia-bsc-eng", lat: 45.1863, lng: 9.1561, website: "https://www.unipv.it", imageUrl: IMG["pavia"], durationYears: 3, countryColor: "#22c55e" },

  // ── Almanya ──
  { id: "tu-berlin-bsc-cs", lat: 52.5125, lng: 13.3269, website: "https://www.tu.berlin", imageUrl: IMG["tu-berlin"], durationYears: 3, countryColor: "#3b82f6" },

  // ── İspanya ──
  { id: "navarra-bba", lat: 42.8034, lng: -1.6608, website: "https://www.unav.edu", imageUrl: IMG["navarra"], durationYears: 4, countryColor: "#ef4444" },

  // ── Baltık / Orta Avrupa ──
  { id: "taltech-bsc-iba", lat: 59.3953, lng: 24.6718, website: "https://taltech.ee", imageUrl: IMG["taltech"], durationYears: 3, countryColor: "#60a5fa" },
  { id: "masaryk-bsc-economics", lat: 49.1987, lng: 16.6046, website: "https://www.muni.cz", imageUrl: IMG["masaryk"], durationYears: 3, countryColor: "#3b82f6" },

  // ── Ek Programlar ──
  { id: "autonoma-madrid-bsc-polsci", lat: 40.5468, lng: -3.6918, website: "https://www.uam.es", imageUrl: IMG["autonoma-madrid"], durationYears: 4, countryColor: "#ef4444" },
  { id: "eindhoven-bsc-cs", lat: 51.4478, lng: 5.4897, website: "https://www.tue.nl", imageUrl: IMG["eindhoven"], durationYears: 3, countryColor: "#f59e0b" },
  { id: "kit-bsc-me", lat: 49.0124, lng: 8.4157, website: "https://www.kit.edu", imageUrl: IMG["kit"], durationYears: 3, countryColor: "#3b82f6" },
  { id: "newcastle-bsc-engineering", lat: 54.9794, lng: -1.6147, website: "https://www.ncl.ac.uk", imageUrl: IMG["newcastle"], durationYears: 3, countryColor: "#3b82f6" },
  { id: "qub-bsc-cs", lat: 54.5847, lng: -5.9346, website: "https://www.qub.ac.uk", imageUrl: IMG["qub"], durationYears: 3, countryColor: "#3b82f6" },
  { id: "tartu-bsc-cs", lat: 58.3813, lng: 26.7148, website: "https://www.ut.ee", imageUrl: IMG["tartu"], durationYears: 3, countryColor: "#60a5fa" },
  { id: "warsaw-bsc-economics", lat: 52.2396, lng: 21.0172, website: "https://www.uw.edu.pl", imageUrl: IMG["warsaw"], durationYears: 3, countryColor: "#ef4444" },
  { id: "masaryk-bsc-ir", lat: 49.1990, lng: 16.6050, website: "https://www.muni.cz", imageUrl: IMG["masaryk"], durationYears: 3, countryColor: "#3b82f6" },
  { id: "york-bsc-economics", lat: 53.9476, lng: -1.0530, website: "https://www.york.ac.uk", imageUrl: IMG["york"], durationYears: 3, countryColor: "#3b82f6" },
];
