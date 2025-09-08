
import { getListing } from "@/lib/db";
import Listing from "@/components/listing";
import Header from "@/components/Header";

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
    <div className="">
      <Header />
      <Listing listing={listing} />
    </div>
  );
}

