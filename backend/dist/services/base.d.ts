export interface IService<T, TCreate, TUpdate = Partial<TCreate>> {
    findAll(): Promise<T[]>;
    findById(id: string): Promise<T | null>;
    create(data: TCreate): Promise<T>;
    update(id: string, data: TUpdate): Promise<T | null>;
    delete(id: string): Promise<boolean>;
}
export declare function generateId(prefix: string, number: number): string;
export declare function sendResponse<T>(res: any, status: number, data: T, message?: string): any;
export declare function sendError(res: any, error: any): any;
//# sourceMappingURL=base.d.ts.map