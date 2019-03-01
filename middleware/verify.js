function Verify (req, res, next) {
    console.log("Cek Verify ====", req.session.login.id, req.params.id)
    if (req.session.login.id == req.params.id) {
        next()
    } else {
      res.send('Tidak Bisa Akses Halaman ini')  
    }
}

module.exports = Verify 