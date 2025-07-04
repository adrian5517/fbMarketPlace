import { Component } from "@/components/component";
import { supabase } from "@/lib/supabase";

export default async function Home({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    category?: string;
  };
}) {
  const query = searchParams?.query || '';
  const category = searchParams?.category || 'all';

  let supabaseQuery = supabase.from('listings').select('*');

  if (category !== 'all') {
    supabaseQuery = supabaseQuery.eq('category', category);
  }

  if (query) {
    supabaseQuery = supabaseQuery.ilike('title', `%${query}%`);
  }

  const { data: listings, error } = await supabaseQuery.order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching listings:', error);
  }

  return (
    <Component listings={listings || []} currentCategory={category} currentQuery={query} />
  );
}
