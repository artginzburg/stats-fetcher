interface MustappSearchUsersResponse {
  products: [];
  movies: [];
  shows: [];
  persons: [];
  /** Array of user ids (integers) */
  users: number[];
  genres: [];
}

/** Called it "incomplete" since I did not have the time and the reason to collect all of the returned data and type it. */
interface MustappUserByIdResponseIncomplete {
  /** Lists of ids (integers). */
  lists: Record<'want' | 'shows' | 'watched' | 'youtube', number[]>;

  /** Numbers with precision of 1 decimal, e.g. `657.8`. If no information is present — shows `0` */
  hours_spent: { movies: number; shows: number; youtube: number };

  bio_message: string;
  /** Usernames without additional characters like '@'. The `website` is a URL though. */
  links: {
    instagram?: string;
    telegram?: string;
    twitter?: string;
    /** A personal website URL */
    website?: string;
  };

  /** The username. Useful for checking that the search returned the right username. */
  uri: string;
  is_private: boolean;

  want_count: number;
  followers_count: number;
  following_count: number;
  rating: [
    {
      /**
       * Today's date, in a format that you would get via `(new Date()).toISOString().split('T')[0]`
       * @example '2023-03-11'
       */
      date: string;
      /** The user's place in worldwide rating.  */
      rating: number;
    },
  ];
  watched_by_type: {
    movies: number;
    /** Seems to show the count of the shows/series that the user watched or is watching. */
    shows: number;
    youtube: number;
  };
}
