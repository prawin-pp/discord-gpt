export interface Welcome {
  head: Head;
  body: Body;
}

export interface Body {
  content: Content;
}

export interface Content {
  pickupMessage: PickupMessage;
  deliveryMessage: DeliveryMessage;
}

export interface DeliveryMessage {
  geoLocated: boolean;
  availableOptionsText: string;
  'MYWW3ZP/A': DeliveryMessageMYWW3ZPA;
  dudeCookieSet: boolean;
  processing: string;
  contentloaded: string;
  deliveryLocationLabel: string;
  dudeLocated: boolean;
  locationCookieValueFoundForThisCountry: boolean;
  accessibilityDeliveryOptions: string;
}

export interface DeliveryMessageMYWW3ZPA {
  compact: MYWW3ZPACompact;
  regular: Regular;
}

export interface MYWW3ZPACompact {
  label: string;
  quote: string;
  address: Data;
  showDeliveryOptionsLink: boolean;
  messageType: string;
  basePartNumber: string;
  commitCodeId: string;
  subHeader: string;
  buyability: CompactBuyability;
  inHomeSetup: boolean;
  defaultLocationEnabled: boolean;
  idl: boolean;
  isBuyable: boolean;
  isElectronic: boolean;
}

export interface Data {}

export interface CompactBuyability {
  reason: string;
  commitCode: string;
  isBuyable: boolean;
}

export interface Regular {
  orderByDeliveryBy: string;
  deliveryOptionMessages: DeliveryOptionMessage[];
  deliveryOptions: DeliveryOption[];
  promoMessage: string;
  deliveryOptionsLink: DeliveryOptionsLink;
  showDeliveryOptionsLink: boolean;
  messageType: string;
  basePartNumber: string;
  commitCodeId: string;
  subHeader: string;
  stickyMessageSTH: string;
  buyability: CompactBuyability;
  inHomeSetup: boolean;
  defaultLocationEnabled: boolean;
  idl: boolean;
  isBuyable: boolean;
  isElectronic: boolean;
}

export interface DeliveryOptionMessage {
  displayName: string;
  inHomeSetup: string;
}

export interface DeliveryOption {
  displayName: string;
  date: string;
  shippingCost: string;
  additionalContent: null;
}

export interface DeliveryOptionsLink {
  text: string;
  dataVar: Data;
  newTab: boolean;
}

export interface PickupMessage {
  stores: Store[];
  overlayInitiatedFromWarmStart: boolean;
  viewMoreHoursLinkText: string;
  storesCount: string;
  little: boolean;
  location: string;
  notAvailableNearby: string;
  notAvailableNearOneStore: string;
  warmDudeWithAPU: boolean;
  viewMoreHoursVoText: string;
  availability: Availability;
  viewDetailsText: string;
  legendLabelText: string;
  filteredTopStore: boolean;
}

export interface Availability {
  isComingSoon: boolean;
}

export interface Store {
  storeEmail: string;
  storeName: string;
  reservationUrl: string;
  makeReservationUrl: string;
  storeImageUrl: string;
  country: string;
  city: string;
  storeNumber: string;
  partsAvailability: PartsAvailability;
  phoneNumber: string;
  pickupTypeAvailabilityText: string;
  address: StoreAddress;
  hoursUrl: string;
  storeHours: StoreHours;
  storelatitude: number;
  storelongitude: number;
  storedistance: number;
  storeDistanceWithUnit: string;
  storeDistanceVoText: string;
  retailStore: RetailStore;
  storelistnumber: number;
  storeListNumber: number;
  pickupOptionsDetails: PickupOptionsDetails;
  rank: number;
}

export interface StoreAddress {
  address: string;
  address3: string;
  address2: string;
  postalCode: string;
}

export interface PartsAvailability {
  [key: string]: PartsAvailabilityMYWW3ZPA;
}

export interface PartsAvailabilityMYWW3ZPA {
  storePickEligible: boolean;
  pickupSearchQuote: string;
  partNumber: string;
  purchaseOption: string;
  ctoOptions: string;
  pickupDisplay: string;
  pickupType: string;
  messageTypes: MessageTypes;
  buyability: MYWW3ZPABuyability;
}

