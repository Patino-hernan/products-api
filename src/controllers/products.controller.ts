import type { Request, Response } from "express";
import { pool } from "../conf/dbConnection.ts";
import type { ResultSetHeader, RowDataPacket } from "mysql2";



export class ProductsController {
  constructor() {}

  public async getAllProducts(_req: Request, res: Response) {
    try {
      const [products] = await pool.execute(
         "select * from products where active = 1",
      );
      res.json(products);
    } catch{
      res.status(500).json({ message: "internal server error" });
    }
  }



  public async getProductsById(req: Request, res: Response) {
    try {
      const id = Number(req.params["id"]);

      if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({ message: "invalid id" });
        return;
      }

      const [products] = await pool.execute<RowDataPacket[]>(
        "select * from products where id = ? and active = 1",
        [id],
      );
      if (!products[0]) {
        res.status(404).json({ message: "product not found" });
        return;
      }
      res.json(products);
    } catch{
      res.status(500).json({ message: "internal server error" });
    }
  }



  public async createProduct(req: Request, res: Response) {
    try {
      const { name, price, stock, description, brand, img} = req.body;
      
      const priceNumber = Number(price);
      if( priceNumber <= 0 || typeof price !== 'number' ){
        res.status(400).json({message: "this ammount is not valid"});
        return;
      }

      await pool.execute(
        "insert into products (name,price,stock,description,brand,img) values (?,?,?,?,?,?)",
        [name, priceNumber, stock, description, brand ?? null, img ?? null],
      );
      res.status(201).json({ message:"product created"});
    } catch{
      res.status(500).json({ message: "internal server error" });
    }
  }

  public async updateProduct(req: Request, res: Response) {
    try {
      const id = Number(req.params["id"]);

      if(!Number.isInteger(id) || id <= 0){
        res.status(400).json({message: "this id is not valid"});
        return;
      }

      const { name, price, stock, description, brand, img} = req.body;

      const priceNumber = Number(price);
      if( priceNumber <= 0 || typeof price !== 'number' ){
        res.status(400).json({message: "this ammount is not valid"});
        return;
      }

      const [result] = await pool.execute<ResultSetHeader>(
        "update products set name = ?, price = ?, stock = ?, description = ?, brand = ?, img = ? where id = ? and active = 1",
        [name, price, stock, description, brand ?? null, img ?? null, id],

        
      );
      if (result.affectedRows === 0) {
        res.status(404).json({ message: "product not found" });
        return;
      }
      res.status(200).json({ message: "product updated" });
    } catch{
      res.status(500).json({ message: "internal server error" });
    }
  }




    public async updatePrice(req: Request, res: Response) {
    try {
      const id = Number(req.params["id"]);

      if(!Number.isInteger(id) || id <= 0){
        res.status(400).json({message: "this id is not valid"});
        return;
      }

      const { price } = req.body;

      const priceNumber = Number(price);
      if( priceNumber <= 0 || typeof price !== 'number'){
        res.status(400).json({message: "this ammount is not valid"});
        return;
      }

      const [result] = await pool.execute<ResultSetHeader>(
        "update products set price = ? where id = ? and active = 1",
        [price, id],
      );
      if (result.affectedRows === 0) {
        res.status(404).json({ message: "product not found" });
        return;
      }
      res.status(200).json({ message: "price updated" });
    } catch{
      res.status(500).json({ message: "internal server error" });
    }
  }



  public async deleteProduct(req: Request, res: Response){
    try{
      const id = Number(req.params["id"]);

      if(!Number.isInteger(id) || id <= 0){
        res.status(400).json({message: "this id is not valid"});
        return;
      }
      const [result] = await pool.execute<ResultSetHeader>(
        "update products set active = 0 where id = ? and active = 1",
        [id],
      );
      if (result.affectedRows === 0) {
        res.status(404).json({ message: "product not found" });
        return;
      }
      res.status(200).json({ message: "product deleted" });
    } catch {
      res.status(500).json({ message: "internal server error"});
    }
  }
}