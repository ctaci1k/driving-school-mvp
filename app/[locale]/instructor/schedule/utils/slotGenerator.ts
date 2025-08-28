// Generator slotów na podstawie godzin pracy
// Uwaga: prosta implementacja — przerwy realizowane jako odstęp między slotami

import { Slot, WorkingHours } from '../types/schedule.types'

type TimeHM = { h: number; m: number }

function parseHM(t: string): TimeHM {
  const [h, m] = t.split(':').map(Number)
  return { h, m }
}

function withTime(date: Date, t: TimeHM): Date {
  const d = new Date(date)
  d.setHours(t.h, t.m, 0, 0)
  return d
}

function addMinutes(d: Date, minutes: number): Date {
  return new Date(d.getTime() + minutes * 60_000)
}

export function generateSlotsFromWorkingHours(date: Date, workingHours: WorkingHours): Slot[] {
  if (!workingHours?.enabled || !workingHours?.intervals?.length) return []

  const slots: Slot[] = []
  const slotDuration = Math.max(15, Number(workingHours.slotDuration ?? 60)) // min 15 min
  const breakDuration = Math.max(0, Number(workingHours.breakDuration ?? 0))

  for (const interval of workingHours.intervals) {
    const startHM = parseHM(interval.start)
    const endHM = parseHM(interval.end)

    let start = withTime(date, startHM)
    const hardEnd = withTime(date, endHM)

    while (true) {
      const slotStart = start
      const slotEnd = addMinutes(slotStart, slotDuration)
      if (slotEnd > hardEnd) break

      // Tworzymy podstawowy slot "dostępny"
      const slot: Slot = {
        id: `gen-${date.toISOString().split('T')[0]}-${slotStart.getHours()}${String(slotStart.getMinutes()).padStart(2, '0')}-${Math.random().toString(36).slice(2, 8)}`,
        date: new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString(),
        startTime: slotStart.toTimeString().slice(0, 5), // HH:MM
        endTime: slotEnd.toTimeString().slice(0, 5),     // HH:MM
        status: 'dostępny',
        location: undefined,
        student: undefined,
        notes: '',
      }

      slots.push(slot)

      // Przesuwamy wskaźnik: koniec slotu + przerwa
      start = addMinutes(slotEnd, breakDuration)
      if (start >= hardEnd) break
    }
  }

  return slots
}
