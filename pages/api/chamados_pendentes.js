import { obterChamadosPendentes } from "../../lib/help_desk"

export default (async (_, res) => {
  const chamados = await obterChamadosPendentes()
  res.status(200).json(chamados)
})
