type AuthPayload = {
    userId: string;
    email: string;
    role: string;
    exp: number;
};
export declare function createAuthToken(payload: Omit<AuthPayload, 'exp'>): string;
export declare function verifyAuthToken(token: string | undefined | null): AuthPayload | null;
export declare function getAuthUserFromToken(token: string | undefined | null): Promise<{
    id: string;
    email: string;
    name: string;
    role: string | null;
} | null>;
export {};
//# sourceMappingURL=auth.d.ts.map