import { execSync } from 'node:child_process'
import dotenv from 'dotenv'
import { readFileSync, writeFileSync } from 'node:fs'

dotenv.config()

const apiBaseUrl = process.env.NUXT_PUBLIC_API_BASE_URL
if (!apiBaseUrl) {
  console.error('NUXT_PUBLIC_API_BASE_URL is not defined in your .env file.')
  process.exit(1)
}

const schemaUrl = `${apiBaseUrl}/api/docs.jsonopenapi`

console.log(`Fetching OpenAPI schema from: ${schemaUrl}`)

execSync(
  `openapi-typescript ${schemaUrl} --array-length --output types/openapi.d.ts`,
  {
    stdio: 'inherit',
  },
)

// Post-process the generated types to fix JSON-LD properties
console.log('Post-processing generated types to fix JSON-LD properties...')

try {
  const generatedTypes = readFileSync('types/openapi.d.ts', 'utf8')

  // Add import statement at the beginning and fix JSON-LD properties
  const fixedTypes = `import type { Iri } from '~~/types'\n\n${generatedTypes}`
    .replace(/"@id"\??\s*:\s*string/g, '"@id": Iri')
    .replace(/"@type"\?\s*:/g, '"@type":')
    // Also handle cases with different spacing
    .replace(/"@id"\s*\??\s*:\s*string/g, '"@id": Iri')
    .replace(/"@type"\s*\?\s*:/g, '"@type":')

  // Write the fixed types back to the file
  writeFileSync('types/openapi.d.ts', fixedTypes, 'utf8')

  console.log('JSON-LD properties fixed successfully!')
} catch (error) {
  console.error('Error post-processing types:', error)
  process.exit(1)
}
