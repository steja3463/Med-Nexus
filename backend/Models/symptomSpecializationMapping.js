// Comprehensive manual mapping of symptoms to specializations

const symptomSpecializationMapping = [
  { symptom: "Chest pain", specializations: ["Cardiologist"] },
  { symptom: "Shortness of breath", specializations: ["Pulmonologist", "Cardiologist"] },
  { symptom: "Skin rash", specializations: ["Dermatologist"] },
  { symptom: "Fever", specializations: ["General Physician", "Pediatrician"] },
  { symptom: "Headache", specializations: ["Neurologist", "General Physician"] },
  { symptom: "Joint pain", specializations: ["Orthopedic", "Rheumatologist"] },
  { symptom: "Cough", specializations: ["Pulmonologist", "General Physician"] },
  { symptom: "Stomach ache", specializations: ["Gastroenterologist", "General Physician"] },
  { symptom: "Back pain", specializations: ["Orthopedic", "Physiotherapist"] },
  { symptom: "Vision problems", specializations: ["Ophthalmologist"] },
  { symptom: "Hearing loss", specializations: ["ENT Specialist"] },
  { symptom: "Depression", specializations: ["Psychiatrist", "Psychologist"] },
  { symptom: "Toothache", specializations: ["Dentist"] },
  { symptom: "Urinary problems", specializations: ["Urologist"] },
  { symptom: "Menstrual issues", specializations: ["Gynecologist"] },
  { symptom: "Child health", specializations: ["Pediatrician"] },
  { symptom: "Diabetes", specializations: ["Endocrinologist"] },
  { symptom: "High blood pressure", specializations: ["Cardiologist"] },
  { symptom: "Allergies", specializations: ["Allergist", "Immunologist"] },
  { symptom: "Weight loss", specializations: ["Endocrinologist", "General Physician"] },
  { symptom: "Fatigue", specializations: ["General Physician", "Endocrinologist"] },
  { symptom: "Vomiting", specializations: ["Gastroenterologist", "General Physician"] },
  { symptom: "Dizziness", specializations: ["Neurologist", "Cardiologist"] },
  { symptom: "Burning urination", specializations: ["Urologist"] },
  { symptom: "Ear pain", specializations: ["ENT Specialist"] },
  { symptom: "Nasal congestion", specializations: ["ENT Specialist", "Allergist"] },
  { symptom: "Constipation", specializations: ["Gastroenterologist"] },
  { symptom: "Anxiety", specializations: ["Psychiatrist", "Psychologist"] },
  { symptom: "Palpitations", specializations: ["Cardiologist"] }
];

module.exports = symptomSpecializationMapping; 