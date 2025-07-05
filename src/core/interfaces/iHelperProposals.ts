export interface iHelperProposals {
  requestId: number;
  status: string;
  price?: number;
  message: string;

  offer: {
    id: number;
    description: string;
    budget: number;
    offerPostDate: Date;
  };

  disabled: {
    fullName: string;
    address: string;
    disabilityType: string;
    profileImage?: string;
  };
}
