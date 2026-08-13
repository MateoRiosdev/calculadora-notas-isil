'use client'

import { useState, useMemo } from 'react'
import { Plus, Minus, Percent } from 'lucide-react'
import { GradeRow, CalculatorMode, ModalType, ModalContent } from '@/types/calculator'
import Modal from './Modal'

const PROMEDIO_ACTUAL_DEFAULT: Omit<GradeRow, 'id'>[] = [
  { description: 'PA 1', grade: '', percentage: '15' },
  { description: 'PA 2', grade: '', percentage: '15' },
  { description: 'PA 3', grade: '', percentage: '15' },
  { description: 'PA 4', grade: '', percentage: '15' },
  { description: 'Evaluación Integral', grade: '', percentage: '40' },
]

const PROMEDIO_ANTIGUO_DEFAULT: Omit<GradeRow, 'id'>[] = [
  { description: 'E. Permanente 1', grade: '', percentage: '10' },
  { description: 'E. Permanente 2', grade: '', percentage: '10' },
  { description: 'E. Permanente 3', grade: '', percentage: '10' },
  { description: 'E. Permanente 4', grade: '', percentage: '10' },
  { description: 'Evaluación Parcial', grade: '', percentage: '30' },
  { description: 'Evaluación Final', grade: '', percentage: '30' },
]

const PROMEDIO_ENGLISH_DEFAULT: Omit<GradeRow, 'id'>[] = [
  { description: 'Proficiency Achievement 1', grade: '', percentage: '10', section: 'proficiency' },
  { description: 'Proficiency Achievement 2', grade: '', percentage: '10', section: 'proficiency' },
  { description: 'Proficiency Achievement 3', grade: '', percentage: '10', section: 'proficiency' },
  { description: 'Proficiency Achievement 4', grade: '', percentage: '10', section: 'proficiency' },
  { description: 'Proficiency Achievement 5', grade: '', percentage: '10', section: 'proficiency' },
  { description: 'Proficiency Achievement 6', grade: '', percentage: '10', section: 'proficiency' },
  { description: 'Platform Evaluation 1', grade: '', percentage: '5', section: 'platform' },
  { description: 'Platform Evaluation 2', grade: '', percentage: '5', section: 'platform' },
  { description: 'Platform Evaluation 3', grade: '', percentage: '5', section: 'platform' },
  { description: 'Platform Evaluation 4', grade: '', percentage: '5', section: 'platform' },
  { description: 'Platform Evaluation 5', grade: '', percentage: '5', section: 'platform' },
  { description: 'Platform Evaluation 6', grade: '', percentage: '5', section: 'platform' },
  { description: 'Final Evaluation', grade: '', percentage: '10', section: 'final' },
]

const NO_SECTION = '__none__'

const SECTION_LABELS: Record<string, string> = {
  proficiency: 'Proficiency Achievement Evaluation',
  platform: 'Platform Evaluation',
  final: 'Final Evaluation',
}

