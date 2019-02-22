import { UserComment } from './Comment';
import { User } from './User';

export interface Post {
    id?: number;
    userId?: number;
    content?: string;
    timestamp?: Date;
    picture?: string;
    likes?: User[];
    comments?: UserComment[];
}
