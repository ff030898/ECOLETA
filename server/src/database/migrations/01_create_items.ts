import Knex from 'knex';

//CRIAR A TABELA
export async function up(knex: Knex){

    return knex.schema.createTable('items', table => {
    table.increments('id').primary();
    table.string('image').notNullable();
    table.string('title').notNullable();
    });
}

//DELETAR A TABELA OU VOLTAR ATRÁS
export async function down(knex: Knex){
    return knex.schema.dropTableIfExists('items');
}