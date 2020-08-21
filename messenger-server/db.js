const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'react-messenger'
    }
})

knex.raw('select 1+1 as result').then(function () {
    console.log('connected to DB')
});

module.exports = knex