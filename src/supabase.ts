import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xoluhzpgyevooyfjrwyl.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvbHVoenBneWV2b295Zmpyd3lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5NTQyOTUsImV4cCI6MjA2MjUzMDI5NX0.qmha6CEyobSH-Uod3HvA1aK8Sn5dCUefsRDTw-5AJJ8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
