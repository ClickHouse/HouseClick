
import { getListing } from "@/lib/db";
import Link from "next/link";
import ListingDetails from "@/components/ListingDetails";
import ListingAnalytics from "@/components/ListingAnalytics";

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const listing = await getListing(id);

  if (!listing || listing.id === undefined) {
    throw new Error("Listing not found or ID is undefined");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
      <div className="py-6">
        <Link href="/listings/search" className="text-sm text-primary-300">
          &laquo; Back to listings
        </Link>
      </div>
      <ListingDetails {...listing} />
      <ListingAnalytics {...listing}/>
    </div>
  );
}

