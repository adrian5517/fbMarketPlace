import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import MessageSellerForm from "../../../components/message-seller-form";

export default async function ListingPage({ params }: any) {
  const { data: listing, error } = await supabase
    .from('listings')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !listing) {
    return <div>Listing not found.</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Image
            alt={listing.title}
            className="w-full max-w-md mx-auto rounded-lg object-cover"
            height={500}
            src={listing.image_url || "/placeholder.svg"}
            width={500}
          />
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{listing.title}</h1>
          <p className="text-2xl font-semibold">${listing.price.toFixed(2)}</p>
          <p className="text-gray-700">{listing.description}</p>
          <p className="text-sm text-gray-500">Category: {listing.category}</p>
          <p className="text-sm text-gray-500">Location: {listing.location || 'Unknown'}</p>
          <hr />
          <MessageSellerForm listing={listing} />
        </div>
      </div>
    </div>
  )
}
