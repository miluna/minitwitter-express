export interface CrudService<T> {

    findById(id: string) : Promise<T>;

    findAll(offset?: number) : Promise<Array<T>>;

    createOne(t: T) : Promise<T>;

    updateOne(id: string, t: T) : Promise<T>;

    deleteOne(id: string) : Promise<T>;

}
