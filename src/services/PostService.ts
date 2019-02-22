import { db } from '../config/config';
import { CrudService } from './CrudService';
import { Post } from '../models/Post';

export class PostService implements CrudService<Post> {
    
    findById(id: number): Post {
        throw new Error("Method not implemented.");
    }    
    
    findAll(): Post[] {
        throw new Error("Method not implemented.");
    }

    createOne(t: Post): Post {
        throw new Error("Method not implemented.");
    }

    updateOne(id: number, t: Post): Post {
        throw new Error("Method not implemented.");
    }

    deleteOne(id: number): boolean {
        throw new Error("Method not implemented.");
    }
}
