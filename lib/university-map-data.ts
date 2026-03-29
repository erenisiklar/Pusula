export interface UniversityMapData {
  id: string;
  lat: number;
  lng: number;
  website: string;
  imageUrl: string;
  durationYears: number; // program süresi
  countryColor: string;  // pin rengi
}

export const universityMapData: UniversityMapData[] = [
  {
    // Mekelweg 2, 2628 CD Delft
    id: "tu-delft-cs",
    lat: 51.9988, lng: 4.3743,
    website: "https://www.tudelft.nl",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/TU_Delft_campus_01.jpg/1280px-TU_Delft_campus_01.jpg",
    durationYears: 2,
    countryColor: "#f97316",
  },
  {
    // Julianalaan 134, 2628 BL Delft (Architecture faculty)
    id: "tu-delft-arch",
    lat: 51.9995, lng: 4.3701,
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
    lat: 45.4500, lng: 9.1916,
    website: "https://www.unibocconi.eu",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Bocconi_University_campus%2C_Milan.jpg/1280px-Bocconi_University_campus%2C_Milan.jpg",
    durationYears: 2,
    countryColor: "#22c55e",
  },
  {
    // Via Zamboni 33, 40126 Bologna (Palazzo Poggi)
    id: "bologna-eng",
    lat: 44.4966, lng: 11.3535,
    website: "https://www.unibo.it",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Bologna_University.jpg/1280px-Bologna_University.jpg",
    durationYears: 2,
    countryColor: "#22c55e",
  },
  {
    // Arcisstraße 21, 80333 München (Hauptgebäude)
    id: "tum-cs",
    lat: 48.1489, lng: 11.5675,
    website: "https://www.tum.de",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Technische_Universit%C3%A4t_M%C3%BCnchen_-_Hauptgeb%C3%A4ude.jpg/1280px-Technische_Universit%C3%A4t_M%C3%BCnchen_-_Hauptgeb%C3%A4ude.jpg",
    durationYears: 2,
    countryColor: "#3b82f6",
  },
  {
    // Arcisstraße 21, 80333 München (same building, slight offset)
    id: "tum-ee",
    lat: 48.1492, lng: 11.5683,
    website: "https://www.tum.de",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Technische_Universit%C3%A4t_M%C3%BCnchen_-_Hauptgeb%C3%A4ude.jpg/1280px-Technische_Universit%C3%A4t_M%C3%BCnchen_-_Hauptgeb%C3%A4ude.jpg",
    durationYears: 2,
    countryColor: "#3b82f6",
  },
  {
    // Geschwister-Scholl-Platz 1, 80539 München
    id: "lmu-business",
    lat: 48.1508, lng: 11.5800,
    website: "https://www.lmu.de",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/LMU_Muenchen_Hauptgebaeude_2011.jpg/1280px-LMU_Muenchen_Hauptgebaeude_2011.jpg",
    durationYears: 2,
    countryColor: "#3b82f6",
  },
  {
    // Templergraben 55, 52062 Aachen
    id: "rwth-aachen",
    lat: 50.7779, lng: 6.0785,
    website: "https://www.rwth-aachen.de",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/RWTH_Aachen_Hauptgeb%C3%A4ude.jpg/1280px-RWTH_Aachen_Hauptgeb%C3%A4ude.jpg",
    durationYears: 2,
    countryColor: "#3b82f6",
  },
  {
    // 27 Rue Saint-Guillaume, 75007 Paris
    id: "sciences-po",
    lat: 48.8539, lng: 2.3249,
    website: "https://www.sciencespo.fr",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Sciences_Po_Paris_main_entrance.jpg/1280px-Sciences_Po_Paris_main_entrance.jpg",
    durationYears: 2,
    countryColor: "#a855f7",
  },
  {
    // Avenue Bernard Hirsch, 95021 Cergy-Pontoise
    id: "essec",
    lat: 49.0398, lng: 2.0723,
    website: "https://www.essec.edu",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/ESSEC_Business_School.jpg/1280px-ESSEC_Business_School.jpg",
    durationYears: 2,
    countryColor: "#a855f7",
  },
  {
    // IE Tower, Paseo de la Castellana 259E, 28046 Madrid
    id: "ie-university",
    lat: 40.4536, lng: -3.6884,
    website: "https://www.ie.edu",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/IE_Tower_Madrid.jpg/1280px-IE_Tower_Madrid.jpg",
    durationYears: 2,
    countryColor: "#ef4444",
  },
  {
    // Brinellvägen 8, 114 28 Stockholm
    id: "kth-stockholm",
    lat: 59.3498, lng: 18.0706,
    website: "https://www.kth.se",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/KTH_main_building_2013.jpg/1280px-KTH_main_building_2013.jpg",
    durationYears: 2,
    countryColor: "#f59e0b",
  },
];
