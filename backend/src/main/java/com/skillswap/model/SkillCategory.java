package com.skillswap.model;

public enum SkillCategory {
    Programming,
    Design,
    Languages,
    Music,
    Academics,
    Crafts;

    public static SkillCategory fromString(String text) {
        if (text == null) return Programming;
        for (SkillCategory c : SkillCategory.values()) {
            if (c.name().equalsIgnoreCase(text) || 
                (c == Programming && text.equalsIgnoreCase("Programmation")) ||
                (c == Academics && text.equalsIgnoreCase("Académique")) ||
                (c == Languages && text.equalsIgnoreCase("Langues")) ||
                (c == Music && text.equalsIgnoreCase("Musique")) ||
                (c == Crafts && text.equalsIgnoreCase("Artisanat"))) {
                return c;
            }
        }
        return Programming;
    }
}
