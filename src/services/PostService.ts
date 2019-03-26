import { db } from '../config/config';
import { CrudService } from './CrudService';
import { Post } from '../models/Post';

// TODO: implement service
export class PostService implements CrudService<Post> {
    
    findById(id: string): Promise<Post> {
        return new Promise(resolve => resolve());
    }    
    
    findAll(): Promise<Post[]> {
        return new Promise(resolve => resolve());
    }

    createOne(t: Post): Promise<Post> {
        return new Promise(resolve => resolve());
    }

    updateOne(id: string, t: Post): Promise<Post> {
        return new Promise(resolve => resolve());
    }

    deleteOne(id: string): Promise<boolean> {
        return new Promise(resolve => resolve());
    }
}
