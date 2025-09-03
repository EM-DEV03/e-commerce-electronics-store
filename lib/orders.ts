"use client"

import { createClient } from "@/lib/supabase/client"
import type { CartItem } from "@/lib/cart-context"

export interface Order {
  id: string
  user_id: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  total: number
  shipping_address: string
  payment_method: string
  payment_status: "pending" | "completed" | "failed"
  created_at: string
  updated_at: string
  items: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: number
  quantity: number
  price: number
  product_name: string
  product_image: string
}

export async function createOrder(orderData: {
  items: CartItem[]
  total: number
  shippingAddress: string
  paymentMethod: string
}) {
  const supabase = createClient()

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error("Usuario no autenticado")
  }

  // Create order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      status: "pending",
      total: orderData.total,
      shipping_address: orderData.shippingAddress,
      payment_method: orderData.paymentMethod,
      payment_status: "pending",
    })
    .select()
    .single()

  if (orderError) {
    throw new Error("Error creando pedido: " + orderError.message)
  }

  // Create order items
  const orderItems = orderData.items.map((item) => ({
    order_id: order.id,
    product_id: item.id,
    quantity: item.quantity,
    price: item.price,
    product_name: item.name,
    product_image: item.image,
  }))

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

  if (itemsError) {
    throw new Error("Error creando items del pedido: " + itemsError.message)
  }

  return order
}

export async function getUserOrders() {
  const supabase = createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error("Usuario no autenticado")
  }

  const { data: orders, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        id,
        product_id,
        quantity,
        price,
        product_name,
        product_image
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error("Error obteniendo pedidos: " + error.message)
  }

  return orders as Order[]
}

export async function getOrderById(orderId: string) {
  const supabase = createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error("Usuario no autenticado")
  }

  const { data: order, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        id,
        product_id,
        quantity,
        price,
        product_name,
        product_image
      )
    `)
    .eq("id", orderId)
    .eq("user_id", user.id)
    .single()

  if (error) {
    throw new Error("Error obteniendo pedido: " + error.message)
  }

  return order as Order
}

export async function getAllOrders() {
  const supabase = createClient()

  const { data: orders, error } = await supabase
    .from("orders")
    .select(`
      *,
      profiles (
        full_name,
        email
      ),
      order_items (
        id,
        product_id,
        quantity,
        price,
        product_name,
        product_image
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error("Error obteniendo todos los pedidos: " + error.message)
  }

  return orders
}

export async function updateOrderStatus(orderId: string, status: Order["status"]) {
  const supabase = createClient()

  const { error } = await supabase
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", orderId)

  if (error) {
    throw new Error("Error actualizando estado del pedido: " + error.message)
  }
}
