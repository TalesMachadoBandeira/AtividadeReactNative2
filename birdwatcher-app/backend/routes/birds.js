// Rota para excluir um pássaro
router.delete('/:id', async (req, res) => {
  try {
    const bird = await Bird.findById(req.params.id);
    
    if (!bird) {
      return res.status(404).json({ message: 'Pássaro não encontrado' });
    }

    // Remove os arquivos de mídia se existirem
    if (bird.photo) {
      const photoPath = path.join(__dirname, '..', 'uploads', bird.photo);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }

    if (bird.audio) {
      const audioPath = path.join(__dirname, '..', 'uploads', bird.audio);
      if (fs.existsSync(audioPath)) {
        fs.unlinkSync(audioPath);
      }
    }

    // Remove o registro do banco de dados
    await Bird.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Pássaro excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir pássaro:', error);
    res.status(500).json({ message: 'Erro ao excluir pássaro' });
  }
}); 