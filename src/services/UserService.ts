import { db } from '../config/config';
import { CrudService } from './CrudService';
import { User } from '../models/User';

export class UserService implements CrudService<User> {
    
    findById(id: number): User {
        throw new Error("Method not implemented.");
    }    
    
    findAll(): User[] {
        throw new Error("Method not implemented.");
    }

    createOne(t: User): User {
        throw new Error("Method not implemented.");
    }

    updateOne(id: number, t: User): User {
        throw new Error("Method not implemented.");
    }

    deleteOne(id: number): boolean {
        throw new Error("Method not implemented.");
    }

}
