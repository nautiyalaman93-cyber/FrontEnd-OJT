/**
 * @file mockData.js
 * @description Centralized mock data store for the application.
 * 
 * This file is temporary. Remove after backend integration.
 * 
 * WHY THIS FILE EXISTS:
 * To provide realistic data for UI development and testing before the backend APIs are ready.
 * 
 * WHAT PROBLEM IT SOLVES:
 * - Allows frontend logic (filtering, searching, updating state) to be built and verified entirely offline.
 * - Prevents scattering hardcoded dummy data across individual UI components.
 * 
 * WHAT WILL BREAK IF REMOVED:
 * Every Service module will crash since they rely on exporting this data.
 */

export const trains = [
  {
    trainNumber: '12004',
    name: 'Shatabdi Express',
    source: 'New Delhi (NDLS)',
    destination: 'Lucknow (LKO)',
    status: 'On Time',
    currentStation: 'Kanpur Central (CNB)',
    delay: 0,
    expectedArrival: '12:40 PM',
  },
  {
    trainNumber: '12952',
    name: 'Mumbai Rajdhani',
    source: 'New Delhi (NDLS)',
    destination: 'Mumbai Central (MMCT)',
    status: 'Delayed',
    currentStation: 'Surat (ST)',
    delay: 25,
    expectedArrival: '08:35 AM',
  },
  {
    trainNumber: '22436',
    name: 'Vande Bharat Exp',
    source: 'New Delhi (NDLS)',
    destination: 'Varanasi (BSB)',
    status: 'On Time',
    currentStation: 'Prayagraj (PRYJ)',
    delay: 0,
    expectedArrival: '02:00 PM',
  }
];

export const pnrDetails = {
  '1234567890': {
    pnr: '1234567890',
    trainNumber: '12952',
    trainName: 'Mumbai Rajdhani',
    dateOfJourney: '2026-04-10',
    boardingStation: 'NDLS',
    destinationStation: 'MMCT',
    class: '3A',
    chartStatus: 'Chart Prepared',
    passengers: [
      { id: 1, name: 'Aman N.', bookingStatus: 'CNF', currentStatus: 'CNF', coach: 'B4', seat: '45', berth: 'Lower' },
      { id: 2, name: 'Priya R.', bookingStatus: 'CNF', currentStatus: 'CNF', coach: 'B4', seat: '46', berth: 'Middle' },
    ]
  },
  '0987654321': {
    pnr: '0987654321',
    trainNumber: '12004',
    trainName: 'Shatabdi Express',
    dateOfJourney: '2026-04-12',
    boardingStation: 'NDLS',
    destinationStation: 'LKO',
    class: 'CC',
    chartStatus: 'Chart Not Prepared',
    passengers: [
      { id: 1, name: 'Rahul K.', bookingStatus: 'WL/15', currentStatus: 'RAC/4', coach: '-', seat: '-', berth: '-' }
    ]
  }
};

export const seatExchangeRequests = [
  {
    id: 'req_001',
    pnr: '1234567890',
    passengerName: 'Aman N.',
    currentCoach: 'B4',
    currentSeat: '45',
    currentBerth: 'Lower',
    requestedBerth: 'Upper',
    status: 'Open',
    createdAt: '2026-03-26T08:00:00Z',
  },
  {
    id: 'req_002',
    pnr: '1122334455',
    passengerName: 'Neha S.',
    currentCoach: 'A1',
    currentSeat: '12',
    currentBerth: 'Upper',
    requestedBerth: 'Lower',
    status: 'Open',
    createdAt: '2026-03-26T09:15:00Z',
  }
];

export const proximityAlerts = [
  {
    id: 'alert_1',
    trainNumber: '12952',
    station: 'Surat (ST)',
    distanceKm: 15,
    isActive: true,
  }
];

export const allStations = [
  'NEW DELHI | NDLS', 'MUMBAI CENTRAL | MMCT', 'HOWRAH | HWH', 'BENGALURU | SBC',
  'CHENNAI CENTRAL | MAS', 'PUNE | PUNE', 'AHMEDABAD | ADI', 'LUCKNOW | LKO',
  'KANPUR CENTRAL | CNB', 'NAGPUR | NGP', 'PATNA | PNBE', 'JAIPUR | JP',
  'CHANDIGARH | CDG', 'BHOPAL | BPL', 'INDORE | INDB', 'SEALDAH | SDAH',
  'VARANASI | BSB', 'PRAYAGRAJ | PRYJ', 'SURAT | ST', 'VADODARA | BRC',
  'GORAKHPUR | GKP', 'AMRITSAR | ASR', 'LUDHIANA | LDH', 'GUWAHATI | GHY',
  'BHUBANESWAR | BBS', 'SECUNDERABAD | SC', 'HYDERABAD | HYB', 'VIJAYAWADA | BZA',
  'VISAKHAPATNAM | VSKP', 'THIRUVANANTHAPURAM | TVC', 'ERNAKULAM | ERS',
  'KOZHIKODE | CLT', 'MANGALURU | MAQ', 'MADURAI | MDU', 'COIMBATORE | CBE',
  'TIRUCHCHIRAPPALLI | TPJ', 'SALEM | SA', 'MYSORE | MYS', 'HUBLI | UBL',
  'BELAGAVI | BGM', 'GOA MADGAON | MAO', 'RAIPUR | R', 'RANCHI | RNC',
  'JAMSHEDPUR | TATA', 'DHANBAD | DHN', 'ASANSOL | ASN', 'DURGAPUR | DGR',
  'SILIGURI | SGUJ', 'NEW JALPAIGURI | NJP', 'AGRA CANTT | AGC', 'MATHURA | MTJ',
  'GWALIOR | GWL', 'JHANSI | JHS', 'JABALPUR | JBP', 'KOTA | KOTA',
  'JODHPUR | JU', 'UDAIPUR | UDZ', 'BIKANER | BKN', 'JAMMU TAWI | JAT',
  'DEHRADUN | DDN', 'HARIDWAR | HW', 'MORAODABAD | MB', 'BAREILLY | BE'
];
