import axios from 'axios'

const BOT_NAME = process.env.BOT_NAME

const HELP_DESK_BASE_URL = process.env.HELP_DESK_BASE_URL
const HELP_DESK_API_URL = process.env.HELP_DESK_API_URL

const STATUS_LIST = {
  'PENDENTES': 'PENDENTES',
  'EM_ATENDIMENTO': 'EM ATENDIMENTO',
}

const COLORS = {
  debug: parseInt('fbe14f', 16),
  info: parseInt('2788ce', 16),
  warning: parseInt('f18500', 16),
  error: parseInt('e03e2f', 16),
  fatal: parseInt('d20f2a', 16),
}

const obterChamados = async apiToken => {
  const headers = { 'Authorization': `Token ${apiToken}` }
  const response = await axios.get(HELP_DESK_API_URL, { headers })

  if (response.status == 200) {
    const data = response.data
    return data.results
  } else {
    throw new Error('Erro ao obter chamados da API do Help Desk. Código de retorno:', response.status)
  }
}

const obterChamadosPendentes = async (apiToken) => {
  const chamados = await obterChamados(apiToken)

  const chamadosPendentes = chamados.filter(c => {
    return c.status_categoria.some(statusCategoria => {
      return statusCategoria.status.descricao === STATUS_LIST.PENDENTES
    })
  })

  return chamadosPendentes
}

const fetchDiscordPayloads = async (apiToken) => {
  const chamadosPendentes = await obterChamadosPendentes(apiToken)

  if (!chamadosPendentes.length) {
    return []
  }

  const emoction = ':warning:'

  const payloads = chamadosPendentes.map(chamado => {
    const titulo = chamado.label
    const url = `${HELP_DESK_BASE_URL}/chamados/detail/${chamado.id}`
    const categorias = chamado.categorias.map(el => el.descricao).join(', ')
    const solicitante = chamado.solicitante.nome
    const descricao = chamado.descricao.slice(0, 150) + '...'

    return {
      username: BOT_NAME,
      embeds: [
        {
          title: titulo,
          type: 'rich',
          url,
          color: COLORS.debug,
          footer: {
            icon_url: 'https://github.com/fluidicon.png',
            text: 'lucivaldo/help_desk_bot'  
          },
          fields: [
            {
              name: 'Categorias',
              value: `${emoction} ${categorias}`,
              inline: true
            },
            {
              name: 'Solicitante',
              value: solicitante,
              inline: true
            },
            {
              name: 'Descrição',
              value: descricao,
              inline: false
            }
          ]
        }
      ]
    }
  })

  return payloads
}

export {
  obterChamados,
  obterChamadosPendentes,
  fetchDiscordPayloads
}
