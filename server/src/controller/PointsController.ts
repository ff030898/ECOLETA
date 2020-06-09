import { Request, Response, request, response } from 'express';
import Knex from '../database/connection';

class PointsControllers{

    async index (request: Request, response: Response){
        const { city, uf, items } = request.query;

        const parsedItems = String(items)
        .split(',')
        .map(item => Number(item.trim()));

        const points = await Knex('points')
        .join('point_items', 'points.id', '=', 'point_items.point_id')
        .whereIn('point_items.item_id', parsedItems)
        .where('city', String(city))
        .where('uf', String(uf))
        .distinct()
        .select('points.*');

        return response.json(points);
    }

    async show (request: Request, response: Response) {
     
     //desestruturação: Poderia ser: const id = request.params.id;   
     const {id} = request.params;

     const point = await Knex('points').where('id', id).first();

     if(!point){
         return response.status(400).json({message: 'Point not found'});
     }

     const items = await Knex('items')
     .join('point_items', 'items.id', '=', 'point_items.item_id')
     .where('point_items.point_id', id)
     .select('items.title');

     return response.json({point, items});

    }

    async create (request: Request, response: Response) {


        const {
    
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
    
        } = request.body;
    
        //Variavel trx serve para verificar se os dois insert deram certo. Se um falhar ele não executa nenhum dos dois
    
        const trx = await Knex.transaction();

        const point = {
    
            image: 'https://trevisanonline.com.br/media/analise-de-mercado-banner-topo.png',
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
        
        }
    
        const insertedIds = await trx('points').insert(point);
    
        const point_id = insertedIds[0];
    
        const pointItems = items.map((item_id: number) => {
            return{
                item_id,
                point_id
            };
        });
    
        await trx('point_items').insert(pointItems);

        await trx.commit();
    
        return response.json({
            id: point_id,
            ...point
        });
    
    }

}

export default PointsControllers;