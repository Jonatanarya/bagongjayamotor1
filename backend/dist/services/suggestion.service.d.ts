export declare class SuggestionService {
    createSuggestion(data: {
        customerName?: string;
        message: string;
        email?: string;
    }): Promise<{
        id: string;
        email: string | null;
        createdAt: Date | null;
        customerName: string | null;
        message: string;
        status: string | null;
    }>;
    getAllSuggestions(): Promise<{
        id: string;
        customerName: string | null;
        message: string;
        email: string | null;
        status: string | null;
        createdAt: Date | null;
    }[]>;
}
export declare const suggestionService: SuggestionService;
//# sourceMappingURL=suggestion.service.d.ts.map