export interface MYWW3ZPABuyability {
  isBuyable: boolean;
  reason: string;
  commitCodeId: number;
  inventory: number;
}

export interface MessageTypes {
  compact: RegularClass;
  regular: RegularClass;
}

export interface RegularClass {
  storeSearchEnabled: boolean;
  storePickupLabel: string;
  storeSelectionEnabled: boolean;
  storePickupQuote: string;
  storePickupLinkText: string;
  storePickupProductTitle: string;
  storePickupQuote2_0?: string;
}

export interface PickupOptionsDetails {
  whatToExpectAtPickup: string;
  comparePickupOptionsLink: string;
  pickupOptions: PickupOption[];
}

export interface PickupOption {
  pickupOptionTitle: string;
  pickupOptionDescription: string;
  index: number;
}

export interface RetailStore {
  storeNumber: string;
  storeUniqueId: string;
  name: string;
  storeTypeKey: string;
  storeSubTypeKey: string;
  storeType: string;
  phoneNumber: string;
  email: string;
  carrierCode: null;
  locationType: null;
  latitude: number;
  longitude: number;
  address: RetailStoreAddress;
  urlKey: null;
  directionsUrl: null;
  storeImageUrl: string;
  makeReservationUrl: string;
  hoursAndInfoUrl: string;
  storeHours: StoreHour[];
  storeHolidays: any[];
  secureStoreImageUrl: string;
  distance: number;
  distanceUnit: string;
  distanceWithUnit: string;
  timezone: string;
  storeIsActive: boolean;
  lastUpdated: number;
  lastFetched: number;
  dateStamp: string;
  distanceSeparator: string;
  nextAvailableDate: null;
  storeHolidayLookAheadWindow: number;
  driveDistanceWithUnit: null;
  driveDistanceInMeters: null;
  dynamicAttributes: Data;
  storePickupMethodByType: StorePickupMethodByType;
  storeTimings: null;
  availableNow: boolean;
}

export interface RetailStoreAddress {
  city: string;
  companyName: string;
  countryCode: string;
  county: null;
  district: string;
  geoCode: null;
  label: null;
  languageCode: string;
  mailStop: null;
  postalCode: string;
  primaryAddress: boolean;
  province: null;
  state: null;
  street: string;
  street2: string;
  street3: null;
  suburb: null;
  type: string;
  addrSourceType: null;
  outsideCityFlag: null;
  daytimePhoneAreaCode: null;
  eveningPhoneAreaCode: null;
  daytimePhone: string;
  fullPhoneNumber: null;
  eveningPhone: null;
  emailAddress: null;
  firstName: null;
  lastName: null;
  suffix: null;
  lastNamePhonetic: null;
  firstNamePhonetic: null;
  title: null;
  bundlePaymentAddress: boolean;
  businessAddress: boolean;
  uuid: string;
  mobilePhone: null;
  mobilePhoneAreaCode: null;
  cityStateZip: null;
  daytimePhoneSelected: boolean;
  middleName: null;
  residenceStatus: null;
  moveInDate: null;
  subscriberId: null;
  locationType: null;
  carrierCode: null;
  addressCode: null;
  metadata: Data;
  verificationState: string;
  markForDeletion: boolean;
  expiration: null;
  correctionResult: null;
  fullEveningPhone: null;
  fullDaytimePhone: string;
  twoLineAddress: string;
  addressVerified: boolean;
}

export interface StoreHour {
  storeDays: string;
  voStoreDays: null;
  storeTimings: string;
}

export interface StorePickupMethodByType {
  INSTORE: Instore;
}

export interface Instore {
  type: string;
  services: string[];
  typeDirection: TypeDirection;
  typeCoordinate: TypeCoordinate;
  typeMeetupLocation: TypeMeetupLocation;
}

export interface TypeCoordinate {
  lat: number;
  lon: number;
}

export interface TypeDirection {
  directionByLocale: null;
}

export interface TypeMeetupLocation {
  meetingLocationByLocale: null;
}

export interface StoreHours {
  storeHoursText: string;
  bopisPickupDays: string;
  bopisPickupHours: string;
  hours: Hour[];
}

export interface Hour {
  storeTimings: string;
  storeDays: string;
}

export interface Head {
  status: string;
  data: Data;
}
