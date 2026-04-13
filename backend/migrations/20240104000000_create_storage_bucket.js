/**
 * Migration: create_storage_bucket
 * Creates the Supabase Storage bucket for portfolio assets
 */

export async function up(supabase) {
  // Create public bucket for portfolio assets
  const { error } = await supabase.storage.createBucket('portfolio-assets', {
    public: true,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'],
    fileSizeLimit: 10485760 // 10MB
  })

  if (error && !error.message.includes('already exists')) {
    throw new Error(`Storage bucket error: ${error.message}`)
  }

  console.log('    → portfolio-assets storage bucket ready')
}

export async function down(supabase) {
  await supabase.storage.deleteBucket('portfolio-assets')
  console.log('    → portfolio-assets storage bucket deleted')
}
