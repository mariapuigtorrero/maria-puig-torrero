'use client'

import { useSyncExternalStore } from 'react'

const QUERY = '(max-width: 768px)'

function subscribe(callback: () => void) {
  const mql = window.matchMedia(QUERY)
  mql.addEventListener('change', callback)
  return () => mql.removeEventListener('change', callback)
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches
}

function getServerSnapshot() {
  return false
}

// Detecta si el viewport es de móvil (<=768px) usando useSyncExternalStore,
// la forma recomendada por React para suscribirse a una API del navegador
// (matchMedia) sin llamar a setState dentro de un efecto.
export function useIsMobile() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
