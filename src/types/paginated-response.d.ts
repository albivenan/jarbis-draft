declare namespace App.Shared {
    export type PaginatedResponse<T> = {
        data: T[];
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
        current_page: number;
        from: number;
        last_page: number;
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
}

export type PaginatedResponse<T> = App.Shared.PaginatedResponse<T>;