export default function Calculator() {
  const [mode, setMode] = useState<CalculatorMode>('actual')
  const [rows, setRows] = useState<GradeRow[]>(
    PROMEDIO_ACTUAL_DEFAULT.map((row, index) => ({ ...row, id: `row-${index}` }))
  )
  const [modalType, setModalType] = useState<ModalType>(null)
  const [calculatedAverage, setCalculatedAverage] = useState<number>(0)

  const handleModeChange = (newMode: CalculatorMode) => {
    setMode(newMode)
    const defaultRows =
      newMode === 'actual'
        ? PROMEDIO_ACTUAL_DEFAULT
        : newMode === 'antiguo'
        ? PROMEDIO_ANTIGUO_DEFAULT
        : PROMEDIO_ENGLISH_DEFAULT
    setRows(defaultRows.map((row, index) => ({ ...row, id: `row-${index}` })))
  }

  const updateRow = (id: string, field: keyof Omit<GradeRow, 'id'>, value: string) => {
    setRows(rows.map(row => row.id === id ? { ...row, [field]: value } : row))
  }

  const addRow = (afterId?: string) => {
    const afterIndex = afterId ? rows.findIndex(row => row.id === afterId) : rows.length - 1
    const afterRow = afterIndex >= 0 ? rows[afterIndex] : undefined
    const newRow: GradeRow = {
      id: `row-${Date.now()}`,
      description: `Nueva fila`,
      grade: '',
      percentage: '0',
      section: afterRow?.section,
    }
    const newRows = [...rows]
    newRows.splice(afterIndex + 1, 0, newRow)
    setRows(newRows)
  }

  const rowsInSameSection = (row: GradeRow) =>
    rows.filter(r => (r.section ?? NO_SECTION) === (row.section ?? NO_SECTION))

  const removeRow = (id: string) => {
    const row = rows.find(r => r.id === id)
    if (!row) return
    if (rowsInSameSection(row).length > 1) {
      setRows(rows.filter(r => r.id !== id))
    }
  }

  const clearData = () => {
    setRows(rows.map(row => ({ ...row, grade: '', percentage: '0' })))
  }

  const calculateAverage = () => {
    // Validación 1: Todas las notas entre 0 y 100
    const allGradesValid = rows.every(row => {
      if (row.grade === '') return false
      const grade = parseFloat(row.grade)
      return !isNaN(grade) && grade >= 0 && grade <= 100
    })

    if (!allGradesValid) {
      setModalType('error-grades')
      return
    }

    // Validación 2: Suma de porcentajes debe ser 100
    const totalPercentage = rows.reduce((sum, row) => {
      const percentage = parseFloat(row.percentage) || 0
      return sum + percentage
    }, 0)

    if (totalPercentage !== 100) {
      setModalType('error-percentage')
      return
    }

    // Cálculo del promedio ponderado
    const average = rows.reduce((sum, row) => {
      const grade = parseFloat(row.grade)
      const percentage = parseFloat(row.percentage) / 100
      return sum + (grade * percentage)
    }, 0)

    setCalculatedAverage(average)

    // Mostrar modal según el resultado
    if (average < 12.50) {
      setModalType('warning-low')
    } else {
      setModalType('success-high')
    }
  }

  const groups = useMemo(() => {
    const result: { key: string; rows: GradeRow[] }[] = []
    rows.forEach(row => {
      const sectionKey = row.section ?? NO_SECTION
      const last = result[result.length - 1]
      if (last && last.key === sectionKey) {
        last.rows.push(row)
      } else {
        result.push({ key: sectionKey, rows: [row] })
      }
    })
    return result
  }, [rows])

  const groupPercentageSum = (groupRows: GradeRow[]) =>
    groupRows.reduce((sum, r) => sum + (parseFloat(r.percentage) || 0), 0)

  const modalContent = useMemo((): ModalContent | null => {
    switch (modalType) {
      case 'error-grades':
        return {
          type: 'error',
          title: 'ERROR',
          message: 'Las notas de las filas deben estar entre 0 y 100',
          icon: null,
        }
      case 'error-percentage':
        return {
          type: 'error',
          title: 'ERROR',
          message: 'La suma de los porcentajes deben ser exactamente de 100%',
          icon: null,
        }
      case 'warning-low':
        return {
          type: 'warning',
          title: 'NOTA',
          message: `Tu promedio es ${calculatedAverage.toFixed(2)}`,
          icon: null,
        }
      case 'success-high':
        return {
          type: 'success',
          title: 'NOTA',
          message: `Tu promedio es ${calculatedAverage.toFixed(2)}`,
          icon: null,
        }
      default:
        return null
    }
  }, [modalType, calculatedAverage])

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-dark-panel rounded-2xl shadow-lg p-6 md:p-8">
        {/* Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
          <button
            onClick={() => handleModeChange('antiguo')}
            className={`py-3 px-2 sm:px-4 rounded-lg font-medium transition-colors text-sm sm:text-base ${
              mode === 'antiguo'
                ? 'bg-isil-cyan text-black'
                : 'bg-light-bg dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Promedio Antiguo
          </button>
          <button
            onClick={() => handleModeChange('actual')}
            className={`py-3 px-2 sm:px-4 rounded-lg font-medium transition-colors text-sm sm:text-base ${
              mode === 'actual'
                ? 'bg-isil-cyan text-black'
                : 'bg-light-bg dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Promedio Actual
          </button>
          <button
            onClick={() => handleModeChange('english')}
            className={`col-span-2 sm:col-span-1 py-3 px-2 sm:px-4 rounded-lg font-medium transition-colors text-sm sm:text-base ${
              mode === 'english'
                ? 'bg-isil-cyan text-black'
                : 'bg-light-bg dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Promedio ENGLISH LEVEL
          </button>
        </div>

        {mode === 'english' && (
          <div className="mb-6 p-4 rounded-lg border border-isil-cyan/40 bg-light-bg dark:bg-dark-input text-gray-700 dark:text-gray-300 text-sm">
            <strong className="text-black dark:text-white">Nota:</strong> No olvides desarrollar las tareas de la plataforma <strong>&quot;Altissia&quot;</strong> para
            aprobar con las 6 notas de Platform Evaluation.
          </div>
        )}

        {/* Table Headers */}
        <div className="hidden sm:grid grid-cols-12 gap-2 mb-4 px-2">
          <div className="col-span-5 text-gray-600 dark:text-gray-400 font-medium text-sm">
            Descripción
          </div>
          <div className="col-span-2 text-gray-600 dark:text-gray-400 font-medium text-sm">
            Calificación
          </div>
          <div className="col-span-3 text-gray-600 dark:text-gray-400 font-medium text-sm">
            Porcentaje
          </div>
        </div>

        {/* Table Rows */}
        <div className="space-y-5 sm:space-y-4">
          {groups.map((group, groupIndex) => (
            <div key={`${group.key}-${groupIndex}`}>
              {group.key !== NO_SECTION && (
                <div
                  className="mb-2 sm:mb-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1
                             rounded-lg border-l-4 border-isil-cyan bg-light-bg dark:bg-dark-input px-3 py-2"
                >
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wide text-black dark:text-white">
                    {SECTION_LABELS[group.key] ?? group.key}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-isil-cyan whitespace-nowrap">
                    {groupPercentageSum(group.rows)}%
                  </span>
                </div>
              )}
              <div className="space-y-4 sm:space-y-3">
                {group.rows.map((row) => (
            <div
              key={row.id}
              className="flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:items-center
                         border border-gray-200 dark:border-gray-700 sm:border-none
                         rounded-lg sm:rounded-none p-3 sm:p-0"
            >
              <div className="sm:col-span-5">
                <label className="sm:hidden text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                  Descripción
                </label>
                <input
                  type="text"
                  value={row.description}
                  onChange={(e) => updateRow(row.id, 'description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-dark-input text-black dark:text-white 
                           placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-isil-cyan"
                  placeholder="Descripción"
                />
              </div>

              <div className="flex gap-2 sm:contents">
                <div className="flex-1 sm:col-span-2">
                  <label className="sm:hidden text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                    Calificación
                  </label>
                  <input
                    type="number"
                    value={row.grade}
                    onChange={(e) => updateRow(row.id, 'grade', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-white dark:bg-dark-input text-black dark:text-white 
                             placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-isil-cyan"
                    placeholder="Nota"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                </div>

                <div className="flex-1 sm:col-span-3">
                  <label className="sm:hidden text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                    Porcentaje
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={row.percentage}
                      onChange={(e) => updateRow(row.id, 'percentage', e.target.value)}
                      className="w-full px-3 py-2 pr-8 border border-gray-300 dark:border-gray-600 rounded-lg 
                               bg-white dark:bg-dark-input text-black dark:text-white 
                               placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-isil-cyan"
                      placeholder="0"
                      min="0"
                      max="100"
                      step="1"
                    />
                    <Percent className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2 flex gap-1 justify-end mt-1 sm:mt-0">
                <button
                  onClick={() => addRow(row.id)}
                  className="w-8 h-8 rounded-full bg-btn-gray hover:bg-gray-700 text-white flex items-center justify-center transition-colors"
                  aria-label="Agregar fila"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => removeRow(row.id)}
                  className="w-8 h-8 rounded-full bg-btn-gray hover:bg-gray-700 text-white flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Eliminar fila"
                  disabled={rowsInSameSection(row).length === 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>
            </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Calculate Button */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <button
            onClick={calculateAverage}
            className="flex-1 bg-btn-gray dark:bg-dark-input hover:bg-gray-700 dark:hover:bg-gray-600 
                     text-white font-medium py-4 px-6 rounded-lg transition-colors text-lg"
          >
            Calcular Calificación Final
          </button>
          <button
            onClick={clearData}
            className="sm:w-auto bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600
                     text-black dark:text-white font-medium py-4 px-6 rounded-lg transition-colors text-lg"
          >
            Limpiar
          </button>
        </div>
      </div>

      {/* Modal */}
      {modalContent && (
        <Modal
          isOpen={modalType !== null}
          onClose={() => setModalType(null)}
          content={modalContent}
          averageText={
            modalType === 'success-high'
              ? 'Nota: La nota mínima aprobatoria en ISIL es de 12.50'
              : undefined
          }
        />
      )}
    </div>
  )
}