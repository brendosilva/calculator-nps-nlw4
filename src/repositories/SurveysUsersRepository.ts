import { Repository } from "typeorm";
import { EntityRepository } from "typeorm";
import {  SurveysUsers } from "../models/SurveysUsers";

@EntityRepository(SurveysUsers)
class SurveysUsersRepository extends Repository<SurveysUsers> {}

export {  SurveysUsersRepository  }