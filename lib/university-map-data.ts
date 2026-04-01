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
  {
    // Mekelweg 2, 2628 CD Delft (Aula)
    id: "tu-delft-cs",
    lat: 51.99626, lng: 4.37587,
    website: "https://www.tudelft.nl",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/TU_Delft_campus_01.jpg/1280px-TU_Delft_campus_01.jpg",
    durationYears: 2,
    countryColor: "#f97316",
  },
  {
    // Julianalaan 134, 2628 BL Delft (Architecture faculty)
    id: "tu-delft-arch",
    lat: 51.99580, lng: 4.37120,
    website: "https://www.tudelft.nl/en/architecture",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/TU_Delft_campus_01.jpg/1280px-TU_Delft_campus_01.jpg",
    durationYears: 2,
    countryColor: "#f97316",
  },
  {
    // Broerstraat 5, 9712 CP Groningen (Academiegebouw)
    id: "groningen-business",
    lat: 53.2194, lng: 6.5666,
    website: "https://www.rug.nl",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Groningen_Academiegebouw.jpg/1280px-Groningen_Academiegebouw.jpg",
    durationYears: 1,
    countryColor: "#f97316",
  },
  {
    // Piazza Leonardo da Vinci 32, 20133 Milano
    id: "polimi-cs",
    lat: 45.4781, lng: 9.2277,
    website: "https://www.polimi.it",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Politecnico_di_Milano_-_Sede_Centrale.jpg/1280px-Politecnico_di_Milano_-_Sede_Centrale.jpg",
    durationYears: 2,
    countryColor: "#22c55e",
  },
  {
    // Piazza Leonardo da Vinci 32, 20133 Milano (same campus, slight offset)
    id: "polimi-arch",
    lat: 45.4784, lng: 9.2268,
    website: "https://www.polimi.it",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Politecnico_di_Milano_-_Sede_Centrale.jpg/1280px-Politecnico_di_Milano_-_Sede_Centrale.jpg",
    durationYears: 2,
    countryColor: "#22c55e",
  },
  {
    // Via Sarfatti 25, 20136 Milano
    id: "bocconi-economics",
    lat: 45.44857, lng: 9.18994,
    website: "https://www.unibocconi.eu",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Bocconi_University_campus%2C_Milan.jpg/1280px-Bocconi_University_campus%2C_Milan.jpg",
    durationYears: 2,
    countryColor: "#22c55e",
  },
  {
    // Via Zamboni 33, 40126 Bologna (Palazzo Poggi)
    id: "bologna-eng",
    lat: 44.49687, lng: 11.35241,
    website: "https://www.unibo.it",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Bologna_University.jpg/1280px-Bologna_University.jpg",
    durationYears: 2,
    countryColor: "#22c55e",
  },
  {
    // Arcisstraße 21, 80333 München (Hauptgebäude)
    id: "tum-cs",
    lat: 48.14880, lng: 11.56860,
    website: "https://www.tum.de",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Technische_Universit%C3%A4t_M%C3%BCnchen_-_Hauptgeb%C3%A4ude.jpg/1280px-Technische_Universit%C3%A4t_M%C3%BCnchen_-_Hauptgeb%C3%A4ude.jpg",
    durationYears: 2,
    countryColor: "#3b82f6",
  },
  {
    // Arcisstraße 21, 80333 München (same building, slight offset)
    id: "tum-ee",
    lat: 48.14895, lng: 11.56875,
    website: "https://www.tum.de",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Technische_Universit%C3%A4t_M%C3%BCnchen_-_Hauptgeb%C3%A4ude.jpg/1280px-Technische_Universit%C3%A4t_M%C3%BCnchen_-_Hauptgeb%C3%A4ude.jpg",
    durationYears: 2,
    countryColor: "#3b82f6",
  },
  {
    // Geschwister-Scholl-Platz 1, 80539 München
    id: "lmu-business",
    lat: 48.15081, lng: 11.58043,
    website: "https://www.lmu.de",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/LMU_Muenchen_Hauptgebaeude_2011.jpg/1280px-LMU_Muenchen_Hauptgebaeude_2011.jpg",
    durationYears: 2,
    countryColor: "#3b82f6",
  },
  {
    // Templergraben 55, 52062 Aachen
    id: "rwth-aachen",
    lat: 50.78008, lng: 6.06569,
    website: "https://www.rwth-aachen.de",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/RWTH_Aachen_Hauptgeb%C3%A4ude.jpg/1280px-RWTH_Aachen_Hauptgeb%C3%A4ude.jpg",
    durationYears: 2,
    countryColor: "#3b82f6",
  },
  {
    // 27 Rue Saint-Guillaume, 75007 Paris
    id: "sciences-po",
    lat: 48.85409, lng: 2.32837,
    website: "https://www.sciencespo.fr",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Sciences_Po_Paris_main_entrance.jpg/1280px-Sciences_Po_Paris_main_entrance.jpg",
    durationYears: 2,
    countryColor: "#a855f7",
  },
  {
    // Avenue Bernard Hirsch, 95021 Cergy-Pontoise
    id: "essec",
    lat: 49.03353, lng: 2.07683,
    website: "https://www.essec.edu",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/ESSEC_Business_School.jpg/1280px-ESSEC_Business_School.jpg",
    durationYears: 2,
    countryColor: "#a855f7",
  },
  {
    // IE Tower (Caleido), Paseo de la Castellana 259, 28046 Madrid
    id: "ie-university",
    lat: 40.47765, lng: -3.68903,
    website: "https://www.ie.edu",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/IE_Tower_Madrid.jpg/1280px-IE_Tower_Madrid.jpg",
    durationYears: 2,
    countryColor: "#ef4444",
  },
  {
    // Boulevard de Constance, Jouy-en-Josas
    id: "hec-paris",
    lat: 48.7554, lng: 2.1706,
    website: "https://www.hec.edu",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/HEC_Paris_main_building.jpg/1280px-HEC_Paris_main_building.jpg",
    durationYears: 3,
    countryColor: "#a855f7",
  },
  {
    // Route de Saclay, 91120 Palaiseau
    id: "polytechnique",
    lat: 48.7143, lng: 2.2130,
    website: "https://programmes.polytechnique.edu/en/bachelor",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Ecole_polytechnique_-_panoramio.jpg/1280px-Ecole_polytechnique_-_panoramio.jpg",
    durationYears: 3,
    countryColor: "#a855f7",
  },
  {
    // 3 Rue Joliot-Curie, 91190 Gif-sur-Yvette
    id: "centrale-supelec",
    lat: 48.7102, lng: 2.1678,
    website: "https://www.centralesupelec.fr/en",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/CentraleSup%C3%A9lec_campus.jpg/1280px-CentraleSup%C3%A9lec_campus.jpg",
    durationYears: 3,
    countryColor: "#a855f7",
  },
  {
    // 24 Avenue Gustave Delory, 59100 Roubaix (Lille campus)
    id: "edhec-bba",
    lat: 50.6887, lng: 3.1766,
    website: "https://www.edhec.edu/en/programmes/bba",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/EDHEC_Business_School_Roubaix.jpg/1280px-EDHEC_Business_School_Roubaix.jpg",
    durationYears: 4,
    countryColor: "#a855f7",
  },
  {
    // 23 Avenue Guy de Collongue, 69130 Écully (Lyon)
    id: "emlyon-bba",
    lat: 45.7730, lng: 4.7877,
    website: "https://em-lyon.com/en/programs/bachelor",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Emlyon_Business_School.jpg/1280px-Emlyon_Business_School.jpg",
    durationYears: 3,
    countryColor: "#a855f7",
  },
  {
    // Place du Maréchal de Lattre de Tassigny, 75016 Paris
    id: "paris-dauphine",
    lat: 48.8651, lng: 2.2717,
    website: "https://dauphine.psl.eu/en",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Universit%C3%A9_Paris-Dauphine.jpg/1280px-Universit%C3%A9_Paris-Dauphine.jpg",
    durationYears: 3,
    countryColor: "#a855f7",
  },
  {
    // 4 Place Jussieu, 75005 Paris (Campus Pierre et Marie Curie)
    id: "sorbonne-sciences",
    lat: 48.8477, lng: 2.3560,
    website: "https://www.sorbonne-universite.fr/en",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Sorbonne_University_-_Pierre_and_Marie_Curie_Campus.jpg/1280px-Sorbonne_University_-_Pierre_and_Marie_Curie_Campus.jpg",
    durationYears: 3,
    countryColor: "#a855f7",
  },
  {
    // 20 Avenue Albert Einstein, 69621 Villeurbanne (Lyon)
    id: "insa-lyon",
    lat: 45.7827, lng: 4.8716,
    website: "https://www.insa-lyon.fr/en",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/INSA_Lyon_-_Campus.jpg/1280px-INSA_Lyon_-_Campus.jpg",
    durationYears: 3,
    countryColor: "#a855f7",
  },
  {
    // Brinellvägen 8, 114 28 Stockholm
    id: "kth-stockholm",
    lat: 59.34987, lng: 18.07026,
    website: "https://www.kth.se",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/KTH_main_building_2013.jpg/1280px-KTH_main_building_2013.jpg",
    durationYears: 2,
    countryColor: "#f59e0b",
  },
];
