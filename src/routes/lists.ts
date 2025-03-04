import express from "express";
import * as listController from "../controllers/listController.ts"; 
import authMiddleware from "../middlewares/authMiddleware.ts";

const router = express.Router();

// router.get('/', authMiddleware.isAuthenticated, listController.getLists);							 // GET /lists
router.get('/user/', authMiddleware.isAuthenticated, listController.getListsByUser);       // GET /lists/user/
router.get('/:listId', authMiddleware.isAuthenticated, listController.getListById);   		 // GET /lists/:listId
router.post('/', authMiddleware.isAuthenticated, listController.addList);         				 // POST /lists
router.put('/:listId', authMiddleware.isAuthenticated, listController.updateList);    		 // PUT /lists/:listId
router.delete('/:listId', authMiddleware.isAuthenticated, listController.deleteList); 	   // DELETE /lists/:listId

export default router; 
