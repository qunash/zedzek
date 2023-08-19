const { execSync } = require('child_process')
const dotenv = require('dotenv')

dotenv.config({ path: '.env.local' })
const projectId = process.env.SUPABASE_PROJECT_ID

const command = `npx supabase gen types typescript --project-id ${projectId} --schema public > lib/database.types.ts`
execSync(command, { stdio: 'inherit' })
console.log('✅ Types generated successfully')
