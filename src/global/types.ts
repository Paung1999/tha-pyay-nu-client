export type Book = {
   id: number;
   price: number;
   currency: string;
   stockQuantity: number;
   isActive:boolean;
   condition: string;
   book: {
    id: number;
    title: string;
    author: string;
    isbn: string;
    coverImage: string;
    description: string;
   }
};

export type User = {
    name: string;
    email: string;
    role: 'ADMIN' | 'CUSTOMER';
}

export type Genre = {
    id: number;
    name: string;
    books?: Book[]
}

export type CartItem  = {
  sellBookId: number;
  title: string;
  author: string;
  price: number;
  currency: string;
  coverImage: string;
  quantity: number;
}

export type Order = {
    id: number;
    userId: number;
    user: User;
    orderNumber: string;
    status: string;
    subtotal: number;
    total: number;
    shippingAddressSnapshot: string;
    orderItems: OrderItem[];
    createdAt: Date;
    updatedAt: Date;

}

export type OrderItem = {
    id: number;
    orderId: number;
    sellBookId: number;
    quantity: number;

}