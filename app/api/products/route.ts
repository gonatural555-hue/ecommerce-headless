import { NextResponse } from "next/server"

const products = [
  {
    id: "1",
    title: "Producto Uno",
    price: 100,
    image: "/product1.jpg",
  },
  {
    id: "2",
    title: "Producto Dos",
    price: 200,
    image: "/product2.jpg",
  },
]

export async function GET() {
  return NextResponse.json(products)
}
