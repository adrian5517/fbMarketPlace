'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from '@/lib/supabase'

export default function CreateListing() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [email, setEmail] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      alert('Please select an image to upload.')
      return
    }

    // 1. Upload image to Supabase Storage
    const fileName = `${Date.now()}_${file.name}`
    const { error: fileError } = await supabase.storage
      .from('listing-images')
      .upload(fileName, file)

    if (fileError) {
      console.error('Error uploading file:', fileError)
      return
    }

    // 2. Get the public URL of the uploaded image
    const { data: urlData } = supabase.storage
      .from('listing-images')
      .getPublicUrl(fileName)

    const imageUrl = urlData.publicUrl

    // 3. Save listing to the database
    const { error: dbError } = await supabase.from('listings').insert([
      {
        title,
        description,
        price: parseFloat(price),
        category,
        seller_email: email,
        image_url: imageUrl,
      },
    ])

    if (dbError) {
      console.error('Error saving listing:', dbError)
    } else {
      router.push('/')
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create a New Listing</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title">Title</label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <label htmlFor="price">Price</label>
          <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="category">Category</label>
          <Select onValueChange={setCategory} required>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="vehicles">Vehicles</SelectItem>
              <SelectItem value="property">Property</SelectItem>
              <SelectItem value="apparel">Apparel</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="photo">Photo</label>
          <Input id="photo" type="file" onChange={handleFileChange} required />
        </div>
        <Button type="submit">Create Listing</Button>
      </form>
    </div>
  )
}
