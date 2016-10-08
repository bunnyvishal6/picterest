module.exports = {
    'port': 3000 || process.env.PORT,
    'db': process.env.DB ||'mongodb://192.168.0.6:27017/jwtApp',
    'secret': process.env.SECRET || 'Shfs-hO87-Ojd9I-Ejfskj89IkjdP'
};
