const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
// Permite ativar um modo de desenvolvimento sem MySQL definindo DEV_MOCK=true
const ProdutoController = process.env.DEV_MOCK === 'true'
  ? require('../controllers/MockProdutoController')
  : require('../controllers/ProdutoController');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // path.join garante que o caminho funcione em qualquer sistema operacional
    cb(null, path.join(__dirname, '..', 'uploads')); 
  },
  filename: function (req, file, cb) {
    const sufixoUnico = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + '-' + sufixoUnico);
  }
});
const upload = multer({storage: storage})

router.get('/', ProdutoController.listar);
router.get('/:id', ProdutoController.buscarPorId);
router.put('/:id', ProdutoController.atualizar);
router.delete('/:id', ProdutoController.deletar);
//Rota Atualizada
router.post('/', upload.single('foto'), ProdutoController.cadastrar);

module.exports = router;
