export interface FollowerResponse {
    next:     null;
    previous: null;
    results:  Follower[];
}

export interface Follower {
    id:           string;
    username:     string;
    is_following: boolean;
    follows_me:   boolean;
    is_friend:    boolean;
}
