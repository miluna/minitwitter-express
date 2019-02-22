import { db } from '../config/config';
import { CrudService } from './CrudService';
import { UserComment } from '../models/Comment';

export class CommentService implements CrudService<UserComment> {

    findById(id: number): UserComment {
        throw new Error("Method not implemented.");
    }    
    
    findAll(): UserComment[] {
        throw new Error("Method not implemented.");
    }

    createOne(t: UserComment): UserComment {
        throw new Error("Method not implemented.");
    }

    updateOne(id: number, t: UserComment): UserComment {
        throw new Error("Method not implemented.");
    }

    deleteOne(id: number): boolean {
        throw new Error("Method not implemented.");
    }

}
