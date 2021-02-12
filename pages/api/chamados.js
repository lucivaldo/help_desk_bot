import { obterChamados } from "../../lib/help_desk"

export default (async (_, res) => {
  const chamados = await obterChamados()
  res.status(200).json(chamados)
})
