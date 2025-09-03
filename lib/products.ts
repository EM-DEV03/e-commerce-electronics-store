import { createBrowserClient } from "@supabase/ssr"

export interface Product {
  id: string // Changed from number to string for UUID
  name: string
  description: string
  price: number
  image_url: string
  category_id: string // Changed from number to string for UUID
  category?: {
    id: string // Changed from number to string for UUID
    name: string
  }
  stock: number // Changed from in_stock boolean to stock number
  is_featured: boolean // Changed from is_new to is_featured to match schema
  slug: string // Added slug field from schema
  created_at: string
  updated_at: string
}

export interface Category {
  id: string // Changed from number to string for UUID
  name: string
  description?: string
  slug: string // Added slug field from schema
  created_at: string
}

const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(id, name)
    `)
    .gt("stock", 0) // Changed from eq("in_stock", true) to gt("stock", 0)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching products:", error)
    return []
  }

  return data || []
}

export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(id, name)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching all products:", error)
    return []
  }

  return data || []
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(id, name)
    `)
    .gt("stock", 0) // Changed from eq("in_stock", true) to gt("stock", 0)
    .eq("is_featured", true) // Filter by is_featured instead of ordering by rating
    .order("created_at", { ascending: false })
    .limit(6)

  if (error) {
    console.error("Error fetching featured products:", error)
    return []
  }

  return data || []
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from("categories").select("*").order("name")

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  return data || []
}

export async function getProductById(id: string): Promise<Product | null> {
  // Changed parameter type from number to string
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(id, name)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching product:", error)
    return null
  }

  return data
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  // First get the category by slug
  const category = await getCategoryBySlug(categorySlug)
  if (!category) return []

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(id, name)
    `)
    .eq("category_id", category.id)
    .gt("stock", 0)
    .order("name")

  if (error) {
    console.error("Error fetching products by category:", error)
    return []
  }

  return data || []
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { data, error } = await supabase.from("categories").select("*").eq("slug", slug).single()

  if (error) {
    console.error("Error fetching category by slug:", error)
    return null
  }

  return data
}

export async function getCategoriesWithProductCount(): Promise<(Category & { product_count: number })[]> {
  const { data, error } = await supabase
    .from("categories")
    .select(`
      *,
      products(count)
    `)
    .order("name")

  if (error) {
    console.error("Error fetching categories with product count:", error)
    return []
  }

  return (
    data?.map((category) => ({
      ...category,
      product_count: category.products?.[0]?.count || 0,
    })) || []
  )
}
