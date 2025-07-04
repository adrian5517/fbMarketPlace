'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { supabase } from '@/lib/supabase'
import { Listing } from './component' // Re-using the Listing interface

interface MessageSellerFormProps {
  listing: Listing
}

export default function MessageSellerForm({ listing }: MessageSellerFormProps) {
  const [buyerEmail, setBuyerEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const { error } = await supabase.from('messages').insert([
      {
        listing_id: listing.id,
        buyer_email: buyerEmail,
        seller_email: listing.seller_email,
        message: message,
      },
    ])

    if (error) {
      console.error('Error sending message:', error)
      alert('There was an error sending your message. Please try again.')
    } else {
      setIsSent(true)
    }

    setIsSubmitting(false)
  }

  if (isSent) {
    return <p className="text-green-600">Your message has been sent!</p>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold">Message Seller</h2>
      <div>
        <label htmlFor="buyerEmail">Your Email</label>
        <Input
          id="buyerEmail"
          type="email"
          value={buyerEmail}
          onChange={(e) => setBuyerEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="message">Your Message</label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  )
}
