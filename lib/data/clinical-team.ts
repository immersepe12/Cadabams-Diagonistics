export interface ClinicalDoctor {
  name: string;
  qualifications: string;
  position: string;
  description: string;
  image: string;
  education: string[];
  expertise: string[];
  achievements: string[];
}

/**
 * Clinical team profiles. Sourced from the legacy clinical-team page; photos
 * map to the doctor images already shipped in public/centers.
 */
export const CLINICAL_TEAM: ClinicalDoctor[] = [
  {
    name: "Dr. S Pradeep",
    qualifications: "MBBS, MD, DNB (Radiodiagnosis)",
    position: "Consultant Specialist in Radiology and Fetal Medicine",
    description:
      "Dr. S Pradeep is a registered radiologist with 25 years of immense experience conducting diagnostic and medical imaging procedures to detect diseases. His skills include Fetal TIFFA, ECHO, Neurosonogram, Doppler, CVS, Amniocentesis, and Fetal reductions.",
    image: "/centers/image-1731992821079-356936202.webp",
    education: [
      "MBBS – PSG Coimbatore",
      "MD – JJMMC Davangere",
      "DNB – CMC Vellore",
      "Fetal Intervention – Hong Kong",
      "25 years experience",
    ],
    expertise: [
      "Fetal TIFFA, ECHO, Neurosonogram",
      "Doppler CVS, Amniocentesis",
      "3D TVS, Perianal Sonofistulography",
      "Elastography and Neonatal Scans",
      "Whole body FNAC and Biopsy",
    ],
    achievements: [
      "Gold Medalist",
      "National and International Award Winner",
      "Chaptered in Textbook of Fetal Echo",
      "Performed more than 1000 Amniocentesis",
    ],
  },
  {
    name: "Dr. Divya Cadabam",
    qualifications: "MBBS, MD (Radiodiagnosis)",
    position: "Consultant Specialist in Radiology and Fetal Medicine",
    description:
      "Dr. Divya Cadabam is a reputed doctor in the field of radiodiagnosis. With a fellowship in Fetal Medicine and Advanced Ultrasonography, she specializes in Women's Imaging, Infertility Imaging, and Fetal Interventions.",
    image: "/centers/image-1731992880062-58437075.webp",
    education: [
      "MBBS – M.S. Ramaiah Medical College",
      "MD – Vydehi Institute of Medical Sciences",
      "Fellowship in Fetal Medicine",
      "Advanced Ultrasonography",
    ],
    expertise: [
      "Women's Imaging & Diagnostics",
      "Infertility Imaging",
      "Fetal Medicine",
      "Advanced Ultrasonography",
      "Breast Imaging",
    ],
    achievements: [
      "Expert in Fetal Medicine",
      "Specialized in Women's Health",
      "Advanced Imaging Techniques",
      "Patient-Centered Care",
    ],
  },
  {
    name: "Dr. Shreyas Cadabam",
    qualifications: "MBBS, MD (Radiodiagnosis)",
    position:
      "Consultant Specialist in Radiology and Interventional Musculoskeletal Imaging",
    description:
      "Dr. Shreyas Cadabam is an Interventional Musculoskeletal Radiologist with vast experience. His expertise includes MSK Interventions, Biopsies, FNAC, and specialized imaging.",
    image: "/centers/image-1731996905577-993628054.webp",
    education: [
      "MBBS",
      "MD Radiodiagnosis",
      "Interventional MSK Fellowship",
      "Advanced Training in Interventional Procedures",
    ],
    expertise: [
      "MSK Interventions",
      "Ultrasound Guided Procedures",
      "Joint Injections",
      "Sports Medicine Imaging",
      "Interventional Procedures",
    ],
    achievements: [
      "Specialized in MSK Imaging",
      "Advanced Intervention Techniques",
      "Expert in Sports Medicine",
      "Pioneering Treatment Methods",
    ],
  },
];
