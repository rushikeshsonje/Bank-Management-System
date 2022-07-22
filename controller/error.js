exports.get404 = (req, res, next) => {
    res.render('404');
}; 

exports.get500 = (req, res, next) => {
    res.render('500');
}; 

