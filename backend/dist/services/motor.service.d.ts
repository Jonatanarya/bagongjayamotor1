export declare class MotorService {
    getAllMotors(filters: {
        search?: string;
        status?: string;
        limit?: number;
        offset?: number;
    }): Promise<{
        motors: {
            id: string;
            merk: string;
            tipe: string;
            tahun: number;
            harga: number;
            kilometer: number | null;
            status: string | null;
            imageUrl: string | null;
            deskripsi: string | null;
            createdAt: Date | null;
            updatedAt: Date | null;
        }[];
        total: number;
    }>;
    getMotorById(id: string): Promise<{
        id: string;
        merk: string;
        tipe: string;
        tahun: number;
        harga: number;
        kilometer: number | null;
        status: string | null;
        imageUrl: string | null;
        deskripsi: string | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    }>;
    createMotor(data: any): Promise<{
        id: string;
        createdAt: Date | null;
        updatedAt: Date | null;
        status: string | null;
        merk: string;
        tipe: string;
        tahun: number;
        harga: number;
        kilometer: number | null;
        imageUrl: string | null;
        deskripsi: string | null;
    }>;
    updateMotor(id: string, data: any): Promise<{
        id: string;
        merk: string;
        tipe: string;
        tahun: number;
        harga: number;
        kilometer: number | null;
        status: string | null;
        imageUrl: string | null;
        deskripsi: string | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    }>;
    deleteMotor(id: string): Promise<void>;
    toggleStatus(id: string, status: "Tersedia" | "Terjual"): Promise<{
        id: string;
        merk: string;
        tipe: string;
        tahun: number;
        harga: number;
        kilometer: number | null;
        status: string | null;
        imageUrl: string | null;
        deskripsi: string | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    }>;
    getMotorStats(): Promise<Record<string, unknown>>;
}
export declare const motorService: MotorService;
//# sourceMappingURL=motor.service.d.ts.map