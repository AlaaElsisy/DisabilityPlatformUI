
export interface Ihelperservices {
  id: number
  description: string
  pricePerHour: number
  createdAt: string
  availableDateFrom: string
  availableDateTo: string
  helperId: number
  helper: any
  serviceCategoryId: number
  serviceCategory: any
  disabledRequests: any[]
}
