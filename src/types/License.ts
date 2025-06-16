export enum LicenseType {
  COMMERCIAL = 'commercial',
  RESEARCH = 'research',
  OPEN_SOURCE = 'open_source',
  CUSTOM = 'custom'
}

export enum UsageRights {
  TRAINING = 'training',
  INFERENCE = 'inference',
  REDISTRIBUTION = 'redistribution',
  MODIFICATION = 'modification',
  COMMERCIAL_USE = 'commercial_use',
  RESEARCH_ONLY = 'research_only'
}

export interface LicenseTerms {
  id: string;
  type: LicenseType;
  name: string;
  description: string;
  usageRights: UsageRights[];
  restrictions: string[];
  attributionRequired: boolean;
  commercialUse: boolean;
  redistributionAllowed: boolean;
  modificationAllowed: boolean;
  expirationDate?: Date;
  maxUsers?: number;
  geographicRestrictions?: string[];
  customTerms?: string;
}

export interface DatasetLicense {
  datasetId: string;
  licenseTerms: LicenseTerms;
  purchaseDate: Date;
  buyerWallet: string;
  licenseKey: string;
  isActive: boolean;
  usageTracking?: {
    downloadsUsed: number;
    maxDownloads: number;
    lastAccessed: Date;
  };
}

export const PREDEFINED_LICENSES: LicenseTerms[] = [
  {
    id: 'commercial-full',
    type: LicenseType.COMMERCIAL,
    name: 'Commercial Full License',
    description: 'Full commercial rights including training, inference, and redistribution',
    usageRights: [
      UsageRights.TRAINING,
      UsageRights.INFERENCE,
      UsageRights.REDISTRIBUTION,
      UsageRights.MODIFICATION,
      UsageRights.COMMERCIAL_USE
    ],
    restrictions: [],
    attributionRequired: false,
    commercialUse: true,
    redistributionAllowed: true,
    modificationAllowed: true
  },
  {
    id: 'research-only',
    type: LicenseType.RESEARCH,
    name: 'Research Only License',
    description: 'For academic and research purposes only, no commercial use',
    usageRights: [
      UsageRights.TRAINING,
      UsageRights.INFERENCE,
      UsageRights.RESEARCH_ONLY
    ],
    restrictions: [
      'No commercial use',
      'Academic institutions only',
      'Results must be published openly'
    ],
    attributionRequired: true,
    commercialUse: false,
    redistributionAllowed: false,
    modificationAllowed: true
  },
  {
    id: 'open-source',
    type: LicenseType.OPEN_SOURCE,
    name: 'Open Source License (MIT-style)',
    description: 'Open source license with attribution requirement',
    usageRights: [
      UsageRights.TRAINING,
      UsageRights.INFERENCE,
      UsageRights.REDISTRIBUTION,
      UsageRights.MODIFICATION,
      UsageRights.COMMERCIAL_USE
    ],
    restrictions: [
      'Must include original license',
      'Must provide attribution'
    ],
    attributionRequired: true,
    commercialUse: true,
    redistributionAllowed: true,
    modificationAllowed: true
  },
  {
    id: 'training-only',
    type: LicenseType.COMMERCIAL,
    name: 'Training Only License',
    description: 'For model training only, no redistribution of dataset',
    usageRights: [
      UsageRights.TRAINING,
      UsageRights.COMMERCIAL_USE
    ],
    restrictions: [
      'No redistribution of original dataset',
      'No sharing of raw data',
      'Trained models can be used commercially'
    ],
    attributionRequired: false,
    commercialUse: true,
    redistributionAllowed: false,
    modificationAllowed: false
  }
];