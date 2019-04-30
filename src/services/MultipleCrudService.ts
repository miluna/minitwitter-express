import {CrudService} from "./CrudService";

export interface MultipleCrudService<T> extends CrudService<T> {

    likeOne(objectId: string, userId: string): Promise<T>;

    dislikeOne(objectId: string, userId: string): Promise<T>;

    findUserObjects(userId: string, offset?:number): Promise<T[]>;

}
