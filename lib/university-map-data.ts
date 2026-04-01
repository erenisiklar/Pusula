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
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Aula_TU_Delft_2018.jpg/800px-Aula_TU_Delft_2018.jpg",
    durationYears: 2,
    countryColor: "#f97316",
  },
  {
    // Julianalaan 134, 2628 BL Delft (Architecture faculty)
    id: "tu-delft-arch",
    lat: 51.99580, lng: 4.37120,
    website: "https://www.tudelft.nl/en/architecture",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Aula_TU_Delft_2018.jpg/800px-Aula_TU_Delft_2018.jpg",
    durationYears: 2,
    countryColor: "#f97316",
  },
  {
    // Broerstraat 5, 9712 CP Groningen (Academiegebouw)
    id: "groningen-business",
    lat: 53.2194, lng: 6.5666,
    website: "https://www.rug.nl",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Academiegebouw_van_de_Rijksuniversiteit_Groningen_%282015%29.jpg/800px-Academiegebouw_van_de_Rijksuniversiteit_Groningen_%282015%29.jpg",
    durationYears: 1,
    countryColor: "#f97316",
  },
  {
    // Piazza Leonardo da Vinci 32, 20133 Milano
    id: "polimi-cs",
    lat: 45.4781, lng: 9.2277,
    website: "https://www.polimi.it",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/POLIMI_Piazza_Leonardo_da_Vinci_32_-_on_the_right_the_building_3.jpg/800px-POLIMI_Piazza_Leonardo_da_Vinci_32_-_on_the_right_the_building_3.jpg",
    durationYears: 2,
    countryColor: "#22c55e",
  },
  {
    // Piazza Leonardo da Vinci 32, 20133 Milano (same campus, slight offset)
    id: "polimi-arch",
    lat: 45.4784, lng: 9.2268,
    website: "https://www.polimi.it",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/POLIMI_Piazza_Leonardo_da_Vinci_32_-_on_the_right_the_building_3.jpg/800px-POLIMI_Piazza_Leonardo_da_Vinci_32_-_on_the_right_the_building_3.jpg",
    durationYears: 2,
    countryColor: "#22c55e",
  },
  {
    // Via Sarfatti 25, 20136 Milano
    id: "bocconi-economics",
    lat: 45.44857, lng: 9.18994,
    website: "https://www.unibocconi.eu",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Nuovo_Campus_SANAA_Milano_1.jpg/800px-Nuovo_Campus_SANAA_Milano_1.jpg",
    durationYears: 2,
    countryColor: "#22c55e",
  },
  {
    // Via Zamboni 33, 40126 Bologna (Palazzo Poggi)
    id: "bologna-eng",
    lat: 44.49687, lng: 11.35241,
    website: "https://www.unibo.it",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Facolt%C3%A0_di_Ingegneria.jpg/800px-Facolt%C3%A0_di_Ingegneria.jpg",
    durationYears: 2,
    countryColor: "#22c55e",
  },
  {
    // Arcisstraße 21, 80333 München (Hauptgebäude)
    id: "tum-cs",
    lat: 48.14880, lng: 11.56860,
    website: "https://www.tum.de",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/TUM_Garching.JPG/800px-TUM_Garching.JPG",
    durationYears: 2,
    countryColor: "#3b82f6",
  },
  {
    // Arcisstraße 21, 80333 München (same building, slight offset)
    id: "tum-ee",
    lat: 48.14895, lng: 11.56875,
    website: "https://www.tum.de",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/TUM_Garching.JPG/800px-TUM_Garching.JPG",
    durationYears: 2,
    countryColor: "#3b82f6",
  },
  {
    // Geschwister-Scholl-Platz 1, 80539 München
    id: "lmu-business",
    lat: 48.15081, lng: 11.58043,
    website: "https://www.lmu.de",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Entrance_to_LMU_Munich_main_building.jpg/800px-Entrance_to_LMU_Munich_main_building.jpg",
    durationYears: 2,
    countryColor: "#3b82f6",
  },
  {
    // Templergraben 55, 52062 Aachen
    id: "rwth-aachen",
    lat: 50.78008, lng: 6.06569,
    website: "https://www.rwth-aachen.de",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/SuperC_RWTH_Aachen.JPG/800px-SuperC_RWTH_Aachen.JPG",
    durationYears: 2,
    countryColor: "#3b82f6",
  },
  {
    // 27 Rue Saint-Guillaume, 75007 Paris
    id: "sciences-po",
    lat: 48.85409, lng: 2.32837,
    website: "https://www.sciencespo.fr",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Entr%C3%A9e_de_Sciences_Po_%282014%29.JPG/800px-Entr%C3%A9e_de_Sciences_Po_%282014%29.JPG",
    durationYears: 2,
    countryColor: "#a855f7",
  },
  {
    // Avenue Bernard Hirsch, 95021 Cergy-Pontoise
    id: "essec",
    lat: 49.03353, lng: 2.07683,
    website: "https://www.essec.edu",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Essec_cergy_1.JPG/800px-Essec_cergy_1.JPG",
    durationYears: 2,
    countryColor: "#a855f7",
  },
  {
    // IE Tower (Caleido), Paseo de la Castellana 259, 28046 Madrid
    id: "ie-university",
    lat: 40.47765, lng: -3.68903,
    website: "https://www.ie.edu",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/IE_Tower.jpg/800px-IE_Tower.jpg",
    durationYears: 2,
    countryColor: "#ef4444",
  },
  {
    // Boulevard de Constance, Jouy-en-Josas
    id: "hec-paris",
    lat: 48.7554, lng: 2.1706,
    website: "https://www.hec.edu",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Hec.JPG/800px-Hec.JPG",
    durationYears: 3,
    countryColor: "#a855f7",
  },
  {
    // Route de Saclay, 91120 Palaiseau
    id: "polytechnique",
    lat: 48.7143, lng: 2.2130,
    website: "https://programmes.polytechnique.edu/en/bachelor",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Campus_Ecole_polytechnique_de_palaiseau.jpg/800px-Campus_Ecole_polytechnique_de_palaiseau.jpg",
    durationYears: 3,
    countryColor: "#a855f7",
  },
  {
    // 3 Rue Joliot-Curie, 91190 Gif-sur-Yvette
    id: "centrale-supelec",
    lat: 48.7102, lng: 2.1678,
    website: "https://www.centralesupelec.fr/en",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Les_b%C3%A2timents_Bouygues_et_Eiffel_de_CentraleSupelec_le_2_septembre_2024.jpg/800px-Les_b%C3%A2timents_Bouygues_et_Eiffel_de_CentraleSupelec_le_2_septembre_2024.jpg",
    durationYears: 3,
    countryColor: "#a855f7",
  },
  {
    // 24 Avenue Gustave Delory, 59100 Roubaix (Lille campus)
    id: "edhec-bba",
    lat: 50.6887, lng: 3.1766,
    website: "https://www.edhec.edu/en/programmes/bba",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Edhec_Business_School_panorama.jpg/800px-Edhec_Business_School_panorama.jpg",
    durationYears: 4,
    countryColor: "#a855f7",
  },
  {
    // 23 Avenue Guy de Collongue, 69130 Écully (Lyon)
    id: "emlyon-bba",
    lat: 45.7730, lng: 4.7877,
    website: "https://em-lyon.com/en/programs/bachelor",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Edhec_Business_School_panorama.jpg/800px-Edhec_Business_School_panorama.jpg",
    durationYears: 3,
    countryColor: "#a855f7",
  },
  {
    // Place du Maréchal de Lattre de Tassigny, 75016 Paris
    id: "paris-dauphine",
    lat: 48.8651, lng: 2.2717,
    website: "https://dauphine.psl.eu/en",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Paris_Dauphine.jpg/800px-Paris_Dauphine.jpg",
    durationYears: 3,
    countryColor: "#a855f7",
  },
  {
    // 4 Place Jussieu, 75005 Paris (Campus Pierre et Marie Curie)
    id: "sorbonne-sciences",
    lat: 48.8477, lng: 2.3560,
    website: "https://www.sorbonne-universite.fr/en",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Entr%C3%A9e_Campus_Pierre_et_Marie_Curie_-_Sorbonne_Universit%C3%A9.jpg/800px-Entr%C3%A9e_Campus_Pierre_et_Marie_Curie_-_Sorbonne_Universit%C3%A9.jpg",
    durationYears: 3,
    countryColor: "#a855f7",
  },
  {
    // 20 Avenue Albert Einstein, 69621 Villeurbanne (Lyon)
    id: "insa-lyon",
    lat: 45.7827, lng: 4.8716,
    website: "https://www.insa-lyon.fr/en",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Villeurbanne_-_Ancienne_biblioth%C3%A8que_de_l%27INSA_Lyon_01.jpg/800px-Villeurbanne_-_Ancienne_biblioth%C3%A8que_de_l%27INSA_Lyon_01.jpg",
    durationYears: 3,
    countryColor: "#a855f7",
  },
  {
    // Brinellvägen 8, 114 28 Stockholm
    id: "kth-stockholm",
    lat: 59.34987, lng: 18.07026,
    website: "https://www.kth.se",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Borg%C3%A5rden_Kungliga_Tekniska_h%C3%B6gskolan_Stockholm_2022-09-20_01.jpg/800px-Borg%C3%A5rden_Kungliga_Tekniska_h%C3%B6gskolan_Stockholm_2022-09-20_01.jpg",
    durationYears: 2,
    countryColor: "#f59e0b",
  },
];
