//Função middleware
const verificaSeEstaLogado = (req, res, next) => {
    //Verifica se sessão está setada
    if (req.session.usuario){
        //Vá adiante para próxima middleware
        next();
    }
    else {
        //redirecionando para tela de login
        res.redirect("/login");
    }
}

module.exports = verificaSeEstaLogado;