import { UserComment } from './Comment';
import { User } from './User';

export interface Post {
    id?: string;
    userId?: string;
    content?: string;
    timestamp?: Date;
    picture?: string;
    likes?: User[];
    comments?: UserComment[];
    error?: string;
}
