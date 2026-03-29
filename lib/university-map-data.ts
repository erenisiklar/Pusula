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
    id: "tu-delft-cs",
    lat: 51.9985, lng: 4.3741,
    website: "https://www.tudelft.nl",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/TU_Delft_campus_01.jpg/1280px-TU_Delft_campus_01.jpg",
    durationYears: 2,
    countryColor: "#f97316",
  },
  {
    id: "tu-delft-arch",
    lat: 51.9990, lng: 4.3750,
    website: "https://www.tudelft.nl/en/architecture",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/TU_Delft_campus_01.jpg/1280px-TU_Delft_campus_01.jpg",
    durationYears: 2,
    countryColor: "#f97316",
  },
  {
    id: "groningen-business",
    lat: 53.2194, lng: 6.5665,
    website: "https://www.rug.nl",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Groningen_Academiegebouw.jpg/1280px-Groningen_Academiegebouw.jpg",
    durationYears: 1,
    countryColor: "#f97316",
  },
  {
    id: "polimi-cs",
    lat: 45.4781, lng: 9.2277,
    website: "https://www.polimi.it",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Politecnico_di_Milano_-_Sede_Centrale.jpg/1280px-Politecnico_di_Milano_-_Sede_Centrale.jpg",
    durationYears: 2,
    countryColor: "#22c55e",
  },
  {
    id: "polimi-arch",
    lat: 45.4785, lng: 9.2270,
    website: "https://www.polimi.it",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Politecnico_di_Milano_-_Sede_Centrale.jpg/1280px-Politecnico_di_Milano_-_Sede_Centrale.jpg",
    durationYears: 2,
    countryColor: "#22c55e",
  },
  {
    id: "bocconi-economics",
    lat: 45.4491, lng: 9.1882,
    website: "https://www.unibocconi.eu",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Bocconi_University_campus%2C_Milan.jpg/1280px-Bocconi_University_campus%2C_Milan.jpg",
    durationYears: 2,
    countryColor: "#22c55e",
  },
  {
    id: "bologna-eng",
    lat: 44.4949, lng: 11.3426,
    website: "https://www.unibo.it",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Bologna_University.jpg/1280px-Bologna_University.jpg",
    durationYears: 2,
    countryColor: "#22c55e",
  },
  {
    id: "tum-cs",
    lat: 48.1497, lng: 11.5678,
    website: "https://www.tum.de",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Technische_Universit%C3%A4t_M%C3%BCnchen_-_Hauptgeb%C3%A4ude.jpg/1280px-Technische_Universit%C3%A4t_M%C3%BCnchen_-_Hauptgeb%C3%A4ude.jpg",
    durationYears: 2,
    countryColor: "#3b82f6",
  },
  {
    id: "tum-ee",
    lat: 48.1500, lng: 11.5690,
    website: "https://www.tum.de",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Technische_Universit%C3%A4t_M%C3%BCnchen_-_Hauptgeb%C3%A4ude.jpg/1280px-Technische_Universit%C3%A4t_M%C3%BCnchen_-_Hauptgeb%C3%A4ude.jpg",
    durationYears: 2,
    countryColor: "#3b82f6",
  },
  {
    id: "lmu-business",
    lat: 48.1508, lng: 11.5803,
    website: "https://www.lmu.de",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/LMU_Muenchen_Hauptgebaeude_2011.jpg/1280px-LMU_Muenchen_Hauptgebaeude_2011.jpg",
    durationYears: 2,
    countryColor: "#3b82f6",
  },
  {
    id: "rwth-aachen",
    lat: 50.7792, lng: 6.0591,
    website: "https://www.rwth-aachen.de",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/RWTH_Aachen_Hauptgeb%C3%A4ude.jpg/1280px-RWTH_Aachen_Hauptgeb%C3%A4ude.jpg",
    durationYears: 2,
    countryColor: "#3b82f6",
  },
  {
    id: "sciences-po",
    lat: 48.8530, lng: 2.3290,
    website: "https://www.sciencespo.fr",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Sciences_Po_Paris_main_entrance.jpg/1280px-Sciences_Po_Paris_main_entrance.jpg",
    durationYears: 2,
    countryColor: "#a855f7",
  },
  {
    id: "essec",
    lat: 49.0369, lng: 2.0694,
    website: "https://www.essec.edu",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/ESSEC_Business_School.jpg/1280px-ESSEC_Business_School.jpg",
    durationYears: 2,
    countryColor: "#a855f7",
  },
  {
    id: "ie-university",
    lat: 40.4336, lng: -3.6970,
    website: "https://www.ie.edu",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/IE_Tower_Madrid.jpg/1280px-IE_Tower_Madrid.jpg",
    durationYears: 2,
    countryColor: "#ef4444",
  },
  {
    id: "kth-stockholm",
    lat: 59.3498, lng: 18.0710,
    website: "https://www.kth.se",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/KTH_main_building_2013.jpg/1280px-KTH_main_building_2013.jpg",
    durationYears: 2,
    countryColor: "#f59e0b",
  },
];
