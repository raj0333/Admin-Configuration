export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  ordersCount: number;
  status: "active" | "inactive" | "blocked";
  joinedAt: string;
}

export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicleType: string;
  licensePlate: string;
  status: "available" | "on_delivery" | "offline" | "suspended";
  rating: number;
  deliveriesCompleted: number;
  joinedAt: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  driverId: string | null;
  driverName: string | null;
  items: string;
  total: number;
  status: "pending" | "confirmed" | "in_transit" | "delivered" | "cancelled";
  pickupAddress: string;
  deliveryAddress: string;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin";
  status: "active" | "suspended";
  createdAt: string;
}

export const mockCustomers: Customer[] = [
  { id: "C001", name: "Ahmed Khan", email: "ahmed@workshop.com", phone: "+92-300-1234567", address: "Shop #12, Auto Market, Lahore", ordersCount: 45, status: "active", joinedAt: "2024-01-15" },
  { id: "C002", name: "Sara Ali", email: "sara@tires.pk", phone: "+92-321-9876543", address: "Workshop Lane, Karachi", ordersCount: 23, status: "active", joinedAt: "2024-02-20" },
  { id: "C003", name: "Bilal Hussain", email: "bilal@motors.com", phone: "+92-333-5551234", address: "GT Road, Rawalpindi", ordersCount: 12, status: "inactive", joinedAt: "2024-03-10" },
  { id: "C004", name: "Fatima Noor", email: "fatima@autoparts.pk", phone: "+92-345-7778899", address: "Mall Road, Islamabad", ordersCount: 67, status: "active", joinedAt: "2023-11-05" },
  { id: "C005", name: "Usman Tariq", email: "usman@fleet.com", phone: "+92-312-4443322", address: "Industrial Area, Faisalabad", ordersCount: 8, status: "blocked", joinedAt: "2024-04-01" },
  { id: "C006", name: "Zainab Malik", email: "zainab@tyres.pk", phone: "+92-301-6667788", address: "Saddar, Peshawar", ordersCount: 31, status: "active", joinedAt: "2024-01-28" },
];

export const mockDrivers: Driver[] = [
  { id: "D001", name: "Kamran Shah", email: "kamran@fleet.com", phone: "+92-300-1112233", vehicleType: "Truck", licensePlate: "LHR-4521", status: "available", rating: 4.8, deliveriesCompleted: 342, joinedAt: "2023-06-15" },
  { id: "D002", name: "Rizwan Ahmed", email: "rizwan@fleet.com", phone: "+92-321-4445566", vehicleType: "Van", licensePlate: "ISB-7832", status: "on_delivery", rating: 4.5, deliveriesCompleted: 215, joinedAt: "2023-08-20" },
  { id: "D003", name: "Hassan Ali", email: "hassan@fleet.com", phone: "+92-333-7778899", vehicleType: "Pickup", licensePlate: "KHI-1256", status: "offline", rating: 4.2, deliveriesCompleted: 128, joinedAt: "2024-01-10" },
  { id: "D004", name: "Imran Qureshi", email: "imran@fleet.com", phone: "+92-345-2223344", vehicleType: "Truck", licensePlate: "LHR-9087", status: "available", rating: 4.9, deliveriesCompleted: 489, joinedAt: "2023-03-05" },
  { id: "D005", name: "Tariq Mehmood", email: "tariq@fleet.com", phone: "+92-312-5556677", vehicleType: "Van", licensePlate: "RWP-3456", status: "suspended", rating: 3.8, deliveriesCompleted: 67, joinedAt: "2024-02-15" },
];

export const mockOrders: Order[] = [
  { id: "ORD-0001", customerId: "C001", customerName: "Ahmed Khan", driverId: "D001", driverName: "Kamran Shah", items: "4x All-Season Tires (205/55R16)", total: 32000, status: "delivered", pickupAddress: "Warehouse A, Lahore", deliveryAddress: "Shop #12, Auto Market, Lahore", createdAt: "2024-06-15" },
  { id: "ORD-0002", customerId: "C004", customerName: "Fatima Noor", driverId: "D002", driverName: "Rizwan Ahmed", items: "2x Brake Pads + 1x Battery", total: 18500, status: "in_transit", pickupAddress: "Warehouse B, Islamabad", deliveryAddress: "Mall Road, Islamabad", createdAt: "2024-06-18" },
  { id: "ORD-0003", customerId: "C002", customerName: "Sara Ali", driverId: null, driverName: null, items: "6x Truck Tires (315/80R22.5)", total: 96000, status: "pending", pickupAddress: "Warehouse C, Karachi", deliveryAddress: "Workshop Lane, Karachi", createdAt: "2024-06-19" },
  { id: "ORD-0004", customerId: "C006", customerName: "Zainab Malik", driverId: "D004", driverName: "Imran Qureshi", items: "4x Rims (17 inch Alloy)", total: 44000, status: "confirmed", pickupAddress: "Warehouse A, Lahore", deliveryAddress: "Saddar, Peshawar", createdAt: "2024-06-20" },
  { id: "ORD-0005", customerId: "C001", customerName: "Ahmed Khan", driverId: "D001", driverName: "Kamran Shah", items: "2x Performance Tires (225/45R17)", total: 22000, status: "delivered", pickupAddress: "Warehouse A, Lahore", deliveryAddress: "Shop #12, Auto Market, Lahore", createdAt: "2024-06-10" },
  { id: "ORD-0006", customerId: "C003", customerName: "Bilal Hussain", driverId: null, driverName: null, items: "1x Engine Oil Filter + Spark Plugs", total: 4500, status: "cancelled", pickupAddress: "Warehouse D, Rawalpindi", deliveryAddress: "GT Road, Rawalpindi", createdAt: "2024-06-12" },
];

export const mockAdmins: AdminUser[] = [
  { id: "A001", name: "Operations Manager", email: "admin@tirefleet.com", role: "admin", status: "active", createdAt: "2023-01-01" },
  { id: "A002", name: "Regional Admin", email: "regional@tirefleet.com", role: "admin", status: "active", createdAt: "2023-06-15" },
  { id: "A003", name: "Support Admin", email: "support@tirefleet.com", role: "admin", status: "suspended", createdAt: "2024-01-20" },
];
