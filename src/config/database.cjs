module.exports = {
    dialect : 'postgres',
   host: process.env.DB_HOST,
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'dev-burguer-db',
    define: {
        timestamps: true,
        underscored: true,
        underscoredAll:true,
    },
};