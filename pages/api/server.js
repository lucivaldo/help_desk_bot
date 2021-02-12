import { obterChamados, obterChamadosPendentes } from '../../lib/help_desk'

export default (req, res) => {
  obterChamadosPendentes()
  .then(response => {
    res.statusCode = 200
    res.json(response)
  })
}
