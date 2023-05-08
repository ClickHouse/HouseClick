


export default async function handler(req, res) {
    const settings = {
        supabase_url: process.env.SUPABASE_URL, 
        supabase_key: process.env.SUPABASE_KEY
    }
    res.status(200).json(settings)
}