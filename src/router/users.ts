import express from "express";

import { deleteUser, getAllUsers, getUserProfile, updateUser } from "../controllers/users";
import { isAuthenticated, isOwner } from "../middlewares";

export default (router: express.Router) => {
  router.get("/users",isAuthenticated , getAllUsers);
  router.delete('/users/:id', isAuthenticated, isOwner,deleteUser);
  router.patch('/users/:id', isAuthenticated, isOwner,updateUser);
  router.get('/users/profile', getUserProfile);
};
