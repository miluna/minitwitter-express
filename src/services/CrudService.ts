export interface CrudService<T> {

    findById(id: number) : T;

    findAll() : Array<T>;

    createOne(t: T) : T;

    updateOne(id: number, t: T) : T;

    deleteOne(id: number) : boolean;

}
