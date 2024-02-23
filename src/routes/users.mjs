import { Router } from "express";
import {
  query,
  validationResult,
  matchedData,
  checkSchema,
} from "express-validator";
import { allUsers } from "../utils/constants.mjs";
import { createUserValidationSchema } from "../utils/validationSchemas.mjs";
import { findIndexUserByID } from "../utils/middlewares.mjs";

const router = Router();

router.get(
  "/api/users",
  query("filter")
    .isString()
    .withMessage("Must have filter")
    .notEmpty()
    .withMessage("Must not be empty")
    .isLength({ min: 3, max: 15 })
    .withMessage("Must be between 3 & 15."),
  (req, res) => {
    const result = validationResult(req); // grab validation errors by query
    if (!result.isEmpty()) {
      return res.status(400).send({ errors: result.array() });
    }

    const validatedData = matchedData(req); // get validated data

    const { filter, value } = validatedData;

    if (!filter && !value) {
      return res.send(allUsers);
    }
    if (filter && value) {
      return res.send(
        allUsers.filter((user) =>
          user[filter].toLowerCase().includes(value.toLowerCase())
        )
      );
    }
    return res.send(allUsers);
  }
);

router.get("/api/users/:id", (req, res) => {
  const parsedId = parseInt(req.params.id);
  console.log(parsedId);
  if (isNaN(parsedId)) {
    return res.status(400).send({ msg: "Bad Request.Invalid Id" });
  }

  const findUser = allUsers.find((user) => {
    return user.id === parsedId;
  });

  //console.log(findUser);

  if (!findUser) return res.sendStatus(404);

  return res.send(findUser);
});

router.post(
  "/api/users",
  checkSchema(createUserValidationSchema),
  (req, res) => {
    const validatedData = matchedData(req); // Validated data
    const { body } = validatedData;

    // Ensure allUsers is not empty before accessing its last element
    const id = allUsers.length > 0 ? allUsers[allUsers.length - 1].id + 1 : 1;

    const newUser = { id, ...validatedData };
    allUsers.push(newUser);

    // Send back the full user object in the response
    return res.status(201).send(newUser);
  }
);
router.put("/api/users/:id", findIndexUserByID, (req, res) => {
  const { body, userDataIndex } = req;

  allUsers[userDataIndex] = { id: allUsers[userDataIndex].id, ...body }; //leave id and change everything

  return res.sendStatus(200);
});

router.patch("/api/users/:id", findIndexUserByID, (req, res) => {
  const { body, userDataIndex } = req;

  allUsers[userDataIndex] = { ...allUsers[userDataIndex], ...body };

  return res.sendStatus(200);
});

router.delete("/api/users/:id", (req, res) => {
  const { userDataIndex } = req;
  allUsers.splice(userDataIndex, 1);
  return res.sendStatus(200);
});

export default router;
