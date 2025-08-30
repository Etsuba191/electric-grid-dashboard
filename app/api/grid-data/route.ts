import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")
  const location = searchParams.get("location")
  const assetType = searchParams.get("assetType")

  try {
    // Build Prisma query
    const where: any = {}
    if (location) where.address = { contains: location, mode: "insensitive" }
    if (assetType) where.type = assetType

    const assets = await prisma.gridAsset.findMany({ where })

    // Statistics (example, you can expand as needed)
    const statistics = {
      totalAssets: await prisma.gridAsset.count(),
      // Add more stats as needed
    }

    if (type === "assets") {
      return NextResponse.json({ assets })
    }
    if (type === "statistics") {
      return NextResponse.json({ statistics })
    }
    // Default: return all assets
    return NextResponse.json({ assets, statistics })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch grid data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  const userRole = (session?.user as any)?.role?.toLowerCase()
  if (!session || userRole !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const body = await request.json()
    const { action, assetId, data } = body

    if (action === "create_asset") {
      const asset = await prisma.gridAsset.create({ data })
      return NextResponse.json({ success: true, asset })
    }
    if (action === "update_asset") {
      const asset = await prisma.gridAsset.update({ where: { id: assetId }, data })
      return NextResponse.json({ success: true, asset })
    }
    if (action === "delete_asset") {
      await prisma.gridAsset.delete({ where: { id: assetId } })
      return NextResponse.json({ success: true })
    }
    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
