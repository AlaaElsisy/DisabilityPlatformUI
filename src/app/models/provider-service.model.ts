export interface ProviderService {
    id?: number;
    description?: string;
    pricePerHour?: number;
    availableDateFrom?: string | Date;
    availableDateTo?: string | Date;
    helperId?: number;
    helperName?: string;
    serviceCategoryId: number;
    serviceCategoryName?: string;
}

export interface ProviderServiceQuery {
    helperId?: number;
    serviceCategoryId?: number;
    searchWord?: string;
    sortBy?: string;
    pageNumber?: number;
    pageSize?: number;
    minBudget?: number;
    maxBudget?: number;
}

export interface ProviderServicePagedResult {
    items: ProviderService[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
}