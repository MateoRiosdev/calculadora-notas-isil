import { GradeRow, CalculatorMode } from "@/types/calculator";
export const PROMEDIO_ACTUAL_DEFAULT: Omit<GradeRow, "id">[] = [
  { description: "PA 1", grade: "", percentage: "15" },
  { description: "PA 2", grade: "", percentage: "15" },
  { description: "PA 3", grade: "", percentage: "15" },
  { description: "PA 4", grade: "", percentage: "15" },
  { description: "Evaluación Integral", grade: "", percentage: "40" },
];

export const PROMEDIO_ANTIGUO_DEFAULT: Omit<GradeRow, "id">[] = [
  { description: "E. Permanente 1", grade: "", percentage: "10" },
  { description: "E. Permanente 2", grade: "", percentage: "10" },
  { description: "E. Permanente 3", grade: "", percentage: "10" },
  { description: "E. Permanente 4", grade: "", percentage: "10" },
  { description: "Evaluación Parcial", grade: "", percentage: "30" },
  { description: "Evaluación Final", grade: "", percentage: "30" },
];

export const PROMEDIO_ENGLISH_DEFAULT: Omit<GradeRow, "id">[] = [
  {
    description: "Proficiency Achievement 1",
    grade: "",
    percentage: "10",
    section: "proficiency",
  },
  {
    description: "Proficiency Achievement 2",
    grade: "",
    percentage: "10",
    section: "proficiency",
  },
  {
    description: "Proficiency Achievement 3",
    grade: "",
    percentage: "10",
    section: "proficiency",
  },
  {
    description: "Proficiency Achievement 4",
    grade: "",
    percentage: "10",
    section: "proficiency",
  },
  {
    description: "Proficiency Achievement 5",
    grade: "",
    percentage: "10",
    section: "proficiency",
  },
  {
    description: "Proficiency Achievement 6",
    grade: "",
    percentage: "10",
    section: "proficiency",
  },
  {
    description: "Platform Evaluation 1",
    grade: "",
    percentage: "5",
    section: "platform",
  },
  {
    description: "Platform Evaluation 2",
    grade: "",
    percentage: "5",
    section: "platform",
  },
  {
    description: "Platform Evaluation 3",
    grade: "",
    percentage: "5",
    section: "platform",
  },
  {
    description: "Platform Evaluation 4",
    grade: "",
    percentage: "5",
    section: "platform",
  },
  {
    description: "Platform Evaluation 5",
    grade: "",
    percentage: "5",
    section: "platform",
  },
  {
    description: "Platform Evaluation 6",
    grade: "",
    percentage: "5",
    section: "platform",
  },
  {
    description: "Final Evaluation",
    grade: "",
    percentage: "10",
    section: "final",
  },
];

export function defaultRows(mode: CalculatorMode): GradeRow[] {
  const preset =
    mode === "actual"
      ? PROMEDIO_ACTUAL_DEFAULT
      : mode === "antiguo"
        ? PROMEDIO_ANTIGUO_DEFAULT
        : PROMEDIO_ENGLISH_DEFAULT;
  return preset.map((row, index) => ({ ...row, id: `${mode}-row-${index}` }));
}
