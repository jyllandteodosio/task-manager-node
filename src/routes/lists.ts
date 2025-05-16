import express from "express";
import * as listController from "../controllers/listController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get('/', authMiddleware.isAuthenticated, listController.getListsByUser);    		// GET /lists
router.get('/:listId', authMiddleware.isAuthenticated, listController.getListById);   	// GET /lists/:listId
router.post('/', authMiddleware.isAuthenticated, listController.addList);         		// POST /lists
router.put('/:listId', authMiddleware.isAuthenticated, listController.updateList);    	// PUT /lists/:listId
router.delete('/:listId', authMiddleware.isAuthenticated, listController.deleteList); 	// DELETE /lists/:listId

router.post('/:listId/share/:collaboratorId', authMiddleware.isAuthenticated, listController.addCollaborator); 		// POST /lists/:listId/share/:collaboratorId
router.delete('/:listId/share/:collaboratorId', authMiddleware.isAuthenticated, listController.removeCollaborator); // DELETE /lists/:listId/share/:collaboratorId

export default router; 
