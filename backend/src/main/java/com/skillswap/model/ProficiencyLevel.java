package com.skillswap.model;

public enum ProficiencyLevel {
    Beginner,
    Intermediate,
    Advanced,
    Expert;

    public static ProficiencyLevel fromString(String text) {
        if (text == null) return Intermediate;
        for (ProficiencyLevel l : ProficiencyLevel.values()) {
            if (l.name().equalsIgnoreCase(text) ||
                (l == Beginner && text.equalsIgnoreCase("Débutant")) ||
                (l == Intermediate && text.equalsIgnoreCase("Intermédiaire")) ||
                (l == Advanced && text.equalsIgnoreCase("Avancé"))) {
                return l;
            }
        }
        return Intermediate;
    }
}
