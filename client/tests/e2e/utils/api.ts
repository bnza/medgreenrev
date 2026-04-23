import 'dotenv/config'
import { execSync } from 'node:child_process'

export const credentials = {
  ADMIN: { email: 'user_admin@example.com', password: '0002' },
  EDITOR: { email: 'user_editor@example.com', password: '0001' },
  BASE: { email: 'user_base@example.com', password: '0000' },
  BOT: { email: 'user_bot@example.com', password: '0007' },
  GEO: { email: 'user_geo@example.com', password: '0003' },
  HIS: { email: 'user_his@example.com', password: '0008' },
  MAT: { email: 'user_mat@example.com', password: '0010' },
  MST: { email: 'user_mst@example.com', password: '0011' },
  ANT: { email: 'user_ant@example.com', password: '0006' },
  POT: { email: 'user_pot@example.com', password: '0004' },
  ZOO: { email: 'user_zoo@example.com', password: '0005' },
  CLI: { email: 'user_cli@example.com', password: '0009' },
}

export function loadFixtures() {
  console.info('Loading fixtures...')
  execSync(
    `docker exec ${process.env.API_CONTAINER_ID} bin/console hautelook:fixtures:load --purge-with-truncate --env=dev --quiet >> /dev/null`,
  )
}

export function resetFixtureMedia() {
  console.info('Resetting fixture media...')
  execSync(
    `docker exec ${process.env.API_CONTAINER_ID} bin/console app:fixtures:reset-media --env=dev --quiet >> /dev/null`,
  )
}
