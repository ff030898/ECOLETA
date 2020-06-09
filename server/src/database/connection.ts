import knex from 'knex';
import path from 'path'; //Para lidar com caminhos dentro do Node padroniza o caminho com a barra invertida ou não dependendo do SO

const connection = knex({
 client: 'sqlite3',
 connection: {
    filename: path.resolve(__dirname, 'database.sqlite'),
 },
 useNullAsDefault: true,
});

export default connection;