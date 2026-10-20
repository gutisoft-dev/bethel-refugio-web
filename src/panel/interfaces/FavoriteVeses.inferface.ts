export interface FavoriteVersesInterfacesTs {
    next: string | null;
    previous: string | null;
    results: Verses[];
}

export interface Verses {
    reference:            string;
    normalized_reference: string;
    text:                 string;
    created_at:           string;
}
