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

export default function Calculator() {
  const [mode, setMode] = useState<CalculatorMode>('actual')
  const [rows, setRows] = useState<GradeRow[]>(
    PROMEDIO_ACTUAL_DEFAULT.map((row, index) => ({ ...row, id: `row-${index}` }))
  )
  const [modalType, setModalType] = useState<ModalType>(null)
  const [calculatedAverage, setCalculatedAverage] = useState<number>(0)

  const handleModeChange = (newMode: CalculatorMode) => {
    setMode(newMode)
    const defaultRows = newMode === 'actual' ? PROMEDIO_ACTUAL_DEFAULT : PROMEDIO_ANTIGUO_DEFAULT
    setRows(defaultRows.map((row, index) => ({ ...row, id: `row-${index}` })))
  }

  const updateRow = (id: string, field: keyof Omit<GradeRow, 'id'>, value: string) => {
    setRows(rows.map(row => row.id === id ? { ...row, [field]: value } : row))
  }

  const addRow = () => {
    const newRow: GradeRow = {
      id: `row-${Date.now()}`,
      description: `Nueva fila ${rows.length + 1}`,
      grade: '',
      percentage: '0',
    }
    setRows([...rows, newRow])
  }

  const removeRow = (id: string) => {
    if (rows.length > 1) {
      setRows(rows.filter(row => row.id !== id))
    }
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
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => handleModeChange('antiguo')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              mode === 'antiguo'
                ? 'bg-isil-cyan text-black'
                : 'bg-light-bg dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Promedio Antiguo
          </button>
          <button
            onClick={() => handleModeChange('actual')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              mode === 'actual'
                ? 'bg-isil-cyan text-black'
                : 'bg-light-bg dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Promedio Actual
          </button>
        </div>

        {/* Table Headers */}
        <div className="grid grid-cols-12 gap-2 mb-4 px-2">
          <div className="col-span-4 text-gray-600 dark:text-gray-400 font-medium text-sm">
            Descripción
          </div>
          <div className="col-span-3 text-gray-600 dark:text-gray-400 font-medium text-sm">
            Calificación
          </div>
          <div className="col-span-5 text-gray-600 dark:text-gray-400 font-medium text-sm">
            Porcentaje
          </div>
        </div>

        {/* Table Rows */}
        <div className="space-y-3">
          {rows.map((row) => (
            <div key={row.id} className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-4">
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
              <div className="col-span-3">
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
              <div className="col-span-3">
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
              <div className="col-span-2 flex gap-1 justify-end">
                <button
                  onClick={addRow}
                  className="w-8 h-8 rounded-full bg-btn-gray hover:bg-gray-700 text-white flex items-center justify-center transition-colors"
                  aria-label="Agregar fila"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => removeRow(row.id)}
                  className="w-8 h-8 rounded-full bg-btn-gray hover:bg-gray-700 text-white flex items-center justify-center transition-colors"
                  aria-label="Eliminar fila"
                  disabled={rows.length === 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Calculate Button */}
        <div className="mt-8">
          <button
            onClick={calculateAverage}
            className="w-full bg-btn-gray dark:bg-dark-input hover:bg-gray-700 dark:hover:bg-gray-600 
                     text-white font-medium py-4 px-6 rounded-lg transition-colors text-lg"
          >
            Calcular Calificación Final
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
