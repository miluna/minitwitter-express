import { db } from '../config/config';
import { CrudService } from './CrudService';
import { UserComment } from '../models/Comment';


export class CommentService implements CrudService<UserComment> {

    findById(id: string): Promise<UserComment> {
        return new Promise(resolve => resolve());
    }    
    
    findAll(): Promise<UserComment[]> {
        return new Promise(resolve => resolve());
    }

    createOne(t: UserComment): Promise<UserComment> {
        return new Promise(resolve => resolve());
    }

    updateOne(id: string, t: UserComment): Promise<UserComment> {
        return new Promise(resolve => resolve());
    }

    deleteOne(id: string): Promise<UserComment> {
        return new Promise(resolve => resolve());
    }

    likeOrDislikeOne(id: string): Promise<boolean> {
        return new Promise(resolve => resolve());
    }
}
