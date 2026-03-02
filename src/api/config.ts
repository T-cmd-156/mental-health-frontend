import { visitFormConfig } from '../mock/formConfig'
import { scaleConfig } from '../mock/scaleConfig'
import { consentConfig } from '../mock/consentConfig'

export function getVisitFormConfig() {
  return Promise.resolve({ code: 200, data: visitFormConfig })
}

export function getScaleConfig() {
  return Promise.resolve({ code: 200, data: scaleConfig })
}

export function getConsentConfig() {
  return Promise.resolve({ code: 200, data: consentConfig })
}
