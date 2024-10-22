import { Timestamp } from "@angular/fire/firestore";

export interface UserPurchase {
  id?: string;
  userId: string;
  productId: string;
  quantity: number;
  total: number;
  createdAt: Date | Timestamp;
  productName: string;
}
