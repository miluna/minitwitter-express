import { UserComment } from './Comment';
import { User } from './User';

export interface Post {
    id?: string;
    userId?: number;
    content?: string;
    timestamp?: Date;
    picture?: string;
    likes?: User[];
    comments?: UserComment[];
    error?: string;
}
