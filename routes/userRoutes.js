import express from 'express';
import {getAllUsers, createUser, deleteUser ,getSpecificUser, updateUser} from "./../controllers/userController.js"

const router = express.Router();

router.route('/').get(getAllUsers).post(createUser);

router.route('/:id').get(getSpecificUser).patch(updateUser).delete(deleteUser);

export default router;