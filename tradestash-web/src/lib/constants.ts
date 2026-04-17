export const listingCategories = [
  "Electronics",
  "Clothing",
  "Books",
  "Furniture",
  "Games",
  "Sports",
  "Collectibles",
  "Other",
] as const;

export const listingConditions = [
  "New",
  "Like New",
  "Good",
  "Fair",
  "Well Loved",
] as const;

export const tierOrder = [
  "Scout",
  "Tracker",
  "Trader",
  "Veteran",
  "Legend",
] as const;

export const campusTargets = [
  "Howard University",
  "Morgan State University",
  "University of Maryland",
  "George Mason University",
  "Virginia Commonwealth University",
  "West Virginia University",
  "Shepherd University",
  "American University",
  "Georgetown University",
  "The Catholic University of America",
] as const;

export const leaderboardCities = [
  "Washington, DC",
  "Baltimore, MD",
  "Richmond, VA",
  "College Park, MD",
  "Fairfax, VA",
  "Morgantown, WV",
] as const;

export const premiumBoostOptions = [
  { label: "24 Hours", hours: 24, priceCopy: "$4.99" },
  { label: "48 Hours", hours: 48, priceCopy: "$7.99" },
  { label: "72 Hours", hours: 72, priceCopy: "$10.99" },
] as const;

export const themeAccents = {
  green: "#7bff48",
  orange: "#ff6a00",
  slate: "#0b0f14",
  ink: "#f6f7fb",
} as const;
