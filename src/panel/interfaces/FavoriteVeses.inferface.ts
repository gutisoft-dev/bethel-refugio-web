export interface FavoriteVersesInterfacesTs {
    next:     null;
    previous: null;
    results:  Verses[];
}

export interface Verses {
    reference:            string;
    normalized_reference: string;
    text:                 string;
    created_at:           Date;
}
