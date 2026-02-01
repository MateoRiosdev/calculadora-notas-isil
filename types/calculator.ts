export interface GradeRow {
  id: string
  description: string
  grade: string
  percentage: string
}

export type CalculatorMode = 'actual' | 'antiguo'

export type ModalType = 
  | 'error-grades'
  | 'error-percentage'
  | 'warning-low'
  | 'success-high'
  | null

export interface ModalContent {
  type: 'error' | 'warning' | 'success'
  title: string
  message: string
  icon: React.ReactNode
}
