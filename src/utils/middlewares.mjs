import { allUsers } from "./constants.mjs";

export const findIndexUserByID = (req, res, next) => {
    const {
      params: { id },
    } = req;
    const parsedId = parseInt(id);
    if (isNaN === parsedId) return res.sendStatus(400);
  
    const userDataIndex = allUsers.findIndex((user) => user.id === parsedId);
    if (userDataIndex === -1) return res.sendStatus(404);
    req.userDataIndex = userDataIndex;
    next();
  };
  