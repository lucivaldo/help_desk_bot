import axios from "axios"
import { fetchDiscordPayloads } from "../../lib/help_desk"

const HELP_DESK_API_RAILS_TOKEN = process.env.HELP_DESK_API_RAILS_TOKEN
const DISCORD_RAILS_WEBHOOK = process.env.DISCORD_RAILS_WEBHOOK

export default (async (_, res) => {
  const teams = [
    {
      name: 'Rails',
      apiToken: HELP_DESK_API_RAILS_TOKEN,
      webhook: DISCORD_RAILS_WEBHOOK,
      enabled: true
    }
  ]

  const headers = { 'Content-Type': 'application/json' }

  teams.forEach(async team => {
    if (team.enabled) {
      const payloads = await fetchDiscordPayloads(team.apiToken)

      payloads.forEach(async payload => {
        await axios.post(team.webhook, payload, { headers, timeout: 5000 })
      })
    }
  })

  res.status(200).json({ status: 'ok' })
})
